---
title: "`Symbol` 是什么？有哪些用途？"
---

# `Symbol` 是什么？有哪些用途？

`Symbol`（ES6）是一种「**唯一且不可变**」的原始类型，主要用于：

1. **作为对象 key 避免命名冲突**（比如给第三方库对象加私有数据）：
   ```js
   const MY_KEY = Symbol("my");
   const obj = { [MY_KEY]: 42 };
   obj[MY_KEY]; // 42
   ```
2. **控制对象的「元行为」（Well-known Symbols）**，比如：
   - `Symbol.iterator`：让对象可被 `for...of` 迭代
   - `Symbol.toPrimitive`：自定义对象如何被转成原始值
   - `Symbol.toStringTag`：自定义 `Object.prototype.toString.call(x)` 的结果
   - `Symbol.species`：派生类实例化时使用哪个构造器
   - `Symbol.asyncIterator`：定义异步迭代（`for await...of`）

```js
const obj = {
  [Symbol.toPrimitive](hint) {
    return hint === "number" ? 42 : "hello";
  },
};
Number(obj); // 42
String(obj); // "hello"
```

**注意**：Symbol 不会被 `for...in`、`Object.keys` 枚举到，也不会被 `JSON.stringify` 序列化；想要拿到 Symbol 键用 `Object.getOwnPropertySymbols(obj)`。

---
