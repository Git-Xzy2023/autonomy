---
title: "async / await"
---

# async / await

ES2017 语法，本质是 Promise 的「语法糖」，让异步代码看起来像同步。

```js
async function main() {
  try {
    const a = await readFile("a.txt", "utf8");
    const b = await readFile("b.txt", "utf8");
    await fs.promises.writeFile("c.txt", a + b); // Node 10+ 内置 fs.promises
  } catch (err) {
    console.error(err);
  }
}
main();

// 并行执行（推荐）
async function parallel() {
  const [a, b] = await Promise.all([
    readFile("a.txt", "utf8"),
    readFile("b.txt", "utf8"),
  ]);
}
```

**关键要点：**

- `async` 函数永远返回 Promise，`return x` 等价于 `return Promise.resolve(x)`
- `await` 只能出现在 `async` 函数内部（或 ES Module 顶层）
- `await` 会「让出线程」，把后面的代码变成微任务排队执行
- `await` 只能等待 Promise（其他值会被包成 `Promise.resolve(v)`）
