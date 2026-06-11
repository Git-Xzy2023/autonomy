---
title: "什么是联合类型（Union Types）？"
---

# 什么是联合类型（Union Types）？

用 `|` 连接多个类型，表示"**或**"的关系：

```ts
// 简单联合
let id: string | number;
id = "abc"; // ✅
id = 123; // ✅
id = true; // ❌

// 对象联合（判别联合）
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // shape 被收窄为 Circle
    case "square":
      return shape.side ** 2; // shape 被收窄为 Square
  }
}
```
