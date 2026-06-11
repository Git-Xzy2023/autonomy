---
title: "computed / watch / watchEffect"
---

# computed / watch / watchEffect

```js
// computed：依赖变化才重新计算，有缓存
const fullName = computed({
  get: () => firstName.value + ' ' + lastName.value,
  set: (val) => { [firstName.value, lastName.value] = val.split(' ') }
})

// watch：显式声明依赖，惰性（不会立即执行）
watch(
  () => user.age,
  (newAge, oldAge) => { ... },
  { immediate: true, deep: true }
)
// 支持同时监听多个源
watch([a, () => b.value], ([na, nb], [oa, ob]) => ...)

// watchEffect：自动追踪依赖，立即执行一次
const stop = watchEffect(() => {
  console.log(count.value)  // 自动收集 count 为依赖
})
stop()  // 可以手动停止
```
