---
title: "你知道 esbuild 吗？它为什么这么快？"
---

# 你知道 esbuild 吗？它为什么这么快？

**核心考察点**：是否关注新一代构建工具。

**回答要点**：

esbuild 是用 **Go** 写的 JS/TS 打包器，速度比 Babel/Webpack 快 10~100 倍。快的原因：

1. **原生代码**：Go 编译成原生二进制，没有 JS 解释开销。
2. **并行**：Go 的 goroutine 天然并行，充分利用多核。
3. **从零实现**：没有用 Babel/Acorn 的 AST 库，自己写了高性能的 parser/linker/minifier。
4. **内存高效**：避免 JS 的 GC 开销，数据结构更紧凑。

**适用场景**：

- **预构建依赖**（Vite 的默认选择）。
- **TS/JSX 转译**（`esbuild-loader` 替换 babel-loader 可快 10x）。
- **压缩 JS/CSS**（比 Terser 快几十倍，体积稍大但可接受）。
- **打包简单的 CLI 工具/Node 库**。

**局限性**：没有 Babel 的 AST 处理生态（比如某些特定的 babel-plugin 你没法直接用），不能完全替代 Webpack/Rollup。
