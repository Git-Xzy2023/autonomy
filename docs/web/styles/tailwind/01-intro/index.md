---
title: Tailwind 入门与配置
---

# Tailwind 入门与配置

## 一、它解决了什么问题？

传统 CSS 开发中的痛点：

- 📛 **类名地狱**：给每个元素起有意义的类名，越写越多
- 🔁 **重复样式**：多个组件共享相同的样式片段
- 🚀 **构建缓慢**：需要维护 CSS 文件、编译流程、命名规范
- 📦 **产物膨胀**：CSS 文件随项目膨胀，难以清理无用代码

Tailwind 的思路：**用预定义的工具类代替手写 CSS**，你只需要写 HTML：

```html
<!-- 传统写法 -->
<button class="btn-primary">立即购买</button>
<style>
  .btn-primary {
    background: #3498db;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
  }
</style>

<!-- Tailwind 写法 -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
  立即购买
</button>
```

---

## 二、安装

### 方式一：通过 CDN（不推荐用于生产）

```html
<script src="https://cdn.tailwindcss.com"></script>
```

> ⚠️ CDN 方式无法使用 Tree-shaking，产物体积大，仅适合原型开发。

### 方式二：通过 npm + PostCSS（推荐）

```bash
# 1. 安装
npm install -D tailwindcss postcss autoprefixer

# 2. 生成配置文件
npx tailwindcss init -p
```

这会生成两个文件：

**`tailwind.config.js`**：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**`postcss.config.js`**：

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 方式三：Vite 插件（推荐用于 Vite 项目）

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Vite 会自动识别 PostCSS 配置。

---

## 三、配置扫描范围

在 `tailwind.config.js` 中配置 `content`，告诉 Tailwind 哪些文件需要扫描：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

> ⚠️ `content` 配置非常重要，它决定了 Tree-shaking 的效果。如果配置错误，可能导致样式丢失或产物过大。

---

## 四、引入 Tailwind

在入口 CSS 文件（如 `src/index.css`）中引入：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- `@tailwind base`：重置样式（基于 Preflight）
- `@tailwind components`：组件类（默认为空，可用 `@apply` 扩展）
- `@tailwind utilities`：工具类

---

## 五、第一个 Tailwind 页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>Tailwind 示例</title>
    <link rel="stylesheet" href="./dist/output.css" />
  </head>
  <body class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Hello, Tailwind!</h1>
      <p class="text-gray-600 mb-6">这是一个使用 Tailwind CSS 的示例页面。</p>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        点击我
      </button>
    </div>
  </body>
</html>
```

---

## 六、构建

### 开发环境

```bash
# 监听文件变化
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

### 生产环境

```bash
# 压缩输出
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
```

### Vite / Webpack

安装 PostCSS 后，构建工具会自动处理，无需手动编译。

---

## 七、Tailwind Play

在线编辑器：[play.tailwindcss.com](https://play.tailwindcss.com/)

适合快速试验和分享代码。

---

## 八、下一步

- 下一章：[工具类速查](/web/styles/tailwind/02-utilities/)
- 官方文档：[tailwindcss.com/docs](https://tailwindcss.com/docs)
