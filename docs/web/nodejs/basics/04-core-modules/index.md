---
title: 核心模块
---

# 核心模块（fs / path / os / url / http）

Node.js 提供了大量内置核心模块，无需安装即可使用。

---

## 一、fs 文件系统

### 1. 同步 vs 异步 vs Promise

```javascript
const fs = require('fs');
const fsp = require('fs/promises');

// 同步（阻塞，不推荐）
const data = fs.readFileSync('file.txt', 'utf-8');

// 异步回调
fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise（推荐）
const data = await fsp.readFile('file.txt', 'utf-8');
```

### 2. 读写文件

```javascript
const fsp = require('fs/promises');

// 读
const content = await fsp.readFile('file.txt', 'utf-8');

// 写（覆盖）
await fsp.writeFile('file.txt', 'Hello World');

// 追加
await fsp.appendFile('log.txt', '新日志\n');

// 复制
await fsp.copyFile('src.txt', 'dest.txt');
```

### 3. 目录操作

```javascript
// 创建目录（递归）
await fsp.mkdir('a/b/c', { recursive: true });

// 读取目录
const files = await fsp.readdir('.');

// 递归读取
const files = await fsp.readdir('.', { withFileTypes: true, recursive: true });

// 删除目录
await fsp.rm('dir', { recursive: true, force: true });
```

### 4. 文件信息

```javascript
const stats = await fsp.stat('file.txt');
console.log(stats.isFile());      // true
console.log(stats.isDirectory()); // false
console.log(stats.size);          // 字节数
console.log(stats.mtime);         // 修改时间
```

### 5. 监听文件变化

```javascript
fs.watch('file.txt', (eventType, filename) => {
  console.log(`事件: ${eventType}, 文件: ${filename}`);
});
```

---

## 二、path 路径

```javascript
const path = require('path');

// 拼接路径
path.join('a', 'b', 'c');        // a/b/c
path.join('/a', 'b', '../c');    // /a/c

// 规范化路径
path.normalize('/a/./b//../c');  // /a/c

// 解析为绝对路径
path.resolve('a', 'b');          // /当前目录/a/b
path.resolve('/a', 'b');         // /a/b

// 获取路径信息
const filePath = '/Users/me/project/file.txt';
path.dirname(filePath);   // /Users/me/project
path.basename(filePath);  // file.txt
path.basename(filePath, '.txt'); // file
path.extname(filePath);   // .txt

// 解析路径
path.parse(filePath);
// { root: '/', dir: '/Users/me/project', base: 'file.txt', name: 'file', ext: '.txt' }

// 跨平台分隔符
path.sep;          // '/' (Unix) 或 '\\' (Windows)
path.delimiter;    // ':' (Unix) 或 ';' (Windows)
```

### 跨平台路径

```javascript
// ❌ 硬编码分隔符
const file = 'a/b/c.txt';

// ✅ 使用 path.join
const file = path.join('a', 'b', 'c.txt');
```

---

## 三、os 操作系统

```javascript
const os = require('os');

os.platform();     // 'darwin' / 'linux' / 'win32'
os.arch();         // 'x64' / 'arm64'
os.cpus();         // CPU 信息数组
os.cpus().length;  // CPU 核心数
os.totalmem();     // 总内存（字节）
os.freemem();      // 空闲内存（字节）
os.uptime();       // 系统运行时间（秒）
os.hostname();     // 主机名
os.networkInterfaces(); // 网络接口
os.homedir();      // 用户主目录
os.tmpdir();       // 临时目录
os.EOL;            // 换行符（\n 或 \r\n）
```

---

## 四、url 与 querystring

### 1. URL 解析（推荐）

```javascript
const { URL } = require('url');

const url = new URL('https://user:pass@example.com:8080/path/name?query=1#hash');

console.log(url.protocol); // 'https:'
console.log(url.username); // 'user'
console.log(url.password); // 'pass'
console.log(url.hostname); // 'example.com'
console.log(url.port);     // '8080'
console.log(url.pathname); // '/path/name'
console.log(url.search);   // '?query=1'
console.log(url.hash);     // '#hash'
```

### 2. URLSearchParams

