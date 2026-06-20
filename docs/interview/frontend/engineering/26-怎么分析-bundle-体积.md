---
title: "你是怎么分析 Bundle 体积的？有哪些工具？"
---

# 你是怎么分析 Bundle 体积的？有哪些工具？

**核心考察点**：是否具备"用数据说话"的工程思维。

**工具**：

- **`webpack-bundle-analyzer`**：可视化饼图，最直观。
- **`webpack --profile --json > stats.json`** + `webpack.github.io/analyse`。
- **`statoscope`**、**`bundle-stats`**：能对比两次构建的差异，适合 CI 上监控。
- **`source-map-explorer`**：用 sourcemap 反推每个源码的贡献体积。
- **Vite/Rollup**：`rollup-plugin-visualizer`。

**关注点**：

- 哪个模块/库意外地大？（例如整个 lodash、moment 的 locale）
- 同一个库是否被多个 chunk 重复打包？（SplitChunks 没配好）
- 某个组件是否被首页 bundle 拉到了？（需要动态 import）
