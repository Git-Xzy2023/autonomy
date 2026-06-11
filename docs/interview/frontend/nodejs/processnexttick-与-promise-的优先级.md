---
title: "process.nextTick 与 Promise 的优先级"
---

# process.nextTick 与 Promise 的优先级

```js
setTimeout(() => console.log("timeout1"), 0);

Promise.resolve().then(() => console.log("promise1"));
process.nextTick(() => console.log("nextTick1"));

setImmediate(() => console.log("immediate1"));

Promise.resolve().then(() => console.log("promise2"));
process.nextTick(() => {
  console.log("nextTick2");
  process.nextTick(() => console.log("nextTick3")); // 同轮执行
  Promise.resolve().then(() => console.log("promise3"));
});

console.log("sync end");

// 输出顺序：
// sync end
// nextTick1 → nextTick2 → nextTick3  (nextTick 队列为空后再清 Promise)
// promise1 → promise2 → promise3
// timeout1     (下一轮 timers 阶段)
// immediate1   (再下一轮 check 阶段)
```

**关键点：**

- 同步代码最先执行
- 每次同步代码执行完，先清空 `process.nextTick` 队列（nextTick 可以往自己队列继续加，会一直执行完）
- 再清空 Promise 微任务队列
- 才进入下一阶段的宏任务
