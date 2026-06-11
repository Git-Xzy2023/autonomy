---
title: "Keep-Alive 与连接复用"
---

# Keep-Alive 与连接复用

默认 HTTP/1.1 `Connection: keep-alive`，同一个 TCP 连接可以发多个 HTTP 请求：

```js
// 客户端请求，底层的 http.Agent 默认 keepAlive:false（每次新建连接）
const http = require('http');
const agent = new http.Agent({ keepAlive: true, maxSockets: 10 });
http.get({ agent, hostname: 'a.com', path: '/' }, res => { ... });
```
