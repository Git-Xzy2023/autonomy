---
title: "Vue3 KeepAlive 原理与缓存策略"
---

# Vue3 KeepAlive 原理与缓存策略

## Vue3 KeepAlive 的改进

Vue3 的 KeepAlive 用 Composition API 重写，原理与 Vue2 类似（LRU 缓存 + abstract），但：

- 缓存 key 改为 `vnode.type`（组件对象本身），不再依赖 `Ctor.cid`。
- 钩子通过 `onActivated` / `onDeactivated` 注册。
- 与 Teleport/Suspense 等新特性兼容。

## 用法

```vue
<template>
  <KeepAlive :include="['UserList', 'UserDetail']" :exclude="['Login']" :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>

<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  console.log('组件激活');
});

onDeactivated(() => {
  console.log('组件停用');
});
</script>
```

## 源码解析

```js
// packages/runtime-core/src/components/KeepAlive.ts
const KeepAliveImpl = {
  name: 'KeepAlive',
  __isKeepAlive: true,
  abstract: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const sharedContext = instance.ctx;

    const cache = new Map();      // key → vnode
    const keys = new Set();       // 缓存 key 集合（按访问顺序）
    let current = null;

    // 卸载组件（从缓存移除）
    function pruneCacheEntry(key) {
      const cached = cache.get(key);
      if (cached && (!current || cached.type !== current.type)) {
        unmount(cached); // 真正销毁组件实例
      }
      cache.delete(key);
      keys.delete(key);
    }

    // 监听 include/exclude 变化，清理不匹配的缓存
    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache(filter => matches(include, filter));
        exclude && pruneCache(filter => !matches(exclude, filter));
      },
      { flush: 'post', deep: true }
    );

    // 钩子：组件激活/停用时调用
    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance = vnode.component;
      move(vnode, container, anchor);
      // 触发 onActivated
      queuePostFlushCb(() => {
        instance.isDeactivated = false;
        if (instance.a) invokeArrayFns(instance.a); // activated hooks
      });
    };

    sharedContext.deactivate = (vnode) => {
      const instance = vnode.component;
      move(vnode, storageContainer, null); // 移到隐藏容器
      // 触发 onDeactivated
      queuePostFlushCb(() => {
        if (instance.da) invokeArrayFns(instance.da); // deactivated hooks
        instance.isDeactivated = true;
      });
    };

    onBeforeUnmount(() => {
      cache.forEach(cached => {
        unmount(cached); // 卸载所有缓存
      });
      cache.clear();
      keys.clear();
    });

    return () => {
      const children = slots.default();
      const rawVNode = children[0];
      if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & ShapeFlags.COMPONENT)) {
        current = null;
        return rawVNode;
      }

      const comp = rawVNode.type;
      const name = getComponentName(comp);

      const { include, exclude, max } = props;

      // 不匹配 include 或匹配 exclude：不缓存
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        current = rawVNode;
        return rawVNode;
      }

      const key = rawVNode.key == null ? comp : rawVNode.key;
      const cachedVNode = cache.get(key);

      if (cachedVNode) {
        // 命中缓存：复用组件实例
        rawVNode.el = cachedVNode.el;
        rawVNode.component = cachedVNode.component;

        // LRU：移到末尾（最近使用）
        if (cachedVNode.key) {
          keys.delete(cachedVNode.key);
          keys.add(cachedVNode.key);
        }
      } else {
        // 未命中：缓存
        keys.add(key);
        cache.set(key, rawVNode);

        // 超过 max：淘汰最久未使用（keys 的第一个）
        if (max && keys.size > parseInt(max)) {
          const oldestKey = keys.values().next().value;
          pruneCacheEntry(oldestKey);
        }
      }

      rawVNode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
      current = rawVNode;
      return rawVNode;
    };
  }
};
```

## LRU 缓存策略

Vue3 用 `Set` 维护访问顺序（Set 的迭代顺序是插入顺序）：

```
未命中：add 到末尾
  keys: {A, B, C} → {A, B, C, D}

命中：delete 后 add（移到末尾）
  keys: {A, B, C} 命中 B → delete B → add B → {A, C, B}

超过 max：删除第一个（最久未使用）
  keys: {A, B, C, D} max=3 → 删除 A → {B, C, D}
```

