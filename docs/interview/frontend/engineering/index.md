---
title: 工程化面试题
---

# 前端工程化面试题

说明：以下题目按模块组织，每题要求"能回答到点子上"。面试时对方很可能会拿着实际配置/打包产物/性能数据追问，所以请确保对每个工具的**核心机制、典型配置项、常见问题**都能讲清楚。

---

## 一、构建工具通用题

### Q1 前端为什么需要构建工具？你用过哪些？

**核心考察点**：是否理解"为什么要做构建"这个底层动机。

**回答要点**：

- **源码层面**：ES Modules/TS/JSX/Sass 在浏览器里不能直接跑，需要转译。
- **工程层面**：多文件需要合并（Bundle）、按需加载（Code Splitting）、静态资源处理。
- **性能层面**：压缩、Tree Shaking、预构建、图片优化、分包、CDN。
- **开发体验层面**：HMR、Dev Server、Source Map、ESLint、TypeScript 检查。
- **生态层面**：npm/yarn/pnpm 生态里有大量 CommonJS/ESM 混用，需要工具抹平差异。

**你可以举例**：Webpack、Rollup、Vite、esbuild、Rspack、Turbopack、Parcel、Snowpack。

---

### Q2 什么是打包（Bundling）？Bundler 做了哪些事？

**核心考察点**：对"打包"流程是否有整体认知。

**回答要点**：

一个典型 Bundler 的工作流程（以 Webpack/Rollup 为例）：

1. **解析入口**：从 entry 文件开始，构建 Module Graph（依赖图）。
2. **Resolve**：根据 import/require 语句，用 resolver 解析出真实文件路径（包括 node_modules、alias、extensions）。
3. **Load / Parse**：读取文件内容，用 Parser 解析成 AST。
4. **Transform**：Loader / Plugin 对每个模块做转换（Babel、TS、SCSS……）。
5. **Dependency Collection**：收集每个模块的依赖列表（import 了谁）。
6. **Code Splitting**：根据配置或动态 import 拆分成多个 Chunk。
7. **Tree Shaking**：标记未使用的导出并移除（需要 ESM + sideEffects 配合）。
8. **生成产物**：把 Module Graph 渲染成最终的 JS 文件 + runtime。
9. **输出 & 优化**：压缩（Terser/esbuild）、哈希、sourcemap、manifest。

**可以随手画一个依赖图的示意**：

```
entry.js
 ├── a.js → import c.js
 ├── b.js
 └── styles.css
```

---

### Q3 Tree Shaking 的原理是什么？有什么前提？

**核心考察点**：是否真正理解"为什么能摇掉"以及在实际项目中的常见坑。

**回答要点**：

**原理**：基于 **ES Modules 的静态结构**（`import`/`export` 在书写层面就固定，不能动态生成）。Bundler 可以在**构建时**做"可达性分析"：从入口出发，标记哪些导出被使用，未被使用的导出就被"摇掉"（不输出到 bundle，或通过 minifier 移除对应代码）。

**前提条件**：

1. **必须是 ESM**。`require()` 是动态的，无法做静态分析。因此项目必须使用 `import`/`export`。
2. **`package.json` 里的 `"sideEffects"`**：告诉 Bundler 哪些文件"有副作用"（例如 polyfill、CSS-in-JS 的全局注入）。副作用文件不能被整体摇掉，只能细粒度分析。
   ```json
   { "sideEffects": ["*.css", "*.scss"] }
   ```
3. **压缩器能识别死代码**（Terser/esbuild/terser-webpack-plugin）。Tree Shaking 本身只是"标记"，真正删除由 minifier 完成。
4. **Webpack 的 `usedExports: true`** + production mode。

**常见问题**：

- "我明明 export 了但没有被用，为什么还在 bundle 里？" 很可能是文件被标记为 sideEffects: true，或被某个全局入口 import 了整个包。
- 第三方库如果发布的是 CJS，大概率不能被 Tree Shaking（除非库额外提供 ESM 版本）。

---

### Q4 Code Splitting / 代码分割怎么做？有几种策略？

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

---

### Q5 Source Map 有哪些类型？如何选择？

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

---

## 二、Webpack

### Q6 Webpack 的核心概念：Entry / Output / Loader / Plugin / Mode / Chunk

**核心考察点**：是否能把每个概念讲清楚，以及讲出它们之间的关系。

**回答要点**：

- **Entry**：打包入口，Webpack 从这里开始构建依赖图。可以是字符串、对象（多入口）、数组。
- **Output**：产物输出配置。`filename` 决定文件名（可带 `[name].[contenthash].js`），`path` 决定目录，`publicPath` 决定运行时加载资源的前缀。
- **Loader**：**"文件转换器"**。Webpack 本身只理解 JS/JSON，其他文件（TS、CSS、图片）都需要 Loader 转换成 JS Module。典型的链式调用：`['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']`（**执行顺序从右到左**）。
- **Plugin**：**"流程钩子"**。贯穿整个构建生命周期，能在各个阶段介入修改产物、收集信息、写文件。例如 `HtmlWebpackPlugin`、`MiniCssExtractPlugin`、`TerserWebpackPlugin`、`DefinePlugin`。
- **Mode**：`development` / `production` / `none`。生产模式默认启用压缩、Tree Shaking、确定性模块 ID 等优化。
- **Chunk**：打包输出的一个代码块。Entry、动态 import、SplitChunks 都会产生 Chunk。一个 Chunk 可能由多个 Module 组成。

**Loader vs Plugin 的区别**：

- Loader 是"转换模块"的，每次 Webpack 加载一个非 JS 文件时都需要经过它；是针对文件级的。
- Plugin 是"扩展 Webpack 能力"的，通过监听构建生命周期事件来做事；是针对打包流程级的。

---

### Q7 手写一个简单的 Loader

**核心考察点**：对 Loader API 是否熟悉。

```js
// my-loader.js
// Loader 是一个接收源码、返回（或回调）新源码 + sourcemap 的函数
module.exports = function (source, sourceMap, meta) {
  // this 是 loader context，有各种 API：
  // this.query / this.getOptions()  —— 拿到配置
  // this.callback(err, content, sourceMap, meta)  —— 异步返回
  // this.async()                     —— 声明异步
  // this.emitFile(path, content)     —— 写文件

  // 简单例子：把源码中的 'FOO' 替换成 'bar'
  const result = source.replace(/FOO/g, "bar");

  // 同步返回
  return result;
  // 或 this.callback(null, result, sourceMap, meta);
};

// 使用：{ test: /\.js$/, loader: path.resolve('./my-loader.js') }
```

