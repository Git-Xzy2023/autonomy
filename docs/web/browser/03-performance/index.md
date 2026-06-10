---
title: 性能优化
---

# 浏览器性能优化详解

> 性能是用户体验的关键因素。本章深入探讨网页性能优化的各个方面，包括加载性能、渲染性能、运行时性能，以及性能测量和调试工具。

---

## 一、性能优化概述

### 1.1 为什么性能重要

**用户体验**：

| 加载时间 | 用户反应 |
|---------|---------|
| 0-1 秒 | 用户感觉流畅 |
| 1-3 秒 | 用户开始感到延迟 |
| 3-5 秒 | 用户可能放弃 |
| > 5 秒 | 大量用户流失 |

**业务影响**：

- ✅ **更高转化率**：Amazon 发现页面加载时间每减少 100ms，销售额增加 1%
- ✅ **更好 SEO**：Google 将页面速度作为搜索排名因素
- ✅ **更多留存**：更快的网站有更高的用户回访率
- ✅ **降低成本**：减少服务器负载和带宽消耗

### 1.2 核心性能指标（Core Web Vitals）⭐

Google 定义的三个核心指标，直接影响搜索排名。

| 指标 | 全称 | 目标 | 说明 |
|------|------|------|------|
| **LCP** | Largest Contentful Paint | < 2.5 秒 | 最大内容元素（图片、文字、视频等）出现在视口中的时间 |
| **FID** | First Input Delay | < 100 毫秒 | 用户首次交互（点击、输入）到浏览器响应的延迟 |
| **CLS** | Cumulative Layout Shift | < 0.1 | 页面布局意外移动的总量（如广告加载导致内容移位） |

**其他重要指标**：

| 指标 | 全称 | 目标 | 说明 |
|------|------|------|------|
| **TTFB** | Time To First Byte | < 600ms | 请求到收到第一个字节的时间 |
| **FCP** | First Contentful Paint | < 1.8 秒 | 第一个内容元素（文本、图片等）出现的时间 |
| **TTI** | Time To Interactive | < 5 秒 | 页面可交互的时间 |
| **SI** | Speed Index | < 3.4 秒 | 页面内容可见速度的指标 |

### 1.3 性能优化分类

```
性能优化
├─ 加载性能（Loading Performance）
│  ├─ 减少请求数量
│  ├─ 减少资源大小
│  ├─ 优化请求顺序
│  └─ 利用缓存
│
├─ 渲染性能（Rendering Performance）
│  ├─ 减少回流和重绘
│  ├─ 优化动画性能
│  ├─ 减少布局抖动
│  └─ 使用合成层
│
└─ 运行时性能（Runtime Performance）
   ├─ 优化 JavaScript 执行
   ├─ 内存管理
   ├─ 事件处理优化
   └─ 避免长时间任务
```

---

## 二、加载性能优化

### 2.1 资源压缩和优化

#### HTML 压缩

```html
<!-- 优化前 -->
<!DOCTYPE html>
<html>
  <head>
    <title>页面标题</title>
    <meta name="description" content="页面描述">
  </head>
  <body>
    <h1>标题</h1>
    <p>内容</p>
  </body>
</html>

<!-- 优化后（移除注释和空格） -->
<!DOCTYPE html><html><head><title>页面标题</title><meta name="description" content="页面描述"></head><body><h1>标题</h1><p>内容</p></body></html>
```

**工具**：html-minifier、html-webpack-plugin

#### CSS 压缩

```css
/* 优化前 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 优化后 */
.container{width:100%;max-width:1200px;margin:0 auto;padding:20px}
```

**工具**：cssnano、clean-css、PurgeCSS（移除未使用的 CSS）

#### JavaScript 压缩和混淆

```javascript
// 优化前
function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i];
  }
  return sum;
}

// 优化后（压缩、变量重命名）
function n(n){let r=0;for(let t=0;t<n.length;t++)r+=n[t];return r}
```

**工具**：Terser、UglifyJS、Webpack/Vite 内置

#### 图片优化

**格式选择**：

| 格式 | 适用场景 | 特点 |
|------|---------|------|
| **JPEG** | 照片、复杂图像 | 有损压缩，体积小，不支持透明 |
| **PNG** | 图标、需要透明的图像 | 无损压缩，支持透明，体积较大 |
| **WebP** | 现代浏览器（推荐） | 同时支持有损/无损，体积比 JPEG/PNG 小 25-35% |
| **AVIF** | 最新格式（逐步支持） | 比 WebP 更小，压缩率更高 |
| **SVG** | 矢量图形、图标 | 可缩放，体积小，可直接嵌入 HTML |

**优化方法**：

```bash
# 使用工具压缩图片
# 1. 使用 squoosh（在线工具）
# https://squoosh.app

# 2. 使用命令行工具
# imagemin
npx imagemin images/* --out-dir=dist/images

# 3. 使用 sharp（Node.js）
# npm install sharp

# 4. 使用 CDN 自动优化
# https://image.example.com/pic.jpg?w=800&q=75&fmt=webp
```

**响应式图片**：

