---
title: "Top-level await 是什么？（ES2022）"
---

# Top-level await 是什么？（ES2022）

**ES2022 允许在模块顶层直接使用 `await`**，不再必须包在 `async function` 里。

```js
// config.js（ES Module 文件）
const config = await fetch("/api/config").then((r) => r.json());
export default config;
```

**注意**：在同步依赖它的模块中，该模块会被「挂起」等待，所以使用不当可能拖慢整个应用启动。一般用于加载配置、懒加载插件等。

---
