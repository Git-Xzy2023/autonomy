---
title: "Source Map 有哪些类型？如何选择？"
---

# Source Map 有哪些类型？如何选择？

**核心考察点**：是否理解 Source Map 的实际开销。

| 类型                      | 产物大小               | 质量                              | 适用场景                                     |
| ------------------------- | ---------------------- | --------------------------------- | -------------------------------------------- |
| `eval`                    | 小                     | 较差（能看到转译后代码）          | dev 最快                                     |
| `source-map`              | 最大（独立 .map 文件） | 最好                              | production + Sentry                          |
| `hidden-source-map`       | 大                     | 最好，但 bundle 里不引用 .map     | production（避免用户打开 DevTools 看到源码） |
| `inline-source-map`       | 大（内嵌到 JS）        | 最好                              | 调试用                                       |
| `cheap-source-map`        | 中等                   | 忽略列信息、忽略 loader sourcemap | 开发                                         |
| `cheap-module-source-map` | 中等                   | 包含 loader sourcemap，忽略列     | **Vite/Webpack dev 推荐**                    |
| `nosources-source-map`    | 小                     | 只有堆栈，没有源码                | production（线上报错只需要堆栈）             |

**经验做法**：

- **开发环境**：`cheap-module-source-map`（Vite 默认）
- **生产环境**：`hidden-source-map` 或 `nosources-source-map`，.map 文件上传到错误监控平台（Sentry），不要暴露给用户。
