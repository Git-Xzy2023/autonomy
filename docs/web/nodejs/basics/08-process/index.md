---
title: 进程与子进程
---

# 进程与子进程

## 一、process 对象

`process` 是全局对象，提供当前 Node.js 进程的信息和控制。

### 1. 进程信息

```javascript
process.pid;          // 进程 ID
process.ppid;         // 父进程 ID
process.platform;     // 平台：'darwin' / 'linux' / 'win32'
process.arch;         // 架构：'x64' / 'arm64'
process.version;      // Node.js 版本
process.versions;     // 各组件版本
process.cwd();        // 当前工作目录
process.uptime();     // 进程运行时间（秒）
```

### 2. 环境变量

```javascript
// 读取
process.env.NODE_ENV;        // 'production' / 'development'
process.env.PORT;            // '3000'
process.env.DB_URL;          // 数据库连接

// 设置
process.env.CUSTOM_VAR = 'value';

// 删除
delete process.env.CUSTOM_VAR;
```

### 3. 标准流

```javascript
process.stdin;   // 标准输入（Readable）
process.stdout;  // 标准输出（Writable）
process.stderr;  // 标准错误（Writable）

process.stdout.write('输出到 stdout\n');
console.log = process.stdout.write.bind(process.stdout, 'LOG: ');
```

### 4. 退出

```javascript
// 正常退出
process.exit(0);

// 异常退出
process.exit(1);

// 退出前执行
process.on('exit', (code) => {
  console.log(`退出码: ${code}`);
  // ⚠️ 这里只能执行同步操作
});
```

---

## 二、进程事件

### 1. 信号事件

```javascript
process.on('SIGINT', () => {
  console.log('收到 Ctrl+C');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('收到终止信号');
  server.close(() => process.exit(0));
});

process.on('SIGHUP', () => {
  console.log('收到挂起信号');
});
```

| 信号 | 说明 |
|------|------|
| `SIGINT` | Ctrl+C |
| `SIGTERM` | 终止信号（kill 命令默认） |
| `SIGHUP` | 终端关闭 |
| `SIGKILL` | 强制终止（无法捕获） |

### 2. 异常事件

```javascript
// 未捕获异常
process.on('uncaughtException', (err) => {
  console.error('未捕获异常:', err);
  // 建议记录日志后退出
  process.exit(1);
});

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的拒绝:', reason);
});
```

### 3. 优雅关闭

```javascript
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

let isShuttingDown = false;

async function gracefulShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('开始优雅关闭...');

  // 1. 停止接收新请求
  server.close();

  // 2. 等待现有请求完成
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 3. 关闭数据库连接
  await db.close();

  // 4. 退出
  process.exit(0);
}
```

---

## 三、child_process 子进程

`child_process` 模块用于创建和控制子进程。

### 1. 四个 API 对比

| API | 说明 | 返回 | 适用场景 |
|-----|------|------|----------|
| `exec` | 执行命令，缓冲输出 | `ChildProcess` | 简单命令 |
| `execFile` | 执行文件，缓冲输出 | `ChildProcess` | 执行脚本 |
| `spawn` | 执行命令，流式输出 | `ChildProcess` | 大量输出 |
| `fork` | 执行 Node.js 文件 | `ChildProcess` | Node 进程通信 |

### 2. `exec`

```javascript
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// 回调方式
exec('ls -la', (err, stdout, stderr) => {
  if (err) return console.error(err);
  console.log(stdout);
});

// Promise 方式（推荐）
const { stdout } = await execAsync('ls -la');
console.log(stdout);
```

### 3. `spawn`（推荐）

```javascript
const { spawn } = require('child_process');

const child = spawn('ls', ['-la', '/']);

// 流式输出
child.stdout.on('data', (data) => {
  console.log(`输出: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`错误: ${data}`);
});

child.on('close', (code) => {
  console.log(`进程退出码: ${code}`);
});
```

### 4. `fork`（Node.js 进程通信）

```javascript
// parent.js
const { fork } = require('child_process');

