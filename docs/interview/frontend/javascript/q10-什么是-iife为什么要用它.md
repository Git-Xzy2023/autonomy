---
title: "什么是 IIFE？为什么要用它？"
---

# 什么是 IIFE？为什么要用它？

**IIFE = Immediately Invoked Function Expression = 立即执行函数表达式**。

```js
// 形式 1
(function () {
  const x = 42; // 局部变量，不污染全局
  console.log(x);
})();

// 形式 2（箭头函数）
(() => {
  /* ... */
})();

// 用括号、!、+、~、void 都可以把 function 变成"表达式"
!(function () {
  /* ... */
})();
```

**为什么需要它**（ES6 之前）：

1. **创建私有作用域**，避免变量泄露到全局。
2. **模块化**——经典的"模块模式"：

```js
const Module = (function () {
  let _count = 0; // 私有（外部永远访问不到）
  return {
    inc() {
      return ++_count;
    },
    get() {
      return _count;
    },
  };
})();
Module.inc(); // 1
Module._count; // undefined
```

> **ES6 时代的替代**：用 **ES Module**（`import/export`）或者 **块级作用域 + let/const**，IIFE 越来越少用。

---
