---
title: "`globalThis`（ES2020）解决了什么问题？"
---

# `globalThis`（ES2020）解决了什么问题？

在浏览器里全局对象是 `window` / `self`；在 Web Worker 里是 `self`；在 Node 里是 `global`；在严格模式下裸 `this` 又不是全局……**`globalThis` 统一了这个访问入口**，任何环境下都指向「全局对象」。

---
