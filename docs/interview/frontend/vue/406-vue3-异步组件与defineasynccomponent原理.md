---
title: "Vue3 异步组件与 defineAsyncComponent 原理"
---

# Vue3 异步组件与 defineAsyncComponent 原理

## 为什么需要异步组件

大型应用打包后，单个 JS 文件可能很大，首屏加载慢。异步组件让组件**按需加载**（路由切换到时才加载），减小首屏体积。典型场景：

- 路由懒加载：`const routes = [{ path: '/user', component: () => import('./User.vue') }]`
- 重型组件按需加载：富文本编辑器、图表库、地图组件。
- 权限组件：只有特定权限才加载。

## 用法

### 基础用法

```js
import { defineAsyncComponent } from 'vue';

const AsyncComp = defineAsyncComponent(() => import('./Heavy.vue'));
```

### 完整配置

```js
const AsyncComp = defineAsyncComponent({
  loader: () => import('./Heavy.vue'), // 加载函数
  loadingComponent: Loading,           // 加载中显示
  errorComponent: Error,               // 加载失败显示
  delay: 200,                          // 显示 loading 的延迟（避免闪烁）
  timeout: 3000,                       // 超时时间，超时显示 error
  suspensible: true,                   // 是否参与 Suspense（默认 true）
  onError(err, retry, fail, attempts) {
    // 加载失败的重试逻辑
    if (attempts <= 3) {
      retry();
    } else {
      fail();
    }
  }
});
```

## 原理

### 1. defineAsyncComponent 的实现

```js
// packages/runtime-core/src/apiAsyncComponent.ts
export function defineAsyncComponent(source) {
  if (isFunction(source)) {
    source = { loader: source };
  }

  const { loader, loadingComponent, errorComponent, delay = 200, timeout, suspensible = true, onError } = source;

  return defineComponent({
    name: 'AsyncComponentWrapper',
    __asyncLoader: getAsyncLoader(loader, onError),
    __asyncResolved: {},

    setup() {
      const instance = currentInstance;

      const resolved = ref(null);  // 加载成功的组件
      const error = ref(null);     // 错误
      const loaded = ref(false);   // 是否加载完成
      const loading = ref(false);  // 是否正在加载

      let timeoutTimer;
      let loadingTimer;

      const load = () => {
        let retry = 0;
        const attempt = () => {
          loader()
            .then(comp => {
              // 处理 es module
              if (comp.__esModule || comp[Symbol.toStringTag] === 'Module') {
                comp = comp.default;
              }
              resolved.value = comp;
              loaded.value = true;
            })
            .catch(err => {
              error.value = err;
              if (onError) {
                onError(err, () => {
                  retry++;
                  if (retry <= 3) attempt(); // 重试
                }, () => {}, retry);
              }
            })
            .finally(() => {
              loading.value = false;
              clearTimeout(loadingTimer);
              clearTimeout(timeoutTimer);
            });
        };
        attempt();
      };

      // 如果在 Suspense 内，注册为异步依赖
      if (suspensible && instance && isInSuspense()) {
        instance.asyncDep = load;
        return () => {
          if (resolved.value) {
            return createVNode(resolved.value, attrs);
          }
          return null; // Suspense 会显示 fallback
        };
      }

      // 独立使用：自己管理 loading
      onMounted(() => {
        load();
        if (delay) loadingTimer = setTimeout(() => loading.value = true, delay);
        if (timeout) timeoutTimer = setTimeout(() => {
          error.value = new Error('Async component timed out');
        }, timeout);
      });

      return () => {
        if (loaded.value) {
          return createVNode(resolved.value, attrs);
        } else if (error.value && errorComponent) {
          return createVNode(errorComponent);
        } else if (loading.value && loadingComponent) {
          return createVNode(loadingComponent);
        }
        return null;
      };
    }
  });
}
```

### 2. 加载流程

