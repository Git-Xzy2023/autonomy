---
title: "JS 的事件循环（Event Loop）是什么？宏任务 / 微任务有哪些？"
---

# JS 的事件循环（Event Loop）是什么？宏任务 / 微任务有哪些？

**JS 是单线程的，但浏览器/Node 通过事件循环实现了"并发"**。核心原理：

```text
             ┌──────────────────────────────┐
             │     调用栈（Call Stack）      │  同步代码在这里执行
             └───────────────┬──────────────┘
                             │ 栈空了
             ┌───────────────▼──────────────┐
             │  微任务队列（Microtasks）     │  ← 先把微任务清空！
             │  Promise.then / queueMicrotask │
             │  MutationObserver            │
             └───────────────┬──────────────┘
                             │ 微任务空了
             ┌───────────────▼──────────────┐
             │  宏任务队列（Macrotasks）     │ ← 取 1 个宏任务执行
             │  setTimeout / setInterval    │
             │  setImmediate（Node）         │
             │  I/O / UI rendering          │
             └──────────────────────────────┘
                               循环 ←
```

**经典代码（背下来+能解释）**：

```js
console.log("1 脚本开始");

setTimeout(() => console.log("2 setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("3 Promise 1"))
  .then(() => console.log("4 Promise 2"));

console.log("5 脚本结束");

// 输出顺序：
// 1 脚本开始
// 5 脚本结束
// 3 Promise 1        ← 先处理微任务（整批处理）
// 4 Promise 2
// 2 setTimeout       ← 再处理一个宏任务
```

**记住口诀**：

- **先同步 → 再微任务 → 再下一个宏任务**
- **微任务 = Promise.then**（一次事件循环会把**所有**微任务都跑完）
- **宏任务 = setTimeout 等**（一次事件循环只跑**一个**宏任务，然后又去清空微任务）

---
