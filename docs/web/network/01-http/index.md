---
title: HTTP 协议详解
---

# HTTP 协议详解

> HTTP（HyperText Transfer Protocol，超文本传输协议）是 Web 通信的基础协议。本章将系统介绍 HTTP 的工作原理、请求响应模型、请求方法、状态码、首部字段、缓存机制以及 HTTP/2、HTTP/3 的演进。

---

## 一、HTTP 概述

### 1.1 什么是 HTTP

HTTP 是一种**应用层协议**，基于客户端-服务器模型，通过请求-响应 cycle 进行通信。

```
┌──────────┐                      ┌──────────┐
│  客户端   │  ──── Request ────►  │  服务器   │
│ (Browser)│                      │ (Server) │
│          │  ◄─── Response ────  │          │
└──────────┘                      └──────────┘
```

### 1.2 HTTP 的特点

| 特性       | 说明                                               |
| ---------- | -------------------------------------------------- |
| **无状态** | 服务器不保留客户端状态（用 Cookie/Session 弥补）   |
| **无连接** | HTTP/1.0 每次请求建立新连接（HTTP/1.1 keep-alive） |
| **简单**   | 基于文本，易于调试                                 |
| **灵活**   | 可传输任意类型数据（通过 Content-Type 标识）       |
| **可靠**   | 基于 TCP/IP（HTTP/3 基于 UDP + QUIC）              |

### 1.3 HTTP 版本演进

| 版本     | 发布时间 | 主要特性                                   |
| -------- | -------- | ------------------------------------------ |
| HTTP/0.9 | 1991     | 仅支持 GET，传输 HTML                      |
| HTTP/1.0 | 1996     | 支持 POST/HEAD、Content-Type、状态码       |
| HTTP/1.1 | 1997     | 持久连接、管道化、Host 头、缓存控制        |
| HTTP/2   | 2015     | 二进制分帧、多路复用、头部压缩、服务端推送 |
| HTTP/3   | 2022     | 基于 QUIC（UDP）、解决队头阻塞             |

---

## 二、请求与响应模型

### 2.1 HTTP 请求结构

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer xxx
Content-Length: 35

{"name": "Tom", "age": 18}
```

```
┌─────────────────────────────────────────┐
│            HTTP 请求结构                 │
├─────────────────────────────────────────┤
│  请求行：方法 URL 协议版本               │
│    GET /index.html HTTP/1.1             │
├─────────────────────────────────────────┤
│  请求首部：键值对                        │
│    Host: www.example.com               │
│    User-Agent: Mozilla/5.0             │
│    Accept: text/html                   │
├─────────────────────────────────────────┤
│  空行（CRLF）                           │
├─────────────────────────────────────────┤
│  请求体（可选）                         │
│    {"name": "Tom"}                     │
└─────────────────────────────────────────┘
```

### 2.2 HTTP 响应结构

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 28
Cache-Control: max-age=60

{"id": 1, "name": "Tom"}
```

```
┌─────────────────────────────────────────┐
│            HTTP 响应结构                 │
├─────────────────────────────────────────┤
│  状态行：协议版本 状态码 短语            │
│    HTTP/1.1 200 OK                      │
├─────────────────────────────────────────┤
│  响应首部                               │
│    Content-Type: text/html             │
│    Server: nginx                       │
│    Set-Cookie: sid=abc                 │
├─────────────────────────────────────────┤
│  空行                                   │
├─────────────────────────────────────────┤
│  响应体                                 │
│    <html>...</html>                    │
└─────────────────────────────────────────┘
```

---

## 三、HTTP 请求方法

| 方法        | 描述                   | 安全 | 幂等 | 请求体 |
| ----------- | ---------------------- | ---- | ---- | ------ |
| **GET**     | 获取资源               | ✅   | ✅   | ❌     |
| **POST**    | 创建资源               | ❌   | ❌   | ✅     |
| **PUT**     | 完整更新资源           | ❌   | ✅   | ✅     |
| **PATCH**   | 部分更新资源           | ❌   | ❌   | ✅     |
| **DELETE**  | 删除资源               | ❌   | ✅   | ❌     |
| **HEAD**    | 获取响应头（无响应体） | ✅   | ✅   | ❌     |
| **OPTIONS** | 查询服务器支持的方法   | ✅   | ✅   | ❌     |
| **TRACE**   | 回显服务器收到的请求   | ✅   | ✅   | ❌     |

> **安全**：不会修改服务器资源。**幂等**：多次执行结果一致。

