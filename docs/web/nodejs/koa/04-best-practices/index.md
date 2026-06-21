---
title: Koa 最佳实践
---

# Koa 最佳实践

## 一、项目结构

```
src/
├── config/
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── utils/
└── app.js
```

---

## 二、错误处理

### 1. 全局错误处理中间件

```javascript
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    ctx.status = status;
    ctx.body = {
      error: err.message
    };
    // 记录日志
    if (status >= 500) {
      console.error(err);
    }
  }
});
```

### 2. 自定义错误类

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 使用
ctx.throw(404, '用户不存在');
// 或
throw new AppError('参数错误', 400);
```

### 3. 404 处理

```javascript
app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404 && !ctx.body) {
    ctx.body = { error: '路径不存在' };
  }
});
```

---

## 三、参数校验

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const validate = (schema) => async (ctx, next) => {
  const { error } = schema.validate(ctx.request.body);
  if (error) {
    ctx.throw(400, error.details[0].message);
  }
  await next();
};

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
});

router.post('/users', validate(userSchema), userController.create);
```

---

## 四、完整应用模板

```javascript
const Koa = require('koa');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const app = new Koa();

// 安全
app.use(helmet());
app.use(cors());

// 压缩
app.use(compress());

// 请求体解析
app.use(bodyParser());

// 静态文件
app.use(serve('./public'));

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.body = { error: '路径不存在' };
    }
  } catch (err) {
    ctx.status = err.statusCode || 500;
    ctx.body = { error: err.message };
    if (ctx.status >= 500) console.error(err);
  }
});

// 路由
const userRoutes = require('./routes/users');
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

// 全局错误事件
app.on('error', (err, ctx) => {
  console.error('全局错误:', err);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 五、下一步

- 上一章：[路由与常用中间件](/web/nodejs/koa/03-routing/)
- 下一级：[NestJS 入门](/web/nodejs/nestjs/01-intro/)
