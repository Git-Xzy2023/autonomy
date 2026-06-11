---
title: "async/await 是 Promise 的语法糖吗？它背后发生了什么？"
---

# async/await 是 Promise 的语法糖吗？它背后发生了什么？

**是的**，`async/await` 本质上是「Promise + 生成器协程」的语法糖。编译器会把 `await` 前后的代码切分成多个 `.then` 回调串起来。

一个简化视角：`await` 等价于把后续代码包在 `.then(...)` 里；`try/catch` 包裹 `await` 等价于 `.catch(...)`。

```js
async function demo() {
  const a = await fetchA();
  const b = await fetchB(a);
  return { a, b };
}

// 大致等价于：
function demo() {
  return fetchA().then((a) => fetchB(a).then((b) => ({ a, b })));
}
```

**面试考点**：

- `async` 函数永远返回 Promise，哪怕你直接 `return 1` → `Promise.resolve(1)`；
- `await` 后面跟非 Promise 会被自动 `Promise.resolve(x)` 包装；
- `await` 会让当前函数「暂停」并让出线程，但**不会阻塞整个 JS 引擎**（其他代码依然可以跑）；
- 要并行多个 Promise，请先启动它们再 `await`：
  ```js
  // ❌ 串行
  const a = await slowA();
  const b = await slowB();

  // ✅ 并行
  const [pa, pb] = [slowA(), slowB()];
  const [a, b] = [await pa, await pb];
  // 或：const [a, b] = await Promise.all([slowA(), slowB()]);
  ```

---
