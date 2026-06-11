---
title: "`Shift<T>` —— 移除元组第一个元素"
---

# `Shift<T>` —— 移除元组第一个元素

```ts
type Shift<T extends any[]> = T extends [any, ...infer R] ? R : [];
type S = Shift<[1, 2, 3]>; // [2, 3]
```
