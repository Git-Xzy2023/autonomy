---
title: "类的字段声明（Class Fields）有哪些新写法？"
---

# 类的字段声明（Class Fields）有哪些新写法？

ES2022 正式支持「类实例字段」、「私有字段」、「静态字段」、「静态块」的声明式写法：

```js
class Counter {
  // 实例公有字段（实例自身属性，不是原型属性）
  count = 0;

  // 实例私有字段
  #step = 1;

  // 静态公有字段（类自身属性）
  static MAX = 999;

  // 静态私有字段
  static #MIN = 0;

  // 静态初始化块（可以访问静态私有成员）
  static {
    // this === Counter
    this.initialized = true;
  }

  inc() { this.count += this.#step; }
}
```

**实例字段 vs 原型方法**：实例字段会出现在每个实例上（`new Counter().count`），而普通方法 `inc()` 仍然在 `Counter.prototype` 上（共享）。如果把函数写在实例字段里，那每个实例都有一份，可能消耗更多内存。

---
