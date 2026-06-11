---
title: "装饰器（Decorators）目前在 TC39 处于什么阶段？怎么使用？"
---

# 装饰器（Decorators）目前在 TC39 处于什么阶段？怎么使用？

**装饰器（Decorators）在 ES2023 之后的 TC39 流程中进入 Stage 4，已成为标准**。Babel 早有 legacy 版实现（`@decorator`），但与标准语法不同，请注意区分。

标准用法示例（给类的方法加装饰）：

```ts
function logged(target, context) {
  return function (...args) {
    console.log("calling", context.name);
    return target.apply(this, args);
  };
}

class Greeter {
  @logged
  hello(name) { return "hi " + name; }
}
new Greeter().hello("Alice"); // 打印 "calling hello"
```

> 面试提示：如果你用的是 TypeScript / Babel 老版装饰器，会看到 `@decorator class C {}`、`descriptor`、`(target, key, descriptor)` 形式。这与标准装饰器签名不一样，注意区分「标准」与「Babel legacy / TS experimental」。

---
