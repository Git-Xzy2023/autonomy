---
title: "对象新增的方法？`Object.assign` 和展开运算符 `{...a, ...b}` 有区别吗？"
---

# 对象新增的方法？`Object.assign` 和展开运算符 `{...a, ...b}` 有区别吗？

| 方法 | 作用 |
| --- | --- |
| `Object.assign(target, ...sources)` | 把 sources 上**可枚举自有属性**浅复制到 target |
| `Object.is(a, b)` | 比 `===` 更「数学上严格」的相等：`Object.is(NaN, NaN) === true`；`Object.is(+0, -0) === false` |
| `Object.getOwnPropertyDescriptors` | 获取所有自有属性的描述符（用于拷贝 getter/setter） |
| `Object.fromEntries(iter)` | ES2019，把 `[key, value]` 对转成对象（`Object.entries` 的反操作） |
| `Object.hasOwn(obj, key)` | ES2022，推荐替代 `obj.hasOwnProperty(key)` 的写法（更安全，防止对象覆盖了 hasOwnProperty） |

**`Object.assign` 与展开**：两者几乎等价（都做浅拷贝）。展开运算符更推荐用于「创建新对象」：

```js
const merged = { ...a, ...b };       // 纯表达式，不修改任何对象
Object.assign(a, b);                  // 会修改 a
```

---
