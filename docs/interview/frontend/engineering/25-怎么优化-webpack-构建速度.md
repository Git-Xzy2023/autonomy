---
title: "你是怎么优化 Webpack 构建速度的？"
---

# 你是怎么优化 Webpack 构建速度的？

**核心考察点**：是否有线上优化经验。

**常见手段**（请挑你真正做过的讲）：

1. **持久化缓存**：`cache: { type: 'filesystem' }`（Webpack 5 自带）。
2. **缩小查找范围**：
   ```js
   module: { rules: [{ test: /\.js$/, include: path.resolve('src'), exclude: /node_modules/, use: 'babel-loader' }] }
   resolve: { extensions: ['.js', '.ts', '.tsx'], alias: { '@': path.resolve('src') } }
   ```
3. **Babel 缓存**：`babel-loader?cacheDirectory=true` 或 Babel 的 `cacheDirectory`。
4. **多进程**：`thread-loader` 或 `terser-webpack-plugin` 的 `parallel: true`。
5. **预构建依赖**：`DllPlugin + DllReferencePlugin`（Webpack 5 之前的方案，现在推荐直接用 `externals` 或 ESBuild 处理 vendor）。
6. **ESBuild / SWC 替代 Babel + Terser**：`esbuild-loader`、`swc-loader` 能大幅加快 TS/JSX 转译和压缩。
7. **合理配置 SplitChunks**，减少重复打包。
8. **开发环境关闭 source map / 使用便宜的 source map**。
9. **使用 `noParse`** 告诉 Webpack 不要解析某些大型库（如 `moment`、`jquery`）。
10. **使用 `stats` / `webpack-bundle-analyzer` / `speed-measure-webpack-plugin` 定位瓶颈**。
