---
title: "手写 `debounce` 支持 `immediate`"
---

# 手写 `debounce` 支持 `immediate`

```js
function debounce(fn, delay, immediate = false) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    if (immediate && !timer) {
      fn.apply(this, args); // 第一次立即执行
      timer = setTimeout(() => (timer = null), delay);
    } else {
      timer = setTimeout(() => fn.apply(this, args), delay);
    }
  };
}
```
