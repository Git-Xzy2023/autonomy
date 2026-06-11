---
title: "自定义组合式函数（Composables）"
---

# 自定义组合式函数（Composables）

Vue2 中用 mixin 做逻辑复用，问题很多。Vue3 推荐用自定义 hook（组合式函数）：

```js
// useCounter.js —— 一个简单的计数器逻辑
export function useCounter(initial = 0) {
  const count = ref(initial)
  const inc = () => count.value++
  const dec = () => count.value--
  const reset = () => count.value = initial
  return { count, inc, dec, reset }
}

// useMouse.js —— 鼠标位置追踪
export function useMouse() {
  const x = ref(0), y = ref(0)
  const update = e => { x.value = e.clientX; y.value = e.clientY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}

// 组件中使用 —— 清晰，来源可追溯，无命名冲突
<script setup>
const { count, inc } = useCounter(10)
const { x, y } = useMouse()
</script>
```
