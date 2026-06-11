---
title: "常见面试题"
---

# 常见面试题

**Q1：为什么处理大文件要用 Stream？**

假设 1GB 文件：

- `fs.readFile`：需要 1GB 内存
- `fs.createReadStream`：默认内部 buffer 仅 64KB，内存占用恒定

核心优势：**内存可控 + 可以边读边处理（边下载边解压边写盘）**

**Q2：Stream 的 `end`、`finish`、`close` 事件区别？**

- `end`：Readable 已读完所有数据，不再有 `data`
- `finish`：Writable 所有数据都已写入底层（调用 `end()` 并 flushed）
- `close`：流的底层资源（文件描述符 / socket）已关闭（新版 Node 默认触发）

**Q3：`highWaterMark` 是什么？**

可读/可写流内部 buffer 的阈值。当 Writable 的 buffer 超过 `highWaterMark` 时，`write()` 返回 `false`，触发背压；当 buffer 排空后触发 `drain`。默认 `highWaterMark = 16 * 1024`（文件流 64KB）。
