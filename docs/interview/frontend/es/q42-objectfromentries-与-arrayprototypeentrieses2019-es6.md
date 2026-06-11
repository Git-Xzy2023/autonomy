---
title: "`Object.fromEntries` 与 `Array.prototype.entries`（ES2019 / ES6）"
---

# `Object.fromEntries` 与 `Array.prototype.entries`（ES2019 / ES6）

```js
// entries 把数组转成 [index, value] 迭代器
for (const [i, v] of ["a", "b", "c"].entries()) {
  console.log(i, v);
}

// fromEntries 把 [key, val] 对的集合（Map、二维数组、entries）转回对象
const m = new Map([["a", 1], ["b", 2]]);
Object.fromEntries(m); // { a: 1, b: 2 }
```

---
