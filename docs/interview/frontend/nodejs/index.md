---
title: Node.js面试题
---

# Node.js面试题

## Node.js 基础与运行原理

### Node.js 是什么

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

### CommonJS 模块系统

Node.js 原生实现了 **CommonJS**（`require / module.exports`）。

**加载流程（require(x)）：**

1. **路径解析**（`Module._resolveFilename`）
   - 核心模块（如 `fs`、`path`）：直接返回
   - 相对路径（`./a`、`../b`）：拼接绝对路径 + 尝试后缀 `.js` `.json` `.node`
   - 模块名（`lodash`）：沿 `node_modules` 向上查找，匹配 `package.json` 的 `main` 字段或 `index.js`
2. **缓存检查**（`Module._cache`）：已加载直接返回 `exports`，确保单例
3. **创建模块实例**（`new Module(filename, parent)`）
4. **加载文件**：
   - `.js`：读取文件 → 用 `vm` 模块包裹函数 → 传入 `exports, require, module, __filename, __dirname` 执行
   - `.json`：`JSON.parse` 后直接赋值给 `module.exports`
   - `.node`：C++ 原生模块，通过 `process.dlopen` 加载
5. **返回 `module.exports`**

**require 的包裹函数：**

```js
// node 内部将每个 .js 文件包成这样一个函数
(function (exports, require, module, __filename, __dirname) {
  // 你的代码...
  return module.exports;
});
```

**`exports` vs `module.exports`：**

```js
// 正确用法 1：给 module.exports 赋值新对象
module.exports = { foo: "bar" };

// 正确用法 2：给 exports 挂属性（因为 exports 初始 === module.exports）
exports.foo = "bar";

// ❌ 错误：直接给 exports 赋值，切断了与 module.exports 的引用关系
exports = { foo: "bar" }; // 不会生效！
```

**ES Modules（ESM）：**

Node.js 从 v14 开始正式支持 ESM（`import/export`）。两种启用方式：

- `package.json` 中设置 `"type": "module"`
- 文件后缀用 `.mjs`

| 特性        | CommonJS                               | ESM                                                    |
| ----------- | -------------------------------------- | ------------------------------------------------------ |
| 语法        | `require()` / `module.exports`         | `import` / `export`                                    |
| 加载方式    | 运行时同步加载                         | 编译时静态分析 + 异步加载                              |
| 顶层 await  | 不支持（Node 14.8+ CJS 也不支持）      | 支持                                                   |
| 模块对象    | `require('url')` 返回 `module.exports` | `import url from 'url'` 返回 default export            |
| JSON 导入   | `require('data.json')` 直接使用        | `import data from 'data.json' assert { type: 'json' }` |
| `__dirname` | 可用                                   | 不可用，需用 `import.meta.url` + `fileURLToPath`       |

### exports 和 module.exports 的区别

```js
// Node 源码中（lib/internal/modules/cjs/loader.js）简化版：
const module = { exports: {} };
let exports = module.exports; // exports 只是 module.exports 的引用

// 你的代码
exports.foo = "bar"; // ✓ 向共享对象加属性，没问题
module.exports.baz = "qux"; // ✓ 同上
exports = { foo: "bar" }; // ✗ exports 变量被重新赋值，与 module.exports 断联
module.exports = { foo: "bar" }; // ✓ module.exports 整个被替换，正确

// return module.exports;  // 最终返回的是 module.exports
```

核心区别一句话：**`exports` 只是 `module.exports` 的一个引用**，`require` 真正拿到的永远是 `module.exports`。

### require 加载机制与模块缓存

```
require('./a.js') 第一次调用流程：
1. Module._resolveFilename('./a.js') → '/project/a.js'
2. Module._cache['/project/a.js'] 不存在
3. new Module(id, parent)
4. module.load() → 读取文件 → 编译执行 → module.exports = {...}
5. Module._cache['/project/a.js'] = module
6. return module.exports

第二次 require('./a.js')：
→ 直接命中 Module._cache，返回 module.exports（同一个对象）
```

**模块缓存带来的单例特性：**

```js
// counter.js
let n = 0;
module.exports = {
  inc: () => ++n,
  get: () => n,
};

// a.js
const c = require("./counter");
c.inc();

// b.js
const c = require("./counter");
console.log(c.get()); // 1（同一实例）
```

**清除缓存（测试场景用）：**

```js
delete require.cache[require.resolve("./counter")];
```

**循环依赖（Circular Dependency）：**

```js
// a.js
exports.name = "A";
const b = require("./b");
console.log("a.js", b); // { name: 'B' }
exports.other = "X";

// b.js
exports.name = "B";
const a = require("./a");
console.log("b.js", a); // { name: 'A' }  只拿到 a.js 执行到一半时的 exports
```

Node.js 的循环依赖不会报错，但由于代码执行顺序，被引用的模块可能只暴露了「已经执行到的那一部分」`exports`，后续属性拿不到。ESM 的循环依赖策略不同，由于绑定是 live 的，后面补上的属性在运行时可以访问到。

### 常见面试题

**Q1：浏览器中的 JS 和 Node.js 中的 JS 有什么区别？**

- 宿主环境不同：浏览器提供 DOM/BOM API（`window`、`document`），Node 提供 `fs`、`http`、`net`、`os`、`path` 等服务端 API
- 模块系统不同：浏览器用 ES Modules（`<script type="module">`）+ 浏览器 API；Node 用 CommonJS + ESM
- 全局对象不同：浏览器是 `window` / `globalThis`；Node 是 `global` / `globalThis`
- 顶层 this 指向不同：浏览器顶层 `this === window`；Node CJS 中 `this === module.exports`（不是 global）
- 安全模型不同：浏览器有同源策略、沙箱；Node 可以直接读写文件、调用系统命令

**Q2：`__dirname` 和 `process.cwd()` 的区别？**

- `__dirname`：**当前文件所在目录**的绝对路径
- `process.cwd()`：**进程启动时所在目录**（current working directory）
- 当你在 `/a` 目录执行 `node /b/c.js` 时，`__dirname = '/b'`，`process.cwd() = '/a'`

**Q3：`require` 是同步还是异步的？为什么可以设计成同步？**

`require` 是**同步**的（阻塞式）读取文件并执行。

原因：

