---
title: "高级映射 —— `as` 子句重新映射键（TS 4.1+）"
---

# 高级映射 —— `as` 子句重新映射键（TS 4.1+）

通过 `as` 可以在映射时**转换键**：

```ts
// 把所有键变成 getter 方法
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
interface User {
  name: string;
  age: number;
}
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// 过滤掉某些键
type ExcludeTypeFields<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};
interface Data {
  id: number;
  name: string;
  onUpdate: () => void;
}
type DataNoFn = ExcludeTypeFields<Data, Function>;
// { id: number; name: string }（onUpdate 被过滤掉了）
```
