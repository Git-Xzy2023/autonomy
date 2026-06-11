---
title: "`import` 和 `require` 能混用吗？动态 `import()` 是什么？"
---

# `import` 和 `require` 能混用吗？动态 `import()` 是什么？

- **`import()` 动态导入**（ES2020）：在运行时按需加载，返回 `Promise`。
  ```js
  async function loadPlugin(name) {
    const mod = await import(`./plugins/${name}.js`);
    mod.default();
  }
  ```
- **是否能混用**：浏览器中不存在 `require`。Node.js 中：
  - `.mjs` 文件或 `package.json` 里 `"type": "module"` → 只能 `import`；
  - `.cjs` 文件 → 只能 `require`；
  - ESM 文件里可以通过 `module.createRequire` 获得一个 `require` 函数。
- 工程里一般由 Babel / Vite / Webpack 统一处理，两种语法都能写，但项目内部建议保持一致。

---
