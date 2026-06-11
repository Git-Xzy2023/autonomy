---
title: "`for...in` 和 `for...of` 有什么区别？"
---

# `for...in` 和 `for...of` 有什么区别？

| 维度 | `for (const k in obj)` | `for (const v of iter)` |
| --- | --- | --- |
| 遍历什么 | **键名**（包括原型链上可枚举的） | **值**（来自迭代器 `next().value`） |
| 适用对象 | 普通对象（数组也能用，但不推荐） | 实现了 `Symbol.iterator` 的对象：数组/字符串/Map/Set… |
| 数组索引 | 得到字符串 "0"、"1"…… | 得到数组元素的值 |
| 能否遍历原型 | 会（除非过滤 `hasOwnProperty`） | 不会（由迭代器决定产出什么） |

```js
const arr = ["a", "b", "c"];
for (const i in arr) console.log(i);        // "0" "1" "2"（字符串索引）
for (const v of arr) console.log(v);        // "a" "b" "c"

const obj = { a: 1, b: 2 };
for (const k in obj) console.log(k);        // "a" "b"
// for (const v of obj) console.log(v);     // ❌ obj 不是可迭代对象
```

---
