---
title: 安全
---

# 安全

## 一、依赖安全

### 1. 检查漏洞

```bash
# 检查 package.json 中的依赖漏洞
npm audit

# 自动修复
npm audit fix

# 强制修复（可能破坏兼容性）
npm audit fix --force
```

### 2. 使用 `npm ci`

生产环境使用 `npm ci` 替代 `npm install`：

```bash
npm ci  # 严格按照 package-lock.json 安装，更快更安全
```

---

## 二、HTTP 安全头

### 1. helmet

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());

// 自定义
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.example.com'],
    },
  },
}));
```

helmet 设置的安全头：

- `Content-Security-Policy`：防止 XSS
- `X-Frame-Options`：防止点击劫持
- `X-Content-Type-Options`：防止 MIME 嗅探
- `Strict-Transport-Security`：强制 HTTPS
- `X-DNS-Prefetch-Control`：DNS 预取控制

---

## 三、CORS 跨域

```javascript
const cors = require('cors');

// 允许所有
app.use(cors());

// 严格配置
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));
```

---

## 四、限流防刷

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// 全局限流
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 分钟
  max: 100,                   // 最多 100 次
  message: '请求过于频繁',
}));

// 登录接口更严格
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: '登录失败次数过多，请 1 小时后再试',
});
app.use('/api/auth/login', loginLimiter);
```

---

## 五、输入校验

### 1. Joi

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
});

const { error, value } = schema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

### 2. 防止 NoSQL 注入

```bash
npm install express-mongo-sanitize
```

```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());  // 移除 $ 和 . 开头的键
```

### 3. 防止 XSS

```bash
npm install xss-clean
```

```javascript
const xss = require('xss-clean');
app.use(xss());
```

---

## 六、认证与授权

### 1. JWT 安全

```javascript
const jwt = require('jsonwebtoken');

// 签发
const token = jwt.sign(
  { userId: 123, role: 'user' },
  process.env.JWT_SECRET,
  { expiresIn: '1h', issuer: 'myapp' }
);

// 验证
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  // token 无效或过期
}
```

**最佳实践**：
- 使用强密钥（至少 256 位）
- 设置过期时间
- 不要在 JWT 中存储敏感信息
- 使用 HTTPS 传输

### 2. 密码哈希

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 哈希
const hash = await bcrypt.hash(password, saltRounds);

// 验证
const match = await bcrypt.compare(password, hash);
```

---

## 七、SQL 注入防护

```javascript
// ✅ 参数化查询
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// ❌ 字符串拼接（危险）
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

---

## 八、敏感信息保护

### 1. 环境变量

```javascript
// 使用 dotenv
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
```

`.env`：

```
DB_PASSWORD=your-secret
JWT_SECRET=your-jwt-secret
```

> ⚠️ `.env` 加入 `.gitignore`，不要提交。

### 2. 日志脱敏

```javascript
function sanitize(obj) {
  const sanitized = { ...obj };
  if (sanitized.password) sanitized.password = '***';
  if (sanitized.token) sanitized.token = '***';
  if (sanitized.creditCard) sanitized.creditCard = '****' + sanitized.creditCard.slice(-4);
  return sanitized;
}

console.log(sanitize({ name: 'Alice', password: '123456' }));
// { name: 'Alice', password: '***' }
```

---

## 九、HTTPS

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

https.createServer(options, app).listen(443);
```

生产环境建议使用 Nginx 做 HTTPS 反向代理。

---

## 十、安全检查清单

- [ ] 使用 HTTPS
- [ ] 使用 helmet 设置安全头
- [ ] 配置 CORS 白名单
- [ ] 限流防刷
- [ ] 输入校验（Joi / class-validator）
- [ ] 密码使用 bcrypt 哈希
- [ ] JWT 使用强密钥和过期时间
- [ ] SQL 参数化查询
- [ ] 防止 NoSQL 注入和 XSS
- [ ] 敏感信息使用环境变量
- [ ] 定期 `npm audit` 检查依赖漏洞
- [ ] 错误信息不暴露堆栈（生产环境）

---

## 十一、下一步

- 上一章：[测试](/web/nodejs/engineering/03-testing/)
- 下一章：[性能优化](/web/nodejs/engineering/05-performance/)
