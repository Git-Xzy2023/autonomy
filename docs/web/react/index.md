---
title: React 学习指南
---

# React 学习指南

本章节涵盖 React 的完整技术栈，按照 **React 基础 → Hooks → 进阶特性 → 性能优化 → 设计模式 → 测试 → 最佳实践 → React 19 新特性** 的路线系统化整理，并由独立的 [React 生态](/web/react-ecosystem/) 章节介绍路由、状态管理、服务端渲染等周边技术。

> 🆕 **React 19 已发布**！新增 React Compiler、Actions、Server Components 稳定版、新 Hooks（use/useActionState/useOptimistic/useFormStatus）等重要特性。详见 [React 19 新特性](/web/react/react19/)。

---

## 一、为什么学习 React？

React 是由 Meta（原 Facebook）开发的用于构建用户界面的 JavaScript 库，是目前最流行的前端框架之一。

- 🚀 **声明式**：以声明式描述 UI，React 自动处理 DOM 更新
- 🧩 **组件化**：将 UI 拆分为独立、可复用的组件
- 🔄 **单向数据流**：数据流向清晰，易于调试
- 🌐 **跨平台**：React Native 支持移动端开发
- 📦 **生态丰富**：React Router、Redux、Next.js 等成熟方案
- 👥 **社区活跃**：大量第三方库和学习资源

---

## 二、技术栈总览

| 技术                | 定位           | 适用场景           |
| ------------------- | -------------- | ------------------ |
| **React**           | UI 库          | 构建用户界面       |
| **React Router**    | 路由管理       | 单页应用（SPA）    |
| **Redux**           | 状态管理       | 大型应用、复杂状态 |
| **Zustand**         | 轻量状态管理   | 中小型应用         |
| **React Query**     | 服务端状态管理 | 数据获取与缓存     |
| **Next.js**         | 全栈框架       | SSR/SSG、SEO 优化  |
| **Jest**            | 测试框架       | 单元测试           |
| **Testing Library** | 组件测试       | 组件交互测试       |

---

## 三、推荐学习路线

```
React 基础 → Hooks → 进阶特性 → 性能优化
   ↓
入门安装     useState     Context      memo
JSX 语法     useEffect    Refs         虚拟 DOM
组件与 Props useRef       HOC          并发模式
State 与事件 useReducer   Render Props 优化实践
生命周期     useContext   错误边界
             自定义 Hooks  Portals
                          Suspense
   ↓
设计模式 → 测试 → 最佳实践
   ↓
组合模式     Jest          项目结构
Hook 模式    Testing Lib   状态管理选型
Provider     模拟数据      编码规范
   ↓
React 生态（按需学习）
├── React Router（路由）
├── Redux / Zustand（状态管理）
├── React Query（数据获取）
└── Next.js（全栈框架）
```

---

## 四、各模块入口

### 🚀 React 基础

从零开始学习 React，包括环境搭建、JSX 语法、组件与 Props、State 与事件处理、生命周期。

| 章节 | 主题             | 链接                                               |
| ---- | ---------------- | -------------------------------------------------- |
| 01   | 入门与安装       | [入门与安装](/web/react/basics/01-intro/)          |
| 02   | JSX 语法详解     | [JSX 语法](/web/react/basics/02-jsx/)              |
| 03   | 组件与 Props     | [组件与 Props](/web/react/basics/03-components/)   |
| 04   | State 与事件处理 | [State 与事件](/web/react/basics/04-state-events/) |
| 05   | 生命周期与副作用 | [生命周期](/web/react/basics/05-lifecycle/)        |

### 🪝 Hooks

Hooks 是 React 16.8 引入的特性，让函数组件拥有状态和副作用能力，是现代 React 开发的核心。

| 章节 | 主题                   | 链接                                                            |
| ---- | ---------------------- | --------------------------------------------------------------- |
| 01   | useState 状态管理      | [useState](/web/react/hooks/01-usestate/)                       |
| 02   | useEffect 副作用       | [useEffect](/web/react/hooks/02-useeffect/)                     |
| 03   | useRef 与 DOM          | [useRef](/web/react/hooks/03-useref/)                           |
| 04   | useContext 上下文      | [useContext](/web/react/hooks/04-usecontext/)                   |
| 05   | useMemo 与 useCallback | [useMemo/useCallback](/web/react/hooks/05-usememo-usecallback/) |
| 06   | useReducer 复杂状态    | [useReducer](/web/react/hooks/06-usereducer/)                   |
| 07   | 自定义 Hooks           | [自定义 Hooks](/web/react/hooks/07-custom-hooks/)               |

### 🎯 进阶特性

深入 React 的高级特性，包括 Context、Refs、高阶组件、Render Props、错误边界、Portals 和 Suspense。

| 章节 | 主题               | 链接                                                 |
| ---- | ------------------ | ---------------------------------------------------- |
| 01   | Context API 深入   | [Context](/web/react/advanced/01-context/)           |
| 02   | Refs 与 forwardRef | [Refs](/web/react/advanced/02-refs/)                 |
| 03   | 高阶组件 HOC       | [HOC](/web/react/advanced/03-hoc/)                   |
| 04   | Render Props       | [Render Props](/web/react/advanced/04-render-props/) |
| 05   | 错误边界           | [错误边界](/web/react/advanced/05-error-boundaries/) |
| 06   | Portals 传送门     | [Portals](/web/react/advanced/06-portals/)           |
| 07   | Suspense 与懒加载  | [Suspense](/web/react/advanced/07-suspense/)         |

