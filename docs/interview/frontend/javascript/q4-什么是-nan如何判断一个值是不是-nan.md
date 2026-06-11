---
title: "什么是 NaN？如何判断一个值是不是 NaN？"
---

# 什么是 NaN？如何判断一个值是不是 NaN？

**NaN = Not a Number**（"不是数字"），但它自身的类型却是 `number` 😄。

```js
typeof NaN === "number"; // ✅ true（反直觉）
NaN === NaN; // ❌ false（唯一自己不等于自己的值）

// 判断 NaN
isNaN("hello"); // ⚠️ true —— 会先转数字（'hello' → NaN）
Number.isNaN("hello"); // ✅ false —— 仅当参数本身就是 NaN 才返回 true
Number.isNaN(NaN); // ✅ true
Object.is(NaN, NaN); // ✅ true（ES6 新增，还能区分 +0 和 -0）
```

---
