---
title: "`new` 关键字到底做了什么？"
---

# `new` 关键字到底做了什么？

**四步走**：

```js
function Person(name) {
  this.name = name;
}

// 写一个简化版的 myNew
function myNew(constructor, ...args) {
  // 1) 新建空对象，把它的 __proto__ 指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);

  // 2) 调用构造函数，this 绑定到新对象
  const result = constructor.apply(obj, args);

  // 3) 如果构造函数返回了"对象"，则返回该对象；否则返回 obj
  return result instanceof Object ? result : obj;
}

const p = myNew(Person, "Alice");
p.name; // 'Alice'
p instanceof Person; // true
```

> **关键**：`new` 的本质是"给你一个继承了 `Constructor.prototype` 的空对象，然后用 Constructor 初始化它"。

---
