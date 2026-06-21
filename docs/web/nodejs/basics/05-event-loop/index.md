---
title: 事件循环与异步编程
---

# 事件循环与异步编程

## 一、为什么需要事件循环？

Node.js 是**单线程**的，但能处理高并发。核心秘密就是**事件循环**（Event Loop）。

```
┌───────────────────────────┐
│         主线程            │
│   执行同步代码            │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│       事件循环            │
│  不断轮询任务队列         │
└───────────┬───────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
┌────────┐    ┌────────────┐
│ 微任务 │    │  宏任务    │
│队列    │    │ 队列       │
└────────┘    └────────────┘
```

- **I/O 操作**（文件、网络）交给**底层**（libuv）处理，不阻塞主线程
- I/O 完成后，回调放入事件队列
- 事件循环不断从队列取出任务执行

---

## 二、事件循环阶段

Node.js 事件循环分为 6 个阶段：

```
┌───────────────────────────┐
│   timers                  │  ← setTimeout / setInterval 回调
├───────────────────────────┤
│   pending callbacks       │  ← 系统级回调（如 TCP 错误）
├───────────────────────────┤
│   idle, prepare           │  ← 内部使用
├───────────────────────────┤
│   poll                    │  ← I/O 回调（最重要）
├───────────────────────────┤
│   check                   │  ← setImmediate 回调
├───────────────────────────┤
│   close callbacks         │  ← close 事件回调
└───────────────────────────┘
```

### 各阶段说明

| 阶段 | 说明 |
|------|------|
| **timers** | 执行 `setTimeout` / `setInterval` 到期的回调 |
| **pending callbacks** | 执行系统级回调（如 TCP errno） |
| **idle, prepare** | 内部使用 |
| **poll** | 获取新的 I/O 事件，执行 I/O 回调 |
| **check** | 执行 `setImmediate` 回调 |
| **close callbacks** | 执行 `close` 事件（如 `socket.on('close')`） |

---

## 三、微任务 vs 宏任务

### 微任务（Microtask）

- `Promise.then` / `catch` / `finally`
- `process.nextTick`（优先级最高）
- `queueMicrotask`

### 宏任务（Macrotask）

- `setTimeout` / `setInterval`
- `setImmediate`
- I/O 回调

### 执行顺序

**微任务在事件循环的每个阶段之间执行**：

```
timers 阶段
  ↓
微任务（process.nextTick → Promise）
  ↓
pending callbacks 阶段
  ↓
微任务
  ↓
...
```

```javascript
console.log('1. 同步');

setTimeout(() => console.log('4. setTimeout'), 0);

setImmediate(() => console.log('5. setImmediate'));

Promise.resolve().then(() => console.log('3. Promise'));

process.nextTick(() => console.log('2. nextTick'));

// 输出顺序：
// 1. 同步
// 2. nextTick
// 3. Promise
// 4. setTimeout（或 5，取决于环境）
// 5. setImmediate
```

---

## 四、`process.nextTick` vs `Promise` vs `setImmediate`

| API | 类型 | 优先级 |
|-----|------|--------|
| `process.nextTick` | 微任务 | 最高 |
| `Promise.then` | 微任务 | 次高 |
| `setImmediate` | 宏任务（check 阶段） | 低 |
| `setTimeout(fn, 0)` | 宏任务（timers 阶段） | 低 |

```javascript
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));
setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout'), 0);

// 输出：
// nextTick
// Promise
// setTimeout（通常先于 setImmediate，但不保证）
// setImmediate
```

### `setTimeout` vs `setImmediate` 顺序

```javascript
// 顺序不确定
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// 在 I/O 回调中，setImmediate 一定先于 setTimeout
fs.readFile('file.txt', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));  // 一定先执行
});
```

---

## 五、异步编程演进

### 1. 回调函数（Callback）

```javascript
fs.readFile('file1.txt', 'utf-8', (err, data1) => {
  if (err) return console.error(err);
  fs.readFile('file2.txt', 'utf-8', (err, data2) => {
    if (err) return console.error(err);
    fs.readFile('file3.txt', 'utf-8', (err, data3) => {
      if (err) return console.error(err);
      console.log(data1, data2, data3);  // 回调地狱
    });
  });
});
```

