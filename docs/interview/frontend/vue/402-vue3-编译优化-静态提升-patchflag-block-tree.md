---
title: "Vue3 编译优化：静态提升 / PatchFlag / Block Tree"
---

# Vue3 编译优化：静态提升 / PatchFlag / Block Tree

## Vue3 编译优化的目标

Vue2 的 patch 是**全量 diff**：新旧 VNode 树逐层比较，即使大部分节点是静态的也要遍历。Vue3 的编译器通过三种优化，让 diff 只关注**动态节点**：

1. **静态提升（Static Hoisting）**：静态节点提到 render 外，避免重复创建。
2. **PatchFlag**：标记动态节点的动态部分，diff 时只比较标记部分。
3. **Block Tree**：收集动态节点到根节点，diff 时跳过所有静态节点。

## 1. 静态提升

### 静态节点提升

```html
<!-- 模板 -->
<div>
  <h1>标题</h1>
  <p>{{ msg }}</p>
</div>
```

```js
// Vue2 编译
function render() {
  return _c('div', [
    _c('h1', [_v('标题')]), // 每次 render 都重新创建 VNode
    _c('p', [_v(_s(msg))])
  ]);
}

// Vue3 编译
const _hoisted_1 = createElementVNode('h1', null, '标题'); // 提升到模块作用域

function render(_ctx, _cache) {
  return createElementVNode('div', null, [
    _hoisted_1, // 直接引用，不重新创建
    createElementVNode('p', null, toDisplayString(_ctx.msg), 1)
  ]);
}
```

**优势：**

1. 每次 render 直接引用 `_hoisted_1`，不重新创建 VNode。
2. 多次 render 复用同一个 VNode 对象。
3. 可被 Tree Shaking（如果整个组件不使用）。

### 静态属性提升

```html
<div id="x" class="static" :class="dynamic">{{ msg }}</div>
```

```js
const _hoisted_1 = { id: 'x', class: 'static' }; // 静态属性提升

function render(_ctx, _cache) {
  return createElementVNode('div', _hoisted_1, toDisplayString(_ctx.msg), 1 /* TEXT */);
}
```

静态属性（`id`、`class="static"`）提到外面，动态属性（`:class`）单独处理。

### 静态事件缓存

```html
<button @click="onClick">点击</button>
```

```js
// Vue3.4+ 缓存事件处理函数
function render(_ctx, _cache) {
  return createElementVNode('button', {
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick(...args))
  }, '点击');
}
```

**优势：** 每次 render 复用同一个函数引用，避免子组件因 props.onClick 变化而不必要更新。

## 2. PatchFlag

每个动态 VNode 标记"哪些部分是动态的"，diff 时只比较标记部分：

```js
// PatchFlag 枚举
export const PatchFlags = {
  TEXT: 1,          // 动态文本
  CLASS: 2,         // 动态 class
  STYLE: 4,         // 动态 style
  PROPS: 8,         // 动态 props（非 class/style）
  FULL_PROPS: 16,   // 完整 props（key 可能变化）
  HYDRATE_EVENTS: 32,
  STABLE_FRAGMENT: 64,
  KEYED_FRAGMENT: 128,
  UNKEYED_FRAGMENT: 256,
  NEED_PATCH: 512,
  DYNAMIC_SLOTS: 1024,
  HOISTED: -1,      // 静态节点（提升）
  BAIL: -2          // 退出优化模式
};
```

### 编译示例

```html
<div>
  <h1>标题</h1>
  <p :class="cls">{{ msg }}</p>
  <span :style="style" @click="onClick">点击</span>
</div>
```

```js
function render(_ctx, _cache) {
  return createElementVNode('div', null, [
    _hoisted_1, // h1，PatchFlag = -1（HOISTED）
    createElementVNode('p', { class: _ctx.cls }, toDisplayString(_ctx.msg), 3 /* TEXT | CLASS */),
    createElementVNode('span', { style: _ctx.style, onClick: _cache[0] || ... }, '点击', 4 /* STYLE */)
  ]);
}
```

### diff 时的优化

```js
function patchElement(n1, n2) {
  const el = (n2.el = n1.el);
  const oldProps = n1.props || {};
  const newProps = n2.props || {};

  const patchFlag = n2.patchFlag;

  if (patchFlag > 0) {
    // 有 PatchFlag：只比较标记的部分
    if (patchFlag & PatchFlags.CLASS) {
      if (oldProps.class !== newProps.class) {
        hostPatchProp(el, 'class', newProps.class);
      }
    }
    if (patchFlag & PatchFlags.STYLE) {
      patchStyle(el, oldProps.style, newProps.style);
    }
    if (patchFlag & PatchFlags.TEXT) {
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
    // ... 其他 flag
  } else if (patchFlag === 0) {
    // 无 flag：全量比较 props
    patchProps(el, oldProps, newProps);
  }
}
```

