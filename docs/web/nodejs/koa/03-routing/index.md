---
title: Koa 路由与常用中间件
---

# Koa 路由与常用中间件

## 一、koa-router

Koa 本身不包含路由，需要安装 `koa-router` 或 `@koa/router`：

```bash
npm install @koa/router
```

### 1. 基本路由

```javascript
const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = '首页';
});

router.get('/users', (ctx) => {
  ctx.body = [{ id: 1, name: 'Alice' }];
});

router.post('/users', (ctx) => {
  ctx.body = { message: '创建成功' };
});

router.put('/users/:id', (ctx) => {
  ctx.body = { message: `更新 ${ctx.params.id}` };
});

router.delete('/users/:id', (ctx) => {
  ctx.status = 204;
});

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());  // 自动响应 OPTIONS

app.listen(3000);
```

### 2. 路由参数

```javascript
router.get('/users/:id', (ctx) => {
  console.log(ctx.params.id);  // '123'
});

router.get('/search', (ctx) => {
  console.log(ctx.query);  // { q: 'keyword', page: '1' }
});
```

### 3. 路由前缀

```javascript
const router = new Router({
  prefix: '/api'
});

router.get('/users', (ctx) => {
  ctx.body = [];  // /api/users
});
```

### 4. 多个中间件

```javascript
router.get('/protected',
  authMiddleware,
  permissionMiddleware,
  (ctx) => {
    ctx.body = '受保护的内容';
  }
);
```

---

## 二、模块化路由

```javascript
// routes/users.js
const Router = require('@koa/router');
const router = new Router({ prefix: '/users' });

router.get('/', (ctx) => {
  ctx.body = [];
});

router.get('/:id', (ctx) => {
  ctx.body = { id: ctx.params.id };
});

module.exports = router;
```

```javascript
// app.js
const Koa = require('koa');
const userRoutes = require('./routes/users');

const app = new Koa();

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.listen(3000);
```

---

## 三、RESTful API 示例

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router({ prefix: '/api/users' });

app.use(bodyParser());

let users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' }
];

// 获取所有
router.get('/', (ctx) => {
  ctx.body = users;
});

// 获取单个
router.get('/:id', (ctx) => {
  const user = users.find(u => u.id === parseInt(ctx.params.id));
  if (!user) ctx.throw(404, '用户不存在');
  ctx.body = user;
});

// 创建
router.post('/', (ctx) => {
  const { name, email } = ctx.request.body;
  if (!name || !email) ctx.throw(400, 'name 和 email 必填');

  const user = { id: Date.now(), name, email };
  users.push(user);
  ctx.status = 201;
  ctx.body = user;
});

// 更新
router.put('/:id', (ctx) => {
  const index = users.findIndex(u => u.id === parseInt(ctx.params.id));
  if (index === -1) ctx.throw(404, '用户不存在');

  users[index] = { ...users[index], ...ctx.request.body };
  ctx.body = users[index];
});

// 删除
router.delete('/:id', (ctx) => {
  users = users.filter(u => u.id !== parseInt(ctx.params.id));
  ctx.status = 204;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
```

---

## 四、文件上传

```bash
npm install @koa/multer multer
```

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const multer = require('@koa/multer');

const app = new Koa();
const router = new Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (ctx) => {
  console.log(ctx.file);  // 文件信息
  ctx.body = { filename: ctx.file.filename };
});

router.post('/photos', upload.array('photos', 5), (ctx) => {
  console.log(ctx.files);
  ctx.body = { count: ctx.files.length };
});

app.use(router.routes());
app.listen(3000);
```

---

## 五、Cookie 与 Session

### 1. Cookie

```javascript
router.get('/set-cookie', (ctx) => {
  ctx.cookies.set('name', 'Alice', {
    maxAge: 86400000,  // 1 天
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  ctx.body = 'Cookie 已设置';
});

router.get('/get-cookie', (ctx) => {
  const name = ctx.cookies.get('name');
  ctx.body = { name };
});
```

### 2. Session

```bash
npm install koa-session
```

```javascript
const session = require('koa-session');

app.keys = ['secret-key'];  // 必须设置
app.use(session(app));

router.post('/login', (ctx) => {
  ctx.session.userId = 123;
  ctx.body = { message: '登录成功' };
});

router.get('/profile', (ctx) => {
  if (!ctx.session.userId) ctx.throw(401, '未登录');
  ctx.body = { userId: ctx.session.userId };
});

router.post('/logout', (ctx) => {
  ctx.session = null;
  ctx.body = { message: '已退出' };
});
```

---

## 六、下一步

- 上一章：[中间件](/web/nodejs/koa/02-middleware/)
- 下一章：[最佳实践](/web/nodejs/koa/04-best-practices/)
