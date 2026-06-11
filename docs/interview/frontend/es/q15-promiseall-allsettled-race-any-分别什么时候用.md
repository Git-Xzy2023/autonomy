---
title: "`Promise.all` / `allSettled` / `race` / `any` 分别什么时候用？"
---

# `Promise.all` / `allSettled` / `race` / `any` 分别什么时候用？

| 方法 | 成功条件 | 失败条件 | 返回内容 |
| --- | --- | --- | --- |
| `Promise.all([...])` | **全部**成功 | 任何一个失败 → 立刻以该失败原因 reject | 按顺序的结果数组 |
| `Promise.allSettled([...])` | 永远成功（等全部完成） | 永不失败 | `[{status:'fulfilled', value} / {status:'rejected', reason}]` |
| `Promise.race([...])` | 第一个**完成**的（无论成功失败） | 第一个失败的就 reject | 第一个完成的值/错误 |
| `Promise.any([...])` | 第一个**成功**的（ES2021） | 全部失败 → `AggregateError` | 第一个成功的值 |

**典型场景**：

```js
// 页面多个接口并行加载，全拿到后再渲染
Promise.all([fetchUser(), fetchOrders()]).then(([u, o]) => render(u, o));

// 只要知道「每个接口有没有成功」，绝不抛错
Promise.allSettled([a(), b(), c()]).then((results) =>
  results.filter((r) => r.status === "fulfilled"),
);

// 超时控制（谁先完成用谁）
Promise.race([fetchData(), delay(3000).then(() => Promise.reject("timeout"))]);

// 多 CDN 取一份资源，哪个最快且成功就用哪个
Promise.any([fetch("//cdn1/x"), fetch("//cdn2/x"), fetch("//cdn3/x")]);
```

---
