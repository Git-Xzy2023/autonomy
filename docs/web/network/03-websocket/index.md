---
title: WebSocket 实时通信
---

# WebSocket 实时通信

> WebSocket 是一种在单个 TCP 连接上进行**全双工通信**的协议，专为实时场景设计。本章介绍 WebSocket 的原理、API、与轮询/SSE 的对比，以及实战应用。

---

## 一、为什么需要 WebSocket

### 1.1 HTTP 的局限

HTTP 是**请求-响应**模型，服务器**无法主动推送**数据给客户端。

```
传统方案：
Client ──请求──► Server
Client ◄──响应── Server
                （连接关闭）
                （服务器有新数据，发不出去）
```

### 1.2 传统实时方案

| 方案           | 原理                          | 缺点                     |
| -------------- | ----------------------------- | ------------------------ |
| **短轮询**     | 客户端每隔 N 秒请求一次       | 延迟高、浪费资源         |
| **长轮询**     | 服务器 hold 请求直到有数据    | 每次都要重建连接         |
| **SSE**        | 服务器单向推送                | 只能服务器→客户端        |
| **WebSocket**  | 全双工长连接                  | 需要独立协议、运维复杂   |

### 1.3 WebSocket 优势

```
WebSocket：
Client ◄═══════► Server
       双向全双工
       持久连接
       低开销（无头部开销）
```

- ✅ **全双工**：双向同时通信
- ✅ **低开销**：握手后数据帧头部仅 2-14 字节
- ✅ **低延迟**：服务器可即时推送
- ✅ **跨域友好**：无同源策略限制（但服务端可校验 Origin）

---

## 二、WebSocket 协议

### 2.1 握手过程

WebSocket 复用 HTTP 完成握手，握手后切换为 WebSocket 协议。

```http
# 客户端请求
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

# 服务器响应
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

`Sec-WebSocket-Accept` = base64(SHA1(Key + GUID))

### 2.2 数据帧格式

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length     |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
```

- **FIN**：是否最后一帧
- **opcode**：帧类型（0x1 文本、0x2 二进制、0x8 关闭、0x9 ping、0xA pong）
- **Payload len**：负载长度

### 2.3 心跳机制

```js
// 客户端定时发送 ping
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);
```

---

## 三、浏览器 API

### 3.1 基础用法

```js
// 创建连接
const ws = new WebSocket('wss://example.com/chat');

// 连接打开
ws.onopen = (e) => {
  console.log('连接已建立');
  ws.send('Hello Server!');
};

// 接收消息
ws.onmessage = (e) => {
  console.log('收到消息:', e.data);
};

// 错误
ws.onerror = (e) => {
  console.error('发生错误', e);
};

// 连接关闭
ws.onclose = (e) => {
  console.log('连接关闭', e.code, e.reason);
};

// 主动关闭
ws.close(1000, '正常关闭');
```

### 3.2 readyState 状态

| 值  | 常量               | 说明       |
| --- | ------------------ | ---------- |
| 0   | CONNECTING         | 连接中     |
| 1   | OPEN               | 已连接     |
| 2   | CLOSING            | 关闭中     |
| 3   | CLOSED             | 已关闭     |

### 3.3 关闭码

| 码    | 含义                       |
| ----- | -------------------------- |
| 1000  | 正常关闭                   |
| 1001  | 端点离开（页面关闭）       |
| 1006  | 异常关闭（无关闭帧）       |
| 1009  | 消息过大                   |
| 1011  | 服务器内部错误             |
| 4000-4999 | 自定义                  |

### 3.4 传输二进制数据

```js
// 发送 ArrayBuffer
ws.binaryType = 'arraybuffer';
ws.send(buffer);

// 发送 Blob
ws.binaryType = 'blob';
ws.send(blob);
```

---

## 四、实战：重连与封装

### 4.1 自动重连

```js
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.options = { maxRetry: 5, ...options };
    this.retryCount = 0;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('连接成功');
      this.retryCount = 0;
      this.options.onopen?.();
    };

    this.ws.onmessage = (e) => {
      this.options.onmessage?.(e);
    };

    this.ws.onclose = () => {
      if (this.retryCount < this.options.maxRetry) {
        const delay = Math.min(1000 * 2 ** this.retryCount, 30000);
        console.log(`${delay}ms 后重连`);
        setTimeout(() => this.connect(), delay);
        this.retryCount++;
      }
    };
  }

  send(data) {
    this.ws.send(data);
  }
}
```

### 4.2 消息队列（连接未就绪时缓存）

```js
class QueuedWebSocket {
  constructor(url) {
    this.queue = [];
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.queue.forEach((msg) => this.ws.send(msg));
      this.queue = [];
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.queue.push(data);
    }
  }
}
```

---

## 五、服务端实现

### 5.1 Node.js (ws 库)

```js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`${ip} 已连接`);

  ws.on('message', (data) => {
    console.log('收到:', data.toString());
    ws.send(`Echo: ${data}`);
  });

  ws.on('close', () => {
    console.log('连接关闭');
  });
});

// 广播
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
```

### 5.2 Socket.IO（封装层）

```js
// 服务端
const io = require('socket.io')(3000);
io.on('connection', (socket) => {
  socket.on('chat', (msg) => {
    io.emit('chat', msg); // 广播
  });
});

// 客户端
const socket = io();
socket.on('chat', (msg) => console.log(msg));
socket.emit('chat', 'Hello');
```

| 特性          | 原生 WebSocket   | Socket.IO              |
| ------------- | ---------------- | ---------------------- |
| 协议          | 标准 WebSocket   | 私有协议               |
| 自动重连      | 需自己实现       | 内置                   |
| 心跳          | 需自己实现       | 内置                   |
| 房间/命名空间 | 无               | 支持                   |
| 降级          | 无               | 轮询降级               |

---

## 六、应用场景

| 场景         | 说明                        |
| ------------ | --------------------------- |
| **聊天室**   | 即时双向消息               |
| **协同编辑** | OT 算法同步文档            |
| **实时游戏** | 低延迟状态同步             |
| **股票行情** | 服务器推送实时数据         |
| **通知推送** | Web 端实时通知             |
| **多屏互动** | 手机控制电视等             |

---

## 七、安全考虑

### 7.1 跨域

WebSocket 默认**不受同源策略限制**，但服务端应校验 `Origin`：

```js
wss.on('connection', (ws, req) => {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    ws.close(1008, 'Origin not allowed');
    return;
  }
});
```

### 7.2 鉴权

- **URL 参数**：`wss://example.com/chat?token=xxx`（会记日志，不推荐）
- **Cookie**：握手自动携带（同源时）
- **Sec-WebSocket-Protocol**：协议头携带 token

### 7.3 流量控制

- 限制消息大小，防止内存爆炸
- 限流防刷
- 心跳超时断开僵尸连接

---

## 八、学习建议

1. **协议理解**：知道 WebSocket 与 HTTP 的关系（握手基于 HTTP）
2. **API 使用**：熟练使用浏览器 WebSocket API
3. **封装能力**：能实现自动重连、消息队列、心跳
4. **服务端实践**：用 `ws` 或 `Socket.IO` 实现聊天室

---

## 参考

- [MDN - WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [RFC 6455 - WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Socket.IO 文档](https://socket.io/zh-CN/docs/v4/)
