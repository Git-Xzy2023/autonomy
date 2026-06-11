---
title: "手写 `DeepPartial<T>` —— 递归地将所有属性设为可选"
---

# 手写 `DeepPartial<T>` —— 递归地将所有属性设为可选

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};
```
