---
title: Webpack
---

# Webpack 学习笔记

> Webpack 是一个现代 JavaScript 应用程序的模块打包器。当 Webpack 处理应用程序时，它会递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

---

## 一、Webpack 概述

### 1.1 什么是 Webpack

Webpack 是一个静态模块打包器。当 Webpack 处理应用程序时，它会在内部构建一个依赖图，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle。

**核心功能**：

```
源代码 → Webpack → 打包产物
├── JavaScript
├── CSS            ├── bundle.js
├── Images   →    ├── styles.css
├── Fonts          ├── sprite.svg
└── etc.           └── etc.
```

### 1.2 为什么选择 Webpack

| 特性 | 说明 |
|------|------|
| **代码分割** | 支持按路由分割代码，按需加载 |
| **Loader** | 处理非 JavaScript 文件（CSS、图片、字体等） |
| **Plugin** | 扩展功能，优化、压缩、注入环境变量等 |
| **模块热替换** | HMR，开发时无需刷新即可更新 |
| **Tree Shaking** | 移除未使用的代码 |
| **Source Maps** | 方便调试压缩后的代码 |
| **生态丰富** | 庞大的 Loader 和 Plugin 生态 |

### 1.3 Webpack 核心概念

```
Webpack 五大核心概念：
├── Entry（入口）
│   └── 指示 Webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
│
├── Output（输出）
│   └── 告诉 Webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件
│
├── Loader（转换器）
│   └── 让 Webpack 能够去处理那些非 JavaScript 文件
│
├── Plugin（插件）
│   └── 用于执行范围更广的任务，从打包优化和压缩，一直到重新定义环境中的变量
│
└── Mode（模式）
    └── 通过选择 development, production 或 none 之中的一个，来启用相应模式下的 Webpack 内置优化
```

---

## 二、快速开始

### 2.1 基础项目搭建

**1. 创建项目目录**

```bash
mkdir webpack-demo
cd webpack-demo
npm init -y
```

**2. 安装 Webpack**

```bash
# 安装核心依赖
npm install webpack webpack-cli --save-dev

# 或使用 pnpm
pnpm add -D webpack webpack-cli
```

**3. 创建项目结构**

```
webpack-demo/
├── src/
│   ├── index.js      # 入口文件
│   └── style.css     # 样式文件
├── dist/             # 输出目录（自动生成）
└── package.json
```

**4. 创建示例代码**

```javascript
// src/index.js
import _ from 'lodash';
import './style.css';

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'Webpack'], ' ');
  element.classList.add('hello');
  return element;
}

document.body.appendChild(component());
```

```css
/* src/style.css */
.hello {
  color: #42b983;
  font-size: 24px;
  font-weight: bold;
}
```

**5. 创建 Webpack 配置文件**

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

**6. 安装 Loader 处理 CSS**

```bash
npm install style-loader css-loader --save-dev
```

```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

**7. 添加 npm 脚本**

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development"
  }
}
```

**8. 运行构建**

```bash
npm run build
# 或
npm run dev
```

### 2.2 使用开发服务器

```bash
npm install webpack-dev-server --save-dev
```

```javascript
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    static: './dist',
    hot: true,
    port: 8080,
    open: true,
  },
  devtool: 'inline-source-map',
};
```

```json
{
  "scripts": {
    "start": "webpack serve --open --mode development"
  }
}
```

---

## 三、核心概念详解

### 3.1 Entry（入口）

Entry 定义了 Webpack 从哪个文件开始构建依赖图。

**单入口**：

```javascript
module.exports = {
  entry: './src/index.js',
};

// 或对象形式
module.exports = {
  entry: {
    main: './src/index.js',
  },
};
```

**多入口**：

```javascript
module.exports = {
  entry: {
    main: './src/main.js',
    admin: './src/admin.js',
    app: './src/app.js',
  },
};
```

**数组形式**（合并多个文件）：

```javascript
module.exports = {
  entry: ['./src/polyfill.js', './src/index.js'],
};
```

### 3.2 Output（输出）

Output 告诉 Webpack 如何输出编译后的文件。

**基础配置**：

