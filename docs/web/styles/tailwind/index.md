---
title: Tailwind CSS 学习指南
---

# Tailwind CSS 学习指南

**Tailwind CSS** 是一个「实用优先」（utility-first）的 CSS 框架。它提供了大量细粒度的工具类，让你直接在 HTML 中组合出任意样式，无需写自定义 CSS 文件。

---

## 学习路线

```
入门配置 → 工具类速查 → 响应式与状态 → 自定义主题 → @apply 抽取 → 插件生态 → 最佳实践
```

## 章节导航

| 章节 | 主题 | 链接 |
| ---- | ---- | ---- |
| 01 | 入门与配置 | [Tailwind 入门](/web/styles/tailwind/01-intro/) |
| 02 | 工具类速查 | [工具类](/web/styles/tailwind/02-utilities/) |
| 03 | 响应式与状态 | [响应式](/web/styles/tailwind/03-responsive/) |
| 04 | 自定义主题 | [自定义主题](/web/styles/tailwind/04-theme/) |
| 05 | @apply 与组件抽取 | [@apply](/web/styles/tailwind/05-apply/) |
| 06 | 插件与生态 | [插件](/web/styles/tailwind/06-plugins/) |
| 07 | 最佳实践 | [最佳实践](/web/styles/tailwind/07-best-practices/) |

## 为什么选择 Tailwind？

传统 CSS 开发中的痛点：

- 📛 **类名地狱**：给每个元素起有意义的类名，越写越多
- 🔁 **重复样式**：多个组件共享相同的样式片段
- 🚀 **构建缓慢**：需要维护 CSS 文件、编译流程、命名规范
- 📦 **产物膨胀**：CSS 文件随项目膨胀，难以清理无用代码

Tailwind 的思路：**用预定义的工具类代替手写 CSS**，你只需要写 HTML：

```html
<!-- 传统写法 -->
<button class="btn-primary">立即购买</button>
<style>
  .btn-primary {
    background: #3498db;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
  }
</style>

<!-- Tailwind 写法 -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
  立即购买
</button>
```

开始学习：[Tailwind 入门与配置](/web/styles/tailwind/01-intro/)
