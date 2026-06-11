---
title: "`XMLHttpRequest` vs `fetch` vs `axios`？"
---

# `XMLHttpRequest` vs `fetch` vs `axios`？

```js
// ===== XHR（老式） =====
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/user");
xhr.onload = () => console.log(JSON.parse(xhr.responseText));
xhr.onerror = () => console.error("error");
xhr.send();

// ===== fetch（现代原生，Promise 风格） =====
fetch("/api/user", { credentials: "include" }) // 默认不带 Cookie！
  .then((r) => {
    if (!r.ok) throw new Error("HTTP " + r.status); // ⚠️ 404/500 不会自动 reject！
    return r.json();
  })
  .then((data) => console.log(data));

// ===== async/await + fetch =====
async function getUser() {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("请求失败");
  return res.json();
}

// ===== axios（第三方库） =====
// axios.get('/api/user').then(r => r.data);
// 优势：自动 JSON 解析、请求/响应拦截器、超时、取消请求、自动携带 Cookie
```

**fetch 常见坑**：

- 404/500 等 HTTP 错误状态码**不会**让 Promise reject（只有网络错误才会）
- 默认**不携带 Cookie**，需要 `credentials: 'include'`
- 默认不设超时（需要自己用 `AbortController` 实现）
- 不能直接监听上传进度（XHR 可以）

---
