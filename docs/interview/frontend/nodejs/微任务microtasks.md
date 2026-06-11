---
title: "微任务（Microtasks）"
---

# 微任务（Microtasks）

在 Node.js 中，宏任务阶段的**每个回调执行完毕后**，都会先清空当前的**微任务队列**再进入下一个阶段。

**微任务包括：**

1. `process.nextTick()` — 优先级最高
2. `Promise.then/catch/finally` / `queueMicrotask()`

**宏任务包括：**

- `setTimeout` / `setInterval`（timers 阶段）
- I/O 回调（poll 阶段）
- `setImmediate`（check 阶段）
- `close` 事件回调

**执行顺序口诀：** 宏任务回调 → 清空所有微任务（nextTick 先于 Promise）→ 下一宏任务
