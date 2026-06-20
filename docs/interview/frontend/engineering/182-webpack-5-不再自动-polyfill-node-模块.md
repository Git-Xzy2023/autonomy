---
title: "为什么 Webpack 5 不再自动 polyfill Node 模块？这对老项目有什么影响？"
---

# 为什么 Webpack 5 不再自动 polyfill Node 模块？这对老项目有什么影响？

**回答要点**：

Webpack 4 及以前，如果你 `require('path')`、`require('buffer')`，Webpack 会自动注入 `path-browserify`、`buffer` 等 polyfill。这导致：

1. **意外增大 bundle**——很多开发者根本不知道自己在浏览器里用到了 Node API（通常是某个依赖偷偷用了）。
2. **与浏览器语义不符**——浏览器里没有文件系统，`path` 的语义本身就很奇怪。

Webpack 5 选择**不再自动注入**，并提示你：

```
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
```

**老项目处理方式**：

- 如果**确实**需要在浏览器用它：`resolve.fallback: { path: require.resolve('path-browserify') }`。
- 如果**不需要**：找到为什么你的代码/依赖会 import 它，改成不依赖或用 `IgnorePlugin` 忽略。