### ⚡ 性能优化

理解 React 的渲染机制，掌握各种性能优化手段，构建高性能应用。

| 章节 | 主题             | 链接                                                |
| ---- | ---------------- | --------------------------------------------------- |
| 01   | 虚拟 DOM 与 Diff | [虚拟 DOM](/web/react/performance/01-virtual-dom/)  |
| 02   | memo 与性能优化  | [memo](/web/react/performance/02-memo/)             |
| 03   | 并发特性         | [并发特性](/web/react/performance/03-concurrent/)   |
| 04   | 性能优化实践     | [优化实践](/web/react/performance/04-optimization/) |

### 🎨 设计模式

掌握 React 中常用的设计模式，编写更灵活、可复用的组件。

| 章节 | 主题             | 链接                                              |
| ---- | ---------------- | ------------------------------------------------- |
| 01   | 组合模式         | [组合模式](/web/react/patterns/01-compound/)      |
| 02   | 自定义 Hook 模式 | [Hook 模式](/web/react/patterns/02-custom-hooks/) |
| 03   | Provider 模式    | [Provider](/web/react/patterns/03-provider/)      |

### 🧪 测试

学习使用 Jest 和 Testing Library 对 React 组件进行测试。

| 章节 | 主题            | 链接                                                      |
| ---- | --------------- | --------------------------------------------------------- |
| 01   | Jest 基础       | [Jest](/web/react/testing/01-jest/)                       |
| 02   | Testing Library | [Testing Library](/web/react/testing/02-testing-library/) |

### 📚 最佳实践

汇总 React 项目开发的最佳实践，包括项目结构、代码风格和 TypeScript 使用。

| 章节 | 主题       | 链接                                                        |
| ---- | ---------- | ----------------------------------------------------------- |
| 01   | 项目结构   | [项目结构](/web/react/best-practices/01-project-structure/) |
| 02   | 代码风格   | [代码风格](/web/react/best-practices/02-code-style/)        |
| 03   | TypeScript | [TypeScript](/web/react/best-practices/03-typescript/)      |

### 🆕 React 19 新特性

React 19 是 React 的最新重大版本，带来了 React Compiler、Actions、Server Components 稳定版等重要更新。

| 章节 | 主题              | 链接                                                          |
| ---- | ----------------- | ------------------------------------------------------------- |
| 00   | React 19 总览     | [React 19 新特性](/web/react/react19/)                        |
| 01   | 新 Hooks          | [新 Hooks](/web/react/react19/01-new-hooks/)                  |
| 02   | Actions 与表单    | [Actions](/web/react/react19/02-actions/)                     |
| 03   | Server Components | [Server Components](/web/react/react19/03-server-components/) |
| 04   | React Compiler    | [React Compiler](/web/react/react19/04-react-compiler/)       |
| 05   | API 变化          | [API 变化](/web/react/react19/05-api-changes/)                |
| 06   | 迁移指南          | [迁移指南](/web/react/react19/06-migration/)                  |

---

## 五、React 生态入口

React 生态相关内容在独立的 [React 生态](/web/react-ecosystem/) 章节中详细介绍。

| 技术             | 说明           | 链接                                               |
| ---------------- | -------------- | -------------------------------------------------- |
| **React Router** | 路由管理       | [React Router](/web/react-ecosystem/react-router/) |
| **Redux**        | 状态管理       | [Redux](/web/react-ecosystem/redux/)               |
| **Zustand**      | 轻量状态管理   | [Zustand](/web/react-ecosystem/zustand/)           |
| **React Query**  | 服务端状态管理 | [React Query](/web/react-ecosystem/react-query/)   |
| **Next.js**      | 全栈框架       | [Next.js](/web/react-ecosystem/nextjs/)            |

---

## 六、状态管理方案对比

| 特性         | useState | Context       | Redux        | Zustand      | React Query  |
| ------------ | -------- | ------------- | ------------ | ------------ | ------------ |
| **复杂度**   | 极低     | 低            | 高           | 低           | 中           |
| **适用规模** | 组件内   | 跨组件        | 大型应用     | 中大型应用   | 服务端数据   |
| **学习成本** | 极低     | 低            | 高           | 低           | 中           |
| **样板代码** | 无       | 少            | 多           | 少           | 少           |
| **中间件**   | ❌       | ❌            | ✅           | ✅           | ✅           |
| **DevTools** | ❌       | ❌            | ✅           | ✅           | ✅           |
| **适合场景** | 简单状态 | 主题/用户信息 | 复杂全局状态 | 中等全局状态 | API 数据缓存 |

---

## 七、学习建议

1. **新手入门**：从 [React 基础](/web/react/basics/01-intro/) 开始，理解组件化和 JSX。
2. **掌握 Hooks**：[Hooks](/web/react/hooks/01-usestate/) 是现代 React 的核心，务必熟练掌握。
3. **深入原理**：学习 [进阶特性](/web/react/advanced/01-context/) 和 [性能优化](/web/react/performance/01-virtual-dom/)，理解 React 的工作机制。
4. **生态扩展**：根据项目需求学习 [React Router](/web/react-ecosystem/react-router/)、[状态管理](/web/react-ecosystem/zustand/) 和 [Next.js](/web/react-ecosystem/nextjs/)。
5. **最佳实践**：参考 [最佳实践](/web/react/best-practices/01-project-structure/) 规范项目开发。

接下来，从你感兴趣的模块开始学习吧！
