---
title: React Hooks
---

# React Hooks

Hooks 是 React 16.8 引入的特性，让函数组件拥有状态和副作用能力，是现代 React 开发的核心。

---

## 学习内容

| 章节 | 主题                   | 链接                                                |
| ---- | ---------------------- | --------------------------------------------------- |
| 01   | useState 状态管理      | [useState](/web/react/hooks/01-usestate/)           |
| 02   | useEffect 副作用       | [useEffect](/web/react/hooks/02-useeffect/)         |
| 03   | useRef 与 DOM          | [useRef](/web/react/hooks/03-useref/)               |
| 04   | useContext 上下文      | [useContext](/web/react/hooks/04-usecontext/)       |
| 05   | useMemo 与 useCallback | [useMemo/useCallback](/web/react/hooks/05-usememo-usecallback/) |
| 06   | useReducer 复杂状态    | [useReducer](/web/react/hooks/06-usereducer/)       |
| 07   | 自定义 Hooks           | [自定义 Hooks](/web/react/hooks/07-custom-hooks/)   |

---

## Hooks 简介

### 为什么需要 Hooks？

```
┌─────────────────────────────────────────┐
│            Hooks 解决的问题              │
├─────────────────────────────────────────┤
│                                         │
│  1. 在组件间复用状态逻辑困难             │
│     → 自定义 Hooks 解决                  │
│                                         │
│  2. 复杂组件变得难以理解                 │
│     → 按业务逻辑拆分 effect             │
│                                         │
│  3. 类组件的 this 和绑定问题             │
│     → 函数组件无需 this                  │
│                                         │
└─────────────────────────────────────────┘
```

### Hooks 规则

1. **只在顶层调用**：不要在循环、条件或嵌套函数中调用
2. **只在函数组件或自定义 Hook 中调用**：不能在普通函数中调用

---

## 下一章

开始学习：[useState 状态管理](/web/react/hooks/01-usestate/)