1. 模块加载通常在程序启动阶段完成，此时还没有进入事件循环处理请求
2. 模块数量有限，磁盘 IO 相比后续业务请求可忽略不计
3. 同步实现简单且语义清晰，后续 `require()` 能立即拿到完整导出

但是动态加载大模块时可能阻塞事件循环，所以 Node 又提供了异步的 `import()` 动态导入（返回 Promise）。

**Q4：CommonJS 与 ESM 在循环依赖上的行为差异？**

CommonJS：循环依赖时返回「已执行到当前位置的 `module.exports`」，尚未执行到的属性不存在。

ESM：循环依赖时 `import` 拿到的是**活绑定（live binding）**，引用指向变量本身，后续代码执行给变量赋值后可以拿到新值。

## 事件循环（Event Loop）

### 事件循环是什么

事件循环是 Node.js 的核心机制，负责**协调异步操作的执行顺序**。它是一个「不断轮转的循环」，在单线程中持续执行以下工作：

1. 执行同步代码（V8 引擎执行 JS）
2. 将异步任务（定时器、I/O、Promise）交给底层（libuv / 内核）处理
3. 在适当时机取出异步任务的回调，放回主线程执行
4. 循环往复直到没有任务，进程退出

**Node.js 的事件循环基于 libuv 实现，分为 6 个阶段：**

```
┌──────────────────────────────────────────────────────────┐
│                    ┌──────────────────┐                  │
│                    │     timers       │ ← setTimeout/setInterval
│                    └────────┬─────────┘                  │
│                             │                            │
│                    ┌────────▼─────────┐                  │
│                    │  pending callbacks │ ← 上一轮延迟的 I/O 回调
│                    └────────┬─────────┘                  │
│                             │                            │
│                    ┌────────▼─────────┐                  │
│                    │   idle, prepare  │ ← 仅内部使用
│                    └────────┬─────────┘                  │
│                             │                            │
│                    ┌────────▼─────────┐                  │
│                    │       poll       │ ← 轮询 I/O 事件，可能阻塞
│                    └────────┬─────────┘                  │
│                             │                            │
│                    ┌────────▼─────────┐                  │
│                    │      check       │ ← setImmediate 回调
│                    └────────┬─────────┘                  │
│                             │                            │
│                    ┌────────▼─────────┐                  │
│                    │ close callbacks  │ ← socket.on('close') 等
│                    └────────┬─────────┘                  │
│                             │                            │
└─────────────────────────────┴────────────────────────────┘
                  ↓ 每个阶段之间插入：
          process.nextTick() + Promise microtasks
```

### 各阶段详解

**1. timers 阶段**

- 执行到期的 `setTimeout(fn, delay)` 和 `setInterval(fn, delay)` 回调
- 只检查「最小到期时间」的定时器，按 FIFO 顺序执行
- `delay` 是**最小等待时间**而非精确时间，实际执行时间取决于系统调度

**2. pending callbacks 阶段**

- 执行上一轮循环中「被延迟」的 I/O 回调（除了 close、setImmediate、timers 的回调）
- 例如 TCP 连接错误回调

**3. idle, prepare 阶段**

- 仅内部使用，`process.nextTick` 不属于这个阶段

**4. poll 阶段（最核心，可能阻塞）**

- 计算需要阻塞多久（取决于定时器是否到期、是否有待处理回调）
- 轮询 I/O 事件，从事件队列取出回调执行
- 如果 poll 队列不为空：遍历执行队列中的回调（同步阻塞式执行）
- 如果 poll 队列为空：
  - 有 `setImmediate` 等待：进入 check 阶段
  - 没有 `setImmediate`：阻塞等待新的 I/O 事件到达（直到超时）

**5. check 阶段**

- 执行所有 `setImmediate` 回调
- 设计目的：在 I/O 回调后立即执行某段逻辑

**6. close callbacks 阶段**

- 执行 `socket.on('close', ...)`、`fs.close` 等关闭类回调

### 微任务（Microtasks）

在 Node.js 中，宏任务阶段的**每个回调执行完毕后**，都会先清空当前的**微任务队列**再进入下一个阶段。

**微任务包括：**

1. `process.nextTick()` — 优先级最高
2. `Promise.then/catch/finally` / `queueMicrotask()`

**宏任务包括：**

- `setTimeout` / `setInterval`（timers 阶段）
- I/O 回调（poll 阶段）
- `setImmediate`（check 阶段）
- `close` 事件回调

**执行顺序口诀：** 宏任务回调 → 清空所有微任务（nextTick 先于 Promise）→ 下一宏任务

### 经典例题：setTimeout vs setImmediate

```js
// 主模块中（不在 I/O 回调中）
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
// 执行顺序不稳定！可能 timeout 先，也可能 immediate 先。
// 原因：setTimeout(0) 实际约等于 setTimeout(1)，取决于事件循环启动时刻的调度
```

```js
// 放在同一个 I/O 回调内部（如 fs.readFile 的回调）
const fs = require("fs");
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// 输出顺序固定：immediate → timeout
// 原因：I/O 回调在 poll 阶段执行，紧接着是 check 阶段（setImmediate）
// 然后才是下一轮的 timers 阶段
```

**结论**：`setImmediate` 设计初衷就是「在 I/O 之后立即执行」，在 I/O 回调内它必然先于 `setTimeout(0)` 执行。

### process.nextTick 与 Promise 的优先级

```js
setTimeout(() => console.log("timeout1"), 0);

Promise.resolve().then(() => console.log("promise1"));
process.nextTick(() => console.log("nextTick1"));

setImmediate(() => console.log("immediate1"));

Promise.resolve().then(() => console.log("promise2"));
process.nextTick(() => {
  console.log("nextTick2");
  process.nextTick(() => console.log("nextTick3")); // 同轮执行
  Promise.resolve().then(() => console.log("promise3"));
});

console.log("sync end");

// 输出顺序：
// sync end
// nextTick1 → nextTick2 → nextTick3  (nextTick 队列为空后再清 Promise)
// promise1 → promise2 → promise3
// timeout1     (下一轮 timers 阶段)
// immediate1   (再下一轮 check 阶段)
```

**关键点：**

