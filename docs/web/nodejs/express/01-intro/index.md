---
title: Express 入门与路由
---

# Express 入门与路由

## 一、安装与 Hello World

### 1. 初始化项目

```bash
mkdir my-express-app && cd my-express-app
npm init -y
npm install express
```

### 2. 第一个应用

```javascript
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

运行：

```bash
node app.js
# 或使用 nodemon 热重载
npm install -D nodemon
npx nodemon app.js
```

### 3. TypeScript 支持

```bash
npm install -D typescript @types/express @types/node tsx
npx tsc --init
```

```typescript
import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, TypeScript!' });
});

app.listen(3000);
```

---

## 二、路由

### 1. 基本路由

```javascript
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

app.post('/users', (req, res) => {
  res.status(201).json({ message: '用户创建成功' });
});

app.put('/users/:id', (req, res) => {
  res.json({ message: `更新用户 ${req.params.id}` });
});

app.delete('/users/:id', (req, res) => {
  res.status(204).send();
});

app.patch('/users/:id', (req, res) => {
  res.json({ message: '部分更新' });
});
```

### 2. 路由参数

```javascript
// 路径参数
app.get('/users/:id', (req, res) => {
  console.log(req.params.id);  // '123'
});

// 查询参数
app.get('/search', (req, res) => {
  console.log(req.query.q);    // 'keyword'
  console.log(req.query.page); // '1'
});
// GET /search?q=keyword&page=1
```

### 3. 路由模式

```javascript
// 可选参数
app.get('/users/:id?', (req, res) => {
  if (req.params.id) {
    res.send(`用户 ${req.params.id}`);
  } else {
    res.send('所有用户');
  }
});

// 通配符
app.get('/files/*', (req, res) => {
  res.send(`文件路径: ${req.params[0]}`);
});

// 正则表达式
app.get(/.*fly$/, (req, res) => {
  res.send('匹配以 fly 结尾的路径');
});
```

### 4. 多个处理函数

```javascript
// 多个回调
app.get('/user',
  (req, res, next) => {
    console.log('第一个处理');
    next();
  },
  (req, res) => {
    res.send('第二个处理');
  }
);

// 数组形式
const middleware1 = (req, res, next) => { next(); };
const middleware2 = (req, res, next) => { next(); };
app.get('/post', [middleware1, middleware2], (req, res) => {
  res.send('文章');
});
```

---

## 三、Express Router

使用 `Router` 模块化路由：

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 定义路由（路径相对于挂载点）
router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: '创建成功' });
});

module.exports = router;
```

```javascript
// app.js
const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

// 挂载路由
app.use('/users', usersRouter);

app.listen(3000);
```

---

## 四、请求体解析

### 1. JSON

```javascript
app.use(express.json());

app.post('/api', (req, res) => {
  console.log(req.body);  // 解析后的 JSON 对象
  res.json({ received: req.body });
});
```

### 2. URL 编码

```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/form', (req, res) => {
  console.log(req.body);  // { name: 'Alice', age: '30' }
});
```

### 3. 文件上传

```bash
npm install multer
```

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);  // 文件信息
  res.json({ filename: req.file.filename });
});

app.post('/uploads', upload.array('files', 5), (req, res) => {
  console.log(req.files);  // 多个文件
});
```

---

## 五、静态文件

```javascript
// 提供静态文件
app.use(express.static('public'));

// 虚拟路径前缀
app.use('/static', express.static('public'));

// 多个目录
app.use(express.static('public'));
app.use(express.static('files'));
```

访问 `http://localhost:3000/image.png` 会返回 `public/image.png`。

---

## 六、模板引擎

### 1. EJS

```bash
npm install ejs
```

```javascript
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index', { title: '首页', user: { name: 'Alice' } });
});
```

`views/index.ejs`：

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1>Hello, <%= user.name %>!</h1>
</body>
</html>
```

### 2. Pug

```bash
npm install pug
```

```javascript
app.set('view engine', 'pug');
```

`views/index.pug`：

```pug
doctype html
html
  head
    title= title
  body
    h1 Hello, #{user.name}!
```

---

## 七、RESTful API 示例

```javascript
const express = require('express');
const app = express();

app.use(express.json());

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// 获取所有用户
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

// 创建用户
app.post('/api/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// 更新用户
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: '用户不存在' });
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// 删除用户
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 八、下一步

- 下一章：[中间件机制](/web/nodejs/express/02-middleware/)
- 上一级：[Express 框架](/web/nodejs/express/)
