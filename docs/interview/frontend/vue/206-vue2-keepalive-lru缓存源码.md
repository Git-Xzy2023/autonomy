---
title: "Vue2 keep-alive LRU 缓存源码"
---

# Vue2 keep-alive LRU 缓存源码

## 为什么需要 keep-alive

组件切换时默认会销毁旧组件、创建新组件。但有些组件（如列表页 → 详情页 → 列表页）希望保留状态（滚动位置、表单输入、已加载数据），避免重新请求和渲染。`keep-alive` 把组件实例缓存起来，再次进入时复用，不重新创建。

## 用法

```html
<keep-alive :include="['UserList', 'UserDetail']" :exclude="['Login']" :max="10">
  <router-view />
</keep-alive>
```

- `include`/`exclude`：字符串、正则或数组，匹配组件 name
- `max`：最大缓存数，超过时用 LRU 淘汰最久未访问的

## 源码解析

```js
// src/core/components/keep-alive.js
export default {
  name: 'keep-alive',
  abstract: true, // 抽象组件：不渲染真实 DOM，不出现在组件链

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  created() {
    this.cache = Object.create(null); // key → vnode
    this.keys = [];                   // 缓存 key 列表（按访问时间排序）
  },

  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name));
    });
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name));
    });
  },

  render() {
    const slot = this.$slots.default;
    const vnode = getFirstComponentChild(slot);
    const componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      const name = getComponentName(componentOptions);
      const { include, exclude } = this;
      // 不匹配 include 或匹配 exclude：直接返回，不缓存
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode;
      }

      const { cache, keys } = this;
      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key;

      if (cache[key]) {
        // 命中缓存：复用实例
        vnode.componentInstance = cache[key].componentInstance;
        // LRU：把命中的 key 移到末尾（最近使用）
        remove(keys, key);
        keys.push(key);
      } else {
        // 未命中：缓存
        cache[key] = vnode;
        keys.push(key);
        // 超过 max：淘汰最久未使用（keys[0]）
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true; // 标记为 keep-alive，patch 时不会 mount
    }
    return vnode || (slot && slot[0]);
  }
};

function pruneCacheEntry(cache, key, keys, current) {
  const cached = cache[key];
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy(); // 销毁组件实例
  }
  delete cache[key];
  remove(keys, key);
}

function pruneCache(keepAliveInstance, filter) {
  for (const key in keepAliveInstance.cache) {
    const cachedNode = keepAliveInstance.cache[key];
    const name = getComponentName(cachedNode.componentOptions);
    if (name && !filter(name)) {
      pruneCacheEntry(keepAliveInstance.cache, key, keepAliveInstance.keys);
    }
  }
}
```

## LRU（最近最少使用）算法

`keys` 数组维护访问顺序：**末尾是最近访问，头部是最久未访问**。

```
缓存未命中：push 到末尾
  keys: [A, B, C] → [A, B, C, D]

缓存命中：从原位置移除，push 到末尾
  keys: [A, B, C] 命中 B → [A, C, B]

超过 max：移除头部（最久未使用）
  keys: [A, B, C, D] max=3 → 移除 A → [B, C, D]
```

## 生命周期钩子

keep-alive 缓存的组件有额外钩子：

- `activated`：被 keep-alive 缓存的组件激活时调用（首次 mount 也会触发）
- `deactivated`：被 keep-alive 缓存的组件停用时调用

**原理：** patch 时如果发现 `vnode.data.keepAlive`，不走 `createComponent`，而是走 `reactivateComponent`，触发 `activated` 钩子。销毁时也不真正 `$destroy`，而是触发 `deactivated`。

## abstract: true 的作用

`abstract: true` 让 keep-alive 在组件关系链中"透明"：`this.$parent` 指向的是 keep-alive 的父组件，而不是 keep-alive 本身。这样子组件的 `inject`、`provide` 链路不会被 keep-alive 打断。

## 弊端

1. **内存占用**：缓存的组件实例不释放，max 设置不当会内存泄漏。
2. **状态污染**：复用实例意味着 `data` 不重置，进入时需手动重置（在 `activated` 里）。
3. **include/exclude 基于组件 name**：匿名组件无法匹配，依赖 `name` 选项。

## Vue3 的变化

Vue3 的 keep-alive 原理类似（仍是 LRU + abstract），但：

- 用 Composition API 重写，`setup` 返回渲染函数。
- 缓存 key 改为 `vnode.type`（组件对象本身），不再依赖 `Ctor.cid`。
- 钩子通过 `onActivated` / `onDeactivated` 注册。
