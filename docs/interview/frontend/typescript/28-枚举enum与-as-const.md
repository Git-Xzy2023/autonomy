---
title: "枚举（Enum）与 `as const`"
---

# 枚举（Enum）与 `as const`

**Q26: `const enum` 与普通 `enum` 有什么区别？与 `as const` 对象又有什么区别？**

```ts
// 普通 enum —— 会编译为 JS 代码（一个对象 + 反向映射）
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
// 编译后（字符串枚举没有反向映射）：
// var Direction;
// (function (Direction) {
//     Direction["Up"] = "UP";
//     Direction["Down"] = "DOWN";
// })(Direction || (Direction = {}));

// const enum —— 编译时被内联为具体值，不生成任何 JS 代码
const enum Status {
  Draft,
  Published,
}
let s = Status.Published; // 编译后 → let s = 1;

// as const 对象 —— 完全使用 JS 的运行时能力，配合 typeof 提取类型
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
} as const;
type Method = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
// => "GET" | "POST"
```

**三者对比：**

| 方案            | 有运行时代码       | 可反向映射   | Tree-shaking               | 类型精度           |
| --------------- | ------------------ | ------------ | -------------------------- | ------------------ |
| `enum`          | ✅                 | 数字枚举支持 | 较差（打包工具要特殊处理） | 成员为字面量类型   |
| `const enum`    | ❌                 | ❌           | 好（无代码）               | 成员为字面量类型   |
| `as const` 对象 | ✅（就是普通对象） | ❌           | 好                         | 通过 `typeof` 提取 |

**推荐**：在现代 TS 项目中，除非有特定需求（如需要反向映射或使用枚举的某些反射能力），否则**`as const` 对象**更简单、更接近原生 JS，且行为可预测，是越来越受欢迎的方案。

---
