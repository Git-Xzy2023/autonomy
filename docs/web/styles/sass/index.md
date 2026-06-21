---
title: Sass / SCSS 学习指南
---

# Sass / SCSS 学习指南

**Sass**（Syntactically Awesome Style Sheets）是最流行的 CSS 预处理器之一，而 **SCSS**（Sassy CSS）是 Sass 的一种语法，完全兼容标准 CSS。

---

## 学习路线

```
入门安装 → 变量 → 嵌套 → Mixin → 继承 → 函数 → 控制指令 → 模块化 → 最佳实践
```

## 章节导航

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | 入门与安装 | [Sass 入门](/web/styles/sass/01-intro/) |
| 02 | 变量与数据类型 | [变量](/web/styles/sass/02-variables/) |
| 03 | 嵌套与作用域 | [嵌套](/web/styles/sass/03-nesting/) |
| 04 | Mixin 与 Include | [Mixin](/web/styles/sass/04-mixin/) |
| 05 | 继承与占位符 | [继承](/web/styles/sass/05-extend/) |
| 06 | 函数与运算 | [函数](/web/styles/sass/06-functions/) |
| 07 | 控制指令 | [控制指令](/web/styles/sass/07-control/) |
| 08 | 模块化与 @use | [模块化](/web/styles/sass/08-modules/) |
| 09 | 最佳实践 | [最佳实践](/web/styles/sass/09-best-practices/) |

## Sass vs SCSS

Sass 有两种语法：

| 语法 | 扩展名 | 特点 |
| ---- | ------ | ---- |
| **Sass（缩进式）** | `.sass` | 不使用花括号和分号，靠缩进表示层级 |
| **SCSS** | `.scss` | 完全兼容 CSS 语法，使用花括号和分号 |

```scss
// SCSS 语法
.nav {
  background: #333;
  a {
    color: white;
  }
}
```

```sass
// Sass 语法
.nav
  background: #333
  a
    color: white
```

> 💡 本教程统一使用 **SCSS** 语法，因为它更接近原生 CSS，学习成本更低，且兼容所有现有 CSS 代码。

开始学习：[Sass 入门与安装](/web/styles/sass/01-intro/)
