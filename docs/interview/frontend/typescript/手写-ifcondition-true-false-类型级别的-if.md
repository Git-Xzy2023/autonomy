---
title: "手写 `If<Condition, True, False>` —— 类型级别的 if"
---

# 手写 `If<Condition, True, False>` —— 类型级别的 if

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
type A = If<true, string, number>; // string
type B = If<false, string, number>; // number
```
