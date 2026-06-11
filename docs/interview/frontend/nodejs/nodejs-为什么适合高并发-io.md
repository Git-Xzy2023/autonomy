---
title: "Node.js 为什么适合高并发 I/O"
---

# Node.js 为什么适合高并发 I/O

Node 的 HTTP 服务器底层由 libuv 的异步网络 I/O 驱动。每个连接不会占用一个线程，只是一个 `uv_tcp_t` 句柄+回调。当数据到达时，内核通过 epoll/kqueue 通知 libuv，libuv 把回调放入事件循环，Node 在主线程执行 JS。

**典型连接数 VS 线程数：**

- 传统线程模型：1 万并发连接 = 1 万个线程（每个线程栈 8MB → 80GB 内存）
- Node：1 万并发连接 = 1 个主线程 + 少量线程池句柄（内存几十 MB）
