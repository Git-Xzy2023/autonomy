---
title: "什么是交叉类型（Intersection Types）？"
---

# 什么是交叉类型（Intersection Types）？

用 `&` 连接多个类型，表示"**与**"的关系，合并所有成员：

```ts
type Person = { name: string; age: number };
type Employee = { company: string; salary: number };

type PersonEmployee = Person & Employee;

const john: PersonEmployee = {
  name: "John",
  age: 30,
  company: "Acme",
  salary: 5000,
};
```

**注意冲突处理**：如果两个源类型有同名属性且类型不兼容：

```ts
type A = { x: string };
type B = { x: number };
type C = A & B; // x 的类型是 string & number = never
// const c: C = { x: "a" }; // ❌ 无法赋值，因为 never 没有合法值
```

**联合 vs 交叉 —— 一个重要的直觉**：

- `A | B` 表示"**是 A 或 B**"，你只能访问两者**共同**的属性
- `A & B` 表示"**同时是 A 和 B**"，你可以访问**所有**属性

```ts
interface Bird {
  fly(): void;
  layEggs(): void;
}
interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Bird | Fish;
let pet = getSmallPet();
pet.layEggs(); // ✅ 共同方法可以直接调用
// pet.swim();   // ❌ 不确定是不是 Fish，不能直接调用
// pet.fly();    // ❌ 同理
if ("swim" in pet) {
  pet.swim(); // ✅ 在这个分支，pet 被收窄为 Fish
}
```
