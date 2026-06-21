---
title: 请求与响应处理
---

# 请求与响应处理

## 一、Request 对象

### 1. 常用属性

```javascript
app.get('/api', (req, res) => {
  req.method;          // 'GET'
  req.url;             // '/api?foo=bar'
  req.path;            // '/api'
  req.hostname;        // 'example.com'
  req.ip;              // '127.0.0.1'
  req.protocol;        // 'http' / 'https'
  req.secure;          // false（是否 HTTPS）
  req.xhr;             // false（是否 AJAX）
  req.headers;         // 请求头对象
  req.get('User-Agent'); // 获取指定请求头
});
```

### 2. 路径参数

```javascript
app.get('/users/:id/posts/:postId', (req, res) => {
  console.log(req.params);
  // { id: '123', postId: '456' }
});
```

### 3. 查询参数

```javascript
app.get('/search', (req, res) => {
  console.log(req.query);
  // GET /search?q=node&page=2&tags=js&tags=node
  // { q: 'node', page: '2', tags: ['js', 'node'] }
});
```

### 4. 请求体

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/data', (req, res) => {
  console.log(req.body);  // POST body
});
```

### 5. Cookies

```bash
npm install cookie-parser
```

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', (req, res) => {
  console.log(req.cookies);          // 所有 cookies
  console.log(req.cookies.sessionId);
});

app.get('/set', (req, res) => {
  res.cookie('name', 'Alice', {
    maxAge: 900000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.send('Cookie 已设置');
});
```

### 6. 文件上传

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('avatar'), (req, res) => {
  console.log(req.file);
  // { fieldname, originalname, encoding, mimetype, size, destination, filename, path }
});

app.post('/photos', upload.array('photos', 12), (req, res) => {
  console.log(req.files);  // 文件数组
});
```

---

## 二、Response 对象

### 1. 发送响应

```javascript
// 发送字符串
res.send('Hello');

// 发送 JSON
res.json({ message: 'success' });

// 发送 JSONP
res.jsonp({ data: 'value' });

// 发送状态码
res.sendStatus(200);  // 'OK'
res.sendStatus(404);  // 'Not Found'
res.sendStatus(500);  // 'Internal Server Error'

// 结束响应
res.end();
```

### 2. 状态码

```javascript
res.status(200).send('OK');
res.status(201).json({ id: 1 });
res.status(404).send('Not Found');
res.status(500).json({ error: '服务器错误' });
```

### 3. 设置响应头

```javascript
res.set('Content-Type', 'text/html');
res.set({
  'Content-Type': 'text/html',
  'X-Custom-Header': 'value'
});

// 快捷方法
res.type('json');       // Content-Type: application/json
res.type('html');       // Content-Type: text/html
res.type('png');        // Content-Type: image/png

// 附件
res.attachment('file.txt');  // Content-Disposition: attachment
res.download('path/to/file.txt');
res.download('path/to/file.txt', 'custom-name.txt');
```

### 4. 重定向

```javascript
res.redirect('/new-path');
res.redirect('https://example.com');
res.redirect(301, '/permanent');  // 永久重定向
res.redirect('back');              // 返回上一页
```

### 5. Cookie 操作

```javascript
// 设置
res.cookie('name', 'value', {
  maxAge: 86400000,    // 1 天（毫秒）
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  domain: 'example.com',
  path: '/'
});

// 清除
res.clearCookie('name');
```

### 6. 文件响应

```javascript
// 发送文件
res.sendFile('/path/to/file.pdf');

// 带配置
res.sendFile('file.pdf', {
  root: __dirname + '/files',
  headers: {
    'x-timestamp': Date.now()
  }
});
```

---

## 三、模板渲染

```javascript
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    title: '首页',
    users: [{ name: 'Alice' }, { name: 'Bob' }]
  });
});
```

---

## 四、请求-响应完整示例

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// 获取用户列表
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  // 模拟数据库查询
  res.json({
    data: [],
    pagination: { page: Number(page), limit: Number(limit), total: 0 },
    search
  });
});

// 创建用户
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'name 和 email 是必填字段'
    });
  }

  const user = { id: Date.now(), name, email };
  res.status(201)
     .location(`/api/users/${user.id}`)
     .json(user);
});

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  // 模拟查找
  if (id === '0') {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json({ id, name: 'Alice', email: 'alice@example.com' });
});

app.listen(3000);
```

---

## 五、链式路由

```javascript
app.route('/book')
  .get((req, res) => {
    res.send('获取所有图书');
  })
  .post((req, res) => {
    res.send('创建图书');
  })
  .put((req, res) => {
    res.send('更新图书');
  })
  .delete((req, res) => {
    res.send('删除图书');
  });
```

---

## 六、下一步

- 上一章：[中间件机制](/web/nodejs/express/02-middleware/)
- 下一章：[错误处理](/web/nodejs/express/04-error-handling/)