---

### Q8 手写一个简单的 Plugin

**核心考察点**：对 Webpack 插件生命周期是否熟悉。

Plugin 就是一个带 `apply(compiler)` 方法的对象。通过 `compiler.hooks.xxxx.tap` 来订阅事件。

```js
// my-plugin.js
class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    // emit 钩子：输出 assets 到 output 目录前触发
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      // 在产物里新增一个文件
      compilation.assets["version.txt"] = {
        source: () => `version: ${this.options.version}`,
        size: () => this.options.version.length,
      };
      callback();
    });

    // 其他常用钩子：
    // compiler.hooks.done.tap(...)      构建完成
    // compiler.hooks.compilation.tap(...) 每次 compilation 创建时
    // compilation.hooks.optimizeChunkAssets.tapAsync(...) 处理 chunk 产物
  }
}
module.exports = MyPlugin;
```

---

### Q9 Webpack 5 有什么新东西？为什么要升级？

**核心考察点**：是否关注构建工具的演进。

**回答要点**：

1. **持久化缓存（Persistent Caching）**：`cache: { type: 'filesystem' }`。把模块编译结果缓存到磁盘，第二次构建速度可提升 5~10 倍。这是 Webpack 5 最大的卖点。
2. **原生支持资源模块（Asset Modules）**：用 `type: 'asset/resource' | 'asset/inline' | 'asset/source' | 'asset'` 取代 `file-loader`、`url-loader`、`raw-loader`。
3. **更好的 Tree Shaking**（`moduleIds: 'deterministic'`、对嵌套导出的分析）。
4. **模块联邦（Module Federation）**：允许多个独立构建的应用在运行时互相加载模块，是微前端的一种原生解法。
5. **Chunk ID 确定性**（`deterministic`），相同内容产生相同 ID，有利于长期缓存。
6. **废弃了 Node polyfill**（如 `path`、`buffer` 在浏览器环境下不再自动注入）。

---

### Q10 你是怎么优化 Webpack 构建速度的？

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

---

### Q11 你是怎么分析 Bundle 体积的？有哪些工具？

**核心考察点**：是否具备"用数据说话"的工程思维。

**工具**：

- **`webpack-bundle-analyzer`**：可视化饼图，最直观。
- **`webpack --profile --json > stats.json`** + `webpack.github.io/analyse`。
- **`statoscope`**、**`bundle-stats`**：能对比两次构建的差异，适合 CI 上监控。
- **`source-map-explorer`**：用 sourcemap 反推每个源码的贡献体积。
- **Vite/Rollup**：`rollup-plugin-visualizer`。

**关注点**：

- 哪个模块/库意外地大？（例如整个 lodash、moment 的 locale）
- 同一个库是否被多个 chunk 重复打包？（SplitChunks 没配好）
- 某个组件是否被首页 bundle 拉到了？（需要动态 import）

---

## 三、Rollup

### Q12 Rollup 和 Webpack 有什么区别？各自适合什么场景？

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

---

### Q13 Rollup 的 `external` / `globals` 是干什么的？

**核心考察点**：库打包场景的关键配置。

```js
// rollup.config.js
export default {
  input: "src/index.js",
  external: ["lodash", "react"], // 声明这些依赖"外部化"，不会被打进来
  output: [
    { file: "dist/lib.cjs.js", format: "cjs" },
    { file: "dist/lib.esm.js", format: "esm" },
    {
      file: "dist/lib.umd.js",
      format: "umd",
      name: "MyLib",
      globals: {
        // UMD 需要告诉它外部模块在全局叫什么
        lodash: "_",
        react: "React",
      },
    },
  ],
};
```

- `external`：**不把依赖打进 bundle**，由使用者提供（peerDependencies）。库打包必须用它，否则你的库会把整个 lodash/react 打进去，巨无霸。
- `globals`：UMD 产物在浏览器里通过 `window._`、`window.React` 来访问外部依赖。

---

## 四、Vite

### Q14 Vite 的原理是什么？为什么快？

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

---

### Q15 你在 Vite 配置里一般会写什么？

**核心考察点**：是否有实际使用经验。

```js
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()], // 框架插件（vue/react/svelte...）

  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
    fs: { strict: false }, // 允许访问 src 外的文件（monorepo 场景）
  },

  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "element-plus": ["element-plus"],
          echarts: ["echarts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 调大 chunk 大小警告
  },

  optimizeDeps: {
    include: ["@scope/some-lib"], // 强制预构建某些被漏掉的依赖
    exclude: ["some-esm-only-pkg"],
  },
});
```

---

### Q16 Vite 里 `optimizeDeps` 是干什么的？什么时候需要手动配置？

**核心考察点**：是否理解 Vite 预构建的机制和坑。

**常见场景需要手动 include**：

1. **动态 import 的依赖**：`import(`./locale/${lang}`)` 这样的变量导入，Vite 扫描不到，需要显式加到 `include`。
2. **Monorepo 里的 workspace 包**：Vite 默认可能不把 sibling 包当作依赖，导致首次加载时被编译成多个请求。
3. **CommonJS 包**：某些包虽然 package.json 声明了 ESM，但入口文件里有 `require`，Vite 需要把它预构建。
4. **`exclude`**：某些 ESM 原生包（如某些现代库）你不想被预构建（想直接用浏览器加载）。

**常见问题排查**：页面第一次打开很慢 / 控制台有 `X files changed, reloading` 频繁触发 → 检查 `optimizeDeps.include` 有没有把相应库加入。

---

## 五、esbuild / SWC / Rspack / Turbopack

### Q17 你知道 esbuild 吗？它为什么这么快？

**核心考察点**：是否对"下一代构建工具"有认知。

**回答要点**：

- **语言是 Go**，编译成机器码直接跑，没有 JS 的启动和解释开销。
- **重度并行**：解析、转换、代码生成都大量使用多线程。
- **内存友好**：不用 JS 对象存储 AST，而是用更紧凑的结构 + 指针。
- **功能克制**：只做最核心的 Bundle + Transform，没有 Plugin 生态（有限 plugin API），架构更简单。

**适用场景**：