- 同步代码最先执行
- 每次同步代码执行完，先清空 `process.nextTick` 队列（nextTick 可以往自己队列继续加，会一直执行完）
- 再清空 Promise 微任务队列
- 才进入下一阶段的宏任务

### 浏览器 EventLoop vs Node.js EventLoop

| 特性                              | 浏览器                                          | Node.js（libuv）                                                         |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| 任务分类                          | 宏任务（task queue）+ 微任务（microtask queue） | 6 个阶段的宏任务队列 + process.nextTick + Promise 微任务                 |
| 宏任务顺序                        | 一个宏任务 → 清空微任务 → 下一个宏任务          | 同一阶段内的多个宏任务可能一起执行（直到队列空或达到上限），再清空微任务 |
| `setTimeout(0)` vs `setImmediate` | 无 setImmediate，只有 setTimeout                | 两者分属不同阶段，顺序可预测                                             |
| `requestAnimationFrame`           | 有（渲染阶段）                                  | 无（Node 没有渲染）                                                      |
| 渲染                              | 每轮循环可能刷新页面                            | 不涉及渲染                                                               |

## 异步编程模型

### 回调函数（Callback）

Node.js 约定的错误优先回调（Error-First Callback）：

```js
const fs = require("fs");

fs.readFile("/path/file", "utf8", (err, data) => {
  if (err) {
    // 第一个参数永远是 Error，成功则为 null
    console.error(err);
    return;
  }
  console.log(data); // 第二个参数才是结果
});
```

**回调地狱（Callback Hell）**：嵌套过深难以维护

```js
fs.readFile("a.txt", "utf8", (err, a) => {
  if (err) throw err;
  fs.readFile("b.txt", "utf8", (err, b) => {
    if (err) throw err;
    fs.writeFile("c.txt", a + b, (err) => {
      if (err) throw err;
      // ...越来越深
    });
  });
});
```

### Promise

Promise 用 `.then` 链式调用解决回调地狱，状态不可逆（pending → fulfilled / rejected）。

```js
const { promisify } = require("util");
const readFile = promisify(fs.readFile); // Node 内置工具：把 callback 风格转 Promise

readFile("a.txt", "utf8")
  .then((a) => readFile("b.txt", "utf8").then((b) => ({ a, b })))
  .then(({ a, b }) => promisify(fs.writeFile)("c.txt", a + b))
  .catch((err) => console.error(err));
```

**Promise 三种状态**：

- `pending`：初始状态
- `fulfilled`：成功，有 `value`
- `rejected`：失败，有 `reason`

**静态方法：**

| 方法                     | 行为                                            |
| ------------------------ | ----------------------------------------------- |
| `Promise.all([p1, p2])`  | 全部成功才成功，返回数组；任一失败立即失败      |
| `Promise.race([p1, p2])` | 谁先完成（不管成功失败）就返回谁的结果          |
| `Promise.allSettled`     | 等所有 Promise 完成，返回每个状态的对象数组     |
| `Promise.any`            | 任一成功即返回，全部失败才返回 `AggregateError` |
| `Promise.resolve(v)`     | 返回一个以 v 为结果的 fulfilled Promise         |
| `Promise.reject(v)`      | 返回一个以 v 为原因的 rejected Promise          |

### async / await

ES2017 语法，本质是 Promise 的「语法糖」，让异步代码看起来像同步。

```js
async function main() {
  try {
    const a = await readFile("a.txt", "utf8");
    const b = await readFile("b.txt", "utf8");
    await fs.promises.writeFile("c.txt", a + b); // Node 10+ 内置 fs.promises
  } catch (err) {
    console.error(err);
  }
}
main();

// 并行执行（推荐）
async function parallel() {
  const [a, b] = await Promise.all([
    readFile("a.txt", "utf8"),
    readFile("b.txt", "utf8"),
  ]);
}
```

**关键要点：**

- `async` 函数永远返回 Promise，`return x` 等价于 `return Promise.resolve(x)`
- `await` 只能出现在 `async` 函数内部（或 ES Module 顶层）
- `await` 会「让出线程」，把后面的代码变成微任务排队执行
- `await` 只能等待 Promise（其他值会被包成 `Promise.resolve(v)`）

### 事件发射器（EventEmitter）

Node.js 内置的发布-订阅模式实现，很多核心模块（Stream、net、http、process）都继承自它。

```js
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("data", (chunk) => console.log("收到数据", chunk)); // 订阅
emitter.on("error", (err) => console.error(err)); // 必须监听 error，否则抛错会崩溃
emitter.once("init", () => console.log("只执行一次")); // 一次性订阅

emitter.emit("data", "hello"); // 发布
emitter.emit("error", new Error("oops"));

emitter.setMaxListeners(20); // 默认 10 个，超过会有警告（防止内存泄漏）
```

**EventEmitter 是同步执行的！** `emit` 调用时会立即同步调用所有注册的监听器，不会进入事件循环。

### 常见面试题

**Q1：Promise 的 executor 是同步还是异步？**

同步。`new Promise((resolve, reject) => { 这里同步执行 })`。只有 `resolve/reject` 触发后的 `.then/.catch` 才是异步微任务。

**Q2：`async` 函数返回的 Promise 和普通 Promise 有什么不同？**

语义上相同。`async` 函数内部 `throw` 会被转成 rejected Promise，`return` 会被转成 fulfilled Promise。

**Q3：`Promise.all` 与 `Promise.allSettled` 有什么使用场景区别？**

- `all`：所有任务相互依赖，一个失败全部失败（如批量下载文件缺一个就不行）
- `allSettled`：想拿到每个任务的结果，不管成功失败（如批量查询多组数据）

**Q4：EventEmitter 的 error 事件如果没监听会怎么样？**

Node.js 会直接抛出未捕获异常，导致进程崩溃（除非有 `process.on('uncaughtException')` 兜底）。这是设计上的强制要求，避免静默失败。

**Q5：如何把 callback 风格的 API 转成 Promise？**

