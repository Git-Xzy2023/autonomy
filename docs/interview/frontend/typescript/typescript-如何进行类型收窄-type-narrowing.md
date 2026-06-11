---
title: "TypeScript 如何进行类型收窄（Type Narrowing）？"
---

# TypeScript 如何进行类型收窄（Type Narrowing）？

类型收窄是 TS 类型系统最强大的特性之一。它通过**控制流分析**将一个宽泛类型（如 `string | number`）收窄为更精确的子类型。

**常见收窄手段：**

```ts
function example(x: string | number | boolean) {
  // 1. typeof 类型守卫
  if (typeof x === "string") {
    x.toUpperCase(); // x: string
  }

  // 2. instanceof 类型守卫
  if (x instanceof Date) {
    x.getTime(); // x: Date（如果 x 是 Date 类型）
  }

  // 3. in 操作符 —— 检查属性是否存在
  type Circle = { kind: "circle"; radius: number };
  type Square = { kind: "square"; side: number };
  function area(s: Circle | Square) {
    if ("radius" in s) {
      // s: Circle
      return Math.PI * s.radius ** 2;
    }
  }

  // 4. 直接比较 === !== == !=
  function foo(a: "left" | "right" | null) {
    if (a === null) return;
    // a: "left" | "right"
  }

  // 5. 真值收窄（!!x, if (x)）
  function greet(name: string | null | undefined) {
    if (name) {
      name.toUpperCase(); // name: string（注意：空字符串 "" 会走 else）
    }
  }

  // 6. 可辨识联合（Discriminated Unions）+ switch
  //    通过一个共同的"判别属性"如 kind/type 来收窄，见 Q6
}

// 7. 自定义类型守卫（Type Predicate）
function isString(v: unknown): v is string {
  return typeof v === "string";
}
const arr = [1, "a", 2, "b"];
const strs = arr.filter(isString); // strs: string[]（注意：filter 回调需要是类型谓词才能正确收窄）

// 8. 断言函数（Assertion Functions）TS 3.7+
function assertString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}
function demo(v: unknown) {
  assertString(v);
  v.toUpperCase(); // v: string
}
```

**一个非常有用的模式 —— 穷尽性检查：**

```ts
type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };
function area(s: Shape) {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.s ** 2;
    default:
      // 如果以后新增了 Shape 的变体，TS 会在这一行报错提醒你
      const _exhaustiveCheck: never = s;
      throw new Error(`未处理的形状: ${_exhaustiveCheck}`);
  }
}
```
