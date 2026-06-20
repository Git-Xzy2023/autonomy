---
title: "Vue3 defineProps / defineEmits / defineExpose 原理"
---

# Vue3 defineProps / defineEmits / defineExpose 原理

## 为什么需要这些宏

`<script setup>` 是编译时语法糖，组件的 props/emits 无法用 `export default { props: [...] }` 声明。Vue3 提供**编译时宏**（compile-time macros）让 `<script setup>` 里也能声明 props/emits，且类型推断更好。

**宏的特点：** 不需要 import，编译时被替换，运行时不存在。

## defineProps

### 基本用法

```vue
<script setup>
// 运行时声明
const props = defineProps({
  msg: String,
  count: { type: Number, default: 0 }
});
</script>
```

### 类型声明（TS）

```vue
<script setup lang="ts">
// 类型声明：编译时生成运行时 props 声明
const props = defineProps<{
  msg: string;
  count?: number; // 可选
  list: string[];
}>();

// 带默认值（需要 withDefaults）
const props = withDefaults(defineProps<{
  msg: string;
  count?: number;
}>(), {
  msg: 'hello',
  count: 0
});
</script>
```

**编译后：**

```js
export default {
  props: {
    msg: { type: String, default: 'hello' },
    count: { type: Number, default: 0 }
  },
  setup(__props) {
    const props = __props;
    return { props };
  }
}
```

**原理：** 编译器解析 `<script setup>` 里的 `defineProps<T>()`，把类型 T 转成运行时 props 声明（`{ type: String, ... }`），生成到组件 options 里。

## defineEmits

```vue
<script setup>
const emit = defineEmits(['update', 'delete']);

function handleClick() {
  emit('update', { id: 1 });
}
</script>
```

**TS 版本：**

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', payload: { id: number }): void;
  (e: 'delete', id: number): void;
}>();
</script>
```

**编译后：**

```js
export default {
  emits: ['update', 'delete'],
  setup(__props, { emit }) {
    function handleClick() {
      emit('update', { id: 1 });
    }
    return { handleClick };
  }
}
```

## defineExpose

`<script setup>` 默认**不暴露**任何变量给父组件（`ref.value` 拿到的是空对象）。`defineExpose` 显式暴露：

```vue
<!-- 子组件 -->
<script setup>
import { ref } from 'vue';

const count = ref(0);
const increment = () => count.value++;

defineExpose({ count, increment });
</script>

<!-- 父组件 -->
<script setup>
import { ref, onMounted } from 'vue';
const childRef = ref();

onMounted(() => {
  console.log(childRef.value.count); // 0
  childRef.value.increment();
});
</script>

<template>
  <Child ref="childRef" />
</template>
```

**原理：** 编译后把暴露的对象挂到组件实例的 `exposed` 属性上，父组件通过 `ref` 拿到的就是 `exposed`。

```js
setup(__props, { expose }) {
  const count = ref(0);
  const increment = () => count.value++;
  expose({ count, increment });
  return { /* ... */ };
}
```

## 为什么 `<script setup>` 默认不暴露

Vue2 和 Vue3 非 `<script setup>` 写法里，`ref.value` 拿到的是整个组件实例（所有 data/methods 都能访问）。这破坏了封装性：父组件能随意修改子组件内部状态。

`<script setup>` 改为**默认封闭**，必须用 `defineExpose` 显式暴露，强制开发者思考"哪些是公共 API"。这是更好的封装实践。

## 其他宏

### defineModel（Vue3.4+）

简化 `v-model` 在 `<script setup>` 里的写法：

```vue
<script setup>
// 旧写法
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// 新写法（Vue3.4+）
const model = defineModel();
model.value = 'new'; // 自动触发 update:modelValue
</script>
```

### defineOptions

声明无法在 `<script setup>` 里直接写的 options（如 name、inheritAttrs）：

```vue
<script setup>
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false
});
</script>
```

### defineSlots（TS）

声明插槽类型：

```vue
<script setup lang="ts">
defineSlots<{
  default(props: { item: any }): any;
  header?(): any;
}>();
</script>
```

### useSlots / useAttrs

在 `<script setup>` 里访问插槽和 attrs：

```vue
<script setup>
import { useSlots, useAttrs } from 'vue';
const slots = useSlots();
const attrs = useAttrs();
</script>
```

## 编译时宏的限制

1. **必须在 `<script setup>` 顶层**：不能在函数、条件、循环里调用。
2. **不能 import**：宏是编译器内置的，import 会报错。
3. **不能动态调用**：`defineProps` 的参数必须是字面量对象或类型。
4. **类型声明的限制**：复杂类型（联合类型、条件类型）无法转成运行时 props 声明，需要 `withDefaults` 或运行时声明补充。

## 与 Vue2 的对比

| 维度       | Vue2                          | Vue3 `<script setup>`           |
| ---------- | ----------------------------- | ------------------------------- |
| props 声明 | `props: { ... }`              | `defineProps<T>()`              |
| emits 声明 | `emits: [...]`（Vue2.4+）     | `defineEmits<T>()`              |
| 父访问子   | `this.$refs.child.xxx`（全暴露）| `childRef.value.xxx`（需 expose）|
| 类型推断   | 差（this 类型复杂）            | 好（TS 原生支持）               |
| 封装性     | 差（全暴露）                   | 好（默认封闭）                  |

## 总结

- **defineProps**：声明 props，支持运行时声明和 TS 类型声明。
- **defineEmits**：声明 emits，类型安全。
- **defineExpose**：显式暴露，强制封装。
- **defineModel**：简化 v-model（Vue3.4+）。
- **defineOptions**：补充 name/inheritAttrs 等。

这些宏是 `<script setup>` 的配套，让 Composition API 的写法更简洁、类型更安全、封装更好。
