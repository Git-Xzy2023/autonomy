---
title: "Rollup 的 Treeshaking 和 Webpack 的 Treeshaking 实现上有什么差异？"
---

# Rollup 的 Treeshaking 和 Webpack 的 Treeshaking 实现上有什么差异？

**回答要点**：

- **Rollup**：原生就是围绕 ESM 设计的，对顶层未使用的 export 直接忽略；打包时把所有模块合并成一个 scope（scope-hoisting / 作用域提升），有利于进一步优化；对 sideEffects 的分析更激进。
- **Webpack**：历史包袱重（最初是为 CommonJS 设计的），ESM 分析是后来加上的；Webpack 保留了运行时模块系统（`__webpack_require__`），默认不做 scope hoisting（需要 `concatenateModules: true` 开启 ModuleConcatenationPlugin）；对 sideEffects 依赖更严格。
- **实际效果**：同等配置下，Rollup 的 bundle 通常比 Webpack 更小、更"干净"，这也是为什么**库打包偏爱 Rollup**。