```html
<!-- 使用 srcset 和 sizes -->
<img
  srcset="
    image-320w.jpg 320w,
    image-640w.jpg 640w,
    image-1280w.jpg 1280w
  "
  sizes="(max-width: 600px) 480px, 800px"
  src="image-800w.jpg"
  alt="响应式图片"
>

<!-- 使用 picture 元素 -->
<picture>
  <!-- 优先使用 AVIF -->
  <source
    type="image/avif"
    srcset="image.avif 1x, image@2x.avif 2x"
  >
  <!-- 然后使用 WebP -->
  <source
    type="image/webp"
    srcset="image.webp 1x, image@2x.webp 2x"
  >
  <!-- 最后使用 JPEG 作为 fallback -->
  <img
    src="image.jpg"
    srcset="image.jpg 1x, image@2x.jpg 2x"
    alt="图片描述"
    loading="lazy"
    width="800"
    height="600"
  >
</picture>
```

**延迟加载图片**：

```html
<!-- 原生 lazy loading（现代浏览器支持） -->
<img src="image.jpg" loading="lazy" alt="图片">
<iframe src="video.html" loading="lazy"></iframe>

<!-- 使用 Intersection Observer -->
<img data-src="image.jpg" class="lazy" alt="图片">

<script>
const lazyImages = document.querySelectorAll('img.lazy');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});
lazyImages.forEach(img => observer.observe(img));
</script>
```

### 2.2 减少 HTTP 请求

#### 合并文件

```javascript
// 优化前：多个小文件
// a.js + b.js + c.js → 3 个请求

// 优化后：合并为一个文件
// bundle.js → 1 个请求
// 使用 Webpack、Vite、Rollup 等打包工具
```

> ⚠️ **注意**：不要过度合并，保持合理的文件大小以便缓存和并行加载。使用代码分割（code splitting）按需加载。

#### 使用雪碧图（CSS Sprites）

```css
/* 多个图标合并到一张图片，通过 background-position 显示 */
.icon {
  background-image: url('sprite.png');
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
}

.icon-home {
  background-position: 0 0;
}

.icon-user {
  background-position: -24px 0;
}

.icon-settings {
  background-position: -48px 0;
}
```

> 💡 **现代替代**：使用 SVG 图标或字体图标（如 Iconify、Font Awesome）

#### 使用 Data URI（内联小资源）

```css
/* 将小图片直接嵌入 CSS，减少请求 */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgo...');
}

/* SVG 可以直接内联到 HTML */
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>
```

> ⚠️ **注意**：仅适用于非常小的资源（通常 < 4KB），因为 Base64 编码会使文件大小增加约 33%，且无法缓存。

### 2.3 优化资源加载顺序

#### 关键 CSS 内联

```html
<!-- 将首屏需要的 CSS 直接内联到 <head> -->
<head>
  <style>
    /* 关键 CSS：首屏样式 */
    body { margin: 0; font-family: sans-serif; }
    .hero { background: #f0f0f0; padding: 40px; }
    .hero h1 { font-size: 32px; margin: 0; }
    .nav { display: flex; justify-content: space-between; }
  </style>
  
  <!-- 非关键 CSS 异步加载 -->
  <link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

#### 使用 preload 预加载关键资源

```html
<!-- 预加载字体 -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预加载图片 -->
<link rel="preload" href="hero-image.jpg" as="image">

<!-- 预加载 CSS -->
<link rel="preload" href="critical.css" as="style">

<!-- 预加载 JavaScript -->
<link rel="preload" href="main.js" as="script">

<!-- 预加载视频 -->
<link rel="preload" href="video.mp4" as="video" type="video/mp4">
```

#### 使用 prefetch 预获取资源

```html
<!-- 预获取下一个页面可能需要的资源 -->
<link rel="prefetch" href="/page2.js">
<link rel="prefetch" href="/page2-styles.css">

<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//api.example.com">

<!-- 预连接（建立 TCP 和 TLS 连接） -->
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### 延迟加载 JavaScript

```html
<!-- defer：并行下载，HTML 解析完成后按顺序执行 -->
<script src="main.js" defer></script>

<!-- async：并行下载，下载完成后立即执行（不保证顺序） -->
<script src="analytics.js" async></script>

<!-- module：自动延迟执行（ES 模块） -->
<script type="module" src="app.js"></script>

<!-- 普通 script：阻塞 HTML 解析，下载并执行完成后继续 -->
<script src="legacy.js"></script>
```

**执行时机对比**：

```
HTML 解析开始
│
├─ <script src="a.js"> ← 阻塞解析，下载执行后继续
│
├─ <script src="b.js" defer> ← 并行下载，HTML 解析完后按顺序执行
│
├─ <script src="c.js" async> ← 并行下载，下载完立即执行（可能打断解析）
│
HTML 解析完成
│
├─ 执行 defer 脚本（按出现顺序）
│
└─ DOMContentLoaded 事件
```

### 2.4 代码分割（Code Splitting）⭐

**按路由分割**（单页应用 SPA）：

```javascript
// 传统方式：一次性加载所有代码
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// 优化：按需加载
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Router>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Router>
    </Suspense>
  );
}
```

**按组件分割**：

```javascript
// 大的组件按需加载
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>显示图表</button>
      {showChart && (
        <Suspense fallback={<div>图表加载中...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

**按功能分割**：

```javascript
// 支付功能只有在需要时才加载
async function handlePayment() {
  // 动态导入支付模块
  const { processPayment } = await import('./utils/payment');
  await processPayment();
}

