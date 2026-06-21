---
title: 现代样式方案
---

# 现代样式方案

本模块介绍 CSS 生态中的现代方案，包括 CSS Modules、CSS-in-JS、CSS 新特性以及方案对比与选型。

## 章节导航

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | CSS Modules | [CSS Modules](/web/styles/modern/01-css-modules/) |
| 02 | CSS-in-JS（styled-components） | [CSS-in-JS](/web/styles/modern/02-css-in-js/) |
| 03 | CSS 新特性 | [CSS 新特性](/web/styles/modern/03-new-features/) |
| 04 | 方案对比与选型 | [方案选型](/web/styles/modern/04-comparison/) |

## 为什么需要现代方案？

传统 CSS 存在以下问题：

- 🌐 **全局作用域**：类名容易冲突
- 🔗 **HTML/CSS 强耦合**：难以复用
- 🧩 **缺乏动态能力**：无法根据 JS 状态动态生成样式
- 📦 **组件化支持差**：样式与组件分离

现代方案通过不同方式解决这些问题：

| 方案 | 解决思路 |
|------|----------|
| **CSS Modules** | 编译时生成唯一类名，实现局部作用域 |
| **CSS-in-JS** | 运行时在 JS 中写 CSS，天然组件化 |
| **CSS 新特性** | 浏览器原生支持作用域、嵌套等 |

开始学习：[CSS Modules](/web/styles/modern/01-css-modules/)
