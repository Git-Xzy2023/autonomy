---
title: "`null` 和 `undefined` 在 TS 中的行为是什么？`--strictNullChecks` 有什么影响？"
---

# `null` 和 `undefined` 在 TS 中的行为是什么？`--strictNullChecks` 有什么影响？

默认情况下（无 `--strictNullChecks`），`null` 和 `undefined` 是**任何类型的子类型**，可以赋值给 `string`、`number` 等：

```ts
let name: string = null; // ✅（非 strict 模式下）
let age: number = undefined; // ✅
```

开启 `strictNullChecks`（`tsconfig.json` 中 `"strict": true` 会自动开启）后，`null` 和 `undefined` 成为独立类型，**不能再赋值给其他类型**：

```ts
let name: string = null; // ❌ 编译错误
let age: number = undefined; // ❌ 编译错误

// 必须显式声明允许
let name: string | null = null; // ✅
let age: number | undefined = undefined; // ✅
```

这是一个非常关键的配置，它让你**必须处理"值可能不存在"**的情况，是避免运行时错误的最重要手段之一。

**使用场景：**

```ts
// 正确写法 —— 函数参数可能缺失
function greet(name: string | null) {
  // 使用前必须确认非空
  if (name) {
    console.log("Hello, " + name.toUpperCase());
  } else {
    console.log("Hello, guest");
  }
}

// 非空断言操作符 ! —— 告诉 TS"我确定它非空"（谨慎使用）
function getLength(str: string | null): number {
  return str!.length; // 但如果 str 确实为 null，运行时还是会报错
}

// 可选链 ?. —— 更安全的写法（ES2020 特性，TS 也支持）
function getName(user: { name?: string } | null) {
  return user?.name?.toUpperCase(); // 返回 string | undefined
}
```
