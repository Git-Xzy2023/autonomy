---
title: "Vue2 nextTick 实现（src/core/util/next-tick.js）"
---

# Vue2 nextTick 实现（src/core/util/next-tick.js）

Vue2 做了多轮降级策略，兼容不同浏览器的微任务/宏任务支持：

```js
// 优先级：Promise → MutationObserver → setImmediate → setTimeout
let timerFunc;
if (typeof Promise !== "undefined") {
  timerFunc = () => Promise.resolve().then(flushCallbacks);
} else if (typeof MutationObserver !== "undefined") {
  const counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    textNode.data = String((counter + 1) % 2);
  };
} else if (typeof setImmediate !== "undefined") {
  timerFunc = () => setImmediate(flushCallbacks);
} else {
  timerFunc = () => setTimeout(flushCallbacks, 0);
}

// callbacks 数组收集所有回调，批量执行
const callbacks = [];
let pending = false;
export function nextTick(cb, ctx) {
  callbacks.push(() => cb.call(ctx));
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) copies[i]();
}
```
