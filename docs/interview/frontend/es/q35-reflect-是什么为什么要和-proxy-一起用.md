---
title: "`Reflect` 是什么？为什么要和 Proxy 一起用？"
---

# `Reflect` 是什么？为什么要和 Proxy 一起用？

`Reflect` 是一个包含「对应每个 Proxy 陷阱的标准操作」的对象，它有两个好处：

1. **统一返回 boolean**：`Reflect.set(obj, 'k', v)` 返回是否成功，而 `obj.k = v` 在严格模式下会抛错。
2. **让 Proxy 的行为保持与默认行为一致**：在 handler 里，你需要「做了额外的事之后，把默认语义交还给 JS 引擎」，这时就用 `Reflect`。

```js
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("访问了", key);
    return Reflect.get(target, key, receiver); // receiver 用来处理 getter 的 this
  },
});
```

> 面试小知识：`Reflect.has(obj, 'x')` 等价于 `'x' in obj`；`Reflect.deleteProperty(obj, 'x')` 等价于 `delete obj.x`。

---
