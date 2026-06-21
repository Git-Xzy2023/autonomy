---
title: 样式技术学习指南
---

# 样式技术学习指南

本章节涵盖 Web 开发中常见的样式技术，按照 **CSS 基础 → CSS 进阶 → 预处理器（Sass/Less）→ 原子化框架（Tailwind）→ 现代方案（CSS Modules / CSS-in-JS）** 的路线系统化整理。

---

## 一、为什么学习样式技术？

样式（Styling）是 Web 前端开发的三大基石之一。无论是做一个简单的博客、还是复杂的企业级应用，都离不开样式。掌握好样式技术可以帮助你：

- ✅ **高效开发**：快速地实现设计稿
- ✅ **一致体验**：在不同设备上呈现一致的 UI
- ✅ **性能表现**：减少不必要的样式计算，提升页面性能
- ✅ **维护成本**：通过预处理器和工具类框架，让样式代码更易维护

---

## 二、技术栈总览

| 技术                 | 定位              | 适用场景                         |
| -------------------- | ----------------- | -------------------------------- |
| **CSS**              | 原生样式语言      | 所有 Web 应用的基础，最底层      |
| **Sass / SCSS**      | CSS 预处理器      | 大型项目、需要变量、循环、模块化 |
| **Less**             | CSS 预处理器      | 语法简洁、Node.js 生态友好       |
| **Tailwind CSS**     | 原子化 CSS 框架   | 快速原型、设计系统、组件库       |
| **CSS Modules**      | 局部作用域方案    | React/Vue 组件级样式隔离         |
| **CSS-in-JS**        | JS 运行时样式方案 | React 生态、动态主题             |

---

## 三、推荐学习路线

```
CSS 基础 → CSS 选择器 → 盒模型 → 布局 → 响应式 → 动画
   ↓
CSS 最佳实践（BEM / 命名规范 / 性能优化）
   ↓
预处理器：Sass/SCSS 或 Less（二选一深入）
   ↓
原子化框架：Tailwind CSS
   ↓
现代方案：CSS Modules / CSS-in-JS
```

---

## 四、各模块入口

### 🎨 CSS（原生样式）

CSS 是所有 Web 样式的基础。从最基础的语法到现代的 Flexbox / Grid 布局，再到动画与响应式设计，它是你必须掌握的核心技能。

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | 基础语法 | [CSS 基础](/web/styles/css/01-basics/) |
| 02 | 选择器与优先级 | [选择器](/web/styles/css/02-selectors/) |
| 03 | 盒模型 | [盒模型](/web/styles/css/03-box-model/) |
| 04 | 布局（Flex / Grid） | [布局](/web/styles/css/04-layout/) |
| 05 | 响应式设计 | [响应式](/web/styles/css/05-responsive/) |
| 06 | 动画与过渡 | [动画](/web/styles/css/06-animation/) |
| 07 | 预处理器概览 | [预处理器](/web/styles/css/07-preprocessor/) |
| 08 | 最佳实践 | [最佳实践](/web/styles/css/08-best-practices/) |

### 💅 Sass / SCSS（预处理器）

SCSS 是 Sass 的一种语法，兼容标准 CSS，同时增加了变量、嵌套、混合、函数、循环等强大特性。

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

### 🎯 Less（预处理器）

Less 是另一个流行的 CSS 预处理器，语法更接近原生 CSS，学习曲线更低。

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | 入门与安装 | [Less 入门](/web/styles/less/01-intro/) |
| 02 | 变量 | [变量](/web/styles/less/02-variables/) |
| 03 | 嵌套 | [嵌套](/web/styles/less/03-nesting/) |
| 04 | Mixin | [Mixin](/web/styles/less/04-mixin/) |
| 05 | 函数与运算 | [函数](/web/styles/less/05-functions/) |
| 06 | 守卫与循环 | [守卫与循环](/web/styles/less/06-guard-loop/) |
| 07 | 最佳实践 | [最佳实践](/web/styles/less/07-best-practices/) |

### 🌪️ Tailwind CSS（原子化框架）

Tailwind 是一个「实用优先」的 CSS 框架，通过预定义的工具类直接在 HTML 中组合样式。

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | 入门与配置 | [Tailwind 入门](/web/styles/tailwind/01-intro/) |
| 02 | 工具类速查 | [工具类](/web/styles/tailwind/02-utilities/) |
| 03 | 响应式与状态 | [响应式](/web/styles/tailwind/03-responsive/) |
| 04 | 自定义主题 | [自定义主题](/web/styles/tailwind/04-theme/) |
| 05 | @apply 与组件抽取 | [@apply](/web/styles/tailwind/05-apply/) |
| 06 | 插件与生态 | [插件](/web/styles/tailwind/06-plugins/) |
| 07 | 最佳实践 | [最佳实践](/web/styles/tailwind/07-best-practices/) |

### 🧩 现代方案

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | CSS Modules | [CSS Modules](/web/styles/modern/01-css-modules/) |
| 02 | CSS-in-JS（styled-components） | [CSS-in-JS](/web/styles/modern/02-css-in-js/) |
| 03 | CSS 新特性（Container Queries / :has() / Nesting） | [CSS 新特性](/web/styles/modern/03-new-features/) |
| 04 | 方案对比与选型 | [方案选型](/web/styles/modern/04-comparison/) |

---

## 五、技术对比速查表

| 特性            | CSS                | Sass/SCSS        | Less        | Tailwind CSS            | CSS Modules       | CSS-in-JS          |
| --------------- | ------------------ | ---------------- | ----------- | ----------------------- | ----------------- | ------------------ |
| **变量**        | CSS 变量（`--`）   | `$var`           | `@var`      | 主题配置 (`theme`)      | CSS 变量          | JS 变量            |
| **嵌套**        | 原生支持（新）     | ✅               | ✅          | 不支持（配合 `@apply`） | 不支持            | ✅                 |
| **混合 / 复用** | 需手写类名         | `@mixin`         | `.mixin()`  | 工具类 + `@apply`       | `composes`        | 组件复用           |
| **循环**        | 不支持             | `@for` / `@each` | `each()`    | 不支持                  | 不支持            | JS map             |
| **作用域隔离**  | BEM 约定           | BEM 约定         | BEM 约定    | 类名约定                | ✅ 自动           | ✅ 自动            |
| **开发速度**    | 较慢               | 中               | 中          | 快                      | 中                | 中                 |
| **运行时开销**  | 无                 | 无               | 无          | 无                      | 无                | 有（性能损耗）     |
| **产物大小**    | 完全可控           | 可控             | 可控        | 需要 Tree-shaking       | 可控              | 较大               |

---

## 六、学习建议

1. **新手入门**：先学习 [CSS 基础](/web/styles/css/01-basics/)，理解样式的核心概念。
2. **项目实战**：学完 CSS 后，根据项目规模选择合适的工具 —— 小型项目直接写 CSS，大型项目引入 Sass 或 Tailwind。
3. **持续精进**：关注 [Can I Use](https://caniuse.com/) 与 CSS 新特性（Container Queries、`:has()`、CSS Nesting 等）。

接下来，从你感兴趣的模块开始学习吧！
