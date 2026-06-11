---
title: "API 风格"
---

# API 风格

| 维度            | Vue2（Options API）                                    | Vue3（Composition API）                  |
| --------------- | ------------------------------------------------------ | ---------------------------------------- |
| 组织代码        | 按选项（data/methods/computed/watch）组织              | 按**逻辑关注点**组织                     |
| 逻辑复用        | mixin（易命名冲突、来源不明）                          | 组合式函数（显式引用、类型友好）         |
| this 依赖       | 所有选项都依赖 this                                    | 不需要 this                              |
| Tree-shaking    | 差（Vue 构造函数挂载所有 API）                         | 好（按需 import，未使用的 API 会被摇掉） |
| TypeScript 支持 | 需要 vue-class-component / vue-property-decorator 辅助 | 原生用 TS 编写，类型推断完美             |

**Options API 与 Composition API 的代码组织对比：**

```js
// Vue2 Options API：相关逻辑分散在 data/methods/computed/watch 各处
export default {
  data() { return { keyword: '', list: [] } },
  computed: { filteredList() { ... } },
  methods: { search() { ... }, loadMore() { ... } },
  watch: { keyword() { ... } },
  mounted() { ... }
}

// Vue3 Composition API：相关逻辑聚合在一起
function useSearch() {
  const keyword = ref('')
  const list = ref([])
  const filteredList = computed(() => ...)
  function search() { ... }
  watch(keyword, () => ...)
  onMounted(() => ...)
  return { keyword, list, filteredList, search }
}
```
