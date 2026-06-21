---
title: CSS 新特性
---

# CSS 新特性

现代 CSS 不断发展，许多曾经需要预处理器才能实现的功能已经原生支持。本章介绍近年来浏览器新增的重要 CSS 特性。

---

## 一、CSS Nesting（原生嵌套）

CSS 终于原生支持嵌套语法（2023 年所有主流浏览器已支持）：

```css
/* 原生 CSS 嵌套 */
.card {
  background: white;
  padding: 16px;

  &__title {
    font-size: 20px;
  }

  &__body {
    padding: 12px 0;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
}
```

### 兼容性

- Chrome 112+（2023.4）
- Firefox 117+（2023.8）
- Safari 16.5+（2023.4）

> 💡 对于不支持的浏览器，可以使用 PostCSS 插件 `postcss-nesting` 进行降级。

---

## 二、CSS Custom Properties（CSS 变量）

```css
:root {
  --primary-color: #3498db;
  --spacing: 16px;
  --font-size: 14px;
}

.btn {
  background: var(--primary-color);
  padding: var(--spacing);
  font-size: var(--font-size);
}
```

### 动态修改

```js
// JS 修改 CSS 变量
document.documentElement.style.setProperty('--primary-color', '#e74c3c');
```

### 响应式变量

```css
:root {
  --font-size: 14px;
}

@media (min-width: 768px) {
  :root {
    --font-size: 16px;
  }
}

body {
  font-size: var(--font-size);
}
```

### 主题切换

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #f0f0f0;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
}
```

```js
// 切换主题
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 三、Container Queries（容器查询）

容器查询允许组件根据**父容器**的尺寸响应，而不是视口尺寸：

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

### 使用场景

- 组件库：组件在不同容器中自适应
- 响应式卡片：根据容器宽度切换布局
- 可复用 widget

### 兼容性

- Chrome 105+（2022.8）
- Firefox 110+（2023.2）
- Safari 16+（2022.9）

---

## 四、`:has()` 选择器（父选择器）

`:has()` 是 CSS 长期以来最期待的特性——**父选择器**：

```css
/* 选中包含 img 的 card */
.card:has(img) {
  padding: 0;
}

/* 选中没有 error 类的 form */
form:not(:has(.error)) .submit-btn {
  opacity: 1;
}

/* 选中其后代有 :checked 的 label */
label:has(input:checked) {
  font-weight: bold;
}

/* 根据子元素状态样式化父元素 */
div:has(> p:hover) {
  background: yellow;
}
```

### 实战示例

```css
/* 表单验证状态 */
.form-group:has(input:invalid) .error-message {
  display: block;
}

/* 卡片悬停时显示按钮 */
.card:hover:has(.action-btn) .action-btn {
  opacity: 1;
}

/* 选中第 N 个子元素有特定类的父元素 */
ul:has(li.active) {
  border-color: blue;
}
```

### 兼容性

- Chrome 105+（2022.8）
- Firefox 121+（2023.12）
- Safari 15.4+（2022.3）

---

## 五、`@layer` 层级

`@layer` 解决了 CSS 优先级难以管理的问题：

```css
/* 定义层级（优先级从低到高） */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  body { font-size: 16px; line-height: 1.5; }
  h1 { font-size: 2em; }
}

@layer components {
  .btn { padding: 8px 16px; border-radius: 4px; }
}

@layer utilities {
  .text-center { text-align: center; }
  .mt-4 { margin-top: 1rem; }
}
```

### 优先级规则

- 后声明的 layer 优先级更高
- layer 内的样式优先级低于未分层的样式
- `!important` 在 layer 中行为相反（先声明的 layer 优先级更高）

---

## 六、`color-mix()` 函数

混合两种颜色：

```css
.btn {
  /* 混合 50% 红色和 50% 蓝色 */
  background: color-mix(in srgb, red 50%, blue);
}

.btn-hover {
  /* 混合 20% 黑色（变暗） */
  background: color-mix(in srgb, var(--primary) 80%, black);
}
```

---

## 七、相对颜色 `from`

基于现有颜色生成新颜色：

```css
:root {
  --primary: #3498db;
}

.btn {
  background: var(--primary);
}

.btn-hover {
  /* 基于 --primary 变暗 20% */
  background: hsl(from var(--primary) h s calc(l - 20%));
}

.btn-light {
  /* 基于 --primary 变亮 20% */
  background: hsl(from var(--primary) h s calc(l + 20%));
}
```

---

## 八、`@scope` 作用域

`@scope` 限制样式的作用范围：

```css
/* 只作用于 .card 内的 .title */
@scope (.card) {
  .title {
    font-size: 20px;
  }
}

/* 作用范围：从 .card 到 .footer 之间 */
@scope (.card) to (.footer) {
  p {
    color: #333;
  }
}
```

---

## 九、`text-wrap: balance`

文本平衡换行，让标题更美观：

```css
h1, h2, h3 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```

---

## 十、`aspect-ratio`

```css
.video {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.avatar {
  aspect-ratio: 1;
  width: 100px;
  border-radius: 50%;
}
```

---

## 十一、`gap` 用于 Flexbox

```css
.flex-container {
  display: flex;
  gap: 16px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 24px; /* row-gap column-gap */
}
```

---

## 十二、`inset` 简写

```css
/* 简写 */
.modal {
  inset: 0; /* top: 0; right: 0; bottom: 0; left: 0 */
}

/* 部分设置 */
.box {
  inset: 10px 20px; /* top/bottom: 10px, left/right: 20px */
}
```

---

## 十三、`@property` 自定义属性类型

```css
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.conic-gradient {
  --gradient-angle: 45deg;
  background: conic-gradient(from var(--gradient-angle), red, blue);
  transition: --gradient-angle 0.5s;
}

.conic-gradient:hover {
  --gradient-angle: 180deg;
}
```

---

## 十四、滚动驱动动画

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.scroll-element {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

---

## 十五、特性检测 `@supports`

```css
/* 检测是否支持某个特性 */
@supports (aspect-ratio: 1) {
  .box {
    aspect-ratio: 1;
  }
}

@supports not (aspect-ratio: 1) {
  .box::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
}

/* 检测选择器 */
@supports selector(:has(*)) {
  .card:has(img) {
    padding: 0;
  }
}
```

---

## 十六、下一步

- 上一章：[CSS-in-JS](/web/styles/modern/02-css-in-js/)
- 下一章：[方案对比与选型](/web/styles/modern/04-comparison/)
