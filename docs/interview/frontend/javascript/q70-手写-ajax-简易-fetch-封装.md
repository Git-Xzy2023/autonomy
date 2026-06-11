---
title: "手写 `ajax` / 简易 `fetch` 封装"
---

# 手写 `ajax` / 简易 `fetch` 封装

```js
function ajax({ url, method = "GET", data = null, headers = {} }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => reject(new Error("网络错误"));
    xhr.send(data ? JSON.stringify(data) : null);
  });
}
```
