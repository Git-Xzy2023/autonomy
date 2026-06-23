---
title: React 19 新特性
---

# React 19 新特性

> React 19 是 React 的最新重大版本，带来了 React Compiler、Actions、新 Hooks、Server Components 稳定版等重要更新。

---

## 学习内容

| 章节 | 主题           | 链接                                          |
| ---- | -------------- | --------------------------------------------- |
| 01   | 新 Hooks       | [新 Hooks](/web/react/react19/01-new-hooks/)  |
| 02   | Actions 与表单 | [Actions](/web/react/react19/02-actions/)     |
| 03   | Server Components | [Server Components](/web/react/react19/03-server-components/) |
| 04   | React Compiler | [React Compiler](/web/react/react19/04-react-compiler/) |
| 05   | API 变化       | [API 变化](/web/react/react19/05-api-changes/)|
| 06   | 迁移指南       | [迁移指南](/web/react/react19/06-migration/)  |

---

## React 19 核心变化总览

```
┌─────────────────────────────────────────┐
│           React 19 核心更新             │
├─────────────────────────────────────────┤
│                                         │
│  🆕 新 Hooks                            │
│  ├── use()              读取 Promise/Context │
│  ├── useActionState     表单动作状态     │
│  ├── useOptimistic      乐观更新        │
│  └── useFormStatus      表单提交状态    │
│                                         │
│  ⚡ Actions                             │
│  ├── 异步操作统一处理                   │
│  ├── 表单原生支持                       │
│  └── 自动处理加载/错误/乐观更新         │
│                                         │
│  🖥️ Server Components（稳定）          │
│  ├── 服务端组件正式可用                 │
│  ├── Server Actions 稳定                │
│  └── 直接访问后端资源                   │
│                                         │
│  🔧 React Compiler                      │
│  ├── 自动记忆化                         │
│  ├── 无需手动 useMemo/useCallback       │
│  └── 减少不必要的重渲染                 │
│                                         │
│  📝 API 变化                            │
│  ├── ref 作为 prop（无需 forwardRef）   │
│  ├── Context 作为 Provider              │
│  ├── 文档元数据支持                     │
│  ├── 资源加载（preload）                │
│  ├── ref 清理函数                       │
│  └── 自定义元素支持                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 版本对比

| 特性              | React 18         | React 19               |
| ----------------- | ----------------- | ---------------------- |
| **Server Components** | 实验性            | ✅ 稳定                |
| **Server Actions**    | 实验性            | ✅ 稳定                |
| **React Compiler**    | ❌                | ✅ 可用（可选）        |
| **use()**             | ❌                | ✅ 新增                |
| **useActionState**    | ❌                | ✅ 新增                |
| **useOptimistic**     | ❌                | ✅ 新增                |
| **useFormStatus**     | ❌                | ✅ 新增                |
| **ref as prop**       | ❌ 需 forwardRef   | ✅ 直接传递            |
| **Context Provider**  | `<Context.Provider>` | `<Context>`         |
| **文档元数据**        | 需第三方库        | ✅ 原生支持            |
| **forwardRef**        | 必需              | ⚠️ 废弃（仍可用）     |
| **defaultProps（函数组件）** | 支持        | ⚠️ 废弃                |

---

## 下一章

开始学习：[新 Hooks](/web/react/react19/01-new-hooks/)
