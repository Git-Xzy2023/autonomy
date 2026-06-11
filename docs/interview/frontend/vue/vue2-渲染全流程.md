---
title: "Vue2 渲染全流程"
---

# Vue2 渲染全流程

```
new Vue(options)
    ↓ _init
初始化 props/data/methods/computed/watch + Observer 响应式
    ↓ $mount
    ↓ compileToFunctions （有 template 时走编译）
得到 render 函数
    ↓ render() → VNode
期间访问响应式数据触发 getter，收集渲染 Watcher 依赖
    ↓ createElm(vnode)
递归创建真实 DOM
    ↓ patch(oldVnode, vnode)
首次挂载：整棵插入；更新：diff 比较最小修改
    ↓ insert → mounted
    ↓ 数据变化 → setter → dep.notify → Watcher 入队列
    ↓ nextTick 时 flushSchedulerQueue → 重新 render + patch
```
