---
title: "展开运算符 `...` 与 `Object.assign`、`Array.concat` 的关系？"
---

# 展开运算符 `...` 与 `Object.assign`、`Array.concat` 的关系？

```js
// 数组展开 —— 等价于 concat / apply
const arr = [1, 2, ...[3, 4], 5]; // [1,2,3,4,5]
Math.max(...[1, 5, 3]); // 5（之前要写 Math.max.apply(null, [...])）

// 对象展开 —— 浅拷贝 + 合并（后面的键覆盖前面的）
const user = { name: "Alice" };
const withAge = { ...user, age: 30 };
const override = { ...user, name: "Alicia" }; // { name: 'Alicia' }

// 等价写法：
Object.assign({}, user, { age: 30 });
// ❗ 注意：第一个参数是"被修改的目标对象"——传 {} 才能得到新对象
// 常见错误：Object.assign(user, {age: 30}) —— user 被修改了！
```

> **陷阱**：展开运算符是**浅拷贝**，嵌套对象仍是共享引用。

---
