---
title: "什么是 Tree Shaking？需要满足什么条件？"
---

# 什么是 Tree Shaking？需要满足什么条件？

**Tree Shaking = 静态分析代码，移除未使用的 `export`（死代码）**。

**必要条件**：

1. 使用 **ES Module**（`import/export`）语法 —— CommonJS 动态，无法静态分析
2. `package.json` 中 `"sideEffects": false`（或列出有副作用的文件）
3. 打包工具支持（Webpack 4+、Rollup、Vite/esbuild）
4. 生产模式 + 压缩（Terser）才会真正删除代码

```js
// math.js
export function add(a, b) {
  return a + b;
}
export function sub(a, b) {
  return a - b;
} // 没被 import → 被 shake 掉

// app.js
import { add } from "./math.js"; // 只用到 add
console.log(add(1, 2));
```

> 副作用（Side Effects）= 模块在被 import 时除了导出还做了其他事（如修改全局、注入样式、给原型加方法）。有副作用的模块不能被 Tree Shaking。

---
