---
title: "一个最简单的 HTTP 服务器"
---

# 一个最简单的 HTTP 服务器

```js
const http = require("http");

const server = http.createServer((req, res) => {
  // req 是 IncomingMessage（可读流），res 是 ServerResponse（可写流）
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Hello, Node.js");
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:3000/");
});
```