### 2. Promise

```javascript
const readFile = util.promisify(fs.readFile);

readFile('file1.txt', 'utf-8')
  .then(data1 => readFile('file2.txt', 'utf-8'))
  .then(data2 => readFile('file3.txt', 'utf-8'))
  .then(data3 => {
    console.log(data3);
  })
  .catch(err => console.error(err));
```

### 3. async/await（推荐）

```javascript
const readFile = util.promisify(fs.readFile);

async function readFiles() {
  try {
    const data1 = await readFile('file1.txt', 'utf-8');
    const data2 = await readFile('file2.txt', 'utf-8');
    const data3 = await readFile('file3.txt', 'utf-8');
    console.log(data1, data2, data3);
  } catch (err) {
    console.error(err);
  }
}

readFiles();
```

---

## 六、并发控制

### 1. 串行执行

```javascript
async function serial() {
  const results = [];
  for (const url of urls) {
    const data = await fetch(url).then(r => r.json());
    results.push(data);
  }
  return results;
}
```

### 2. 并行执行

```javascript
async function parallel() {
  const results = await Promise.all(urls.map(url =>
    fetch(url).then(r => r.json())
  ));
  return results;
}
```

### 3. 限制并发数

```javascript
async function mapLimit(items, limit, asyncFn) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const promise = asyncFn(item).then(result => {
      results.push(result);
      executing.delete(promise);
    });
    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// 使用：并发数限制为 3
const results = await mapLimit(urls, 3, url =>
  fetch(url).then(r => r.json())
);
```

### 4. 使用 `p-limit`

```bash
npm install p-limit
```

```javascript
import pLimit from 'p-limit';

const limit = pLimit(3);

const results = await Promise.all(urls.map(url =>
  limit(() => fetch(url).then(r => r.json()))
));
```

---

## 七、错误处理

### 1. try/catch

```javascript
async function fetchData() {
  try {
    const res = await fetch('https://api.example.com/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('请求失败:', err.message);
    throw err;  // 重新抛出
  }
}
```

### 2. Promise.catch

```javascript
fetch('https://api.example.com/data')
  .then(res => res.json())
  .catch(err => console.error(err));
```

### 3. EventEmitter 错误

```javascript
const emitter = new EventEmitter();

// 必须监听 error 事件，否则进程崩溃
emitter.on('error', (err) => {
  console.error('事件错误:', err);
});

emitter.emit('error', new Error('something wrong'));
```

---

## 八、浏览器 vs Node.js 事件循环

| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| **微任务执行时机** | 每个宏任务后 | 每个阶段之间 |
| **process.nextTick** | ❌ 无 | ✅ 有 |
| **setImmediate** | ❌ 无 | ✅ 有 |
| **requestAnimationFrame** | ✅ 有 | ❌ 无 |
| **I/O 模型** | 网络请求 | 文件、网络、DNS 等 |

---

## 九、常见陷阱

### 1. 阻塞事件循环

```javascript
// ❌ CPU 密集型任务阻塞事件循环
app.get('/heavy', (req, res) => {
  const result = fibonacci(45);  // 阻塞数秒
  res.send(result);
});

// ✅ 使用 worker_threads
const { Worker } = require('worker_threads');
app.get('/heavy', (req, res) => {
  const worker = new Worker('./fibonacci.js', { workerData: 45 });
  worker.on('message', result => res.send(result));
});
```

### 2. 未捕获的 Promise

```javascript
// ❌ 忘记 catch
fetch('https://api.example.com/data')
  .then(res => res.json());
// 如果失败，会触发 unhandledRejection

// ✅ 添加 catch
fetch('https://api.example.com/data')
  .then(res => res.json())
  .catch(err => console.error(err));
```

### 3. 全局错误处理

```javascript
process.on('uncaughtException', (err) => {
  console.error('未捕获异常:', err);
  // 建议重启进程
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的 Promise 拒绝:', reason);
});
```

---

## 十、下一步

- 上一章：[核心模块](/web/nodejs/basics/04-core-modules/)
- 下一章：[Stream 流](/web/nodejs/basics/06-stream/)
