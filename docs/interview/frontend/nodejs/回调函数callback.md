---
title: "回调函数（Callback）"
---

# 回调函数（Callback）

Node.js 约定的错误优先回调（Error-First Callback）：

```js
const fs = require("fs");

fs.readFile("/path/file", "utf8", (err, data) => {
  if (err) {
    // 第一个参数永远是 Error，成功则为 null
    console.error(err);
    return;
  }
  console.log(data); // 第二个参数才是结果
});
```

**回调地狱（Callback Hell）**：嵌套过深难以维护

```js
fs.readFile("a.txt", "utf8", (err, a) => {
  if (err) throw err;
  fs.readFile("b.txt", "utf8", (err, b) => {
    if (err) throw err;
    fs.writeFile("c.txt", a + b, (err) => {
      if (err) throw err;
      // ...越来越深
    });
  });
});
```
