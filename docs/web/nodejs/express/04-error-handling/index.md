---
title: Express 错误处理
---

# Express 错误处理

## 一、同步错误

同步代码抛出的错误会被 Express 自动捕获：

```javascript
app.get('/sync-error', (req, res) => {
  throw new Error('同步错误');  // 自动传递到错误处理中间件
});
```

---

## 二、异步错误

### Express 4：需要手动调用 `next(err)`

```javascript
app.get('/async-error', (req, res, next) => {
  fs.readFile('nonexistent.txt', (err, data) => {
    if (err) {
      return next(err);  // 手动传递错误
    }
    res.send(data);
  });
});

// Promise
app.get('/promise-error', (req, res, next) => {
  Promise.reject(new Error('Promise 错误'))
    .catch(next);  // 传递给错误处理
});
```

### Express 5：自动捕获 async 错误

```javascript
// Express 5 原生支持
app.get('/async', async (req, res) => {
  const data = await fs.promises.readFile('file.txt');
  res.send(data);
});
```

### Express 4 的 async 包装器

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
}));
```

或使用 `express-async-errors`：

```bash
npm install express-async-errors
```

```javascript
// 在入口文件顶部引入
require('express-async-errors');

// 之后 async 错误会自动捕获
app.get('/users', async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
});
```

---

## 三、错误处理中间件

错误处理中间件有 **4 个参数**（`err, req, res, next`）：

```javascript
// 必须放在所有路由之后
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});
```

### 多个错误处理器

```javascript
// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// 处理自定义错误
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }
  next(err);  // 传递给下一个错误处理器
});

// 处理其他错误
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: '内部服务器错误'
  });
});
```

---

## 四、自定义错误类

```javascript
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = '参数错误') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = '未授权') {
    super(message, 401);
  }
}

// 使用
app.get('/users/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new NotFoundError('用户不存在'));
  }
  res.json(user);
});
```

---

## 五、全局错误处理

### 1. 统一错误处理中间件

```javascript
// utils/errorHandler.js
function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // 记录错误日志
  console.error(err);

  // Mongoose 错误处理
  if (err.name === 'CastError') {
    const message = '资源不存在';
    error = new AppError(message, 404);
  }

  if (err.code === 11000) {
    const message = '字段值已存在';
    error = new AppError(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('无效的 token', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || '服务器错误'
  });
}

module.exports = errorHandler;
```

### 2. 404 处理

```javascript
// 放在所有路由之后，错误处理之前
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `路径 ${req.originalUrl} 不存在`
  });
});
```

---

## 六、未捕获异常处理

```javascript
process.on('uncaughtException', (err) => {
  console.error('未捕获异常:', err);
  // 记录日志后退出
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('未处理的 Promise 拒绝:', err);
  // 优雅关闭服务器
  server.close(() => process.exit(1));
});
```

---

## 七、完整示例

```javascript
const express = require('express');
require('express-async-errors');

const app = express();
app.use(express.json());

// 路由
app.get('/users/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) throw new NotFoundError('用户不存在');
  res.json(user);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: '路径不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || '服务器错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(3000);
```

---

## 八、下一步

- 上一章：[请求与响应处理](/web/nodejs/express/03-request-response/)
- 下一章：[最佳实践](/web/nodejs/express/05-best-practices/)
