---
title: "你怎么决定哪些库应该 vendor chunk，哪些应该按需加载？"
---

# 你怎么决定哪些库应该 vendor chunk，哪些应该按需加载？

**核心考察点**：是否会做"取舍"。

**经验做法**：

1. **所有 `node_modules` 丢进 `vendors`**（Webpack SplitChunks 的默认做法），先保证业务代码和第三方依赖分离。
2. **体积 > 200KB 的独立大库**（echarts、xlsx、pdf.js、three.js）单独 `manualChunks`。
3. **非首屏页面依赖**：用 `import()` 动态 import，天然形成独立 chunk。
4. **在业务路由级拆分**：每个路由一个 chunk。
5. **共享组件/工具**：被多个路由使用的公共组件会被 SplitChunks 自动提取。
6. **A/B 测试代码、埋点 SDK**：如果首屏能延迟加载，就延迟加载。

**决策依据**：

- Bundle Analyzer 的实际体积。
- 用户访问路径（哪些页面/库真正被用）。
- 首屏 TTI / LCP 指标。
