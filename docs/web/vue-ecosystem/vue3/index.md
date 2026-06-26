---
title: Vue 3 学习指南
---

# Vue 3 学习指南

> Vue 3 是 Vue.js 的第三代主版本，引入 Composition API、基于 Proxy 的响应式系统、编译期优化等重大改进，性能更好、TypeScript 支持更完善、Tree Shaking 友好。

---

## 一、Vue 3 新特性

### 1.1 主要变化

| 类别        | 变化                                   |
| ----------- | -------------------------------------- |
| **API**     | 新增 Composition API（Options 仍兼容） |
| **响应式**  | Object.defineProperty → Proxy          |
| **模板**    | 支持多根节点（Fragment）               |
| **TS**      | 一等公民，类型推断更好                  |
| **体积**    | 更小，按需引入                          |
| **编译**    | 静态提升、PatchFlag、Block Tree        |
| **生命周期**| 新增 onRenderTracked/onTriggered        |
| **状态**    | 推荐 Pinia 替代 Vuex                   |
| **Teleport**| 传送门组件                             |
| **Suspense**| 异步组件加载                           |

### 1.2 为什么升级 Vue 3

- 🚀 **性能**：编译期优化，bundle 更小，运行更快
- 🧩 **逻辑复用**：Composition API 比 Mixins 更优雅
- 📦 **Tree Shaking**：未使用的 API 不会打包
- 📘 **TypeScript**：原生支持，无需 vue-class-component
- 🌐 **新能力**：Teleport、Suspense、Fragment

---

## 二、Composition API

### 2.1 setup 函数

```vue
<script>
import { ref, computed, watch, onMounted } from 'vue';

export default {
  props: { title: String },
  setup(props, ctx) {
    const count = ref(0);
    const double = computed(() => count.value * 2);

    function increment() {
      count.value++;
    }

    watch(count, (newVal, oldVal) => {
      console.log(`${oldVal} → ${newVal}`);
    });

    onMounted(() => {
      console.log('mounted');
    });

    return { count, double, increment };
  },
};
</script>
```

### 2.2 setup 的参数

```js
setup(props, context) {
  // props：响应式，不可解构
  console.log(props.title);

  // context：{ attrs, slots, emit, expose }
  context.emit('update', 1);
  context.attrs.id;
}
```

### 2.3 `<script setup>` 语法糖

```vue
<script setup>
import { ref } from 'vue';
import Child from './Child.vue';

// 自动暴露给模板
const count = ref(0);
const increment = () => count.value++;

// 组件直接用，无需注册
// props/emit 用 defineProps/defineEmits
const props = defineProps(['title']);
const emit = defineEmits(['update']);

// 暴露给父组件 ref
defineExpose({ count, increment });
</script>

<template>
  <button @click="increment">{{ count }}</button>
  <Child :title="title" @update="emit('update', $event)" />
</template>
```

| 编译宏            | 说明                              |
| ----------------- | --------------------------------- |
| `defineProps`     | 声明 props                         |
| `defineEmits`     | 声明 emits                         |
| `defineExpose`    | 暴露给父组件 ref                  |
| `defineSlots`     | 声明 slots 类型（TS）             |
| `withDefaults`    | 给 props 设默认值                 |

---

## 三、响应式：ref vs reactive

### 3.1 ref

```js
import { ref } from 'vue';

const count = ref(0); // 任意类型
const user = ref({ name: 'Tom' }); // 对象也可

console.log(count.value); // 取值要 .value
count.value++; // 赋值要 .value

// 模板中自动解包，不需要 .value
// <div>{{ count }}</div>
```

### 3.2 reactive

```js
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  user: { name: 'Tom' },
});

state.count++; // 直接访问，无需 .value
state.user.name = 'Jerry'; // 嵌套也响应式
```

### 3.3 对比

| 对比项      | ref                | reactive             |
| ----------- | ------------------ | -------------------- |
| **类型**    | 任意               | 对象/数组            |
| **访问**    | 需要 `.value`       | 直接                 |
| **解构**    | 不会失去响应式     | 解构失去响应式        |
| **替换**    | 直接赋值           | 不能整体替换          |
| **模板**    | 自动解包           | 自动解包              |

### 3.4 解构响应式丢失

```js
import { reactive, toRefs, toRef } from 'vue';

const state = reactive({ name: 'Tom', age: 18 });

// ❌ 解构后失去响应式
const { name, age } = state;

// ✅ 用 toRefs 转为 ref
const { name, age } = toRefs(state);

// ✅ 单个属性用 toRef
const name = toRef(state, 'name');
```

### 3.5 常用 API

| API            | 说明                            |
| -------------- | ------------------------------- |
| `ref`          | 创建引用                         |
| `reactive`     | 创建响应式对象                   |
| `computed`     | 计算属性                         |
| `watch`        | 侦听特定源                        |
| `watchEffect`  | 自动追踪依赖                      |
| `toRef`         | 单属性 → ref                    |
| `toRefs`        | 所有属性 → ref                  |
| `unref`         | 解 ref                          |
| `isRef`         | 判断 ref                        |
| `isReactive`    | 判断 reactive                   |
| `shallowRef`    | 浅响应 ref                       |
| `shallowReactive` | 浅响应 reactive                |
| `readonly`      | 只读                            |
| `markRaw`       | 标记永不响应式                   |

