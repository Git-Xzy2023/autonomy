---
title: "手写 `First<T>` —— 获取元组的第一个元素"
---

# 手写 `First<T>` —— 获取元组的第一个元素

```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type F1 = First<[string, number, boolean]>; // string
type F2 = First<[]>; // never
```
