---
title: Tailwind @apply 与组件抽取
---

# Tailwind @apply 与组件抽取

## 一、`@apply` 指令

`@apply` 允许在 CSS 中使用 Tailwind 的工具类：

```css
/* components.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }

  .btn-danger {
    @apply btn bg-red-500 text-white hover:bg-red-600;
  }
}
```

然后在 HTML 中直接用类名：

```html
<button class="btn-primary">提交</button>
<button class="btn-danger">删除</button>
```

---

## 二、`@layer` 层级

Tailwind 有三个层级：

| 层级 | 说明 | 优先级 |
|------|------|--------|
| `base` | 基础样式（重置、元素默认样式） | 最低 |
| `components` | 组件类 | 中 |
| `utilities` | 工具类 | 最高 |

```css
@layer base {
  h1 { @apply text-2xl font-bold; }
  body { @apply bg-gray-100 text-gray-900; }
}

@layer components {
  .btn { @apply px-4 py-2 rounded; }
  .card { @apply bg-white rounded-lg shadow-md p-6; }
}

@layer utilities {
  .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
}
```

> 💡 使用 `@layer` 可以确保样式优先级正确，且能被 Tree-shaking 优化。

---

## 三、何时使用 `@apply`

### ✅ 适合使用 `@apply` 的场景

1. **重复的工具类组合**：多个元素使用相同的工具类组合
2. **框架集成**：在 Vue/React 组件中需要语义化类名
3. **第三方库样式覆盖**：无法直接修改 HTML 的场景

```css
/* 重复组合 */
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }

  .card-header {
    @apply px-6 py-4 border-b border-gray-200;
  }

  .card-body {
    @apply p-6;
  }
}
```

### ❌ 不适合使用 `@apply` 的场景

1. **单次使用的样式**：直接写工具类更清晰
2. **过度抽象**：把所有东西都抽成组件类

```css
/* ❌ 反模式：过度抽象 */
@layer components {
  .red-text { @apply text-red-500; }
  .big-text { @apply text-2xl; }
  .margin-top { @apply mt-4; }
}

/* ✅ 直接使用工具类 */
/* <p class="text-red-500 text-2xl mt-4">...</p> */
```

---

## 四、组件抽取策略

### 策略 1：HTML 中直接使用工具类（推荐）

```html
<!-- 简单组件直接写工具类 -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
  按钮
</button>
```

### 策略 2：`@apply` 抽取重复组合

```css
/* 当工具类组合被多次使用时 */
@layer components {
  .btn {
    @apply inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  .btn-primary { @apply btn bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500; }
  .btn-secondary { @apply btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500; }
  .btn-danger { @apply btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500; }
}
```

### 策略 3：Vue/React 组件封装

```vue
<!-- Button.vue -->
<template>
  <button
    :class="[
      'inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors',
      variantClasses
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'primary' }
});

const variants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const variantClasses = computed(() => variants[props.variant]);
</script>
```

```jsx
// React 版本
function Button({ variant = 'primary', children, ...props }) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      className={`inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## 五、`@apply` 的高级用法

### 1. 使用变体

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded;
    @apply hover:bg-blue-600 focus:ring-2;
    @apply md:px-6 md:py-3;
  }
}
```

### 2. 与自定义 CSS 结合

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md;

    /* 自定义 CSS */
    backdrop-filter: blur(10px);
    background-image: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  }
}
```

### 3. 嵌套 `@apply`

```css
@layer components {
  .btn-base {
    @apply inline-flex items-center px-4 py-2 rounded;
  }

  .btn-primary {
    @apply btn-base bg-blue-500 text-white;
  }
}
```

---

## 六、`@layer components` vs `@layer utilities`

```css
/* components 层：可被 utilities 覆盖 */
@layer components {
  .btn { @apply px-4 py-2 bg-blue-500 text-white; }
}

/* utilities 层：优先级最高 */
@layer utilities {
  .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
}
```

```html
<!-- utilities 优先级高于 components -->
<button class="btn bg-red-500">红色按钮（覆盖了 btn 的蓝色）</button>
```

---

## 七、`@screen` 指令

```css
/* 使用 @screen 代替 @media */
@screen md {
  .container {
    max-width: 768px;
  }
}

/* 等价于 */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}
```

---

## 八、常见组件抽取示例

### 1. 表单输入

```css
@layer components {
  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           disabled:bg-gray-100 disabled:cursor-not-allowed;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-error {
    @apply text-red-500 text-xs mt-1;
  }
}
```

### 2. 卡片

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }

  .card-header {
    @apply px-6 py-4 border-b border-gray-200 font-semibold;
  }

  .card-body {
    @apply p-6;
  }

  .card-footer {
    @apply px-6 py-3 bg-gray-50 border-t border-gray-200;
  }
}
```

### 3. 导航

```css
@layer components {
  .nav-link {
    @apply px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors;
  }

  .nav-link-active {
    @apply nav-link text-blue-600 bg-blue-50;
  }
}
```

---

## 九、下一步

- 上一章：[自定义主题](/web/styles/tailwind/04-theme/)
- 下一章：[插件与生态](/web/styles/tailwind/06-plugins/)
