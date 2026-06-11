---
title: "背压（Backpressure）"
---

# 背压（Backpressure）

当可读流速度 > 可写流速度时，数据会积压在内部 buffer 中，内存不断增长。背压机制让可写流在「写满」时通知可读流**暂停读取**，等写完后再恢复。

```js
const read = fs.createReadStream("big-file.bin");
const write = fs.createWriteStream("copy.bin");

// ❌ 朴素写法：无背压，大文件会撑爆内存
read.on("data", (chunk) => write.write(chunk));

// ✓ 正确做法：监听 drain 事件恢复读取
read.on("data", (chunk) => {
  const canContinue = write.write(chunk);
  if (!canContinue) read.pause(); // 写满了，暂停
});
write.on("drain", () => read.resume()); // 写完了，恢复
read.on("end", () => write.end());

// ✓ 最优雅：pipe() 自动处理背压
read.pipe(write);

// ✓ Node 10+ 推荐：用 pipeline 自动处理错误与清理
const { pipeline } = require("stream/promises");
await pipeline(read, write);
```

**`pipe` vs `pipeline`**：

- `pipe`：单向串联，出现错误时需要手动销毁每个流，否则资源泄漏
- `pipeline`：接受多个流 + 回调/返回 Promise，错误时自动销毁所有流，推荐
