---
title: "Vue 面试题索引"
---

# Vue 面试题索引

本目录整理 Vue 面试题，按 **Vue2 基础 / Vue2 源码 / Vue3 基础 / Vue3 源码** 四大类分组，重点覆盖底层原理、设计动机、弊端与改进。

## 一、Vue2 基础

- [v-model 原理与双向绑定](./101-vue2-vmodel-原理与双向绑定.md)
- [slot 插槽原理与演变](./102-vue2-slot-插槽原理与演变.md)
- [自定义指令原理与钩子](./103-vue2-自定义指令原理与钩子.md)
- [mixin 原理与弊端（为什么 Vue3 舍弃）](./104-vue2-mixin-原理与弊端.md)
- [过滤器原理（为什么 Vue3 移除）](./105-vue2-过滤器原理-为什么vue3移除.md)
- [provide/inject 原理与响应式陷阱](./106-vue2-provide-inject-原理与响应式陷阱.md)
- [事件总线原理与弊端](./107-vue2-事件总线原理与弊端.md)
- [v-for 中 key 的作用与 diff](./108-vue2-vfor-key的作用与diff.md)

## 二、Vue2 源码相关

- [Observer/Dep/Watcher 三件套源码](./201-vue2-observer-dep-watcher-三件套源码.md)
- [数组方法重写源码](./202-vue2-数组方法重写源码.md)
- [异步更新队列源码](./203-vue2-异步更新队列源码.md)
- [编译器静态优化原理](./204-vue2-编译器静态优化原理.md)
- [patch 双端 diff 源码](./205-vue2-patch-双端diff源码.md)
- [keep-alive LRU 缓存源码](./206-vue2-keepalive-lru缓存源码.md)
- [模板编译生成 render 函数过程](./207-vue2-模板编译生成render函数过程.md)
- [nextTick 微任务降级策略源码](./208-vue2-nexttick-微任务降级策略源码.md)

## 三、Vue3 基础

- [Composition API 设计动机](./301-vue3-composition-api-设计动机.md)
- [ref vs reactive 的选择](./302-vue3-ref-vs-reactive-的选择.md)
- [toRef / toRefs / toRaw 原理](./303-vue3-toref-torefs-toraw-原理.md)
- [shallow 系列 API 原理](./304-vue3-shallow系列api原理.md)
- [customRef 原理与防抖实战](./305-vue3-customref-原理与防抖实战.md)
- [watch vs watchEffect 原理与选择](./306-vue3-watch-vs-watcheffect-原理与选择.md)
- [defineProps / defineEmits / defineExpose 原理](./307-vue3-defineprops-defineemits-defineexpose-原理.md)
- [Suspense 原理与异步组件](./308-vue3-suspense-原理与异步组件.md)
- [Teleport 原理](./309-vue3-teleport-原理.md)
- [Fragment 原理与多根节点](./310-vue3-fragment-原理与多根节点.md)

## 四、Vue3 源码相关

- [effect 调度器与响应式原理](./401-vue3-effect-调度器与响应式原理.md)
- [编译优化：静态提升 / PatchFlag / Block Tree](./402-vue3-编译优化-静态提升-patchflag-block-tree.md)
- [Diff 算法：最长递增子序列](./403-vue3-diff-最长递增子序列.md)
- [渲染器原理与自定义渲染器](./404-vue3-渲染器原理与自定义渲染器.md)
- [setup 语法糖编译原理](./405-vue3-setup语法糖编译原理.md)
- [异步组件与 defineAsyncComponent 原理](./406-vue3-异步组件与defineasynccomponent原理.md)
- [KeepAlive 原理与缓存策略](./407-vue3-keepalive-原理与缓存策略.md)
- [响应式嵌套 effect 与依赖清理](./408-vue3-响应式嵌套effect与依赖清理.md)
- [ref 自动解包原理](./409-vue3-ref自动解包原理.md)
- [编译器优化：缓存与 v-memo](./410-vue3-编译器优化-缓存与v-memo.md)

## 五、原有题目（保留）

### 响应式

- [Vue2 响应式原理（Object.defineProperty）](./index.md)
- [Vue3 响应式原理（Proxy）](./vue3-响应式原理proxy.md)
- [响应式原理常见面试题](./响应式原理-常见面试题.md)
- [响应式系统改造](./响应式系统改造.md)
- [核心响应式 API](./核心响应式-api.md)
- [响应式系统改造](./响应式系统改造.md)

### 计算属性与侦听器

- [computed vs watch vs methods](./computed-vs-watch-vs-methods.md)
- [computed / watch / watchEffect](./computed-watch-watcheffect.md)
- [computed 原理](./computed-原理.md)
- [watch 原理](./watch-原理.md)

### 生命周期

- [Vue2 生命周期选项式](./vue2-生命周期选项式.md)
- [Vue3 生命周期（Composition API）](./vue3-生命周期composition-api.md)

### 渲染与 Diff

- [Vue2 渲染全流程](./vue2-渲染全流程.md)
- [Vue3 渲染全流程](./vue3-渲染全流程.md)
- [Vue2 的 Diff 算法（双端对比）](./vue2-的-diff-算法双端对比.md)
- [Vue3 的 Diff 优化](./vue3-的-diff-优化.md)
- [虚拟 DOM 是什么](./虚拟dom是什么.md)
- [虚拟 DOM 与 Diff 算法常见面试题](./虚拟dom与diff算法-常见面试题.md)

### 编译优化

- [Vue2 编译三阶段](./vue2-编译三阶段.md)
- [Vue3 编译优化](./vue3-编译优化.md)
- [编译优化](./编译优化.md)

### nextTick

- [为什么需要 nextTick](./为什么需要-nexttick.md)
- [nextTick 原理常见面试题](./nexttick-原理-常见面试题.md)
- [Vue2 nextTick 实现](./vue2-nexttick-实现srccoreutilnext-tickjs.md)
- [Vue3 nextTick 简化](./vue3-nexttick-简化.md)

### Vue3 新特性

- [Vue3 变化](./vue3-变化.md)
- [API 风格](./api-风格.md)
- [setup 函数](./setup-函数.md)
- [Fragments / Teleport / Suspense](./fragments-teleport-suspense.md)
- [自定义组合式函数（Composables）](./自定义组合式函数composables.md)
- [关键差异](./关键差异.md)
- [其他变化](./其他变化.md)
- [核心作用](./核心作用.md)

### keep-alive

- [Vue2 实现要点（keep-alive.js）](./vue2-实现要点srccorecomponentskeep-alivejs.md)
- [Vue2 方式汇总](./vue2-方式汇总.md)
- [Vue3 方式汇总](./vue3-方式汇总.md)