```javascript
const path = require('path');

module.exports = {
  output: {
    // 输出目录（绝对路径）
    path: path.resolve(__dirname, 'dist'),

    // 文件名
    filename: 'bundle.js',

    // 资源文件（非入口文件）的文件名
    chunkFilename: '[name].[contenthash].js',

    // 公共路径（用于 CDN 部署）
    publicPath: '/',

    // 清理输出目录
    clean: true,
  },
};
```

**文件名占位符**：

| 占位符 | 说明 |
|--------|------|
| `[name]` | 模块名称 |
| `[id]` | 模块标识符 |
| `[hash]` | 模块哈希值 |
| `[contenthash]` | 文件内容哈希值（常用于缓存优化） |
| `[chunkhash]` | chunk 哈希值 |
| `[ext]` | 文件扩展名 |

**多入口输出**：

```javascript
module.exports = {
  entry: {
    main: './src/main.js',
    admin: './src/admin.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```

### 3.3 Loader（转换器）

Loader 让 Webpack 能够处理非 JavaScript 文件。

**Loader 执行顺序**：从右到左（或从下到上）

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 匹配文件
        test: /\.css$/,
        // 使用的 Loader，顺序从右到左
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
```

**CSS 相关 Loader**：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',       // 将 JS 字符串生成为 style 节点
          'css-loader',         // 将 CSS 转化成 CommonJS 模块
          'postcss-loader',     // PostCSS 处理（自动添加浏览器前缀等）
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',        // 将 Sass 编译成 CSS
        ],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

**图片和资源处理**：

```javascript
module.exports = {
  module: {
    rules: [
      // Webpack 5 内置的 Asset Modules
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      // 小文件转为 base64 内联
      {
        test: /\.(png|jpg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 小于 8KB 转为 base64
          },
        },
      },
    ],
  },
};
```

**Babel 处理 JavaScript**：

```bash
npm install babel-loader @babel/core @babel/preset-env --save-dev
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
            cacheDirectory: true, // 缓存提升性能
          },
        },
      },
    ],
  },
};
```

**TypeScript 处理**：

```bash
npm install ts-loader typescript --save-dev
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
```

### 3.4 Plugin（插件）

Plugin 用于执行更广泛的任务，如打包优化、资源管理、注入环境变量等。

**HtmlWebpackPlugin**：自动生成 HTML 文件

```bash
npm install html-webpack-plugin --save-dev
```

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: '我的应用',
      template: 'src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
};
```

**MiniCssExtractPlugin**：提取 CSS 为单独文件

```bash
npm install mini-css-extract-plugin --save-dev
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
};
```

**DefinePlugin**：定义全局常量

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'API_URL': JSON.stringify('https://api.example.com'),
    }),
  ],
};
```

**CopyWebpackPlugin**：复制文件

```bash
npm install copy-webpack-plugin --save-dev
```

```javascript
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' },
        { from: 'src/assets', to: 'assets' },
      ],
    }),
  ],
};
```

**BundleAnalyzerPlugin**：分析包大小

```bash
npm install webpack-bundle-analyzer --save-dev
```

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

### 3.5 Mode（模式）

Mode 提供三种模式，启用不同的优化策略。

```javascript
module.exports = {
  mode: 'development', // 'development' | 'production' | 'none'
};
```

**三种模式对比**：

| 特性 | development | production | none |
|------|-------------|------------|------|
| 代码压缩 | ❌ | ✅ | ❌ |
| Tree Shaking | ❌ | ✅ | ❌ |
| Source Map | 完整 | 轻量 | 无 |
| 环境变量 | development | production | - |
| 构建速度 | 快 | 慢 | 快 |

**根据环境动态配置**：

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    // ...
  };
};
```

---

## 四、开发环境配置

### 4.1 webpack-dev-server

```javascript
module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,           // 启用 gzip 压缩
    port: 8080,               // 端口号
    hot: true,                // 启用 HMR
    open: true,               // 自动打开浏览器
    historyApiFallback: true, // SPA 路由 fallback
    client: {
      overlay: true,          // 浏览器显示错误遮罩
      progress: true,         // 显示编译进度
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
};
```

### 4.2 Source Map 配置