```js
// 方法 1：使用 util.promisify
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

// 方法 2：手动封装
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

## Stream 流

### Stream 是什么

Stream 是 Node.js 中处理**流式数据**（大文件、网络套接字、HTTP 请求/响应）的抽象接口，核心价值是**不将数据一次性加载到内存**，而是「读一点、处理一点、写一点」。

**4 种基本类型：**

| 类型                | 继承关系                               | 示例                                  |
| ------------------- | -------------------------------------- | ------------------------------------- |
| Readable（可读）    | `stream.Readable`                      | `fs.createReadStream`、HTTP request   |
| Writable（可写）    | `stream.Writable`                      | `fs.createWriteStream`、HTTP response |
| Duplex（双工）      | `stream.Duplex`（同时可读可写）        | TCP socket                            |
| Transform（转换流） | `stream.Transform`（读入后处理再写出） | `zlib.createGzip`、crypto 加密流      |

所有 Stream 都是 EventEmitter 的子类。

### 背压（Backpressure）

当可读流速度 > 可写流速度时，数据会积压在内部 buffer 中，内存不断增长。背压机制让可写流在「写满」时通知可读流**暂停读取**，等写完后再恢复。

```js
const read = fs.createReadStream("big-file.bin");
const write = fs.createWriteStream("copy.bin");

// ❌ 朴素写法：无背压，大文件会撑爆内存
read.on("data", (chunk) => write.write(chunk));

// ✓ 正确做法：监听 drain 事件恢复读取
read.on("data", (chunk) => {
  const canContinue = write.write(chunk);
  if (!canContinue) read.pause(); // 写满了，暂停
});
write.on("drain", () => read.resume()); // 写完了，恢复
read.on("end", () => write.end());

// ✓ 最优雅：pipe() 自动处理背压
read.pipe(write);

// ✓ Node 10+ 推荐：用 pipeline 自动处理错误与清理
const { pipeline } = require("stream/promises");
await pipeline(read, write);
```

**`pipe` vs `pipeline`**：

- `pipe`：单向串联，出现错误时需要手动销毁每个流，否则资源泄漏
- `pipeline`：接受多个流 + 回调/返回 Promise，错误时自动销毁所有流，推荐

### Readable 流的两种模式

- **流动模式（Flowing）**：自动触发 `data` 事件推送数据（如 `pipe`、`data` 监听器）
- **暂停模式（Paused，默认）**：需手动调用 `read()` 拉取数据

切换方式：

- 添加 `data` 监听器 / 调用 `resume()` / `pipe()` → 进入流动模式
- 调用 `pause()` / 移除所有 `data` 监听器 → 回到暂停模式

### 对象模式（Object Mode）

默认 Stream 处理 `Buffer` / `string` / `Uint8Array`。开启 `objectMode: true` 后可以处理任意 JS 对象：

```js
const { Transform } = require("stream");

const jsonLine = new Transform({
  readableObjectMode: true, // 写端读字符串，读端吐对象
  writableObjectMode: false,
  transform(chunk, enc, cb) {
    const lines = chunk.toString().split("\n");
    lines.forEach((l) => l && this.push(JSON.parse(l)));
    cb();
  },
});
```

### 常见面试题

**Q1：为什么处理大文件要用 Stream？**

假设 1GB 文件：

- `fs.readFile`：需要 1GB 内存
- `fs.createReadStream`：默认内部 buffer 仅 64KB，内存占用恒定

核心优势：**内存可控 + 可以边读边处理（边下载边解压边写盘）**

**Q2：Stream 的 `end`、`finish`、`close` 事件区别？**

- `end`：Readable 已读完所有数据，不再有 `data`
- `finish`：Writable 所有数据都已写入底层（调用 `end()` 并 flushed）
- `close`：流的底层资源（文件描述符 / socket）已关闭（新版 Node 默认触发）

**Q3：`highWaterMark` 是什么？**

可读/可写流内部 buffer 的阈值。当 Writable 的 buffer 超过 `highWaterMark` 时，`write()` 返回 `false`，触发背压；当 buffer 排空后触发 `drain`。默认 `highWaterMark = 16 * 1024`（文件流 64KB）。

## 进程与线程

### Node.js 真的是单线程吗？

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

### 单线程的优缺点

**优点：**

- 编程模型简单，无需锁、死锁等问题
- 上下文切换开销小
- I/O 密集型场景高效（并发处理上万连接）

**缺点：**

- **CPU 密集型任务会阻塞事件循环**，整个应用冻住
- 无法利用多核 CPU（除非自己 fork 多进程）

### 阻塞事件循环的示例与规避

```js
// ❌ 坏例子：同步大计算，阻塞事件循环
app.get("/compute", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i; // 阻塞 N 秒！期间所有请求被卡住
  res.send(String(sum));
});

// ✓ 好例子 1：把耗时任务放到 Worker 线程
const { Worker } = require("worker_threads");

// ✓ 好例子 2：把 CPU 密集型任务分片执行（setImmediate 让出事件循环）
function computeAsync(n, cb) {
  let sum = 0,
    i = 0;
  (function step() {
    const end = Math.min(i + 1e6, n);
    for (; i < end; i++) sum += i;
    if (i < n)
      setImmediate(step); // 每计算 100 万步让一次事件循环
    else cb(sum);
  })();
}
```

### child_process：多进程

`child_process` 模块用于**创建子进程**（执行 shell 命令、跑另一个 Node 脚本等）。

```js
const { exec, execFile, spawn, fork } = require("child_process");

// 1. exec：执行 shell 命令，缓冲输出，适合小输出
exec("ls -la", (err, stdout, stderr) => console.log(stdout));

// 2. execFile：执行可执行文件（不走 shell，更安全）
execFile("node", ["--version"], (err, stdout) => console.log(stdout));

// 3. spawn：流式输出，适合大输出/长时间运行
const ls = spawn("ls", ["-la"]);
ls.stdout.on("data", (chunk) => process.stdout.write(chunk));
ls.stderr.on("data", (chunk) => process.stderr.write(chunk));

// 4. fork：专门 fork 一个 Node 子进程，建立 IPC 通道可通信
// parent.js
const child = fork("./child.js");
child.send({ hello: "world" }); // 通过 IPC 发消息
child.on("message", (msg) => console.log("from child", msg));

