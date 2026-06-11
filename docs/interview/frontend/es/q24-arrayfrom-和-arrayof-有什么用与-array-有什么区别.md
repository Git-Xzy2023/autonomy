---
title: "`Array.from` 和 `Array.of` 有什么用？与 `Array()` 有什么区别？"
---

# `Array.from` 和 `Array.of` 有什么用？与 `Array()` 有什么区别？

```js
// Array.from: 把「类数组 / 可迭代对象」变成数组
Array.from("hello");                  // ['h','e','l','l','o']
Array.from(new Set([1, 2, 2]));       // [1, 2]
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]  —— 第二个参数是 mapFn

function foo() {
  return Array.from(arguments);       // 把 arguments 真转为数组
}

// Array.of: 用给定元素构造数组（解决 Array(3) 是"长度为3的空槽数组"这个历史坑）
Array.of(1, 2, 3);                    // [1,2,3]
Array.of(3);                          // [3]        而不是 [empty × 3]
Array(3);                             // [empty × 3]
```

---
