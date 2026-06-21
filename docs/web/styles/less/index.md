---
title: Less 学习指南
---

# Less 学习指南

**Less**（Leaner Style Sheets）是一种流行的 CSS 预处理器，语法更接近原生 CSS，学习曲线更低。

---

## 学习路线

```
入门安装 → 变量 → 嵌套 → Mixin → 函数 → 守卫与循环 → 最佳实践
```

## 章节导航

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | 入门与安装 | [Less 入门](/web/styles/less/01-intro/) |
| 02 | 变量 | [变量](/web/styles/less/02-variables/) |
| 03 | 嵌套 | [嵌套](/web/styles/less/03-nesting/) |
| 04 | Mixin | [Mixin](/web/styles/less/04-mixin/) |
| 05 | 函数与运算 | [函数](/web/styles/less/05-functions/) |
| 06 | 守卫与循环 | [守卫与循环](/web/styles/less/06-guard-loop/) |
| 07 | 最佳实践 | [最佳实践](/web/styles/less/07-best-practices/) |

## Less vs Sass

| 特性 | Less | Sass/SCSS |
|------|------|-----------|
| **变量符号** | `@var-name` | `$var-name` |
| **混合写法** | `.mixin-name()` | `@mixin / @include` |
| **自定义函数** | 不支持（用 mixin 模拟） | 支持 `@function` |
| **循环** | `each()` 函数 | `@for` / `@each` / `@while` |
| **条件** | `when` 守卫 | `@if / @else` |
| **模块化** | `@import` | `@use / @forward` |
| **社区生态** | 较大 | 更大 |

Less 尤其适合在 **Node.js 项目**或需要快速上手的团队中使用。

开始学习：[Less 入门与安装](/web/styles/less/01-intro/)
