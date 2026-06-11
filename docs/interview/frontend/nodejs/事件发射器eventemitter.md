---
title: "事件发射器（EventEmitter）"
---

# 事件发射器（EventEmitter）

Node.js 内置的发布-订阅模式实现，很多核心模块（Stream、net、http、process）都继承自它。

```js
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("data", (chunk) => console.log("收到数据", chunk)); // 订阅
emitter.on("error", (err) => console.error(err)); // 必须监听 error，否则抛错会崩溃
emitter.once("init", () => console.log("只执行一次")); // 一次性订阅

emitter.emit("data", "hello"); // 发布
emitter.emit("error", new Error("oops"));

emitter.setMaxListeners(20); // 默认 10 个，超过会有警告（防止内存泄漏）
```

**EventEmitter 是同步执行的！** `emit` 调用时会立即同步调用所有注册的监听器，不会进入事件循环。
