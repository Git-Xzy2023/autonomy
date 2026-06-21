---
title: Node.js 入门与安装
---

# Node.js 入门与安装

## 一、什么是 Node.js？

Node.js 是基于 **V8 引擎**的 JavaScript 运行时（Runtime），让 JavaScript 能够在浏览器之外运行。

```
┌─────────────────────────────────┐
│          你的 JavaScript 代码          │
├─────────────────────────────────┤
│           Node.js API           │
├─────────────────────────────────┤
│            V8 引擎              │
├─────────────────────────────────┤
│         操作系统（OS）          │
└─────────────────────────────────┘
```

### 核心特性

- **事件驱动**：通过事件循环处理并发
- **非阻塞 I/O**：I/O 操作不会阻塞主线程
- **单线程**：主线程单线程执行，通过事件循环处理并发
- **跨平台**：支持 Windows、macOS、Linux

### 适合的场景

✅ I/O 密集型：API 服务、实时通信、文件处理
✅ 中间层：BFF（Backend For Frontend）
✅ 工具链：构建工具、CLI 工具
❌ CPU 密集型：视频编码、大规模计算（主线程会阻塞）

---

## 二、安装 Node.js

### 方式一：官方安装包（不推荐）

从 [nodejs.org](https://nodejs.org/) 下载安装包。

> 缺点：版本切换不方便，权限问题多。

### 方式二：nvm（推荐）

**nvm（Node Version Manager）** 允许你在同一台机器上安装和切换多个 Node.js 版本。

#### macOS / Linux

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 让 nvm 生效
source ~/.bashrc  # 或 ~/.zshrc
```

#### Windows

Windows 使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)，从 [Release 页面](https://github.com/coreybutler/nvm-windows/releases) 下载安装。

#### 常用命令

```bash
# 安装最新 LTS 版本（推荐生产使用）
nvm install --lts

# 安装指定版本
nvm install 20.10.0

# 切换版本
nvm use 20

# 查看已安装版本
nvm ls

# 设置默认版本
nvm alias default 20
```

### 方式三：fnm / volta（更快的替代品）

```bash
# fnm（Rust 实现，速度快）
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 20
fnm use 20

# volta（Rust 实现，自动切换版本）
curl https://get.volta.sh | bash
volta install node@20
```

---

## 三、LTS vs Current

| 版本类型 | 说明 | 适用场景 |
|----------|------|----------|
| **LTS**（Long Term Support） | 长期支持版，维护 30 个月 | 生产环境 |
| **Current** | 最新版，包含新特性 | 尝试新特性 |

> 💡 **生产环境务必使用 LTS 版本**。偶数版本号（18、20、22）会进入 LTS。

---

## 四、第一个 Node.js 程序

### 1. Hello World

创建 `hello.js`：

```javascript
console.log('Hello, Node.js!');

// 获取 Node.js 版本
console.log('Node 版本:', process.version);

// 获取平台信息
console.log('平台:', process.platform);
console.log('架构:', process.arch);
```

运行：

```bash
node hello.js
```

### 2. HTTP 服务器

创建 `server.js`：

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

运行：

```bash
node server.js
# 访问 http://localhost:3000
```

### 3. REPL 交互式环境

```bash
node
> 1 + 2
3
> const arr = [1, 2, 3]
> arr.map(x => x * 2)
[ 2, 4, 6 ]
```

---

## 五、Node.js 版本发展史

| 版本 | 发布年份 | 重要特性 |
|------|----------|----------|
| 0.x | 2009 | 诞生 |
| 4.x | 2015 | 合并 io.js，支持 ES6 |
| 8.x | 2017 | 引入 async_hooks，N-API |
| 10.x | 2018 | fs.promises，HTTP/2 稳定 |
| 12.x | 2019 | worker_threads 稳定 |
| 14.x | 2020 | ESM 实验性支持 |
| 16.x | 2021 | Apple Silicon 支持 |
| 18.x | 2022 | Fetch API，Web Streams |
| 20.x | 2023 | 权限模型，单文件可执行 |
| 22.x | 2024 | WebSocket 客户端，V8 12.4 |

---

## 六、REPL 与调试

### 1. REPL 常用命令

| 命令 | 作用 |
|------|------|
| `.help` | 查看帮助 |
| `.break` | 退出多行输入 |
| `.clear` | 清空上下文 |
| `.save file` | 保存 REPL 会话 |
| `.load file` | 加载文件到 REPL |
| `.exit` | 退出 |

### 2. 调试器

```bash
# 启动调试器
node inspect server.js

# Chrome DevTools 调试
node --inspect server.js
# 然后打开 chrome://inspect
```

### 3. VS Code 调试

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "program": "${workspaceFolder}/server.js"
    }
  ]
}
```

---

## 七、全局对象

Node.js 中的全局对象（无需 `require`）：

| 对象 | 说明 |
|------|------|
| `global` | 全局对象（类似浏览器的 `window`） |
| `process` | 进程对象 |
| `console` | 控制台输出 |
| `Buffer` | 二进制数据 |
| `setTimeout` / `setInterval` | 定时器 |
| `setImmediate` | 下一次事件循环执行 |
| `queueMicrotask` | 微任务 |
| `__dirname` | 当前文件所在目录（CJS） |
| `__filename` | 当前文件路径（CJS） |
| `require` | 加载模块（CJS） |
| `module` | 模块对象（CJS） |
| `exports` | 导出对象（CJS） |

```javascript
// 示例
console.log(__dirname);  // /Users/me/project
console.log(__filename); // /Users/me/project/app.js
console.log(process.cwd()); // 当前工作目录
console.log(process.env.NODE_ENV); // 环境变量
```

---

## 八、CommonJS vs ESM

Node.js 支持两种模块系统：

### CommonJS（默认）

```javascript
// 导出
module.exports = { add: (a, b) => a + b };
// 或
exports.add = (a, b) => a + b;

// 导入
const { add } = require('./math');
```

### ESM（ES Modules）

在 `package.json` 中添加 `"type": "module"`：

```javascript
// 导出
export const add = (a, b) => a + b;
export default { add };

// 导入
import { add } from './math.js';
import math from './math.js';
```

> 详细对比见 [02 模块系统](/web/nodejs/basics/02-modules/)。

---

## 九、下一步

- 下一章：[模块系统](/web/nodejs/basics/02-modules/)
- 上一级：[Node.js 基础](/web/nodejs/basics/)
