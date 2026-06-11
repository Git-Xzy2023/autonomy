---
title: "经典例题：setTimeout vs setImmediate"
---

# 经典例题：setTimeout vs setImmediate

```js
// 主模块中（不在 I/O 回调中）
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
// 执行顺序不稳定！可能 timeout 先，也可能 immediate 先。
// 原因：setTimeout(0) 实际约等于 setTimeout(1)，取决于事件循环启动时刻的调度
```

```js
// 放在同一个 I/O 回调内部（如 fs.readFile 的回调）
const fs = require("fs");
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// 输出顺序固定：immediate → timeout
// 原因：I/O 回调在 poll 阶段执行，紧接着是 check 阶段（setImmediate）
// 然后才是下一轮的 timers 阶段
```

**结论**：`setImmediate` 设计初衷就是「在 I/O 之后立即执行」，在 I/O 回调内它必然先于 `setTimeout(0)` 执行。
