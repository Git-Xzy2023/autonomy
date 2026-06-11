---
title: "cluster：利用多核 CPU"
---

# cluster：利用多核 CPU

`cluster` 模块基于 `child_process.fork` 实现，让你可以启动多个工作进程共享同一个 TCP 端口。

```js
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) cluster.fork(); // 每个核一个 worker
  cluster.on("exit", (worker) => cluster.fork()); // worker 挂了自动重启
} else {
  http
    .createServer((req, res) => {
      res.end(`Hello from ${process.pid}`);
    })
    .listen(3000);
  console.log(`Worker ${process.pid} 已启动`);
}
```

**调度策略：**

- Linux：默认 Round-Robin（轮询）
- 旧 Windows：主进程 accept 后分发
- 多个 worker 调用 `listen(3000)` 时，底层共享同一个 server socket，由内核调度

**cluster vs PM2：** PM2 是 cluster 的生产级封装，提供进程守护、零停机重启、负载监控、日志管理等。
