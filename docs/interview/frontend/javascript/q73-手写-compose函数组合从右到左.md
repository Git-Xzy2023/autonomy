---
title: "手写 `compose`（函数组合，从右到左）"
---

# 手写 `compose`（函数组合，从右到左）

```js
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
const add1 = (x) => x + 1;
const double = (x) => x * 2;
const add1ThenDouble = compose(double, add1);
add1ThenDouble(5); // (5+1)*2 = 12

// pipe（从左到右）
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
```
