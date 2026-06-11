---
title: "`Object.create`、`Object.setPrototypeOf`、`Object.assign` 的区别？"
---

# `Object.create`、`Object.setPrototypeOf`、`Object.assign` 的区别？

```js
// 1. Object.create(proto) —— 创建一个以 proto 为原型的"空"对象
const animal = {
  breath() {
    console.log("breathing");
  },
};
const dog = Object.create(animal);
dog.name = "Rex";
dog.breath(); // 'breathing'（从原型继承）

// 2. Object.setPrototypeOf(obj, proto) —— 动态修改原型（性能差，尽量避免）
const cat = { name: "Kitty" };
Object.setPrototypeOf(cat, animal);
cat.breath();

// 3. Object.assign(target, ...sources) —— 浅拷贝属性到 target
const obj = Object.assign({}, animal, { color: "brown" });
// 等价于 { ...animal, color: 'brown' }
// 注意：只拷贝"可枚举自有属性"，不拷贝原型、不拷贝 getter/setter（而是取值后赋值）
```

---
