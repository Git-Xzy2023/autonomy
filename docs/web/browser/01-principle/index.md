---
title: 浏览器原理
---

# 浏览器原理详解

> 浏览器是 Web 应用运行的环境，理解其工作原理对于前端开发至关重要。本章将深入探讨浏览器的核心机制，包括多进程架构、渲染流程、事件循环等。

---

## 一、浏览器概述

### 1.1 浏览器的发展历史

| 时间  | 事件                       | 意义                              |
| ----- | -------------------------- | --------------------------------- |
| 1990  | WorldWideWeb（Nexus）      | 第一个浏览器                      |
| 1993  | Mosaic                     | 第一个流行的图形浏览器            |
| 1995  | Internet Explorer          | 微软进入浏览器市场                |
| 1998  | Mozilla 项目启动           | 开源浏览器的开端                  |
| 2003  | Safari 发布                | WebKit 引擎登场                   |
| 2008  | Chrome 发布                | V8 引擎和多进程架构               |
| 2015  | Edge 发布（基于 Chromium） | 浏览器市场格局变化                |
| 2020s | 现代浏览器时代             | PWA、WebAssembly、WebGPU 等新技术 |

### 1.2 主流浏览器及内核

| 浏览器      | 渲染引擎             | JavaScript 引擎 |
| ----------- | -------------------- | --------------- |
| **Chrome**  | Blink（WebKit 分支） | V8              |
| **Edge**    | Blink                | V8              |
| **Safari**  | WebKit               | JavaScriptCore  |
| **Firefox** | Gecko                | SpiderMonkey    |
| **Opera**   | Blink                | V8              |

> 💡 **注意**：从 2020 年开始，微软 Edge 浏览器切换到了 Chromium 内核，这意味着 Chrome、Edge、Opera 等浏览器都使用相同的 Blink 渲染引擎和 V8 JavaScript 引擎。

---

## 二、浏览器的多进程架构

### 2.1 为什么需要多进程？

早期浏览器是单进程的，这意味着：

- 一个标签页崩溃可能导致整个浏览器崩溃
- 一个标签页的性能问题会影响整个浏览器
- 安全性较差，不同网站的数据容易泄露

现代浏览器采用**多进程架构**，主要优势：

1. ✅ **稳定性**：单个标签页崩溃不影响其他页面
2. ✅ **安全性**：进程间隔离，沙箱机制
3. ✅ **性能**：多核心 CPU 并行处理
4. ✅ **可扩展性**：方便添加新功能

### 2.2 Chrome 的进程结构

Chrome 浏览器包含以下主要进程：

```
浏览器主进程（Browser Process）
├─ 渲染进程（Renderer Process）- 每个标签页可能一个
│  ├─ 主线程（Main Thread）
│  ├─ 合成线程（Compositor Thread）
│  ├─ 光栅线程（Raster Thread）
│  └─ 工作线程（Worker Threads）
├─ GPU 进程（GPU Process）
├─ 插件进程（Plugin Process）
├─ 网络进程（Network Process）
└─ 存储进程等其他服务进程
```

#### 各进程的职责

**1. 浏览器主进程（Browser Process）**

```
职责：
├─ 控制浏览器 UI（地址栏、书签、前进/后退按钮）
├─ 管理文件访问、网络请求等
├─ 协调其他进程
└─ 处理不可见的后台任务
```

**2. 渲染进程（Renderer Process）**

```
职责：
├─ 解析 HTML、CSS、JavaScript
├─ 构建 DOM、CSSOM、Render 树
├─ 执行 JavaScript 代码
├─ 布局（Layout）和绘制（Paint）
└─ 将页面内容合成到屏幕

特点：
├─ 默认每个标签页一个独立进程
├─ 运行在沙箱环境中
└─ 无法直接访问系统资源
```

**3. GPU 进程（GPU Process）**

```
职责：
├─ 处理 GPU 相关任务
├─ 加速图形渲染
├─ 处理 3D CSS、Canvas、WebGL
└─ 合成最终的页面图层
```

**4. 网络进程（Network Process）**

