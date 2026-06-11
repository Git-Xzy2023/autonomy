---
title: "私有字段 `#private` 是哪个版本引入的？和 `_private` 约定有什么区别？"
---

# 私有字段 `#private` 是哪个版本引入的？和 `_private` 约定有什么区别？

**`#` 私有字段（Private Class Fields）在 ES2022 正式成为标准**。

与 `_private` 下划线约定的区别：

| 方式 | 是否真的私有 | 是否可以外部访问 | 是否影响原型链 |
| --- | --- | --- | --- |
| `_name` | 仅是约定 | 依然可以直接读写 | 无 |
| `#name` | 真正私有 | 外部访问报 `SyntaxError`，`Object.keys` 也拿不到 | 每个实例自带（非共享） |

```js
class Person {
  #age = 0;             // 私有字段必须先声明
  constructor(age) { this.#age = age; }
  get age() { return this.#age; }
}

const p = new Person(18);
p.age;          // ✅ 通过 getter 访问
// p.#age;      // ❌ SyntaxError（静态语法检查阶段就会报错）
```

> 面试中可能顺带考：`private`（TS 的修饰符） vs `#`（ES 原生）。区别是 TS 的 `private` 只是编译期检查，运行时仍然能访问到；`#` 是运行时真正的私有。

---
