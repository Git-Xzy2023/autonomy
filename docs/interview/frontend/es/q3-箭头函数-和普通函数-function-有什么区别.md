---
title: "箭头函数 `() => {}` 和普通函数 `function() {}` 有什么区别？"
---

# 箭头函数 `() => {}` 和普通函数 `function() {}` 有什么区别？

核心区别有四个：

1. **没有自己的 `this`**：箭头函数的 `this` 继承自「定义时所在的作用域」，运行时不可改变（`call`/`apply`/`bind` 都无效）。
2. **没有 `arguments`**：想用可变参数请用剩余参数 `...args`。
3. **不能作为构造函数**：没有 `[[Construct]]` 内部槽位，`new` 会抛 `TypeError`。
4. **没有 `prototype` 属性**，自然也不能作为 `class` 里的方法使用 `super`。

**高频面试代码**：

```js
const obj = {
  name: "Alice",
  greet1() {
    setTimeout(() => console.log("arrow:", this.name), 0); // ✅ "Alice"，this 继承自 greet1 作用域
  },
  greet2() {
    setTimeout(function () {
      console.log("func:", this.name); // ❌ 空或 undefined，this 变成全局
    }, 0);
  },
};
obj.greet1();
obj.greet2();
```

> **经验法则**：需要自己的 `this` 时用普通函数（比如对象方法、类方法、事件处理回调）；其他场景（尤其是作为回调的一行函数）优先箭头函数。

---