// child.js
process.on("message", (msg) => {
  process.send({ result: heavyCompute(msg) }); // 子进程做重计算，不阻塞父进程
});
```

**`spawn` vs `exec` vs `execFile` vs `fork`：**

| API      | 走 shell      | 返回       | IPC | 适用场景                                |
| -------- | ------------- | ---------- | --- | --------------------------------------- |
| spawn    | 默认 no       | Stream     | no  | 大输出、长时间运行的命令                |
| exec     | yes           | buffer     | no  | 短命令、需要 shell 语法（管道、重定向） |
| execFile | no            | buffer     | no  | 直接执行二进制文件                      |
| fork     | no（走 node） | 子进程实例 | yes | fork 新 Node 进程，双向通信             |

### cluster：利用多核 CPU

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

### worker_threads：同进程多线程

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

## 文件系统 I/O

### fs 模块的三种 API 风格

```js
const fs = require('fs');

// 1. 回调（异步，不阻塞事件循环）—— 推荐
fs.readFile('/path', 'utf8', (err, data) => { ... });

// 2. 同步（阻塞事件循环，只应在启动初始化时使用）
try {
  const data = fs.readFileSync('/path', 'utf8');
} catch (err) { ... }

// 3. Promise 风格（Node 10+）—— 与 async/await 搭配最佳
const fsp = require('fs/promises');
(async () => {
  const data = await fsp.readFile('/path', 'utf8');
})();
```

### 文件描述符（File Descriptor）

Unix 哲学「一切皆文件」。每个打开的文件/套接字都对应一个非负整数 fd。用完必须关，否则会耗尽文件句柄。

```js
fs.open("file.txt", "r", (err, fd) => {
  if (err) throw err;
  fs.read(fd, Buffer.alloc(1024), 0, 1024, 0, (err, bytesRead, buf) => {
    // ...
    fs.close(fd, () => {}); // 必须关闭
  });
});
```

### 路径处理：path 模块

```js
const path = require("path");

path.join("/a", "b", "..", "c"); // '/a/c'  按平台拼接
path.resolve("a", "b", "/c"); // '/c'    从右往左找到第一个绝对路径
path.basename("/a/b/c.txt", ".txt"); // 'c'
path.dirname("/a/b/c.txt"); // '/a/b'
path.extname("/a/b/c.txt"); // '.txt'
path.parse("/a/b/c.txt"); // { root, dir, base, ext, name }
path.isAbsolute("/a"); // true
path.relative("/a/b", "/a/c/d"); // '../c/d'

// 重要：__dirname 是当前文件目录，用 path.join(__dirname, '../static') 才跨平台安全
```

### `__dirname` vs `./` 的陷阱

在 CommonJS 中：

- `__dirname` 始终是**当前文件所在目录的绝对路径**
- `./` 在 `require('./xxx')` 中是「当前文件目录」，但在 `fs.readFile('./xxx')` 中是「进程 cwd」

```js
// 如果你 cd 到 /home 再执行 node src/app.js
// 那么：
require("./utils"); // 加载 /home/src/utils.js（相对于当前文件）
fs.readFile("./data"); // 读取 /home/data（相对于 process.cwd()）！
```

**最佳实践**：读写文件永远用 `path.join(__dirname, 'data')` 或 `path.resolve(process.cwd(), 'data')`，别用裸 `./`。

## HTTP 与网络

### 一个最简单的 HTTP 服务器

```js
const http = require("http");

const server = http.createServer((req, res) => {
  // req 是 IncomingMessage（可读流），res 是 ServerResponse（可写流）
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Hello, Node.js");
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:3000/");
});
```

### request / response 对象

- **request**：`method`、`url`、`headers`（小写）、`httpVersion`、可读流 body、`socket`
- **response**：`statusCode`、`setHeader(name, val)`、`writeHead(code, headers)`、`write(chunk)`、`end(chunk)`、可写流

### Keep-Alive 与连接复用

默认 HTTP/1.1 `Connection: keep-alive`，同一个 TCP 连接可以发多个 HTTP 请求：

```js
// 客户端请求，底层的 http.Agent 默认 keepAlive:false（每次新建连接）
const http = require('http');
const agent = new http.Agent({ keepAlive: true, maxSockets: 10 });
http.get({ agent, hostname: 'a.com', path: '/' }, res => { ... });
```

### Node.js 为什么适合高并发 I/O

Node 的 HTTP 服务器底层由 libuv 的异步网络 I/O 驱动。每个连接不会占用一个线程，只是一个 `uv_tcp_t` 句柄+回调。当数据到达时，内核通过 epoll/kqueue 通知 libuv，libuv 把回调放入事件循环，Node 在主线程执行 JS。

**典型连接数 VS 线程数：**

- 传统线程模型：1 万并发连接 = 1 万个线程（每个线程栈 8MB → 80GB 内存）
- Node：1 万并发连接 = 1 个主线程 + 少量线程池句柄（内存几十 MB）

### 常见面试题

**Q1：`listen` 的 backlog 参数是什么？**

内核中「已完成三次握手但还没被 `accept()`」的队列长度。Node 默认 511。如果大量并发连接瞬间涌入且 Node 来不及 accept，队列会被撑满，后续连接会被丢弃（表现为 ECONNREFUSED / ETIMEDOUT）。

**Q2：如何处理 request body？**

```js
// 原生方式：req 是 Readable Stream，需要自己收集 data
let body = "";
req.on("data", (chunk) => (body += chunk));
req.on("end", () => console.log(JSON.parse(body)));

// Express 里用 body-parser / express.json() 中间件自动处理
```

**Q3：Express/Koa 中间件模型？**

```js
// Express：回调式
app.use((req, res, next) => {
  console.log("before");
  next(); // 把控制权交给下一个中间件
  console.log("after"); // 下一个中间件同步返回后执行
});

// Koa：洋葱模型（async/await 可优雅地「包裹」后续中间件）
app.use(async (ctx, next) => {
  console.log("1 before");
  await next(); // 交出执行权，等所有后续中间件完成才回来
  console.log("1 after");
});
```

## Buffer 与二进制

### Buffer 是什么

Buffer 是 Node.js 中处理**二进制数据**的类，本质是 V8 堆外内存（由 C++ 层 `Buffer::New` 分配，不由 V8 GC 管理）。

```js
// 创建
Buffer.alloc(10); // 10 字节的 0
Buffer.allocUnsafe(10); // 10 字节随机内容（更快但有安全隐患）
Buffer.from("hello", "utf8"); // 从字符串创建
Buffer.from([0x68, 0x65, 0x6c]); // 从字节数组创建

