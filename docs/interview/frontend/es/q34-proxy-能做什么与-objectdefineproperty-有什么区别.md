---
title: "`Proxy` 能做什么？与 `Object.defineProperty` 有什么区别？"
---

# `Proxy` 能做什么？与 `Object.defineProperty` 有什么区别？

**Proxy（ES6）= 在目标对象外面套一层「拦截器」**，可以拦截对对象的各种操作：

```js
const obj = { name: "Alice" };
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("get", key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("set", key, value);
    return Reflect.set(target, key, value, receiver);
  },
  has(target, key) { return key in target; },
  deleteProperty(target, key) { /* ... */ },
  apply(target, thisArg, args) { /* 如果 target 是函数 */ },
  construct(target, args) { /* 如果 target 是构造函数 */ },
  // 还有 defineProperty, getOwnPropertyDescriptor, getPrototypeOf, setPrototypeOf,
  // ownKeys, preventExtensions, isExtensible …共 13 种拦截
});

proxy.name; // 触发 get；返回 "Alice"
proxy.age = 18; // 触发 set
```

**与 `Object.defineProperty` 对比**：

| 维度 | `Object.defineProperty` | `new Proxy(target, handler)` |
| --- | --- | --- |
| 作用时机 | 修改单个属性的描述符（对属性生效） | 对**整个对象**做拦截（对象层级生效） |
| 对新增属性生效？ | 不会，只影响已经 defineProperty 的属性 | 会，任何 key 都走 handler |
| 对数组下标/length 生效？ | 需要单独处理 | 自动生效 |
| 是否改变原对象 | 是 | 不改变；返回一个新代理对象 |
| 可拦截操作种类 | get/set 等 6 种（configurable/writable/enumerable/value/get/set） | 13 种（包括 `in`、`delete`、`for...in`、函数调用、`new` 等） |

**典型应用**：

- Vue3 用 `Proxy` 替代 Vue2 的 `Object.defineProperty`，实现了对数组下标、新增属性的原生响应式支持。
- 数据校验（set 前校验类型）、默认值、不可变对象代理、日志/埋点。

---
