---
title: "什么是解构（Destructuring）？常用写法有哪些？"
---

# 什么是解构（Destructuring）？常用写法有哪些？

**解构 = 「把右边结构拆开，赋值给左边的变量」**，数组和对象都支持。

```js
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5]; // a=1, b=2, rest=[3,4,5]
const [x, y = 10] = [1];                 // y 默认值 10

// 对象解构
const { name, age = 18 } = { name: "Tom" }; // name="Tom", age=18
const { name: fullName } = { name: "Tom" }; // 重命名：fullName="Tom"

// 嵌套解构
const {
  address: { city },
} = { address: { city: "SH" } };

// 函数参数解构（非常常用）
function api({ url, method = "GET" } = {}) {
  console.log(url, method);
}
```

**面试小坑**：

```js
let a = 1;
{ a } = { a: 99 };      // ❌ SyntaxError：{ 开头被当成块语句
({ a } = { a: 99 });    // ✅ 用括号包起来就是一个表达式
```

---
