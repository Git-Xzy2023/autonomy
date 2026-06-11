---
title: "`Object.entries` / `Object.fromEntries` 有什么用？"
---

# `Object.entries` / `Object.fromEntries` 有什么用？

```js
const obj = { a: 1, b: 2 };
const entries = Object.entries(obj); // [['a',1], ['b',2]]

// 对对象做 map/filter 很方便
Object.fromEntries(
  Object.entries(obj)
    .filter(([, v]) => v > 1)
    .map(([k, v]) => [k.toUpperCase(), v * 2]),
);
// { B: 4 }
```

---
