---
title: "常见面试题"
---

# 常见面试题

**Q1：浏览器中的 JS 和 Node.js 中的 JS 有什么区别？**

- 宿主环境不同：浏览器提供 DOM/BOM API（`window`、`document`），Node 提供 `fs`、`http`、`net`、`os`、`path` 等服务端 API
- 模块系统不同：浏览器用 ES Modules（`<script type="module">`）+ 浏览器 API；Node 用 CommonJS + ESM
- 全局对象不同：浏览器是 `window` / `globalThis`；Node 是 `global` / `globalThis`
- 顶层 this 指向不同：浏览器顶层 `this === window`；Node CJS 中 `this === module.exports`（不是 global）
- 安全模型不同：浏览器有同源策略、沙箱；Node 可以直接读写文件、调用系统命令

**Q2：`__dirname` 和 `process.cwd()` 的区别？**

- `__dirname`：**当前文件所在目录**的绝对路径
- `process.cwd()`：**进程启动时所在目录**（current working directory）
- 当你在 `/a` 目录执行 `node /b/c.js` 时，`__dirname = '/b'`，`process.cwd() = '/a'`

**Q3：`require` 是同步还是异步的？为什么可以设计成同步？**

`require` 是**同步**的（阻塞式）读取文件并执行。

原因：

1. 模块加载通常在程序启动阶段完成，此时还没有进入事件循环处理请求
2. 模块数量有限，磁盘 IO 相比后续业务请求可忽略不计
3. 同步实现简单且语义清晰，后续 `require()` 能立即拿到完整导出

但是动态加载大模块时可能阻塞事件循环，所以 Node 又提供了异步的 `import()` 动态导入（返回 Promise）。

**Q4：CommonJS 与 ESM 在循环依赖上的行为差异？**

CommonJS：循环依赖时返回「已执行到当前位置的 `module.exports`」，尚未执行到的属性不存在。

ESM：循环依赖时 `import` 拿到的是**活绑定（live binding）**，引用指向变量本身，后续代码执行给变量赋值后可以拿到新值。
