---
title: Vue 3 Composition API 进阶
---

# Vue 3 Composition API 进阶

> 本章聚焦 Composition API 的高级用法：组合式函数（Composables）、自定义 ref、effect 作用域、异步操作封装等。

---

## 一、组合式函数（Composables）

### 1.1 为什么需要 Composables

Vue 2 Mixins 的问题：
- 数据来源不清晰
- 命名冲突
- 类型推断差

Composition API 的 Composables 解决了这些问题：

```js
// mixins：不清晰
export default {
  mixins: [counterMixin], // count 从哪来？
};

// composables：清晰
export default {
  setup() {
    const { count, increment } = useCounter(); // ✅ 来源明确
    return { count, increment };
  },
};
```

### 1.2 命名规范

- 文件名：`useXxx.ts`
- 函数名：`useXxx`
- 返回值：包含响应式数据和方法的对象

### 1.3 实现 useCounter

```ts
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initial = 0, step = 1) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);

  function increment() {
    count.value += step;
  }
  function decrement() {
    count.value -= step;
  }
  function reset() {
    count.value = initial;
  }

  return { count, double, increment, decrement, reset };
}
```

```vue
<script setup>
import { useCounter } from '@/composables/useCounter';
const { count, double, increment } = useCounter(10, 2);
</script>
```

---

## 二、常用 Composables 实战

### 2.1 useMouse

```ts
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```

### 2.2 useFetch

```ts
// composables/useFetch.ts
import { ref, watchEffect, isShallow } from 'vue';

export function useFetch<T>(url: string | (() => string)) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function doFetch() {
    data.value = null;
    error.value = null;
    loading.value = true;

    try {
      const realUrl = typeof url === 'function' ? url() : url;
      const res = await fetch(realUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data.value = (await res.json()) as T;
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  watchEffect(doFetch); // url 变化时重新请求
  return { data, error, loading, refresh: doFetch };
}
```

### 2.3 useEventListener

```ts
// composables/useEventListener.ts
import { onUnmounted, type Ref } from 'vue';

export function useEventListener(
  target: HTMLElement | Window,
  event: string,
  callback: (e: any) => void
) {
  target.addEventListener(event, callback);

  onUnmounted(() => {
    target.removeEventListener(event, callback);
  });
}
```

### 2.4 useLocalStorage

```ts
// composables/useLocalStorage.ts
import { ref, watch, customRef } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(load()) as Ref<T>;

  function load(): T {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  }

  watch(value, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal));
  }, { deep: true });

  return value;
}
```

### 2.5 useDebounce

```ts
import { ref, watch, type Ref } from 'vue';

export function useDebounce<T>(source: Ref<T>, delay = 300) {
  const debounced = ref(source.value) as Ref<T>;
  let timer: number;

  watch(source, (newVal) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = newVal;
    }, delay);
  });

  return debounced;
}
```

### 2.6 useInterval

```ts
import { ref, onUnmounted } from 'vue';

export function useInterval(callback: () => void, delay = 1000) {
  const timer = setInterval(callback, delay);
  onUnmounted(() => clearInterval(timer));
}
```

---

## 三、自定义 ref

### 3.1 customRef

```ts
import { customRef } from 'vue';

// 防抖 ref
export function useDebouncedRef<T>(value: T, delay = 300) {
  let timer: number;
  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newVal: T) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        value = newVal;
        trigger();
      }, delay) as unknown as number;
    },
  }));
}
```

### 3.2 shallowRef

```ts
import { shallowRef, watchEffect } from 'vue';

// 浅响应，只对 .value 整体替换响应
const state = shallowRef({ count: 0 });

state.value.count = 1; // ❌ 不触发更新
state.value = { count: 1 }; // ✅ 触发更新

// 配合 triggerRef 手动触发
import { triggerRef } from 'vue';
state.value.count = 1;
triggerRef(state); // 手动触发
```

---

## 四、effect 作用域

### 4.1 effectScope