```
1. 组件首次渲染 → setup 执行
2. 判断是否在 Suspense 内：
   a. 在 Suspense 内：注册 asyncDep，Suspense 显示 fallback，暗中加载
   b. 独立使用：自己管理 loading/error
3. loader() 执行（动态 import）
4. 加载中：delay 后显示 loadingComponent
5. 加载完成：resolved.value = 组件，触发重新渲染
6. 加载失败：error.value = 错误，显示 errorComponent
7. 超时：timeout 后显示 errorComponent
```

### 3. 与 Suspense 的协作

```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
```

**流程：**

1. Suspense 渲染 default 插槽，发现 AsyncComponent 是异步组件。
2. AsyncComponent 的 `setup` 返回前，注册 `instance.asyncDep = load`。
3. Suspense 收集所有 asyncDep，显示 fallback，暗中执行 load。
4. load 完成（`resolved.value = comp`），Suspense 检测到所有 asyncDep 完成。
5. Suspense 切换：显示 default 插槽（此时 AsyncComponent 已 resolved）。

**关键：** 在 Suspense 内，AsyncComponent 不自己管理 loading，而是交给 Suspense 统一管理。

### 4. 错误重试

```js
defineAsyncComponent({
  loader: () => import('./Heavy.vue'),
  onError(err, retry, fail, attempts) {
    if (attempts <= 3) {
      retry(); // 重试
    } else {
      fail(); // 放弃
    }
  }
});
```

**原理：** loader 失败时调用 onError，`retry` 重新调用 loader，`fail` 标记为最终失败。`attempts` 是当前重试次数。

## 与 Vue2 异步组件的对比

### Vue2 的异步组件

```js
// Vue2 简单写法
Vue.component('async-comp', (resolve, reject) => {
  import('./Heavy.vue').then(resolve).catch(reject);
});

// Vue2 高级写法
const AsyncComp = () => ({
  component: () => import('./Heavy.vue'),
  loading: Loading,
  error: Error,
  delay: 200,
  timeout: 3000
});
```

### Vue2 的问题

1. **API 不统一**：函数返回对象 vs 直接函数，写法混乱。
2. **无 Suspense 集成**：loading 状态只能组件内管理，无法统一。
3. **无重试机制**：失败就失败，无法重试。
4. **类型推断差**：函数返回的对象无类型提示。

### Vue3 的改进

1. **统一 API**：`defineAsyncComponent` 一个函数，配置清晰。
2. **Suspense 集成**：可与 Suspense 配合，统一管理 loading。
3. **重试机制**：`onError` 支持自定义重试逻辑。
4. **类型推断**：TS 完整支持。
5. **Composition API**：用 ref 管理状态，逻辑清晰。

## 实战：路由懒加载

```js
// router/index.js
const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/user',
    component: defineAsyncComponent({
      loader: () => import('../views/User.vue'),
      loadingComponent: PageLoading,
      errorComponent: PageError,
      delay: 200,
      timeout: 10000
    })
  }
];
```

**配合 Suspense：**

```vue
<!-- App.vue -->
<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <PageLoading />
    </template>
  </Suspense>
</template>
```

## 注意事项

1. **SSR 兼容**：异步组件在 SSR 下需要特殊处理（服务端不支持动态 import 的按需加载，需用 `require` 或构建时处理）。
2. **循环依赖**：异步组件 A 依赖异步组件 B，B 又依赖 A，会导致死锁。
3. **缓存**：动态 import 的模块会被浏览器缓存（同 URL 只加载一次），所以异步组件加载一次后再次使用是同步的。
4. **Suspense 的实验性**：Suspense 仍是实验性 API，生产慎用。

## 总结

- **defineAsyncComponent**：声明式定义异步组件，支持 loading/error/timeout/retry。
- **原理**：用 ref 管理加载状态，loader 完成后触发重新渲染。
- **Suspense 集成**：在 Suspense 内，异步组件注册为 asyncDep，由 Suspense 统一管理。
- **对比 Vue2**：API 统一、支持重试、类型推断好、Suspense 集成。
- **场景**：路由懒加载、重型组件按需加载、权限组件。

异步组件是前端性能优化（代码分割）的基础设施，Vue3 的实现比 Vue2 更完善、更易用。