// 读写
const buf = Buffer.from("Hello");
buf[0]; // 72（'H' 的 ASCII）
buf.toString(); // 'Hello'
buf.toString("hex"); // '48656c6c6f'
buf.toString("base64"); // 'SGVsbG8='
buf.slice(0, 2); // 'He'（与 Array.slice 不同，Buffer.slice 共享内存！）

// 工具方法
Buffer.isBuffer(x);
Buffer.byteLength("你好", "utf8"); // 6（中文 utf8 占 3 字节）
```

### Buffer.slice 共享内存的陷阱

```js
const a = Buffer.from("Hello");
const b = a.slice(0, 2); // b 指向 a 的同一块内存！
b[0] = 0x4a; // 'J'
console.log(a.toString()); // 'Jello'   a 也被改了！
```

Node.js 20+ 提供 `subarray`（共享）和 `subarray` 显式语义。需要独立副本时用 `Buffer.from(buf)`。

### 字符编码

Buffer 支持：`utf8`（默认）、`utf16le`、`latin1`、`binary`（= latin1）、`ascii`、`hex`、`base64`、`base64url`

**注意**：`utf8` 是变长编码（1-4 字节），当数据从网络分片到达时，切分位置可能正好处在多字节字符中间，导致乱码。Node 的 `StringDecoder` 专门解决此问题。

```js
const { StringDecoder } = require("string_decoder");
const dec = new StringDecoder("utf8");
console.log(dec.write(Buffer.from([0xe4]))); // ''  （不完整的"你"字，先缓存）
console.log(dec.write(Buffer.from([0xbd, 0xa0]))); // '你'
```

## 错误处理与调试

### Node.js 中错误的传播路径

1. **同步代码**：`throw new Error('xx')` → 用 `try/catch` 捕获
2. **回调风格**：第一个参数 `err`
3. **Promise / async**：`promise.catch()` 或 `try/catch` 包裹 `await`
4. **EventEmitter**：监听 `error` 事件（不监听则进程崩溃）
5. **未捕获错误**：被 `process.on('uncaughtException')` / `process.on('unhandledRejection')` 兜底（仅用于记录日志，然后应退出进程）

```js
process.on("uncaughtException", (err) => {
  console.error("Uncaught", err);
  process.exit(1); // 进程状态已不可靠，必须退出
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at", promise, "reason", reason);
  // Node 15+ 默认行为：未处理的 Promise reject 会让进程退出（像未捕获异常）
});
```

### 错误优先的最佳实践

```js
// ✓ 每一个回调都检查 err
fs.readFile(path, (err, data) => {
  if (err) {
    // 正确处理：向上传递 / 记录日志 / 给用户友好响应
    return callback(err);
  }
  // ...
});

// ✓ async 函数用 try/catch
async function safe() {
  try {
    await risky();
  } catch (err) {
    logger.error(err);
    throw new AppError("操作失败", 500); // 包装成业务错误
  }
}

// ✓ 区分可恢复错误（EEXIST 文件已存在）和系统错误（ENOMEM）
if (err.code === "ENOENT") {
  /* 文件不存在 */
}
if (err.code === "EADDRINUSE") {
  /* 端口被占 */
}
```

### 调试：inspector

```bash
node --inspect app.js            # 启动 inspector，默认 127.0.0.1:9229
node --inspect-brk app.js        # 在第一行断点
```

然后在 Chrome 打开 `chrome://inspect`，或用 VS Code 「Attach to Node Process」。

### 性能分析

```bash
node --prof app.js                 # 生成 v8.log
node --prof-process v8.log > out   # 解析为可读报告
node --cpu-prof app.js             # 生成 .cpuprofile，可在 Chrome DevTools 查看
node --heap-prof app.js            # 生成 .heapprofile
```

## 模块与包管理

### package.json 字段速查

```json
{
  "name": "my-pkg",
  "version": "1.0.0", // semver：主.次.修订
  "main": "index.js", // CommonJS 入口
  "module": "index.mjs", // ESM 入口（打包工具用）
  "exports": {
    // Node 14+，精确控制导出
    ".": "./index.js",
    "./utils": "./utils.js"
  },
  "type": "module", // 全项目默认 ESM
  "scripts": {
    // 脚本
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    // 生产依赖
    "express": "^4.18.0"
  },
  "devDependencies": {
    // 开发依赖
    "jest": "^29.0.0"
  },
  "peerDependencies": {
    // 由宿主提供的依赖
    "react": ">=18"
  },
  "optionalDependencies": {
    // 可选，安装失败不影响
    "fsevents": "*"
  },
  "engines": { "node": ">=18" }, // 声明支持的 Node 版本
  "bin": { "mycli": "./bin/cli" } // 注册 CLI 命令
}
```

### SemVer（语义化版本）

格式：`主版本.次版本.修订号`

- **主版本**：破坏性变更（不兼容的 API 改动）
- **次版本**：向后兼容的新增功能
- **修订号**：向后兼容的 bug 修复

**版本范围符号：**

| 符号        | 含义                   | 示例            | 匹配             |
| ----------- | ---------------------- | --------------- | ---------------- |
| `^`         | 不改变最左边的非零数字 | `^1.2.3`        | `>=1.2.3 <2.0.0` |
| `~`         | 次版本不变             | `~1.2.3`        | `>=1.2.3 <1.3.0` |
| `*`         | 任意版本               | `*`             | 所有             |
| `>` `<` `=` | 大小比较               | `>1.2.3`        | 大于 1.2.3       |
| `-`         | 区间                   | `1.2.3 - 1.4.0` | 闭区间           |

### npm vs yarn vs pnpm

|                     | npm                 | yarn                            | pnpm                                  |
| ------------------- | ------------------- | ------------------------------- | ------------------------------------- |
| 出现时间            | 2010                | 2016（解决 npm 早期一致性问题） | 2017（解决磁盘/安装速度）             |
| 锁文件              | `package-lock.json` | `yarn.lock`                     | `pnpm-lock.yaml`                      |
| 安装策略            | 扁平 `node_modules` | 扁平 `node_modules`             | **内容寻址存储 + 硬链接**，不重复复制 |
| 磁盘占用            | 每个项目独立复制    | 每个项目独立复制                | **全局一份**，项目通过硬链接引用      |
| 安装速度            | 慢                  | 较快                            | **最快（并行 + 无需复制）**           |
| `node_modules` 结构 | 扁平，可能幽灵依赖  | 扁平，可能幽灵依赖              | **严格（非扁平）**，避免幽灵依赖      |
| 支持 workspace      | 有                  | 有                              | **原生优秀**                          |