```ts
import { effectScope, ref, watchEffect } from 'vue';

const scope = effectScope();

scope.run(() => {
  const count = ref(0);
  watchEffect(() => console.log(count.value)); // 立即执行

  const doubled = computed(() => count.value * 2);
  watchEffect(() => console.log(doubled.value));
});

// 一次性停止所有副作用
scope.stop();
```

### 4.2 应用场景

- 封装复杂 composable，需要统一清理
- 在非组件环境使用响应式（如 Vuex/Pinia 内部）
- 单元测试中隔离作用域

---

## 五、异步与 Suspense

### 5.1 异步 setup

```vue
<!-- AsyncUser.vue -->
<script>
import { ref } from 'vue';

export default {
  async setup() {
    const res = await fetch('/api/user/1');
    const user = await res.json();
    return { user };
  },
};
</script>
```

### 5.2 父组件用 Suspense 处理

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUser />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### 5.3 错误处理

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUser />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>

<script>
import { onErrorCaptured } from 'vue';
export default {
  setup() {
    onErrorCaptured((err) => {
      console.error('捕获异步错误:', err);
      return false; // 阻止向上传播
    });
  },
};
</script>
```

---

## 六、渲染函数与 JSX

### 6.1 h 函数

```js
import { h } from 'vue';

export default {
  render() {
    return h('div', { class: 'card' }, [
      h('h1', this.title),
      h('p', this.content),
    ]);
  },
};
```

### 6.2 h 函数签名

```ts
function h(
  type: string | Component,
  props?: object | null,
  children?: string | number | VNode | Array<string|number|VNode>
): VNode;
```

### 6.3 JSX 写法

```jsx
// 需 @vitejs/plugin-vue-jsx
export default {
  data() {
    return { count: 0 };
  },
  render() {
    return (
      <div class="counter">
        <h1>{this.count}</h1>
        <button onClick={() => this.count++}>+</button>
      </div>
    );
  },
};
```

---

## 七、插件开发

### 7.1 Vue 3 插件结构

```ts
import type { App } from 'vue';

const MyPlugin = {
  install(app: App, options: { apiKey: string }) {
    // 1. 注册全局组件
    app.component('MyButton', { /* ... */ });

    // 2. 注册指令
    app.directive('focus', { /* ... */ });

    // 3. 全局属性（替代 Vue 2 的 Vue.prototype）
    app.config.globalProperties.$myApi = (url) => fetch(url);

    // 4. Provide
    app.provide('my-plugin-key', options.apiKey);

    // 5. 注入
    app.mixin({ /* 尽量避免 */ });
  },
};

export default MyPlugin;
```

### 7.2 使用

```ts
import { createApp } from 'vue';
import App from './App.vue';
import MyPlugin from './my-plugin';

const app = createApp(App);
app.use(MyPlugin, { apiKey: 'xxx' });
app.mount('#app');
```

---

## 八、TypeScript 深度集成

### 8.1 defineProps 类型

```vue
<script setup lang="ts">
// 运行时声明
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 },
});

// 类型声明（更强大）
interface Props {
  title: string;
  count?: number;
  list?: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update', value: number): void;
  (e: 'delete', id: string): void;
}>();
</script>
```

### 8.2 withDefaults

```vue
<script setup lang="ts">
interface Props {
  title: string;
  items?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>
```

### 8.3 defineModel（3.4+）

```vue
<!-- 子组件 -->
<script setup lang="ts">
const model = defineModel<string>({ default: '' });
</script>

<!-- 父组件 -->
<MyInput v-model="text" />
```

---

## 九、学习建议

1. **Composables**：是逻辑复用的核心，多写多积累常用 hook
2. **自定义 ref**：理解 customRef 才能实现防抖等高级功能
3. **effectScope**：复杂场景的副作用管理
4. **TS 集成**：用类型声明替代运行时声明，类型更完善

---

## 参考

- [Vue 3 组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)
- [VueUse](https://vueuse.org/)
