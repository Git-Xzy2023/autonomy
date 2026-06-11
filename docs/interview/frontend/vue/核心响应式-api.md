---
title: "核心响应式 API"
---

# 核心响应式 API

| API                                         | 说明                                           |
| ------------------------------------------- | ---------------------------------------------- |
| `ref(value)`                                | 原始值/对象都可用，访问需 `.value`             |
| `reactive(obj)`                             | 只接受对象，深层响应式，直接访问属性           |
| `readonly(obj)`                             | 返回只读代理                                   |
| `shallowRef / shallowReactive`              | 浅层响应式（只有第一层变了才触发更新）         |
| `toRef(obj, key)`                           | 从对象属性创建 ref，保持与原对象的响应式连接   |
| `toRefs(obj)`                               | 将 reactive 对象的所有属性都转成 ref，用于解构 |
| `isRef / isReactive / isReadonly / isProxy` | 类型判断                                       |
| `unref(x)`                                  | 等同于 `isRef(x) ? x.value : x`                |
