---
title: Islands 架构
---

# Islands 架构

> Islands（岛屿）架构是一种前端架构模式，在静态 HTML 中嵌入少量交互式组件（岛屿），实现更好的性能。

---

## 一、什么是 Islands 架构

### 1.1 背景

```
┌─────────────────────────────────────────┐
│      传统 SSR/SSG 的问题                │
├─────────────────────────────────────────┤
│                                         │
│  SSR/SSG 生成静态 HTML                  │
│  ↓                                      │
│  客户端 hydration（水合）               │
│  ↓                                      │
│  整个页面变成 React/Vue 应用            │
│                                         │
│  问题：                                 │
│  ❌ Hydration 成本高                    │
│  ❌ 大部分页面是静态的，却加载了 JS     │
│  ❌ 交互区域小，但 JS 全量加载          │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 Islands 架构思想

```
┌─────────────────────────────────────────┐
│         Islands 架构                    │
├─────────────────────────────────────────┤
│                                         │
│  页面 = 静态 HTML + 少量交互"岛屿"      │
│                                         │
│  ┌─────────────────────────────┐       │
│  │     静态 HTML（海洋）        │       │
│  │                             │       │
│  │   ┌─────────┐               │       │
│  │   │ 🏝️ 岛屿 │  ← 交互组件   │       │
│  │   │ (评论)  │     独立水合  │       │
│  │   └─────────┘               │       │
│  │                             │       │
│  │          ┌─────────┐        │       │
│  │          │ 🏝️ 岛屿 │        │       │
│  │          │ (搜索)  │        │       │
│  │          └─────────┘        │       │
│  │                             │       │
│  └─────────────────────────────┘       │
│                                         │
│  优势：                                 │
│  ✅ 静态部分零 JS                       │
│  ✅ 岛屿独立水合                        │
│  ✅ 性能优异                            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、与其他架构对比

| 架构         | 渲染方式           | JS 加载       | Hydration     |
| ------------ | ------------------ | ------------- | ------------- |
| **CSR**      | 客户端渲染         | 全量          | 无            |
| **SSR**      | 服务端渲染         | 全量          | 全页面        |
| **SSG**      | 构建时生成         | 全量          | 全页面        |
| **Islands**  | SSG + 部分水合     | 按需          | 仅交互部分    |

---

## 三、Astro 框架

### 3.1 Astro 介绍

Astro 是最流行的 Islands 架构框架。

```astro
---
// Astro 组件（服务端渲染，零 JS）
import Counter from '../components/Counter.jsx'

const posts = await fetch('https://api.example.com/posts').then(r => r.json())
---

<html>
<body>
  <!-- 静态内容（零 JS） -->
  <h1>博客</h1>
  <ul>
    {posts.map(post => (
      <li>{post.title}</li>
    ))}
  </ul>

  <!-- 交互式岛屿（按需加载 JS） -->
  <Counter client:load />
</body>
</html>
```

### 3.2 水合指令

```astro
---
import Counter from '../components/Counter.jsx'
---

<!-- 1. client:load — 页面加载时立即水合 -->
<Counter client:load />

<!-- 2. client:idle — 浏览器空闲时水合 -->
<Counter client:idle />

<!-- 3. client:visible — 可见时水合 -->
<Counter client:visible />

<!-- 4. client:media — 匹配媒体查询时水合 -->
<Counter client:media="(max-width: 768px)" />

<!-- 5. client:only — 只在客户端渲染（不 SSR） -->
<Counter client:only="react" />
```

### 3.3 多框架支持

```astro
---
// 可以在同一页面混用不同框架
import ReactCounter from '../components/ReactCounter.jsx'
import VueCounter from '../components/VueCounter.vue'
import SvelteCounter from '../components/SvelteCounter.svelte'
---

<ReactCounter client:load />
<VueCounter client:visible />
<SvelteCounter client:idle />
```

---

## 四、Islands 架构实现原理

### 4.1 构建流程

