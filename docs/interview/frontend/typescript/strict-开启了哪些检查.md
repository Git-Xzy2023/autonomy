---
title: "`strict` 开启了哪些检查？"
---

# `strict` 开启了哪些检查？

`"strict": true` 会同时开启以下严格检查（推荐所有新项目开启）：

| 选项                           | 说明                                       |
| ------------------------------ | ------------------------------------------ |
| `noImplicitAny`                | 禁止隐式 `any`，无法推断类型时必须显式标注 |
| `strictNullChecks`             | `null`/`undefined` 不能赋值给其他类型      |
| `strictFunctionTypes`          | 函数参数采用逆变检查（更严格）             |
| `strictBindCallApply`          | `bind`/`call`/`apply` 检查参数类型         |
| `strictPropertyInitialization` | 类属性必须在声明或构造函数中初始化         |
| `noImplicitThis`               | `this` 不能隐式为 `any`                    |
| `alwaysStrict`                 | 每个文件都用严格模式解析                   |
