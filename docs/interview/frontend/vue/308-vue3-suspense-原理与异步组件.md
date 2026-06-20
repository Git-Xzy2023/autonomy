---
title: "Vue3 Suspense 原理与异步组件"
---

# Vue3 Suspense 原理与异步组件

## 为什么需要 Suspense

异步组件（路由懒加载、动态 import）在加载完成前会显示空白，用户体验差。传统方案是在组件内部用 `v-if` + loading 状态管理，代码重复且分散。

`Suspense` 是 React 16 引入、Vue3 借鉴的模式：**声明式地处理异步组件的加载状态**，父组件统一管理"加载中"和"加载完成"的展示。

## 用法

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => import('./Heavy.vue'));
</script>
```

## 异步 setup

Suspense 还支持异步 setup（`async setup()`）：

```vue
<!-- 子组件 -->
<script setup>
const data = await fetch('/api/data').then(r => r.json());
// setup 暂停在这里，Suspense 显示 fallback
// fetch 完成后，setup 继续，Suspense 显示子组件
</script>
```

```vue
<!-- 父组件 -->
<Suspense>
  <template #default>
    <Child /> <!-- Child 的 setup 是 async -->
  </template>
  <template #fallback>
    <Spinner />
  </template>
</Suspense>
```

## 原理

### 1. 异步依赖收集

Suspense 内部维护一个 `deps` Set，记录所有未完成的异步依赖。

```js
// packages/runtime-core/src/components/Suspense.ts
export const SuspenseImpl = {
  name: 'Suspense',
  __isSuspense: true,

  setup(__props, { slots }) {
    const instance = getCurrentInstance();
    const { p: patch } = instance;

    // 状态
    const isResolved = ref(false); // 是否已解决
    const pendingBranch = shallowRef(null); // 待处理分支
    const activeBranch = shallowRef(null); // 当前显示分支

    return () => {
      const defaultSlot = slots.default?.();
      const fallbackSlot = slots.fallback?.();

      if (!isResolved.value) {
        // 未解决：渲染 fallback，但暗中 mount default（收集异步依赖）
        return [
          createVNode(Fragment, null, fallbackSlot),
          createVNode(Comment, null, '', 0, null, [/* hidden default */])
        ];
      } else {
        return defaultSlot;
      }
    };
  }
};
```

### 2. 异步组件的处理

```js
// packages/runtime-core/src/apiAsyncComponent.ts
export function defineAsyncComponent(source) {
  const { loader, loadingComponent, errorComponent, delay, timeout } = source;

  return defineComponent({
    setup() {
      const loaded = ref(false);
      const error = ref(null);
      const loading = ref(false);

      let loadingTimer;
      let timeoutTimer;

      const load = () => {
        loading.value = true;
        if (delay) loadingTimer = setTimeout(() => loading.value = true, delay);

        return loader()
          .catch(err => { error.value = err; })
          .finally(() => {
            loading.value = false;
            clearTimeout(loadingTimer);
          });
      };

      // 如果在 Suspense 内，注册为异步依赖
      const instance = getCurrentInstance();
      if (instance && isInSuspense()) {
        instance.asyncDep = load; // 标记为异步依赖
      } else {
        load(); // 独立使用：自己管理 loading
      }

      return () => {
        if (loaded.value) return loadedComp;
        if (error.value && errorComponent) return errorComp;
        if (loading.value && loadingComponent) return loadingComp;
        return null;
      };
    }
  });
}
```

### 3. Suspense 的 resolve 流程

```
1. Suspense 渲染 default 插槽
2. 子组件是异步组件 / async setup → 注册到 Suspense.deps
3. Suspense 显示 fallback，暗中 mount default（隐藏）
4. 所有异步依赖完成 → deps 清空
5. Suspense 切换：隐藏 fallback，显示 default
6. 触发 onResolve / onPending 事件
```

### 4. 错误处理

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncChild />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue';

onErrorCaptured((err) => {
  console.error('异步组件加载失败：', err);
  return false; // 阻止错误继续向上传播
});
</script>
```

异步依赖抛错时，Suspense 触发 `onErrorCaptured`，父组件可以捕获并处理。

## Suspense 的事件

```js
// 内部状态
const onResolve = () => { /* 所有异步依赖完成 */ };
const onPending = () => { /* 新的异步依赖出现 */ };
const onFallback = () => { /* 显示 fallback */ };
```

## 实战：路由 + Suspense

```vue
<template>
  <Suspense>
    <template #default>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </template>
    <template #fallback>
      <PageLoading />
    </template>
  </Suspense>
</template>
```

路由组件用 `async setup` 直接发请求：

```vue
<!-- UserDetail.vue -->
<script setup>
const route = useRoute();
const user = await fetchUser(route.params.id); // 异步 setup
</script>
```

**优势：** 无需在组件内写 `loading` 状态，Suspense 统一管理。

## 局限性

1. **实验性 API**：Vue3 的 Suspense 仍是实验性，API 可能变化。
2. **错误处理复杂**：异步依赖失败需要 `onErrorCaptured` 配合，不如 try/catch 直观。
3. **嵌套 Suspense 行为复杂**：多个 Suspense 嵌套时，resolve 时机需要仔细处理。
4. **SSR 支持**：Suspense 在 SSR 下需要特殊处理（流式渲染）。

## 与 React Suspense 的对比

| 维度     | Vue3 Suspense              | React Suspense             |
| -------- | -------------------------- | -------------------------- |
| 异步来源 | 异步组件 / async setup     | React.lazy / use / fetch   |
| 错误处理 | onErrorCaptured            | Error Boundary             |
| 数据获取 | 不内置（需自己发请求）     | 配合 React Query / SWR     |
| 稳定性   | 实验性                     | 稳定（数据获取仍实验性）   |

## 总结

- **Suspense**：声明式处理异步组件加载状态，父组件统一管理 loading。
- **异步 setup**：`async setup()` 暂停组件初始化，等 await 完成。
- **原理**：收集异步依赖，全部完成后切换显示。
- **适用**：路由懒加载、数据预取、复杂异步流程。
- **注意**：实验性 API，生产慎用，配合 `onErrorCaptured` 处理错误。