const child = fork('child.js');

// 发送消息
child.send({ task: 'compute', data: 42 });

// 接收消息
child.on('message', (msg) => {
  console.log('来自子进程:', msg);
});

child.on('exit', (code) => {
  console.log('子进程退出:', code);
});
```

```javascript
// child.js
process.on('message', (msg) => {
  console.log('来自父进程:', msg);
  const result = heavyCompute(msg.data);
  process.send({ result });
});

function heavyCompute(n) {
  return n * 2;
}
```

---

## 四、worker_threads 多线程

`worker_threads` 用于 CPU 密集型任务，在独立线程中执行 JS。

### 1. 基本用法

```javascript
// main.js
const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js', {
  workerData: { num: 45 }
});

worker.on('message', (result) => {
  console.log('结果:', result);
});

worker.on('error', (err) => {
  console.error('错误:', err);
});

worker.on('exit', (code) => {
  console.log('退出码:', code);
});
```

```javascript
// worker.js
const { parentPort, workerData } = require('worker_threads');

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.num);
parentPort.postMessage(result);
```

### 2. 共享内存

```javascript
// main.js
const { Worker } = require('worker_threads');

const sharedBuffer = new SharedArrayBuffer(4);
const view = new Int32Array(sharedBuffer);
view[0] = 0;

const worker = new Worker('./worker.js', {
  workerData: { sharedBuffer }
});

worker.on('message', () => {
  console.log('最终值:', view[0]);  // 100
});
```

```javascript
// worker.js
const { parentPort, workerData } = require('worker_threads');

const view = new Int32Array(workerData.sharedBuffer);

for (let i = 0; i < 100; i++) {
  Atomics.add(view, 0, 1);  // 原子操作
}

parentPort.postMessage('done');
```

---

## 五、cluster 集群

`cluster` 模块利用多核 CPU，创建多个工作进程共享端口：

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  // 主进程：fork 工作进程
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.log(`工作进程 ${worker.process.pid} 退出`);
    cluster.fork();  // 重启
  });
} else {
  // 工作进程：启动服务器
  const http = require('http');
  http.createServer((req, res) => {
    res.end(`工作进程 ${process.pid}`);
  }).listen(3000);
}
```

### 主进程与工作进程通信

```javascript
// 主进程
cluster.on('message', (worker, msg) => {
  console.log(`来自工作进程 ${worker.id}:`, msg);
});

// 工作进程
process.send({ status: 'ready' });
```

---

## 六、进程间通信（IPC）

### 1. fork 通信

```javascript
const child = fork('child.js');

child.send({ type: 'task', payload: '...' });
child.on('message', (msg) => { /* ... */ });
```

### 2. 共享端口

```javascript
// 主进程
const server = http.createServer();
server.listen(3000);

// 传递 server 句柄给工作进程
const child = fork('child.js');
child.send('server', server);
```

```javascript
// child.js
process.on('message', (msg, server) => {
  if (msg === 'server') {
    server.on('connection', (socket) => {
      socket.end('由子进程处理');
    });
  }
});
```

---

## 七、实用场景

### 1. 执行系统命令

```javascript
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// 获取 Git 信息
const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
const { stdout: commit } = await execAsync('git rev-parse HEAD');
```

### 2. CPU 密集型任务

```javascript
// 使用 worker_threads 处理 CPU 密集型任务
const { Worker } = require('worker_threads');

function runHeavyTask(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./heavy-task.js', { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker 退出: ${code}`));
    });
  });
}

const result = await runHeavyTask(largeArray);
```

### 3. 定时任务

```javascript
const { fork } = require('child_process');

// 每天凌晨执行
const cron = require('node-cron');
cron.schedule('0 0 * * *', () => {
  const worker = fork('./tasks/daily-report.js');
  worker.on('exit', () => console.log('任务完成'));
});
```

---

## 八、下一步

- 上一章：[Buffer 与编码](/web/nodejs/basics/07-buffer/)
- 下一级：[Express 入门](/web/nodejs/express/01-intro/)
