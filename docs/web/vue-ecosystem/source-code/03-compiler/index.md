---
title: Vue 编译器原理
---

# Vue 编译器原理

> 本章剖析 Vue 模板编译的完整流程：从模板字符串到 AST、AST 转换、生成渲染函数，再到 Vue 3 的编译期优化。

---

## 一、编译流程总览

```
<template>
  <div>{{ msg }}</div>
</template>
       ↓ parse
   AST（抽象语法树）
   {
     type: 1,
     tag: 'div',
     children: [{ type: 2, expression: '_s(msg)' }]
   }
       ↓ transform
   优化 AST（静态标记、指令转换）
       ↓ generate
   渲染函数字符串
   "with(this){return _c('div',[_v(_s(msg))])}"
       ↓ new Function
   可执行函数
```

### Vue 2 vs Vue 3 编译器

| 维度        | Vue 2                  | Vue 3                            |
| ----------- | ---------------------- | -------------------------------- |
| **结构**    | 单包                   | Monorepo（compiler-core/dom/sfc）|
| **优化**    | 静态根标记             | 静态提升 + PatchFlag + Block Tree |
| **类型**    | Flow                   | TypeScript                       |
| **缓存**    | runtime compiler       | 编译时缓存（Vite 插件）          |

---

## 二、Vue 2 编译器

### 2.1 入口

```js
// src/compiler/index.js
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 1. 解析为 AST
  const ast = parse(template.trim(), options);

  // 2. 优化（标记静态节点）
  optimize(ast, options);

  // 3. 生成代码
  const code = generate(ast, options);

  return { ast, render: code.render, staticRenderFns: code.staticRenderFns };
});
```

### 2.2 parse：模板 → AST

```js
// src/compiler/parser/index.js
export function parse(template: string, options: CompilerOptions): ASTElement {
  getFnsAndConfig();
  let root;
  let currentParent;
  let stack = [];

  parseHTML(template, {
    start(tag, attrs, unary) {
      const element: ASTElement = {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: [],
      };
      processFor(element);     // v-for
      processIf(element);      // v-if
      processOnce(element);    // v-once
      processKey(element);     // key
      processRef(element);     // ref
      processSlot(element);    // slot
      processComponent(element); // 组件
      // ...

      if (!root) root = element;
      if (currentParent) currentParent.children.push(element);
      if (!unary) {
        currentParent = element;
        stack.push(element);
      }
    },
    end() {
      currentParent = stack.pop();
    },
    chars(text: string) {
      // 文本节点
      const children = currentParent.children;
      let child;
      if (text !== '') {
        child = {
          type: 2, // 文本
          expression: parseText(text, options.delimiters),
          text,
        };
        children.push(child);
      }
    },
    comment(text: string) {
      currentParent.children.push({ type: 3, text });
    },
  });

  return root;
}
```

### 2.3 optimize：静态标记

```js
// src/compiler/optimizer/index.js
export function optimize(root: ASTElement, options: CompilerOptions) {
  if (!root) return;

  // 第一遍：标记静态节点
  markStatic(root);

  // 第二遍：标记静态根
  markStaticRoots(root, false);
}

function markStatic(node: ASTNode) {
  node.static = isStatic(node);
  if (node.type === 1) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function isStatic(node: ASTNode): boolean {
  if (node.type === 2) return false; // 文本节点（动态）
  if (node.type === 3) return true;  // 纯文本

  // 元素节点
  return !(
    node.pre || // v-pre
    node.hasBindings || // 动态绑定
    node.if || node.for || // v-if/v-for
    node.tag === 'slot' ||
    Object.keys(node).length === 0 ||
    isBuiltInTag(node.tag)
  );
}
```

### 2.4 generate：生成代码

```js
// src/compiler/codegen/index.js
export function generate(ast: ASTElement, options: CompilerOptions): CodegenResult {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return { render: `with(this){return ${code}}`, staticRenderFns: state.staticRenderFns };
}

function genElement(el: ASTElement, state: CodegenState): string {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state);
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0';
  } else if (el.tag === 'slot') {
    return genSlot(el, state);
  } else {
    let code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      const data = el.plain ? undefined : genData(el, state);
      const children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`;
    }
    return code;
  }
}

