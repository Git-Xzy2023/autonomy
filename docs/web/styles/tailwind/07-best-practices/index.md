---
title: Tailwind 最佳实践
---

# Tailwind 最佳实践

## 一、何时使用 Tailwind

### ✅ 适合的场景

| 项目类型 | 推荐理由 |
|----------|----------|
| 小型静态页面 / 原型 | 开发最快 |
| 中型项目 + 组件库 | Tailwind + 少量 `@apply` |
| 设计系统 | 通过 `theme` 配置统一管理 |
| 团队对类名管理无严格约定 | 工具类避免命名冲突 |

### ❌ 不适合的场景

| 场景 | 原因 |
|------|------|
| 需要支持 IE11 | Tailwind v3 不支持 IE |
| 团队习惯 BEM + Sass | 切换成本高 |
| 需要严格分离 HTML 和 CSS | Tailwind 强耦合 HTML |

---

## 二、类名组织

### 1. 类名顺序约定

推荐按照以下顺序组织类名：

```html
<div class="
  /* 布局 */
  flex flex-col items-center justify-center
  /* 尺寸 */
  w-full h-screen
  /* 间距 */
  p-4 m-2
  /* 颜色 */
  bg-white text-gray-800
  /* 边框 */
  border border-gray-200 rounded-lg
  /* 状态 */
  hover:bg-gray-50 focus:ring-2
  /* 响应式 */
  md:flex-row md:p-6
">
```

### 2. 使用 `clsx` / `classnames` 管理类名

```jsx
import clsx from 'clsx';

function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={clsx(
        // 基础类
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        // 变体
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        },
        // 尺寸
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        // 自定义类（允许覆盖）
        className
      )}
      {...props}
    />
  );
}
```

### 3. Vue 中使用 `class-variance-authority`

```vue
<script setup>
import { cva } from 'class-variance-authority';

const button = cva('inline-flex items-center rounded-md font-medium', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
</script>

<template>
  <button :class="button({ variant, size })">
    <slot />
  </button>
</template>
```

---

## 三、组件抽取策略

### 原则：优先用组件，而非 `@apply`

```jsx
// ✅ 推荐：用组件封装
function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ❌ 避免：过度使用 @apply
// .btn-primary { @apply bg-blue-500 text-white px-4 py-2 rounded-md; }
```

### 何时用 `@apply`

- 工具类组合被**多处**使用（3 次以上）
- 需要在非组件环境（如 Markdown 渲染）中使用
- 第三方库样式覆盖

---

## 四、性能优化

### 1. 正确配置 `content`

```js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // 避免扫描不必要的文件
  ],
};
```

### 2. 生产环境压缩

```bash
# CLI
npx tailwindcss -i input.css -o output.css --minify

# 或通过 PostCSS
npm install -D cssnano
```

### 3. 禁用未使用的核心插件

```js
module.exports = {
  corePlugins: {
    float: false,        // 不使用 float
    caretColor: false,   // 不使用 caret-color
  },
};
```

### 4. 使用 JIT 模式（v3 默认开启）

JIT（Just-In-Time）模式只生成用到的 CSS，产物体积大幅减小。

---

## 五、暗黑模式最佳实践

### 1. 使用 `class` 策略

```js
module.exports = {
  darkMode: 'class',
};
```

### 2. 封装主题切换 Hook

```js
// useTheme.js
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return { theme, toggle };
}
```

### 3. 系统偏好跟随

```js
useEffect(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => {
    document.documentElement.classList.toggle('dark', e.matches);
  };
  media.addEventListener('change', handler);
  return () => media.removeEventListener('change', handler);
}, []);
```

---

## 六、与设计系统结合

### 1. 定义 Design Token

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 语义化颜色
        primary: { /* ... */ },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      spacing: {
        // 设计系统间距
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      fontSize: {
        // 排版系统
        'display': ['4rem', { lineHeight: '1.1' }],
        'heading': ['2rem', { lineHeight: '1.2' }],
        'body': ['1rem', { lineHeight: '1.5' }],
      },
    },
  },
};
```

### 2. 使用 CSS 变量实现动态主题

```css
/* tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 59 130 246; /* blue-500 */
  }

  .dark {
    --color-primary: 96 165 250; /* blue-400 */
  }
}
```

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
    },
  },
};
```

---

## 七、常见反模式

### 1. ❌ 过度使用 `@apply`

```css
/* 反模式：把所有东西都抽成类 */
.text-red { @apply text-red-500; }
.text-big { @apply text-2xl; }
.mt { @apply mt-4; }

/* ✅ 直接使用工具类 */
/* <p class="text-red-500 text-2xl mt-4">...</p> */
```

### 2. ❌ 超长类名列表

```html
<!-- 反模式：类名过长，难以维护 -->
<div class="flex flex-col items-center justify-center w-full h-screen p-4 m-2 bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 md:flex-row md:p-6 lg:max-w-5xl lg:mx-auto xl:p-8">
  内容
</div>

<!-- ✅ 推荐：用组件封装 -->
<Card>内容</Card>
```

### 3. ❌ 在 `@apply` 中使用 `!important`

```css
/* 反模式 */
.btn { @apply !bg-blue-500 !text-white; }
```

### 4. ❌ 忽略 Tree-shaking

```js
// 反模式：content 配置过宽
module.exports = {
  content: ['./**/*'],  // 扫描所有文件
};

// ✅ 精确配置
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './index.html',
  ],
};
```

---

## 八、总结

1. **移动优先**：默认样式针对移动端，用 `md:` `lg:` 等覆盖
2. **优先用组件，而非 `@apply`**：组件更灵活、可复用
3. **正确配置 `content`**：确保 Tree-shaking 效果
4. **使用 `clsx` / `cva` 管理类名**：避免类名混乱
5. **生产环境压缩**：减小产物体积
6. **结合设计系统**：通过 `theme` 配置统一管理 Design Token
7. **使用 CSS 变量实现动态主题**：支持运行时切换
8. **避免过度抽象**：工具类的简洁性是 Tailwind 的优势

---

## 九、学习路线回顾

- [01 入门与配置](/web/styles/tailwind/01-intro/)
- [02 工具类速查](/web/styles/tailwind/02-utilities/)
- [03 响应式与状态](/web/styles/tailwind/03-responsive/)
- [04 自定义主题](/web/styles/tailwind/04-theme/)
- [05 @apply 与组件抽取](/web/styles/tailwind/05-apply/)
- [06 插件与生态](/web/styles/tailwind/06-plugins/)
- [07 最佳实践](/web/styles/tailwind/07-best-practices/)

恭喜完成 Tailwind CSS 学习！🎉 接下来可以学习 [现代方案](/web/styles/modern/) 或回顾 [CSS 基础](/web/styles/css/01-basics/)。
