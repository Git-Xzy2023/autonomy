---
title: "Webpack 的核心概念：Entry / Output / Loader / Plugin / Mode / Chunk"
---

# Webpack 的核心概念：Entry / Output / Loader / Plugin / Mode / Chunk

**核心考察点**：是否能把每个概念讲清楚，以及讲出它们之间的关系。

**回答要点**：

- **Entry**：打包入口，Webpack 从这里开始构建依赖图。可以是字符串、对象（多入口）、数组。
- **Output**：产物输出配置。`filename` 决定文件名（可带 `[name].[contenthash].js`），`path` 决定目录，`publicPath` 决定运行时加载资源的前缀。
- **Loader**：**"文件转换器"**。Webpack 本身只理解 JS/JSON，其他文件（TS、CSS、图片）都需要 Loader 转换成 JS Module。典型的链式调用：`['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']`（**执行顺序从右到左**）。
- **Plugin**：**"流程钩子"**。贯穿整个构建生命周期，能在各个阶段介入修改产物、收集信息、写文件。例如 `HtmlWebpackPlugin`、`MiniCssExtractPlugin`、`TerserWebpackPlugin`、`DefinePlugin`。
- **Mode**：`development` / `production` / `none`。生产模式默认启用压缩、Tree Shaking、确定性模块 ID 等优化。
- **Chunk**：打包输出的一个代码块。Entry、动态 import、SplitChunks 都会产生 Chunk。一个 Chunk 可能由多个 Module 组成。

**Loader vs Plugin 的区别**：

- Loader 是"转换模块"的，每次 Webpack 加载一个非 JS 文件时都需要经过它；是针对文件级的。
- Plugin 是"扩展 Webpack 能力"的，通过监听构建生命周期事件来做事；是针对打包流程级的。
