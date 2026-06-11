---
title: 响应式设计
---

# 响应式设计

响应式设计是一种网页设计方法，旨在使网站在各种设备上都能提供最佳的浏览体验。它的核心思想是：**一个网站，多种设备**。

---

## 一、响应式设计的核心概念

### 1.1 什么是响应式设计

响应式设计是 Ethan Marcotte 在 2010 年提出的概念，它结合了以下三个技术：

1. **弹性网格布局** - 使用相对单位而非固定像素
2. **弹性图片** - 图片可以根据容器大小缩放
3. **媒体查询** - 根据设备特性应用不同的样式

### 1.2 为什么需要响应式设计

- **多设备时代**：用户使用各种设备访问网站（手机、平板、笔记本、桌面）
- **用户体验**：在不同设备上提供一致且友好的体验
- **SEO 优化**：Google 推荐使用响应式设计，有利于搜索引擎排名
- **维护成本**：只需维护一个网站，而非多个版本

### 1.3 响应式设计 vs 自适应设计 vs 移动优先

| 方案 | 特点 | 优点 | 缺点 |
|------|------|------|------|
| 响应式设计 | 一个网站，根据视口大小调整布局 | 维护成本低，SEO 友好 | 初始设计复杂 |
| 自适应设计 | 多个固定布局版本，根据设备选择 | 可以针对特定设备优化 | 维护成本高 |
| 移动优先 | 先设计移动版本，再扩展到桌面 | 专注核心内容，性能好 | 需要改变设计思维 |

---

## 二、视口（Viewport）

### 2.1 什么是视口

视口是浏览器中用于显示网页的区域。在移动设备上，视口通常比屏幕尺寸大，以便显示完整的桌面网站。

### 2.2 viewport meta 标签

```html
<!-- 标准 viewport 设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**属性说明：**

| 属性 | 值 | 说明 |
|------|-----|------|
| width | device-width | 视口宽度等于设备宽度 |
| initial-scale | 1.0 | 初始缩放比例为 100% |
| minimum-scale | 0.5 | 最小缩放比例 |
| maximum-scale | 2.0 | 最大缩放比例 |
| user-scalable | yes/no | 是否允许用户缩放 |

**推荐设置：**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

**注意：** 不建议设置 `user-scalable=no`，因为这会影响无障碍访问。

---

## 三、媒体查询（Media Queries）

媒体查询是 CSS3 的一个特性，允许我们根据设备的特性（如宽度、高度、方向等）应用不同的样式。

### 3.1 媒体查询的基本语法

```css
@media media-type and (media-feature) {
  /* CSS 规则 */
}
```

### 3.2 媒体类型

| 类型 | 说明 |
|------|------|
| all | 所有设备 |
| screen | 屏幕设备（电脑、手机、平板） |
| print | 打印设备 |
| speech | 屏幕阅读器 |

### 3.3 常用媒体特性

| 特性 | 说明 | 示例 |
|------|------|------|
| width | 视口宽度 | `(min-width: 768px)` |
| height | 视口高度 | `(min-height: 480px)` |
| device-width | 设备宽度 | `(min-device-width: 320px)` |
| device-height | 设备高度 | `(min-device-height: 480px)` |
| orientation | 方向 | `(orientation: portrait)` |
| aspect-ratio | 宽高比 | `(aspect-ratio: 16/9)` |
| resolution | 分辨率 | `(min-resolution: 300dpi)` |

### 3.4 媒体查询运算符

#### and 运算符

```css
/* 同时满足多个条件 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  /* 平板设备样式 */
}
```

#### not 运算符

```css
/* 不满足条件时应用 */
@media not print {
  /* 非打印设备样式 */
}
```

#### only 运算符

```css
/* 仅在满足条件时应用，用于兼容旧浏览器 */
@media only screen and (max-width: 480px) {
  /* 手机设备样式 */
}
```

#### 逗号分隔（或运算）

```css
/* 满足任一条件时应用 */
@media (max-width: 480px), (orientation: portrait) {
  /* 小屏幕或竖屏时的样式 */
}
```

### 3.5 常见断点（Breakpoints）

断点是指媒体查询中用于切换样式的特定宽度。以下是一些常用的断点：

#### Bootstrap 风格断点

```css
/* 超小设备（手机，小于 576px） */
/* 默认样式，不需要媒体查询 */

