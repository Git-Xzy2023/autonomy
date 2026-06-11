---
title: "什么是原型（Prototype）？每个对象都有 `__proto__` 吗？"
---

# 什么是原型（Prototype）？每个对象都有 `__proto__` 吗？

**原型 = 对象的"模板/父亲"**。几乎所有 JS 对象在创建时都关联另一个对象——它的"原型"，当访问对象上不存在的属性时，JS 会**沿着原型链向上找**。

```js
const obj = { name: "Alice" };
obj.__proto__ === Object.prototype; // true（非标准但浏览器都支持的属性）
Object.getPrototypeOf(obj) === Object.prototype; // ✅ 标准 API（推荐）

// 原型链：obj → Object.prototype → null
console.log(obj.toString()); // '[object Object]' —— 从 Object.prototype 继承
```

**构造函数 + `prototype` 属性**：

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(this.name + " makes a sound.");
};

const dog = new Animal("Rex");
dog.speak(); // 'Rex makes a sound.'

// ===== 三者关系（一定要记住这张图）=====
//   dog.__proto__         === Animal.prototype
//   Animal.prototype.constructor === Animal
//   Animal.__proto__      === Function.prototype
//   Animal.prototype.__proto__ === Object.prototype
```

**关于 `__proto__`**：它不是 ES 标准（但所有浏览器都实现过），**推荐用 `Object.getPrototypeOf / Object.setPrototypeOf / Object.create`**。

---
