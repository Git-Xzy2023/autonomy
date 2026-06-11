---
title: "TypeScript 与 JavaScript 的关系"
---

# TypeScript 与 JavaScript 的关系

**Q1: 什么是 TypeScript？它和 JavaScript 是什么关系？**

TypeScript 是由 Microsoft 开发的一种开源编程语言，是 JavaScript 的**超集**。核心关系：

1. **超集关系**：所有合法的 JavaScript 代码都是合法的 TypeScript 代码（TS 包含 JS 的全部语法和运行时语义）
2. **编译型语言**：TS 本身不能直接在浏览器/Node.js 运行，必须编译（transpile）成 JS 后才能执行
3. **渐进式**：可以在现有 JS 项目中逐步引入，支持 `.js`/`.ts` 文件混合使用
4. **可选静态类型**：类型注解是可选的，未标注的变量会走**类型推断**（type inference），没推断出来就变成 `any`

**编译流程：**

```
.ts 文件
   ↓ tsc / ts-loader / babel @babel/preset-typescript
   ↓ 类型检查（可选）+ 语法转换
.js 文件（可在浏览器/Node 运行）
```

**TS 的核心价值：**

| 特性                   | 说明                                           |
| ---------------------- | ---------------------------------------------- |
| 静态类型检查           | 在**编译期**发现类型错误，而不是运行时         |
| 智能提示               | IDE 可根据类型信息提供精准的代码补全和重构支持 |
| 代码即文档             | 类型签名就是最准确的 API 文档                  |
| 工程化协作             | 大型项目多人协作时，类型是一种接口契约         |
| 提前使用下一代 JS 特性 | 编译阶段把 ESNext 降级到目标版本               |

**Q2: 为什么要使用 TypeScript？它解决了 JavaScript 的什么痛点？**

JavaScript 是**动态弱类型**语言，变量类型在运行时才确定，这带来了以下痛点：

1. **类型错误只能在运行时暴露**：`undefined is not a function`、`Cannot read property 'x' of undefined` 这类经典错误在 JS 中非常常见
2. **重构风险高**：修改一个函数参数类型，IDE 无法告诉你哪里调用错了
3. **API 契约不清晰**：调用别人写的函数，参数应该传什么、返回什么只能靠猜或看注释
4. **IDE 智能提示有限**：没有类型信息，编辑器很难提供精准的代码补全

TypeScript 通过**编译期静态类型检查**解决了这些问题。

**示例对比：**

```ts
// JavaScript —— 运行时才发现错误
function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.price, 0);
}
calcTotal(null); // 运行时报错：Cannot read property 'reduce' of null

// TypeScript —— 编译期就报错
function calcTotal(items: { price: number }[]) {
  return items.reduce((sum, it) => sum + it.price, 0);
}
calcTotal(null); // ❌ 编译错误：Argument of type 'null' is not assignable...
```

**常见误区**：TypeScript 只是一个开发/编译时工具，它**不会在运行时做类型检查**。如果你把 TS 代码编译为 JS，运行时传入类型错误的数据，是不会报错的。

---
