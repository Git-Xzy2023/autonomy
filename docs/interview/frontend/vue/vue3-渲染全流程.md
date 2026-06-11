---
title: "Vue3 渲染全流程"
---

# Vue3 渲染全流程

```
createApp(App).mount('#app')
    ↓ createComponentInstance
创建组件实例 instance (type/props/slots/ctx/proxy...)
    ↓ setupComponent
初始化 props/slots，执行 setup()
    ↓ setupRenderEffect
创建 effect（类似 Vue2 渲染 Watcher）
    ↓ instance.render() → VNode tree
    ↓ patch(n1, n2, container)
递归 patch 各节点（Element / Component / Text / Comment / Fragment / Teleport / Suspense）
    ↓ 响应式数据变化 → trigger → effect scheduler → queueJob
    ↓ nextTick flushJobs → 重新 render + patch
```
