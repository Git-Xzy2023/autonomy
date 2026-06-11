# 同源策略与跨域

## 什么是同源策略

**同源**：协议、端口号、域名必须一致。

同源策略限制了从同一个源加载的文档或脚本如何与另一个源的资源进行交互，是浏览器隔离潜在恶意文件的重要安全机制。

## 如何实现跨域

### 1. CORS

**简单请求**：方法是 HEAD/GET/POST，Content-Type 限于 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`。浏览器直接发出 CORS 请求，请求头增加 Origin 字段。

**非简单请求**：正式通信前进行一次预检请求（OPTIONS）。

**Cookie 相关**：需设置 `withCredentials = true`，服务端设置 `Access-Control-Allow-Credentials: true`，且 `Access-Control-Allow-Origin` 不能为 `*`。

### 2. JSONP

利用 `<script>` 标签无跨域限制，通过 src 发送带 callback 的 GET 请求。缺点：仅支持 GET，可能遭受 XSS 攻击。

### 3. postMessage

HTML5 API，用于页面与 iframe、多窗口之间消息传递。

### 4. nginx / nodejs 代理跨域

通过代理服务器做跳板机，反向代理访问目标接口。

### 5. document.domain + iframe

适用于主域相同子域不同的情况。

### 6. location.hash / window.name + iframe

通过中间页面利用 iframe 传值。window.name 在不同域名加载后仍存在，可支持 2MB。

### 7. WebSocket

浏览器与服务器全双工通信，允许跨域通讯。

## 正向代理和反向代理

- **正向代理**：客户端设置代理服务器，隐藏客户端
- **反向代理**：服务器设置代理服务器，隐藏真实服务器
