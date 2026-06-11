---
title: "常见面试题"
---

# 常见面试题

**Q1：`listen` 的 backlog 参数是什么？**

内核中「已完成三次握手但还没被 `accept()`」的队列长度。Node 默认 511。如果大量并发连接瞬间涌入且 Node 来不及 accept，队列会被撑满，后续连接会被丢弃（表现为 ECONNREFUSED / ETIMEDOUT）。

**Q2：如何处理 request body？**

```js
// 原生方式：req 是 Readable Stream，需要自己收集 data
let body = "";
req.on("data", (chunk) => (body += chunk));
req.on("end", () => console.log(JSON.parse(body)));

// Express 里用 body-parser / express.json() 中间件自动处理
```

**Q3：Express/Koa 中间件模型？**

```js
// Express：回调式
app.use((req, res, next) => {
  console.log("before");
  next(); // 把控制权交给下一个中间件
  console.log("after"); // 下一个中间件同步返回后执行
});

// Koa：洋葱模型（async/await 可优雅地「包裹」后续中间件）
app.use(async (ctx, next) => {
  console.log("1 before");
  await next(); // 交出执行权，等所有后续中间件完成才回来
  console.log("1 after");
});
```
