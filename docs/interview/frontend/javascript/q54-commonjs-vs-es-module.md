---
title: "CommonJS vs ES Module？"
---

# CommonJS vs ES Module？

| 特性     | CommonJS (`require`)                            | ES Module (`import/export`)              |
| -------- | ----------------------------------------------- | ---------------------------------------- |
| 语法     | `const x = require('x')` `module.exports = ...` | `import x from 'x'` `export default ...` |
| 加载方式 | 运行时动态加载（同步）                          | 静态分析（编译时解析，可 Tree Shaking）  |
| 导出值   | 值的**拷贝**（导出后再改不影响）                | 值的**引用**（绑定）                     |
| 环境     | Node.js（旧）/Browserify/Webpack 打包           | Node.js 14+、现代浏览器、打包工具        |
| `this`   | 模块本身                                        | `undefined`                              |
| 动态导入 | `require(x)` 支持变量                           | `import(x)` 返回 Promise                 |

```js
// ===== CommonJS =====
// a.js
let count = 0;
module.exports = {
  count,
  inc: () => count++,
};
// b.js
const a = require("./a");
console.log(a.count); // 0
a.inc();
console.log(a.count); // 0（值拷贝！count 是原始值，导出时 snapshot 了）

// ===== ES Module =====
// a.mjs
export let count = 0;
export const inc = () => count++;
// b.mjs
import { count, inc } from "./a.mjs";
console.log(count); // 0
inc();
console.log(count); // 1（活绑定！）
```

---
