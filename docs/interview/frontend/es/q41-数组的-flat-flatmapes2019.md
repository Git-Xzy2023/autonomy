---
title: "数组的 `flat` / `flatMap`（ES2019）"
---

# 数组的 `flat` / `flatMap`（ES2019）

```js
const arr = [1, [2, [3, [4]]]];
arr.flat();      // [1, 2, [3, [4]]]      默认展开 1 层
arr.flat(2);     // [1, 2, 3, [4]]
arr.flat(Infinity); // [1, 2, 3, 4]

// flatMap = map + flat(1)
["hello world", "foo bar"].flatMap((s) => s.split(" "));
// ['hello','world','foo','bar']
```

---