**对比 Vue2：** Vue2 用数组，操作是 O(n)；Vue3 用 Set，操作是 O(1)。

## 组件的"假卸载"

KeepAlive 缓存的组件**不会真正销毁**，而是被"移动"到一个隐藏的存储容器：

```js
// 卸载时：移到隐藏容器（不是真正销毁）
sharedContext.deactivate = (vnode) => {
  move(vnode, storageContainer, null); // 移到 storageContainer
  instance.isDeactivated = true;
  // 触发 onDeactivated
};

// 激活时：从隐藏容器移回原位置
sharedContext.activate = (vnode, container, anchor) => {
  move(vnode, container, anchor); // 移回
  instance.isDeactivated = false;
  // 触发 onActivated
};
```

**storageContainer** 是一个不在文档树中的 DOM 节点（类似 `document.createDocumentFragment()`），缓存的组件 DOM 暂存于此。

## onActivated / onDeactivated 的注册

```js
// packages/runtime-core/src/apiLifecycle.ts
export function onActivated(hook, target) {
  registerKeepAliveHook(hook, 'a', target); // 'a' = activated
}

export function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, 'da', target); // 'da' = deactivated
}

function registerKeepAliveHook(hook, type, target) {
  const instance = target || currentInstance;
  if (instance) {
    const wrappedHook = () => {
      if (instance.isDeactivated) return; // 已停用不触发
      hook();
    };
    if (!instance[type]) {
      instance[type] = [];
    }
    instance[type].push(wrappedHook);
  }
}
```

**触发时机：**

- `onActivated`：组件从缓存恢复显示时触发（首次 mount 也会触发）。
- `onDeactivated`：组件被移到缓存时触发（不是真正销毁）。

## 与 Vue2 的对比

| 维度       | Vue2 KeepAlive              | Vue3 KeepAlive              |
| ---------- | --------------------------- | --------------------------- |
| 实现       | Options API                 | Composition API             |
| 缓存 key   | `Ctor.cid + tag`            | `vnode.type`（组件对象）    |
| 缓存结构   | 对象 + 数组                 | Map + Set                   |
| LRU 操作   | O(n)（数组）                | O(1)（Set）                 |
| 钩子       | `activated`/`deactivated`   | `onActivated`/`onDeactivated` |
| 隐藏容器   | `document.body`             | 专用 storageContainer       |
| 与 Teleport/Suspense | 不兼容             | 兼容                        |

## 实战：列表页缓存

```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" />
    </KeepAlive>
  </router-view>
</template>

<script setup>
import { ref } from 'vue';

const cachedViews = ref(['UserList', 'OrderList']); // 只缓存这两个

// 动态添加缓存
function addCache(name) {
  if (!cachedViews.value.includes(name)) {
    cachedViews.value.push(name);
  }
}
</script>

<!-- UserList.vue -->
<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  // 从详情页返回时，恢复滚动位置
  window.scrollTo(0, savedScrollTop);
});

onDeactivated(() => {
  // 离开时保存滚动位置
  savedScrollTop = window.scrollY;
});
</script>
```

## 注意事项

1. **内存管理**：max 设置不当会内存泄漏，建议根据业务设置（如 10-20）。
2. **状态重置**：复用实例意味着 data 不重置，进入时需在 `onActivated` 手动重置。
3. **include/exclude 基于组件 name**：匿名组件无法匹配，需在组件里 `defineOptions({ name: 'xxx' })`。
4. **与 v-if 的冲突**：`v-if` 会销毁组件，KeepAlive 无法缓存被 v-if 销毁的组件。

## 总结

- **KeepAlive**：缓存组件实例，避免重复创建和销毁。
- **LRU 策略**：用 Set 维护访问顺序，超 max 时淘汰最久未使用。
- **假卸载**：组件移到隐藏容器，不真正销毁，触发 `onDeactivated`。
- **激活**：从隐藏容器移回，触发 `onActivated`。
- **Vue3 改进**：Composition API、Map+Set（O(1)）、与 Teleport/Suspense 兼容。

KeepAlive 是提升用户体验（保留状态、避免重复请求）的重要手段，Vue3 的实现更高效、更现代。
