---
title: "Node.js 中错误的传播路径"
---

# Node.js 中错误的传播路径

1. **同步代码**：`throw new Error('xx')` → 用 `try/catch` 捕获
2. **回调风格**：第一个参数 `err`
3. **Promise / async**：`promise.catch()` 或 `try/catch` 包裹 `await`
4. **EventEmitter**：监听 `error` 事件（不监听则进程崩溃）
5. **未捕获错误**：被 `process.on('uncaughtException')` / `process.on('unhandledRejection')` 兜底（仅用于记录日志，然后应退出进程）

```js
process.on("uncaughtException", (err) => {
  console.error("Uncaught", err);
  process.exit(1); // 进程状态已不可靠，必须退出
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at", promise, "reason", reason);
  // Node 15+ 默认行为：未处理的 Promise reject 会让进程退出（像未捕获异常）
});
```
