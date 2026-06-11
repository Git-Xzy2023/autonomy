---
title: "`async/await` 是什么？它只是 Promise 的语法糖吗？"
---

# `async/await` 是什么？它只是 Promise 的语法糖吗？

**`async` 函数 = 返回 Promise 的函数**。
**`await` = 暂停当前 async 函数，等待 Promise 解决后再继续**。

```js
async function fetchUser(id) {
  const res = await fetch(`/user/${id}`); // 暂停，让出线程
  const user = await res.json(); // 继续
  return user; // 返回值会被包成 Promise
}

fetchUser(1).then((u) => console.log(u));
```

**要点**：

```text
① async 函数永远返回 Promise（哪怕你 return 1 → Promise<1>）
② await 只能用在 async 函数里（除了 ES2022 的 Top-level await）
③ await 后面跟非 Promise → 自动转成 Promise.resolve(x)
④ try/catch 能捕获 await 抛出的错误 —— 这是比 .then 链式更直观的地方
⑤ await 是"按顺序等待"，要并行必须先把 Promise 启动：
```

```js
// ❌ 串行（1s + 1s = 2s）
const a = await slowFetch("/a");
const b = await slowFetch("/b");

// ✅ 并行（只要 1s）
const [pa, pb] = [slowFetch("/a"), slowFetch("/b")];
const [a, b] = [await pa, await pb];
// 或：
const [a, b] = await Promise.all([slowFetch("/a"), slowFetch("/b")]);
```

**它只是语法糖吗？**——是的。`async/await` 背后本质是 Promise + 协程（JS 引擎把 await 前后的代码"切成"多个 `.then` 回调）。但它让异步代码"看上去像同步"，极大降低心智负担。

---
