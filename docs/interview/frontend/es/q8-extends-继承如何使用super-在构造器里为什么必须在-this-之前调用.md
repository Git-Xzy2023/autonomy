---
title: "`extends` 继承如何使用？`super` 在构造器里为什么必须在 `this` 之前调用？"
---

# `extends` 继承如何使用？`super` 在构造器里为什么必须在 `this` 之前调用？

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 必须先 super()，因为子类的 this 是由父类构造器创建的
    super(name);
    this.breed = breed;
  }
  speak() {
    return super.speak() + ", woof!"; // 调用父类方法
  }
}
```

**为什么必须先 `super()` 才能访问 `this`**：
ES6 的 `class` 继承采用「先父后子」的构造顺序——子类自己不独立创建 `this`，而是等父类构造器（`super()`）返回一个 `this`，再用子类构造器的逻辑去初始化它。所以在 `super()` 之前，`this` 还没被初始化，访问会抛 `ReferenceError`。

---