```javascript
const params = new URLSearchParams('a=1&b=2&c=3');

params.get('a');       // '1'
params.has('b');       // true
params.append('d', '4');
params.delete('c');
params.toString();     // 'a=1&b=2&d=4'

// 遍历
for (const [key, value] of params) {
  console.log(key, value);
}
```

### 3. 文件路径与 URL 互转

```javascript
const { pathToFileURL, fileURLToPath } = require('url');

// 路径转 URL
const fileUrl = pathToFileURL('/path/to/file');
// file:///path/to/file

// URL 转路径
const filePath = fileURLToPath('file:///path/to/file');
// /path/to/file
```

---

## 五、http 模块

### 1. 创建服务器

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // 请求信息
  console.log(req.method);  // 'GET'
  console.log(req.url);     // '/path?query=1'
  console.log(req.headers); // 请求头对象

  // 响应
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello' }));
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 2. 发起请求

```javascript
// 传统方式
const req = http.request('http://example.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
req.end();

// Node 18+ 内置 fetch（推荐）
const res = await fetch('https://api.example.com/data');
const data = await res.json();
```

---

## 六、events 事件

```javascript
const { EventEmitter } = require('events');

const emitter = new EventEmitter();

// 监听
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// 监听一次
emitter.once('init', () => {
  console.log('初始化');
});

// 触发
emitter.emit('greet', 'World');  // Hello, World!
emitter.emit('greet', 'Node');   // Hello, Node!

// 移除监听
const callback = (name) => console.log(`Hi, ${name}`);
emitter.on('sayHi', callback);
emitter.off('sayHi', callback);  // 或 emitter.removeListener
```

### 错误事件

```javascript
emitter.on('error', (err) => {
  console.error('出错:', err);
});

// 触发 error 事件如果没有监听器，进程会崩溃
emitter.emit('error', new Error('something wrong'));
```

---

## 七、crypto 加密

### 1. 哈希

```javascript
const crypto = require('crypto');

// SHA256
const hash = crypto.createHash('sha256');
hash.update('hello');
console.log(hash.digest('hex'));
// 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

// 快捷方式
const hash2 = crypto.createHash('sha256').update('hello').digest('hex');
```

### 2. HMAC

```javascript
const hmac = crypto.createHmac('sha256', 'secret-key');
hmac.update('message');
console.log(hmac.digest('hex'));
```

### 3. AES 加解密

```javascript
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// 加密
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello World', 'utf-8', 'hex');
encrypted += cipher.final('hex');

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
decrypted += decipher.final('utf-8');
```

### 4. 随机数

```javascript
crypto.randomBytes(16);       // 16 字节随机 Buffer
crypto.randomUUID();          // UUID v4
```

---

## 八、util 工具

```javascript
const util = require('util');

// promisify：回调转 Promise
const readFile = util.promisify(fs.readFile);
const data = await readFile('file.txt', 'utf-8');

// inspect：格式化对象
console.log(util.inspect(obj, { depth: null, colors: true }));

// format：格式化字符串
util.format('%s:%d', 'port', 3000);  // 'port:3000'

// types：类型判断
util.types.isPromise(obj);
util.types.isAsyncFunction(fn);
```

---

## 九、其他常用模块

| 模块 | 说明 | 示例 |
|------|------|------|
| `querystring` | URL 查询字符串解析 | `querystring.parse('a=1&b=2')` |
| `string_decoder` | Buffer 解码 | `new StringDecoder('utf8')` |
| `zlib` | 压缩解压 | `zlib.gzipSync(buffer)` |
| `stream` | 流处理 | `stream.Readable` |
| `worker_threads` | 多线程 | `new Worker('worker.js')` |
| `child_process` | 子进程 | `exec('ls')` |
| `net` | TCP | `net.createServer()` |
| `dgram` | UDP | `dgram.createSocket('udp4')` |
| `dns` | DNS 解析 | `dns.lookup('example.com')` |
| `tls` | TLS/SSL | `tls.connect()` |
| `assert` | 断言 | `assert.equal(a, b)` |
| `cluster` | 集群 | `cluster.fork()` |

---

## 十、下一步

- 上一章：[npm 与包管理](/web/nodejs/basics/03-npm/)
- 下一章：[事件循环与异步](/web/nodejs/basics/05-event-loop/)