// 例如
// <div :id="myId">{{ msg }}</div>
// 生成：
// _c('div', { attrs: { id: myId } }, [_v(_s(msg))])
```

### 2.5 generate 的辅助函数

| 函数          | 说明                            |
| ------------- | ------------------------------- |
| `genIf`       | 生成 v-if/v-else-if/v-else     |
| `genFor`      | 生成 v-for                      |
| `genData`     | 生成 props/class/style/events   |
| `genChildren` | 生成子节点                      |
| `genSlot`     | 生成 slot                       |

### 2.6 编译产物

```js
// <div id="app">
//   <h1>{{ title }}</h1>
//   <p v-if="show">visible</p>
// </div>

// 编译为：
{
  render: `with(this){return _c('div',{attrs:{"id":"app"}},[
    _c('h1',[_v(_s(title))]),
    (show)?_c('p',[_v("visible")]):_e()
  ])}`,
  staticRenderFns: []
}
```

辅助函数：

| 函数      | 说明                |
| --------- | ------------------- |
| `_c`      | createElement        |
| `_v`      | createTextVNode      |
| `_s`      | toString            |
| `_e`      | createEmptyVNode     |
| `_l`      | renderList (v-for)   |
| `_m`      | renderStatic        |

---

## 三、Vue 3 编译器

### 3.1 Monorepo 结构

```
packages/
├── compiler-core/      # 平台无关核心
│   └── src/
│       ├── parse.ts          # 解析
│       ├── transform.ts     # 转换
│       ├── transforms/       # 内置 transform 插件
│       │   ├── vIf.ts
│       │   ├── vFor.ts
│       │   ├── transformElement.ts
│       │   ├── transformSlotOutlet.ts
│       │   ├── transformText.ts
│       │   ├── transformExpression.ts
│       │   ├── vModel.ts
│       │   ├── vOn.ts
│       │   └── ...
│       ├── codegen/          # 代码生成
│       │   └── index.ts
│       ├── ast.ts            # AST 定义
│       └── compile.ts        # 入口
│
├── compiler-dom/       # 浏览器平台
│   └── src/
│       ├── index.ts
│       ├── transforms/
│       │   ├── transformStyle.ts
│       │   └── vHtml.ts
│       └── ...
│
└── compiler-sfc/      # SFC 编译器
    └── src/
        ├── parse.ts         # 解析 .vue
        ├── compileScript.ts
        ├── compileTemplate.ts
        └── compileStyle.ts
```

### 3.2 baseCompile

```ts
// packages/compiler-core/src/compile.ts
export function baseCompile(template: string, options: CompilerOptions): CodegenResult {
  const parsed = baseParse(template, options);

  // 转换 AST
  transform(parsed.ast, {
    ...options,
    nodeTransforms: [
      transformOnce,
      transformIf,
      transformFor,
      ...,
      transformExpression,
      transformSlotOutlet,
      transformElement,
      transformSlot,
      ...options.nodeTransforms,
    ],
    directiveTransforms: {
      on: transformOn,
      bind: transformBind,
      model: transformModel,
      ...options.directiveTransforms,
    },
  });

  // 生成代码
  return generate(parsed.ast, options);
}
```

### 3.3 parse：模板 → AST

```ts
// packages/compiler-core/src/parse.ts
export function baseParse(content: string, options: ParserOptions): RootNode {
  const context = createParserContext(content, options);
  const start = getCursor(context);

  return createRoot(
    parseChildren(context, TextModes.DATA, []),
    getSelection(context, start)
  );
}

