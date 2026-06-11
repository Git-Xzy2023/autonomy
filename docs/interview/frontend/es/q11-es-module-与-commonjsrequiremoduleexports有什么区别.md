---
title: "ES Module 与 CommonJS（`require`/`module.exports`）有什么区别？"
---

# ES Module 与 CommonJS（`require`/`module.exports`）有什么区别？

| 对比项 | CommonJS（Node.js 传统） | ES Module（浏览器 / 现代 Node） |
| --- | --- | --- |
| 语法 | `require('x')`、`module.exports = ...` | `import x from 'x'`、`export default ...` |
| 加载时机 | 运行时动态加载（`require` 是个函数，可以放在 `if` 里） | 静态分析（`import` 必须在顶层，不能放在块内） |
| 导出值语义 | **导出值的拷贝**（基本类型）或 **导出引用**（对象） | **导出的是活绑定（live binding）**——模块内部改变变量，import 端看到的也会变 |
| this | 模块内 `this === exports` | 模块内 `this === undefined` |
| 循环依赖 | 已经 `exports` 出来的部分可见，其余是 `undefined` | 需要使用「函数提升」等技巧绕过；现代打包器一般支持良好 |
| 浏览器原生支持 | ❌（需要打包工具） | ✅ `<script type="module">` |

**Live Binding 的经典面试示例**：

```js
// counter.js
export let count = 0;
export function inc() { count++; }

// main.js
import { count, inc } from "./counter.js";
console.log(count); // 0
inc();
console.log(count); // 1  —— 不是 0！
```

> CommonJS 中 `exports.count` 会是固定的值快照，而 ESM 中 `count` 是一个「指向原模块内变量的引用」。

---
