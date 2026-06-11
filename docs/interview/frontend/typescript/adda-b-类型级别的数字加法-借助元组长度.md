---
title: "`Add<A, B>` —— 类型级别的数字加法（借助元组长度）"
---

# `Add<A, B>` —— 类型级别的数字加法（借助元组长度）

```ts
type BuildArr<N extends number, R extends any[] = []> = R["length"] extends N
  ? R
  : BuildArr<N, [...R, any]>;

type Add<A extends number, B extends number> = [
  ...BuildArr<A>,
  ...BuildArr<B>,
]["length"];
type S = Add<3, 5>; // 8

type Sub<A extends number, B extends number> =
  BuildArr<A> extends [...BuildArr<B>, ...infer R] ? R["length"] : never;
type D = Sub<10, 3>; // 7
```
