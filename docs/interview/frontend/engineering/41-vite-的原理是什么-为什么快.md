---
title: "Vite 的原理是什么？为什么快？"
---

# Vite 的原理是什么？为什么快？

**核心考察点**：是否理解 Vite 和传统 Bundler 的本质差异。

**回答要点**：

Vite 把开发流程分成两个阶段：**依赖预构建** + **源码按需编译**。

**1. 依赖预构建（使用 esbuild）**

- 项目启动时只扫描 `node_modules` 里被 import 的依赖（不是全部 node_modules）。
- 用 esbuild（Go 写的，比 JS 快 10~100 倍）把 CommonJS/UMD 的依赖转成 ESM，并把多个内部模块"合并"成一个文件，减少后续浏览器请求。
- 结果缓存到 `node_modules/.vite/deps`。下次启动如果依赖没变化，直接复用。

**2. 源码按需编译（利用浏览器原生 ESM）**

- 开发模式下 Vite 不打包。浏览器访问一个 URL → Vite 只编译那个入口文件 → 浏览器再解析里面的 import 继续请求 → **按需加载**。
- 传统 Webpack 需要先把所有模块打包成 bundle，然后才能在浏览器跑。项目越大，启动越慢；Vite 的启动时间几乎和项目规模无关。
- 每个文件按需用 esbuild 或对应插件编译（Vue SFC、TSX、SCSS……）。

**3. HMR（热模块替换）**

- Vite 的 HMR 只更新受影响的模块，不需要重建整个 bundle，所以大型项目里 HMR 秒级。
- 依赖通过 hash 做长期缓存，业务代码走 HTTP 304。

**为什么生产环境还是用 Rollup 打包？**

- 原生 ESM 在生产环境会产生大量请求（瀑布加载），网络开销大。
- Rollup 做 Tree Shaking、Code Splitting、CSS 处理、资源优化更成熟。
- Vite 在生产模式下会调用 `rollup` 完成真正的打包。