// 打印功能按需加载
async function handlePrint() {
  const { printDocument } = await import('./utils/print');
  await printDocument();
}
```

**Webpack 配置**：

```javascript
// webpack.config.js
module.exports = {
  output: {
    // 代码分割后的文件名
    chunkFilename: '[name].[contenthash].js'
  },
  optimization: {
    splitChunks: {
      // 自动分割公共代码
      chunks: 'all',
      
      // 提取第三方库到单独的 chunk
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        // 提取常用工具库
        utils: {
          test: /[\\/]src[\\/]utils[\\/]/,
          name: 'utils',
          chunks: 'all',
          minChunks: 2
        }
      }
    },
    // 提取 runtime 代码
    runtimeChunk: 'single'
  }
};
```

### 2.5 利用浏览器缓存

**静态资源使用内容哈希命名**：

```
app.abc123.js         // contenthash，内容变化时文件名变化
styles.def456.css     // 不同的内容哈希
hero-image.ghi789.jpg

// 配置长期缓存
Cache-Control: public, max-age=31536000, immutable
```

**HTML 使用短缓存或不缓存**：

```
index.html
Cache-Control: no-cache
```

**Webpack/Vite 配置**：

```javascript
// webpack.config.js
output: {
  filename: '[name].[contenthash].js',  // 内容哈希
  chunkFilename: '[name].[contenthash].js',
  clean: true  // 清理旧文件
}

// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
}
```

### 2.6 使用 CDN（内容分发网络）

**CDN 的优势**：

- ✅ **减少延迟**：从最近的节点提供内容
- ✅ **减少源站负载**：CDN 缓存请求
- ✅ **提高可用性**：分布式架构，单点故障影响小
- ✅ **自动压缩**：Gzip/Brotli 压缩
- ✅ **HTTP/2 支持**：多路复用，更快的并行加载

**资源引用方式**：

```html
<!-- 自己的静态资源 -->
<script src="https://cdn.example.com/assets/app.abc123.js"></script>

<!-- 第三方库（公共 CDN） -->
<script src="https://cdn.jsdelivr.net/npm/vue@3.3.0/dist/vue.global.js"></script>
<script src="https://unpkg.com/lodash@4.17.21/lodash.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

### 2.7 启用压缩（Gzip/Brotli）

```
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1024;
gzip_comp_level 6;

# Brotli（比 Gzip 压缩率更高）
brotli on;
brotli_types text/plain text/css application/json application/javascript;
brotli_comp_level 6;
```

**效果对比**：

| 资源 | 原始大小 | Gzip | Brotli |
|------|---------|------|--------|
| app.js | 1.2 MB | 350 KB | 280 KB |
| styles.css | 200 KB | 40 KB | 32 KB |
| data.json | 500 KB | 120 KB | 90 KB |

### 2.8 使用 HTTP/2 和 HTTP/3

**HTTP/2 优势**：

- ✅ **多路复用**：一个连接并行多个请求
- ✅ **头部压缩**：减少请求开销
- ✅ **服务器推送**：主动推送资源给客户端
- ✅ **二进制协议**：更高效的解析

**HTTP/3 优势**（基于 QUIC）：

- ✅ 更快的连接建立（0-RTT）
- ✅ 避免队头阻塞
- ✅ 更好的连接迁移（移动端网络切换）

---

## 三、渲染性能优化

### 3.1 理解渲染流水线

```
JavaScript → Style → Layout → Paint → Composite
```

- **JavaScript**：计算、操作 DOM、动画
- **Style**：计算元素样式（选择器匹配）
- **Layout**：计算元素位置和大小（回流）
- **Paint**：绘制像素到图层（重绘）
- **Composite**：合成图层到屏幕

**性能影响程度**：Composite < Paint < Layout

### 3.2 避免布局抖动（Layout Thrashing）

```javascript
// ❌ 不好：读写交替，每次读取都强制重新计算布局
const elements = document.querySelectorAll('.box');
for (let i = 0; i < elements.length; i++) {
  // 读取（强制同步布局）
  const width = elements[i].offsetWidth;
  
  // 写入
  elements[i].style.width = (width + 10) + 'px';
}
// 每次迭代都触发一次布局计算，很慢！

// ✅ 好：先批量读取，再批量写入
const elements = document.querySelectorAll('.box');
const widths = [];

// 读取阶段
for (let i = 0; i < elements.length; i++) {
  widths.push(elements[i].offsetWidth);
}

// 写入阶段
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = (widths[i] + 10) + 'px';
}
// 只触发一次布局计算！

// ✅ 更好：使用 requestAnimationFrame
function updateWidths() {
  const elements = document.querySelectorAll('.box');
  const widths = Array.from(elements).map(el => el.offsetWidth);
  
  requestAnimationFrame(() => {
    elements.forEach((el, i) => {
      el.style.width = (widths[i] + 10) + 'px';
    });
  });
}
```

**会触发同步布局的属性**（读取时要注意）：

```
offsetTop, offsetLeft, offsetWidth, offsetHeight
scrollTop, scrollLeft, scrollWidth, scrollHeight
clientTop, clientLeft, clientWidth, clientHeight
getComputedStyle()
getBoundingClientRect()
focus(), blur()
innerWidth, innerHeight
```

### 3.3 减少回流和重绘

#### 使用 transform 和 opacity 做动画 ✅

```css
/* ❌ 不好：触发回流和重绘 */
.box {
  position: relative;
  left: 0;
  transition: left 0.3s;
}
.box:hover {
  left: 100px;  /* 每次移动都重新布局 */
}

/* ✅ 好：只触发合成，GPU 加速 */
.box {
  transform: translateX(0);
  transition: transform 0.3s;
}
.box:hover {
  transform: translateX(100px);  /* GPU 处理，不会触发布局/绘制 */
}

/* ✅ opacity 也是安全的 */
.fade {
  opacity: 1;
  transition: opacity 0.3s;
}
.fade.hidden {
  opacity: 0;
}
```

