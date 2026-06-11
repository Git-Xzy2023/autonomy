---
title: "手写 `deepClone`（含循环引用）"
---

# 手写 `deepClone`（含循环引用）

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (map.has(obj)) return map.get(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map)
    return new Map([...obj].map(([k, v]) => [k, deepClone(v, map)]));
  if (obj instanceof Set)
    return new Set([...obj].map((v) => deepClone(v, map)));
  const clone = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  map.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}
```
