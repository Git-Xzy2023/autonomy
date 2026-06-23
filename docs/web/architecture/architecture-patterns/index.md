---
title: 架构模式
---

# 架构模式

> 架构模式是解决软件架构中常见问题的可复用方案。本模块介绍前端应用的架构模式与组织方式。

---

## 学习内容

| 章节 | 主题          | 链接                                                                |
| ---- | ------------- | ------------------------------------------------------------------- |
| 01   | MVC/MVP/MVVM  | [MVC/MVP/MVVM](/web/architecture/architecture-patterns/01-mvc-mvp-mvvm/) |
| 02   | 组件化架构    | [组件化架构](/web/architecture/architecture-patterns/02-component-based/) |
| 03   | 微前端        | [微前端](/web/architecture/architecture-patterns/03-micro-frontends/) |
| 04   | Monorepo      | [Monorepo](/web/architecture/architecture-patterns/04-monorepo/)    |
| 05   | Islands 架构  | [Islands 架构](/web/architecture/architecture-patterns/05-islands/) |

---

## 架构模式分类

```
┌─────────────────────────────────────────┐
│           前端架构模式                   │
├─────────────────────────────────────────┤
│                                         │
│  📐 UI 架构                             │
│  ├── MVC（模型-视图-控制器）            │
│  ├── MVP（模型-视图-展示器）            │
│  ├── MVVM（模型-视图-视图模型）         │
│  └── 组件化架构                         │
│                                         │
│  🏢 应用架构                            │
│  ├── 单体应用                           │
│  ├── 微前端                             │
│  ├── Monorepo                           │
│  └── 模块化                             │
│                                         │
│  🌐 渲染架构                            │
│  ├── CSR（客户端渲染）                  │
│  ├── SSR（服务端渲染）                  │
│  ├── SSG（静态生成）                    │
│  ├── ISR（增量静态再生）                │
│  └── Islands（岛屿架构）                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 下一章

开始学习：[MVC/MVP/MVVM](/web/architecture/architecture-patterns/01-mvc-mvp-mvvm/)
