---
title: "严格模式（`'use strict'`）有什么影响？"
---

# 严格模式（`"use strict"`）有什么影响？

```js
"use strict"; // 可以写在文件顶部（全局严格），或函数第一行（函数严格）

// 1. 变量必须声明
// x = 42;  // ❌ ReferenceError

// 2. 普通函数调用的 this = undefined（不再是全局对象）
function f() {
  return this;
}
f(); // undefined（非严格模式下是 window）

// 3. 不允许重复参数名
// function g(a, a) {} // ❌

// 4. arguments 与形参不再"同步"（非严格模式下会双向同步）
function h(a) {
  a = 99;
  return arguments[0];
}
h(1); // 1（严格模式下 arguments[0] 不再跟着 a 变）

// 5. 禁止 with / eval 引入变量
// with (Math) { console.log(PI); } // ❌

// 6. 禁止删除不可配置属性；禁止给不可扩展对象加属性
// delete Object.prototype; // ❌ TypeError

// 7. 保留字限制：implements、interface、let、package、private... 不可作变量名
```

---
