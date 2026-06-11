---
title: "浏览器 EventLoop vs Node.js EventLoop"
---

# 浏览器 EventLoop vs Node.js EventLoop

| 特性                              | 浏览器                                          | Node.js（libuv）                                                         |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| 任务分类                          | 宏任务（task queue）+ 微任务（microtask queue） | 6 个阶段的宏任务队列 + process.nextTick + Promise 微任务                 |
| 宏任务顺序                        | 一个宏任务 → 清空微任务 → 下一个宏任务          | 同一阶段内的多个宏任务可能一起执行（直到队列空或达到上限），再清空微任务 |
| `setTimeout(0)` vs `setImmediate` | 无 setImmediate，只有 setTimeout                | 两者分属不同阶段，顺序可预测                                             |
| `requestAnimationFrame`           | 有（渲染阶段）                                  | 无（Node 没有渲染）                                                      |
| 渲染                              | 每轮循环可能刷新页面                            | 不涉及渲染                                                               |
