---
title: "Rollup 和 Webpack 有什么区别？各自适合什么场景？"
---

# Rollup 和 Webpack 有什么区别？各自适合什么场景？

**核心考察点**：是否理解不同工具的定位。

**回答要点**：

| 维度         | Webpack                                                         | Rollup                                                     |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------- |
| 定位         | 全能型应用打包器                                                | 专注库打包                                                 |
| 代码分割     | 非常强（动态 import + SplitChunks）                             | 支持但不如 Webpack 灵活                                    |
| 输出格式     | 主要是浏览器可运行的 bundle（IIFE/UMD/CommonJS/ESM）            | ESM / CJS / UMD / IIFE，**尤其对 ESM 友好**                |
| Tree Shaking | 靠 ESM + Terser                                                 | **原生就做得很好**（业界最早把 Tree Shaking 做成熟的工具） |
| 插件生态     | 极丰富（loader + plugin）                                       | 丰富但偏库场景                                             |
| 开发体验     | DevServer / HMR 完整                                            | 通常配合 Vite 或其他 dev server                            |
| **适用场景** | **大型 Web 应用**、SPA、多页应用、需要大量 loader/plugin 的项目 | **类库/组件库**、工具库、纯 JS 模块发布到 npm              |

**一句话总结**：**应用用 Webpack/Vite，库用 Rollup**。