```
职责：
├─ 处理网络请求（HTTP、HTTPS、WebSocket）
├─ 管理缓存
├─ 处理 DNS 解析
└─ 处理证书验证
```

**5. 插件进程（Plugin Process）**

```
职责：
├─ 运行浏览器插件（如 Flash，现已基本淘汰）
└─ 隔离插件以提高安全性
```

### 2.3 进程间通信（IPC）

进程之间通过 IPC（Inter-Process Communication）进行通信。

---

## 三、浏览器的渲染流程（关键！）

理解渲染流程是前端性能优化的基础。

### 3.1 渲染流水线总览

从 HTML 文件到屏幕显示像素，浏览器经历以下阶段：

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  HTML   │    │  Style  │    │ Layout │    │  Paint  │    │Composite│
│ Parsing │───▶│ Recalc  │───▶│  (布局) │───▶│ (绘制)  │───▶│ (合成)  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │             │             │              │              │
     ▼             ▼             ▼              ▼              ▼
   DOM 树       CSSOM 树      Render 树      图层树         屏幕显示
```

### 3.2 第一阶段：HTML 解析与 DOM 树构建

**输入**：HTML 文本  
**输出**：DOM（Document Object Model）树

解析过程分为三个步骤：

1. **字节流 → 字符**：将网络传输的二进制数据转换为文本字符
2. **字符 → Token**：将 HTML 文本分解为语法标记（开始标签、结束标签、文本等）
3. **Token → DOM 节点 → DOM 树**：根据标记构建内存中的树形数据结构

> ⚠️ **重要**：HTML 解析器遇到 `<script>` 标签时会暂停解析，等待 JavaScript 下载并执行完毕。这是因为 JavaScript 可能修改 DOM 结构。

### 3.3 第二阶段：CSS 解析与 CSSOM 树构建

**输入**：CSS 文本（内联、内部、外部）  
**输出**：CSSOM（CSS Object Model）树

CSS 解析过程与 HTML 类似，但 CSS 具有三个关键特性：

- **层叠（Cascade）**：多个规则可以作用于同一元素
- **特异性（Specificity）**：决定哪条规则优先级更高
- **继承（Inheritance）**：子元素可以继承父元素的样式

### 3.4 第三阶段：Render 树构建

**输入**：DOM 树 + CSSOM 树  
**输出**：Render 树（包含可见元素及其样式）

**Render 树特点**：

- ✅ 只包含可见元素
- ❌ 不包含 `<head>`、`<meta>`、`<script>` 等不可见元素
- ❌ 不包含 `display: none` 的元素
- ✅ 包含 `visibility: hidden` 的元素（占据空间）

### 3.5 第四阶段：布局（Layout / Reflow）

**输入**：Render 树  
**输出**：每个节点的精确位置和尺寸

这一步也称为**回流（Reflow）**。

浏览器需要计算：

1. **视口（Viewport）大小**
2. **每个元素的盒模型**：width、height、padding、border、margin
3. **元素在文档中的位置**：x、y 坐标
4. **元素之间的关系**：浮动、定位、Flexbox、Grid

### 3.6 第五阶段：绘制（Paint / Raster）

**输入**：带有位置和尺寸的 Render 树  
**输出**：像素点（位图）

绘制过程通常分为多个图层，每个图层独立绘制后合成。

**绘制内容包括**：

- 背景色、背景图片
- 边框
- 阴影
- 文本
- 图片
- 其他视觉效果

### 3.7 第六阶段：合成（Composite）

**输入**：多个图层的位图  
**输出**：屏幕上显示的最终画面

合成器线程将多个图层按正确顺序组合，处理滚动、缩放等变换，将结果发送给 GPU 进程显示。

**优势**：

- 不触发回流和重绘
- GPU 加速，性能更好
- 可以实现平滑动画

---

## 四、渲染性能与优化策略

### 4.1 触发渲染更新的三种路径

```
路径 1：JavaScript → Style → Layout → Paint → Composite
         ▲
         │ 修改了影响布局的属性（width、height、margin 等）
         最消耗性能！

路径 2：JavaScript → Style → Paint → Composite
         ▲
         │ 修改了不影响布局但影响绘制的属性（color、background-color 等）
         中等消耗

