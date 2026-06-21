---
title: Tailwind 插件与生态
---

# Tailwind 插件与生态

## 一、官方插件

### 1. `@tailwindcss/forms`

表单元素样式重置和美化：

```bash
npm install -D @tailwindcss/forms
```

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

使用：

```html
<input type="text" class="form-input" placeholder="输入..." />
<select class="form-select">
  <option>选项 1</option>
</select>
<input type="checkbox" class="form-checkbox" />
<input type="radio" class="form-radio" />
```

### 2. `@tailwindcss/typography`

为 `prose` 类添加排版样式，适合博客、文档：

```bash
npm install -D @tailwindcss/typography
```

```js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

使用：

```html
<article class="prose prose-lg">
  <h1>标题</h1>
  <p>段落内容...</p>
  <ul>
    <li>列表项</li>
  </ul>
</article>

<!-- 暗黑模式 -->
<article class="prose dark:prose-invert">
  内容
</article>
```

### 3. `@tailwindcss/aspect-ratio`

固定宽高比：

```bash
npm install -D @tailwindcss/aspect-ratio
```

```js
module.exports = {
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

使用：

```html
<div class="aspect-w-16 aspect-h-9">
  <img src="..." class="object-cover" />
</div>
```

### 4. `@tailwindcss/line-clamp`（已内置到 v3.3+）

文本截断：

```html
<p class="line-clamp-3">
  这是一段很长的文本，会在 3 行后截断并显示省略号...
</p>
```

### 5. `@tailwindcss/container-queries`

容器查询（v3.2+）：

```bash
npm install -D @tailwindcss/container-queries
```

```js
module.exports = {
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
};
```

使用：

```html
<div class="@container">
  <div class="@md:grid-cols-2">
    当容器宽度 >= md 时，显示 2 列
  </div>
</div>
```

---

## 二、社区插件

### 1. `tailwindcss-animate`

动画工具类：

```bash
npm install -D tailwindcss-animate
```

```js
module.exports = {
  plugins: [
    require('tailwindcss-animate'),
  ],
};
```

使用：

```html
<div class="animate-in fade-in slide-in-from-bottom">入场动画</div>
<div class="animate-out fade-out">出场动画</div>
```

### 2. `@tailwindcss/aspect-ratio`

### 3. `daisyui`

基于 Tailwind 的组件库：

```bash
npm install -D daisyui
```

```js
module.exports = {
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
};
```

使用：

```html
<button class="btn btn-primary">按钮</button>
<div class="card">卡片</div>
<div class="alert alert-error">错误提示</div>
```

---

## 三、自定义插件

### 1. 简单插件

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
```

使用：

```html
<h1 class="text-shadow-lg">带阴影的标题</h1>
```

### 2. 带配置的插件

```js
const plugin = require('tailwindcss/plugin');

module.exports = {
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const shadows = theme('textShadow');
      const utilities = Object.keys(shadows).map(key => ({
        [`.text-shadow${key === 'DEFAULT' ? '' : `-${key}`}`]: {
          'text-shadow': shadows[key],
        },
      }));
      addUtilities(utilities);
    }),
  ],
};
```

### 3. 添加基础样式

```js
plugin(function ({ addBase, theme }) {
  addBase({
    'h1': { fontSize: theme('fontSize.2xl') },
    'h2': { fontSize: theme('fontSize.xl') },
    'body': { color: theme('colors.gray.800') },
  });
}),
```

### 4. 添加组件类

```js
plugin(function ({ addComponents, theme }) {
  addComponents({
    '.btn': {
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
      borderRadius: theme('borderRadius.md'),
      fontWeight: theme('fontWeight.medium'),
    },
  });
}),
```

---

## 四、预设（Presets）

预设允许你复用配置：

```js
// my-preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

```js
// tailwind.config.js
module.exports = {
  presets: [require('./my-preset.js')],
  content: ['./src/**/*.{html,js}'],
};
```

---

## 五、PostCSS 插件配合

### Autoprefixer

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### CSS Nano（压缩）

```bash
npm install -D cssnano
```

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
```

---

## 六、工具与资源

### 1. VS Code 插件

- **Tailwind CSS IntelliSense**：官方插件，提供自动补全、悬停预览、Linting

### 2. 在线工具

- [Tailwind Play](https://play.tailwindcss.com/)：在线编辑器
- [Tailwind Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)：速查表
- [Tailwind UI](https://tailwindui.com/)：官方收费组件库
- [Flowbite](https://flowbite.com/)：免费组件库
- [HyperUI](https://www.hyperui.dev/)：免费组件集合
- [Meraki UI](https://merakiui.com/)：免费组件

### 3. 设计资源

- [Heroicons](https://heroicons.com/)：官方图标库
- [Headless UI](https://headlessui.com/)：无样式组件库（React/Vue）
- [Radix UI](https://www.radix-ui.com/)：无样式组件库

---

## 七、下一步

- 上一章：[@apply 与组件抽取](/web/styles/tailwind/05-apply/)
- 下一章：[最佳实践](/web/styles/tailwind/07-best-practices/)
