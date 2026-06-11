---
title: "Vue3 方式汇总"
---

# Vue3 方式汇总

| 方式                                      | 场景             |
| ----------------------------------------- | ---------------- |
| props / emit（defineProps / defineEmits） | 父子             |
| provide / inject（原生响应式：传递 ref）  | 跨层级           |
| v-model（支持参数，如 `v-model:visible`） | 父子双向绑定     |
| ref + defineExpose                        | 父访问子实例     |
| $attrs（$listeners 合并进 $attrs）        | 透传             |
| Pinia / Vuex                              | 全局状态         |
| mitt（三方事件库）                        | 任意组件事件总线 |

**provide/inject 深度用法（传递响应式数据）：**

```js
// 祖先组件
const theme = ref("dark");
provide("theme", theme); // 传 ref，后代修改会响应
provide("setTheme", (v) => (theme.value = v)); // 传方法让后代调用

// 后代组件
const theme = inject("theme"); // 直接拿到 ref，模板自动解包
const setTheme = inject("setTheme");
```
