---
title: "手写 `Concat<A, B>` —— 连接两个元组"
---

# 手写 `Concat<A, B>` —— 连接两个元组

```ts
type Concat<A extends any[], B extends any[]> = [...A, ...B];
type C = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]
```
