---
title: "为什么需要 nextTick"
---

# 为什么需要 nextTick

Vue 是**异步更新 DOM** 的。当你修改响应式数据，不会立刻同步更新 DOM，而是把这个 watcher 推入一个更新队列，在下一个 tick（微任务阶段）才批量执行。这意味着修改数据后立即通过 `$el.textContent` 拿到的还是旧值。

`nextTick` 就是在 DOM 更新之后执行你的回调。
