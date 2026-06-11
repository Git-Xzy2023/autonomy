---
title: "`__dirname` vs `./` 的陷阱"
---

# `__dirname` vs `./` 的陷阱

在 CommonJS 中：

- `__dirname` 始终是**当前文件所在目录的绝对路径**
- `./` 在 `require('./xxx')` 中是「当前文件目录」，但在 `fs.readFile('./xxx')` 中是「进程 cwd」

```js
// 如果你 cd 到 /home 再执行 node src/app.js
// 那么：
require("./utils"); // 加载 /home/src/utils.js（相对于当前文件）
fs.readFile("./data"); // 读取 /home/data（相对于 process.cwd()）！
```

**最佳实践**：读写文件永远用 `path.join(__dirname, 'data')` 或 `path.resolve(process.cwd(), 'data')`，别用裸 `./`。