**效果：** `<p :class="cls">` 只比较 class，不比较其他 props；`<span :style>` 只比较 style。大幅减少 diff 工作量。

## 3. Block Tree

### 问题

即使有 PatchFlag，patch 仍要遍历所有子节点（包括静态节点）来找到动态节点：

```js
function patchChildren(n1, n2) {
  // 遍历所有子节点，包括静态的
  for (let i = 0; i < n2.children.length; i++) {
    patch(n1.children[i], n2.children[i]);
  }
}
```

如果模板有 100 个静态节点 + 1 个动态节点，仍要遍历 101 次。

### Block 的概念

**Block 是一个特殊的 VNode，维护一个 `dynamicChildren` 数组，只存动态子节点。**

```js
function createElementBlock() {
  const vnode = createElementVNode(...);
  vnode.dynamicChildren = []; // 收集动态子节点
  return vnode;
}
```

### 编译器生成 Block

```html
<div>
  <h1>标题</h1>
  <p>{{ msg }}</p>
  <span>静态</span>
</div>
```

```js
function render(_ctx, _cache) {
  // openBlock：开启动态节点收集
  return (openBlock(), createElementBlock('div', null, [
    _hoisted_1, // h1，静态
    createElementVNode('p', null, toDisplayString(_ctx.msg), 1 /* TEXT */), // 动态
    _hoisted_2  // span，静态
  ]));
}
```

**`openBlock()`** 设置一个全局变量 `currentBlock = []`，创建动态 VNode 时会把自己 push 到 `currentBlock`。

**`createElementBlock`** 创建 VNode 后，把 `currentBlock` 赋值给 `vnode.dynamicChildren`。

### patch 时的优化

```js
function patchElement(n1, n2) {
  if (n2.dynamicChildren) {
    // Block：只 patch 动态子节点，跳过静态
    patchBlockChildren(n1, n2);
  } else {
    // 非 Block：全量 patch
    patchChildren(n1, n2);
  }
}

function patchBlockChildren(n1, n2) {
  for (let i = 0; i < n2.dynamicChildren.length; i++) {
    patch(n1.dynamicChildren[i], n2.dynamicChildren[i]);
  }
}
```

**效果：** 100 静态 + 1 动态，只 patch 1 次（动态节点），跳过 100 个静态节点。

### Block 的层级

```html
<div>
  <header>
    <h1>{{ title }}</h1>
  </header>
  <main>
    <p>{{ content }}</p>
  </main>
</div>
```

```js
return (openBlock(), createElementBlock('div', null, [
  createElementVNode('header', null, [
    createElementVNode('h1', null, toDisplayString(_ctx.title), 1)
  ]),
  createElementVNode('main', null, [
    createElementVNode('p', null, toDisplayString(_ctx.content), 1)
  ])
]));
```

**问题：** header 和 main 不是动态节点（没有动态绑定），但它们的子节点 h1 和 p 是动态的。Block 只收集直接动态子节点，h1 和 p 不会被收集到 div 的 dynamicChildren。

**解决：** v-if/v-for 等结构指令会创建**嵌套 Block**：

```html
<div>
  <div v-if="show">...</div>
</div>
```

```js
return (openBlock(), createElementBlock('div', null, [
  _ctx.show
    ? (openBlock(), createElementBlock('div', null, [...]))
    : createCommentVNode('v-if', true)
]));
```

内层 Block 会作为动态节点被外层 Block 收集。

## 三种优化的协同

```
模板
  ↓ 编译
带 PatchFlag 的 VNode + 静态提升 + Block 收集动态节点
  ↓ patch
只遍历 dynamicChildren（Block），只比较 PatchFlag 标记部分
```

**对比 Vue2：**

| 维度       | Vue2                | Vue3                       |
| ---------- | ------------------- | -------------------------- |
| 静态节点   | 每次创建 VNode      | 提升到模块作用域，复用     |
| diff 范围  | 全量遍历所有子节点  | 只遍历 dynamicChildren     |
| diff 粒度  | 全量比较 props      | 只比较 PatchFlag 标记部分  |
| 事件处理   | 每次 render 新建    | 缓存，复用引用             |

## 总结

- **静态提升**：静态节点和属性提到 render 外，避免重复创建。
- **PatchFlag**：标记动态部分，diff 时只比较标记部分。
- **Block Tree**：收集动态节点到根，diff 时跳过静态节点。
- **协同**：三者结合，让 Vue3 的 diff 从"全量遍历"变成"只处理动态部分"，性能大幅提升。

这是 Vue3 相比 Vue2 最重要的性能改进，也是 Vue3 编译器的核心创新。
