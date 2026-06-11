---
title: "`Repeat<T, N>` —— 创建长度为 N、元素为 T 的元组"
---

# `Repeat<T, N>` —— 创建长度为 N、元素为 T 的元组

```ts
type Repeat<T, N extends number, R extends any[] = []> = R["length"] extends N
  ? R
  : Repeat<T, N, [T, ...R]>;
type FiveStrings = Repeat<string, 5>; // [string, string, string, string, string]
```
