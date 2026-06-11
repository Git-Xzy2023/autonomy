---
title: "TypeScript 有哪些基础类型？"
---

# TypeScript 有哪些基础类型？

| 类型     | 关键字              | 说明                                         |
| -------- | ------------------- | -------------------------------------------- |
| 字符串   | `string`            | 双引号、单引号、模板字符串都属于 string      |
| 数字     | `number`            | 整数、小数、NaN、Infinity 都属于 number      |
| 布尔     | `boolean`           | 只有 `true` / `false`，没有 truthy/falsy     |
| 数组     | `T[]` 或 `Array<T>` | 两种写法等价                                 |
| 元组     | `[T, U]`            | 固定长度和类型的数组                         |
| 枚举     | `enum`              | 命名常量集合                                 |
| 任意值   | `any`               | 跳过类型检查，不推荐使用                     |
| 未知值   | `unknown`           | 类型安全的 any，使用前必须类型断言或类型守卫 |
| 空值     | `void`              | 函数没有返回值                               |
| 空       | `null`              | 表示"有值但为空"                             |
| 未定义   | `undefined`         | 表示"未赋值"                                 |
| 永远不会 | `never`             | 函数永远不会返回（抛出异常或无限循环）       |
| 对象     | `object`            | 非原始类型的类型                             |

**代码示例：**

```ts
// 基本类型注解
let name: string = "Tom";
let age: number = 18;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// 数组的两种写法
let nums: number[] = [1, 2, 3];
let nums2: Array<number> = [1, 2, 3];

// 元组 tuple —— 固定长度、每个位置类型已知
let person: [string, number, boolean] = ["Tom", 18, true];
person[0] = 123; // ❌ 报错
person[3] = "a"; // ❌ 报错（长度固定）
// 注意：push/pop 等方法不受长度限制（TS 的一个历史行为）

// enum —— 会编译到 JS 中
enum Direction {
  Up = 1,
  Down, // 自动 = 2
  Left = 10,
  Right, // 自动 = 11
}
console.log(Direction.Up); // 1
console.log(Direction[10]); // "Left"

// 字符串枚举
enum Color {
  Red = "#ff0000",
  Green = "#00ff00",
  Blue = "#0000ff",
}

// const enum —— 编译后会被内联为具体值，没有运行时代码（更轻量）
const enum Status {
  Draft,
  Published,
}
let s: Status = Status.Published; // 编译后 → let s = 1;
```
