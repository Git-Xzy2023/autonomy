---
title: "Stream 是什么"
---

# Stream 是什么

Stream 是 Node.js 中处理**流式数据**（大文件、网络套接字、HTTP 请求/响应）的抽象接口，核心价值是**不将数据一次性加载到内存**，而是「读一点、处理一点、写一点」。

**4 种基本类型：**

| 类型                | 继承关系                               | 示例                                  |
| ------------------- | -------------------------------------- | ------------------------------------- |
| Readable（可读）    | `stream.Readable`                      | `fs.createReadStream`、HTTP request   |
| Writable（可写）    | `stream.Writable`                      | `fs.createWriteStream`、HTTP response |
| Duplex（双工）      | `stream.Duplex`（同时可读可写）        | TCP socket                            |
| Transform（转换流） | `stream.Transform`（读入后处理再写出） | `zlib.createGzip`、crypto 加密流      |

所有 Stream 都是 EventEmitter 的子类。