- **预构建依赖**（Vite 的默认选择）。
- **TS/JSX 转译**（`esbuild-loader` 替换 babel-loader 可快 10x）。
- **压缩 JS/CSS**（比 Terser 快几十倍，体积稍大但可接受）。
- **打包简单的 CLI 工具/Node 库**。

**局限性**：没有 Babel 的 AST 处理生态（比如某些特定的 babel-plugin 你没法直接用），不能完全替代 Webpack/Rollup。

---

### Q18 SWC 和 Babel 有什么区别？什么时候会选 SWC？

**核心考察点**：对 JS 转译工具链的了解。

- **SWC** 是 Rust 写的 JS/TS 编译器，速度碾压 Babel。
- **Next.js 12+** 默认用 SWC；**Vite** 也有实验性的 SWC 插件；**Parcel** 内部也用 SWC。
- **适用场景**：大型项目、Monorepo、CI 构建时间敏感的场景。
- **限制**：插件生态还没 Babel 丰富，如果你重度依赖某些特定 Babel 插件（比如某些装饰器、antd 的 babel-plugin-import），切换需要验证。

---

### Q19 Rspack 了解吗？和 Webpack 是什么关系？

**核心考察点**：对国内工程化生态的关注。

- **Rspack** 是字节跳动开源的、基于 Rust 的 Webpack 兼容构建工具。目标是**"与 Webpack 配置兼容、但速度快 5~10 倍"**。
- 核心特点：兼容 Webpack 的 loader/plugin API（逐步支持中），无需改项目配置就能迁移；内置 CSS、TS 支持；有 `rspack` CLI。
- 与 Webpack 的关系：**替代者**，不是"下一代 Webpack"。Webpack 官方方向是 Webpack 5 + 持续改进。

---

## 六、性能优化（构建与运行时）

### Q20 首屏性能怎么优化？从哪些维度思考？

**核心考察点**：是否有系统性的优化思路，而不是只会堆配置。

**回答要点**（请按你实际做过的展开）：

**A. 减少请求数量**

- 资源合并：但不要合并得太大，按需分割。
- HTTP/2 + 多路复用：不用再手动雪碧图、手动合并 CSS（但 chunk 拆分策略仍要合理）。
- 图标用 SVG Sprite / Iconfont / inline SVG。

**B. 减少资源大小**

- Tree Shaking + 按需加载（`lodash-es` 而不是 `lodash`；`antd` 按需引入）。
- 图片：WebP/AVIF、压缩、懒加载、`loading="lazy"`、`srcset` + `sizes`。
- 文本类资源 gzip / brotli（Nginx / CDN 开启）。
- 字体：子集化、`font-display: swap`、预加载关键字体。
- 移除 polyfill：用 `@babel/preset-env` 的 `useBuiltIns: 'usage'`，或干脆放弃老浏览器。

**C. 让请求更早发、更快到**

- CDN（静态资源、图片）。
- `<link rel="dns-prefetch">`、`<link rel="preload">` 关键资源。
- `<script defer>` / `<script async>` / `<script type="module">`。
- HTTP 缓存策略：长期 hash 文件名 + `Cache-Control: max-age=31536000, immutable`。
- SSR / SSG / ISR（React Server Components / Next.js / Nuxt）。

**D. 减少 JS 执行时间**

- 首屏只加载首屏代码，其他路由动态 import。
- Web Worker 做纯计算（复杂解析、搜索索引）。
- 避免长任务（`requestIdleCallback` 拆分）。
- 虚拟列表、虚拟表格。

**E. 监控与度量**

- LCP（最大内容绘制）、FID（首次输入延迟）、CLS（累计布局偏移）—— Core Web Vitals。
- 自建上报：Performance API、Navigation Timing、Resource Timing、User Timing。
- WebPageTest、Lighthouse CI、PageSpeed Insights。

---

### Q21 你怎么决定哪些库应该 vendor chunk，哪些应该按需加载？

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

---

## 七、包管理与依赖

### Q22 npm / yarn / pnpm 的区别？pnpm 为什么更快？

**核心考察点**：是否对 Node 生态有深入理解。

**回答要点**：

| 维度           | npm (v3+)                                              | yarn (v1)         | pnpm                                                                          |
| -------------- | ------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------- |
| 安装方式       | 扁平 node_modules                                      | 扁平 node_modules | **内容寻址存储（content-addressable）+ 硬链接 + 符号链接**                    |
| 多项目磁盘占用 | 每个项目一份完整副本                                   | 同上              | **全局只存一份**，每个项目通过硬链接引用                                      |
| 安装速度       | 最慢                                                   | 比 npm 快         | 最快（磁盘 + 网络都省）                                                       |
| 幽灵依赖       | 严重（依赖的依赖可能被扁平到顶层，你可以直接 require） | 同样问题          | **杜绝幽灵依赖**（默认 .pnpm 目录结构，只有 package.json 声明的依赖才能访问） |
| 锁文件         | `package-lock.json`                                    | `yarn.lock`       | `pnpm-lock.yaml`                                                              |
| 工作区支持     | npm workspaces (v7+)                                   | yarn workspaces   | `pnpm-workspace.yaml`，原生支持很好                                           |

**pnpm 的核心是 "node_modules/.pnpm/`<pkg>@<version>`/node_modules/..." 的结构**：

- 磁盘上只有一份真实文件，全局放在 `~/.local/share/pnpm/store/v3`。
- 项目里通过硬链接引用。
- 依赖之间用符号链接串起来形成嵌套 node_modules。
- 结果：**同一版本的包在一台机器上只下载一次、只占一份磁盘**。

**常见问题**：

- "我用 require('lodash') 但没在 package.json 里声明，为什么之前能跑？" → 幽灵依赖。pnpm 会让它报错，强制你声明。
- monorepo 场景下 pnpm 体验显著优于 npm/yarn。

---

### Q23 package.json 里 `dependencies` / `devDependencies` / `peerDependencies` / `optionalDependencies` 有什么区别？

**核心考察点**：对依赖语义是否清晰。

