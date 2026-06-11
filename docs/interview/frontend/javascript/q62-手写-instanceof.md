---
title: "手写 `instanceof`"
---

# 手写 `instanceof`

```js
function myInstanceof(obj, Ctor) {
  if (obj === null || typeof obj !== "object") return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```
