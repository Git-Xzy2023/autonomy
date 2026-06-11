# 事件循环

## 概念

因为 JS 是单线程运行的，遇到异步事件时，JS 引擎不会一直等待返回结果，而是将事件挂起，继续执行同步任务。

## 执行顺序

1. 首先执行同步代码（宏任务）
2. 执行完同步代码后，执行栈为空，检查异步任务
3. 执行所有**微任务**
4. 微任务执行完后，如有必要会渲染页面
5. 开始下一轮 Event Loop，执行宏任务中的异步代码

## 宏任务和微任务

| 类型 | 包含 |
|------|------|
| **微任务** | Promise 回调、process.nextTick、MutationObserver |
| **宏任务** | script 脚本、setTimeout、setInterval、setImmediate、I/O 操作、UI 渲染 |

## 执行栈

存储函数调用的栈结构，遵循先进后出原则。

## Node 中的 Event Loop

Node 的 Event Loop 分为 6 个阶段，按顺序反复运行：
1. **Timers**：执行过期的计时器回调
2. **Pending callbacks**：执行推迟到下一个循环的 I/O 回调
3. **Idle/Prepare**：仅供内部使用
4. **Poll**：执行 I/O 回调
5. **Check**：执行 setImmediate 回调
6. **Close callbacks**：执行关闭回调

`process.nextTick` 独立于 Event Loop，拥有自己队列，优先于其他微任务执行。
