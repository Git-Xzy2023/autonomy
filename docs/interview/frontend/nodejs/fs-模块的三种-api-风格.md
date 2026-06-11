---
title: "fs 模块的三种 API 风格"
---

# fs 模块的三种 API 风格

```js
const fs = require('fs');

// 1. 回调（异步，不阻塞事件循环）—— 推荐
fs.readFile('/path', 'utf8', (err, data) => { ... });

// 2. 同步（阻塞事件循环，只应在启动初始化时使用）
try {
  const data = fs.readFileSync('/path', 'utf8');
} catch (err) { ... }

// 3. Promise 风格（Node 10+）—— 与 async/await 搭配最佳
const fsp = require('fs/promises');
(async () => {
  const data = await fsp.readFile('/path', 'utf8');
})();
```
