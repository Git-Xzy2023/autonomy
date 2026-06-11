---
title: "Vue2 方式汇总"
---

# Vue2 方式汇总

| 方式                       | 场景                                       | 示例                                     |
| -------------------------- | ------------------------------------------ | ---------------------------------------- |
| props / $emit              | 父子                                       | `:msg="x"` `@click="emit('foo')"`        |
| `$parent / $children`      | 父子                                       | 直接访问实例（不推荐，紧耦合）           |
| `$attrs / $listeners`      | 多层透传                                   | v-bind="$attrs" v-on="$listeners"        |
| ref / $refs                | 父子                                       | 拿到子组件实例调用方法                   |
| provide / inject           | 跨层级祖先 → 后代（Vue2.2+，默认非响应式） |                                          |
| EventBus（$on/$emit/$off） | 任意组件                                   | 全局 `new Vue()` 做事件中心（Vue3 移除） |
| Vuex                       | 全局状态管理                               |                                          |
