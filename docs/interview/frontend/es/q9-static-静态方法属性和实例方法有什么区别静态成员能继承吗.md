---
title: "`static` 静态方法/属性和实例方法有什么区别？静态成员能继承吗？"
---

# `static` 静态方法/属性和实例方法有什么区别？静态成员能继承吗？

```js
class A {
  static hi() { return "hi from A"; }
  hello() { return "hello from instance"; }
}

A.hi();        // ✅
A.hello();     // ❌
new A().hi();  // ❌（实例访问不到 static）

class B extends A {}
B.hi();        // ✅ 静态成员也可以继承（本质是 B.__proto__ = A）
```

**关于 `this` 在静态方法里**：它指向类本身（因为是 `ClassName.method()` 调用），所以 `static` 方法内部可以用 `this` 访问另一个 `static` 成员。

---
