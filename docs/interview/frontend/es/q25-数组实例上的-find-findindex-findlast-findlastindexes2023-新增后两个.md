---
title: "数组实例上的 `find` / `findIndex` / `findLast` / `findLastIndex`？（ES2023 新增后两个）"
---

# 数组实例上的 `find` / `findIndex` / `findLast` / `findLastIndex`？（ES2023 新增后两个）

```js
const arr = [1, 2, 3, 4, 5, 2];
arr.find((n) => n > 2);        // 3（第一个满足的元素）
arr.findIndex((n) => n > 2);   // 2（第一个满足的索引）
arr.findLast((n) => n === 2);  // 2（从后往前找第一个）
arr.findLastIndex((n) => n === 2); // 5

// 找不到时：
arr.find((n) => n > 100);      // undefined
arr.findIndex((n) => n > 100); // -1
```

---
