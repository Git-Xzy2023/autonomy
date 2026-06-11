---
title: "`IsUnion<T>` —— 判断是不是联合类型"
---

# `IsUnion<T>` —— 判断是不是联合类型

```ts
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never;
type IU1 = IsUnion<string | number>; // true
type IU2 = IsUnion<string>; // false
```
