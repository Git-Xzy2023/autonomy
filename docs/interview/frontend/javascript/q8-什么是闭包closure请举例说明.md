---
title: "什么是闭包（Closure）？请举例说明。"
---

# 什么是闭包（Closure）？请举例说明。

**闭包 = 函数 + 它"出生"时能访问的外部变量**。一个函数在定义时"捕获"了外层作用域的变量，即使外层函数已执行完毕，内部函数仍能访问那些变量。

```js
function makeCounter() {
  let count = 0; // ← 这个变量被"关在"闭包里
  return function () {
    // ← 返回的函数引用了 count，形成闭包
    return ++count;
  };
}
const c = makeCounter();
console.log(c()); // 1
console.log(c()); // 2
console.log(c()); // 3
// count 变量在外部完全不可见，只能通过 c() 访问 —— 这就是"私有变量"
```

**经典面试题 —— 循环 + setTimeout**：

```js
// 经典陷阱：全部输出 5！（因为 var i 只有一份，循环结束 i=5，setTimeout 到时再读它）
for (var i = 1; i <= 5; i++) {
  setTimeout(() => console.log(i), 0);
}

// 方案 1：let（每次循环一个块级作用域副本）
for (let i = 1; i <= 5; i++) {
  setTimeout(() => console.log(i), 0);
}

// 方案 2：IIFE 立即执行函数（创建新作用域把 i 快照下来）
for (var i = 1; i <= 5; i++) {
  (function (n) {
    setTimeout(() => console.log(n), 0);
  })(i);
}
```

**闭包的用途**：

| 用途               | 示例                                                                |
| ------------------ | ------------------------------------------------------------------- |
| 模块私有化         | `const module = (() => { let _private; return { /* API */ }; })();` |
| 函数工厂           | `makeAdder(5)(3) = 8`                                               |
| 柯里化             | `const add = a => b => a + b`                                       |
| 缓存 / Memoization | 把结果存在闭包变量里避免重算                                        |
| 回调保持上下文     | 事件处理函数、Promise.then 里使用外层变量                           |

**闭包的风险 —— 内存泄漏**：

```js
function bigData() {
  const huge = new Array(10_000_000).fill("*"); // 占用大量内存
  return function () {
    return huge.length;
  }; // 闭包引用 huge
}
const leak = bigData();
// bigData 已返回，但 huge 无法被 GC —— 因为 leak 还引用着它
// 解决：leak = null; 让闭包对象失去引用
```

---
