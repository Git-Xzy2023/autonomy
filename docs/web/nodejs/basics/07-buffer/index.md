---
title: Buffer 与字符编码
---

# Buffer 与字符编码

## 一、什么是 Buffer？

Buffer 是 Node.js 中处理**二进制数据**的核心类，类似数组但存储的是原始字节。

```
为什么需要 Buffer？
- 文件、网络传输的是二进制数据
- JavaScript 原生没有二进制数据处理机制
- Buffer 填补了这个空白
```

```javascript
const buf = Buffer.from('Hello');
console.log(buf);        // <Buffer 48 65 6c 6c 6f>
console.log(buf.length); // 5
console.log(buf[0]);     // 72 (H 的 ASCII 码)
```

---

## 二、字符编码

| 编码 | 说明 |
|------|------|
| `utf-8` | 默认，Unicode 字符 |
| `utf-16le` | UTF-16 小端 |
| `latin1` | ISO-8859-1 |
| `ascii` | 7 位 ASCII |
| `base64` | Base64 编码 |
| `hex` | 十六进制 |
| `binary` | 已废弃，用 `latin1` |

```javascript
const buf = Buffer.from('Hello 世界', 'utf-8');

// 编码转换
console.log(buf.toString('utf-8'));   // Hello 世界
console.log(buf.toString('base64'));  // SGVsbG8g5LiW55qE
console.log(buf.toString('hex'));     // 48656c6c6f20e4b896e7958c

// 从 Base64 解码
const decoded = Buffer.from('SGVsbG8g5LiW55qE', 'base64');
console.log(decoded.toString('utf-8')); // Hello 世界
```

---

## 三、创建 Buffer

### 1. `Buffer.from()`

```javascript
// 从字符串
Buffer.from('Hello', 'utf-8');

// 从数组
Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

// 从另一个 Buffer
Buffer.from(existingBuffer);

// 从 ArrayBuffer
Buffer.from(new ArrayBuffer(8));
```

### 2. `Buffer.alloc()` / `Buffer.allocUnsafe()`

```javascript
// alloc：分配并清零（安全）
const buf1 = Buffer.alloc(10);  // <Buffer 00 00 00 00 00 00 00 00 00 00>

// allocUnsafe：分配不清零（更快，但可能含旧数据）
const buf2 = Buffer.allocUnsafe(10);  // 可能含旧数据
```

> ⚠️ `allocUnsafe` 性能更好，但可能泄露敏感数据，仅在确定会完全写入时使用。

---

## 四、Buffer 操作

### 1. 读写

```javascript
const buf = Buffer.alloc(8);

// 写入
buf.write('Hello', 0, 'utf-8');
buf.writeUInt8(255, 5);  // 在位置 5 写入 1 字节

// 读取
buf.toString('utf-8', 0, 5);  // 'Hello'
buf.readUInt8(5);              // 255

// 按索引读写
buf[0] = 0x48;  // 'H'
console.log(buf[0]);  // 72
```

### 2. 拼接

```javascript
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');

// concat
const result = Buffer.concat([buf1, buf2]);
console.log(result.toString());  // Hello World
```

### 3. 切片

```javascript
const buf = Buffer.from('Hello World');

// slice（共享内存，修改会影响原 Buffer）
const slice = buf.slice(0, 5);
console.log(slice.toString());  // Hello

// subarray（推荐，同 slice）
const sub = buf.subarray(0, 5);
```

> ⚠️ `slice` 和 `subarray` 共享内存，修改切片会影响原 Buffer。

### 4. 比较

```javascript
const buf1 = Buffer.from('abc');
const buf2 = Buffer.from('abc');
const buf3 = Buffer.from('abd');

buf1.equals(buf2);  // true
buf1.equals(buf3);  // false
buf1.compare(buf3); // -1（buf1 < buf3）
```

### 5. 查找

```javascript
const buf = Buffer.from('Hello World');

buf.indexOf('o');     // 4
buf.lastIndexOf('o'); // 7
buf.includes('World'); // true
```

---

## 五、Buffer 与 TypedArray