---

## 四、生命周期

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered,
} from 'vue';

export default {
  setup() {
    onBeforeMount(() => console.log('挂载前'));
    onMounted(() => console.log('已挂载'));
    onBeforeUpdate(() => console.log('更新前'));
    onUpdated(() => console.log('已更新'));
    onBeforeUnmount(() => console.log('卸载前'));
    onUnmounted(() => console.log('已卸载'));
    onErrorCaptured((err) => console.error(err));
  },
};
```

| Options API        | Composition API        |
| ------------------ | ---------------------- |
| beforeCreate       | setup()                |
| created            | setup()                |
| beforeMount        | onBeforeMount          |
| mounted            | onMounted              |
| beforeUpdate       | onBeforeUpdate         |
| updated            | onUpdated              |
| beforeDestroy      | onBeforeUnmount        |
| destroyed         | onUnmounted            |
| activated          | onActivated            |
| deactivated        | onDeactivated          |
| errorCaptured      | onErrorCaptured        |

---

## 五、computed 与 watch

### 5.1 computed

```js
import { ref, computed } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);

// 可写计算属性
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val) => {
    [firstName.value, lastName.value] = val.split(' ');
  },
});
```

### 5.2 watch

```js
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);
const user = ref({ name: 'Tom' });

// 监听 ref
watch(count, (newVal, oldVal) => {});

// 监听对象属性（用 getter）
watch(
  () => user.value.name,
  (newVal, oldVal) => {}
);

// 深度监听
watch(
  user,
  (newVal, oldVal) => {},
  { deep: true, immediate: true, flush: 'post' }
);

// 监听多个源
watch([count, () => user.value.name], ([newCount, newName]) => {});
```

### 5.3 watchEffect

```js
import { watchEffect } from 'vue';

// 自动追踪依赖
watchEffect(() => {
  console.log(count.value, user.value.name);
});

// 副作用清理
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log(count.value);
  }, 1000);
  onCleanup(() => clearTimeout(timer));
});
```

### 5.4 watch vs watchEffect

| 对比项     | watch              | watchEffect        |
| ---------- | ------------------ | ------------------ |
| **依赖**   | 显式指定           | 自动追踪           |
| **旧值**   | 能拿到             | 拿不到             |
| **立即执行** | 默认不立即         | 默认立即           |
| **场景**   | 需要新旧值比较     | 只关心新值         |

---

## 六、依赖注入 provide/inject

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue';
const theme = ref('dark');
provide('theme', theme); // 提供响应式
provide('config', { readonly: true }); // 提供常量
</script>

<!-- 后代组件（任意层级） -->
<script setup>
import { inject } from 'vue';
const theme = inject('theme', 'light'); // 第二个参数为默认值
</script>
```

类型安全的注入（TypeScript）：

```ts
import { inject, InjectionKey } from 'vue';

interface Config {
  apiBaseUrl: string;
  timeout: number;
}

export const ConfigKey: InjectionKey<Config> = Symbol('config');

// 提供方
provide(ConfigKey, { apiBaseUrl: '/api', timeout: 5000 });

// 注入方
const config = inject(ConfigKey); // 类型为 Config | undefined
```

---

## 七、模板引用

### 7.1 基础用法

```vue
<script setup>
import { ref, onMounted } from 'vue';
const inputRef = ref(null);

onMounted(() => {
  inputRef.value.focus();
});
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 7.2 子组件暴露

```vue
<!-- 子组件 -->
<script setup>
import { ref, defineExpose } from 'vue';
const count = ref(0);
const reset = () => (count.value = 0);

defineExpose({ count, reset });
</script>

<!-- 父组件 -->
<script setup>
import { ref, onMounted } from 'vue';
import Child from './Child.vue';
const childRef = ref(null);

onMounted(() => {
  console.log(childRef.value.count);
  childRef.value.reset();
});
</script>
```

---

## 八、新内置组件

### 8.1 Teleport 传送门

```vue
<template>
  <button @click="show = true">打开弹窗</button>

  <teleport to="body">
    <div v-if="show" class="modal">弹窗内容</div>
  </teleport>
</template>
```

将组件渲染到 body 或其他容器，避免父级样式干扰。

### 8.2 Suspense 异步组件

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### 8.3 Fragment 多根节点

```vue
<!-- Vue 3 支持多根节点 -->
<template>
  <header>头部</header>
  <main>内容</main>
  <footer>底部</footer>
</template>
```

---

## 九、学习建议

1. **Composition API**：是 Vue 3 的核心，多写 setup 函数建立习惯
2. **响应式 API**：区分 ref/reactive，知道何时用 toRefs
3. **`<script setup>`**：是日常开发的标准写法
4. **对比记忆**：与 Vue 2 对比，理解为什么改进

---

## 参考

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
- [Vue 3 RFCs](https://github.com/vuejs/rfcs)
