---
title: "Promise"
---

# Promise

Promise 用 `.then` 链式调用解决回调地狱，状态不可逆（pending → fulfilled / rejected）。

```js
const { promisify } = require("util");
const readFile = promisify(fs.readFile); // Node 内置工具：把 callback 风格转 Promise

readFile("a.txt", "utf8")
  .then((a) => readFile("b.txt", "utf8").then((b) => ({ a, b })))
  .then(({ a, b }) => promisify(fs.writeFile)("c.txt", a + b))
  .catch((err) => console.error(err));
```

**Promise 三种状态**：

- `pending`：初始状态
- `fulfilled`：成功，有 `value`
- `rejected`：失败，有 `reason`

**静态方法：**

| 方法                     | 行为                                            |
| ------------------------ | ----------------------------------------------- |
| `Promise.all([p1, p2])`  | 全部成功才成功，返回数组；任一失败立即失败      |
| `Promise.race([p1, p2])` | 谁先完成（不管成功失败）就返回谁的结果          |
| `Promise.allSettled`     | 等所有 Promise 完成，返回每个状态的对象数组     |
| `Promise.any`            | 任一成功即返回，全部失败才返回 `AggregateError` |
| `Promise.resolve(v)`     | 返回一个以 v 为结果的 fulfilled Promise         |
| `Promise.reject(v)`      | 返回一个以 v 为原因的 rejected Promise          |
