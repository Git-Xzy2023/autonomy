---
title: "Vue3 Composition API 设计动机"
---

# Vue3 Composition API 设计动机

## 为什么 Vue3 要引入 Composition API

Vue2 的 Options API（`data/methods/computed/watch` 分块）在大型项目里暴露了几个根本性问题：

### 1. 逻辑复用困难

Vue2 复用逻辑只能用 mixin，但 mixin 有"来源不清晰、命名冲突、数据来源不可追溯"等弊端（详见 [104-vue2-mixin-原理与弊端](./104-vue2-mixin-原理与弊端.md)）。

### 2. 相关逻辑分散

Options API 按选项类型组织代码，导致**同一个功能的代码散落在不同选项**：

```js
// Vue2：一个"搜索功能"的代码分散在 data/methods/computed/watch
export default {
  data() {
    return {
      keyword: '',       // 搜索相关
      results: [],       // 搜索相关
      page: 1,           // 分页相关
      total: 0           // 分页相关
    };
  },
  computed: {
    hasMore() { /* 分页相关 */ },  // 和搜索的 results 分离
  },
  methods: {
    search() { /* 搜索相关 */ },
    loadMore() { /* 分页相关 */ },
    reset() { /* 搜索相关 */ }
  },
  watch: {
    keyword() { /* 搜索相关 */ }
  }
}
```

同一个功能的代码被拆到 4 个地方，阅读时要在文件里上下跳转。

### 3. 类型推断差

Options API 的 `this` 是 Vue 实例，TypeScript 难以推断 `this.xxx` 的类型。Vue2 用 `vue-class-component` 装饰器弥补，但写法繁琐。

### 4. 无法 Tree Shaking

Vue2 的 API 都挂在 `Vue` 原型上（`Vue.set`、`Vue.delete`、`Vue.nextTick`），打包时整个 Vue 都会被引入，无法按需引入。

## Composition API 的解决方案

```js
import { ref, computed, watch, onMounted } from 'vue';

export default {
  setup() {
    // 搜索功能：所有相关代码聚在一起
    const keyword = ref('');
    const results = ref([]);
    const search = async () => {
      results.value = await api.search(keyword.value);
    };
    watch(keyword, () => { search(); });

    // 分页功能：独立聚在一起
    const page = ref(1);
    const total = ref(0);
    const hasMore = computed(() => page.value * 10 < total.value);
    const loadMore = () => { page.value++; search(); };

    return { keyword, results, search, page, hasMore, loadMore };
  }
}
```

**关键改进：**

1. **按功能组织代码**：相关逻辑聚合，不再按选项类型分散。
2. **逻辑复用**：抽成 composable 函数（`useSearch`、`usePagination`），显式引入，无 mixin 弊端。
3. **类型推断**：`ref/computed` 返回带类型的对象，TS 完整支持。
4. **Tree Shaking**：`import { ref } from 'vue'`，未使用的 API 不打包。

## setup 函数的设计

```js
setup(props, context) {
  // props：响应式的 props
  // context: { attrs, slots, emit, expose }
  // 返回的对象会暴露给模板和实例
  return { /* 模板能用的值 */ };
}
```

**设计要点：**

1. **只在初始化时执行一次**：setup 不是生命周期，是组件的"构造函数"。
2. **props 是响应式的**：但**不能解构**（解构会失去响应式），要用 `toRefs`。
3. **context 不是响应式的**：可以安全解构。
4. **返回值**：对象暴露给模板，或返回渲染函数。

## setup 语法糖

Vue3.2 引入 `<script setup>`，编译器自动处理 setup 的样板代码：

```vue
<script setup>
import { ref } from 'vue';
const msg = ref('hello'); // 自动暴露给模板
</script>

<template>
  <div>{{ msg }}</div>
</template>
```

**编译后等价于：**

```js
export default {
  setup() {
    const msg = ref('hello');
    return { msg };
  }
}
```

**优势：**

- 无需 `return`，顶层变量自动暴露。
- 组件引入后直接用，无需 `components` 注册。
- props/emits 用 `defineProps`/`defineEmits` 声明。
- 性能更好：编译器能做更多优化（静态提升、PatchFlag）。

## 与 React Hooks 的对比

| 维度       | Vue Composition API       | React Hooks              |
| ---------- | ------------------------- | ------------------------ |
| 执行时机   | setup 只执行一次          | 每次渲染都执行           |
| 依赖收集   | 自动（响应式系统）        | 手动（deps 数组）        |
| 闭包陷阱   | 无（响应式始终最新）      | 有（stale closure）      |
| 调用顺序   | 无限制                    | 必须固定（不能在条件里） |
| 状态更新   | `.value = x`（赋值即更新）| `setState(x)`（触发重渲染）|

**Vue 的优势：** 不需要 `useEffect` 的依赖数组，响应式系统自动追踪，不会出现 React 的"闭包陷阱"和"依赖数组遗漏"问题。

## 弊端

1. **学习曲线**：从 Options API 迁移需要理解响应式原理。
2. **`this` 消失**：setup 里没有 `this`，老代码迁移成本高。
3. **响应式陷阱**：解构 ref/reactive 会失去响应式，需要 `toRefs`。
4. **调试稍复杂**：devtools 里看到的是 ref 对象，不是原始值。

## 总结

Composition API 不是"语法糖"，是 Vue3 对"大型项目逻辑组织"的根本性重构。它解决了 Vue2 的逻辑复用、代码组织、类型支持三大痛点，是 Vue3 最重要的改进之一。
