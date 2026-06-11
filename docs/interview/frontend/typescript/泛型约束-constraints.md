---
title: "泛型约束（Constraints）"
---

# 泛型约束（Constraints）

默认情况下，泛型 `T` 可以是任意类型，所以你不能随意访问它的属性。通过 `extends` 加约束：

```ts
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length); // ✅ 因为约束了必须有 length 属性
  return arg;
}
logLength("hello"); // ✅ 字符串有 length
logLength([1, 2, 3]); // ✅ 数组有 length
logLength({ length: 5 }); // ✅
logLength(123); // ❌ number 没有 length
```

**约束为 keyof 某对象：**

```ts
// 限制 K 必须是 T 的键名之一
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Tom", age: 18 };
getProp(user, "name"); // ✅ 返回 string
getProp(user, "age"); // ✅ 返回 number
getProp(user, "addr"); // ❌ "addr" 不是 user 的键
```

这是一个非常经典的用法，可以用来写类型安全的属性访问器。
