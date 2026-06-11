---
title: "`hasOwnProperty` / `in` / `for...in` 的区别？"
---

# `hasOwnProperty` / `in` / `for...in` 的区别？

```js
const obj = { name: "Alice" };
Object.prototype.sayHi = () => {}; // 在原型上加一个方法

"name" in obj; // ✅ true（包括继承的属性）
"sayHi" in obj; // ✅ true（原型上的）
obj.hasOwnProperty("name"); // ✅ true
obj.hasOwnProperty("sayHi"); // ❌ false

// for...in 会枚举"所有可枚举属性（包括原型链上的）"
for (const k in obj) {
  // name, sayHi
  if (obj.hasOwnProperty(k)) {
    /* 过滤出自身属性 */
  }
}

// 想要只拿自身键 —— 用 Object.keys / Object.values / Object.entries
Object.keys(obj); // ['name']（不包含原型）
```

---
