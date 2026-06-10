---
title: Rollup
---

# Rollup 学习笔记

> Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。Rollup 对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，而不是以前的特殊解决方案，如 CommonJS 和 AMD。

---

## 一、Rollup 概述

### 1.1 什么是 Rollup

Rollup 是一个专注于打包 JavaScript 库的模块打包器。它由 Rich Harris 开发，他也是 Svelte 的作者。

**Rollup 的核心特点**：

```
┌──────────────────────────────────────────────────┐
│  🌳 Tree Shaking（摇树优化）                      │
│     - 移除未使用的代码                             │
│     - 基于 ES Module 静态分析                       │
│                                                     │
│  📦 多种输出格式                                    │
│     - ES Module（import/export）                    │
│     - CommonJS（require/module.exports）            │
│     - UMD（浏览器 + Node.js）                       │
│     - IIFE（立即执行函数）                           │
│                                                     │
│  🎯 专注库打包                                      │
│     - 适合打包组件库、工具库                         │
│     - 生成更小的 bundle                             │
│     - 更简单的配置                                   │
└──────────────────────────────────────────────────┘
```

### 1.2 为什么选择 Rollup

| 特性 | 说明 |
|------|------|
| **Tree Shaking** | 强大的代码消除能力，基于 ES Module |
| **配置简单** | 相比 Webpack，配置更简洁易懂 |
| **输出格式丰富** | 支持多种模块格式 |
| **产物纯净** | 生成的代码更干净，运行时开销小 |
| **生态完整** | 丰富的插件系统 |

### 1.3 Rollup vs Webpack vs Vite

| 工具 | 适用场景 | 优势 | 劣势 |
|------|---------|------|------|
| **Rollup** | 库/组件打包 | Tree Shaking 强，配置简单，输出格式多 | HMR 功能较弱，应用打包不如 Webpack |
| **Webpack** | 应用打包 | 生态丰富，功能全面，适合复杂应用 | 配置复杂，构建速度慢 |
| **Vite** | 现代应用开发 | 极速启动，HMR 快，开箱即用 | 生产构建依赖 Rollup |

**简单决策**：

```
开发类库/组件库  →  Rollup
开发 Web 应用    →  Vite（现代）或 Webpack（复杂）
需要旧浏览器支持  →  Webpack
```

---

## 二、快速开始

### 2.1 安装与使用

```bash
# 全局安装
npm install --global rollup

# 或本地安装
npm install rollup --save-dev
```

**命令行使用**：

```bash
# 开发 ES Module 输出
rollup src/main.js --file bundle.js --format es

# 开发 CommonJS 输出
rollup src/main.js --file bundle.js --format cjs

# 开发浏览器自执行函数（IIFE）
rollup src/main.js --file bundle.js --format iife --name 'myBundle'

# UMD 格式（同时支持浏览器和 Node.js）
rollup src/main.js --file bundle.js --format umd --name 'myBundle'
```

### 2.2 使用配置文件

创建 `rollup.config.js`：

```javascript
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
};
```

使用配置文件运行：

```bash
rollup --config
# 或
rollup -c

# 指定配置文件
rollup --config rollup.config.dev.js
```

### 2.3 npm 脚本

```json
{
  "scripts": {
    "build": "rollup -c",
    "watch": "rollup -c -w"
  }
}
```

```bash
npm run build   # 构建
npm run watch   # 监听模式
```

---

## 三、核心配置详解

### 3.1 Input（输入配置）

```javascript
export default {
  // 单入口
  input: 'src/main.js',

  // 多入口（数组形式）
  input: ['src/main.js', 'src/second.js'],

  // 多入口（对象形式，可自定义名称）
  input: {
    main: 'src/main.js',
    second: 'src/second.js',
  },
};
```

### 3.2 Output（输出配置）

**单输出配置**：

```javascript
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',      // 输出文件路径
    format: 'es',                 // 输出格式
    name: 'MyLibrary',            // UMD/IIFE 格式的全局变量名
    sourcemap: true,              // 是否生成 source map
    exports: 'named',             // 导出模式
  },
};
```

**多输出配置（多种格式）**：

```javascript
export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/my-library.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/my-library.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/my-library.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      sourcemap: true,
    },
  ],
};
```

**输出格式（format）详解**：

| 格式 | 说明 | 使用场景 |
|------|------|---------|
| `es` / `esm` | ES Module | 现代浏览器、打包工具 |
| `cjs` | CommonJS | Node.js |
| `umd` | Universal Module Definition | 浏览器 + Node.js（通用） |
| `iife` | Immediately Invoked Function Expression | 浏览器 `<script>` 标签 |
| `amd` | Asynchronous Module Definition | RequireJS 等 |
| `system` | SystemJS loader format | SystemJS 加载器 |

**配置示例**：

```javascript
// 完整 output 配置示例
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MyLibrary',
    sourcemap: true,
    sourcemapFile: 'dist/bundle.js.map',
    banner: '/* My Library v1.0.0 */',
    footer: '/* Follow us on GitHub */',
    intro: 'var ENV = "production";',
    outro: 'console.log("Loaded!");',
    globals: {
      lodash: '_',  // 指定外部依赖的全局变量名
      jquery: '$',
    },
  },
};
```

