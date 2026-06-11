---
title: "`UnionToIntersection<U>` —— 联合变交叉"
---

# `UnionToIntersection<U>` —— 联合变交叉

```ts
// 利用"函数参数位置的逆变"特性
type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (
  x: infer I,
) => any
  ? I
  : never;

type U = { a: number } | { b: string };
type I = UnionToIntersection<U>; // { a: number } & { b: string }
```

**关键原理 —— 逆变与协变（Contravariance & Covariance）：**

- **协变（Covariant）**：`A extends B` → `F<A> extends F<B>`（如函数返回值、readonly 数组）
- **逆变（Contravariant）**：`A extends B` → `F<B> extends F<A>`（如函数参数）
- **不变（Invariant）**：两者都不成立（如 `Array<T>` 是不变的，因为既读又写）

函数参数是逆变位置。当 TS 要从 `(x: A) => any | (x: B) => any` 推断出一个统一的函数类型 `(x: infer I) => any` 时，**I 必须同时满足 A 和 B**，也就是 `A & B`。这是联合变交叉的核心机制。
