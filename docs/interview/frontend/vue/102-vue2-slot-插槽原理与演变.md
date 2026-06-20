---
title: "Vue2 slot 插槽原理与演变"
---

# Vue2 slot 插槽原理与演变

## 为什么会有这个功能

组件的复用性受限于"内容固定"。插槽让父组件能向子组件"注入"任意内容，实现"组件结构由父组件决定，子组件只负责位置和上下文"。这是组件库（UI 库）能灵活组合的关键基础。

## 用法与演变

**1. 默认插槽（Vue2.0）**

```html
<!-- 子组件 -->
<div class="card"><slot></slot></div>

<!-- 父组件 -->
<Card>这是内容</Card>
```

**2. 具名插槽（Vue2.0）**

```html
<!-- 子组件 -->
<div>
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</div>

<!-- 父组件（Vue2.6+ 新语法） -->
<template #header>标题</template>
默认内容
<template #footer>底部</template>
```

**3. 作用域插槽（Vue2.1+）**

子组件把数据传给父组件，让父组件根据子组件数据渲染内容：

```html
<!-- 子组件 -->
<slot :item="item" :index="index"></slot>

<!-- 父组件（Vue2.6+） -->
<template #default="{ item, index }">
  <li>{{ index }} - {{ item }}</li>
</template>
```

## 原理

**编译阶段：**

`<slot>` 在子组件模板里被编译成**渲染函数中的 `_t(name)` 调用**（`renderSlot`）。父组件传入的内容被编译成**返回 VNode 的函数**，挂载到子组件实例的 `$scopedSlots` / `$slots` 上。

```js
// 子组件 render 函数（简化）
_c('div', [_t('header'), _t('default')], 2)

// 父组件编译结果（作用域插槽）
{ scopedSlots: _u([
  {
    key: "default",
    fn: function({ item, index }) {
      return [_c('li', [_v(_s(index) + ' - ' + _s(item))])];
    }
  }
]) }
```

**运行时：**

- 子组件 render 时调用 `_t('name', fallbackContent, props)`，从 `$scopedSlots[name]` 取出函数并执行，传入插槽 props。
- 默认插槽在 Vue2.6 之前是 `$slots`（VNode 数组），2.6 之后统一收敛到 `$scopedSlots`（函数形式）。

## 弊端与 Vue3 的改进

**Vue2 的问题：**

1. **新旧两套语法并存**：2.5 之前用 `slot="name"` + `slot-scope="props"`（属性形式），2.6 引入 `v-slot` / `#name`（指令形式），迁移期混乱。
2. **`$slots` 和 `$scopedSlots` 两套机制**，使用时容易混淆。
3. **作用域插槽性能开销**：每次渲染都要执行插槽函数，无法做静态优化。

**Vue3 的改进：**

- 统一为 `v-slot` / `#name` 一套语法，移除 `slot` / `slot-scope` 属性。
- `$slots` 和 `$scopedSlots` 合并为统一的 `$slots`（都是函数）。
- 编译器对插槽内容做静态提升，未使用插槽 props 的部分不会重复创建。