### GET vs POST

| 对比项       | GET                               | POST                   |
| ------------ | --------------------------------- | ---------------------- |
| **参数位置** | URL 查询字符串                    | 请求体                 |
| **长度限制** | 受 URL 长度限制（约 2KB）         | 理论无限制             |
| **缓存**     | 可被浏览器缓存                    | 默认不缓存             |
| **历史记录** | 保留在浏览器历史                  | 不保留                 |
| **编码类型** | application/x-www-form-urlencoded | multipart/form-data 等 |
| **回退**     | 无副作用                          | 浏览器会提示重新提交   |
| **语义**     | 获取数据                          | 提交数据               |

---

## 四、HTTP 状态码

### 状态码分类

| 类别 | 范围    | 含义         |
| ---- | ------- | ------------ |
| 1xx  | 100-199 | 信息性状态码 |
| 2xx  | 200-299 | 成功         |
| 3xx  | 300-399 | 重定向       |
| 4xx  | 400-499 | 客户端错误   |
| 5xx  | 500-599 | 服务器错误   |

### 常见状态码

| 状态码  | 短语                  | 说明                 |
| ------- | --------------------- | -------------------- |
| **200** | OK                    | 请求成功             |
| **201** | Created               | 资源创建成功         |
| **204** | No Content            | 成功但无返回内容     |
| **301** | Moved Permanently     | 永久重定向           |
| **302** | Found                 | 临时重定向           |
| **304** | Not Modified          | 资源未修改，使用缓存 |
| **400** | Bad Request           | 请求语法错误         |
| **401** | Unauthorized          | 未认证（需要登录）   |
| **403** | Forbidden             | 已认证但无权限       |
| **404** | Not Found             | 资源不存在           |
| **405** | Method Not Allowed    | 请求方法不允许       |
| **409** | Conflict              | 资源冲突             |
| **413** | Payload Too Large     | 请求体过大           |
| **429** | Too Many Requests     | 请求过于频繁（限流） |
| **500** | Internal Server Error | 服务器内部错误       |
| **502** | Bad Gateway           | 网关错误             |
| **503** | Service Unavailable   | 服务不可用           |
| **504** | Gateway Timeout       | 网关超时             |

---

## 五、HTTP 首部字段

### 通用首部

| 首部                | 说明                   |
| ------------------- | ---------------------- |
| `Cache-Control`     | 缓存控制               |
| `Connection`        | 连接管理（keep-alive） |
| `Date`              | 报文创建时间           |
| `Transfer-Encoding` | 传输编码（chunked）    |

### 请求首部

| 首部                | 说明                    |
| ------------------- | ----------------------- |
| `Host`              | 目标主机                |
| `User-Agent`        | 客户端信息              |
| `Accept`            | 可接受的响应类型        |
| `Accept-Encoding`   | 可接受的编码（gzip/br） |
| `Accept-Language`   | 可接受的语言            |
| `Authorization`     | 认证信息                |
| `Cookie`            | Cookie 信息             |
| `Referer`           | 来源页面                |
| `Origin`            | 请求源（用于 CORS）     |
| `If-Modified-Since` | 缓存检查（基于时间）    |
| `If-None-Match`     | 缓存检查（基于 ETag）   |

### 响应首部

| 首部               | 说明             |
| ------------------ | ---------------- |
| `Server`           | 服务器信息       |
| `Set-Cookie`       | 设置 Cookie      |
| `WWW-Authenticate` | 认证要求         |
| `Location`         | 重定向目标       |
| `ETag`             | 资源唯一标识     |
| `Last-Modified`    | 资源最后修改时间 |

### 实体首部

| 首部               | 说明                |
| ------------------ | ------------------- |
| `Content-Type`     | 内容类型及编码      |
| `Content-Length`   | 内容长度            |
| `Content-Encoding` | 内容编码（gzip/br） |
| `Content-Language` | 内容语言            |
| `Expires`          | 过期时间            |
| `Allow`            | 允许的方法          |

---

## 六、HTTP 缓存

### 6.1 缓存分类

