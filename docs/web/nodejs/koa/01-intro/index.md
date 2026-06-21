---
title: Koa 入门与 Context
---

# Koa 入门与 Context

## 一、安装与 Hello World

```bash
mkdir my-koa-app && cd my-koa-app
npm init -y
npm install koa
```

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello, Koa!';
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 二、Koa vs Express

| 特性 | Express | Koa |
|------|---------|-----|
| 异步模型 | 回调 | async/await |
| 中间件 | 线性 | 洋葱模型 |
| 内置功能 | 较多（路由、静态文件等） | 极简（只提供核心） |
| Context | `req` / `res` 分离 | `ctx` 统一封装 |
| 错误处理 | 错误中间件 | try/catch |
| 体积 | 较大 | 小 |

> Koa 极简，路由、body 解析等都需要安装中间件。

---

## 三、Context（ctx）

Koa 将 Node.js 的 `req` 和 `res` 封装为 `ctx`：

```javascript
app.use(async (ctx) => {
  // 请求
  ctx.request;       // Koa 封装的请求
  ctx.req;           // 原生 Node.js 请求
  ctx.method;        // 'GET'
  ctx.url;           // '/path?query=1'
  ctx.path;          // '/path'
  ctx.query;         // { query: '1' }
  ctx.hostname;      // 'localhost'
  ctx.ip;            // '127.0.0.1'
  ctx.headers;       // 请求头
  ctx.get('User-Agent');  // 获取请求头

  // 响应
  ctx.response;      // Koa 封装的响应
  ctx.res;           // 原生 Node.js 响应
  ctx.status = 200;  // 状态码
  ctx.body = {};     // 响应体（自动 JSON 序列化）
  ctx.set('X-Custom', 'value');  // 设置响应头
  ctx.type = 'json'; // Content-Type
});
```

### ctx.body 的类型

```javascript
// 字符串
ctx.body = 'Hello';

// Buffer
ctx.body = Buffer.from('Hello');

// Stream
ctx.body = fs.createReadStream('file.txt');

// 对象/数组（自动 JSON）
ctx.body = { message: 'success' };
ctx.body = [1, 2, 3];

// null（无响应体）
ctx.body = null;
```

---

## 四、Hello World 进阶

```javascript
const Koa = require('koa');
const app = new Koa();

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// response
app.use(async (ctx) => {
  ctx.body = 'Hello, World!';
});

app.listen(3000);
```

---

## 五、TypeScript 支持

```bash
npm install koa
npm install -D typescript @types/koa @types/node tsx
```

```typescript
import Koa, { Context } from 'koa';

const app = new Koa();

app.use(async (ctx: Context) => {
  ctx.body = { message: 'Hello, TypeScript!' };
});

app.listen(3000);
```

---

## 六、下一步

- 下一章：[中间件（洋葱模型）](/web/nodejs/koa/02-middleware/)
- 上一级：[Koa 框架](/web/nodejs/koa/)
