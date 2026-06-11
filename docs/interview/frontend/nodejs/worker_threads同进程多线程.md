---
title: "worker_threads：同进程多线程"
---

# worker_threads：同进程多线程

Node 10.5+ 提供的**同进程多线程**方案，每个 worker 有自己的 V8 实例和事件循环，共享进程内存通过 `SharedArrayBuffer` / `Atomics`。

```js
// main.js
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { n: 1e9 } });
  worker.on("message", (result) => console.log("结果", result));
  worker.on("error", (err) => console.error(err));
} else {
  let sum = 0;
  for (let i = 0; i < workerData.n; i++) sum += i;
  parentPort.postMessage(sum);
}
```

**worker_threads vs child_process vs cluster：**

|          | worker_threads            | child_process        | cluster             |
| -------- | ------------------------- | -------------------- | ------------------- |
| 进程数   | 1                         | N                    | N                   |
| 线程数   | N（主线程 + worker）      | 每个进程 1 个主线程  | 每个进程 1 个主线程 |
| 共享内存 | 支持（SharedArrayBuffer） | 不支持（IPC 开销大） | 不支持              |
| 启动开销 | 小（无需新进程）          | 大                   | 大                  |
| 适合场景 | CPU 密集型计算            | 执行外部命令         | 多核 Web 服务器     |