| 字段                   | 含义                   | 是否被安装到最终项目                    | 典型使用                          |
| ---------------------- | ---------------------- | --------------------------------------- | --------------------------------- |
| `dependencies`         | 运行时必需             | 是                                      | 业务代码里真正 import 的库        |
| `devDependencies`      | 开发/构建时使用        | 否（库的消费者不会安装）                | webpack、vite、jest、eslint、tsc  |
| `peerDependencies`     | **由宿主环境提供**     | 不自动安装（npm 7+ 会自动装但仍有警告） | UI 库依赖 react/vue，插件依赖主库 |
| `optionalDependencies` | 可选，安装失败不会中断 | 是（如果能装上）                        | 某些可选的原生模块、性能增强库    |

**peerDependencies 的例子**：

```json
// 一个 UI 组件库的 package.json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  }
}
```

意思是"**请使用这个库的项目自己安装 React**"，库本身不会把 React 打进 bundle。

---

### Q24 什么是 SemVer（语义化版本）？`^1.2.3`、`~1.2.3`、`1.2.3` 有什么区别？

| 写法      | 含义                          | 允许的版本范围        |
| --------- | ----------------------------- | --------------------- |
| `1.2.3`   | 固定版本                      | 只有 1.2.3            |
| `^1.2.3`  | **兼容**（不破坏 API 的更新） | `>=1.2.3` 且 `<2.0.0` |
| `~1.2.3`  | **补丁**（只有修复）          | `>=1.2.3` 且 `<1.3.0` |
| `>=1.2.3` | 大于等于                      | `1.2.3` 及所有更新    |
| `*`       | 任意                          | 任何版本              |

SemVer 格式：`主版本.次版本.修订号`

- 主版本：**不兼容**的 API 改动
- 次版本：向下兼容的**新功能**
- 修订号：向下兼容的**问题修复**

**锁定策略**：锁文件（package-lock.json / yarn.lock / pnpm-lock.yaml）会记录真正安装的版本，保证团队和 CI 环境一致。`npm ci` / `pnpm install --frozen-lockfile` 强制使用锁文件版本。

---

## 八、Monorepo

### Q25 你了解 Monorepo 吗？什么时候用？用过哪些工具？

**核心考察点**：是否接触过"工程化的高级形态"。

**Monorepo 适合的场景**：

- 多个包/应用共享大量代码（UI 组件库、业务组件、utils、hooks）。
- 团队协作时需要统一的 lint/tsconfig/构建流程。
- 一个产品拆成多个 App + 共享库。

**主流方案**：

| 方案                  | 特点                                                                       | 代表                  |
| --------------------- | -------------------------------------------------------------------------- | --------------------- |
| **pnpm workspaces**   | 最轻量，利用 pnpm 的依赖管理能力；构建需要自己写脚本或搭配其他工具         | 大多数场景的默认选择  |
| **Yarn Workspaces**   | 老牌；依赖管理不如 pnpm 快                                                 | 老项目                |
| **Turborepo**         | 基于任务图（task graph）的增量构建缓存，搭配 pnpm/yarn/npm workspaces 使用 | Vercel 出品，生态好   |
| **NX**                | 大而全：脚手架、生成器、可视化、任务图、远程缓存                           | Angular/Nest 生态友好 |
| **Lerna**（维护模式） | 最早的 monorepo 工具；现在通常搭配 NX 使用                                 | 老项目迁移            |
| **Rush**              | 微软出品，非常严格                                                         | 大型团队、严格规范    |

**关键问题**（面试官可能追问）：

- **版本管理**：每个包独立发版？还是统一版本（如 Babel 模式）？
- **构建顺序**：A 依赖 B，必须先构建 B 再构建 A。Turborepo/NX 通过 pipeline 配置解决。
- **幽灵依赖**：pnpm 的 strict-peer-dependencies / hoistPattern 配置可以控制。

---

## 九、代码质量工具链

### Q26 ESLint / Prettier / Stylelint / Husky / lint-staged / commitlint 各自负责什么？怎么协作？

**核心考察点**：是否搭建过工程化规范体系。

**典型组合**：

```
package.json
├── devDependencies
│   ├── eslint              // JS/TS 代码质量检查
│   ├── prettier            // 代码格式化（风格）
│   ├── eslint-config-prettier  // 关闭 ESLint 里与 Prettier 冲突的规则
│   ├── eslint-plugin-prettier  // 让 Prettier 以 ESLint 规则形式运行
│   ├── stylelint           // CSS/SCSS 检查
│   ├── husky               // git hooks 管理
│   ├── lint-staged         // 只对 git staged 文件跑 lint，速度快
│   ├── commitlint          // 校验 commit message
│   └── @commitlint/config-conventional
└── scripts: {
      "lint": "eslint src --ext .ts,.tsx --cache",
      "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
      "prepare": "husky install",  // 安装 husky（npm v7+ prepare 脚本）
    }
```

**`.husky/pre-commit`**：

