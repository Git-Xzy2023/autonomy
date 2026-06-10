---
layout: home
hero:
  name: 浏览器相关
  text: 浏览器技术
  tagline: 浏览器原理、API、性能优化、存储方案 - 掌握现代 Web 开发的核心技术
features:
  - title: 浏览器原理
    icon: 🌐
    details: 深入理解多进程架构、渲染流水线、事件循环机制、同源策略与跨域方案、安全机制等核心原理
    link: /web/browser/01-principle/
    linkText: 学习原理
  - title: Web API
    icon: 🔧
    details: DOM 操作、事件系统、BOM API、Fetch/XMLHttpRequest、WebSocket、定时器与异步编程等
    link: /web/browser/02-web-api/
    linkText: 学习 API
  - title: 性能优化
    icon: ⚡
    details: 核心性能指标（LCP/FID/CLS）、加载优化、渲染优化、代码分割、缓存策略、性能监控
    link: /web/browser/03-performance/
    linkText: 优化指南
  - title: 浏览器存储
    icon: 💾
    details: Cookie、LocalStorage、SessionStorage、IndexedDB、Cache API 的完整指南与最佳实践
    link: /web/browser/04-storage/
    linkText: 存储方案
---

# 浏览器技术学习指南

## 为什么要深入学习浏览器？

浏览器是 Web 应用运行的环境，是前端开发的核心基础设施。深入理解浏览器的工作原理，能够帮助你：

- ✅ **写出更高性能的应用**：理解渲染机制，避免常见的性能陷阱
- ✅ **更好地排查问题**：知道问题出在哪个环节，快速定位和解决
- ✅ **做出更合理的架构决策**：根据浏览器特性选择合适的技术方案
- ✅ **掌握现代 Web 能力**：利用 PWA、离线应用、Service Worker 等特性
- ✅ **提升面试竞争力**：浏览器原理是前端面试的高频考点

## 模块介绍

### 🌐 浏览器原理

理解浏览器的内部工作机制，包括：

- **多进程架构**：浏览器进程、渲染进程、GPU 进程等
- **渲染流水线**：HTML → DOM → CSSOM → Render 树 → 布局 → 绘制 → 合成
- **事件循环**：宏任务、微任务、JavaScript 异步执行机制
- **缓存机制**：强缓存、协商缓存、浏览器缓存策略
- **同源策略**：跨域限制与解决方案
- **安全机制**：XSS、CSRF、点击劫持等防护

### 🔧 Web API

掌握浏览器提供的各类接口：

- **DOM API**：查询、创建、修改、删除元素，属性操作，遍历
- **事件系统**：事件监听、事件流、事件委托、常用事件类型
- **BOM API**：window、location、navigator、history、screen
- **网络 API**：Fetch、XMLHttpRequest、WebSocket
- **异步编程**：Promise、async/await、定时器
- **图形和媒体**：Canvas、音频/视频 API

### ⚡ 性能优化

学习如何打造高性能的 Web 应用：

- **核心指标**：LCP、FID、CLS、TTFB、FCP 等
- **加载性能**：资源压缩、代码分割、懒加载、CDN、HTTP/2
- **渲染性能**：减少回流重绘、优化动画、虚拟列表
- **运行时性能**：避免长时间任务、防抖节流、Web Worker
- **性能监控**：DevTools 使用、真实用户监控（RUM）
- **构建优化**：Tree Shaking、压缩、预加载

### 💾 浏览器存储

根据场景选择合适的存储方案：

- **Cookie**：小量数据、服务端可访问、会话管理
- **LocalStorage**：永久存储、跨标签页、用户偏好设置
- **SessionStorage**：会话级存储、表单草稿、临时状态
- **IndexedDB**：大容量、结构化数据、索引查询、离线应用
- **Cache API**：配合 Service Worker、缓存请求、PWA 支持

## 学习路径

1. **入门阶段**：先学习 [浏览器原理](/web/browser/01-principle/)，建立对浏览器工作机制的整体认知
2. **实践阶段**：通过 [Web API](/web/browser/02-web-api/) 学习，结合实际项目练习
3. **优化阶段**：学习 [性能优化](/web/browser/03-performance/)，找出并解决项目中的性能瓶颈
4. **进阶阶段**：掌握 [浏览器存储](/web/browser/04-storage/)，为不同场景选择最佳方案

## 推荐资源

- **MDN Web Docs**：[https://developer.mozilla.org/zh-CN/](https://developer.mozilla.org/zh-CN/) - 最权威的 Web 技术文档
- **Chrome DevTools 文档**：[https://developer.chrome.com/docs/devtools/](https://developer.chrome.com/docs/devtools/)
- **Web Vitals**：[https://web.dev/vitals/](https://web.dev/vitals/) - Google 官方性能指标指南
- **Service Worker 指南**：[https://web.dev/service-workers/](https://web.dev/service-workers/)

## 开始学习

选择你感兴趣的模块，开始深入学习浏览器技术！
