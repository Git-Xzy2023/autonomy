---
title: "Node.js 是什么"
---

# Node.js 是什么

Node.js 是一个基于 Chrome V8 引擎的 **JavaScript 运行时（Runtime）**，它将 V8 引擎、libuv（跨平台异步 I/O 库）、内置模块（fs、http、net、path 等）以及 C++ 绑定层组合在一起，使 JavaScript 可以在服务端运行。

**核心特点：**

- **单线程事件循环（Event Loop）**：JavaScript 代码在单线程中执行，但底层 I/O 操作由 libuv 管理的线程池/操作系统内核完成
- **非阻塞 I/O（Non-blocking I/O）**：所有 I/O 操作默认异步，不会阻塞主线程
- **事件驱动（Event-driven）**：基于发布-订阅模式，通过回调/Promise/async-await 处理异步结果
- **跨平台**：libuv 抽象了 Windows（IOCP）、Linux（epoll）、macOS（kqueue）的差异
- **npm/yarn/pnpm 生态**：全球最大的包管理生态

**Node.js 架构分层：**

```
┌──────────────────────────────────────────────┐
│           Application Code（JS）            │
├──────────────────────────────────────────────┤
│           Node.js Core Modules（JS）        │
├──────────────────────────────────────────────┤
│         C++ Bindings（node.dll / node）     │
├─────────┬────────────────────────────────────┤
│  V8     │            libuv                   │
│ Engine  │  ┌──────────────────────────────┐  │
│         │  │ Thread Pool（默认 4 个）     │  │
│         │  │ Event Loop                   │  │
│         │  │ File / DNS / Async I/O       │  │
│         │  └──────────────────────────────┘  │
└─────────┴────────────────────────────────────┘
         │
         └── 操作系统内核（epoll / kqueue / IOCP）
```