```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

**`.husky/commit-msg`**：

```sh
npx --no -- commitlint --edit "$1"
```

**`package.json` 的 `lint-staged`**：

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

**Commit 规范（Conventional Commits）**：
`type(scope): subject`

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具链

---

### Q27 ESLint 怎么写自定义规则？

**核心考察点**：是否理解 AST，是否真正把 lint 用到了团队规范里。

ESLint 规则就是一个导出 `create` 方法的对象，通过 AST visitor 工作：

```js
module.exports = {
  meta: {
    type: "suggestion",
    docs: { description: "禁止使用 console.log" },
    fixable: "code", // 这个规则能自动 fix
    schema: [],
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "console" &&
          node.property.type === "Identifier" &&
          node.property.name === "log"
        ) {
          context.report({
            node,
            message: "请使用 logger 而不是 console.log",
            fix: (fixer) => fixer.replaceText(node.property, "info"),
          });
        }
      },
    };
  },
};
```

可以用 [astexplorer.net](https://astexplorer.net) 观察你的代码对应什么 AST 结构。

---

## 十、CI/CD 与部署

### Q28 你们前端项目的 CI 流程大概是怎样的？

**核心考察点**：是否理解"从提交代码到上线"的整条链路。

**一个典型 GitHub Actions / GitLab CI 流程**：

```yaml
name: CI
on: [push, pull_request]
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 8 }
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck # tsc --noEmit
      - run: pnpm test -- --coverage
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }
```

**关键要讲的**：

- **缓存**：node_modules、构建产物缓存（`actions/cache`、Turborepo Remote Cache）。
- **并行**：lint / test / build 是否能并行跑。
- **锁文件**：CI 要用 `--frozen-lockfile` / `npm ci`，保证版本一致。
- **产出**：构建产物作为 artifact，CD 流程读取并部署。

---

### Q29 你是怎么部署前端项目的？Nginx 里有哪些关键配置？

**核心考察点**：是否理解"构建产物到底怎么变成用户能访问的页面"。

**一个典型 Nginx 配置**：

```nginx
server {
  listen 80;
  server_name app.example.com;
  root /var/www/app;
  index index.html;

  # SPA 路由 fallback —— 非常重要！否则刷新 /users/123 会 404
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 静态资源长期缓存（因为文件名带 contenthash）
  location ~* \.(js|css|png|jpg|jpeg|webp|svg|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
  }

  # HTML 不缓存，保证每次发布用户能拿到最新
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # 接口代理
  location /api/ {
    proxy_pass http://backend-service:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # 开启 gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
  gzip_min_length 1024;
}
```

**容易忽略的点**：

- **SPA fallback**：`try_files $uri /index.html`。
- **HTML 不缓存**：否则用户永远拿旧页面。
- **静态资源强缓存**：带 hash 的资源文件可以一年不失效。
- **gzip / brotli**：文本类资源体积减 60%+。
- **HTTPS / HSTS**：生产环境必须。
- **安全头**：`X-Content-Type-Options: nosniff`、`X-Frame-Options`、`Content-Security-Policy`。

---

### Q30 什么是 BFF？前端为什么需要它？

**核心考察点**：是否理解"前端在后端的位置"。

**BFF（Backend for Frontend）**：为每个前端应用（Web / iOS / Android）单独写一个后端服务，专门负责：

- 聚合多个微服务的数据（减少前端请求数）。
- 裁剪后端返回字段（避免大字段下发给移动端）。
- 转换数据格式（后端返回 Protobuf / SOAP → 给前端 JSON）。
- 做鉴权、登录态、SSR 渲染。
- 屏蔽后端差异（微服务重构时，BFF 不变，前端无感）。

**典型架构**：

```
用户设备  →  CDN（静态资源）
         ↘  BFF（Node.js / Go / Java）  →  微服务 A
                                          ↘  微服务 B
                                           ↘ 微服务 C
```

**为什么用 Node.js 写 BFF 很常见**：

- 前端团队可以自己维护，前后端用同语言，JS 全栈。
- SSR/SSG 天然适合 Node（Next.js / Nuxt / Remix）。
- 同构（isomorphic）：一套代码既跑服务端又跑客户端。

---

## 十一、环境与规范

### Q31 你怎么管理多个 Node 版本？团队怎么统一 Node 版本？

- **nvm** / **n** (mac/linux)：切换 Node 版本。
- **nvm-windows**：Windows 版本。
- **fnm** (Fast Node Manager)：Rust 写的，更快。
- **Volta**：还能管理 npm/yarn 版本，`package.json` 里声明 `"volta": { "node": "20" }` 即可。
- **`.nvmrc` / `.node-version`**：项目根目录放一个，很多工具会自动切换。
- **engines 字段**：`package.json` 里 `"engines": { "node": ">=20", "pnpm": ">=8" }`，加上 `.npmrc` 的 `engine-strict=true` 强制校验。

---

### Q32 你怎么设计"新项目脚手架"？

**核心考察点**：是否具备"团队工程化负责人"的视角。

**一个脚手架通常提供**：

1. **模板**：`ts-lib` / `react-app` / `vue-component` / `next-app` 等多种模板。
2. **统一依赖版本**：React 18、Vite 5、TypeScript 5、ESLint 8、Prettier 3——团队用同一个"基线"。
3. **内嵌配置**：tsconfig、eslintrc、prettierrc、.gitignore、.editorconfig。
4. **内置脚本**：`dev`、`build`、`test`、`lint`、`typecheck`、`release`。
5. **CI 模板**：GitHub Actions / GitLab CI。
6. **升级机制**：`npm-check-updates` / `taze` / 脚手架自身能升级模板。

**实现方式**：

- **CLI**：用 `commander` / `cac` / `yargs` 解析命令。
- **模板**：用 EJS / Handlebars 渲染，或直接复制目录 + 字符串替换。
- **发布**：把 CLI 发布成 npm 包，团队通过 `npm create my-scaffold` 或 `pnpm create my-scaffold` 调用（`create-*` 是 npm 的约定）。

**一个极简实现示例**：

```js
#!/usr/bin/env node
import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";

const program = new Command();
program
  .argument("<project-name>")
  .option("--template <type>", "模板：react / vue / lib", "react")
  .action((name, opts) => {
    const dest = path.resolve(process.cwd(), name);
    const templateDir = path.resolve(__dirname, "../templates", opts.template);
    // 复制模板
    fs.cpSync(templateDir, dest, { recursive: true });
    // 替换 package.json 中的项目名
    const pkgPath = path.join(dest, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.name = name;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`✅ 已创建 ${name}，下一步：cd ${name} && pnpm install`);
  });
program.parse(process.argv);
```

---

## 十二、TypeScript 工程化

### Q33 tsconfig.json 里哪些字段最重要？

**常见"工程化必用"字段**：

```jsonc
{
  "compilerOptions": {
    "target": "ES2020", // 输出语言版本
    "module": "ESNext", // 模块系统
    "moduleResolution": "bundler", // 模块解析方式
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true, // 所有严格检查
    "noUnusedLocals": true, // 未使用的局部变量报错
    "noUnusedParameters": true, // 未使用的函数参数报错
    "noImplicitReturns": true, // 所有代码路径必须有返回
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx", // React 17+ JSX 转换
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true, // 跳过声明文件检查，加快速度
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true, // 每个文件都是独立模块（和 esbuild 配合）
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "outDir": "dist",
    "declaration": true, // 输出 .d.ts
    "declarationMap": true, // 声明文件的 sourcemap，IDE 跳转用
    "sourceMap": true,
    "types": ["vite/client", "node"], // 声明哪些全局类型可用
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
}
```

**工程化实践**：多个 tsconfig 通过 `extends` 继承（tsconfig.base.json + tsconfig.app.json + tsconfig.node.json）。Vite 项目默认就这么组织。

---

### Q34 你怎么发布一个 TypeScript 库到 npm？

**核心考察点**：是否理解"库的发布"与"应用的构建"差异。

**关键步骤**：

1. **构建产物**：通常输出 `dist/` 下多份：
   - `*.js`（CommonJS，`require`）
   - `*.mjs` 或 `*.esm.js`（ESM，`import`）
   - `*.d.ts`（类型声明）
   - `*.d.ts.map`（可选，声明文件 sourcemap）

2. **package.json 字段**：

   ```jsonc
   {
     "name": "@yourscope/yourlib",
     "version": "1.0.0",
     "type": "module", // ESM-first
     "main": "./dist/index.cjs", // CommonJS 入口（被 Node/老工具使用）
     "module": "./dist/index.js", // ESM 入口（老 Bundler 用）
     "exports": {
       // 现代 Node/Bundler 优先读这个
       ".": {
         "import": "./dist/index.js",
         "require": "./dist/index.cjs",
         "types": "./dist/index.d.ts",
       },
       "./feature": "./dist/feature.js", // 子路径导出
     },
     "types": "./dist/index.d.ts", // 兜底类型声明入口
     "files": ["dist"], // 只发布 dist（和 README/package.json）
     "sideEffects": ["*.css"], // Tree Shaking 声明
     "scripts": {
       "build": "rollup -c",
       "prepublishOnly": "npm run build", // 发布前自动构建
     },
     "peerDependencies": { "react": ">=17" },
   }
   ```

3. **发布**：`npm publish`（私有包加 `--access restricted`）。
4. **版本管理**：`semantic-release` / `standard-version` / `changesets`（Monorepo 推荐）。

---

## 十三、监控与错误上报

### Q35 你是怎么做前端错误监控和性能监控的？

**核心考察点**：是否有"产品上线后的责任感"。

**常见方案**：

- **Sentry**：最主流，错误堆栈、sourcemap 上传、版本追踪、Release 健康度。
- **自建**：`window.onerror` + `window.addEventListener('unhandledrejection')` + 手动上报 + `navigator.sendBeacon`。
- **性能监控**：PerformanceObserver、Web Vitals（`web-vitals` 库）。
- **用户行为回放**：Sentry Session Replay、LogRocket、FullStory。

**一个最简单的错误上报**：

```js
window.addEventListener("error", (e) => {
  navigator.sendBeacon(
    "/api/error",
    JSON.stringify({
      message: e.message,
      stack: e.error?.stack,
      url: location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    }),
  );
});
window.addEventListener("unhandledrejection", (e) => {
  navigator.sendBeacon(
    "/api/error",
    JSON.stringify({
      type: "unhandledrejection",
      reason: String(e.reason),
      url: location.href,
    }),
  );
});
```

**Sourcemap 上传到 Sentry**：`@sentry/vite-plugin` / `sentry-webpack-plugin` 在构建产物后自动上传 .map 文件，然后在 bundle 里移除 `//# sourceMappingURL=...` 引用（这样用户浏览器不会加载 sourcemap，只有 Sentry 能解析）。

---

## 十四、安全

### Q36 前端能做哪些安全措施？

**核心考察点**：是否对生产环境的安全有认知。

**常见问题与措施**：

**1. XSS（跨站脚本注入）**

- 永远不要把用户输入直接 `innerHTML` / `dangerouslySetInnerHTML`。
- 对用户输入做 HTML 转义（React/Vue 默认会做）。
- CSP（Content-Security-Policy）：限制 script 来源、禁止 eval。
  ```nginx
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'report-sample'; img-src 'self' data:; style-src 'self' 'unsafe-inline';";
  ```
- HttpOnly cookie：敏感 token 放 HttpOnly cookie，JS 读不到。

**2. CSRF（跨站请求伪造）**

- CSRF Token：每个请求带一个服务器下发的 token。
- `SameSite=Strict/Lax` cookie 属性。

**3. 点击劫持**

- `X-Frame-Options: DENY/SAMEORIGIN` 或 CSP `frame-ancestors`。

**4. 依赖安全**

- `npm audit` / `pnpm audit` / `auditjs`。
- Dependabot / Renovate 自动更新依赖。

**5. 代码混淆/反调试**（版权敏感的产品）：`terser` 的压缩配置、`obfuscator-io`。

---

## 十五、微前端

### Q37 微前端是什么？用过哪些方案？

**核心考察点**：是否理解"大项目拆分"的思路。

**核心思路**：把一个大型 Web 应用拆成多个可以**独立开发、独立部署、独立运行**的小应用，由一个壳（Shell / Host）在运行时组合起来。

**主流方案**：

| 方案                               | 特点                                             | 适用           |
| ---------------------------------- | ------------------------------------------------ | -------------- |
| **iframe**                         | 隔离最强，但通信难、URL 同步难、体验差           | 彻底隔离的场景 |
| **qiankun**（国内最流行）          | 基于 single-spa，HTML entry + JS 沙箱 + 样式隔离 | 国内中后台     |
| **Module Federation**（Webpack 5） | 原生支持，配置简单，需要都用 Webpack 5           | 新建项目       |
| **Micro App（京东）**              | 类 Web Components 的实现                         | 国内项目       |
| **Garfish**（字节）                | 插件化、支持多种加载方式                         | 大型项目       |

**关键技术点**：

- **路由劫持**：子应用的 pushState / popstate 需要被壳拦截。
- **JS 沙箱**：子应用对全局变量的修改不能污染其他应用（qiankun 的 proxySandbox / snapshotSandbox）。
- **样式隔离**：CSS Modules / Shadow DOM / 命名空间前缀 / CSS-in-JS。
- **通信**：CustomEvent、全局事件总线、props。
- **共享依赖**：externals + CDN，或 Module Federation 的 shared 配置。

---

## 十六、Server-Side 相关

### Q38 SSR / SSG / ISR / CSR 的区别？

**核心考察点**：是否理解现代渲染模式。

| 模式                              | 含义                                       | 首屏 HTML             | 每次请求是否重渲染       | 适用                         |
| --------------------------------- | ------------------------------------------ | --------------------- | ------------------------ | ---------------------------- |
| **CSR** (Client-side)             | 纯前端渲染                                 | 空壳 `<div id="app">` | 否（全在浏览器跑）       | 后台、内部系统               |
| **SSR** (Server-side)             | 每次请求在服务端渲染 HTML                  | 完整                  | **是**                   | 内容实时变化的内容站、电商   |
| **SSG** (Static Site)             | 构建时就把 HTML 生成好                     | 完整静态文件          | **否**（构建时一次生成） | 文档、博客、营销页           |
| **ISR** (Incremental)             | Next.js 的增量静态再生                     | 完整                  | **首次后有缓存**         | 大量页面、更新不频繁的内容站 |
| **RSC** (React Server Components) | 部分组件只在服务端渲染、零 JS 下发给浏览器 | 混合                  | 视组件而定               | Next.js 13+ App Router       |

**SSR 的核心价值**：

- **SEO**：搜索引擎能看到完整 HTML。
- **首屏性能（FCP/LCP）**：用户更早看到内容。
- **能力**：可以直接访问数据库、文件系统、内部 API。

**SSR 的代价**：

- 服务器成本。
- 更复杂的架构（同构渲染、Node 服务、缓存、容灾）。
- 某些浏览器 API 不能在服务端用，需要条件判断。

---

## 十七、实战场景题（面试官最爱问）

### Q39 假设你接手一个老项目，Webpack 构建要 5 分钟，首屏加载 10MB，你从哪里下手优化？

**核心考察点**：是否能把零散知识组织成"可执行方案"。

**推荐回答思路（优先级从高到低）**：

**第一步：量化现状（先不做任何修改）**

- `webpack-bundle-analyzer`：看 bundle 构成。
- `speed-measure-webpack-plugin`：看哪个 loader/plugin 最慢。
- `webpack --profile --json`：各阶段耗时。
- Lighthouse / Performance 面板：看首屏瓶颈是 JS 体积、执行时间还是请求数。

**第二步：构建速度**

- 升级到 Webpack 5，启用 `cache: { type: 'filesystem' }`。
- `include` / `exclude` 精准配置 babel-loader。
- 给 babel-loader 开 cacheDirectory。
- 压缩替换成 `esbuild-loader` 的 minify。
- 多进程：`thread-loader` + `parallel: true`。
- 开发环境关掉 sourcemap，用 `cheap-module-source-map`。

**第三步：产物体积**

- **Bundle Analyzer 找大模块**：整个 lodash → lodash-es + 按需；整个 antd → 按需；moment → dayjs。
- **`sideEffects` 配置**，开启 Tree Shaking。
- **SplitChunks + runtimeChunk: 'single'**，vendor 单独 chunk。
- **大库用 dynamic import**：echarts、xlsx 等。
- **图片**：压缩 + WebP + `srcset`，小图 inline data-URL。
- **CSS**：MiniCssExtractPlugin + CSS 压缩。
- **压缩**：Terser（Webpack 5 默认）+ gzip/brotli。
- **长期缓存**：`[name].[contenthash].js`。

**第四步：运行时**

- 路由级 Code Splitting。
- 关键资源 preload。
- 首屏不渲染的组件用虚拟列表 / 懒加载。
- CDN + 合理 HTTP 缓存。

**第五步：规范与流程**

- CI 上跑 bundle size budget（超过阈值不让合并）。
- eslint-plugin-import 限制某些大库的直接 import。
- `depcheck` 找未使用依赖。

---

### Q40 团队决定从 Webpack 迁移到 Vite，你会做哪些验证与风险评估？

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

---

## 十八、一些"刁钻"的深挖题（高级面试可能出现）

### Q41 Webpack 的 Module、Chunk、Bundle、Asset 四者是什么关系？

**回答要点**：

- **Module**：源码中的一个个文件（JS、TS、CSS、图片），经过 loader 处理后被 Webpack 识别。依赖图由 Module 组成。
- **Chunk**：构建过程中的"代码块"。一个 Chunk 由多个 Module 组成，Webpack 在 Code Splitting 阶段决定如何拆分 Chunk。
- **Bundle**：最终输出到磁盘的文件。一个 Chunk 通常产出一个 Bundle（但 sourcemap、manifest 不算 Bundle）。
- **Asset**：Webpack 5 的新概念，`type: 'asset/resource'` 等方式处理的非 JS 资源（图片、字体）。

**一句话**：**Module 被组织成 Chunk，Chunk 被渲染成 Bundle。**

---

### Q42 为什么 Webpack 5 不再自动 polyfill Node 模块？这对老项目有什么影响？

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

---

### Q43 Rollup 的 Treeshaking 和 Webpack 的 Treeshaking 实现上有什么差异？

**回答要点**：

- **Rollup**：原生就是围绕 ESM 设计的，对顶层未使用的 export 直接忽略；打包时把所有模块合并成一个 scope（scope-hoisting / 作用域提升），有利于进一步优化；对 sideEffects 的分析更激进。
- **Webpack**：历史包袱重（最初是为 CommonJS 设计的），ESM 分析是后来加上的；Webpack 保留了运行时模块系统（`__webpack_require__`），默认不做 scope hoisting（需要 `concatenateModules: true` 开启 ModuleConcatenationPlugin）；对 sideEffects 依赖更严格。
- **实际效果**：同等配置下，Rollup 的 bundle 通常比 Webpack 更小、更"干净"，这也是为什么**库打包偏爱 Rollup**。

---

### Q44 如果没有构建工具，你能手写一个简单的模块加载器吗？

**核心考察点**：对"模块系统到底做了什么"是否有底层理解。

**一个最简单的 CommonJS 风格的浏览器加载器**：

```js
// 思路：维护一个模块缓存，每个模块是 (module, exports, require) => {} 的函数
// （Webpack 早期的运行时就是这个思路）

const modules = {
  "./a.js": function (module, exports, require) {
    exports.foo = "hello from a";
  },
  "./b.js": function (module, exports, require) {
    const a = require("./a.js");
    exports.bar = a.foo + " world";
  },
  "./index.js": function (module, exports, require) {
    const b = require("./b.js");
    console.log(b.bar);
  },
};

const cache = {};
function require(id) {
  if (cache[id]) return cache[id].exports;
  const module = { exports: {} };
  cache[id] = module;
  modules[id](module, module.exports, require);
  return module.exports;
}

require("./index.js"); // 打印 "hello from a world"
```

**真实 Webpack 运行时**会处理：

- 异步 chunk（`__webpack_require__.e` + JSONP）。
- 模块 ID（数字或 hash，不是路径）。
- ESM/CJS 互操作（`__webpack_require__.n`）。
- HMR runtime。

---

### Q45 怎么设计一个"组件库的按需加载"方案？

**回答要点**（以一个 Vue/React UI 库为例）：

**方案 1：按目录导出 + Tree Shaking（现代推荐）**

```
dist/
├── index.js              // 全量入口
├── es/
│   ├── button/index.js   // Button 的 ESM
│   ├── input/index.js    // Input 的 ESM
│   └── style.css         // 整体样式（或每个组件单独 style.css）
├── lib/                  // CommonJS 版本
└── styles/
```

```jsonc
// package.json
{
  "main": "lib/index.js",
  "module": "es/index.js",
  "sideEffects": ["*.css"],
  "exports": {
    ".": {
      "import": "./es/index.js",
      "require": "./lib/index.js",
      "types": "./es/index.d.ts",
    },
    "./button": {
      "import": "./es/button/index.js",
      "require": "./lib/button/index.js",
    },
    "./style.css": "./styles/index.css",
  },
}
```

这样用户 `import Button from 'mylib/button'` 只会打包 Button 相关代码；用默认 `import { Button } from 'mylib'` 且 bundler 支持 Tree Shaking 也能摇掉未使用的组件。

**方案 2：babel-plugin-import（老方案，历史包袱）**

```js
// babel.config.js
plugins: [["import", { libraryName: "mylib", style: true }]];
```

会把 `import { Button } from 'mylib'` 自动转成 `import Button from 'mylib/lib/button'; import 'mylib/lib/button/style';`。

---

### Q46 HTTP/2 有什么变化？对前端构建策略有什么影响？

**回答要点**：

HTTP/2 相比 HTTP/1.1：

- **多路复用**：一个 TCP 连接可以并发多个请求，没有 HOL blocking。
- **头部压缩**：HPACK 算法压缩 HTTP 头。
- **服务端推送**（实际应用有限，HTTP/3 有新方案）。
- **二进制协议**：解析更快。

**对前端构建的影响**：

- **以前流行的"合并成一个大包"不再是绝对真理**。以前合并是为了减少请求数；HTTP/2 下小文件请求更便宜，适度拆分反而可以利用并行 + 缓存（改一个文件不会让所有缓存失效）。
- **但是**：过小的文件也有开销（每个文件的头部、解析、运行时）。合理的 chunk 拆分（每个 50~200KB）还是最佳实践。
- **雪碧图、资源内联**等 HTTP/1 时代的"合并式优化"必要性下降，但仍然看具体项目。

---

### Q47 什么是 Module Federation？适用场景？

**回答要点**：

Module Federation 是 Webpack 5 内置的能力，允许多个**独立构建的应用**在运行时互相暴露/消费模块。

**典型场景**：微前端宿主应用消费子应用的组件；团队 A 负责搜索组件，团队 B 负责商品列表组件，两个团队独立发布，但在同一个页面里组合使用。

**关键概念**：

- **Host / Remote**：消费方是 Host，提供模块的一方是 Remote。
- **`exposes`**：一个应用声明自己要分享的模块。
- **`remotes`**：一个应用声明它要使用的远程模块。
- **`shared`**：共享依赖（React、Vue、lodash 等），避免多个应用各带一份。

**配置示例**（Remote）：

```js
// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "searchApp",
      filename: "remoteEntry.js", // 其他应用要加载这个文件
      exposes: { "./SearchBar": "./src/SearchBar" },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
```

**Host**：

```js
plugins: [
  new ModuleFederationPlugin({
    name: 'shell',
    remotes: { searchApp: 'searchApp@http://localhost:3001/remoteEntry.js' },
    shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
  }),
],
```

```jsx
// host 应用内消费
const SearchBar = React.lazy(() => import("searchApp/SearchBar"));
```

**注意**：Shared 依赖需要版本兼容；多个应用的 React 必须是同一份（singleton: true）否则会出错。

---

## 十九、学习与选型建议（最后一问）

### Q48 面对这么多前端工具，你是怎么学习和选型的？

**回答要点**（讲你自己的故事，面试官想听的是"方法论"）：

1. **先理解核心概念，再学工具配置**：先知道什么是 Tree Shaking、为什么要 Code Splitting、HTTP 缓存怎么工作，然后再去读 webpack/vite 的 options 列表。
2. **一个阶段只打穿一个工具**：不要同时学 5 个 Bundler。把 Webpack 用到能自己写 loader/plugin、能解决真实项目问题，再去看 Vite/Rollup。
3. **读官方文档 + 源码例子**：Webpack 官方 guides、Vite guide、Rollup 的官方 tutorial 是最好的资源。
4. **做 side project**：自己搭一个脚手架、做一个 UI 组件库，逼自己去思考"发布"、"Tree Shaking"、"类型声明"等真实问题。
5. **选型原则**：
   - **新项目**：用现代默认（Vite + TypeScript + pnpm）。
   - **老项目**：先通过分析工具量化问题，再决定是升级（webpack 4 → 5）还是迁移（webpack → vite）。
   - **库**：Rollup + TypeScript + Changesets。
   - **大型应用**：Next.js / Nuxt 可以帮你省去很多配置（SSR、路由、Image、Font、Edge Runtime 都内置了）。
6. **关注社区趋势但不盲从**：每个新工具都问自己"它解决了我当前项目的什么痛点"，而不是盲目追新。

---

## 附：面试时可以主动说的"加分项"

如果你在真实项目里做过以下任何一件事，可以在面试官问"你做过哪些工程化优化"时主动讲：

- **搭建过团队脚手架**（发布 npm、有模板、可升级）。
- **把项目从 Webpack 4 升级到 5**，并用 `cache.filesystem` 把 CI 时间从 X 降到 Y。
- **引入 pnpm**，解决幽灵依赖，CI 时间节省多少。
- **用 Bundle Analyzer 发现并移除了某个大库**（如把 moment 换 dayjs，体积减 X KB）。
- **设计过 Monorepo**（用 pnpm workspaces + Turborepo，讲清楚包划分策略、构建顺序）。
- **写过 ESLint 自定义规则**，用于团队规范（禁止直接用某个 API、强制某个写法）。
- **在 CI 上做 bundle budget**：PR 导致产物超过阈值就自动 comment/reject。
- **写过 Webpack / Vite 插件**并在团队里使用。
- **设计过 SSR / SSG 的方案**，并上线。
- **设计过错误监控 + Sourcemap 上传的闭环流程**。

> 讲的时候一定用"问题 → 方案 → 效果/数据"三段式："我们项目之前 XXX，我用了 YYY，结果 ZZZ（具体数字）。"
