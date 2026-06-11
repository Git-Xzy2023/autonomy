---
title: "用 `Object.fromEntries` + `Object.entries` 对对象做 filter："
---

# 用 `Object.fromEntries` + `Object.entries` 对对象做 filter：

```js
function pick(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k)),
  );
}
pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
```

---
