---
title: "`call` / `apply` / `bind` 的区别？手写一个 `bind`？"
---

# `call` / `apply` / `bind` 的区别？手写一个 `bind`？

| 方法                           | 参数形式             | 是否立刻执行  |
| ------------------------------ | -------------------- | ------------- |
| `fn.call(thisArg, a, b, c)`    | 参数挨个传           | ✅ 立即执行   |
| `fn.apply(thisArg, [a, b, c])` | 参数以"数组"形式传入 | ✅ 立即执行   |
| `fn.bind(thisArg, a, b)`       | 可部分应用参数       | ❌ 返回新函数 |

```js
function add(a, b) {
  return a + b;
}
add.call(null, 1, 2); // 3
add.apply(null, [1, 2]); // 3
const add1 = add.bind(null, 1);
add1(5); // 6

// 经典应用：把类数组转数组（ES6 前的写法，现在用 Array.from 更清晰）
function demoArgs() {
  const arr = Array.prototype.slice.call(arguments); // [1,2,3]
  return arr;
}
demoArgs(1, 2, 3);
```

**手写 bind（常考）**：

```js
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const originalFn = this; // 被绑定的原函数

  function boundFn(...callArgs) {
    // 关键：如果是 new 调用，忽略绑定的 this（new 优先级更高）
    const isNewCall = new.target !== undefined;
    return originalFn.apply(isNewCall ? this : thisArg, [
      ...boundArgs,
      ...callArgs,
    ]);
  }

  // 保持原型链（让 myBind 返回的函数在 instanceof 时表现正确）
  boundFn.prototype = Object.create(originalFn.prototype);
  return boundFn;
};
```

---
