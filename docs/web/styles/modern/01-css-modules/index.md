---
title: CSS Modules
---

# CSS Modules

## 一、什么是 CSS Modules？

**CSS Modules** 是一种 CSS 文件格式，它在**编译时**为每个类名生成唯一的标识符，从而实现局部作用域，避免类名冲突。

```css
/* Button.module.css */
.btn {
  background: blue;
  color: white;
  padding: 8px 16px;
}

.primary {
  composes: btn;
  background: darkblue;
}
```

```jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>按钮</button>;
}
```

编译后生成的类名类似 `_Button_module_btn_1a2b3`，保证全局唯一。

---

## 二、核心特性

### 1. 局部作用域

默认所有类名都是局部的：

```css
/* Card.module.css */
.title {
  font-size: 20px;
  color: #333;
}
```

```jsx
import styles from './Card.module.css';

// styles.title 实际值类似 "Card_title_1a2b3_4c5d"
<h1 className={styles.title}>标题</h1>
```

### 2. 全局作用域 `:global`

如果需要全局类名，使用 `:global`：

```css
/* Card.module.css */
:global(.clear-fix) {
  clear: both;
}

.title {
  /* 局部 */
  font-size: 20px;
}
```

### 3. `composes` 组合类

```css
/* Button.module.css */
.base {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

.primary {
  composes: base;
  background: blue;
  color: white;
}

.danger {
  composes: base;
  background: red;
  color: white;
}
```

```jsx
import styles from './Button.module.css';

<button className={styles.primary}>主按钮</button>
<button className={styles.danger}>危险按钮</button>
```

### 4. 跨文件组合

```css
/* colors.module.css */
.primary { color: blue; }
.danger { color: red; }
```

```css
/* Button.module.css */
.btn {
  composes: primary from './colors.module.css';
  padding: 8px 16px;
}
```

---

## 三、使用方式

### 1. React（Create React App / Vite）

```jsx
// Button.jsx
import styles from './Button.module.css';

export function Button({ variant = 'primary', children }) {
  return (
    <button className={styles[variant]}>
      {children}
    </button>
  );
}
```

```css
/* Button.module.css */
.primary {
  background: blue;
  color: white;
  padding: 8px 16px;
}
```

### 2. Vue（`<style module>`）

```vue
<template>
  <button :class="$style.primary">按钮</button>
</template>

<style module>
.primary {
  background: blue;
  color: white;
  padding: 8px 16px;
}
</style>
```

使用组合：

```vue
<template>
  <button :class="[$style.base, $style.primary]">按钮</button>
</template>

<style module>
.base { padding: 8px 16px; }
.primary { background: blue; color: white; }
</style>
```

### 3. Next.js

Next.js 内置支持 CSS Modules：

```jsx
// pages/index.js
import styles from '../styles/Home.module.css';

export default function Home() {
  return <div className={styles.container}>Home</div>;
}
```

---

## 四、TypeScript 支持

### 1. 声明模块类型

```typescript
// global.d.ts
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

### 2. 使用

```tsx
import styles from './Button.module.css';

// 有类型提示
<button className={styles.primary}>按钮</button>
```

---

## 五、与 Sass/Less 结合

CSS Modules 可以与预处理器结合使用：

```scss
/* Button.module.scss */
$primary: #3498db;

.btn {
  background: $primary;
  color: white;
  padding: 8px 16px;

  &:hover {
    background: darken($primary, 10%);
  }
}
```

```jsx
import styles from './Button.module.scss';
<button className={styles.btn}>按钮</button>
```

---

## 六、命名约定

### 1. 文件命名

- `[name].module.css`
- `[name].module.scss`
- `[name].module.less`

### 2. 类名生成规则

可通过构建工具配置：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },
};
```

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
  },
});
```

---

## 七、动态类名

### 1. 使用 `classnames` 库

```jsx
import classNames from 'classnames';
import styles from './Button.module.css';

function Button({ variant, size, disabled, children }) {
  return (
    <button
      className={classNames(
        styles.base,
        styles[variant],
        styles[size],
        {
          [styles.disabled]: disabled,
        }
      )}
    >
      {children}
    </button>
  );
}
```

### 2. 使用 `clsx`

```jsx
import clsx from 'clsx';
import styles from './Button.module.css';

<button className={clsx(styles.base, styles[variant], disabled && styles.disabled)}>
  按钮
</button>
```

---

## 八、优缺点

### 优点

- ✅ **局部作用域**：天然避免类名冲突
- ✅ **编译时生成**：无运行时开销
- ✅ **与现有 CSS 语法兼容**：学习成本低
- ✅ **支持预处理器**：可与 Sass/Less 结合
- ✅ **Tree-shaking**：未使用的样式会被移除

### 缺点

- ❌ **无法动态生成样式**：类名是固定的，无法根据 JS 状态动态生成
- ❌ **需要构建工具支持**：不能直接在浏览器中使用
- ❌ **类名引用繁琐**：`styles.xxx` 不如直接写类名简洁

---

## 九、下一步

- 下一章：[CSS-in-JS（styled-components）](/web/styles/modern/02-css-in-js/)
- 上一级：[现代方案](/web/styles/modern/)
