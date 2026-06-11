---
title: "变量提升（Hoisting）是什么？`var`、`let`、`const`、`function` 的提升规则？"
---

# 变量提升（Hoisting）是什么？`var`、`let`、`const`、`function` 的提升规则？

**提升 = 变量/函数声明被"挪到"作用域顶部"的行为**。

```js
console.log(a); // undefined —— var 被"提升"但未赋值
// console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
// console.log(c); // ❌ 同上
var a = 1;
let b = 2;
const c = 3;

foo(); // ✅ 1 —— 函数声明整体被提升（包括实现）
function foo() {
  return 1;
}

bar(); // ❌ TypeError: bar is not a function —— var bar 提升为 undefined
var bar = function () {
  return 2;
};
```

**规则总览**：

| 声明方式                      | 是否提升                         | 提升后的"初始值"               | 访问时机限制                       |
| ----------------------------- | -------------------------------- | ------------------------------ | ---------------------------------- |
| `var`                         | ✅ 提升声明，不提升赋值          | `undefined`                    | 可在声明前访问（但值为 undefined） |
| `let`/`const`                 | ✅ 提升声明                      | 未初始化（Temporal Dead Zone） | 声明前访问 → ReferenceError        |
| 函数声明 `function f() {}`    | ✅ 整体提升（含实现）            | 函数体                         | 可在声明前调用                     |
| 函数表达式 `var f = () => {}` | 同 `var`（变量提升，不提升赋值） | `undefined`                    | 声明前调用 → TypeError             |

**TDZ（Temporal Dead Zone，暂时性死区）**：

```js
function demo() {
  // ← 从这里到 let/const 声明之前，是 x 的 TDZ
  console.log(x); // ❌ 哪怕 typeof 也会报错！
  let x = 5;
}
```

> **最佳实践**：不用 `var`，用 `let` + `const`。变量在使用前声明。函数用函数声明或箭头函数。

---
