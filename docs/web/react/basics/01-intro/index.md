---
title: React 入门与安装
---

# React 入门与安装

> 本章介绍 React 的基本概念、开发环境搭建，以及如何创建第一个 React 应用。

---

## 一、什么是 React？

React 是一个用于构建用户界面的 JavaScript 库，由 Meta（原 Facebook）团队开发并维护。

### 1.1 React 的核心思想

```
┌─────────────────────────────────────────────────┐
│              React 核心思想                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. 声明式编程                                   │
│     你描述 UI 应该是什么样，React 负责更新 DOM    │
│                                                 │
│  2. 组件化                                       │
│     将 UI 拆分为独立、可复用的组件                │
│                                                 │
│  3. 单向数据流                                   │
│     数据从父组件流向子组件，便于追踪和调试         │
│                                                 │
│  4. 虚拟 DOM                                     │
│     通过虚拟 DOM 提升渲染性能                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1.2 React vs 其他框架

| 特性         | React          | Vue            | Angular        |
| ------------ | -------------- | -------------- | -------------- |
| **类型**     | UI 库          | 渐进式框架     | 完整框架       |
| **学习曲线** | 中等           | 较低           | 较高           |
| **灵活性**   | 高             | 中             | 低             |
| **生态**     | 最丰富         | 丰富           | 官方提供       |
| **适用场景** | 大型应用       | 中小型应用     | 企业级应用     |
| **语言**     | JSX/TSX        | 模板语法       | TypeScript     |

---

## 二、开发环境搭建

### 2.1 安装 Node.js

React 开发需要 Node.js 环境。推荐使用 LTS 版本。

```bash
# 检查是否已安装
node -v   # 建议 v18 或更高
npm -v
```

> 💡 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理多个 Node.js 版本。

### 2.2 创建 React 项目

#### 方式一：Vite（推荐）⭐

Vite 是新一代前端构建工具，启动速度极快。

```bash
# 创建项目
npm create vite@latest my-react-app -- --template react

# 或使用 TypeScript
npm create vite@latest my-react-app -- --template react-ts

# 进入项目目录
cd my-react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 方式二：Create React App（传统方式）

```bash
npx create-react-app my-react-app

# 使用 TypeScript
npx create-react-app my-react-app --template typescript

cd my-react-app
npm start
```

> ⚠️ Create React App 已不再推荐用于新项目，建议使用 Vite 或 Next.js。

#### 方式三：Next.js（全栈框架）

```bash
npx create-next-app@latest my-next-app

cd my-next-app
npm run dev
```

### 2.3 项目结构（Vite）

```
my-react-app/
├── public/                 # 静态资源
│   └── vite.svg
├── src/
│   ├── App.css             # 根组件样式
│   ├── App.tsx             # 根组件
│   ├── index.css           # 全局样式
│   ├── main.tsx            # 入口文件
│   └── vite-env.d.ts       # Vite 类型声明
├── index.html              # HTML 模板
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 2.4 开发工具

#### VS Code 推荐插件

| 插件                    | 作用                       |
| ----------------------- | -------------------------- |
| **ES7+ React/Redux snippets** | React 代码片段        |
| **Prettier**            | 代码格式化                 |
| **ESLint**              | 代码检查                   |
| **TypeScript Vue Plugin** | TS 支持（如使用 TS）     |

#### React Developer Tools

安装浏览器扩展 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)，用于调试 React 应用。

---

## 三、第一个 React 应用

### 3.1 入口文件

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 3.2 根组件

```typescript
// src/App.tsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Hello React!</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          点击次数：{count}
        </button>
      </div>
    </div>
  )
}

export default App
```

### 3.3 HTML 模板

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 四、React 的核心概念

### 4.1 元素与组件

```typescript
// 元素：React 应用的最小单位
const element = <h1>Hello, React!</h1>

// 组件：返回元素的函数
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// 使用组件
const app = <Welcome name="张三" />
```

### 4.2 渲染流程

```
JSX 代码
    │
    ▼
React.createElement()
    │
    ▼
React 元素（虚拟 DOM）
    │
    ▼
ReactDOM.render()
    │
    ▼
真实 DOM
```

---

## 五、StrictMode 严格模式

`<React.StrictMode>` 是一个用于突出显示应用中潜在问题的工具：

```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**StrictMode 的作用**：

- 识别不安全的生命周期
- 检测过时的 ref API
- 检测意外的副作用
- 检测遗留 context API

> ⚠️ StrictMode 仅在开发模式下生效，不影响生产构建。它会导致部分函数（如渲染函数、useState 初始化函数）被调用两次，用于检测副作用。

---

## 六、常见问题

### 6.1 React vs React DOM

| 包            | 作用                       |
| ------------- | -------------------------- |
| `react`       | React 核心（组件、Hooks）  |
| `react-dom`   | React 的 DOM 渲染器        |
| `react-native`| React 的移动端渲染器       |

### 6.2 为什么需要 JSX？

JSX 是 JavaScript 的语法扩展，让你在 JS 中编写类似 HTML 的标记：

```typescript
// 使用 JSX（推荐）
const element = <h1 className="title">Hello</h1>

// 不使用 JSX
const element = React.createElement('h1', { className: 'title' }, 'Hello')
```

---

## 七、总结

### ✅ 关键知识点

1. **React 是声明式、组件化的 UI 库**
2. **使用 Vite 创建项目**：`npm create vite@latest -- --template react`
3. **入口文件**：`main.tsx` 使用 `ReactDOM.createRoot` 渲染
4. **StrictMode**：开发模式下的辅助工具
5. **虚拟 DOM**：React 性能优化的基础

### 🔜 下一章

- 下一章：[JSX 语法详解](/web/react/basics/02-jsx/)
- 上一级：[React 基础](/web/react/basics/)
- 上一级：[React 学习指南](/web/react/)
