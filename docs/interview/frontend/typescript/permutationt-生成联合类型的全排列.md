---
title: "`Permutation<T>` —— 生成联合类型的全排列"
---

# `Permutation<T>` —— 生成联合类型的全排列

```ts
type Permutation<T, U = T> = [T] extends [never]
  ? []
  : T extends any
    ? [T, ...Permutation<Exclude<U, T>>]
    : never;
type P = Permutation<"A" | "B" | "C">;
// ["A","B","C"] | ["A","C","B"] | ["B","A","C"] | ["B","C","A"] | ["C","A","B"] | ["C","B","A"]
```
