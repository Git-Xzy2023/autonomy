---
title: "Vue2 nextTick 微任务降级策略源码"
---

# Vue2 nextTick 微任务降级策略源码

## 为什么需要降级

`nextTick` 的目标是"在 DOM 更新后执行回调"。DOM 更新是异步的（在 nextTick 队列里），所以 nextTick 回调必须在 DOM 更新之后。最理想是**微任务**（Promise.then），因为微任务在当前事件循环结束前执行，比宏任务更快。

但浏览器兼容性参差不齐：

- 旧版 IE 不支持 Promise
- iOS UIWebView 有 MutationObserver 的 bug
- setImmediate 只有 IE 支持

Vue2 用降级链：**Promise → MutationObserver → setImmediate → setTimeout**，保证在所有浏览器都能找到可用的异步 API。

## 源码解析

```js
// src/core/util/next-tick.js

const callbacks = []; // 待执行的回调队列
let pending = false;  // 是否已排入异步任务

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i](); // 依次执行
  }
}

export function nextTick(cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc(); // 触发异步 flush
  }

  // 没有 cb 时返回 Promise，支持 async/await
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}
```

### timerFunc 的降级实现

```js
let timerFunc;

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  // 1. Promise.then（微任务，首选）
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // iOS UIWebView 下 Promise.then 会被推入宏任务队列
    // 用一个空的 setTimeout 强制推进
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // 2. MutationObserver（微任务）
  // 监听一个文本节点的变化，触发 flushCallbacks
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter); // 修改文本，触发 observer
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 3. setImmediate（宏任务，IE 专用，比 setTimeout 快）
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 4. setTimeout（宏任务，兜底）
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

## 为什么选这四个

### 1. Promise.then（微任务）

```js
Promise.resolve().then(flushCallbacks);
```

- **优点**：微任务，在当前事件循环结束前执行，延迟最小。
- **缺点**：iOS UIWebView（旧版）有 bug，Promise.then 会被当作宏任务，所以加 `setTimeout(noop)` 修复。
- **兼容**：IE 不支持，现代浏览器都支持。

### 2. MutationObserver（微任务）

```js
const observer = new MutationObserver(flushCallbacks);
observer.observe(textNode, { characterData: true });
textNode.data = 'changed'; // 触发 observer
```

- **优点**：微任务，兼容性好（IE11+）。
- **原理**：监听 DOM 变化，回调在微任务队列执行。用一个隐藏的文本节点，修改它的 `data` 触发。
- **缺点**：iOS UIWebView 也有问题，所以加了 `!isIE` 排除 IE（IE 的 MutationObserver 实现有 bug）。

### 3. setImmediate（宏任务）

```js
setImmediate(flushCallbacks);
```

- **优点**：比 setTimeout 快（setTimeout 最小 4ms 延迟，setImmediate 几乎 0 延迟）。
- **兼容**：只有 IE10+ 支持，Node.js 也支持。

### 4. setTimeout（宏任务）

```js
setTimeout(flushCallbacks, 0);
```

- **优点**：所有浏览器都支持。
- **缺点**：宏任务，延迟最大（HTML5 规范最小 4ms）；嵌套超过 5 层会被强制 4ms。

## nextTick 与数据更新的关系

```js
this.msg = 'hello'; // 触发 setter → dep.notify → watcher.update → queueWatcher
// queueWatcher 内部：nextTick(flushSchedulerQueue)

this.$nextTick(() => { /* DOM 已更新 */ });
// nextTick 内部：callbacks.push(回调)
```

**关键：** `queueWatcher` 调用 `nextTick(flushSchedulerQueue)` 时，`pending` 从 false 变 true，`timerFunc` 被调用。之后用户调 `$nextTick`，`pending` 已是 true，只 push 到 callbacks，不再调 `timerFunc`。

**执行顺序：**

```
callbacks: [flushSchedulerQueue, 用户回调1, 用户回调2]
            ↑ 先执行：更新 DOM
                        ↑ 后执行：拿到更新后的 DOM
```

所以用户回调在 DOM 更新后执行，能拿到最新 DOM。

## Vue3 的变化

Vue3 的 nextTick 简化了：

```js
// packages/runtime-core/src/scheduler.ts
const resolvedPromise = Promise.resolve() as Promise<any>;
let currentFlushPromise = null;

export function nextTick<T>(this: T, fn?: (this: T) => void): Promise<void> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
```

**Vue3 直接用 Promise，不再降级**，因为：

1. 现代浏览器都支持 Promise（Vue3 不再支持 IE）。
2. Vue3 的目标是现代浏览器，不需要兼容 IE 的 MutationObserver/setImmediate。
3. 代码更简洁，维护成本低。

**这是 Vue3 舍弃 IE 支持带来的简化之一。**
