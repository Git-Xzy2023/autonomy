---
title: "CommonJS 模块系统"
---

# CommonJS 模块系统

Node.js 原生实现了 **CommonJS**（`require / module.exports`）。

**加载流程（require(x)）：**

1. **路径解析**（`Module._resolveFilename`）
   - 核心模块（如 `fs`、`path`）：直接返回
   - 相对路径（`./a`、`../b`）：拼接绝对路径 + 尝试后缀 `.js` `.json` `.node`
   - 模块名（`lodash`）：沿 `node_modules` 向上查找，匹配 `package.json` 的 `main` 字段或 `index.js`
2. **缓存检查**（`Module._cache`）：已加载直接返回 `exports`，确保单例
3. **创建模块实例**（`new Module(filename, parent)`）
4. **加载文件**：
   - `.js`：读取文件 → 用 `vm` 模块包裹函数 → 传入 `exports, require, module, __filename, __dirname` 执行
   - `.json`：`JSON.parse` 后直接赋值给 `module.exports`
   - `.node`：C++ 原生模块，通过 `process.dlopen` 加载
5. **返回 `module.exports`**

**require 的包裹函数：**

```js
// node 内部将每个 .js 文件包成这样一个函数
(function (exports, require, module, __filename, __dirname) {
  // 你的代码...
  return module.exports;
});
```

**`exports` vs `module.exports`：**

```js
// 正确用法 1：给 module.exports 赋值新对象
module.exports = { foo: "bar" };

// 正确用法 2：给 exports 挂属性（因为 exports 初始 === module.exports）
exports.foo = "bar";

// ❌ 错误：直接给 exports 赋值，切断了与 module.exports 的引用关系
exports = { foo: "bar" }; // 不会生效！
```

**ES Modules（ESM）：**

Node.js 从 v14 开始正式支持 ESM（`import/export`）。两种启用方式：

- `package.json` 中设置 `"type": "module"`
- 文件后缀用 `.mjs`

| 特性        | CommonJS                               | ESM                                                    |
| ----------- | -------------------------------------- | ------------------------------------------------------ |
| 语法        | `require()` / `module.exports`         | `import` / `export`                                    |
| 加载方式    | 运行时同步加载                         | 编译时静态分析 + 异步加载                              |
| 顶层 await  | 不支持（Node 14.8+ CJS 也不支持）      | 支持                                                   |
| 模块对象    | `require('url')` 返回 `module.exports` | `import url from 'url'` 返回 default export            |
| JSON 导入   | `require('data.json')` 直接使用        | `import data from 'data.json' assert { type: 'json' }` |
| `__dirname` | 可用                                   | 不可用，需用 `import.meta.url` + `fileURLToPath`       |
