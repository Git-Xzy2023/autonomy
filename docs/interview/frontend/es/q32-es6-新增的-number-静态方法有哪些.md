---
title: "ES6 新增的 `Number` 静态方法有哪些？"
---

# ES6 新增的 `Number` 静态方法有哪些？

```js
Number.isFinite(1 / 0);    // false（比全局 isFinite 更严格，不做类型转换）
Number.isInteger(3.0);     // true
Number.isNaN(NaN);         // true（不会把字符串 "NaN" 误判成 NaN）
Number.parseFloat("3.14"); // 等于全局 parseFloat，语义更清晰
Number.parseInt("10", 2);  // 把二进制字符串转整数

// 数学上有用的常量
Number.EPSILON;            // 2^-52，表示 1 和"最接近 1 的浮点数"的差
Number.MAX_SAFE_INTEGER;   // 2^53 - 1
Number.MIN_SAFE_INTEGER;   // -(2^53 - 1)
```

---