### 3.3 External（外部依赖）

指定哪些模块视为外部依赖，不打包进 bundle：

```javascript
export default {
  input: 'src/main.js',
  output: { file: 'bundle.js', format: 'cjs' },

  // 字符串数组形式
  external: ['lodash', 'react'],

  // 函数形式（更灵活）
  external: (id) => {
    // 将所有 node_modules 中的模块视为外部依赖
    return !id.startsWith('.') && !id.startsWith('/');
  },
};
```

### 3.4 Plugins（插件）

Rollup 的插件系统非常强大，用于扩展功能。

**常用插件**：

| 插件 | 说明 |
|------|------|
| `@rollup/plugin-json` | 导入 JSON 文件 |
| `@rollup/plugin-node-resolve` | 解析 node_modules 中的模块 |
| `@rollup/plugin-commonjs` | 将 CommonJS 模块转换为 ES Module |
| `@rollup/plugin-babel` | 使用 Babel 转译代码 |
| `@rollup/plugin-typescript` | 处理 TypeScript |
| `@rollup/plugin-terser` | 压缩代码 |
| `@rollup/plugin-replace` | 替换代码中的字符串 |
| `rollup-plugin-css-only` | 处理 CSS |
| `rollup-plugin-vue` | 处理 Vue 单文件组件 |

**插件使用示例**：

```bash
npm install @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs --save-dev
```

```javascript
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: { file: 'bundle.js', format: 'cjs' },
  plugins: [json(), resolve(), commonjs()],
};
```

**Babel 插件**：

```bash
npm install @rollup/plugin-babel @babel/core @babel/preset-env --save-dev
```

```javascript
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/main.js',
  output: { file: 'bundle.js', format: 'cjs' },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', { targets: 'defaults' }]],
      exclude: 'node_modules/**',
    }),
  ],
};
```

**TypeScript 插件**：

```bash
npm install @rollup/plugin-typescript typescript --save-dev
```

```javascript
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: { dir: 'dist', format: 'cjs' },
  plugins: [typescript()],
};
```

**压缩代码**：

```bash
npm install @rollup/plugin-terser --save-dev
```

```javascript
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: { file: 'bundle.min.js', format: 'iife' },
  plugins: [terser()],
};
```

### 3.5 Watch（监听模式）

```javascript
export default {
  input: 'src/main.js',
  output: { file: 'dist/bundle.js', format: 'cjs' },
  watch: {
    include: 'src/**',       // 监听的文件
    exclude: 'node_modules/**', // 排除的文件
    clearScreen: true,       // 重新构建时清屏
  },
};
```

---

## 四、Tree Shaking 详解

### 4.1 Tree Shaking 原理

Tree Shaking（摇树优化）是 Rollup 的核心特性，基于 ES Module 的静态结构分析，移除未使用的代码。

**示例**：

```javascript
// src/math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}
```

```javascript
// src/main.js
import { add } from './math.js';

console.log(add(1, 2));
```

**打包结果**：

```javascript
// bundle.js - subtract 和 multiply 被移除！
function add(a, b) {
  return a + b;
}

console.log(add(1, 2));
```

### 4.2 Tree Shaking 的条件

```
✅ 使用 ES Module（import/export）
❌ 不使用 CommonJS（require/module.exports）
✅ 避免副作用代码
✅ 使用纯函数
```

**标记副作用**：

```json
// package.json
{
  "sideEffects": false,  // 没有副作用
  // 或
  "sideEffects": ["*.css", "*.scss"]  // 某些文件有副作用
}
```

---

## 五、完整配置示例

### 5.1 打包 JavaScript 库

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/my-library.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/my-library.esm.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/my-library.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', { targets: 'defaults' }]],
      exclude: 'node_modules/**',
    }),
    isProduction && terser(),
  ].filter(Boolean),
};
```

### 5.2 打包 TypeScript 库

```typescript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const isProduction = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      isProduction && terser(),
    ].filter(Boolean),
  },
  {
    // 打包类型声明文件
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [dts()],
  },
];
```

### 5.3 package.json 配置

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "My awesome library",
  "type": "module",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "build:prod": "NODE_ENV=production rollup -c",
    "watch": "rollup -c -w"
  },
  "devDependencies": {
    "rollup": "^4.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-terser": "^0.4.0",
    "rollup-plugin-dts": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 六、总结

Rollup 是打包 JavaScript 库的理想选择：

- **Tree Shaking**：强大的代码消除能力
- **配置简单**：相比 Webpack 更简洁
- **输出灵活**：支持多种模块格式
- **专注库打包**：生成的代码更纯净

**学习建议**：
1. 从简单的库打包开始
2. 理解 ES Module 和 Tree Shaking 原理
3. 掌握常用插件的使用
4. 学习配置多格式输出
5. 实践一个真实的库项目

---

> **参考资源**：
> - Rollup 官方文档：https://rollupjs.org/
> - Rollup 中文文档：https://cn.rollupjs.org/
> - Rollup GitHub：https://github.com/rollup/rollup
