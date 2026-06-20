---
title: "Vue3 setup 语法糖编译原理"
---

# Vue3 setup 语法糖编译原理

## `<script setup>` 的目标

`<script setup>` 是 Vue3.2 引入的编译时语法糖，目标是**减少样板代码**：

- 无需 `export default { setup() { return {...} } }`
- 顶层变量自动暴露给模板
- 组件引入后直接用，无需 `components` 注册
- props/emits 用宏声明
- 编译器能做更多优化（静态提升、PatchFlag、事件缓存）

## 编译前后对比

### 编译前

```vue
<script setup>
import { ref, onMounted } from 'vue';
import Child from './Child.vue';

const count = ref(0);
const increment = () => count.value++;

onMounted(() => {
  console.log('mounted');
});
</script>

<template>
  <div>
    <Child :count="count" @click="increment" />
    <button @click="increment">{{ count }}</button>
  </div>
</template>
```

### 编译后

```js
import { ref, onMounted } from 'vue';
import Child from './Child.vue';

export default {
  __name: 'App',
  setup(__props, { expose: __expose }) {
    __expose();

    const count = ref(0);
    const increment = () => count.value++;

    onMounted(() => {
      console.log('mounted');
    });

    const __returned__ = { count, increment, Child };
    Object.defineProperty(__returned__, '__isScriptSetup', { value: true });
    return __returned__;
  }
}
```

**关键变化：**

1. 顶层代码移到 `setup()` 函数内。
2. `import` 的组件（Child）自动加入返回对象，模板能直接用。
3. 顶层变量（count、increment）自动加入返回对象。
4. `onMounted` 等生命周期钩子在 setup 内调用。

## 编译器的处理流程

### 1. 解析 SFC

```js
// packages/compiler-sfc/src/parse.ts
export function parse(source) {
  // 解析 <template>、<script>、<style> 三块
  const descriptor = {
    template: null,
    script: null,
    scriptSetup: null,
    styles: []
  };
  // ...
  return { descriptor, errors };
}
```

### 2. 编译 `<script setup>`

```js
// packages/compiler-sfc/src/compileScript.ts
export function compileScript(sfc, options) {
  const script = sfc.script;
  const scriptSetup = sfc.scriptSetup;

  if (scriptSetup) {
    return compileScriptSetup(sfc, options);
  }
  // ...
}

function compileScriptSetup(sfc, options) {
  const { scriptSetup } = sfc;
  const bindings = analyzeScriptBindings(scriptSetup); // 分析顶层绑定

  // 生成 setup 函数
  const setupCode = `
    setup(__props, { expose: __expose }) {
      __expose();
      ${scriptSetup.content} // 原样放入顶层代码

      const __returned__ = {
        ${bindings.map(b => b.name).join(', ')} // 自动暴露
      };
      return __returned__;
    }
  `;

  return { content: `export default { ${setupCode} }` };
}
```

### 3. 分析顶层绑定

```js
function analyzeScriptBindings(scriptSetup) {
  const bindings = [];
  // 用 AST 解析顶层变量声明、import、函数声明
  // - import Child from './Child.vue' → 组件绑定
  // - const count = ref(0) → 变量绑定
  // - const increment = () => {} → 函数绑定
  // - const { x, y } = useFoo() → 解构绑定
  return bindings;
}
```

## 宏的处理

`<script setup>` 里的宏（defineProps、defineEmits 等）在编译时被替换。

### defineProps

```vue
<script setup>
const props = defineProps<{ msg: string; count?: number }>();
</script>
```

```js
// 编译后
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props; // defineProps 被替换为 __props
    return { props };
  }
}
```

### defineEmits

```vue
<script setup>
const emit = defineEmits(['update', 'delete']);
</script>
```

```js
export default {
  emits: ['update', 'delete'],
  setup(__props, { expose: __expose, emit }) {
    __expose();
    return { emit };
  }
}
```

### defineExpose

```vue
<script setup>
const count = ref(0);
defineExpose({ count });
</script>
```

