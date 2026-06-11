---
title: "child_process：多进程"
---

# child_process：多进程

`child_process` 模块用于**创建子进程**（执行 shell 命令、跑另一个 Node 脚本等）。

```js
const { exec, execFile, spawn, fork } = require("child_process");

// 1. exec：执行 shell 命令，缓冲输出，适合小输出
exec("ls -la", (err, stdout, stderr) => console.log(stdout));

// 2. execFile：执行可执行文件（不走 shell，更安全）
execFile("node", ["--version"], (err, stdout) => console.log(stdout));

// 3. spawn：流式输出，适合大输出/长时间运行
const ls = spawn("ls", ["-la"]);
ls.stdout.on("data", (chunk) => process.stdout.write(chunk));
ls.stderr.on("data", (chunk) => process.stderr.write(chunk));

// 4. fork：专门 fork 一个 Node 子进程，建立 IPC 通道可通信
// parent.js
const child = fork("./child.js");
child.send({ hello: "world" }); // 通过 IPC 发消息
child.on("message", (msg) => console.log("from child", msg));

// child.js
process.on("message", (msg) => {
  process.send({ result: heavyCompute(msg) }); // 子进程做重计算，不阻塞父进程
});
```

**`spawn` vs `exec` vs `execFile` vs `fork`：**

| API      | 走 shell      | 返回       | IPC | 适用场景                                |
| -------- | ------------- | ---------- | --- | --------------------------------------- |
| spawn    | 默认 no       | Stream     | no  | 大输出、长时间运行的命令                |
| exec     | yes           | buffer     | no  | 短命令、需要 shell 语法（管道、重定向） |
| execFile | no            | buffer     | no  | 直接执行二进制文件                      |
| fork     | no（走 node） | 子进程实例 | yes | fork 新 Node 进程，双向通信             |
