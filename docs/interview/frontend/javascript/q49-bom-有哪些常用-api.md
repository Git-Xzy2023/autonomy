---
title: "BOM 有哪些常用 API？"
---

# BOM 有哪些常用 API？

```js
// ===== window =====
window.innerWidth / innerHeight; // 视口尺寸（不含工具栏）
window.outerWidth / outerHeight; // 浏览器窗口整体尺寸
window.scrollX / scrollY; // 当前滚动距离
window.pageXOffset / pageYOffset; // 同上（别名）

window.scrollTo(0, 100); // 绝对位置
window.scrollBy(0, 100); // 相对滚动
element.scrollIntoView({ behavior: "smooth" }); // 滚动到元素可见

window.open(url, "_blank"); // 打开新窗口
window.close();

// ===== location =====
location.href; // 完整 URL
location.protocol; // 'https:'
location.host; // 'example.com:8080'
location.hostname; // 'example.com'
location.pathname; // '/foo/bar'
location.search; // '?a=1&b=2'
location.hash; // '#section'
location.origin; // 'https://example.com:8080'
location.assign(url); // 跳转（有历史记录）
location.replace(url); // 跳转（替换当前历史，不能后退）
location.reload(); // 刷新

// ===== history =====
history.length;
history.back();
history.forward();
history.go(-1); // 后退一页
history.pushState({ id: 1 }, "", "/new-url"); // SPA 路由核心（不刷新页面）
history.replaceState({ id: 2 }, "", "/new-url");

// ===== navigator =====
navigator.userAgent; // UA 字符串（不推荐做浏览器判断，用特性检测）
navigator.language; // 'zh-CN'
navigator.geolocation.getCurrentPosition((p) => console.log(p.coords));
navigator.onLine; // 是否在线
navigator.clipboard.writeText("xxx"); // 剪贴板 API（需 HTTPS）

// ===== localStorage / sessionStorage =====
localStorage.setItem("key", "value");
localStorage.getItem("key");
localStorage.removeItem("key");
localStorage.clear();
// sessionStorage 同 API，但关闭标签页即清空；localStorage 永久（除非手动清理）
```

---