路径 3：JavaScript → Style → Composite
         ▲
         │ 只修改了可以由合成器处理的属性（transform、opacity）
         性能最佳！⭐
```

### 4.2 回流（Reflow）与重绘（Repaint）

**回流（Reflow / Layout）**：

- 当元素的几何属性（尺寸、位置）发生变化时触发
- 浏览器需要重新计算所有受影响元素的布局
- **开销最大**，应尽量避免

触发回流的常见操作：

```javascript
// 1. 修改影响布局的 CSS 属性
element.style.width = "200px";
element.style.height = "100px";
element.style.margin = "10px";
element.style.display = "block";

// 2. 添加或删除 DOM 节点
const newElement = document.createElement("div");
parent.appendChild(newElement);

// 3. 移动元素位置
element.style.position = "absolute";
element.style.left = "100px";

// 4. 读取某些属性（会强制同步布局）
const width = element.offsetWidth;
const height = element.offsetHeight;
const top = element.offsetTop;
```

**重绘（Repaint / Paint）**：

- 当元素的视觉属性（不影响布局）变化时触发
- 浏览器需要重新绘制受影响的像素
- 开销中等

**合成（Composite）**：

- 只修改可以由 GPU 直接处理的属性
- **性能最佳**

只触发合成的属性：

```css
transform: translate(100px, 0);
transform: scale(1.2);
transform: rotate(45deg);
opacity: 0.8;
```

### 4.3 减少回流和重绘的技巧

**技巧 1：使用 transform 和 opacity 做动画** ✅

```css
/* ❌ 不好：会触发回流和重绘 */
.box {
  position: relative;
  left: 0;
  transition: left 0.3s;
}
.box:hover {
  left: 100px;
}

/* ✅ 好：只触发合成 */
.box {
  transform: translateX(0);
  transition: transform 0.3s;
}
.box:hover {
  transform: translateX(100px);
}
```

**技巧 2：批量修改 DOM**

```javascript
// ✅ 使用 DocumentFragment 批量添加
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const element = document.createElement("div");
  element.textContent = i;
  fragment.appendChild(element);
}
document.body.appendChild(fragment);
```

**技巧 3：避免频繁读取几何属性**

```javascript
// ✅ 先读取所有需要的值，再进行修改
const heights = elements.map((el) => el.offsetHeight);
// 然后进行修改操作
```

**技巧 4：使用 will-change 提示浏览器**

```css
/* 告诉浏览器这个元素即将发生变化，提前准备 */
.element {
  will-change: transform;
}
/* 但不要滥用！会消耗额外内存 */
```

---

## 五、JavaScript 执行机制与事件循环

### 5.1 单线程模型

JavaScript 是单线程的，意味着同一时间只能执行一段代码。长时间运行的代码会阻塞页面渲染，因此需要异步机制来处理耗时操作。

### 5.2 调用栈（Call Stack）

JavaScript 引擎使用调用栈来管理函数执行。函数执行时入栈，执行完毕后出栈。

### 5.3 事件循环（Event Loop）详解

事件循环是 JavaScript 处理异步操作的核心机制。

**基本流程**：

```
1. 执行当前调用栈中的所有同步代码
2. 调用栈清空后，检查微任务队列（Microtask Queue）
   - 执行所有微任务（全部清空）
3. 检查宏任务队列（Macrotask Queue）
   - 取出一个宏任务执行
4. 重复第 2、3 步（先微任务，后宏任务）
```

**微任务（Microtask）**：

- ✅ Promise.then / catch / finally
- ✅ queueMicrotask()
- ✅ MutationObserver

**宏任务（Macrotask / Task）**：

- ✅ setTimeout / setInterval
- ✅ I/O 操作（网络、文件）
- ✅ UI 渲染事件（如 click、scroll）
- ✅ requestAnimationFrame

**经典示例**：

```javascript
console.log("1. 脚本开始");

setTimeout(() => {
  console.log("3. setTimeout 回调（宏任务）");
}, 0);

Promise.resolve().then(() => {
  console.log("2. Promise 回调（微任务）");
});

console.log("4. 脚本结束");

