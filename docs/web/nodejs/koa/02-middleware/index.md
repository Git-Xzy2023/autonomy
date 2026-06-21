---
title: Koa 中间件
---

# Koa 中间件（洋葱模型）

## 一、洋葱模型

Koa 中间件采用**洋葱模型**，请求和响应各经过一次中间件：

```
请求 →  中间件1 →  中间件2 →  中间件3 → 响应
         ↓         ↓         ↓
       next()   next()   响应处理
         ↓         ↓         ↑
         ←────────←─────────┘
```

```javascript
app.use(async (ctx, next) => {
  console.log('1 - 请求前');
  await next();
  console.log('1 - 响应后');
});

app.use(async (ctx, next) => {
  console.log('2 - 请求前');
  await next();
  console.log('2 - 响应后');
});

app.use(async (ctx, next) => {
  console.log('3 - 处理请求');
  ctx.body = 'Hello';
});

// 输出顺序：
// 1 - 请求前
// 2 - 请求前
// 3 - 处理请求
// 2 - 响应后
// 1 - 响应后
```

---

## 二、与 Express 中间件对比

### Express（线性）

```javascript
app.use((req, res, next) => {
  console.log('前');
  next();
  console.log('后');  // 在响应发送后执行
});
```

### Koa（洋葱）

```javascript
app.use(async (ctx, next) => {
  console.log('前');
  await next();
  console.log('后');  // 等待下游中间件完成
});
```

> Koa 的 `await next()` 让"响应后"逻辑更清晰，适合计时、日志等场景。

---

## 三、常见中间件

### 1. 错误处理

```javascript
// 错误处理中间件（放在最前）
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: err.message
    };
    ctx.app.emit('error', err, ctx);
  }
});

// 抛出错误
app.use(async (ctx) => {
  ctx.throw(400, '参数错误');
  ctx.throw(404, '用户不存在');
  ctx.throw(500, '服务器错误');
});
```

### 2. 响应时间

```javascript
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});
```

### 3. 日志

```javascript
app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.method} ${ctx.url} ${ctx.status}`);
});
```

---

## 四、常用第三方中间件

### 1. koa-bodyparser（请求体解析）

```bash
npm install koa-bodyparser
```

```javascript
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

app.use(async (ctx) => {
  console.log(ctx.request.body);  // 解析后的请求体
});
```

### 2. koa-static（静态文件）

```bash
npm install koa-static
```

```javascript
const serve = require('koa-static');
app.use(serve('./public'));
```

### 3. koa-helmet（安全）

```bash
npm install koa-helmet
```

```javascript
const helmet = require('koa-helmet');
app.use(helmet());
```

### 4. koa-compress（压缩）

```bash
npm install koa-compress
```

```javascript
const compress = require('koa-compress');
app.use(compress());
```

### 5. koa-cors（跨域）

```bash
npm install @koa/cors
```

```javascript
const cors = require('@koa/cors');
app.use(cors());
```

---

## 五、自定义中间件

### 1. 鉴权中间件

```javascript
function auth() {
  return async (ctx, next) => {
    const token = ctx.headers.authorization;
    if (!token) {
      ctx.throw(401, '未授权');
    }
    try {
      ctx.state.user = jwt.verify(token, 'secret');
      await next();
    } catch (err) {
      ctx.throw(401, 'token 无效');
    }
  };
}

app.use(auth());
```

### 2. 限流中间件

```javascript
const requests = new Map();

function rateLimit(windowMs, max) {
  return async (ctx, next) => {
    const ip = ctx.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip).filter(t => t > windowStart);
    if (timestamps.length >= max) {
      ctx.throw(429, '请求过于频繁');
    }

    timestamps.push(now);
    requests.set(ip, timestamps);
    await next();
  };
}

app.use(rateLimit(60000, 100));
```

---

## 六、中间件组合

```javascript
// compose 多个中间件
const compose = require('koa-compose');

const middleware1 = async (ctx, next) => { await next(); };
const middleware2 = async (ctx, next) => { await next(); };

const all = compose([middleware1, middleware2]);
app.use(all);
```

---

## 七、下一步

- 上一章：[入门与 Context](/web/nodejs/koa/01-intro/)
- 下一章：[路由与常用中间件](/web/nodejs/koa/03-routing/)
