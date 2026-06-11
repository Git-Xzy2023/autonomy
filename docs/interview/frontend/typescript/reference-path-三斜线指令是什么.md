---
title: "`/// <reference path='...' />` 三斜线指令是什么？"
---

# `/// <reference path="..." />` 三斜线指令是什么？

三斜线指令是 TS 早期用来"引用"其他声明文件的方式，**在现代项目中几乎不再使用**（被 ES Module 的 `import` 代替）。你可能在一些老的 `.d.ts` 文件和手动配置的场景中看到：

```ts
/// <reference types="node" />        // 引用 node 的类型声明
/// <reference lib="es2020" />        // 相当于在 tsconfig 的 lib 中添加 es2020
/// <reference path="other.d.ts" />   // 引用另一个声明文件
```
