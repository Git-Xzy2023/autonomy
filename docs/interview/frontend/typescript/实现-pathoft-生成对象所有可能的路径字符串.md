---
title: "实现 `PathOf<T>` —— 生成对象所有可能的路径字符串"
---

# 实现 `PathOf<T>` —— 生成对象所有可能的路径字符串

```ts
type PathOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: `${Prefix}${K}` | PathOf<T[K], `${Prefix}${K}.`>;
    }[keyof T & string]
  : never;

interface User {
  id: number;
  address: { city: string; zip: string };
}
type P = PathOf<User>; // "id" | "address" | "address.city" | "address.zip"
```
