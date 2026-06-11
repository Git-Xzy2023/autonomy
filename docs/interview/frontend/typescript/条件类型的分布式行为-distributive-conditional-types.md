---
title: "条件类型的分布式行为（Distributive Conditional Types）"
---

# 条件类型的分布式行为（Distributive Conditional Types）

当条件类型作用于**裸类型参数**（即 `T` 没有被包装在数组、元组、函数参数等中）时，它会**对联合类型逐项分发**：

```ts
type ToArray<T> = T extends any ? T[] : never;
type X = ToArray<string | number>;
// 等价于:
// ToArray<string> | ToArray<number>
// => string[] | number[]

// 对比：如果不是裸类型参数（用 [T] 包装），则不分发
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Y = ToArrayNonDist<string | number>;
// => (string | number)[]  （整个联合作为整体处理）
```

**分布式行为的经典应用 —— `Exclude`/`Extract`：**

```ts
// 从 T 中排除可以赋值给 U 的类型
type Exclude<T, U> = T extends U ? never : T;
type E1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type E2 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type E3 = Exclude<string | number | (() => void), Function>; // string | number

// 从 T 中提取可以赋值给 U 的类型
type Extract<T, U> = T extends U ? T : never;
type E4 = Extract<"a" | "b" | "c", "a" | "c" | "d">; // "a" | "c"
```

**注意：** 当 `T` 是 `never` 时，条件类型总是返回 `never`（因为 `never` 是"空联合"，分发后的结果也是空）。