```
┌─────────────────────────────────────────┐
│       Islands 架构构建流程              │
├─────────────────────────────────────────┤
│                                         │
│  1. 构建时获取数据                      │
│     ↓                                   │
│  2. 生成静态 HTML                       │
│     ├── 静态部分：直接 HTML             │
│     └── 岛屿部分：占位符 + 脚本         │
│     ↓                                   │
│  3. 客户端加载                          │
│     ├── 静态部分：无需 JS               │
│     └── 岛屿部分：独立水合              │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 简化实现

```typescript
// 简化的 Islands 架构实现

// 1. 服务端渲染
function renderPage(data) {
  return `
    <html>
    <body>
      <h1>${data.title}</h1>
      <p>${data.content}</p>

      <!-- 岛屿占位符 -->
      <div
        data-island="Counter"
        data-props='${JSON.stringify({ initial: 0 })}'
      ></div>

      <!-- 岛屿脚本（按需加载） -->
      <script type="module">
        import { hydrateIsland } from '/island-loader.js'
        hydrateIsland('Counter')
      </script>
    </body>
    </html>
  `
}

// 2. 客户端水合
function hydrateIsland(name: string) {
  const elements = document.querySelectorAll(`[data-island="${name}"]`)

  elements.forEach(el => {
    const props = JSON.parse(el.dataset.props || '{}')

    // 动态导入组件
    import(`./components/${name}.js`).then(module => {
      const Component = module.default
      // 水合单个岛屿
      ReactDOM.hydrate(<Component {...props} />, el)
    })
  })
}
```

---

## 五、适用场景

### 5.1 适合 Islands 的场景

```
┌─────────────────────────────────────────┐
│       适合 Islands 架构的场景           │
├─────────────────────────────────────────┤
│                                         │
│  ✅ 内容型网站                          │
│  ├── 博客                               │
│  ├── 文档站                             │
│  ├── 新闻                               │
│  └── 营销页                             │
│                                         │
│  ✅ 电商展示页                          │
│  ├── 商品详情（大部分静态）             │
│  └── 交互部分（购物车按钮）             │
│                                         │
│  ✅ 仪表盘（部分交互）                  │
│                                         │
│  特点：静态内容多，交互区域少           │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 不适合的场景

```
┌─────────────────────────────────────────┐
│      不适合 Islands 架构的场景          │
├─────────────────────────────────────────┤
│                                         │
│  ❌ 高度交互的应用                      │
│  ├── 后台管理系统                       │
│  ├── 在线编辑器                         │
│  ├── 社交媒体应用                       │
│  └── 实时聊天                           │
│                                         │
│  原因：几乎整个页面都需要交互           │
│  Islands 的优势无法体现                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 六、性能对比

### 6.1 指标对比

| 指标           | SSR 应用    | Islands 应用 |
| -------------- | ----------- | ------------ |
| **FCP**        | 快          | 快           |
| **TTI**        | 慢          | 快           |
| **JS 体积**    | 大          | 小           |
| **Hydration**  | 全页面      | 仅岛屿       |
| **交互延迟**   | 高          | 低           |

### 6.2 实际案例

```typescript
// 一个博客页面的对比

// 传统 SSR（Next.js）
// - 页面 HTML: 50KB
// - JS 体积: 200KB（React + 页面代码）
// - Hydration: 整个页面
// - TTI: 3.5s

// Islands（Astro）
// - 页面 HTML: 50KB
// - JS 体积: 10KB（仅评论组件）
// - Hydration: 仅评论组件
// - TTI: 1.2s
```

---

## 七、总结

### ✅ 关键知识点

1. **Islands 架构**：静态 HTML + 交互岛屿
2. **核心优势**：减少 JS 加载，提升性能
3. **Astro**：最流行的 Islands 框架
4. **水合指令**：`client:load`、`client:visible`、`client:idle`
5. **适用场景**：内容型网站、静态内容多
6. **不适合**：高度交互的应用

### 🔚 结束

- 上一章：[Monorepo](/web/architecture/architecture-patterns/04-monorepo/)
- 上一级：[架构模式](/web/architecture/architecture-patterns/)
- 下一模块：[代码规范](/web/architecture/code-standards/)
