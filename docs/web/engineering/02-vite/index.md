---
title: Vite
---

# Vite 学习笔记

> Vite（法语意为"快速的"，发音 /vit/）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：一个开发服务器，和一套构建命令。

---

## 一、Vite 概述

### 1.1 什么是 Vite

Vite 是下一代前端构建工具，由 Vue.js 作者尤雨溪创建。它基于浏览器原生 ES 模块，提供极速的开发体验。

**Vite 的核心优势**：

```
┌──────────────────────────────────────────────────┐
│  🚀 极速的冷启动速度                             │
│  ⚡ 即时的热模块替换（HMR）                        │
│  📦 基于原生 ESM，无需打包即可开发                   │
│  🎯 开箱即用，支持 Vue、React、Svelte 等框架         │
│  🔧 强大的插件系统，基于 Rollup                     │
│  ✨ 预优化依赖，提升性能                            │
└──────────────────────────────────────────────────┘
```

### 1.2 Vite vs Webpack

| 特性 | Vite | Webpack |
|------|------|---------|
| **开发启动速度** | 毫秒级 | 秒级（随项目增大变慢） |
| **HMR 速度** | 即时，与模块数量无关 | 随模块数量增加变慢 |
| **开发模式** | 基于原生 ESM，按需编译 | 先打包所有模块，再启动服务器 |
| **生产构建** | 使用 Rollup | 使用自身构建器 |
| **配置复杂度** | 简单，开箱即用 | 复杂，需要大量配置 |
| **生态** | 快速增长 | 成熟庞大 |

### 1.3 Vite 工作原理

**传统打包工具（如 Webpack）**：

```
┌──────────────┐
│   源代码     │
│  A ─ B ─ C  │
└──────┬───────┘
       │ 打包
       ▼
┌──────────────┐
│  Bundle.js   │  ← 构建完成后才启动
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   浏览器     │
└──────────────┘

问题：项目越大，打包越慢
```

**Vite 开发模式**：

```
┌──────────────┐
│   源代码     │
│  A ─ B ─ C  │
└──────┬───────┘
       │ 按需编译（请求时才编译）
       ▼
┌──────────────┐
│ ESM 原生模块 │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   浏览器     │  ← 直接通过 <script type="module"> 加载
└──────────────┘

优势：启动速度与项目大小无关
```

**Vite 依赖预构建**：

```
npm 包（CommonJS/UMD）
       │
       ▼
Vite 使用 esbuild 预构建
       │
       ▼
转换为 ESM 格式并缓存
       │
       ▼
浏览器直接加载（304 缓存）
```

---

## 二、快速开始

### 2.1 创建项目

**使用 npm**：

```bash
# 创建项目
npm create vite@latest

# 或指定模板
npm create vite@latest my-vue-app -- --template vue
npm create vite@latest my-react-app -- --template react
npm create vite@latest my-vanilla-app -- --template vanilla
```

**使用 pnpm**：

```bash
pnpm create vite
# 或
pnpm create vite my-app --template vue
```

**使用 yarn**：

```bash
yarn create vite
```

**可用模板**：

| 模板 | 说明 |
|------|------|
| `vanilla` | 纯 JavaScript |
| `vanilla-ts` | 纯 TypeScript |
| `vue` | Vue 3 |
| `vue-ts` | Vue 3 + TypeScript |
| `react` | React |
| `react-ts` | React + TypeScript |
| `react-swc` | React + SWC |
| `react-swc-ts` | React + SWC + TypeScript |
| `preact` | Preact |
| `preact-ts` | Preact + TypeScript |
| `lit` | Lit |
| `lit-ts` | Lit + TypeScript |
| `svelte` | Svelte |
| `svelte-ts` | Svelte + TypeScript |

### 2.2 项目结构

```
my-vite-app/
├── index.html              # 入口 HTML 文件（重要！）
├── package.json
├── vite.config.js         # Vite 配置文件
├── .gitignore
├── src/
│   ├── main.js            # 入口 JS
│   ├── App.vue            # 根组件（Vue 示例）
│   └── style.css
└── public/                # 静态资源目录（原样复制）
    └── favicon.ico
```

**index.html 是项目入口**：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- 注意：这里直接引用 ES 模块 -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 2.3 常用命令

```json
{
  "scripts": {
    "dev": "vite",           # 启动开发服务器
    "build": "vite build",   # 生产构建
    "preview": "vite preview" # 预览生产构建
  }
}
```

```bash
# 启动开发服务器（默认端口 5173）
npm run dev

# 构建生产版本（输出到 dist 目录）
npm run build

# 预览构建结果（默认端口 4173）
npm run preview
```

---

## 三、Vite 配置详解

