---
title: "索引类型与 `keyof`"
---

# 索引类型与 `keyof`

**Q22: `keyof` 是什么？`keyof` + `T[K]` 的索引访问有什么价值？**

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// keyof 产生一个由该类型所有键名组成的联合
type UserKeys = keyof User; // "id" | "name" | "email"

// 索引访问 —— 拿到某个键对应的类型
type NameType = User["name"]; // string
type IdOrEmail = User["id" | "email"]; // number | string
type AllValues = User[keyof User]; // number | string
```

**经典案例 —— 类型安全的 pluck：**

```ts
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map((k) => obj[k]);
}
const user = { id: 1, name: "Tom", age: 18 };
const values = pluck(user, ["id", "name"]); // values: (number | string)[]
pluck(user, ["id", "wrongKey"]); // ❌ "wrongKey" 不在对象键中
```

---
