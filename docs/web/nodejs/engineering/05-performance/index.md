---
title: 性能优化
---

# 性能优化

## 一、代码层面

### 1. 异步并行

```javascript
// ❌ 串行
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);

// ✅ 并行
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id),
]);
```

### 2. 避免不必要的 await

```javascript
// ❌ 不需要等待的操作
await sendEmail(user.email);
return user;

// ✅ 后台执行
sendEmail(user.email).catch(console.error);
return user;
```

### 3. 流式处理

```javascript
// ❌ 一次性读取大文件
const data = await fs.readFile('large.txt');
res.send(data);

// ✅ 流式响应
fs.createReadStream('large.txt').pipe(res);
```

---

## 二、缓存

### 1. 内存缓存

```javascript
const cache = new Map();

async function getUser(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  const user = await db.findUser(id);
  cache.set(id, user);
  return user;
}
```

### 2. Redis 缓存

```javascript
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.findUser(id);
  await redis.set(`user:${id}`, JSON.stringify(user), { EX: 300 });
  return user;
}
```

### 3. HTTP 缓存头

```javascript
// 静态资源
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
}));

// API 响应
res.set('Cache-Control', 'public, max-age=300');
```

---

## 三、数据库优化

### 1. 索引

```sql
-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status_age ON users(status, age);
```

### 2. 分页

```javascript
// ❌ 跳过大量数据（慢）
const users = await User.find().skip(100000).limit(10);

// ✅ 游标分页（快）
const users = await User.find({ _id: { $gt: lastId } }).limit(10);
```

### 3. 只查询必要字段

```javascript
// ❌
const users = await User.find();

// ✅
const users = await User.find().select('name email');
```

### 4. 连接池

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,  // 连接数
  waitForConnections: true,
});
```

---

## 四、集群与负载均衡

### 1. PM2 集群

```bash
pm2 start app.js -i max
```

### 2. Node.js cluster

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  // 启动应用
  app.listen(3000);
}
```

### 3. Nginx 反向代理

```nginx
upstream nodejs {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
  server 127.0.0.1:3003;
}

server {
  listen 80;
  location / {
    proxy_pass http://nodejs;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 五、压缩

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

---

## 六、内存优化

### 1. 避免内存泄漏

```javascript
// ❌ 全局变量持续增长
const cache = {};
app.get('/', (req, res) => {
  cache[Date.now()] = req.url;  // 永不清理
});

// ✅ 限制大小 + 过期
const cache = new Map();
function setCache(key, value) {
  if (cache.size > 1000) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
  setTimeout(() => cache.delete(key), 60000);
}
```

### 2. 监控内存

```javascript
setInterval(() => {
  const used = process.memoryUsage();
  console.log({
    rss: `${(used.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(used.external / 1024 / 1024).toFixed(2)} MB`,
  });
}, 60000);
```

---

## 七、性能分析

### 1. CPU Profile

```bash
# 使用 clinic.js
npm install -g clinic
clinic doctor -- node app.js

# 使用 0x
npm install -g 0x
0x app.js
```

### 2. Node.js 内置

```bash
# 启用 inspector
node --inspect app.js

# Chrome DevTools → Node.js 图标
```

### 3. Benchmark

```javascript
console.time('db-query');
const users = await db.findUsers();
console.timeEnd('db-query');
```

---

## 八、生产环境配置

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
  app.disable('x-powered-by');
  app.set('trust proxy', 1);  // 信任反向代理
}
```

---

## 九、优化检查清单

- [ ] 异步操作并行化
- [ ] 使用缓存（内存 / Redis）
- [ ] 数据库索引优化
- [ ] 流式处理大文件
- [ ] 启用压缩
- [ ] 集群模式利用多核
- [ ] Nginx 反向代理
- [ ] 监控内存使用
- [ ] 定期性能分析

---

## 十、下一步

- 上一章：[安全](/web/nodejs/engineering/04-security/)
- 上一级：[工程化与部署](/web/nodejs/engineering/)
- 返回：[Node.js 学习路线](/web/nodejs/)
