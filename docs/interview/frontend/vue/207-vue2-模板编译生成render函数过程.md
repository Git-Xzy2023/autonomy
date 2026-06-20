---
title: "Vue2 模板编译生成 render 函数过程"
---

# Vue2 模板编译生成 render 函数过程

## 为什么需要编译

Vue 模板（`<template>`）是声明式的 HTML 语法，但 Vue 运行时只认 render 函数（返回 VNode）。编译器把模板字符串转成 render 函数字符串，让运行时能直接执行。这一步可以在构建时做（vue-loader），也可以在运行时做（带编译器的 vue.js）。

## 三阶段流程

```
template 字符串
    ↓ 1. parse（解析）
AST（抽象语法树）
    ↓ 2. optimize（优化）
优化后的 AST（标记 static）
    ↓ 3. generate（生成）
render 函数字符串 + staticRenderFns
```

## 1. parse —— 解析成 AST

用正则 + 状态机把模板字符串解析成 AST 节点树：

```js
// src/compiler/parser/index.js
export function parse(template, options) {
  const stack = [];
  let root;
  let currentParent;

  parseHTML(template, {
    start(tag, attrs, unary) {
      // 创建元素节点
      const element = createASTElement(tag, attrs, currentParent);
      // 处理 v-if/v-for/v-once 等结构指令
      processIf(element);
      processFor(element);
      processOnce(element);
      // 处理 key/ref/slot 等特殊属性
      processKey(element);
      processRef(element);
      processSlot(element);
      // 处理 v-model
      processElement(element, options);

      if (!root) root = element;
      if (currentParent) currentParent.children.push(element);
      if (!unary) {
        currentParent = element;
        stack.push(element);
      }
    },
    end() {
      // 出栈，处理闭合标签
      currentParent = stack.pop();
    },
    chars(text) {
      // 文本节点
      if (!isWhitespace(text)) {
        const children = currentParent.children;
        let res;
        if (res = parseText(text)) {
          // 含 {{ }} 表达式：type=2（表达式节点）
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens
          });
        } else {
          // 纯文本：type=3
          children.push({ type: 3, text });
        }
      }
    }
  });
  return root;
}
```

**AST 节点类型：**

- `type: 1`：元素节点（有 tag、attrsList、attrsMap、children、directives）
- `type: 2`：含表达式的文本（`{{ msg }}`）
- `type: 3`：纯文本

**指令解析：**

`v-on:click="handler"` 被解析成 `directives: [{ name: 'on', rawName: 'v-on:click', value: 'handler', arg: 'click' }]`。

## 2. optimize —— 标记静态节点

（详见 [204-vue2-编译器静态优化原理](./204-vue2-编译器静态优化原理.md)）

遍历 AST，标记 `static` 和 `staticRoot`，让 diff 时能跳过静态部分。

## 3. generate —— 生成 render 函数

把 AST 转成 render 函数字符串：

```js
// src/compiler/codegen/index.js
export function generate(ast, options) {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns.map(code => `with(this){return ${code}}`)
  };
}

function genElement(el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state); // 静态根节点 → staticRenderFns
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state); // v-once
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state); // v-for
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state); // v-if
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'; // template
  } else if (el.tag === 'slot') {
    return genSlot(el, state); // slot
  } else {
    // 普通元素
    let code;
    if (el.component) {
      code = genComponent(el.component, el, state); // 组件
    } else {
      const data = genData(el, state); // 生成 data 对象
      const children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`;
    }
    // 处理模块转换（transformCode）
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code;
  }
}
```

**生成的代码示例：**

```html
<!-- 模板 -->
<div id="app" :class="cls" @click="onClick">
  <h1>标题</h1>
  <p>{{ msg }}</p>
  <span v-if="show">可见</span>
</div>
```

```js
// 生成的 render
{
  render: function() {
    with(this) {
      return _c('div', {
        attrs: { id: 'app' },
        class: cls,
        on: { click: onClick }
      }, [
        _m(0), // 静态节点 <h1>标题</h1>
        _c('p', [_v(_s(msg))]),
        (show) ? _c('span', [_v('可见')]) : _e() // v-if
      ]);
    }
  },
  staticRenderFns: [
    function() {
      with(this) { return _c('h1', [_v('标题')]); }
    }
  ]
}
```

## 运行时辅助函数

render 函数里的 `_c`、`_v`、`_s`、`_m` 等是 Vue 运行时提供的辅助函数：

| 函数  | 含义                          |
| ----- | ----------------------------- |
| `_c`  | createElement（创建元素 VNode）|
| `_v`  | createTextVNode（创建文本 VNode）|
| `_s`  | toString（转字符串）          |
| `_e`  | createEmptyVNode（空节点）    |
| `_m`  | renderStatic（渲染静态节点）  |
| `_l`  | renderList（v-for 渲染列表）  |
| `_t`  | renderSlot（渲染插槽）        |
| `_u`  | resolveScopedSlots            |

## 弊端

1. **运行时编译有性能开销**：完整版 vue.js 在浏览器里编译模板，首次渲染慢。生产环境推荐用 vue-loader 预编译。
2. **`with` 语句严格模式报错**：生成的 render 用 `with(this)` 访问 data/methods，无法在严格模式（ES Module）下运行。Vue 通过 `new Function(render)` 在非严格模式执行。
3. **静态优化有限**：只能标记"无动态指令"的节点，无法像 Vue3 那样标记"动态部分"。

## Vue3 的改进

Vue3 的编译器：

1. **不用 `with`**：生成的 render 函数参数化（`_ctx`、`_cache`），严格模式友好。
2. **PatchFlag**：每个动态节点标记动态类型，diff 时只比较动态部分。
3. **Block Tree**：收集动态节点到根节点，diff 时跳过静态节点。
4. **静态提升**：静态节点和静态属性提升到模块作用域，可被 Tree Shaking。
5. **缓存事件**：`@click="handler"` 编译成缓存，避免每次 render 创建新函数。
