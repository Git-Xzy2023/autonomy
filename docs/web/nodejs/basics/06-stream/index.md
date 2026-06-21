---
title: Stream 流
---

# Stream 流

## 一、什么是 Stream？

Stream（流）是处理**流式数据**的抽象接口，用于处理大量数据时分块读取，避免内存溢出。

```
传统方式：一次性读取整个文件到内存
┌──────┐     ┌──────────┐
│ 文件 │ ──→ │   内存   │（可能溢出）
└──────┘     └──────────┘

Stream 方式：分块读取处理
┌──────┐  chunk  ┌───────┐  chunk  ┌──────┐
│ 文件 │ ──────→ │  流   │ ──────→ │ 输出 │
└──────┘         └───────┘         └──────┘
```

### 核心优势

- 💾 **内存高效**：分块处理，不需要全部加载到内存
- ⚡ **时间高效**：边读边处理，无需等待完整数据
- 🔄 **可组合**：通过管道（pipe）连接

---

## 二、四种 Stream 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **Readable** | 可读流 | `fs.createReadStream` |
| **Writable** | 可写流 | `fs.createWriteStream` |
| **Duplex** | 双工流（可读可写） | TCP Socket |
| **Transform** | 转换流（读+写+转换） | `zlib.createGzip` |

```javascript
const { Readable, Writable, Duplex, Transform } = require('stream');
```

---

## 三、Readable 可读流

### 1. 创建可读流

```javascript
const fs = require('fs');

// 从文件创建
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf-8',
  highWaterMark: 64 * 1024,  // 每块 64KB
});
```

### 2. 消费可读流

#### 方式一：事件监听

```javascript
readStream.on('data', (chunk) => {
  console.log('收到数据:', chunk.length, '字节');
});

readStream.on('end', () => {
  console.log('读取完成');
});

readStream.on('error', (err) => {
  console.error('出错:', err);
});
```

#### 方式二：async/await（推荐）

```javascript
const { pipeline } = require('stream/promises');

await pipeline(
  fs.createReadStream('input.txt'),
  async function* (source) {
    for await (const chunk of source) {
      yield chunk.toString().toUpperCase();
    }
  },
  fs.createWriteStream('output.txt')
);
```

#### 方式三：for await...of

```javascript
const stream = fs.createReadStream('file.txt', 'utf-8');

for await (const chunk of stream) {
  console.log(chunk);
}
```

### 3. 两种模式

| 模式 | 说明 |
|------|------|
| **flowing** | 数据自动推送（`on('data')`） |
| **paused** | 需手动调用 `read()` 读取 |

```javascript
// paused 模式
stream.on('readable', () => {
  let chunk;
  while (null !== (chunk = stream.read())) {
    console.log(chunk);
  }
});
```

---

## 四、Writable 可写流

### 1. 创建可写流

```javascript
const writeStream = fs.createWriteStream('output.txt');
```

### 2. 写入数据

```javascript
writeStream.write('第一行\n');
writeStream.write('第二行\n');
writeStream.end('结束');  // end 后不能再写

writeStream.on('finish', () => {
  console.log('写入完成');
});
```

### 3. 背压（Backpressure）

当写入速度慢于读取速度时，需要处理背压：

```javascript
// ❌ 不处理背压（可能内存溢出）
readStream.on('data', (chunk) => {
  writeStream.write(chunk);
});

// ✅ 处理背压
readStream.on('data', (chunk) => {
  const canContinue = writeStream.write(chunk);
  if (!canContinue) {
    readStream.pause();
    writeStream.once('drain', () => readStream.resume());
  }
});
```

---

## 五、pipe 管道

`pipe` 自动处理背压，连接可读流和可写流：

```javascript
// 复制文件
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// 链式操作
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())        // 压缩
  .pipe(fs.createWriteStream('output.txt.gz'));
```

### pipeline（推荐）

`pipeline` 比 `pipe` 更安全，能正确处理错误：

```javascript
const { pipeline } = require('stream/promises');

await pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.txt.gz')
);
```

---

## 六、Transform 转换流

转换流用于在读取和写入之间转换数据：

```javascript
const { Transform } = require('stream');

// 创建转换流
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// 使用
fs.createReadStream('input.txt')
  .pipe(upperCase)
  .pipe(fs.createWriteStream('output.txt'));
```

### 实战：JSON 行解析

```javascript
const { Transform } = require('stream');

class JSONLines extends Transform {
  constructor() {
    super({ objectMode: true });
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();

    for (const line of lines) {
      if (line.trim()) {
        this.push(JSON.parse(line));
      }
    }
    callback();
  }

  _flush(callback) {
    if (this.buffer.trim()) {
      this.push(JSON.parse(this.buffer));
    }
    callback();
  }
}

// 使用：解析 JSONL 文件
fs.createReadStream('data.jsonl')
  .pipe(new JSONLines())
  .on('data', (obj) => console.log(obj));
```

---

## 七、自定义 Stream

### 1. 自定义 Readable

```javascript
const { Readable } = require('stream');

class CounterStream extends Readable {
  constructor(max) {
    super();
    this.max = max;
    this.count = 0;
  }

  _read() {
    if (this.count < this.max) {
      this.push(`${this.count++}\n`);
    } else {
      this.push(null);  // 结束
    }
  }
}

const counter = new CounterStream(5);
counter.on('data', (chunk) => console.log(chunk.toString()));
// 输出：0 1 2 3 4
```

### 2. 自定义 Writable

```javascript
const { Writable } = require('stream');

class LogStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log('写入:', chunk.toString().trim());
    callback();
  }
}

const logger = new LogStream();
logger.write('Hello');
logger.write('World');
logger.end();
```

---

## 八、objectMode 对象模式

默认 Stream 处理 `Buffer` / `string`，`objectMode` 允许处理任意 JS 对象：

```javascript
const { Readable } = require('stream');

const stream = new Readable({
  objectMode: true,
  read() {}
});

stream.push({ name: 'Alice', age: 30 });
stream.push({ name: 'Bob', age: 25 });
stream.push(null);

stream.on('data', (obj) => console.log(obj));
```

---

## 九、常用 Stream 场景

### 1. 文件复制

```javascript
await pipeline(
  fs.createReadStream('source.mp4'),
  fs.createWriteStream('dest.mp4')
);
```

### 2. HTTP 请求转发

```javascript
http.createServer((req, res) => {
  // 请求体直接转发到另一个服务
  const proxyReq = http.request('http://backend.com', (proxyRes) => {
    proxyRes.pipe(res);
  });
  req.pipe(proxyReq);
});
```

### 3. 文件压缩

```javascript
await pipeline(
  fs.createReadStream('log.txt'),
  zlib.createGzip(),
  fs.createWriteStream('log.txt.gz')
);
```

### 4. 大文件处理

```javascript
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

// 逐行读取大文件
const rl = createInterface({
  input: createReadStream('large-file.csv'),
  crlfDelay: Infinity
});

for await (const line of rl) {
  // 处理每一行
  console.log(line);
}
```

---

## 十、下一步

- 上一章：[事件循环与异步](/web/nodejs/basics/05-event-loop/)
- 下一章：[Buffer 与编码](/web/nodejs/basics/07-buffer/)