// 输出顺序：
// 1. 脚本开始
// 4. 脚本结束
// 2. Promise 回调（微任务）
// 3. setTimeout 回调（宏任务）
```

---

## 六、浏览器缓存机制

### 6.1 缓存位置优先级

```
1. Service Worker（由开发者控制，最灵活）
2. Memory Cache（内存缓存，读取最快，关闭浏览器失效）
3. Disk Cache（磁盘缓存，容量大，持久化存储）
4. 网络请求（以上都没有，发起真实请求）
```

### 6.2 HTTP 缓存策略

HTTP 缓存分为**强缓存**和**协商缓存**。

#### 强缓存（Strong Caching）

强缓存期间，浏览器不会发送请求到服务器，直接使用本地缓存。

**控制字段**：

```
Cache-Control（HTTP/1.1，推荐）
├─ max-age=3600        缓存有效期 3600 秒（1 小时）
├─ no-cache            可以缓存，但每次使用前必须验证
├─ no-store            完全不缓存
├─ public              可以被任何缓存存储
└─ private             只能被用户的私有缓存存储
```

**Cache-Control 组合使用**：

```http
# 静态资源：缓存 1 年，不可变
Cache-Control: public, max-age=31536000, immutable

# HTML 页面：不缓存，每次请求最新版本
Cache-Control: no-cache, no-store, must-revalidate

# API 响应：缓存 5 分钟
Cache-Control: public, max-age=300
```

#### 协商缓存（Conditional Caching）

强缓存过期后，浏览器向服务器发送请求，询问缓存是否仍然有效。

**方法一：Last-Modified / If-Modified-Since**

基于文件修改时间，精度为秒级。

**方法二：ETag / If-None-Match**

基于文件内容哈希，精度更高，推荐使用。

---

## 七、同源策略与跨域

### 7.1 同源策略（Same-Origin Policy）

同源策略是浏览器最核心的安全机制，限制了不同源之间的交互。

**什么是"源"（Origin）？**

```
源 = 协议 + 域名 + 端口

示例：
https://example.com:443/path/page.html
└──┬──┘  └────┬────┘ └┬┘
   │          │        └──── 端口
   │          │
   │          └────── 域名
   │
   └─────────────────── 协议（http / https）
```

**同源策略限制的内容**：

- ❌ Cookie / LocalStorage / IndexedDB（不同源不能访问）
- ❌ DOM 操作（不能访问不同源 iframe 的 DOM）
- ❌ AJAX 请求（默认不能发送跨域请求）

### 7.2 跨域解决方案

#### 方案一：CORS（Cross-Origin Resource Sharing）⭐ 推荐

CORS 是现代浏览器支持的标准跨域解决方案，通过 HTTP 头控制访问权限。

**服务器端设置**：

```javascript
// Node.js (Express) 示例
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
```

#### 方案二：代理服务器（Proxy）⭐ 开发常用

通过同源的服务器转发请求，绕过浏览器限制。

**Vite 配置**：

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      "/api": {
        target: "https://api.example.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
```

#### 方案三：JSONP（老旧技术，不推荐新项目）

利用 `<script>` 标签不受同源策略限制的特点，只支持 GET 请求。

#### 方案四：postMessage（iframe 通信）

用于不同源的 iframe 之间通信。

---

## 八、浏览器安全

### 8.1 XSS（Cross-Site Scripting，跨站脚本攻击）

**原理**：攻击者在网页中注入恶意 JavaScript 代码，当其他用户访问时执行。

**类型**：

- **存储型 XSS**：恶意代码存储在服务器（数据库）
- **反射型 XSS**：恶意代码在 URL 参数中，服务器反射回页面
- **DOM 型 XSS**：纯前端问题，JS 读取 URL 参数并插入 DOM

**防御措施**：

1. **输入验证和转义**：对用户输入进行 HTML 转义
2. **使用安全的框架/库**：React、Vue 等现代框架默认会对内容进行转义
3. **设置 HttpOnly Cookie**：防止 JavaScript 读取敏感 Cookie
4. **Content Security Policy（CSP）**：限制资源加载来源