**pnpm 为什么更省磁盘？**

- 所有包的所有版本都存放在 `~/.local/share/pnpm/store` 全局一份
- 每个项目的 `node_modules` 通过硬链接指向仓库，而不是复制文件
- 使用符号链接（symlink）构建依赖树，严格符合 `package.json` 声明的依赖

## 内存管理与性能优化

### V8 内存结构

```
┌────────────────────── V8 Heap（受 max-old-space-size 限制） ──────────────────────┐
│                                                                                    │
│  New Space（新生代，~16MB，Scavenge 算法）                                          │
│    ├── to-space                                                                   │
│    └── from-space  ← 存活对象在两者之间复制（年龄够大晋升到老生代）                  │
│                                                                                    │
│  Old Space（老生代，默认约 1.4GB，Mark-Sweep + Mark-Compact）                       │
│    ├── Old Object Space（长生命周期对象）                                           │
│    └── Large Object Space（超过 Page 大小的对象，不被移动）                          │
│                                                                                    │
│  Code Space（即时编译后的机器码）                                                   │
│  Map Space（隐藏类 / Shape，描述对象结构）                                          │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
                                    ↓ 堆外内存（不受 GC 管理）
                                  Buffer、C++ 扩展、libuv、文件句柄等
```

**调整 V8 内存上限（处理大内存任务）：**

```bash
node --max-old-space-size=4096 app.js   # 单位 MB，默认 64 位机器约 1.4GB
```

### 内存泄漏常见原因 & 排查

**典型泄漏点：**

1. **全局变量缓存无限增长**

   ```js
   const cache = {}; // ❌ 永远不会被回收
   app.get("/:id", (req, res) => {
     cache[req.params.id] = heavyData;
     res.json(cache);
   });
   // ✓ 用有限容量的 LRU cache：lru-cache 库
   ```

2. **闭包意外持有大对象引用**
3. **未取消的定时器 / 未移除的监听器**

   ```js
   emitter.on("data", handler); // 忘记 off，emitter 一直持有 handler 的闭包
   setInterval(fn, 1000); // 忘记 clearInterval
   ```

4. **大量未关闭的文件句柄 / 数据库连接**

**排查：**

```bash
node --inspect app.js
# 打开 Chrome DevTools → Memory 标签 → 拍 heap snapshot
# 对比两次 snapshot，看哪些对象数量持续增长
```

### 阻塞事件循环的识别

```js
// 简单自测：打印事件循环滞后时间
setInterval(() => {
  const start = Date.now();
  setImmediate(() => console.log("Loop lag:", Date.now() - start, "ms"));
}, 1000);
// 正常 < 10ms；如果经常 > 100ms，说明有同步代码在阻塞
```

**常见阻塞元凶：**

- JSON.parse/JSON.stringify 超大对象
- 正则回溯（ReDoS）
- 加密/压缩等 CPU 密集计算
- `fs.readFileSync` 在热路径
- 超大 `for` 循环

**解决：**

- 分片（setImmediate 切分长循环）
- 交给 Worker（worker_threads）
- 用 Rust/C++ 写原生扩展（n-api）
- 用 queue 限制并发（`p-limit`、`async.queue`）

## 安全

### 常见安全问题

1. **命令注入（Command Injection）**

   ```js
   // ❌ 危险：用户输入拼进 shell 命令
   exec(`cat ${userInput}`, ...);  // userInput = "; rm -rf /;
   // ✓ 安全：用 execFile + 参数数组
   execFile('cat', [userInput], ...);
   ```

2. **路径穿越（Path Traversal）**

   ```js
   // ❌ 危险：用户输入可能是 "../../etc/passwd"
   res.sendFile(`./public/${req.query.file}`);
   // ✓ 安全：path.resolve 后校验是否在允许目录下
   const full = path.resolve("./public", req.query.file);
   if (!full.startsWith(path.resolve("./public"))) return res.status(400).end();
   ```

3. **原型链污染（Prototype Pollution）**

   ```js
   // ❌ 危险：递归合并时未检查 Object.prototype
   function merge(target, src) {
     for (const k in src) target[k] = src[k];
   }
   merge({}, JSON.parse('{"__proto__": {"admin": true}}'));
   console.log({}.admin); // true！全局污染
   // ✓ 安全：用 Object.create(null) 做字典，或 lodash 已修复版本
   ```

4. **同步 API 在请求处理中使用 → DoS**
5. **未限制请求体大小 → OOM**
6. **`eval` / `new Function` 处理用户输入 → 代码注入**

### 实用安全工具

- `helmet`：设置安全 HTTP 头
- `express-rate-limit`：限流
- `express-mongo-sanitize`：清理 NoSQL 注入
- `joi` / `zod`：输入校验
- `nsp` / `npm audit` / `snyk`：依赖漏洞扫描

## Node.js 版本与特性速览

| 版本 | 发布时间 | 关键特性                                                                  |
| ---- | -------- | ------------------------------------------------------------------------- |
| 8.x  | 2017     | 原生 async/await、N-API、http2                                            |
| 10.x | 2018     | fs.promises、worker_threads（实验性）、TLS 1.3                            |
| 12.x | 2019     | ESM 稳定、`--experimental-modules` 去掉、V8 7.4                           |
| 14.x | 2020     | 原生 ESM（.mjs / `"type":"module"`）、顶级 await、Stream.pipeline 稳定    |
| 16.x | 2021     | V8 9.0、fetch（实验性）、Timers Promise API、npm 7 + workspaces           |
| 18.x | 2022 LTS | 全局 `fetch`、`Web Streams`、`test` 模块（原生测试框架）、OpenSSL 3       |
| 20.x | 2023 LTS | V8 11.3、`--experimental-wasi-unstable-preview1`、`node:sea` 单文件可执行 |
| 22.x | 2024     | require() 支持 ESM、`node:sqlite` 内置、V8 12.4、性能优化                 |

