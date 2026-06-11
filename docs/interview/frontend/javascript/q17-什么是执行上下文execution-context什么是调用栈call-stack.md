---
title: "什么是执行上下文（Execution Context）？什么是调用栈（Call Stack）？"
---

# 什么是执行上下文（Execution Context）？什么是调用栈（Call Stack）？

**执行上下文 = "执行一段代码时 JS 引擎需要知道的所有信息"**，包括：

- 变量环境（`var`/函数声明）
- 词法环境（`let/const`、块级作用域）
- `this` 绑定

**三种类型**：

| 类型            | 创建时机                               |
| --------------- | -------------------------------------- |
| 全局执行上下文  | 程序启动时创建，有且仅有一个           |
| 函数执行上下文  | 函数被调用时创建（每次调用都新建一个） |
| eval 执行上下文 | （忽略）                               |

**调用栈（Call Stack / Execution Stack）**：JS 是单线程的，所以只有一个栈。函数调用时压栈，返回时出栈。

```js
function a() {
  console.trace();
  b();
}
function b() {
  console.trace();
  c();
}
function c() {
  console.trace();
}
a();
// 栈：
//  [global]
//  [global, a]
//  [global, a, b]
//  [global, a, b, c]
//  c 返回 → 弹出 → b 返回 → 弹出 → a 返回 → 弹出 → 回到 global
```

**栈溢出（Stack Overflow）**：无限递归导致调用栈超过引擎限制（Chrome 约 1 万层）。

```js
function blowUp() {
  blowUp();
}
blowUp(); // RangeError: Maximum call stack size exceeded
```

---
