---
title: "迭代器（Iterator）与生成器（Generator）？"
---

# 迭代器（Iterator）与生成器（Generator）？

**迭代器协议**：对象有 `next()` 方法，返回 `{ value, done }`。

**可迭代协议**：对象有 `[Symbol.iterator]()` 方法，返回一个迭代器 → 可被 `for...of`、`...` 展开、解构。

```js
// 让一个自定义对象可迭代
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let cur = this.from;
    return {
      // 返回迭代器
      next: () => ({
        value: cur,
        done: cur++ > this.to,
      }),
    };
  },
};
[...range]; // [1,2,3,4,5]
for (const v of range) console.log(v);
```

**生成器（Generator） = 函数体内可以"暂停 + 恢复"的函数**：

```js
function* gen() {
  console.log("start");
  yield 1; // 暂停 + 产出 1
  yield 2; // 暂停 + 产出 2
  return 3; // 结束
}
const g = gen();
g.next(); // {value: 1, done: false}  同时打印 'start'
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: true}
g.next(); // {value: undefined, done: true}

// 让上面的 range 写法大幅简化
const range2 = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
```

**生成器的高级玩法**：

```js
// 1) 双向通信：next(arg) 能把值"注入"到 yield 表达式的位置
function* echo() {
  const msg = yield "ready";
  yield "got: " + msg;
}
const e = echo();
e.next(); // {value: 'ready'}
e.next("hello"); // {value: 'got: hello'}

// 2) yield* 委托给另一个生成器
function* foo() {
  yield* [1, 2, 3];
}
[...foo()]; // [1,2,3]

// 3) return / throw：调用者终止/让生成器抛错
function* bar() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("cleanup");
  }
}
const b = bar();
b.next(); // {1, false}
b.return("end"); // {value: 'end', done: true}，同时触发 finally
```

---
