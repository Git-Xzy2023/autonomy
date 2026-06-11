---
title: Tailwind CSS 入门
---

# Tailwind CSS 入门

**Tailwind CSS** 是一个「实用优先」（utility-first）的 CSS 框架。它提供了大量细粒度的工具类，让你直接在 HTML 中组合出任意样式，无需写自定义 CSS 文件。

---

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

### 方式二：通过 npm + PostCSS（推荐）

```bash
# 1. 安装
npm install -D tailwindcss postcss autoprefixer

# 2. 生成配置文件
npx tailwindcss init -p
```

在 `tailwind.config.js` 中配置扫描范围：

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

在入口 CSS 文件（如 `src/index.css`）中引入：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 三、基础工具类

### 常用工具类速查

| 样式          | Tailwind 类                                | 等价 CSS                |
| ------------- | ------------------------------------------ | ----------------------- |
| **背景色**    | `bg-red-500` / `bg-[#ff0000]`              | `background-color: ...` |
| **文字颜色**  | `text-white` / `text-gray-700`             | `color: ...`            |
| **字号**      | `text-sm` / `text-lg` / `text-2xl`         | `font-size: ...`        |
| **内边距**    | `p-4` / `px-4` / `py-2`                    | `padding: ...`          |
| **外边距**    | `m-4` / `mt-2` / `mx-auto`                 | `margin: ...`           |
| **圆角**      | `rounded` / `rounded-full`                 | `border-radius: ...`    |
| **弹性布局**  | `flex` / `justify-center` / `items-center` | `display: flex; ...`    |
| **网格布局**  | `grid` / `grid-cols-3`                     | `display: grid; ...`    |
| **显示/隐藏** | `hidden` / `block` / `inline-block`        | `display: ...`          |
| **边框**      | `border` / `border-gray-300`               | `border: ...`           |

---

## 四、响应式与状态 {#响应式与状态}

### 响应式前缀

Tailwind 默认提供 5 个断点：

| 前缀   | 最小宽度 | 适用         |
| ------ | -------- | ------------ |
| `sm:`  | 640px    | 小屏手机横屏 |
| `md:`  | 768px    | 平板         |
| `lg:`  | 1024px   | 笔记本       |
| `xl:`  | 1280px   | 桌面大屏     |
| `2xl:` | 1536px   | 超宽屏       |

```html
<!-- 手机端 1 列，平板 2 列，桌面 3 列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>卡片 1</div>
  <div>卡片 2</div>
  <div>卡片 3</div>
</div>
```

### 状态修饰符

| 修饰符             | 作用                    |
| ------------------ | ----------------------- |
| `hover:`           | 鼠标悬停                |
| `focus:`           | 获得焦点                |
| `active:`          | 被点击/激活             |
| `disabled:`        | 禁用状态                |
| `dark:`            | 深色模式                |
| `first:` / `last:` | 第一个 / 最后一个子元素 |
| `odd:` / `even:`   | 奇数 / 偶数子元素       |

```html
<button
  class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
>
  提交
</button>
```

多个修饰符可以组合使用：

```html
<div class="bg-white dark:bg-gray-900 hover:dark:bg-gray-800">支持暗黑模式</div>
```

---

## 五、自定义配置

Tailwind 的默认主题可以通过 `tailwind.config.js` 扩展：

```js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
      },
    },
  },
};
```

使用自定义的工具类：

```html
<div class="bg-brand-500 font-sans shadow-soft">自定义品牌色 + 字体 + 阴影</div>
```

### `@apply` 抽取公共样式

当一段工具类组合被多次使用时，可以用 `@apply` 抽出：

```css
/* components.css */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}
.btn-primary {
  @apply btn bg-blue-500 text-white hover:bg-blue-600;
}
```

然后在 HTML 中直接用类名：

```html
<button class="btn-primary">提交</button>
```

---

## 六、实战示例

### 卡片组件

```html
<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <img class="h-48 w-full object-cover" src="..." alt="封面" />
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-800">Tailwind 真香</h2>
    <p class="mt-2 text-gray-600">快速构建响应式 UI，不用写 CSS。</p>
    <button
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      了解更多
    </button>
  </div>
</div>
```

### 居中对齐

```html
<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-4xl font-bold">Hello, Tailwind!</h1>
  </div>
</div>
```

---

## 七、学习资源

- 📖 [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- 🔍 [Tailwind Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- 🎨 [Tailwind UI](https://tailwindui.com/) — 官方收费组件库
- 🧩 [Flowbite](https://flowbite.com/) — 免费组件库
- 🌓 [Tailwind Play](https://play.tailwindcss.com/) — 在线编辑器

---

## 八、选择建议

| 项目类型                 | 推荐方案                 |
| ------------------------ | ------------------------ |
| 小型静态页面 / 原型      | Tailwind（开发最快）     |
| 中型项目 + 组件库        | Tailwind + 少量 `@apply` |
| 大型项目 + 设计规范      | Sass + BEM / CSS Modules |
| 团队对类名管理有严格约定 | Sass + CSS Modules       |

Tailwind 不是银弹，但它在大多数前端项目中能显著提升效率。结合你的团队习惯和项目规模做出选择即可！