function parseChildren(context, mode, ancestors) {
  const nodes = [];

  while (!isEnd(context, mode, ancestors)) {
    const s = context.source;
    let node;

    if (mode === TextModes.RAWTEXT || s.startsWith('{{')) {
      // 文本插值
      if (!startsWith(s, '{{')) {
        node = parseText(context);
      }
    } else if (s[0] === '<') {
      if (s[1] === '/') {
        // 结束标签
      } else if (/[a-z]/i.test(s[1])) {
        // 元素标签
        node = parseElement(context, ancestors);
      } else if (s.startsWith('<!--')) {
        node = parseComment(context);
      }
    }

    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }

  return nodes;
}
```

### 3.4 AST 节点

```ts
export interface Node {
  type: NodeTypes;
  loc: SourceLocation;
}

export type ParentNode = RootNode | ElementNode | IfNode | ForNode;

export interface ElementNode extends Node {
  type: NodeTypes.ELEMENT;
  tag: string;
  tagType: ElementTypes;
  props: (AttributeNode | DirectiveNode)[];
  children: TemplateChildNode[];
  isSelfClosing: boolean;
}

export interface DirectiveNode extends Node {
  type: NodeTypes.DIRECTIVE;
  name: string;
  exp: ExpressionNode | undefined;
  arg: ExpressionNode | undefined;
  modifiers: string[];
}
```

### 3.5 transform：AST 转换

```ts
// packages/compiler-core/src/transform.ts
export function transform(root: RootNode, options: TransformOptions) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);

  // 静态提升
  if (options.hoistStatic) {
    hoistStatic(root, context);
  }

  // createRoot
  createRootCodegen(root, context);
}

function traverseNode(node, context) {
  // 进入钩子
  context.nodeTransforms.forEach((t) => t(node, context));

  switch (node.type) {
    case NodeTypes.IF:
      // ...
    case NodeTypes.FOR:
      // ...
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
    case NodeTypes.FRAGMENT:
      traverseChildren(node, context);
      break;
  }

  // 退出钩子（后序）
  context.nodeTransforms.forEach((t) => t.exit && t.exit(node, context));
}
```

### 3.6 vIf 转换示例

```ts
// packages/compiler-core/src/transforms/vIf.ts
export const transformIf = createStructuralDirectiveTransform(
  /^(if|else|else-if)$/,
  (node, dir, context) => {
    return processIf(node, dir, context, (ifNode, branch, isRoot) => {
      // ...
      return () => {
        if (isRoot) {
          ifNode.codegenNode = createCodegenNodeForBranch(branch, context);
        } else {
          const parentCondition = getParentCondition(ifNode.codegenNode);
          parentCondition.alternate = createCodegenNodeForBranch(branch, context);
        }
      };
    });
  }
);
```

### 3.7 静态提升

```ts
// packages/compiler-core/src/transforms/hoistStatic.ts
export function hoistStatic(root, context) {
  walk(root, context, {
    onNodeHoisted(node, context) {
      // ...
    },
  });
}

function walk(node, context, { onNodeHoisted }) {
  if (node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.ELEMENT) {
    const { children } = node;

    // 是否有动态子节点
    const hasDynamicChild = children.some(c => {
      return c.type !== NodeTypes.ELEMENT && c.type !== NodeTypes.TEXT;
    });

    if (!hasDynamicChild && isHoisted) {
      // 提升到 setup 外部
      const hoisted = hoist(node, context);
      // ...
    }
  }
}
```

### 3.8 generate：生成代码

```ts
// packages/compiler-core/src/codegen/index.ts
export function generate(ast: RootNode, options: CodegenOptions): CodegenResult {
  const context = createCodegenContext(ast, options);
  const { mode, push } = context;

  // genFunctionPreamble：生成 import 与静态提升
  if (mode === 'function') {
    push(`function render(_ctx, _cache) {`);
    genModulePreamble(ast, context, false);
  } else {
    push(`const _hoisted_1 = ...`);
  }

  // 主体
  push(`return `);
  genNode(ast.codegenNode, context);

  push(`}`);

  return { code: context.code, ast };
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.ELEMENT:
    case NodeTypes.FOR:
    case NodeTypes.IF:
      genNode(node.codegenNode, context);
      break;
    case NodeTypes.JS_CALL_FUNCTION:
      genCallExpression(node, context);
      break;
    case NodeTypes.JS_OBJECT_EXPRESSION:
      genObjectExpression(node, context);
      break;
    // ...
  }
}
```

### 3.9 编译产物示例

```vue
<!-- 源码 -->
<template>
  <div>
    <h1>静态标题</h1>
    <p>{{ msg }}</p>
    <button @click="onClick">点击</button>
  </div>
