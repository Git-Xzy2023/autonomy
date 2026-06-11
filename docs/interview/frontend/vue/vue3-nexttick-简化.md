---
title: "Vue3 nextTick 简化"
---

# Vue3 nextTick 简化

Vue3 只使用 `Promise.resolve().then()`，不再做降级（因为 Vue3 不支持 IE）：

```js
// packages/runtime-core/src/scheduler.ts
const resolvedPromise = Promise.resolve();
export function nextTick(fn) {
  return fn ? resolvedPromise.then(fn) : resolvedPromise;
}
```
