---
title: "手写 `throttle`（时间戳 + 定时器双版本）"
---

# 手写 `throttle`（时间戳 + 定时器双版本）

```js
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```
