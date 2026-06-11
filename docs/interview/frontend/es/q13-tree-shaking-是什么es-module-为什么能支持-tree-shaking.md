---
title: "Tree Shaking 是什么？ES Module 为什么能支持 Tree Shaking？"
---

# Tree Shaking 是什么？ES Module 为什么能支持 Tree Shaking？

**Tree Shaking = 「死代码消除」——打包时丢掉没有被真正用到的 export**。前提：

1. 模块系统必须是「可静态分析」的，也就是 `import`/`export` 必须在顶层、路径必须是字符串字面量（这就是 ESM 的设计）。
2. `require` 在 CommonJS 中是动态的（可以放在 `if` 里、路径可以是字符串拼接变量），所以静态分析器难以判断某个导出是否被用到 → **CommonJS 默认不支持 Tree Shaking**。
3. 打包工具层面，Webpack / Rollup / Vite 都默认对 ESM 做 Tree Shaking。

**让你的库更好被 Shake 的建议**：

- 直接 `export function f() {}` 而不是最后 `module.exports = { f }`；
- 不要在模块顶层做副作用（比如挂全局、立即调用大函数）；
- `package.json` 里标注 `"sideEffects": false` 或列出有副作用的文件。

---
