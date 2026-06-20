---
title: "Code Splitting / 代码分割怎么做？有几种策略？"
---

# Code Splitting / 代码分割怎么做？有几种策略？

**核心考察点**：是否真的做过"工程化"的性能优化。

**常见策略**：

**1. 入口分割（Entry Points）** —— 手动拆分

```js
// webpack.config.js
module.exports = {
  entry: {
    app: "./src/app.js",
    admin: "./src/admin.js",
  },
  output: {
    filename: "[name].[contenthash].js",
  },
};
```

缺点：多入口可能共享重复依赖，需要配合下面的策略。

**2. 动态 import（按需加载）** —— 最常用

```js
// React 路由场景
const Admin = lazy(() => import("./pages/Admin"));
// 或任何条件触发
button.onclick = () => import("./heavy-lib").then((m) => m.use());
```

**3. SplitChunks（提取公共依赖）** —— Webpack 核心配置

```js
optimization: {
  splitChunks: {
    chunks: 'all',          // 'initial' | 'async' | 'all'
    minSize: 20000,         // 至少 20KB 才会被拆
    maxSize: 240000,        // 超过后尝试再拆
    minChunks: 1,           // 被多少个 chunk 共用才拆分
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
  runtimeChunk: 'single',   // 把 webpack runtime 单独拆，便于长期缓存
}
```

**4. Vite / Rollup 的 manualChunks**

```js
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vue: ['vue', 'vue-router', 'pinia'],
        echarts: ['echarts'],
      },
    },
  },
},
```

**面试官可能追问**：

- `chunks: 'all'` vs `'async'` 有什么区别？→ all 会把同步导入也拆分；async 只拆动态导入。
- `runtimeChunk: 'single'` 的作用？→ 提取 webpack 的模块加载器，避免业务代码变动导致 chunk hash 变化。
- `contenthash` vs `chunkhash` vs `hash`？→ contenthash 基于文件内容（推荐长期缓存），chunkhash 基于 chunk，hash 是整个构建。