```js
export default {
  setup(__props, { expose: __expose }) {
    const count = ref(0);
    __expose({ count }); // defineExpose 被替换为 __expose
    return { count };
  }
}
```

## 模板编译的优化

`<script setup>` 让编译器能做更多优化，因为它知道哪些变量是响应式的。

### 1. 响应式变量标记

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <div>{{ count }}</div>
</template>
```

编译器分析 `count` 是 `ref` 返回值，在模板编译时自动解包：

```js
import { ref, toDisplayString as _toDisplayString, createElementVNode as _createElementVNode } from 'vue';

setup(__props, { expose: __expose }) {
  __expose();
  const count = ref(0);
  return { count };
}

function render(_ctx, _cache) {
  return _createElementVNode('div', null, _toDisplayString(_ctx.count), 1 /* TEXT */);
  // _ctx.count 自动解包（setup 返回的 ref 在模板里自动解包）
}
```

### 2. 静态提升

```vue
<template>
  <div>
    <h1>静态标题</h1>
    <p>{{ count }}</p>
  </div>
</template>
```

```js
const _hoisted_1 = createElementVNode('h1', null, '静态标题');

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock('div', null, [
    _hoisted_1,
    createElementVNode('p', null, toDisplayString(_ctx.count), 1)
  ]));
}
```

### 3. 事件缓存

```vue
<template>
  <button @click="onClick">点击</button>
</template>

<script setup>
const onClick = () => {};
</script>
```

```js
function render(_ctx, _cache) {
  return createElementVNode('button', {
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick(...args))
  }, '点击');
}
```

**事件缓存**：`_cache[0]` 缓存包装后的函数，避免每次 render 创建新函数。这对子组件的 `v-memo` 和 `React.memo` 式优化很重要。

### 4. PatchFlag

```vue
<template>
  <div :class="cls" :id="staticId">{{ count }}</div>
</template>
```

```js
function render(_ctx, _cache) {
  return createElementVNode('div', {
    class: _ctx.cls,
    id: 'static' // 静态属性提升
  }, toDisplayString(_ctx.count), 3 /* TEXT | CLASS */);
}
```

`PatchFlag = 3 (TEXT | CLASS)`，diff 时只比较文本和 class，不比较 id。

## 与普通 setup 的对比

| 维度       | 普通 setup                          | `<script setup>`           |
| ---------- | ----------------------------------- | -------------------------- |
| 样板代码   | 多（export default + return）       | 少（顶层直接写）           |
| 组件注册   | 需 `components: { Child }`          | import 后自动可用          |
| props/emits | `setup(props, { emit })`           | `defineProps/defineEmits`  |
| 暴露       | return 对象                        | 自动暴露顶层变量           |
| 类型推断   | 一般                               | 更好（TS 原生）            |
| 编译优化   | 一般                               | 更多（事件缓存、PatchFlag）|

## 注意事项

1. **顶层 await**：`<script setup>` 支持顶层 await，但会让组件变成异步组件（需 Suspense）。
2. **不能 export**：`<script setup>` 里不能 `export`，顶层变量自动暴露。
3. **宏不能 import**：`defineProps` 等是编译器内置，import 会报错。
4. **与 `<script>` 共存**：可以同时有 `<script>` 和 `<script setup>`，前者用于 `name`、`inheritAttrs` 等无法在 setup 里声明的选项（Vue3.3+ 可用 `defineOptions`）。

## 总结

- **`<script setup>`**：编译时语法糖，减少样板代码。
- **自动暴露**：顶层变量自动加入 setup 返回对象。
- **宏**：defineProps/defineEmits/defineExpose 编译时替换。
- **编译优化**：静态提升、PatchFlag、事件缓存、Block Tree。
- **类型推断**：TS 原生支持，比普通 setup 更好。

`<script setup>` 是 Vue3 推荐的组件写法，编译器能基于"知道哪些是响应式"做更多优化，是性能和开发体验的双赢。
