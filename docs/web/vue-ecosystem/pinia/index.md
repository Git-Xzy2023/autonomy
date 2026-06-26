---
title: Pinia 状态管理
---

# Pinia 状态管理

> Pinia 是 Vue 3 官方推荐的状态管理库，替代 Vuex。更轻量、TypeScript 友好、API 更直观、Tree Shaking 友好。

---

## 一、为什么用 Pinia

### 1.1 Pinia vs Vuex

| 对比项         | Vuex 4                    | Pinia                       |
| -------------- | -------------------------- | --------------------------- |
| **模块化**     | modules + namespaced       | 独立 store                  |
| **mutations**  | 必需                       | 不需要（直接改 state）      |
| **TypeScript** | 类型推断弱                 | 一等公民                    |
| **体积**       | 较大                       | 约 1KB                      |
| **Composition**| 有限                       | 完全 Composition API        |
| **DevTools**   | 支持                       | 支持（时间旅行）            |
| **SSR**        | 复杂                       | 友好                        |

### 1.2 Pinia 的优势

- ✅ **去掉 mutations**：直接修改 state
- ✅ **TS 友好**：类型自动推断
- ✅ **Tree Shaking**：按需引入 store
- ✅ **多 store**：天然模块化，无需 namespaced
- ✅ **插件系统**：扩展性强

---

## 二、安装与初始化

```bash
npm install pinia
```

```ts
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
```

---

## 三、定义 Store

### 3.1 Option Store（类似 Vuex）

```ts
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo',
  }),
  getters: {
    double: (state) => state.count * 2,
    doublePlusOne() {
      return this.double + 1; // 用 this 访问其他 getter
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    async fetchCount() {
      const res = await fetch('/api/count');
      this.count = await res.json();
    },
  },
});
```

### 3.2 Setup Store（Composition API 风格）

```ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0);
  const name = ref('Eduardo');

  // getter
  const double = computed(() => count.value * 2);
  const doublePlusOne = computed(() => double.value + 1);

  // action
  function increment() {
    count.value++;
  }
  async function fetchCount() {
    const res = await fetch('/api/count');
    count.value = await res.json();
  }

  return { count, name, double, doublePlusOne, increment, fetchCount };
});
```

两种风格功能等价，Setup Store 更灵活。

---

## 四、使用 Store

### 4.1 组件中使用

```vue
<script setup>
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();

// 读 state
console.log(counter.count);

// 调用 action
counter.increment();

// 读 getter
console.log(counter.double);

// 解构（需 storeToRefs 保持响应式）
import { storeToRefs } from 'pinia';
const { count, name } = storeToRefs(counter);
const { increment } = counter; // action 可直接解构
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### 4.2 修改 state

```ts
// 1. 直接改
counter.count = 10;

// 2. $patch（批量）
counter.$patch({
  count: 10,
  name: 'Tom',
});

// 3. $patch 函数
counter.$patch((state) => {
  state.count = 10;
  state.items.push({ id: 1 });
});

// 4. 调用 action
counter.increment();
```

### 4.3 订阅 state

```ts
// 订阅变化
counter.$subscribe((mutation, state) => {
  console.log(mutation.type); // 'direct' | 'patch object' | 'patch function'
  console.log(state.count);
});

// 订阅 getter
counter.$onAction({
  after: (result) => console.log('action 完成', result),
  onError: (err) => console.error('action 失败', err),
});
```

---

## 五、Store 间相互调用

```ts
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ name: 'Tom' }),
});

// stores/cart.ts
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  getters: {
    summary() {
      const user = useUserStore();
      return `${user.name} 的购物车 (${this.items.length})`;
    },
  },
  actions: {
    checkout() {
      const user = useUserStore();
      return fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ user: user.name, items: this.items }),
      });
    },
  },
});
```

---

##六、插件

### 6.1 持久化插件

```bash
npm install pinia-plugin-persistedstate
```

```ts
// main.ts
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
```

```ts
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({ token: '', user: null }),
  persist: true, // 开启持久化
  // 或自定义 key
  persist: {
    key: 'my-user',
    storage: localStorage,
    paths: ['token'],
  },
});
```

### 6.2 自定义插件

```ts
const myPlugin = ({ store }) => {
  store.myMethod = () => console.log('插件方法');
};

pinia.use(myPlugin);

// 订阅所有 store 变化
pinia.use(({ store }) => {
  store.$subscribe((mutation, state) => {
    console.log(`${store.$id} changed`);
  });
});
```

---

## 七、SSR 与 Pinia

```ts
// entry-server.ts
import { createPinia } from 'pinia';

export async function createApp() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  // 服务端设置状态
  const userStore = useUserStore(pinia);
  await userStore.fetchUser();

  return { app, pinia };
}

// 处理完路由后
const { app, pinia } = createApp();
const html = await renderToString(app);
const state = JSON.stringify(pinia.state.value); // 序列化

// 客户端水合
if (window.__PINIA_STATE__) {
  pinia.state.value = JSON.parse(window.__PINIA_STATE__);
}
```

---

## 八、测试

```ts
import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from './counter';

beforeEach(() => {
  setActivePinia(createPinia());
});

test('increment', () => {
  const counter = useCounterStore();
  expect(counter.count).toBe(0);
  counter.increment();
  expect(counter.count).toBe(1);
});
```

---

## 九、最佳实践

### 9.1 Store 划分

```
stores/
├── user.ts          # 用户信息
├── cart.ts          # 购物车
├── products.ts      # 商品
├── settings.ts      # 全局设置
└── index.ts         # 统一导出
```

### 9.2 命名规范

- 文件名：`useXxxStore`
- store id：`xxx`（小写）
- state 用名词，action 用动词

### 9.3 不要做的事

```ts
// ❌ 不要在 store 外解构（会失去响应式）
const { count } = useCounterStore();

// ✅ 用 storeToRefs
const { count } = storeToRefs(useCounterStore());

// ❌ 不要在多个组件 new store
const store = useCounterStore(); // ❌ 多次调用返回同一实例，但应每次调用 useStore
```

---

## 十、学习建议

1. **两种风格**：Option 与 Setup 都要会用
2. **storeToRefs**：解构响应式的关键 API
3. **插件系统**：持久化是常见需求
4. **从 Vuex 迁移**：移除 mutations，state 改为函数返回

---

## 参考

- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [从 Vuex 迁移到 Pinia](https://pinia.vuejs.org/zh/cookbook/migration.html)
