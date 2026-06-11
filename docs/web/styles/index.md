---
title: 样式相关
---

# 样式技术学习指南

本章节涵盖 Web 开发中常见的样式技术，包括原生 **CSS**、**Sass/SCSS**、**Less** 和 **Tailwind CSS**。

## 为什么学习样式技术？

样式（Styling）是 Web 前端开发的三大基石之一。无论是做一个简单的博客、还是复杂的企业级应用，都离不开样式。掌握好样式技术可以帮助你：

- ✅ **高效开发**：快速地实现设计稿
- ✅ **一致体验**：在不同设备上呈现一致的 UI
- ✅ **性能表现**：减少不必要的样式计算，提升页面性能
- ✅ **维护成本**：通过预处理器和工具类框架，让样式代码更易维护

---

## 技术栈总览

| 技术             | 定位            | 适用场景                         |
| ---------------- | --------------- | -------------------------------- |
| **CSS**          | 原生样式语言    | 所有 Web 应用的基础，最底层      |
| **Sass / SCSS**  | CSS 预处理器    | 大型项目、需要变量、循环、模块化 |
| **Less**         | CSS 预处理器    | 语法简洁、Node.js 生态友好       |
| **Tailwind CSS** | 原子化 CSS 框架 | 快速原型、设计系统、组件库       |

---

## 各模块说明

### 🎨 CSS

CSS 是所有 Web 样式的基础。从最基础的语法到现代的 Flexbox / Grid 布局，再到动画与响应式设计，它是你必须掌握的核心技能。

**推荐学习路径：**

1. [CSS 基础](/web/styles/css/01-basics/) — 引入方式、语法规则、单位与颜色
2. [选择器](/web/styles/css/02-selectors/) — 选择器与优先级
3. [盒模型](/web/styles/css/03-box-model/) — 元素尺寸与间距
4. [布局](/web/styles/css/04-layout/) — Flexbox、Grid、定位
5. [响应式设计](/web/styles/css/05-responsive/) — 媒体查询、断点策略
6. [动画和过渡](/web/styles/css/06-animation/) — Transition、Animation、Transform
7. [预处理器](/web/styles/css/07-preprocessor/) — Sass/SCSS 与 Less
8. [最佳实践](/web/styles/css/08-best-practices/) — BEM、性能优化、可访问性

### 💅 Sass

SCSS 是 Sass 的一种语法，兼容标准 CSS，同时增加了变量、嵌套、混合、函数、循环等强大特性。

**快速上手：**

- [Sass 入门](/web/styles/sass/)

### 🎯 Less

Less 是另一个流行的 CSS 预处理器，语法更接近原生 CSS，学习曲线更低。

**快速上手：**

- [Less 入门](/web/styles/less/)

### 🌪️ Tailwind CSS

Tailwind 是一个「实用优先」的 CSS 框架，通过预定义的工具类（utility classes）直接在 HTML 中组合样式，省去了写类名的烦恼。

**快速上手：**

- [Tailwind CSS 入门](/web/styles/tailwind/)

---

## 技术对比速查表

| 特性            | CSS                | Sass/SCSS        | Less        | Tailwind CSS            |
| --------------- | ------------------ | ---------------- | ----------- | ----------------------- |
| **变量**        | CSS 变量（`--`）   | `$var`           | `@var`      | 主题配置 (`theme`)      |
| **嵌套**        | 不支持原生嵌套     | ✅               | ✅          | 不支持（配合 `@apply`） |
| **混合 / 复用** | 需手写类名         | `@mixin`         | `.mixin()`  | 工具类 + `@apply`       |
| **循环**        | 不支持             | `@for` / `@each` | `each()`    | 不支持                  |
| **函数**        | `calc()` 等        | ✅ 自定义        | ✅ 内置函数 | 不支持                  |
| **开发速度**    | 较慢（需组织类名） | 中               | 中          | 快（直接写 HTML 类）    |
| **产物大小**    | 完全可控           | 可控             | 可控        | 需要 Tree-shaking       |

---

## 学习建议

1. **新手入门**：先学习 [CSS 基础](/web/styles/css/01-basics/)，理解样式的核心概念。
2. **项目实战**：学完 CSS 后，根据项目规模选择合适的工具 —— 小型项目直接写 CSS，大型项目引入 Sass 或 Tailwind。
3. **持续精进**：关注 [Can I Use](https://caniuse.com/) 与 CSS 新特性（Container Queries、`:has()`、CSS Nesting 等）。

接下来，从你感兴趣的模块开始学习吧！