```
浏览器缓存
├── 强缓存（不发请求，直接用本地）
│   ├── Cache-Control: max-age=3600
│   └── Expires: Wed, 24 Jun 2026 00:00:00 GMT
│
└── 协商缓存（发请求询问服务器，304 才用本地）
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 6.2 强缓存

```http
# 响应头
Cache-Control: max-age=3600, public, immutable
Expires: Wed, 24 Jun 2026 00:00:00 GMT
```

`Cache-Control` 常用指令：

| 指令                     | 说明                             |
| ------------------------ | -------------------------------- |
| `max-age`                | 缓存有效时间（秒）               |
| `public`                 | 允许中间代理缓存                 |
| `private`                | 仅浏览器可缓存                   |
| `no-cache`               | 强制协商缓存（每次都要问服务器） |
| `no-store`               | 完全不缓存                       |
| `immutable`              | 资源永不变（用户刷新也不发请求） |
| `s-maxage`               | 共享缓存有效时间                 |
| `stale-while-revalidate` | 允许过期后异步验证               |

### 6.3 协商缓存

```http
# 第一次响应
ETag: "abc123"
Last-Modified: Wed, 24 Jun 2025 00:00:00 GMT

# 第二次请求
If-None-Match: "abc123"
If-Modified-Since: Wed, 24 Jun 2025 00:00:00 GMT

# 资源未变化，返回 304
HTTP/1.1 304 Not Modified
```

**ETag vs Last-Modified**：

| 对比项     | ETag               | Last-Modified          |
| ---------- | ------------------ | ---------------------- |
| **精度**   | 文件内容 hash      | 修改时间               |
| **性能**   | 计算开销大         | 读取快                 |
| **优先级** | 高                 | 低                     |
| **局限**   | 分布式服务器需一致 | 1 秒内多次修改无法识别 |

---

## 七、Cookie 与 Session

### 7.1 Cookie

```http
# 响应头设置 Cookie
Set-Cookie: sid=abc123; Domain=example.com; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Strict

# 请求头携带 Cookie
Cookie: sid=abc123
```

| 属性       | 说明                                 |
| ---------- | ------------------------------------ |
| `Domain`   | 生效域名                             |
| `Path`     | 生效路径                             |
| `Max-Age`  | 有效期（秒）                         |
| `Expires`  | 过期时间                             |
| `HttpOnly` | JS 不可访问（防 XSS）                |
| `Secure`   | 仅 HTTPS 传输                        |
| `SameSite` | 跨站策略（Strict/Lax/None，防 CSRF） |

### 7.2 Cookie vs Session vs Token

| 对比项   | Cookie   | Session     | Token（JWT） |
| -------- | -------- | ----------- | ------------ |
| **存储** | 浏览器   | 服务器      | 客户端       |
| **大小** | 4KB      | 不限        | 不限         |
| **扩展** | 差       | 差          | 好           |
| **CSRF** | 易受攻击 | 依赖 Cookie | 不易受攻击   |

---

## 八、HTTP/2 与 HTTP/3

### 8.1 HTTP/2 特性

```
HTTP/1.1：串行响应（队头阻塞）
请求1 ──► 响应1
请求2 ──► 响应2
请求3 ──► 响应3

HTTP/2：多路复用（一个 TCP 连接并发）
请求1 ┐
请求2 ├─► 并发响应
请求3 ┘
```

| 特性           | 说明                     |
| -------------- | ------------------------ |
| **二进制分帧** | 报文改为二进制，解析更快 |
| **多路复用**   | 一个连接并发多个请求     |
| **头部压缩**   | HPACK 算法压缩重复头部   |
| **服务端推送** | 主动推送资源到客户端     |

### 8.2 HTTP/3（QUIC）

HTTP/3 基于 Google 开发的 **QUIC** 协议，运行在 UDP 之上：

- **解决 TCP 队头阻塞**：每个 stream 独立
- **更快的握手**：1-RTT 甚至 0-RTT
- **连接迁移**：网络切换不断连

---

## 九、实战：使用 DevTools 调试 HTTP

打开浏览器 DevTools → Network 面板：

- **Preserve log**：跨页面保留日志
- **Disable cache**：禁用缓存
- **Filter**：按类型/域名过滤
- **右键请求**：Copy as cURL / Fetch
- **Timing**：查看各阶段耗时

---

## 十、学习建议

1. **基础概念**：理解请求-响应模型、方法、状态码
2. **缓存机制**：能区分强缓存与协商缓存
3. **Cookie 安全**：HttpOnly、Secure、SameSite 三件套
4. **新版本特性**：HTTP/2 多路复用解决什么问题

---

## 参考

- [MDN - HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [HTTP/2 RFC 7540](https://httpwg.org/specs/rfc7540.html)
- [HTTP/3 RFC 9114](https://httpwg.org/specs/rfc9114.html)
