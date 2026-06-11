---
title: "手写 `new`"
---

# 手写 `new`

```js
function myNew(Ctor, ...args) {
  if (typeof Ctor !== "function") throw new TypeError("must be a function");
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  return result !== null && typeof result === "object" ? result : obj;
}
```
