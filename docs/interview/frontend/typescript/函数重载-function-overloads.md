---
title: "函数重载（Function Overloads）"
---

# 函数重载（Function Overloads）

TS 支持为同一个函数声明多个签名（重载签名），然后写一个实现签名：

```ts
// 重载签名 —— 对外可见
function parse(input: string): number;
function parse(input: number): string;
function parse(input: boolean): boolean;

// 实现签名 —— 对外不可见，必须兼容所有重载
function parse(input: string | number | boolean) {
  if (typeof input === "string") return Number(input);
  if (typeof input === "number") return String(input);
  return input;
}

const n = parse("42"); // n: number（TS 根据参数类型确定返回类型）
const s = parse(42); // s: string
const b = parse(true); // b: boolean
```

**注意事项：**

- 实现签名必须比所有重载签名都**更宽泛**（参数和返回值类型都是重载的联合）
- 调用者只能看到重载签名，看不到实现签名
- 实现内部必须自己处理类型收窄（TS 不会自动帮你）
