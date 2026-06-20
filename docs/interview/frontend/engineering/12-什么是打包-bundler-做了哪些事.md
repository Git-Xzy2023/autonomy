---
title: "什么是打包（Bundling）？Bundler 做了哪些事？"
---

# 什么是打包（Bundling）？Bundler 做了哪些事？

**核心考察点**：对"打包"流程是否有整体认知。

**回答要点**：

一个典型 Bundler 的工作流程（以 Webpack/Rollup 为例）：

1. **解析入口**：从 entry 文件开始，构建 Module Graph（依赖图）。
2. **Resolve**：根据 import/require 语句，用 resolver 解析出真实文件路径（包括 node_modules、alias、extensions）。
3. **Load / Parse**：读取文件内容，用 Parser 解析成 AST。
4. **Transform**：Loader / Plugin 对每个模块做转换（Babel、TS、SCSS……）。
5. **Dependency Collection**：收集每个模块的依赖列表（import 了谁）。
6. **Code Splitting**：根据配置或动态 import 拆分成多个 Chunk。
7. **Tree Shaking**：标记未使用的导出并移除（需要 ESM + sideEffects 配合）。
8. **生成产物**：把 Module Graph 渲染成最终的 JS 文件 + runtime。
9. **输出 & 优化**：压缩（Terser/esbuild）、哈希、sourcemap、manifest。

**可以随手画一个依赖图的示意**：

```
entry.js
 ├── a.js → import c.js
 ├── b.js
 └── styles.css
```