/* 小设备（手机横屏或小平板，576px 及以上） */
@media (min-width: 576px) { }

/* 中设备（平板，768px 及以上） */
@media (min-width: 768px) { }

/* 大设备（桌面，992px 及以上） */
@media (min-width: 992px) { }

/* 超大设备（大桌面，1200px 及以上） */
@media (min-width: 1200px) { }

/* 超超大设备（特大桌面，1400px 及以上） */
@media (min-width: 1400px) { }
```

#### 简化版断点

```css
/* 手机（小于 768px） */
/* 默认样式 */

/* 平板（768px - 1024px） */
@media (min-width: 768px) and (max-width: 1024px) { }

/* 桌面（1024px 及以上） */
@media (min-width: 1024px) { }
```

### 3.6 移动优先（Mobile First）

移动优先是一种设计策略，先为小屏幕设备设计，然后逐步为大屏幕添加样式。

**优点：**
- 专注核心内容和功能
- 性能更好（小屏幕加载更少的资源）
- 更好的用户体验

**示例：**

```css
/* 手机样式（默认） */
.container {
  padding: 10px;
  font-size: 14px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .container {
    padding: 20px;
    font-size: 16px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .container {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 3.7 桌面优先（Desktop First）

桌面优先是先为大屏幕设计，然后为小屏幕调整样式。

**示例：**

```css
/* 桌面样式（默认） */
.container {
  padding: 30px;
  font-size: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 平板及以下 */
@media (max-width: 1024px) {
  .container {
    padding: 20px;
  }
}

/* 手机及以下 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
    font-size: 14px;
  }
}
```

**移动优先 vs 桌面优先对比：**

| 策略 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 移动优先 | 专注核心内容，性能好 | 需要改变设计思维 | 大多数现代网站 |
| 桌面优先 | 设计更直观，实现简单 | 小屏幕可能加载不必要的资源 | 现有网站的响应式改造 |

---

## 四、弹性图片（Flexible Images）

### 4.1 基本方法

```css
img {
  max-width: 100%;
  height: auto;
}
```

**原理：**
- `max-width: 100%` 确保图片不会超出容器宽度
- `height: auto` 保持图片的原始宽高比

### 4.2 更完整的图片响应式方案

```css
img,
picture,
video,
canvas {
  max-width: 100%;
  height: auto;
  display: block; /* 移除图片底部的空白 */
}
```

### 4.3 响应式背景图片

```css
.hero {
  background-image: url('image.jpg');
  background-size: cover; /* 覆盖整个容器 */
  background-position: center;
  background-repeat: no-repeat;
}
```

**background-size 的值：**

| 值 | 说明 |
|------|------|
| cover | 缩放图片以完全覆盖容器，可能裁剪部分图片 |
| contain | 缩放图片以完全包含在容器内，可能留下空白 |
| 100% 100% | 拉伸图片填满容器，可能失真 |
| auto | 保持原始尺寸 |

### 4.4 使用 picture 元素

`<picture>` 元素允许为不同设备提供不同的图片。

```html
<picture>
  <!-- 超小屏幕使用小图 -->
  <source media="(max-width: 480px)" srcset="image-small.jpg">
  
  <!-- 中等屏幕使用中图 -->
  <source media="(max-width: 768px)" srcset="image-medium.jpg">
  
  <!-- 大屏幕使用大图 -->
  <source media="(min-width: 769px)" srcset="image-large.jpg">
  
  <!-- 不支持 picture 的浏览器使用这个 -->
  <img src="image-medium.jpg" alt="图片描述">
</picture>
```

### 4.5 使用 srcset 属性

`srcset` 属性允许为不同分辨率的屏幕提供不同的图片。

```html
<img 
  src="image-1x.jpg" 
  srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x" 
  alt="图片描述"
>
```

**说明：**
- `1x` 普通屏幕（96 DPI）
- `2x` 高清屏幕（Retina，192 DPI）
- `3x` 超高清屏幕（288 DPI）

---

## 五、CSS 相对单位

### 5.1 相对单位概述

| 单位 | 说明 | 基准 |
|------|------|------|
| em | 相对于父元素的字体大小 | 父元素字体大小 |
| rem | 相对于根元素（html）的字体大小 | 根元素字体大小 |
| vw | 相对于视口宽度的 1% | 视口宽度 |
| vh | 相对于视口高度的 1% | 视口高度 |
| vmin | 相对于视口较小边的 1% | min(vw, vh) |
| vmax | 相对于视口较大边的 1% | max(vw, vh) |
| % | 相对于父元素的宽度或高度 | 父元素尺寸 |

### 5.2 em vs rem

#### em

```css
.parent {
  font-size: 20px;
}

.child {
  font-size: 1.5em; /* 20px * 1.5 = 30px */
  padding: 2em; /* 30px * 2 = 60px（注意：padding 的 em 是相对于自身字体大小） */
}
```

**特点：**
- 相对于父元素的字体大小
- 可以创建嵌套的缩放关系
- 容易导致意外的大小变化

#### rem

```css
html {
  font-size: 16px; /* 根元素字体大小 */
}

.container {
  font-size: 1.5rem; /* 16px * 1.5 = 24px */
  padding: 2rem; /* 16px * 2 = 32px（始终相对于根元素） */
}
```

**特点：**
- 始终相对于根元素的字体大小
- 可预测，更易于管理
- 现代 CSS 布局的推荐选择

**推荐做法：**

```css
/* 设置根元素字体大小为 10px，方便计算 */
/* 1rem = 10px，1.6rem = 16px，2rem = 20px */
html {
  font-size: 62.5%; /* 16px * 62.5% = 10px */
}

body {
  font-size: 1.6rem; /* 16px */
}
```

### 5.3 视口单位（vw, vh, vmin, vmax）

```css
/* 宽度等于视口宽度的 50% */
width: 50vw;

/* 高度等于视口高度的 100% */
height: 100vh;

/* 宽度等于视口较小边的 50% */
width: 50vmin;

/* 宽度等于视口较大边的 50% */
width: 50vmax;
```

**常见用例：**

```css
/* 全屏容器 */
.fullscreen {
  width: 100vw;
  height: 100vh;
}

/* 响应式字体 */
h1 {
  font-size: 5vw; /* 随视口宽度变化 */
}

/* 等宽等高的容器 */
.square {
  width: 50vmin;
  height: 50vmin;
}
```

### 5.4 百分比（%）

```css
/* 宽度是父元素的 80% */
width: 80%;

/* 内边距是父元素宽度的 5% */
padding: 5%;
```

**注意：** 百分比的 `padding` 和 `margin` 是相对于父元素的**宽度**计算的，即使是上下边距也是如此。

### 5.5 使用 clamp() 函数

`clamp()` 是一个强大的 CSS 函数，可以设置值的范围。

```css
/* 字体大小在 14px 到 24px 之间，随视口宽度变化 */
font-size: clamp(14px, 4vw, 24px);

/* 宽度在 300px 到 800px 之间，随视口宽度变化 */
width: clamp(300px, 80vw, 800px);

/* 内边距在 10px 到 30px 之间 */
padding: clamp(10px, 3vw, 30px);
```

**语法：** `clamp(min, preferred, max)`

- `min`：最小值，不能小于这个值
- `preferred`：首选值，会尝试使用这个值
- `max`：最大值，不能大于这个值

**更多示例：**

```css
/* 响应式间距 */
.gap {
  gap: clamp(1rem, 2vw, 2rem);
}

/* 响应式标题 */
.title {
  font-size: clamp(1.5rem, 5vw, 3rem);
}

/* 响应式容器宽度 */
.container {
  width: clamp(300px, 90vw, 1200px);
  margin: 0 auto;
}
```

### 5.6 使用 min() 和 max() 函数

```css
/* 取较小值：宽度是 100% 和 800px 中的较小值 */
width: min(100%, 800px);

/* 取较大值：宽度是 50% 和 300px 中的较大值 */
width: max(50%, 300px);

/* 可以组合使用 */
font-size: max(1rem, min(5vw, 2rem));
```

---

## 六、弹性布局（Flexbox）在响应式设计中的应用

### 6.1 响应式导航栏

```css
.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* 小屏幕时垂直排列 */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    align-items: stretch;
  }
}
```

### 6.2 响应式卡片布局

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px; /* 最小宽度 300px，可缩放 */
}
```

### 6.3 响应式两列布局

```css
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.sidebar {
  flex: 1 1 200px;
}

.main {
  flex: 3 1 600px;
}
```

---

## 七、网格布局（Grid）在响应式设计中的应用

### 7.1 响应式网格

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

**说明：**
- `auto-fit`：自动创建尽可能多的列
- `minmax(200px, 1fr)`：每列最小 200px，最大占据剩余空间

### 7.2 响应式圣杯布局

```css
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
  grid-template-columns: 1fr;
  gap: 20px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .layout {
    grid-template-areas:
      "header header"
      "main sidebar"
      "footer footer";
    grid-template-columns: 1fr 200px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .layout {
    grid-template-areas:
      "header header header"
      "sidebar main rightbar"
      "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
  }
}

.header { grid-area: header; }
.main { grid-area: main; }
.sidebar { grid-area: sidebar; }
.rightbar { grid-area: rightbar; }
.footer { grid-area: footer; }
```

---

## 八、响应式字体（Responsive Typography）

### 8.1 基本方法

```css
/* 使用 rem 单位 */
html {
  font-size: 16px;
}

h1 {
  font-size: 2rem; /* 32px */
}

h2 {
  font-size: 1.5rem; /* 24px */
}

p {
  font-size: 1rem; /* 16px */
}
```

### 8.2 使用媒体查询调整字体大小

```css
html {
  font-size: 14px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  html {
    font-size: 15px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  html {
    font-size: 16px;
  }
}
```

### 8.3 使用 clamp() 的流体字体

```css
/* 字体大小随视口宽度平滑变化 */
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}

h2 {
  font-size: clamp(1.25rem, 4vw, 2.25rem);
}

p {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  line-height: clamp(1.4, 1.5em, 1.8);
}
```

### 8.4 流体排版系统

```css
/* 设置根元素字体大小，随视口变化 */
html {
  font-size: clamp(14px, 2vw, 18px);
}

/* 所有子元素使用 rem 单位 */
body {
  font-size: 1rem;
  line-height: 1.5;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  margin-bottom: 1rem;
}
```

---

## 九、响应式表格

表格在小屏幕上可能会出现横向滚动问题，以下是几种解决方案。

### 9.1 横向滚动容器

```css
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap; /* 防止内容换行 */
}
```

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>名称</th>
        <th>描述</th>
        <th>价格</th>
        <th>库存</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>产品 1</td>
        <td>这是产品 1 的描述</td>
        <td>¥99</td>
        <td>100</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 9.2 小屏幕上转换为卡片布局

```css
/* 桌面样式 */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

/* 小屏幕时隐藏表头 */
@media (max-width: 768px) {
  thead {
    display: none;
  }
  
  /* 将每个单元格转换为块级元素 */
  tr {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 10px;
  }
  
  td {
    display: block;
    text-align: right;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  
  /* 使用 data-label 属性显示列名 */
  td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-align: left;
  }
}
```

```html
<table>
  <thead>
    <tr>
      <th>名称</th>
      <th>描述</th>
      <th>价格</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="名称">产品 1</td>
      <td data-label="描述">这是产品 1 的描述</td>
      <td data-label="价格">¥99</td>
    </tr>
  </tbody>
</table>
```

---

## 十、响应式导航

### 10.1 汉堡菜单（Hamburger Menu）

```css
/* 导航容器 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

/* 桌面导航链接 */
.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

/* 汉堡按钮 */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background: #333;
  margin: 5px 0;
  transition: 0.3s;
}

