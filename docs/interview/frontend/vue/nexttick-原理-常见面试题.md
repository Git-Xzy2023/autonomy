---
title: "常见面试题"
---

# 常见面试题

**Q1: 为什么要异步批量更新？**

- **性能**：一次 tick 中同一 watcher 被多次触发只执行一次（队列去重），避免频繁 DOM 操作
- **一致性**：避免在 watcher 执行过程中数据又被其他 watcher 修改导致中间状态错乱

**Q2: 微任务和宏任务的执行顺序？**

事件循环中，每执行一个宏任务（script 整体、setTimeout、setInterval、setImmediate、I/O）后，清空所有微任务（Promise.then、MutationObserver、queueMicrotask），然后进入下一轮。

```js
console.log("script start"); // 1. 同步
setTimeout(() => console.log("setTimeout"), 0); // 4. 宏任务
Promise.resolve().then(() => console.log("promise")); // 3. 微任务
nextTick(() => console.log("nextTick")); // 2. 微任务（排在 promise 之后）
console.log("script end"); // 2. 同步
```
