---
title: "手写 `flat`（数组扁平化）"
---

# 手写 `flat`（数组扁平化）

```js
function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flat(item, depth - 1) : item);
  }, []);
}
// flat([1, [2, [3, [4]]]], 2) → [1, 2, 3, [4]]

// 无限层级
const deepFlat = (arr) =>
  arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? deepFlat(v) : v), []);
```
