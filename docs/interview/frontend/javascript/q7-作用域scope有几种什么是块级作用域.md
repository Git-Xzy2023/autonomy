---
title: "作用域（Scope）有几种？什么是块级作用域？"
---

# 作用域（Scope）有几种？什么是块级作用域？

```text
1. 全局作用域：最外层，污染全局
2. 函数作用域：每一个 function 都是一个新作用域
3. 块级作用域：{ } 里的 let/const（ES6 引入）
4. 模块作用域：ES Module 的顶层作用域（不污染全局）
5. eval / with（不推荐）
```

```js
// var 只有函数/全局作用域，没有块级作用域 —— 经典坑
for (var i = 0; i < 3; i++) {}
console.log(i); // 3（i 泄露到外层了！）

// let/const 有块级作用域
for (let j = 0; j < 3; j++) {}
// console.log(j); // ❌ j is not defined

// if 同理
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x); // 1
// console.log(y); // ❌
```

---
