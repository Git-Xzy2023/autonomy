---
title: "Rspack 了解吗？和 Webpack 是什么关系？"
---

# Rspack 了解吗？和 Webpack 是什么关系？

**核心考察点**：对国内工程化生态的关注。

- **Rspack** 是字节跳动开源的、基于 Rust 的 Webpack 兼容构建工具。目标是**"与 Webpack 配置兼容、但速度快 5~10 倍"**。
- 核心特点：兼容 Webpack 的 loader/plugin API（逐步支持中），无需改项目配置就能迁移；内置 CSS、TS 支持；有 `rspack` CLI。
- 与 Webpack 的关系：**替代者**，不是"下一代 Webpack"。Webpack 官方方向是 Webpack 5 + 持续改进。
