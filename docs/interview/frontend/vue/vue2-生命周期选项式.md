---
title: "Vue2 生命周期选项式"
---

# Vue2 生命周期选项式

```
beforeCreate  → 实例初始化，props & methods 就绪前，无法访问 this.data
created       → data/methods/computed 都已就绪，可以访问 this，但未挂载 DOM
beforeMount   → 模板编译完成，即将挂载，render 函数首次调用前
mounted       → DOM 已挂载到页面，$el 可用，可以操作 DOM（但不能保证所有子组件都挂载完毕）
beforeUpdate  → 数据变化后，DOM 更新前（适合获取更新前的 DOM 状态）
updated       → DOM 已更新（避免在 updated 中修改数据，可能导致死循环）
beforeDestroy → 实例销毁前，仍然可以访问 this，适合清除定时器、取消订阅
destroyed     → 实例已销毁，所有 watcher 被移除，事件监听器被移除

activated     → keep-alive 包裹的组件激活时
deactivated   → keep-alive 包裹的组件失活时
errorCaptured → 捕获子孙组件错误（Vue2.5+）
```