| devtool | 构建速度 | 生产环境 | 说明 |
|---------|----------|----------|------|
| `eval` | 最快 | ❌ | 每个模块使用 eval 执行 |
| `eval-cheap-source-map` | 快 | ❌ | 转换代码，无列信息 |
| `eval-cheap-module-source-map` | 中等 | ❌ | 原始源码，无列信息 |
| `source-map` | 慢 | ✅ | 完整的 Source Map |
| `hidden-source-map` | 慢 | ✅ | 有 Source Map 但不引用 |
| `nosources-source-map` | 慢 | ✅ | 不包含源码内容 |

### 4.3 模块解析配置

```javascript
module.exports = {
  resolve: {
    // 自动解析的扩展名
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],

    // 模块别名，简化导入路径
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },

    // 解析目录
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};
```

使用别名后：

```javascript
// 之前
import Button from '../../components/Button';

// 之后
import Button from '@components/Button';
```

---

## 五、生产环境优化

### 5.1 代码分割（Code Splitting）

**自动分割公共代码**：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 'all' | 'async' | 'initial'
      cacheGroups: {
        // 提取第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        // 提取公共代码
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single', // 提取 runtime 代码
  },
};
```

**动态导入（懒加载）**：

```javascript
// src/index.js
button.addEventListener('click', async () => {
  const { default: printMe } = await import(/* webpackChunkName: "print" */ './print.js');
  printMe();
});
```

### 5.2 缓存优化

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  optimization: {
    // 稳定的 module id
    moduleIds: 'deterministic',
    // 稳定的 chunk id
    chunkIds: 'deterministic',
    // 提取 runtime 代码
    runtimeChunk: 'single',
  },
};
```

### 5.3 CSS 优化

```bash
npm install css-minimizer-webpack-plugin --save-dev
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      `...`, // 保留默认的 JS 压缩
      new CssMinimizerPlugin(),
    ],
  },
};
```

### 5.4 压缩优化

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多进程并行压缩
        terserOptions: {
          compress: {
            drop_console: true, // 删除 console.log
            drop_debugger: true, // 删除 debugger
          },
        },
      }),
    ],
  },
};
```

**Gzip/Brotli 压缩**：

```bash
npm install compression-webpack-plugin --save-dev
```

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    // Brotli 压缩（需要 Node.js 11.7+）
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
};
```

### 5.5 Tree Shaking

Tree Shaking 用于移除未使用的代码，需要使用 ES Modules。

```javascript
// package.json
{
  "sideEffects": false, // 表示所有文件都没有副作用
  // 或指定有副作用的文件
  "sideEffects": ["*.css", "*.scss"]
}
```

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
  },
};
```

---

## 六、完整配置示例

### 6.1 基础配置（webpack.common.js）

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

### 6.2 开发环境配置（webpack.dev.js）

```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: './dist',
    hot: true,
    port: 8080,
    open: true,
  },
  optimization: {
    runtimeChunk: 'single',
  },
});
```

### 6.3 生产环境配置（webpack.prod.js）

```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
```

### 6.4 package.json 脚本

```json
{
  "scripts": {
    "start": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "build:analyze": "webpack --config webpack.prod.js --analyze"
  }
}
```

---

## 七、实战技巧

### 7.1 环境变量管理

```bash
npm install dotenv-webpack --save-dev
```

```javascript
// .env
API_URL=https://api.example.com
DEBUG=true
```

```javascript
// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [new Dotenv()],
};
```

### 7.2 构建进度显示

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.ProgressPlugin()],
};
```

### 7.3 性能提示

```javascript
module.exports = {
  performance: {
    hints: 'warning',
    maxEntrypointSize: 244000, // 244KB
    maxAssetSize: 244000,
    assetFilter(assetFilename) {
      // 只提示 JS 和 CSS 文件
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    },
  },
};
```

---

## 八、总结

Webpack 是一个功能强大的模块打包器，掌握它需要理解：

- **五大核心概念**：Entry、Output、Loader、Plugin、Mode
- **开发环境配置**：dev-server、Source Map、HMR
- **生产环境优化**：代码分割、压缩、缓存、Tree Shaking
- **插件生态**：利用社区插件简化配置

**学习建议**：
1. 从基础配置开始，逐步添加功能
2. 理解每个配置项的作用
3. 关注 Webpack 5 的新特性
4. 学习分析构建产物，进行性能优化

---

> **参考资源**：
> - Webpack 官方文档：https://webpack.js.org/
> - Webpack 中文文档：https://webpack.docschina.org/