#### 避免使用会触发布局的 CSS

```css
/* ❌ 动画这些属性性能差 */
width, height
top, right, bottom, left
margin, padding
border-width
font-size
line-height
position
display

/* ✅ 优先使用这些属性 */
transform: translate(), scale(), rotate()
opacity
filter: blur(), brightness()  /* 注意：filter 可能需要重绘 */
```

#### 使用 will-change 提升性能

```css
/* 告诉浏览器这个元素即将变化，提前准备 */
.animated {
  will-change: transform, opacity;
}

/* 但不要滥用，只在动画期间使用 */
.element {
  will-change: transform;
}

/* 动画结束后移除 */
.element.finished {
  will-change: auto;
}
```

#### 提升到独立的合成层

```css
/* 使用 transform: translateZ(0) 或 will-change 提升 */
.card {
  transform: translateZ(0);  /* 简单的 3D 变换会创建新层 */
  /* 或 */
  will-change: transform;
}

/* 注意事项：
   1. 每个图层都需要内存，不要过度使用
   2. 通常用于动画元素
   3. 图片（img）通常已经在自己的层
*/
```

### 3.4 优化 DOM 操作

```javascript
// ❌ 不好：多次 DOM 操作
const parent = document.getElementById('list');
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = '项目 ' + i;
  parent.appendChild(li);  // 每次都可能触发布局
}

// ✅ 好：使用 DocumentFragment
const parent = document.getElementById('list');
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = '项目 ' + i;
  fragment.appendChild(li);
}

parent.appendChild(fragment);  // 只操作一次 DOM

// ✅ 好：使用 innerHTML（注意 XSS 风险）
const parent = document.getElementById('list');
let html = '';
for (let i = 0; i < 100; i++) {
  html += '<li>项目 ' + i + '</li>';
}
parent.innerHTML = html;

// ✅ 好：先隐藏元素，修改后再显示
const element = document.getElementById('content');
element.style.display = 'none';
// 多次修改 DOM...
element.style.display = '';

// ✅ 好：克隆节点，修改后替换
const original = document.getElementById('content');
const clone = original.cloneNode(true);
// 修改 clone...
original.parentNode.replaceChild(clone, original);
```

### 3.5 优化 CSS 选择器

```css
/* ❌ 不好：嵌套太深，浏览器从右向左匹配慢 */
body div.container ul.nav li.active a span {
  color: red;
}

/* ✅ 好：使用具体的类名 */
.nav-link-active {
  color: red;
}

/* ❌ 不好：通配符选择器 */
* {
  box-sizing: border-box;
}

/* ✅ 好：明确指定需要的元素 */
html, body, div, span, /* 其他需要的元素 */ {
  box-sizing: border-box;
}

/* ❌ 不好：属性选择器（性能较差） */
input[type="text"] {
  border: 1px solid #ccc;
}

/* ✅ 好：使用类名 */
.input-text {
  border: 1px solid #ccc;
}
```

> 💡 **CSS 选择器匹配方向**：浏览器从右向左匹配选择器，所以最右边的选择器（关键字）最关键。`.container .nav a` 会先找所有 `<a>` 元素，再向上检查祖先。

### 3.6 优化动画性能

#### 使用 CSS 动画而非 JavaScript 动画

```css
/* ✅ CSS 动画（GPU 加速，性能更好） */
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

/* ❌ JavaScript 动画（性能较差，除非使用 requestAnimationFrame） */
element.style.left = position + 'px';
```

#### 使用 requestAnimationFrame 做 JS 动画

```javascript
// ❌ 不好：使用 setTimeout 或 setInterval（可能掉帧）
let position = 0;
setInterval(() => {
  position += 10;
  element.style.left = position + 'px';
}, 16);  // 试图 60fps，但不准确

// ✅ 好：使用 requestAnimationFrame
let position = 0;
function animate() {
  position += 10;
  element.style.transform = `translateX(${position}px)`;
  
  if (position < 500) {
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);

// ✅ 更好：使用 Web Animations API
element.animate([
  { transform: 'translateX(0)' },
  { transform: 'translateX(500px)' }
], {
  duration: 1000,
  easing: 'ease-out',
  fill: 'forwards'
});
```

#### 避免在滚动事件中做耗时操作

```javascript
// ❌ 不好：每次滚动都执行
window.addEventListener('scroll', () => {
  // 复杂计算或 DOM 操作
  updateLayout();  // 60 次/秒，可能掉帧
});

// ✅ 好：使用 requestAnimationFrame 节流
let ticking = false;
function update() {
  // 更新操作
  updateLayout();
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(update);
    ticking = true;
  }
});

// ✅ 好：使用防抖/节流（lodash）
import { debounce, throttle } from 'lodash-es';

// 防抖：事件停止 n 毫秒后执行一次
const debouncedUpdate = debounce(() => {
  updateLayout();
}, 200);

// 节流：n 毫秒内最多执行一次
const throttledUpdate = throttle(() => {
  updateLayout();
}, 100);

window.addEventListener('scroll', throttledUpdate);
```

#### 页面不可见时暂停动画

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // 暂停动画、定时器等
    cancelAnimationFrame(animationId);
    clearInterval(intervalId);
  } else {
    // 恢复动画
    requestAnimationFrame(animate);
  }
});
```

---

## 四、JavaScript 运行时性能优化

### 4.1 避免长时间运行的任务

```javascript
// ❌ 不好：长时间任务阻塞主线程（> 50ms）
function processLargeArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 耗时操作
    heavyComputation(arr[i]);
  }
}

