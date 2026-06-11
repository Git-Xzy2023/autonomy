---
title: "watch 原理"
---

# watch 原理

watch 本质是一个普通 Watcher（Vue2）或 effect（Vue3），不关心返回值，只关心副作用。

- **用户传入 getter（或响应式源）**：用于依赖收集
- **用户传入 callback**：依赖变化后异步（默认放入 nextTick 队列）执行
- **deep: true**：内部递归遍历被监听对象的所有属性，触发 getter 收集深层依赖
