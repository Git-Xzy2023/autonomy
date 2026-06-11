---
title: "`Promise.all` / `allSettled` / `race` / `any` 的区别？"
---

# `Promise.all` / `allSettled` / `race` / `any` 的区别？

| 方法                    | 成功条件                         | 失败条件                              | 返回内容                                                      |
| ----------------------- | -------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `Promise.all([...])`    | **全部**成功                     | **任何一个**失败 → 立刻返回这个失败   | 成功时：按顺序的结果数组                                      |
| `Promise.allSettled`    | 永远成功（等全部完成）           | 永不失败                              | `[{status:'fulfilled', value} / {status:'rejected', reason}]` |
| `Promise.race`          | 第一个**完成**的（无论成功失败） | 第一个失败的                          | 第一个完成的值/错误                                           |
| `Promise.any`（ES2021） | 第一个**成功**的                 | 全部失败才失败（返回 AggregateError） | 第一个成功的值                                                |

**经典场景**：

```js
// 并行请求多个 API，全部完成后一起处理
Promise.all([fetch("/users"), fetch("/orders"), fetch("/products")]).then(
  ([users, orders, products]) => console.log(users, orders, products),
);

// 超时控制（race：谁先到用谁）
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms)),
  ]);
}

// 从多台 CDN 取资源，哪个快用哪个（any：只要一个成功就行）
Promise.any([
  fetch("//cdn1/x.jpg"),
  fetch("//cdn2/x.jpg"),
  fetch("//cdn3/x.jpg"),
]);
```

**手写 Promise.all**：

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;
        if (++completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

---
