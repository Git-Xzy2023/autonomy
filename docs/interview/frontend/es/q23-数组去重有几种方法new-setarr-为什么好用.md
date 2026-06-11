---
title: "数组去重有几种方法？`[...new Set(arr)]` 为什么好用？"
---

# 数组去重有几种方法？`[...new Set(arr)]` 为什么好用？

```js
const arr = [1, 2, 2, 3, 3, 3];

// 1) Set（最简洁，ES6+）
const r1 = [...new Set(arr)];   // [1, 2, 3]

// 2) filter + indexOf
const r2 = arr.filter((v, i) => arr.indexOf(v) === i);

// 3) reduce
const r3 = arr.reduce(
  (acc, v) => (acc.includes(v) ? acc : [...acc, v]),
  [],
);

// 4) Map 或对象做存在性表
const r4 = Array.from(new Map(arr.map((v) => [v, v])).values());
```

**为什么推荐 `[...new Set(arr)]`**：语义清晰、复杂度 O(n)、支持各种可迭代类型（字符串、Map、NodeList 都可以）。

> 注意 `Set` 判断相等使用「SameValueZero」——`NaN` 与 `NaN` 视为相等（能正确去重 `NaN`），但 `+0 === -0`，所以 `+0` 和 `-0` 会被当成同一个。

---
