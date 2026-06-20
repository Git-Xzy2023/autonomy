---
title: "Vue3 Fragment 原理与多根节点"
---

# Vue3 Fragment 原理与多根节点

## 为什么需要 Fragment

Vue2 的模板**必须有且只有一个根节点**：

```html
<!-- Vue2 ✅ -->
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>

<!-- Vue2 ❌ -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>
```

**为什么 Vue2 有这个限制：** Vue2 的 VNode 是单根树，`render` 函数返回一个 VNode，patch 时按单根比较。多根节点无法表达。

**痛点：**

1. 多余的包裹 div，破坏语义（如 `<ul>` 里不能直接套 `<div>`，但组件返回多个 `<li>` 又不行）。
2. CSS 选择器层级变深（`.parent > .wrapper > .child`）。
3. Flex/Grid 布局被包裹 div 干扰。

Vue3 的 Fragment 允许模板有多个根节点，解决这些问题。

## 用法

```vue
<!-- Vue3 ✅ -->
<template>
  <header>标题</header>
  <main>内容</main>
  <footer>底部</footer>
</template>
```

编译后返回一个 Fragment VNode，包含多个子节点。

## 原理

### 1. Fragment VNode

Vue3 引入 `Fragment` 符号作为特殊 VNode 类型：

```js
// packages/runtime-core/src/vnode.ts
export const Fragment = Symbol('Fragment');

export function createVNode(type, props, children) {
  const vnode = {
    type,         // Fragment 时 type 是 Symbol
    props,
    children,
    el: null,     // Fragment 没有真实 DOM
    // ...
  };
  return vnode;
}
```

**Fragment 的 `el` 是 null**（它不对应真实 DOM），子节点的 DOM 直接挂到父容器。

### 2. patch 处理 Fragment

```js
// packages/runtime-core/src/renderer.ts
const patch = (n1, n2, container, anchor) => {
  const { type } = n2;

  switch (type) {
    case Fragment:
      processFragment(n1, n2, container, anchor);
      break;
    // ...
  }
};

function processFragment(n1, n2, container, anchor) {
  const fragmentStartAnchor = (n2.el = n1 ? n1.el : hostCreateText(''));
  const fragmentEndAnchor = (n2.anchor = n1 ? n1.anchor : hostCreateText(''));

  if (n1 == null) {
    // 挂载：插入起止锚点，挂载子节点
    hostInsert(fragmentStartAnchor, container, anchor);
    hostInsert(fragmentEndAnchor, container, anchor);
    mountChildren(n2.children, container, fragmentEndAnchor);
  } else {
    // 更新：diff 子节点
    patchChildren(n1, n2, container, fragmentEndAnchor);
  }
}
```

**关键：** Fragment 用**两个空文本节点**作为起止锚点，子节点插在锚点之间。这样 Fragment 在父容器里有明确的位置，移动 Fragment 时移动锚点即可。

### 3. 编译器的处理

```vue
<!-- 模板 -->
<template>
  <header>标题</header>
  <main>内容</main>
</template>

<!-- 编译后 -->
function render() {
  return createVNode(Fragment, null, [
    createVNode('header', null, '标题'),
    createVNode('main', null, '内容')
  ]);
}
```

编译器检测到模板有多个根节点，自动用 `Fragment` 包裹。

## Attribute 继承问题

Vue2 单根节点时，父组件传入的 attrs（class/style/事件）自动继承到根节点。多根节点时，Vue3 **不知道继承到哪个节点**，会警告：

```vue
<!-- 子组件 -->
<template>
  <header>...</header>
  <main>...</main>
</template>

<!-- 父组件 -->
<Child class="custom" @click="handler" />
<!-- 警告：Component has multiple root nodes, cannot inherit attrs -->
```

**解决方案：** 用 `$attrs` 显式绑定到某个节点：

```vue
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main> <!-- attrs 绑定到 main -->
</template>
```

或用 `inheritAttrs: false` + `useAttrs()`：

```vue
<script setup>
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();
</script>

<template>
  <header>...</header>
  <main :class="attrs.class" @click="attrs.onClick">...</main>
</template>
```

## Fragment 与 key

Fragment 本身不能有 key（它是虚拟节点），但子节点可以有 key：

```vue
<template>
  <Fragment v-for="item in list" :key="item.id">
    <dt>{{ item.term }}</dt>
    <dd>{{ item.desc }}</dd>
  </Fragment>
</template>
```

这样每个 Fragment 块（dt + dd）作为一个整体复用，避免 dt 和 dd 分开 diff 导致错乱。

## Fragment 的性能

Fragment 比包裹 div 更高效：

1. **少一层 DOM**：没有多余的 div，DOM 树更小。
2. **样式不受干扰**：不会因为包裹 div 影响 flex/grid 布局。
3. **语义正确**：`<ul>` 可以直接包含多个 `<li>` 组件返回的 `<li>`。

## 与 React Fragment 的对比

| 维度       | Vue3 Fragment              | React Fragment             |
| ---------- | -------------------------- | -------------------------- |
| 语法       | 自动（多根模板）           | `<Fragment>` 或 `<>...</>` |
| 显式使用   | 不需要（编译器自动）       | 需要显式写                 |
| key 支持   | 子节点支持                 | Fragment 支持 key          |
| 锚点       | 空文本节点                 | 不需要（React 用 fiber）   |

**Vue 的优势：** 编译器自动处理，开发者无需关心；React 需要手动写 `<>...</>`。

## 总结

- **Fragment**：允许模板多根节点，解决 Vue2 的单根限制。
- **原理**：用 Symbol 标记的虚拟 VNode，子节点直接挂父容器，用空文本节点做锚点。
- **优势**：少一层 DOM、样式不受干扰、语义正确。
- **注意**：多根节点时 attrs 需显式绑定（`v-bind="$attrs"`）。
- **对比 Vue2**：解决了多余包裹 div 的语义、样式、性能问题。