// ✅ 好：使用 setTimeout 分割任务
function processLargeArray(arr) {
  let i = 0;
  const batchSize = 1000;
  
  function processBatch() {
    const end = Math.min(i + batchSize, arr.length);
    for (; i < end; i++) {
      heavyComputation(arr[i]);
    }
    
    if (i < arr.length) {
      setTimeout(processBatch, 0);  // 让浏览器有时间处理其他任务
    }
  }
  
  processBatch();
}

// ✅ 更好：使用 requestIdleCallback
function processLargeArray(arr) {
  let i = 0;
  const batchSize = 1000;
  
  function processBatch(deadline) {
    while (i < arr.length && deadline.timeRemaining() > 0) {
      heavyComputation(arr[i]);
      i++;
    }
    
    if (i < arr.length) {
      requestIdleCallback(processBatch);
    }
  }
  
  requestIdleCallback(processBatch);
}

// ✅ 最好：使用 Web Worker（在后台线程处理）
// main.js
const worker = new Worker('worker.js');
worker.postMessage(largeArray);
worker.onmessage = (event) => {
  console.log('处理完成:', event.data);
};

// worker.js
self.onmessage = (event) => {
  const result = processLargeArray(event.data);
  self.postMessage(result);
};
```

### 4.2 优化循环性能

```javascript
// ❌ 不好：每次循环都计算 length
for (let i = 0; i < arr.length; i++) {
  // ...
}

// ✅ 好：缓存 length
const length = arr.length;
for (let i = 0; i < length; i++) {
  // ...
}

// ✅ 好：倒序循环
for (let i = arr.length - 1; i >= 0; i--) {
  // ...
}

// ✅ 好：使用 forEach（可读性好，性能略低）
arr.forEach(item => {
  // ...
});

// ✅ 好：使用 for...of（现代语法）
for (const item of arr) {
  // ...
}

// ❌ 避免在循环中创建函数
// 不好：每次迭代创建新函数
for (let i = 0; i < 1000; i++) {
  const fn = () => i * 2;
  fn();
}

// 好：在循环外定义函数
function double(i) { return i * 2; }
for (let i = 0; i < 1000; i++) {
  double(i);
}
```

### 4.3 优化对象和数组操作

```javascript
// ❌ 不好：使用 delete 删除属性（会影响 V8 优化）
const user = { name: '张三', age: 25 };
delete user.age;

// ✅ 好：设置为 undefined，或使用 Map
const user = { name: '张三', age: 25 };
user.age = undefined;

// 或使用 Map
const user = new Map();
user.set('name', '张三');
user.set('age', 25);
user.delete('age');

// ❌ 避免 arguments 对象（优化困难）
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// ✅ 使用剩余参数
function sum(...args) {
  let total = 0;
  for (let i = 0; i < args.length; i++) {
    total += args[i];
  }
  return total;
}

// ✅ 数组操作优化
const items = [1, 2, 3, 4, 5];

// 避免：每次循环创建新数组
const doubled = items.map(x => x * 2);
const filtered = doubled.filter(x => x > 5);

// 可以：链式调用
const result = items
  .map(x => x * 2)
  .filter(x => x > 5);

// 大数组时：使用 for 循环手动处理
const result2 = [];
for (let i = 0; i < items.length; i++) {
  const doubled = items[i] * 2;
  if (doubled > 5) {
    result2.push(doubled);
  }
}
```

### 4.4 内存管理

#### 避免内存泄漏

```javascript
// ❌ 事件监听器未移除
function addListener() {
  const element = document.getElementById('button');
  element.addEventListener('click', () => {
    console.log('clicked');
  });
}
// 每次调用都添加新监听器，元素被移除后监听器仍在

// ✅ 保存引用，适时移除
let clickHandler;
function addListener() {
  const element = document.getElementById('button');
  clickHandler = () => console.log('clicked');
  element.addEventListener('click', clickHandler);
}

function removeListener() {
  const element = document.getElementById('button');
  element.removeEventListener('click', clickHandler);
}

// ❌ 定时器未清理
const intervalId = setInterval(() => {
  // 即使组件卸载，仍在运行
}, 1000);

// ✅ 保存并清理
const intervalId = setInterval(() => {}, 1000);
// 组件卸载时
clearInterval(intervalId);

// ❌ 闭包引用大对象
function createHandler() {
  const hugeData = fetchHugeData();  // 大量数据
  
  return function handler() {
    console.log('处理完成');  // 不使用 hugeData，但仍被闭包保留
  };
}

// ✅ 只保留需要的数据
function createHandler() {
  fetchHugeData();  // 处理完就释放
  
  return function handler() {
    console.log('处理完成');
  };
}

// ❌ 全局变量（永远不会被垃圾回收）
window.cache = {};
// 组件中不断添加数据，不清理

// ✅ 使用 WeakMap/WeakSet（键被垃圾回收后自动清理）
const cache = new WeakMap();
const element = document.getElementById('element');
cache.set(element, { data: '缓存数据' });
// element 被移除后，缓存自动清理
```

#### 使用 WeakMap 和 WeakSet

```javascript
// WeakMap：键必须是对象，键被垃圾回收后项自动移除
const cache = new WeakMap();

function processData(element, data) {
  if (!cache.has(element)) {
    cache.set(element, computeExpensiveData(data));
  }
  return cache.get(element);
}
// 当 element 被移除时，缓存自动清理