Buffer 是 `Uint8Array` 的子类：

```javascript
const buf = Buffer.from([1, 2, 3, 4]);

// Buffer 是 Uint8Array
console.log(buf instanceof Uint8Array);  // true

// 转换为 TypedArray
const arr = new Uint16Array(buf.buffer);
console.log(arr);  // Uint16Array [ 513, 1027 ]（取决于字节序）
```

### 与 ArrayBuffer 关系

```javascript
const buf = Buffer.alloc(8);

// 获取底层 ArrayBuffer
const arrayBuffer = buf.buffer;

// 从 ArrayBuffer 创建 Buffer
const newBuf = Buffer.from(arrayBuffer);
```

---

## 六、Buffer 与 Stream

Stream 默认处理 Buffer：

```javascript
const stream = fs.createReadStream('file.txt');

stream.on('data', (chunk) => {
  console.log(typeof chunk);  // 'object'
  console.log(Buffer.isBuffer(chunk));  // true
  console.log(chunk.toString('utf-8'));  // 转字符串
});
```

---

## 七、文件编码处理

### 1. 读取 UTF-8 文件

```javascript
const content = await fsp.readFile('file.txt', 'utf-8');
```

### 2. 处理 GBK 编码

Node.js 原生不支持 GBK，需要 `iconv-lite`：

```bash
npm install iconv-lite
```

```javascript
const iconv = require('iconv-lite');

// 读取 GBK 文件
const buffer = await fsp.readFile('gbk-file.txt');
const text = iconv.decode(buffer, 'gbk');

// 写入 GBK 文件
const gbkBuffer = iconv.encode('中文内容', 'gbk');
await fsp.writeFile('output.txt', gbkBuffer);
```

---

## 八、Base64 编码

### 1. 字符串与 Base64

```javascript
// 编码
const encoded = Buffer.from('Hello World').toString('base64');
console.log(encoded);  // SGVsbG8gV29ybGQ=

// 解码
const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
console.log(decoded);  // Hello World
```

### 2. 文件转 Base64

```javascript
const buffer = await fsp.readFile('image.png');
const base64 = buffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;
```

### 3. Base64 转文件

```javascript
const base64Data = 'iVBORw0KGgo...';
const buffer = Buffer.from(base64Data, 'base64');
await fsp.writeFile('image.png', buffer);
```

---

## 九、性能优化

### 1. 预分配 Buffer

```javascript
// ❌ 频繁创建
for (let i = 0; i < 1000; i++) {
  const buf = Buffer.alloc(1024);
  // ...
}

// ✅ 复用
const buf = Buffer.alloc(1024);
for (let i = 0; i < 1000; i++) {
  buf.fill(0);
  // ...
}
```

### 2. 使用 `Buffer.concat` 合并

```javascript
// ❌ 字符串拼接（性能差）
let str = '';
for await (const chunk of stream) {
  str += chunk;
}

// ✅ Buffer.concat
const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
}
const result = Buffer.concat(chunks);
```

### 3. 使用 `Buffer.allocUnsafe`（谨慎）

```javascript
// 在确定会完全写入时使用
const buf = Buffer.allocUnsafe(1024);
fs.readSync(fd, buf, 0, 1024, 0);
```

---

## 十、常见问题

### 1. 乱码问题

```javascript
// ❌ 分块解码导致乱码
stream.on('data', (chunk) => {
  console.log(chunk.toString());  // 多字节字符可能被截断
});

// ✅ 使用 StringDecoder
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');

stream.on('data', (chunk) => {
  console.log(decoder.write(chunk));  // 正确处理多字节字符
});
```

### 2. 内存占用

```javascript
// ⚠️ Buffer 占用堆外内存，不会计入 V8 堆
const buf = Buffer.alloc(1024 * 1024 * 100);  // 100MB
// process.memoryUsage().heapUsed 不会显著增加
// 但 rss（常驻内存）会增加
```

---

## 十一、下一步

- 上一章：[Stream 流](/web/nodejs/basics/06-stream/)
- 下一章：[进程与子进程](/web/nodejs/basics/08-process/)
