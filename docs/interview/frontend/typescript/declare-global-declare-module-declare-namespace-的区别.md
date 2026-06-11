---
title: "`declare global`、`declare module`、`declare namespace` 的区别？"
---

# `declare global`、`declare module`、`declare namespace` 的区别？

```ts
// 1. declare global —— 扩展全局作用域（必须在模块中使用，即文件有 import/export）
declare global {
  interface Window {
    myGlobal: { version: string };
  }
}
window.myGlobal.version; // ✅

// 2. declare module —— 声明一个模块的类型
declare module "*.svg" {
  const content: string;
  export default content;
}
// 现在 import logo from "./logo.svg" 不会报错

// 3. declare namespace —— 声明命名空间（历史遗留，现代 TS 用 ES Module 代替）
declare namespace MyLib {
  function doSomething(): void;
  const version: string;
}
MyLib.doSomething();
```
