---
title: "setup 函数"
---

# setup 函数

Vue3 的核心入口，在 `beforeCreate` 之前执行，此时组件实例尚未创建，**不能访问 this**。

```js
// 基本用法
export default {
  props: { id: String },
  setup(props, { slots, attrs, emit, expose }) {
    // props 是响应式对象，但不能解构（会丢失响应式）
    // slots = 插槽函数集合
    // attrs = 透传的非响应式属性（类似 $attrs）
    // emit = 触发事件（类似 $emit）
    // expose = 暴露给父组件通过 ref 访问的内容

    const count = ref(0)
    const inc = () => count.value++

    // return 的对象在模板中可直接使用
    return { count, inc }
  }
}

// 推荐：<script setup> 语法糖，自动 return 顶层声明的变量/函数
<script setup>
const props = defineProps({ id: String })
const emit = defineEmits(['change'])
const count = ref(0)
const inc = () => count.value++
</script>
```