/* 小屏幕时显示汉堡菜单 */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: white;
    padding: 1rem;
  }
  
  .nav-links.active {
    display: flex;
  }
}
```

```html
<nav class="navbar">
  <a href="#" class="logo">Logo</a>
  <button class="hamburger" onclick="toggleMenu()">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <ul class="nav-links">
    <li><a href="#">首页</a></li>
    <li><a href="#">产品</a></li>
    <li><a href="#">关于</a></li>
    <li><a href="#">联系</a></li>
  </ul>
</nav>

<script>
  function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
  }
</script>
```

---

## 十一、隐藏和显示内容

### 11.1 基于屏幕尺寸显示/隐藏

```css
/* 只在小屏幕显示 */
.mobile-only {
  display: block;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}

/* 只在大屏幕显示 */
.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
}
```

### 11.2 使用 visibility 和 opacity

```css
/* 隐藏但保留空间 */
.hidden-but-space {
  visibility: hidden;
}

/* 完全隐藏，不保留空间 */
.hidden {
  display: none;
}

/* 透明但可交互 */
.transparent {
  opacity: 0;
}
```

---

## 十二、测试响应式设计

### 12.1 使用浏览器开发者工具

现代浏览器都提供了响应式测试工具：

- **Chrome/Edge**: 按 `F12` 打开开发者工具，点击切换设备工具栏图标
- **Firefox**: 按 `F12` 打开开发者工具，点击响应式设计模式
- **Safari**: 启用开发菜单，选择"进入响应式设计模式"

### 12.2 测试要点

1. **不同屏幕尺寸**：手机（320px-480px）、平板（768px-1024px）、桌面（1024px+）
2. **不同方向**：竖屏和横屏
3. **不同浏览器**：Chrome、Firefox、Safari、Edge
4. **实际设备测试**：尽可能在真实设备上测试

### 12.3 常见问题检查

- [ ] 文字是否可读
- [ ] 按钮是否足够大（至少 44x44px）
- [ ] 图片是否正确缩放
- [ ] 布局是否正确
- [ ] 是否有水平滚动条
- [ ] 表单是否易用
- [ ] 导航是否清晰

---

## 十三、响应式设计最佳实践

### 13.1 设计原则

1. **移动优先**：先设计小屏幕，再扩展到大屏幕
2. **内容优先**：确保核心内容在所有设备上都可访问
3. **触摸友好**：确保交互元素足够大，易于点击
4. **性能优化**：为小屏幕提供更少的资源
5. **一致性**：在不同设备上保持一致的用户体验

### 13.2 技术建议

1. **使用 viewport meta 标签**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **使用相对单位**（rem, em, vw, vh, %）代替固定像素

3. **使用 Flexbox 和 Grid 布局**，它们天生就是响应式的

4. **使用媒体查询**，根据设备特性应用不同样式

5. **确保图片响应式**
   ```css
   img {
     max-width: 100%;
     height: auto;
   }
   ```

6. **使用 clamp() 函数**创建流畅的字体和间距
   ```css
   font-size: clamp(1rem, 2vw, 1.5rem);
   ```

7. **为触摸设备优化**
   - 按钮最小尺寸：44x44px
   - 最小点击区域：32x32px
   - 足够的间距

8. **测试、测试、再测试**，在不同设备和浏览器上测试

### 13.3 避免的常见错误

1. ❌ **固定宽度布局**：不要使用固定的像素宽度
2. ❌ **过小的文字**：在小屏幕上确保文字可读
3. ❌ **过小的按钮**：确保按钮足够大，易于点击
4. ❌ **过多的内容**：小屏幕上保持简洁
5. ❌ **忽略触摸设备**：确保交互元素触摸友好
6. ❌ **水平滚动**：避免出现不必要的水平滚动条

---

## 十四、响应式设计示例

### 14.1 完整的响应式页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>响应式设计示例</title>
  <style>
    /* 基础样式 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-size: 62.5%; /* 1rem = 10px */
    }

    body {
      font-size: 1.6rem;
      line-height: 1.5;
      color: #333;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* 容器 */
    .container {
      width: min(100% - 2rem, 1200px);
      margin-inline: auto;
    }

    /* 头部 */
    header {
      background: #333;
      color: white;
      padding: 1rem 0;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 2rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
    }

    /* 主要内容 */
    main {
      padding: 2rem 0;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .card {
      background: #f5f5f5;
      padding: 2rem;
      border-radius: 8px;
    }

    .card h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      margin-bottom: 1rem;
    }

    /* 响应式字体 */
    h1 {
      font-size: clamp(2.4rem, 5vw, 4rem);
      margin-bottom: 2rem;
    }

    p {
      font-size: clamp(1.4rem, 2vw, 1.6rem);
      margin-bottom: 1rem;
    }

    /* 底部 */
    footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 2rem 0;
      margin-top: 2rem;
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: #333;
        padding: 1rem;
      }

      .nav-links.active {
        display: flex;
      }

      .hamburger {
        display: block;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="container navbar">
      <a href="#" class="logo">Logo</a>
      <button class="hamburger" onclick="toggleMenu()">☰</button>
      <ul class="nav-links">
        <li><a href="#">首页</a></li>
        <li><a href="#">产品</a></li>
        <li><a href="#">关于</a></li>
        <li><a href="#">联系</a></li>
      </ul>
    </div>
  </header>

  <main>
    <div class="container">
      <h1>欢迎来到响应式设计示例</h1>
      
      <div class="grid">
        <div class="card">
          <h2>卡片 1</h2>
          <p>这是一个响应式卡片。调整浏览器窗口大小，查看它如何自动适应。</p>
        </div>
        <div class="card">
          <h2>卡片 2</h2>
          <p>使用 Grid 布局和 auto-fit 实现的响应式网格。</p>
        </div>
        <div class="card">
          <h2>卡片 3</h2>
          <p>使用 clamp() 函数实现的响应式字体大小。</p>
        </div>
        <div class="card">
          <h2>卡片 4</h2>
          <p>使用 min() 函数实现的响应式容器宽度。</p>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2024 响应式设计示例</p>
    </div>
  </footer>

  <script>
    function toggleMenu() {
      document.querySelector('.nav-links').classList.toggle('active');
    }
  </script>
</body>
</html>
```

---

## 十五、总结

响应式设计已经成为现代网页开发的标配。通过结合以下技术，你可以创建在任何设备上都能提供优秀体验的网站：

1. ✅ **viewport meta 标签** - 确保正确的初始缩放
2. ✅ **媒体查询** - 根据设备特性应用不同样式
3. ✅ **弹性图片** - 使用 `max-width: 100%` 和 `height: auto`
4. ✅ **相对单位** - 使用 rem、vw、vh 等相对单位
5. ✅ **Flexbox 和 Grid** - 现代布局技术，天生响应式
6. ✅ **clamp()、min()、max()** - 现代 CSS 函数，创建流畅的布局
7. ✅ **移动优先** - 先设计小屏幕，再扩展到大屏幕

记住：响应式设计的目标是在所有设备上提供一致且优秀的用户体验。