// WeakSet：只能存储对象，对象被回收后项自动移除
const processedElements = new WeakSet();

function processElement(element) {
  if (processedElements.has(element)) {
    return;  // 已处理过
  }
  processedElements.add(element);
  // 处理 element
}
```

### 4.5 防抖和节流

```javascript
// 防抖（Debounce）：事件停止 n 毫秒后执行一次
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 搜索框：用户停止输入 300ms 后搜索
const search = debounce((query) => {
  fetchResults(query);
}, 300);

input.addEventListener('input', (e) => {
  search(e.target.value);
});

// 节流（Throttle）：n 毫秒内最多执行一次
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 滚动事件：每 100ms 最多执行一次
const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);

window.addEventListener('scroll', handleScroll);
```

---

## 五、移动端性能优化

### 5.1 触摸事件优化

```javascript
// ❌ 不好：使用 touchstart + click 可能导致双重触发
element.addEventListener('touchstart', handleTouch);
element.addEventListener('click', handleClick);

// ✅ 好：禁用双击缩放，减少点击延迟
<meta name="viewport" content="width=device-width, initial-scale=1.0">

// ✅ 使用 passive 事件监听器
document.addEventListener('touchstart', handler, { passive: true });
// passive: true 告诉浏览器事件处理不会调用 preventDefault()
// 浏览器可以并行滚动，提升滚动性能

// ✅ 移除 300ms 点击延迟（现代浏览器已优化，但仍需注意）
// 方法 1：在 CSS 中设置
html {
  touch-action: manipulation;
}

// 方法 2：使用 FastClick（较老的浏览器）
import FastClick from 'fastclick';
FastClick.attach(document.body);
```

### 5.2 限制重绘区域

```css
/* 限制重绘区域，减少绘制成本 */
.element {
  /* 避免整页重绘 */
  contain: paint;
}

/* 优化滚动性能 */
.scroll-container {
  -webkit-overflow-scrolling: touch;  /* 平滑滚动 */
  overflow-scrolling: touch;
}

/* 减少阴影和渐变的使用（在低端设备上） */
@media (max-width: 768px) {
  .card {
    box-shadow: none;  /* 或使用更简单的阴影 */
  }
}
```

### 5.3 图片优化（移动端）

```html
<!-- 使用响应式图片，根据屏幕大小加载合适的尺寸 -->
<img
  srcset="
    image-480w.jpg 480w,
    image-800w.jpg 800w,
    image-1200w.jpg 1200w
  "
  sizes="(max-width: 600px) 480px, 800px"
  src="image-800w.jpg"
  alt="图片描述"
  loading="lazy"
  decoding="async"
>

<!-- 使用 picture 元素提供不同格式 -->
<picture>
  <source 
    media="(max-width: 768px)" 
    srcset="small-image.webp" 
    type="image/webp"
  >
  <source 
    media="(max-width: 768px)" 
    srcset="small-image.jpg"
  >
  <source srcset="large-image.webp" type="image/webp">
  <img src="large-image.jpg" alt="图片描述" loading="lazy">
</picture>
```

### 5.4 避免重计算

```javascript
// ❌ 不好：在滚动中进行复杂计算
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const elements = document.querySelectorAll('.parallax');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();  // 每次都计算
    el.style.transform = `translateY(${scrollY * 0.5}px)`;
  });
});

// ✅ 好：缓存计算结果
const elements = document.querySelectorAll('.parallax');
const elementsData = Array.from(elements).map(el => ({
  element: el,
  initialTop: el.offsetTop  // 缓存初始位置
}));

const updateParallax = throttle(() => {
  const scrollY = window.scrollY;
  elementsData.forEach(data => {
    data.element.style.transform = `translateY(${scrollY * 0.5}px)`;
  });
}, 16);

window.addEventListener('scroll', updateParallax);
```

---

## 六、性能测量和监控

### 6.1 浏览器开发者工具

**Chrome DevTools**（F12 打开）：

| 面板 | 用途 |
|------|------|
| **Performance** | 性能分析，查看渲染、脚本执行、布局等耗时 |
| **Network** | 网络请求分析，查看加载时间、请求大小、瀑布图 |
| **Memory** | 内存分析，检测内存泄漏 |
| **Lighthouse** | 综合性能审计，给出优化建议 |
| **Coverage** | 代码覆盖率，查找未使用的 CSS/JS |

**使用 Performance 面板**：

```
1. 打开 DevTools → Performance
2. 点击录制按钮（●）
3. 操作页面（滚动、点击等）
4. 点击停止
5. 分析结果：
   - FPS（帧率）：绿色柱状图，稳定在 60 最佳
   - CPU：查看主线程是否繁忙
   - NETWORK：资源加载时间
   - MAIN：主线程活动，查找长时间任务
   - Layout/Style/Paint：查看渲染耗时
```

**使用 Lighthouse**：

```
1. 打开 DevTools → Lighthouse
2. 选择要测试的类别（Performance, Accessibility, Best Practices, SEO）
3. 点击"生成报告"
4. 查看各项得分和具体建议
5. 点击"查看详情"了解具体问题
```

### 6.2 关键指标测量

```javascript
// 测量 LCP（Largest Contentful Paint）
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.startTime);
});
observer.observe({ type: 'largest-contentful-paint', buffered: true });

// 测量 FID（First Input Delay）
const fidObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime);
  });
});
fidObserver.observe({ type: 'first-input', buffered: true });