### 3.1 基础配置文件

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  // 插件配置
  plugins: [vue()],

  // 项目根目录
  root: process.cwd(),

  // 开发或生产环境服务的公共基础路径
  base: '/',

  // 开发服务器配置
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    cors: true,
  },

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },

  // 依赖优化
  optimizeDeps: {
    include: ['lodash-es', 'axios'],
  },

  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

### 3.2 TypeScript 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

### 3.3 开发服务器配置

```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0',        // 监听所有地址，允许局域网访问
    port: 5173,              // 端口号
    strictPort: false,       // 端口被占用时是否直接退出
    https: false,            // 是否启用 TLS/SSL
    open: true,              // 自动打开浏览器
    cors: true,              // 允许跨域
    headers: {},             // 响应头

    // 代理配置
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/foo': 'http://localhost:4567',
    },

    // HMR 配置
    hmr: {
      overlay: true,          // 显示错误遮罩
    },
  },
});
```

### 3.4 构建配置

```javascript
export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist',

    // 静态资源目录
    assetsDir: 'assets',

    // 是否生成 source map
    sourcemap: false,

    // 压缩方式
    // 'esbuild' | 'terser' | false
    minify: 'esbuild',

    // CSS 代码分割
    cssCodeSplit: true,

    // chunk 大小警告限制（单位 kB）
    chunkSizeWarningLimit: 500,

    // Rollup 配置
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          utils: ['lodash-es', 'date-fns'],
        },
      },
    },

    // 是否清空 outDir
    emptyOutDir: true,
  },
});
```

### 3.5 预览配置

```javascript
export default defineConfig({
  preview: {
    port: 4173,
    strictPort: false,
    host: '0.0.0.0',
    open: true,
    cors: true,
  },
});
```

### 3.6 路径别名配置

```javascript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
```

如果使用 TypeScript，还需要在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

---

## 四、插件系统

### 4.1 官方插件

| 插件 | 说明 |
|------|------|
| `@vitejs/plugin-vue` | Vue 3 单文件组件支持 |
| `@vitejs/plugin-vue-jsx` | Vue 3 JSX 支持 |
| `@vitejs/plugin-react` | React 支持 |
| `@vitejs/plugin-react-swc` | React 支持（使用 SWC） |
| `@vitejs/plugin-preact` | Preact 支持 |
| `@vitejs/plugin-legacy` | 旧浏览器支持 |
| `@vitejs/plugin-basic-ssl` | 基础 SSL 支持 |

**Vue 项目示例**：

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
```

**React 项目示例**：

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### 4.2 社区插件

| 插件 | 说明 |
|------|------|
| `vite-plugin-windicss` | Windi CSS 支持 |
| `unocss/vite` | UnoCSS 支持 |
| `vite-plugin-compression` | 压缩构建产物 |
| `vite-plugin-pwa` | PWA 支持 |
| `vite-plugin-checker` | 类型检查 |
| `rollup-plugin-visualizer` | 可视化分析构建产物 |

### 4.3 插件开发基础

```javascript
// my-plugin.js
export default function myPlugin() {
  return {
    // 插件名称
    name: 'my-plugin',

    // 构建开始时调用
    buildStart(options) {
      console.log('构建开始');
    },

    // 转换模块代码
    transform(code, id) {
      if (id.endsWith('.js')) {
        return {
          code: code.replace('foo', 'bar'),
          map: null,
        };
      }
    },

    // 构建完成时调用
    buildEnd(error) {
      console.log('构建结束');
    },

    // Vite 开发服务器钩子
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义中间件
        next();
      });
    },
  };
}
```

---

## 五、功能特性详解

### 5.1 静态资源处理

**导入资源**：

```javascript
// 导入 URL
import logoUrl from './logo.png';
console.log(logoUrl); // /assets/logo.123456.png

// 显式导入为 URL
import logoUrl from './logo.png?url';

// 导入为 base64 字符串
import logoBase64 from './logo.png?raw';

// 导入为 Worker
import Worker from './worker.js?worker';
const worker = new Worker();

// 导入为原始字符串
import shaderString from './shader.glsl?raw';
```

**URL 导入**：

```javascript
// 动态导入
const imgUrl = new URL('./img.png', import.meta.url).href;
document.getElementById('hero-img').src = imgUrl;
```

**public 目录**：

```
public/
├── favicon.ico
└── robots.txt

# 可通过 /favicon.ico 直接访问
```

### 5.2 CSS 功能

**CSS 导入**：

```javascript
// 直接导入 CSS
import './style.css';

// 导入为字符串
import cssString from './style.css?raw';

// 导入为 CSS Modules
import classes from './style.module.css';
```

**CSS Modules**：

```css
/* style.module.css */
.hello {
  color: red;
}
```

```javascript
import styles from './style.module.css';
element.innerHTML = `<div class="${styles.hello}">Hello</div>`;
```

**CSS 预处理器**：

```bash
# SCSS
npm install -D sass

