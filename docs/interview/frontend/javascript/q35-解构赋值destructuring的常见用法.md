---
title: "解构赋值（Destructuring）的常见用法？"
---

# 解构赋值（Destructuring）的常见用法？

```js
// 1) 对象解构 + 默认值 + 重命名
const user = { name: "Alice", age: 30, address: { city: "Beijing" } };
const {
  name,
  age: years, // 重命名为 years
  gender = "unknown", // 默认值（值为 undefined 时生效）
  address: { city }, // 深度解构
} = user;
console.log(name, years, gender, city); // 'Alice', 30, 'unknown', 'Beijing'

// 2) 数组解构 + 交换变量
const [first, , third] = [1, 2, 3];
let a = 1,
  b = 2;
[a, b] = [b, a]; // a=2, b=1（无需中间变量！）

// 3) 函数参数解构（最常用）
function createUser({ name, age = 18, role = "user" } = {}) {
  // ={} 防止传 undefined 时报错
  return { name, age, role };
}
createUser({ name: "Alice" });

// 4) 解构 + 剩余参数
const [head, ...rest] = [1, 2, 3, 4];
const { x, ...others } = { x: 1, y: 2, z: 3 };
```

---
