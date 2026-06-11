---
title: "Promise 的三种状态？状态转换规则？"
---

# Promise 的三种状态？状态转换规则？

```text
         (executor 执行)
Pending  ── resolve(value) ──► Fulfilled（已完成）
         └─ reject(reason) ──► Rejected（已拒绝）

规则：① 状态只能从 Pending → Fulfilled 或 Pending → Rejected；
     ② 一旦改变就不可逆；
     ③ .then / .catch / .finally 都基于这个状态变化。
```

```js
const p = new Promise((resolve, reject) => {
  console.log("同步执行"); // ✅ 立刻执行
  setTimeout(() => resolve("ok"), 100);
});

p.then((v) => console.log(v)) // 'ok'
  .catch((err) => console.error(err))
  .finally(() => console.log("都会执行")); // 无论成功失败都执行
```

---
