---
title: "Cookie / localStorage / sessionStorage / IndexedDB 的区别？"
---

# Cookie / localStorage / sessionStorage / IndexedDB 的区别？

| 特性         | Cookie                  | localStorage | sessionStorage   | IndexedDB              |
| ------------ | ----------------------- | ------------ | ---------------- | ---------------------- |
| 容量         | ~4KB                    | 5~10MB       | 5~10MB           | 无限制（用户磁盘空间） |
| 生命周期     | 可设置过期时间          | 永久         | 标签页关闭即清除 | 永久                   |
| 与服务器通信 | ✅ 每次请求自动携带     | ❌ 不自动    | ❌ 不自动        | ❌ 不自动              |
| 存储类型     | 字符串                  | 字符串       | 字符串           | 任意对象               |
| API 同步     | 同步                    | 同步         | 同步             | 异步                   |
| 跨域         | 同源 + domain/path 限制 | 严格同源     | 严格同源         | 严格同源               |

```js
// Cookie 操作（原生 API 比较繁琐）
document.cookie = "name=Alice; path=/; max-age=3600; HttpOnly=false";
// 注意：HttpOnly 的 Cookie JS 读不到（安全措施，防 XSS 偷 token）

// localStorage 存对象
localStorage.setItem("user", JSON.stringify({ name: "A" }));
const user = JSON.parse(localStorage.getItem("user") || "{}");

// IndexedDB：用第三方库（如 localForage、Dexie.js）更简单
```

---
