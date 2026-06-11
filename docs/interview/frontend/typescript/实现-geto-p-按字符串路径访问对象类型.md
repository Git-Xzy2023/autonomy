---
title: "实现 `Get<O, P>` —— 按字符串路径访问对象类型"
---

# 实现 `Get<O, P>` —— 按字符串路径访问对象类型

```ts
type Get<O, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof O
    ? Get<O[K], Rest>
    : never
  : P extends keyof O
    ? O[P]
    : never;

interface User {
  address: { city: { name: string } };
}
type CityName = Get<User, "address.city.name">; // string
```
