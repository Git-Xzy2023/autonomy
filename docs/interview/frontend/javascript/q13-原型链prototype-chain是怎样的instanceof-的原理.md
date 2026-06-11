---
title: "原型链（Prototype Chain）是怎样的？`instanceof` 的原理？"
---

# 原型链（Prototype Chain）是怎样的？`instanceof` 的原理？

```text
dog ---> Animal.prototype ---> Object.prototype ---> null
                        speak()              toString()
```

**属性查找**：`dog.speak` → dog 本身没有 → 到 `Animal.prototype` 找到 → 返回。
**属性设置**：直接赋值给对象本身，不动原型（除非原型上有 setter）。

**`instanceof` 的原理**：沿着 `__proto__` 链一路向上找，如果某个 `__proto__ === Constructor.prototype` 即返回 true。

```js
// 手写 instanceof
function myInstanceOf(obj, Ctor) {
  if (obj === null || typeof obj !== "object") return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

myInstanceOf([], Array); // true
myInstanceOf([], Object); // true
myInstanceOf(/abc/, RegExp); // true
```

---
