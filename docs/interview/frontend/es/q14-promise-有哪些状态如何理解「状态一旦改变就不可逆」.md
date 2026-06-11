---
title: "Promise 有哪些状态？如何理解「状态一旦改变就不可逆」？"
---

# Promise 有哪些状态？如何理解「状态一旦改变就不可逆」？

三种状态：

- **pending**（进行中）
- **fulfilled**（已成功，调用了 `resolve`）
- **rejected**（已失败，调用了 `reject` 或 executor 抛错）

转换规则：**只能从 `pending` → `fulfilled` 或 `pending` → `rejected`**，一旦转换完成就不会再变。

```js
const p = new Promise((res, rej) => {
  res("ok");
  rej("oops");   // 被忽略
  res("again"); // 被忽略
});
// p 永远是 fulfilled("ok")
```

---
