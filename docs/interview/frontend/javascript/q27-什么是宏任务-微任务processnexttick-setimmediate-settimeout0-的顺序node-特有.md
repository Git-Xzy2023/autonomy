---
title: "什么是宏任务 / 微任务？`process.nextTick` / `setImmediate` / `setTimeout(0)` 的顺序？（Node 特有）"
---

# 什么是宏任务 / 微任务？`process.nextTick` / `setImmediate` / `setTimeout(0)` 的顺序？（Node 特有）

| 队列                   | 内容                   | 执行时机                                     |
| ---------------------- | ---------------------- | -------------------------------------------- |
| `process.nextTick`     | nextTickQueue          | **当前栈清空后立刻执行**，优先级比微任务还高 |
| 微任务（Promise.then） | microtaskQueue         | nextTick 之后，宏任务之前                    |
| 宏任务（timer）        | setTimeout/setInterval | 到期的 timer 先处理                          |
| 宏任务（poll）         | I/O                    | poll 阶段                                    |
| `setImmediate`         | check 阶段             | poll 之后                                    |

```js
// Node 环境中的经典对比
setImmediate(() => console.log("immediate"));
setTimeout(() => console.log("timeout 0"), 0);
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
// 输出：
// nextTick → promise → timeout 0 → immediate（常见顺序，但 timer 可能在不同机器上变化）
// 官方说法：setTimeout(0) 和 setImmediate 的相对顺序是不保证的
// 但在 I/O 循环内（如 fs.readFile 的回调里），setImmediate 一定先于 setTimeout
```

---
