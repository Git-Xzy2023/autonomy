---
title: "Node.js 真的是单线程吗？"
---

# Node.js 真的是单线程吗？

**JavaScript 执行（主线程）是单线程**，但 Node.js 整体是多线程的：

1. **V8 的后台线程**：GC、JIT 编译等
2. **libuv 的线程池（Thread Pool，默认 4 个）**：执行以下操作
   - 文件 I/O（`fs.*`，除了少数走内核异步的）
   - `dns.lookup()`（不是 `dns.resolve`，后者走 c-ares 网络）
   - 一些 `crypto` 函数（如 `pbkdf2`、`scrypt`）
   - `zlib` 压缩/解压
3. **操作系统内核**：网络 I/O（TCP/UDP/HTTP）由内核直接处理（epoll/kqueue/IOCP），不占线程

**调整线程池大小：**

```js
process.env.UV_THREADPOOL_SIZE = "32"; // 必须在任何 require 之前设置，默认 4，最大 1024
```
