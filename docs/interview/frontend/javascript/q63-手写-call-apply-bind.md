---
title: "手写 `call` / `apply` / `bind`"
---

# 手写 `call` / `apply` / `bind`

```js
// call
Function.prototype.myCall = function (ctx = globalThis, ...args) {
  const key = Symbol("fn");
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

// apply
Function.prototype.myApply = function (ctx = globalThis, args = []) {
  return this.myCall(ctx, ...args);
};

// bind
Function.prototype.myBind = function (ctx = globalThis, ...boundArgs) {
  const originalFn = this;
  return function boundFn(...callArgs) {
    // 支持 new 调用：new 优先级高于绑定的 this
    if (this instanceof boundFn) {
      return new originalFn(...boundArgs, ...callArgs);
    }
    return originalFn.apply(ctx, [...boundArgs, ...callArgs]);
  };
};
```
