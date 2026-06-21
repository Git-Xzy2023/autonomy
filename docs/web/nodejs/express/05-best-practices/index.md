---
title: Express 最佳实践
---

# Express 最佳实践

## 一、项目结构

```
my-app/
├── src/
│   ├── config/          # 配置
│   │   ├── index.js
│   │   └── database.js
│   ├── routes/          # 路由
│   │   ├── index.js
│   │   ├── user.routes.js
│   │   └── auth.routes.js
│   ├── controllers/     # 控制器
│   │   ├── user.controller.js
│   │   └── auth.controller.js
│   ├── services/        # 业务逻辑
│   │   ├── user.service.js
│   │   └── auth.service.js
│   ├── models/          # 数据模型
│   │   └── user.model.js
│   ├── middlewares/     # 中间件
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── utils/           # 工具函数
│   │   ├── logger.js
│   │   └── ApiError.js
│   └── app.js           # 应用入口
├── tests/
├── .env
├── .env.example
└── package.json
```

### 分层架构

```
请求 → 路由 → 控制器 → 服务 → 模型
         ↑                  ↓
         └── 响应 ←────────┘
```

- **路由**：定义 URL 与控制器的映射
- **控制器**：处理 HTTP 请求/响应，调用服务
- **服务**：业务逻辑
- **模型**：数据访问

```javascript
// routes/user.routes.js
const router = require('express').Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

router.get('/', auth, userController.getUsers);
router.post('/', userController.createUser);

module.exports = router;

// controllers/user.controller.js
const userService = require('../services/user.service');

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers(req.query);
  res.json(users);
};

// services/user.service.js
const User = require('../models/user.model');

exports.getUsers = async ({ page = 1, limit = 10 }) => {
  return User.find()
    .skip((page - 1) * limit)
    .limit(limit);
};
```

---

## 二、环境变量管理

```bash
npm install dotenv
```

```javascript
// src/config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
};
```

`.env`：

```
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
```

> ⚠️ `.env` 文件不要提交到 Git，添加到 `.gitignore`。

---

## 三、安全最佳实践

### 1. 使用 helmet

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 2. 限流

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// 全局限流
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// 登录接口更严格
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 小时
  max: 5,                     // 最多 5 次
  message: '登录尝试过多，请稍后再试'
});
app.use('/api/auth/login', loginLimiter);
```

### 3. 数据清洗

```bash
npm install express-mongo-sanitize xss-clean
```

```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.use(mongoSanitize());  // 防止 NoSQL 注入
app.use(xss());            // 防止 XSS
```

### 4. 参数校验

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0)
});

app.post('/users', validate(userSchema), userController.createUser);
```

---

## 四、性能优化

### 1. 压缩响应

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. 缓存

```javascript
// 设置缓存头
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));

// API 缓存
const apicache = require('apicache');
let cache = apicache.middleware;

app.get('/api/users', cache('5 minutes'), userController.getUsers);
```

### 3. 生产环境优化

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
  app.disable('x-powered-by');  // 隐藏 Express 标识
}
```

---

## 五、日志

```bash
npm install winston morgan
```

```javascript
const winston = require('winston');
const morgan = require('morgan');

// Winston 日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// HTTP 请求日志
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));
```

---

## 六、测试

```bash
npm install -D jest supertest
```

```javascript
// tests/user.test.js
const request = require('supertest');
const app = require('../src/app');

describe('User API', () => {
  test('GET /api/users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/users', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@test.com' });
    expect(res.statusCode).toBe(201);
  });
});
```

---

## 七、CORS 配置

```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的来源'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 八、完整应用模板

```javascript
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('express-async-errors');

const app = express();

// 安全
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// 限流
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// 解析请求体
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 压缩
app.use(compression());

// 静态文件
app.use(express.static('public', { maxAge: '1d' }));

// 路由
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));

// 404
app.use((req, res) => {
  res.status(404).json({ error: '路径不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || '服务器错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
```

---

## 九、下一步

- 上一章：[错误处理](/web/nodejs/express/04-error-handling/)
- 下一级：[Koa 入门](/web/nodejs/koa/01-intro/)
