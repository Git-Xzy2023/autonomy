---
title: "`JSONP` 的原理？CORS 与 `withCredentials`？"
---

# `JSONP` 的原理？CORS 与 `withCredentials`？

**JSONP**（老技术，现在用 CORS）：利用 `<script>` 标签不受同源策略限制的特点，请求一段 JS 代码并执行。

```js
// 浏览器端
function jsonp(url, cbName) {
  return new Promise((resolve) => {
    window[cbName] = resolve; // 暴露回调给服务器返回的 JS 调用
    const script = document.createElement("script");
    script.src = `${url}?callback=${cbName}`;
    document.body.appendChild(script);
    script.onload = () => script.remove();
  });
}
// jsonp('//other-domain.com/api', 'cb1').then(data => ...)
// 服务器返回：cb1({name: 'Alice'})
// 缺点：只能 GET；有安全风险（XSS）；依赖服务器支持
```

**CORS（跨域资源共享）**：现代标准方案。

```text
简单请求（GET/HEAD/POST + 特定 Content-Type）：
  浏览器发请求 → 服务器返回 Access-Control-Allow-Origin: *
                    或 Access-Control-Allow-Origin: https://foo.com
                → 浏览器放行

预检请求（OPTIONS 预检 + 实际请求）：
  PUT/DELETE/Content-Type: application/json/自定义 Header 等
  → 先发 OPTIONS 询问服务器
  → 服务器返回 Access-Control-Allow-Methods/Headers/Origin
  → 再发真正的请求

withCredentials: true 时：
  → 带 Cookie
  → 服务器 Access-Control-Allow-Origin 不能是 *，必须是具体域名
  → 同时需要 Access-Control-Allow-Credentials: true
```

---