// 测量 CLS（Cumulative Layout Shift）
let cls = 0;
const clsObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  }
  console.log('CLS:', cls);
});
clsObserver.observe({ type: 'layout-shift', buffered: true });

// 测量 FCP（First Contentful Paint）
const fcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntriesByName('first-contentful-paint');
  if (entries.length > 0) {
    console.log('FCP:', entries[0].startTime);
  }
});
fcpObserver.observe({ type: 'paint', buffered: true });

// 使用 Web Vitals 库（推荐）
// npm install web-vitals
import { onLCP, onFID, onCLS, onFCP, onTTFB } from 'web-vitals';

onLCP(metric => console.log('LCP:', metric.value));
onFID(metric => console.log('FID:', metric.value));
onCLS(metric => console.log('CLS:', metric.value));
onFCP(metric => console.log('FCP:', metric.value));
onTTFB(metric => console.log('TTFB:', metric.value));
```

### 6.3 网络性能分析

```javascript
// 获取资源加载时间
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log('资源:', resource.name);
  console.log('DNS 查询:', resource.domainLookupEnd - resource.domainLookupStart);
  console.log('TCP 连接:', resource.connectEnd - resource.connectStart);
  console.log('请求/响应:', resource.responseEnd - resource.requestStart);
  console.log('总耗时:', resource.duration);
  console.log('文件大小:', resource.transferSize);
});

// 获取导航时间
const navigation = performance.getEntriesByType('navigation')[0];
console.log('DNS 查询时间:', navigation.domainLookupEnd - navigation.domainLookupStart);
console.log('TCP 连接时间:', navigation.connectEnd - navigation.connectStart);
console.log('TTFB:', navigation.responseStart - navigation.requestStart);
console.log('内容下载:', navigation.responseEnd - navigation.responseStart);
console.log('DOM 解析:', navigation.domContentLoadedEventEnd - navigation.domInteractive);
console.log('总加载时间:', navigation.loadEventEnd - navigation.startTime);

// 自定义计时标记
performance.mark('start-task');
// 执行任务
performance.mark('end-task');
performance.measure('task-duration', 'start-task', 'end-task');

const measure = performance.getEntriesByName('task-duration')[0];
console.log('任务耗时:', measure.duration);

// 清理标记
performance.clearMarks();
performance.clearMeasures();
```

### 6.4 性能监控（RUM - Real User Monitoring）

```javascript
// 发送性能数据到服务器
function sendMetrics(metrics) {
  const data = {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    metrics
  };
  
  // 使用 sendBeacon（页面卸载时也能发送）
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify(data));
  } else {
    // 回退到 fetch
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true
    });
  }
}

// 监听性能指标
import { onLCP, onFID, onCLS } from 'web-vitals';

const metrics = {};

onLCP(metric => {
  metrics.lcp = metric.value;
  checkAllMetrics();
});

onFID(metric => {
  metrics.fid = metric.value;
  checkAllMetrics();
});

onCLS(metric => {
  metrics.cls = metric.value;
  checkAllMetrics();
});

function checkAllMetrics() {
  if (metrics.lcp && metrics.fid !== undefined && metrics.cls !== undefined) {
    sendMetrics(metrics);
  }
}

// 监听 JavaScript 错误
window.addEventListener('error', (event) => {
  sendMetrics({
    type: 'error',
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  sendMetrics({
    type: 'promise-error',
    reason: event.reason?.message || event.reason
  });
});
```

---

## 七、构建优化

### 7.1 生产构建优化

**Webpack/Vite 生产模式**：

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',  // 自动启用多种优化
  
  optimization: {
    minimize: true,    // 启用代码压缩
    minimizer: [
      new TerserPlugin({  // JavaScript 压缩
        terserOptions: {
          compress: {
            drop_console: true,  // 移除 console.log
            drop_debugger: true   // 移除 debugger
          }
        }
      }),
      new CssMinimizerPlugin()  // CSS 压缩
    ],
    
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        }
      }
    },
    
    runtimeChunk: 'single'
  }
};

// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  
  build: {
    target: 'es2018',        // 目标浏览器版本
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,        // 生产环境不生成 sourcemap
    cssCodeSplit: true,      // CSS 代码分割
    minify: 'esbuild',       // 使用 esbuild 压缩
    
    rollupOptions: {
      output: {
        manualChunks: {
          // 手动分割第三方库
          vue: ['vue', 'vue-router', 'pinia'],
          utils: ['lodash-es', 'date-fns']
        }
      }
    }
  }
});
```

### 7.2 移除未使用的代码（Tree Shaking）

```javascript
// ✅ 使用 ES 模块语法（import/export），而不是 CommonJS（require）
export function func1() { /* ... */ }
export function func2() { /* ... */ }

// ✅ 导入时只导入需要的部分
import { func1 } from './utils';

// ❌ 避免导入整个模块
import * as utils from './utils';  // 所有函数都会被包含

// ✅ 从库中按需导入
import { debounce } from 'lodash-es';        // 只包含 debounce
// ❌ 避免
import _ from 'lodash';                      // 包含所有函数

// ✅ sideEffects 标记
// package.json 中声明哪些文件有副作用
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfill.js"
  ]
}
// 或
{
  "sideEffects": false  // 所有文件都可以安全地 tree-shaking
}
```

### 7.3 使用分析工具

**Webpack Bundle Analyzer**：

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()  // 可视化 bundle 大小
  ]
};