### 8.2 CSRF（Cross-Site Request Forgery，跨站请求伪造）

**原理**：攻击者诱导用户在已登录的网站上执行非预期操作。

**防御措施**：

1. **CSRF Token**：服务器生成随机 token，表单提交时验证
2. **SameSite Cookie**：限制 Cookie 在跨站请求中的发送
3. **验证 Referer / Origin**：检查请求来源

---

## 九、浏览器存储方案

### 9.1 存储方案对比

| 特性           | Cookie | LocalStorage | SessionStorage | IndexedDB | Cache API  |
| -------------- | ------ | ------------ | -------------- | --------- | ---------- |
| **容量**       | ~4KB   | ~5-10MB      | ~5-10MB        | >50MB     | 取决于磁盘 |
| **持久化**     | 可设置 | 永久         | 会话           | 永久      | 永久       |
| **跨标签页**   | ✅     | ✅           | ❌             | ✅        | ✅         |
| **随请求发送** | ✅     | ❌           | ❌             | ❌        | ❌         |

### 9.2 基本用法

**LocalStorage**：

```javascript
// 存储
localStorage.setItem("username", "张三");
localStorage.setItem("user", JSON.stringify({ name: "张三" }));

// 读取
const username = localStorage.getItem("username");
const user = JSON.parse(localStorage.getItem("user"));

// 删除
localStorage.removeItem("username");

// 清空
localStorage.clear();
```

**SessionStorage**：API 与 LocalStorage 完全相同，只是标签页关闭即删除。

**Cookie**：

```javascript
// 设置
document.cookie = "username=张三; path=/; max-age=3600";

// 完整选项
document.cookie =
  "sessionId=abc123; path=/; max-age=3600; Secure; SameSite=Strict";

// 读取
const cookies = document.cookie;

// 删除
document.cookie = "username=; path=/; max-age=0";
```

**IndexedDB**：浏览器提供的事务型 NoSQL 数据库，适合存储大量结构化数据。API 较复杂，通常使用封装库（如 idb）简化操作。

---

## 十、页面生命周期

### 10.1 页面加载生命周期

```
页面访问 → DOMContentLoaded → load → beforeunload → unload
```

**各阶段说明**：

| 事件                 | 触发时机                             |
| -------------------- | ------------------------------------ |
| **DOMContentLoaded** | HTML 解析完成，DOM 树构建完成        |
| **load**             | 所有资源加载完成（图片、CSS、JS 等） |
| **beforeunload**     | 页面即将关闭或刷新                   |
| **unload**           | 页面正在关闭                         |

**使用示例**：

```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 解析完成，可以操作 DOM");
  initApp();
});

window.addEventListener("load", () => {
  console.log("所有资源加载完成");
});

window.addEventListener("beforeunload", (event) => {
  if (hasUnsavedChanges()) {
    event.preventDefault();
    event.returnValue = "";
  }
});
```

### 10.2 页面可见性

```javascript
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("页面变为可见");
    resumeTimers();
  } else {
    console.log("页面变为隐藏");
    pauseTimers();
  }
});
```

---

## 十一、总结

浏览器原理是前端开发的核心知识，本章重点：

### ✅ 关键知识点

1. **多进程架构**：理解浏览器进程和渲染进程的分工
2. **渲染流程**：HTML → DOM → CSSOM → Render 树 → 布局 → 绘制 → 合成
3. **事件循环**：同步代码 → 微任务 → 宏任务的执行顺序
4. **缓存机制**：强缓存和协商缓存的区别与应用
5. **跨域**：同源策略限制，CORS 和代理服务器的解决方案
6. **安全**：XSS 和 CSRF 的原理与防御
7. **存储**：Cookie、LocalStorage、SessionStorage、IndexedDB 的适用场景

### 🎯 学习建议

- 深入理解渲染流程，这是性能优化的基础
- 掌握事件循环机制，理解异步代码执行顺序
- 熟悉缓存策略，在实际项目中合理配置
- 了解安全风险，编写安全的代码

---

> **💡 提示**：浏览器原理内容较多，建议结合实际开发经验逐步消化。性能优化、调试工具等章节会有更多实践内容。
