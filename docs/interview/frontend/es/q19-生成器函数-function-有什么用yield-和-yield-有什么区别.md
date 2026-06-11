---
title: "生成器函数 `function*` 有什么用？`yield` 和 `yield*` 有什么区别？"
---

# 生成器函数 `function*` 有什么用？`yield` 和 `yield*` 有什么区别？

**生成器 = 可暂停 / 可恢复的函数**，执行它会返回一个「生成器对象」（同时是迭代器也是可迭代对象）。

```js
function* count(n) {
  for (let i = 0; i < n; i++) {
    yield i;               // 暂停并把 i 作为 next().value 抛出
  }
}
for (const n of count(3)) console.log(n); // 0 1 2
```

**`yield*` = 委托给另一个可迭代对象**：

```js
function* foo() {
  yield* [1, 2, 3];        // 等价于 for (const x of [1,2,3]) yield x;
  yield* "ab";             // 可以委托字符串、Map、其他生成器
}
[...foo()]; // [1, 2, 3, 'a', 'b']
```

**面试场景**：

- 用生成器实现「无限序列」（不会爆内存）：
  ```js
  function* fib() {
    let [a, b] = [0, 1];
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }
  const g = fib();
  g.next().value; // 0
  g.next().value; // 1
  g.next().value; // 1
  g.next().value; // 2
  ```
- 基于生成器做「异步流程控制」（早期的 co 库，现在已被 async/await 取代）。

---
