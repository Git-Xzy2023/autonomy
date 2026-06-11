---
title: "Buffer 是什么"
---

# Buffer 是什么

Buffer 是 Node.js 中处理**二进制数据**的类，本质是 V8 堆外内存（由 C++ 层 `Buffer::New` 分配，不由 V8 GC 管理）。

```js
// 创建
Buffer.alloc(10); // 10 字节的 0
Buffer.allocUnsafe(10); // 10 字节随机内容（更快但有安全隐患）
Buffer.from("hello", "utf8"); // 从字符串创建
Buffer.from([0x68, 0x65, 0x6c]); // 从字节数组创建

// 读写
const buf = Buffer.from("Hello");
buf[0]; // 72（'H' 的 ASCII）
buf.toString(); // 'Hello'
buf.toString("hex"); // '48656c6c6f'
buf.toString("base64"); // 'SGVsbG8='
buf.slice(0, 2); // 'He'（与 Array.slice 不同，Buffer.slice 共享内存！）

// 工具方法
Buffer.isBuffer(x);
Buffer.byteLength("你好", "utf8"); // 6（中文 utf8 占 3 字节）
```
