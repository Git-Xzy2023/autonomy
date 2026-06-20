---
title: "Vue2 v-model 原理与双向绑定"
---

# Vue2 v-model 原理与双向绑定

## 为什么会有这个功能

表单是前端最常见的交互场景。原生 HTML 表单元素需要手动监听 `input` 事件、读取 `event.target.value`、再赋值给 data，代码重复且繁琐。`v-model` 是 Vue 对"表单双向绑定"的语法糖，让开发者用一行声明式代码完成"数据 → 视图"和"视图 → 数据"的同步。

## 用法

```html
<!-- 基础用法 -->
<input v-model="msg" />

<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value" />

<!-- 组件上的 v-model -->
<Child v-model="msg" />
<!-- 等价于 -->
<Child :value="msg" @input="val => msg = val" />
```

## 原理

**1. 表单元素上的 v-model**

编译器把 `v-model` 拆成 `:value` 绑定 + `@input` 事件，根据表单类型选择不同事件：

| 表单类型       | 绑定属性 | 监听事件         |
| -------------- | -------- | ---------------- |
| text/textarea  | value    | input            |
| checkbox       | checked  | change           |
| radio          | checked  | change           |
| select         | value    | change           |

**2. 组件上的 v-model**

Vue2 中组件的 `v-model` 默认绑定 `value` prop + 监听 `input` 事件：

```js
// 子组件
export default {
  props: ['value'],
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    }
  }
}

// 自定义 model 选项（改变默认的 prop 和 event）
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: ['checked']
}
```

**3. 修饰符原理**

- `.lazy`：把监听的事件从 `input` 换成 `change`（失焦才触发）
- `.number`：在赋值前做 `parseFloat`，转换失败返回原值
- `.trim`：在赋值前做 `String.prototype.trim`

## 弊端与 Vue3 的改进

**Vue2 的痛点：**

1. 组件 `v-model` 只能绑定一个 prop，复杂表单组件需要 `value` + 多个事件，无法支持多个 `v-model`。
2. 默认 `value` + `input` 的约定与 HTML 表单语义冲突（比如自定义组件也想用 `value` 做别的含义）。
3. 修饰符只能用于表单元素，组件上的 `v-model` 无法使用自定义修饰符。

**Vue3 的解决方案：**

- `v-model` 在组件上变成 `modelValue` prop + `update:modelValue` 事件
- 支持多个 `v-model`：`v-model:firstName` + `v-model:lastName`
- 支持自定义修饰符：`v-model.trim="msg"` 可在子组件通过 `modelModifiers` prop 接收
