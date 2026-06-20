---
title: "Webpack 的 Module、Chunk、Bundle、Asset 四者是什么关系？"
---

# Webpack 的 Module、Chunk、Bundle、Asset 四者是什么关系？

**回答要点**：

- **Module**：源码中的一个个文件（JS、TS、CSS、图片），经过 loader 处理后被 Webpack 识别。依赖图由 Module 组成。
- **Chunk**：构建过程中的"代码块"。一个 Chunk 由多个 Module 组成，Webpack 在 Code Splitting 阶段决定如何拆分 Chunk。
- **Bundle**：最终输出到磁盘的文件。一个 Chunk 通常产出一个 Bundle（但 sourcemap、manifest 不算 Bundle）。
- **Asset**：Webpack 5 的新概念，`type: 'asset/resource'` 等方式处理的非 JS 资源（图片、字体）。

**一句话**：**Module 被组织成 Chunk，Chunk 被渲染成 Bundle。**
