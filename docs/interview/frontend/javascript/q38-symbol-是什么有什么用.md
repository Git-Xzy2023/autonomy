---
title: "`Symbol` 是什么？有什么用？"
---

# `Symbol` 是什么？有什么用？

**Symbol = 唯一且不可变的值**，主要用于"不冲突的属性键"。

```js
const s1 = Symbol("desc"); // 'desc' 只是描述（用于调试），不影响唯一性
const s2 = Symbol("desc");
s1 === s2; // false

// 1) 避免属性名冲突（最大的用途）
const SIZE = Symbol("size");
const obj = { name: "Alice", [SIZE]: 42 };
obj[SIZE]; // 42 —— 外部不知道键名时无法访问（非完美私有，但很常见）

// 2) 内部不会被 for...in / Object.keys 枚举（但会被 Object.getOwnPropertySymbols 看到）
Object.keys(obj); // ['name']
Object.getOwnPropertySymbols(obj); // [Symbol(size)]

// 3) 有名（共享）Symbol
Symbol.for("key"); // 相同 key 返回同一个 Symbol（全局注册表）
Symbol.keyFor(s); // 取出 key
```

**内置 Well-known Symbols**（JS 内部使用的"魔法"）：

| Symbol                 | 作用                                        |
| ---------------------- | ------------------------------------------- |
| `Symbol.iterator`      | 让对象可被 `for...of` 迭代                  |
| `Symbol.asyncIterator` | 异步迭代（`for await...of`）                |
| `Symbol.toStringTag`   | `Object.prototype.toString.call()` 返回时用 |
| `Symbol.toPrimitive`   | 对象转原始值时调用                          |
| `Symbol.species`       | 控制派生数组/Map 时使用的构造函数           |

---