# Less
npm install -D less

# Stylus
npm install -D stylus
```

```javascript
// 直接使用
import './style.scss';
import './style.less';
import './style.styl';
```

**PostCSS**：

Vite 内置 PostCSS 支持，创建 `postcss.config.js`：

```javascript
export default {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
  },
};
```

### 5.3 环境变量

Vite 在 `import.meta.env` 对象上暴露环境变量。

**默认变量**：

| 变量 | 说明 |
|------|------|
| `import.meta.env.MODE` | 当前模式（development / production） |
| `import.meta.env.BASE_URL` | 部署时的 base URL |
| `import.meta.env.PROD` | 是否生产环境 |
| `import.meta.env.DEV` | 是否开发环境 |
| `import.meta.env.SSR` | 是否服务端渲染 |

**自定义环境变量**：

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.example.com
```

```javascript
// 使用
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_APP_TITLE);
```

### 5.4 依赖预构建

Vite 会自动预构建 npm 依赖，提升开发速度。

**配置依赖优化**：

```javascript
export default defineConfig({
  optimizeDeps: {
    // 强制预构建的依赖
    include: ['lodash-es', 'axios', 'vue'],

    // 排除预构建的依赖
    exclude: ['@mycompany/xxx'],
  },
});
```

---

## 六、生产构建优化

### 6.1 代码分割

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 手动分割 chunk
        manualChunks: {
          // 将 Vue 相关库打包在一起
          vue: ['vue', 'vue-router', 'pinia'],

          // 将工具库打包在一起
          utils: ['lodash-es', 'date-fns', 'axios'],

          // 将 UI 库打包在一起
          ui: ['element-plus', '@element-plus/icons-vue'],
        },
      },
    },
  },
});
```

### 6.2 动态导入（路由懒加载）

```javascript
// Vue Router 示例
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'),
  },
  {
    path: '/user/:id',
    component: () => import('./views/User.vue'),
  },
];
```

### 6.3 旧浏览器支持

```bash
npm install -D @vitejs/plugin-legacy
```

```javascript
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
});
```

### 6.4 压缩构建产物

```bash
npm install -D vite-plugin-compression
```

```javascript
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024, // 1KB 以上才压缩
    }),
  ],
});
```

### 6.5 分析构建产物

```bash
npm install -D rollup-plugin-visualizer
```

```javascript
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
  ],
});
```

---

## 七、完整配置示例

### Vue 3 + TypeScript 项目

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          ui: ['element-plus', '@element-plus/icons-vue'],
          utils: ['axios', 'dayjs', 'lodash-es'],
          charts: ['echarts'],
        },
      },
    },
  },
});
```

---

## 八、常见问题与技巧

### 8.1 如何查看 Vite 配置

```bash
vite --config-resolved
```

### 8.2 强制重新预构建依赖

```bash
vite --force
# 或删除缓存
rm -rf node_modules/.vite
```

### 8.3 性能优化建议

1. **使用 `?url` 导入大文件**：避免将大文件内联到 bundle 中
2. **合理使用动态导入**：分割代码，按需加载
3. **配置 `manualChunks`**：分离第三方库和业务代码
4. **开启 gzip 压缩**：使用 `vite-plugin-compression`
5. **使用 HTTP/2**：开发环境也可以配置 HTTPS

### 8.4 从 Webpack 迁移到 Vite

**主要区别**：

| Webpack | Vite |
|---------|------|
| `require()` | `import` |
| `require.context()` | `import.meta.glob()` |
| `module.exports` | `export default` |
| 静态资源 `url-loader` | `?url` |
| `process.env` | `import.meta.env` |
| `webpack.DefinePlugin` | `define` 配置 |

**迁移示例**：

```javascript
// Webpack
const files = require.context('./components', true, /\.vue$/);

// Vite
const files = import.meta.glob('./components/*.vue');
const filesEager = import.meta.glob('./components/*.vue', { eager: true });
```

---

## 九、总结

Vite 是现代前端开发的首选构建工具，核心优势：

- **极速开发体验**：毫秒级冷启动，即时 HMR
- **开箱即用**：无需繁琐配置即可启动项目
- **基于标准**：使用原生 ES Modules
- **强大插件**：基于 Rollup 插件生态

**学习建议**：
1. 从官方模板开始，熟悉基本功能
2. 理解 Vite 和传统工具的本质区别
3. 学习配置文件的各个选项
4. 掌握生产构建优化技巧
5. 了解插件开发，扩展功能

---

> **参考资源**：
> - Vite 官方文档：https://vitejs.dev/
> - Vite 中文文档：https://cn.vitejs.dev/
> - Vite GitHub：https://github.com/vitejs/vite
