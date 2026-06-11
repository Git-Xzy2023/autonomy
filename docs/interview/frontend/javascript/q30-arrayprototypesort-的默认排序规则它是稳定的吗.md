---
title: "`Array.prototype.sort()` 的默认排序规则？它是稳定的吗？"
---

# `Array.prototype.sort()` 的默认排序规则？它是稳定的吗？

```js
// 默认：把元素转成字符串后按 Unicode 码点排！
[10, 2, 100].sort(); // [10, 100, 2] —— 因为 '10' < '100' < '2'（字符串比较）

// 正确写法：传比较函数
[10, 2, 100].sort((a, b) => a - b); // [2, 10, 100]  升序
["z", "A", "b"].sort((a, b) => a.localeCompare(b)); // 正确按字母序

// 对象排序
const users = [
  { name: "B", age: 20 },
  { name: "A", age: 30 },
];
users.sort((a, b) => a.age - b.age);
```

**稳定性**：ES2019 起，规范要求 `Array.prototype.sort` 必须是**稳定排序**（相同键的元素相对顺序不变）。现代浏览器都用 TimSort 或类似算法实现。

---
