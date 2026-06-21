---
title: Express 中间件
---

# Express 中间件机制

## 一、什么是中间件？

中间件（Middleware）是 Express 的核心概念，是一个接收请求-响应循环的函数。

```javascript
function middleware(req, res, next) {
  // 1. 处理请求
  // 2. 修改 req / res
  // 3. 结束响应（res.send()）
  // 4. 调用 next() 进入下一个中间件
}
```

```
请求 → 中间件1 → 中间件2 → 路由处理 → 响应
```

---

## 二、中间件分类

### 1. 应用级中间件

```javascript
const express = require('express');
const app = express();

// 对所有请求生效
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 只对特定路径生效
app.use('/api', (req, res, next) => {
  console.log('API 请求');
  next();
});
```

### 2. 路由级中间件

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log('路由级中间件');
  next();
});

router.get('/users', (req, res) => {
  res.json([]);
});

app.use('/api', router);
```

### 3. 错误处理中间件

错误处理中间件有 4 个参数：

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});
```

### 4. 内置中间件

| 中间件 | 说明 |
|--------|------|
| `express.json()` | 解析 JSON 请求体 |
| `express.urlencoded()` | 解析 URL 编码请求体 |
| `express.static()` | 提供静态文件 |

### 5. 第三方中间件

```bash
npm install cors morgan helmet
```

```javascript
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

app.use(cors());           // 跨域
app.use(morgan('dev'));    // 日志
app.use(helmet());         // 安全头
```

---

## 三、中间件执行顺序

中间件按**定义顺序**执行：

```javascript
app.use((req, res, next) => {
  console.log('1');
  next();
});

app.use((req, res, next) => {
  console.log('2');
  next();
});

app.get('/', (req, res) => {
  console.log('3');
  res.send('Hello');
});

// 请求 / 时输出：1 2 3
```

### 不调用 `next()` 的后果

```javascript
app.use((req, res, next) => {
  console.log('1');
  // 忘记调用 next()
  // 请求会卡住
});

app.get('/', (req, res) => {
  console.log('2');  // 永远不会执行
  res.send('Hello');
});
```

> ⚠️ 如果中间件没有结束响应（`res.send()`）或调用 `next()`，请求会一直挂起。

---

## 四、常见中间件示例

### 1. 日志中间件

```javascript
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
});
```

### 2. 鉴权中间件

```javascript
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: '未提供 token' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'token 无效' });
  }
}

// 应用到特定路由
app.get('/profile', auth, (req, res) => {
  res.json({ user: req.user });
});

// 应用到路由组
app.use('/api/admin', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '权限不足' });
  }
  next();
});
```

### 3. 限流中间件

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 分钟
  max: 100,                   // 每个 IP 最多 100 次请求
  message: { error: '请求过于频繁' }
});

app.use('/api', limiter);
```

### 4. CORS 中间件

```javascript
const cors = require('cors');

// 允许所有来源
app.use(cors());

// 自定义配置
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

## 五、自定义中间件模式

### 1. 带配置的中间件

```javascript
function logger(options = {}) {
  return (req, res, next) => {
    const format = options.format || ':method :url :status';
    res.on('finish', () => {
      const log = format
        .replace(':method', req.method)
        .replace(':url', req.url)
        .replace(':status', res.statusCode);
      console.log(log);
    });
    next();
  };
}

app.use(logger({ format: ':method :url - :status' }));
```

### 2. 条件中间件

```javascript
function unless(paths, middleware) {
  return function(req, res, next) {
    if (paths.some(path => req.path === path)) {
      return next();
    }
    return middleware(req, res, next);
  };
}

// 除登录接口外都需要鉴权
app.use(unless(['/login', '/register'], auth));
```

### 3. 异步中间件包装器

```javascript
// Express 4 不支持 async 中间件，需要包装
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
}));
```

> 💡 Express 5 原生支持 async 中间件。

---

## 六、中间件组合

```javascript
// 公共中间件
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API 路由
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/admin', auth, adminOnly, adminRoutes);

// 错误处理（最后）
app.use(notFound);
app.use(errorHandler);
```

---

## 七、下一步

- 上一章：[入门与路由](/web/nodejs/express/01-intro/)
- 下一章：[请求与响应处理](/web/nodejs/express/03-request-response/)