**LTS 周期**：偶数版本为 LTS，维护 30 个月（18 个月 Active + 12 个月 Maintenance）。奇数版本每 6 个月发布一次，仅短期支持。

## 常见面试题精选

**Q1：Node.js 为什么能高并发？**

因为 Node.js 使用 **异步非阻塞 I/O + 事件循环**：

- 所有耗时的 I/O 操作（文件、网络、DNS、数据库）都由操作系统内核或 libuv 线程池处理
- 主线程（JS 执行）不等待 I/O 完成，注册回调后立即继续处理下一个请求
- I/O 完成后，内核通过 epoll/kqueue/IOCP 通知 libuv，再由事件循环把回调放到主线程执行
- 所以单线程的 JS 可以同时并发处理数万连接

**Q2：什么场景不适合用 Node.js？**

- **CPU 密集型**应用：大量数学计算、视频编码、机器学习推理（会阻塞事件循环，把并发能力拖垮）
- 这类任务适合交给：worker_threads、独立的计算服务（Python/C++/Rust）、消息队列异步处理

**Q3：说说 process 对象里你熟悉的属性/方法？**

- `process.argv`：命令行参数数组 `[node, script, ...args]`
- `process.env`：环境变量对象
- `process.cwd()`：当前工作目录
- `process.pid` / `process.ppid`：进程 ID
- `process.exit(code)`：退出进程（谨慎在请求处理中调用）
- `process.on('uncaughtException')` / `process.on('unhandledRejection')`：全局错误兜底
- `process.nextTick(fn)`：插入微任务
- `process.memoryUsage()`：`rss / heapTotal / heapUsed / external`
- `process.uptime()`：进程运行秒数
- `process.platform` / `process.arch` / `process.version`

**Q4：`process.nextTick` vs `setImmediate` vs `setTimeout(0)` 的执行顺序？**

经典例子（在主模块同步执行时）：

```js
process.nextTick(() => console.log("nextTick"));
setImmediate(() => console.log("immediate"));
setTimeout(() => console.log("timeout"), 0);
console.log("sync");
// 输出：sync → nextTick → timeout → immediate  （timeout 和 immediate 顺序不稳定）
```

- `nextTick`：同步代码执行完立刻执行（微任务，优先级最高）
- `setTimeout(0)`：timers 阶段执行（实际上最小延迟 1ms）
- `setImmediate`：check 阶段执行（在 poll 之后）

**Q5：Express 的中间件是如何工作的？手写一个简化版？**

```js
// 简化版：维护一个中间件数组，依次调用
class MiniExpress {
  constructor() {
    this.middlewares = [];
  }
  use(fn) {
    this.middlewares.push(fn);
  }
  handle(req, res) {
    let idx = 0;
    const next = (err) => {
      if (err) return this._error(err, req, res);
      const fn = this.middlewares[idx++];
      if (fn) fn(req, res, next);
    };
    next();
  }
  _error(err, req, res) {
    /* 错误处理中间件（4 个参数） */
  }
}
```

**Q6：`Buffer.alloc`、`Buffer.allocUnsafe`、`Buffer.from` 的区别？**

- `alloc(n)`：分配 n 字节**全部填 0** 的 Buffer，安全但稍慢
- `allocUnsafe(n)`：分配 n 字节但**不初始化**，内容是随机旧数据（快但可能泄露敏感信息，使用前必须自行覆盖）
- `from(data)`：从字符串/数组/Buffer 复制数据生成新 Buffer

**Q7：Node.js 中 `require('fs')` 和 `require('node:fs')` 有什么区别？**

功能完全相同。`node:` 协议是 Node 14+ 引入的**核心模块前缀**，作用是：

1. 明确表示这是一个核心模块，避免与同名第三方包冲突
2. 让 Linter / 打包工具可以快速识别

**Q8：`require` 和 `import` 可以混用吗？**

- 在 **CommonJS 文件**中：不可以用 `import`（会报错）
- 在 **ESM 文件**中：不可以用 `require`（除非用 `module.createRequire` 手动创建）
- 可以在 ESM 中用 `import { createRequire } from 'module'` 创建一个「require 函数」来加载 CJS 模块

**Q9：libuv 线程池默认大小是多少？如何调大？**

默认 4。通过环境变量 `UV_THREADPOOL_SIZE` 设置（1~1024 之间，需在任何模块加载之前设置）。

线程池负责：文件 I/O、`dns.lookup`、加密函数 `crypto.pbkdf2/scrypt`、`zlib`。

**Q10：Node 20+ 的主要新特性？**

- Permission Model（权限模型，`--allow-fs-read` 等）
- 稳定的 Test Runner（`node --test`）
- `fetch` 全局稳定
- WebAssembly System Interface（WASI）预览 2
- 单文件可执行（SEA，Single Executable Application）
- V8 升级到 11.3+

## 实战题

**实战 1：实现一个带并发限制的 Promise 调度器**

```js
class Scheduler {
  constructor(limit = 2) {
    this.limit = limit;
    this.queue = [];
    this.running = 0;
  }
  add(promiseFn) {
    return new Promise((resolve) => {
      this.queue.push({ promiseFn, resolve });
      this._run();
    });
  }
  async _run() {
    if (this.running >= this.limit) return;
    const task = this.queue.shift();
    if (!task) return;
    this.running++;
    const result = await task.promiseFn();
    this.running--;
    task.resolve(result);
    this._run();
  }
}
```

**实战 2：实现一个 Promise.all 的简化版**

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    const total = promises.length;
    if (total === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;
        if (++completed === total) resolve(results);
      }, reject);
    });
  });
}
```

**实战 3：实现一个简易 EventEmitter**

```js
class EventEmitter {
  constructor() {
    this._events = Object.create(null);
  }
  on(event, handler) {
    (this._events[event] ||= []).push(handler);
    return this;
  }
  off(event, handler) {
    const list = this._events[event];
    if (list) this._events[event] = list.filter((h) => h !== handler);
    return this;
  }
  once(event, handler) {
    const wrap = (...args) => {
      this.off(event, wrap);
      handler.apply(this, args);
    };
    return this.on(event, wrap);
  }
  emit(event, ...args) {
    const list = this._events[event];
    if (list) list.slice().forEach((h) => h.apply(this, args));
    return true;
  }
}
```
