---
title: "什么是迭代器（Iterator）？什么是可迭代对象（Iterable）？"
---

# 什么是迭代器（Iterator）？什么是可迭代对象（Iterable）？

- **可迭代对象**：实现了 `[Symbol.iterator]` 方法（返回一个迭代器）的对象。
- **迭代器**：实现了 `next()` 方法，返回 `{ value, done }` 的对象。

```js
const arr = [1, 2, 3];
const it = arr[Symbol.iterator]();
it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: false }
it.next(); // { value: 3, done: false }
it.next(); // { value: undefined, done: true }
```

**能被 `for...of` 遍历的都满足「可迭代协议」**，包括数组、字符串、Map、Set、NodeList、arguments、`arguments` 对象等。

**手写一个可迭代对象**：

```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let value = this.from;
    return {
      next: () =>
        value <= this.to
          ? { value: value++, done: false }
          : { value: undefined, done: true },
    };
  },
};
for (const n of range) console.log(n); // 1 2 3 4 5
```

---
