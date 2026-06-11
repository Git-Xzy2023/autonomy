---
title: "从入门到精通的 TypeScript 学习路线"
---

# 从入门到精通的 TypeScript 学习路线

```
阶段 1：基础类型
├── 原始类型（string/number/boolean/null/undefined）
├── 数组/元组/对象
├── 联合/交叉类型
├── 类型收窄（typeof/in/===）
└── type vs interface

阶段 2：面向对象
├── 类的修饰符（public/private/protected/readonly）
├── 抽象类 vs 接口
├── 类与泛型
└── implements/extends

阶段 3：泛型与类型工具
├── 泛型函数/接口/类
├── 泛型约束（extends）
├── 内置工具类型（Partial/Pick/Record/...）
├── 理解工具类型的实现原理
└── keyof / typeof

阶段 4：高级类型
├── 条件类型（T extends U ? X : Y）
├── infer 关键字
├── 映射类型（{ [K in keyof T]: ... }）
├── 模板字面量类型
└── 递归类型

阶段 5：类型体操
├── 元组操作
├── 联合类型变换（UnionToIntersection 等）
├── 逆变/协变原理
├── 路径访问/路径生成
└── 类型级编程（类型级别数字运算等）

阶段 6：工程化实战
├── tsconfig.json 深入
├── 声明文件与 declare
├── 与 React/Vue 结合
├── 类型声明库（@types/*）
├── TS 版本迁移
└── 性能优化（类型复杂度）
```

**学习资源推荐：**

- 官方 Handbook：[typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- type-challenges：[github.com/type-challenges/type-challenges](https://github.com/type-challenges/type-challenges) —— 从 easy 到 extreme 的类型练习
- TS 每周更新（TS Blog）：了解新特性
- 阅读真实项目的类型声明：Redux、React Query、Zod 等库的类型定义质量非常高

**实战建议：**

1. 新项目默认开启 `"strict": true`
2. 尽量避免 `any`，能用 `unknown` 就用 `unknown`
3. 优先用类型推断，仅在必要时标注类型
4. 用可辨识联合（Discriminated Union）处理复杂状态
5. 复杂类型拆分成多个命名类型，可读性比"一行写完"更重要
6. 学习 `type-challenges` 时，不要死磕最 extreme 的题，理解原理比能写出答案更重要
