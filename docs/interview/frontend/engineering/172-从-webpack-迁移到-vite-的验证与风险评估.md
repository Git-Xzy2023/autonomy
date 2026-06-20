---
title: "团队决定从 Webpack 迁移到 Vite，你会做哪些验证与风险评估？"
---

# 团队决定从 Webpack 迁移到 Vite，你会做哪些验证与风险评估？

**回答要点**：

**技术验证**：

1. **开发体验**：启动时间、HMR 速度、热更新正确性（CSS/TSX/Vue SFC）。
2. **构建产物**：`vite build` 后的 bundle 大小、chunk 拆分、sourcemap。
3. **兼容性**：旧项目可能使用了某些 Webpack 独有的 loader/plugin（如 svg-sprite-loader），需要找等价 Vite 插件。
4. **依赖**：`optimizeDeps.include` 补齐预构建遗漏的库。
5. **环境变量**：Vite 用 `import.meta.env.VITE_*`，Webpack 用 `process.env.*`，需要迁移。
6. **别名/路径**：`resolve.alias`、`resolve.extensions` 迁移。
7. **TS 声明**：`/// <reference types="vite/client" />`。

**风险评估**：

- **Rollup 生态插件**：Vite 生产环境用 Rollup，某些 Webpack 专属 Plugin 无等价方案。
- **SSR**：如果项目是 SSR，需要评估 Vite 的 SSR API vs Webpack SSR 方案。
- **CI/CD**：build 命令、产物路径、缓存策略是否需要调整。
- **团队学习成本**：环境变量、配置写法、插件 API 都不同。
- **回滚方案**：在项目中保留两套配置（可通过环境变量切换），或通过分支并行。

**推荐做法**：先挑一个"中等复杂度"的项目试点，成功后再推广。