// 或命令行
npx webpack --profile --json > stats.json
npx webpack-bundle-analyzer stats.json
```

**Vite 可视化**：

```javascript
// vite.config.js
import visualizer from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
};
```

### 7.4 预加载和预构建

**使用 Import Maps**：

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://cdn.jsdelivr.net/npm/vue@3.3.0/dist/vue.esm-browser.prod.js",
    "lodash-es": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm"
  }
}
</script>

<script type="module">
import { ref } from 'vue';
import { debounce } from 'lodash-es';
// 使用模块
</script>
```

---

## 八、服务端优化

### 8.1 服务端渲染（SSR）

**SSR 的优势**：

- ✅ **更快的首屏加载**（FCP/LCP）
- ✅ **更好的 SEO**（搜索引擎可以直接看到内容）
- ✅ **更好的社交媒体分享**（Open Graph 标签可见）

**使用 Nuxt.js（Vue）或 Next.js（React）**：

```javascript
// pages/index.vue (Nuxt.js)
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
  </div>
</template>

<script setup>
// asyncData 在服务端执行，返回数据用于渲染
const { data } = await useFetch('/api/posts/1');
const title = computed(() => data.value?.title);
const content = computed(() => data.value?.content);
</script>
```

**静态站点生成（SSG）**：

```javascript
// Nuxt.js 静态生成
// nuxt.config.js
export default {
  target: 'static',  // 静态站点模式
  
  generate: {
    routes: async () => {
      const posts = await fetch('/api/posts');
      return posts.map(post => `/posts/${post.id}`);
    }
  }
};
```

### 8.2 HTTP 缓存策略

```http
# HTML（动态内容）：每次验证
Cache-Control: no-cache

# CSS/JS/图片（带内容哈希）：长期缓存，不可变
Cache-Control: public, max-age=31536000, immutable

# API 数据：缓存 1 分钟
Cache-Control: public, max-age=60

# 用户特定数据：私有缓存
Cache-Control: private, max-age=3600

# 敏感数据：不缓存
Cache-Control: no-store, private
```

### 8.3 使用 CDN 加速

```
┌────────────┐
│   用户     │
└────┬───────┘
     │ DNS 查询
     ▼
┌────────────┐
│   CDN      │
│  边缘节点  │
└────┬───────┘
     │ 请求
     ▼
┌────────────┐
│  源站      │
│  (你的服务器) │
└────────────┘

工作原理：
1. 首次请求：CDN 从源站获取内容，缓存
2. 后续请求：CDN 直接返回缓存内容
3. 缓存失效：CDN 重新从源站获取
```

---

## 九、最佳实践清单

### ✅ 加载性能

- [ ] 启用 Gzip/Brotli 压缩
- [ ] 图片使用 WebP/AVIF 格式
- [ ] 图片使用适当尺寸（响应式图片）
- [ ] 图片延迟加载（loading="lazy"）
- [ ] CSS/JS 压缩和 minification
- [ ] 代码分割（Code Splitting）
- [ ] Tree Shaking 移除未使用代码
- [ ] 使用内容哈希命名静态资源
- [ ] 设置正确的 HTTP 缓存策略
- [ ] 使用 CDN 加速静态资源
- [ ] 预加载关键资源（preload）
- [ ] DNS 预解析（dns-prefetch）
- [ ] 预连接（preconnect）
- [ ] 使用 HTTP/2 或 HTTP/3

### ✅ 渲染性能

- [ ] 动画使用 transform 和 opacity
- [ ] 避免频繁的 layout/paint
- [ ] 使用 will-change 提升动画元素
- [ ] 避免布局抖动（Layout Thrashing）
- [ ] 批量 DOM 操作
- [ ] 使用 DocumentFragment
- [ ] CSS 选择器不过度嵌套
- [ ] 滚动/触摸事件使用 passive: true
- [ ] 防抖/节流处理高频事件
- [ ] 使用 requestAnimationFrame

### ✅ JavaScript 性能

- [ ] 避免长时间任务（> 50ms）
- [ ] 使用 Web Worker 处理耗时任务
- [ ] 优化循环性能
- [ ] 避免内存泄漏（清理监听器、定时器）
- [ ] 使用 WeakMap/WeakSet 管理缓存
- [ ] 防抖（debounce）和节流（throttle）
- [ ] 避免不必要的重新渲染
- [ ] 懒加载非关键模块

### ✅ 监控和测量

- [ ] 测量 Core Web Vitals（LCP, FID, CLS）
- [ ] 使用 Lighthouse 定期审计
- [ ] 使用 Performance 面板分析瓶颈
- [ ] 建立真实用户监控（RUM）
- [ ] 监控错误率
- [ ] 设置性能预算（Performance Budget）

---

## 十、总结

性能优化是一个持续的过程，本章重点：

### ✅ 关键知识点

1. **核心指标**：LCP < 2.5s, FID < 100ms, CLS < 0.1
2. **加载优化**：资源压缩、减少请求、缓存策略、CDN
3. **渲染优化**：使用 transform/opacity、避免回流、批量操作
4. **运行时优化**：避免长时间任务、防抖节流、Web Worker
5. **性能测量**：DevTools、Lighthouse、Web Vitals、RUM

### 🎯 优化优先级

1. **先测量，后优化**：不要凭空猜测瓶颈在哪里
2. **关注用户感知**：视觉反馈比数字更重要
3. **渐进式优化**：先解决最大的问题，再优化细节
4. **持续监控**：性能优化不是一次性任务

---

> **💡 提示**：性能优化应该从项目开始就考虑，而不是事后补救。建立性能预算，在 CI/CD 流程中检查性能指标，防止性能退化。
