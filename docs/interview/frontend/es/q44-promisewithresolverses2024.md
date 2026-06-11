---
title: "`Promise.withResolvers()`（ES2024）"
---

# `Promise.withResolvers()`（ES2024）

一个简化手写 Promise 控制流的 API，把 `resolve` / `reject` 直接解构出来：

```js
const { promise, resolve, reject } = Promise.withResolvers();
// 等价于：
// let resolve, reject;
// const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

setTimeout(() => resolve("ok"), 1000);
promise.then(console.log);
```

> 面试中如果被追问「还知道哪些更新的 Promise API」，可以顺便提：
> - `Promise.try`（Stage 3），
> - 以及早期 `Promise.prototype.finally`（ES2018）。

---
