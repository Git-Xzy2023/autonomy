---
title: "Webpack 5 有什么新东西？为什么要升级？"
---

# Webpack 5 有什么新东西？为什么要升级？

**核心考察点**：是否关注构建工具的演进。

**回答要点**：

1. **持久化缓存（Persistent Caching）**：`cache: { type: 'filesystem' }`。把模块编译结果缓存到磁盘，第二次构建速度可提升 5~10 倍。这是 Webpack 5 最大的卖点。
2. **原生支持资源模块（Asset Modules）**：用 `type: 'asset/resource' | 'asset/inline' | 'asset/source' | 'asset'` 取代 `file-loader`、`url-loader`、`raw-loader`。
3. **更好的 Tree Shaking**（`moduleIds: 'deterministic'`、对嵌套导出的分析）。
4. **模块联邦（Module Federation）**：允许多个独立构建的应用在运行时互相加载模块，是微前端的一种原生解法。
5. **Chunk ID 确定性**（`deterministic`），相同内容产生相同 ID，有利于长期缓存。
6. **废弃了 Node polyfill**（如 `path`、`buffer` 在浏览器环境下不再自动注入）。
