---
title: "Vue3 Teleport 原理"
---

# Vue3 Teleport 原理

## 为什么需要 Teleport

组件的 DOM 结构通常和组件树一致（父子组件的 DOM 也是嵌套的）。但有些 UI 元素需要"脱离"父组件的 DOM 层级：

- **Modal/Dialog**：需要覆盖全屏，但父组件有 `overflow: hidden` / `transform`，导致 modal 被裁剪。
- **Tooltip**：需要相对于 viewport 定位，但父组件有 `position: relative` 干扰。
- **Notification**：需要堆叠在屏幕角落，不受业务组件层级影响。

传统方案是手动 `document.body.appendChild(el)`，但破坏了组件的响应式和生命周期管理。`Teleport` 让组件**逻辑上属于父组件，DOM 上挂到任意位置**。

## 用法

```vue
<template>
  <button @click="open = true">打开</button>

  <Teleport to="body">
    <div v-if="open" class="modal">
      <h2>标题</h2>
      <p>内容</p>
      <button @click="open = false">关闭</button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>
```

**`to` 属性：** CSS 选择器或 DOM 元素，指定挂载目标。

```vue
<Teleport to="#modal-root">
<Teleport to=".modals">
<Teleport :to="targetEl">
```

**`disabled` 属性：** 禁用 teleport，内容回到原位置。

```vue
<Teleport to="body" :disabled="isMobile">
  <!-- 移动端不 teleport，PC 端 teleport -->
</Teleport>
```

## 原理

### 1. 编译

`<Teleport>` 编译成 `createVNode(TeleportImpl, { to, disabled }, children)`：

```js
// 编译前
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>

// 编译后
createVNode(TeleportImpl, { to: 'body' }, {
  default: () => [createVNode('div', { class: 'modal' }, ...)]
})
```

### 2. TeleportImpl 的实现

```js
// packages/runtime-core/src/components/Teleport.ts
export const TeleportImpl = {
  name: 'Teleport',
  __isTeleport: true,

  process(n1, n2, container, anchor, parentComponent, suspense, isSVG, optimized) {
    const { mountChildren, patchChildren, move, unmount } = parentComponent.appContext;

    if (n1 == null) {
      // 首次挂载
      const target = resolveTarget(n2.props.to); // 找到目标 DOM
      const mount = (container, anchor) => {
        mountChildren(n2.children, container, anchor, parentComponent, suspense, isSVG, optimized);
      };

      if (n2.props.disabled) {
        // disabled：挂载到原位置
        mount(container, anchor);
      } else {
        // 正常：挂载到 target
        mount(target, null);
        n2.target = target;
      }
    } else {
      // 更新
      // 处理 to 变化：move children 到新 target
      // 处理 disabled 变化：在原位置和 target 之间切换
      patchChildren(n1, n2, /* ... */);
    }
  },

  remove(vnode, parentComponent, optimized) {
    const { unmount } = parentComponent.appContext;
    if (vnode.props.disabled) {
      unmount(vnode.children, parentComponent, optimized);
    } else {
      // 从 target 移除
      unmount(vnode.children, parentComponent, optimized, true);
      // 如果 target 是 Teleport 创建的，移除 target
    }
  }
};

function resolveTarget(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }
  return target;
}
```

### 3. 关键设计

**逻辑归属不变：** Teleport 内的组件**逻辑上仍属于父组件**：

- props/emits 正常工作。
- provide/inject 正常穿透。
- 事件冒泡按组件树（不是 DOM 树）。
- 生命周期正常触发。

**DOM 归属改变：** 渲染的 DOM 挂到 `target`，但 VNode 树结构不变，diff 仍按组件树进行。

## 与原生 appendChild 的区别

```js
// 原生方案
mounted() {
  document.body.appendChild(this.$el);
}
beforeDestroy() {
  document.body.removeChild(this.$el); // 容易忘记
}
```

**问题：**

1. 手动管理 DOM，容易忘记清理。
2. 响应式失效：DOM 移走后，Vue 不知道它在哪，更新可能出问题。
3. 事件冒泡错乱：DOM 移到 body，事件不按组件树冒泡。
4. 生命周期混乱：组件销毁时 DOM 没清理。

**Teleport 的优势：**

1. 自动管理：挂载/卸载由 Vue 处理。
2. 响应式正常：VNode 树不变，diff 正常。
3. 事件正常：按组件树冒泡。
4. 生命周期正常：组件销毁时 DOM 自动清理。

## 实战：Modal 组件

```vue
<!-- Modal.vue -->
<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="modal-mask" @click.self="close">
        <div class="modal-content">
          <slot />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue']);
const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}
.modal-content {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
</style>
```

**关键：** 即使父组件有 `overflow: hidden` 或 `transform`，modal 也能正常显示，因为它在 `body` 下。

## 多个 Teleport 挂同一目标

```vue
<Teleport to="body">
  <div>A</div>
</Teleport>
<Teleport to="body">
  <div>B</div>
</Teleport>
```

按顺序追加到 body：`<body><div>A</div><div>B</div></body>`。

## SSR 支持

Teleport 在 SSR 下会把内容渲染到指定目标的占位符：

```html
<!-- 服务端输出 -->
<div id="modal-root">
  <!--teleport start-->
  <div class="modal">...</div>
  <!--teleport end-->
</div>
```

客户端 hydration 时，Teleport 内容会移动到正确位置。

## 总结

- **Teleport**：组件逻辑归属不变，DOM 挂到任意位置。
- **原理**：编译成 `TeleportImpl` VNode，patch 时挂载到 target。
- **优势**：自动管理、响应式正常、事件正常、生命周期正常。
- **场景**：Modal、Tooltip、Notification 等需要脱离父级 DOM 的 UI。
- **对比原生**：解决了手动 DOM 操作的清理、响应式、事件、生命周期问题。
