---
title: "对象模式（Object Mode）"
---

# 对象模式（Object Mode）

默认 Stream 处理 `Buffer` / `string` / `Uint8Array`。开启 `objectMode: true` 后可以处理任意 JS 对象：

```js
const { Transform } = require("stream");

const jsonLine = new Transform({
  readableObjectMode: true, // 写端读字符串，读端吐对象
  writableObjectMode: false,
  transform(chunk, enc, cb) {
    const lines = chunk.toString().split("\n");
    lines.forEach((l) => l && this.push(JSON.parse(l)));
    cb();
  },
});
```
