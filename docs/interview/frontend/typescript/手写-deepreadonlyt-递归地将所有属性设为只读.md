---
title: "手写 `DeepReadonly<T>` —— 递归地将所有属性设为只读"
---

# 手写 `DeepReadonly<T>` —— 递归地将所有属性设为只读

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function // 函数不需要递归
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K];
};

interface Nested {
  a: { b: { c: number } };
}
type ReadonlyNested = DeepReadonly<Nested>;
// { readonly a: { readonly b: { readonly c: number } } }
```
