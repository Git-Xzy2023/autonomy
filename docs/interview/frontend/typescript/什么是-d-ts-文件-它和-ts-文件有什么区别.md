---
title: "什么是 `.d.ts` 文件？它和 `.ts` 文件有什么区别？"
---

# 什么是 `.d.ts` 文件？它和 `.ts` 文件有什么区别？

`.d.ts` 是 TypeScript 的**声明文件**（Declaration File），只包含类型声明，**不包含任何可执行代码**，编译后不会产生 JS。

```ts
// math.d.ts —— 声明文件
export function add(a: number, b: number): number;
export const PI: number;

// math.js —— 实际实现（运行时使用）
// module.exports = { add: (a, b) => a + b, PI: 3.14 };
```

**何时需要自己写声明文件：**

1. **为纯 JS 库提供类型**（如旧版 jQuery、lodash-es 之前的 lodash）
2. **为项目中的非 TS 文件声明类型**（如图片、CSS Modules）
3. **扩展全局对象**（如给 `window` 增加属性）
