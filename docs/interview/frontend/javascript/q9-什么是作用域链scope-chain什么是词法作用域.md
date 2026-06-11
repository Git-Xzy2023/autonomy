---
title: "什么是作用域链（Scope Chain）？什么是词法作用域？"
---

# 什么是作用域链（Scope Chain）？什么是词法作用域？

**词法作用域（Lexical Scoping）= 静态作用域**：函数的"能访问哪些变量"由它**定义的位置**决定，而不是**调用位置**。JS 就是词法作用域（除 `with`/`eval` 例外）。

```js
const x = 1;
function f() {
  console.log(x);
} // f 定义处引用 x → 指向外层 x=1
function g() {
  const x = 2;
  f(); // 输出 1，不是 2！因为 f 的作用域链在"定义时"已锁定
}
g(); // 1
```

**作用域链查找规则**：当前作用域找不到 → 往上一层（定义它的父作用域）→ 全局 → `ReferenceError`。

---