</template>
```

```ts
// 编译产物
import { createElementVNode as _createElementVNode,
         toDisplayString as _toDisplayString,
         openBlock as _openBlock,
         createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "card" }
const _hoisted_2 = /*#__PURE__*/_createElementVNode("h1", null, "静态标题", -1 /* HOISTED */)

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _hoisted_2,                                            // 静态提升
    _createElementVNode("p", null, _toDisplayString(_ctx.msg), 1 /* TEXT */),  // PatchFlag
    _createElementVNode("button", { onClick: _ctx.onClick }, "点击", 8 /* PROPS */, ["onClick"])
  ]))
}
```

---

## 四、SFC 编译

### 4.1 .vue 文件结构

```vue
<template>
  <div>{{ msg }}</div>
</template>

<script setup>
import { ref } from 'vue';
const msg = ref('Hello');
</script>

<style scoped>
div { color: red; }
</style>
```

### 4.2 SFC 编译流程

```
.vue 文件
   ↓ parse（compiler-sfc/parse.ts）
   {
     descriptor: {
       template: { content, ast },
       script: { content },
       scriptSetup: { content },
       styles: [{ content, scoped }]
     }
   }
   ↓ compileTemplate
   template → render 函数
   ↓ compileScript（script setup → 标准 script）
   import { ref } from 'vue'
   const msg = ref('Hello')
   ↓
   export default {
     setup() {
       const msg = ref('Hello');
       return { msg };
     }
   }
   ↓ compileStyle
   scoped style → 加 [data-v-xxx]
   div { color: red; }
   ↓
   div[data-v-xxx] { color: red; }
```

### 4.3 script setup 编译

```vue
<!-- script setup 源码 -->
<script setup>
import { ref } from 'vue';
import Child from './Child.vue';

const msg = ref('Hello');
const onClick = () => console.log(msg.value);
</script>
```

编译后：

```ts
import { ref } from 'vue';
import Child from './Child.vue';

export default {
  __name: 'App',
  setup(__props, { expose }) {
    const msg = ref('Hello');
    const onClick = () => console.log(msg.value);

    expose({});

    return { msg, onClick, Child };
  }
};
```

### 4.4 scoped style 处理

```vue
<style scoped>
.hello { color: red; }
</style>
```

编译后：

```css
.hello[data-v-7ba5bd90] { color: red; }
```

通过添加唯一 `data-v-xxx` 属性实现 scope 隔离。

---

## 五、实战：调试编译器

### 5.1 在线编译器

Vue 官方提供 [Template Explorer](https://template-explorer.vuejs.org/) 在线查看编译产物。

### 5.2 在项目中使用

```ts
import { compile } from '@vue/compiler-dom';

const { code } = compile(`<div>{{ msg }}</div>`, {
  mode: 'function',
});
console.log(code);
```

### 5.3 SFC 编译

```ts
import { parse, compileTemplate, compileScript } from '@vue/compiler-sfc';

const { descriptor } = parse(source);
const { code } = compileScript(descriptor, { id: 'xxx' });
const { code: renderCode } = compileTemplate({
  source: descriptor.template.content,
  filename: 'App.vue',
  id: 'xxx',
});
```

---

## 六、学习建议

1. **流程**：parse → transform → generate 三步走
2. **AST**：理解节点类型与结构
3. **优化**：重点理解 PatchFlag、Block Tree、静态提升
4. **对比**：Vue 2 的 optimize vs Vue 3 的 transform

---

## 参考

- [Vue 2 编译器源码](https://github.com/vuejs/vue/tree/v2.6.14/src/compiler)
- [Vue 3 compiler-core 源码](https://github.com/vuejs/core/tree/main/packages/compiler-core/src)
- [Vue 3 模板编译在线工具](https://template-explorer.vuejs.org/)
