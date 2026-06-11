---
title: "Vue3 生命周期（Composition API）"
---

# Vue3 生命周期（Composition API）

Vue3 生命周期以 `onXxx` 钩子形式存在，必须在 `setup()` 顶层（或其他 `<script setup>` 同步作用域）调用。

| Vue2 选项式   | Vue3 Composition API | 说明                                 |
| ------------- | -------------------- | ------------------------------------ |
| beforeCreate  | —                    | 直接写在 setup() 顶部即可            |
| created       | —                    | 直接写在 setup() 顶部即可            |
| beforeMount   | onBeforeMount        | 挂载前                               |
| mounted       | onMounted            | 挂载后                               |
| beforeUpdate  | onBeforeUpdate       | 更新前                               |
| updated       | onUpdated            | 更新后                               |
| beforeDestroy | onBeforeUnmount      | 销毁前                               |
| destroyed     | onUnmounted          | 销毁后                               |
| activated     | onActivated          |                                      |
| deactivated   | onDeactivated        |                                      |
| errorCaptured | onErrorCaptured      |                                      |
| —             | onRenderTracked      | 依赖被追踪时（开发调试用）           |
| —             | onRenderTriggered    | 依赖变更触发重新渲染时（开发调试用） |

**父子组件生命周期执行顺序：**

```
挂载阶段：
父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted

更新阶段（父数据变化）：
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated

销毁阶段：
父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted
```
