---
title: Vuex 状态管理
---

# Vuex 状态管理

> Vuex 是 Vue 2 时代官方的状态管理库。虽然 Vue 3 推荐 Pinia，但大量存量项目仍在使用 Vuex。本章介绍 Vuex 核心概念、模块化、异步操作与最佳实践。

---

## 一、Vuex 是什么

### 1.1 核心概念

```
┌─────────────────────────────────────┐
│               Vuex                  │
├─────────────────────────────────────┤
│                                     │
│   State        ──── 全局状态         │
│   Getters      ──── 计算属性         │
│   Mutations    ──── 同步修改         │
│   Actions      ──── 异步操作         │
│   Modules      ──── 模块化           │
│                                     │
└─────────────────────────────────────┘

       ↓ 单向数据流 ↓

  Component ──dispatch──► Actions
     ▲                       │
     │                       ▼ commit
  State ◄──────────────── Mutations
```

### 1.2 为什么需要 Vuex

- 🎯 **集中管理**：跨组件共享状态
- 🔄 **单向数据流**：状态变化可追踪
- 🛠️ **调试能力**：DevTools 时间旅行
- 🧩 **插件生态**：持久化、日志等

---

## 二、基础使用

### 2.1 安装与初始化

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    async increment({ commit }) {
      await fetch('/api/count');
      commit('INCREMENT');
    },
  },
  getters: {
    double: (state) => state.count * 2,
  },
});

new Vue({ store, render: h => h(App) }).$mount('#app');
```

### 2.2 组件中使用

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ double }}</p>
    <button @click="increment">+</button>
    <button @click="asyncIncrement">异步+</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['double']),
  },
  methods: {
    ...mapMutations(['increment']),
    ...mapActions({ asyncIncrement: 'increment' }),
  },
};
</script>
```

### 2.3 直接使用 $store

```vue
<template>
  <p>{{ $store.state.count }}</p>
  <p>{{ $store.getters.double }}</p>
  <button @click="$store.commit('INCREMENT')">+</button>
  <button @click="$store.dispatch('increment')">异步</button>
</template>
```

---

## 三、State 与 Getters

### 3.1 State

```js
const store = new Vuex.Store({
  state: {
    count: 0,
    user: { name: 'Tom', age: 18 },
    list: [],
  },
});
```

### 3.2 Getters

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: 'foo', done: true },
      { id: 2, text: 'bar', done: false },
    ],
  },
  getters: {
    doneTodos: (state) => state.todos.filter(t => t.done),
    doneCount: (state, getters) => getters.doneTodos.length,
    // 返回函数（传参）
    getTodoById: (state) => (id) => state.todos.find(t => t.id === id),
  },
});

// 使用
store.getters.getTodoById(2); // { id: 2, text: 'bar', done: false }
```

### 3.3 mapGetters

```js
computed: {
  ...mapGetters(['doneTodos', 'doneCount']),
  ...mapGetters({ done: 'doneTodos' }), // 重命名
}
```

---

## 四、Mutations

### 4.1 必须是同步

```js
mutations: {
  INCREMENT(state) {
    state.count++;
  },
  SET_USER(state, payload) {
    state.user = payload;
  },
  // 修改对象
  UPDATE_NAME(state, name) {
    // ❌ Vue 2 中新增属性不响应
    // state.user.age = 18;

    // ✅ 用 Vue.set
    Vue.set(state.user, 'age', 18);

    // ✅ 或替换整个对象
    state.user = { ...state.user, age: 18 };
  },
}
```

### 4.2 Mutation Types 常量

```js
// mutation-types.js
export const INCREMENT = 'INCREMENT';
export const SET_USER = 'SET_USER';

// store.js
import { INCREMENT, SET_USER } from './mutation-types';

const store = new Vuex.Store({
  mutations: {
    [INCREMENT](state) { state.count++; },
    [SET_USER](state, user) { state.user = user; },
  },
});

// 组件
this.$store.commit(INCREMENT, 1);
```

### 4.3 为什么必须同步

Vuex 通过 mutation 来记录状态变化用于 DevTools 时间旅行。异步会让记录失序，无法回放。

---

## 五、Actions

### 5.1 异步操作

```js
actions: {
  async fetchUser({ commit }, id) {
    commit('SET_LOADING', true);
    try {
      const res = await fetch(`/api/user/${id}`);
      const user = await res.json();
      commit('SET_USER', user);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 组合多个 action
  async init({ dispatch }) {
    await dispatch('fetchUser');
    await dispatch('fetchPermissions');
    await dispatch('fetchSettings');
  },
}
```

### 5.2 Promise 链式调用

```js
actions: {
  actionA({ commit }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('SOME_MUTATION');
        resolve();
      }, 1000);
    });
  },
  async actionB({ dispatch }) {
    await dispatch('actionA');
    commit('SOME_OTHER_MUTATION');
  },
}
```

---

## 六、Modules 模块化

### 6.1 定义模块

```js
const moduleA = {
  namespaced: true,  // 推荐开启
  state: { count: 0 },
  mutations: {
    INCREMENT(state) { state.count++; },
  },
  actions: {
    increment({ commit }) { commit('INCREMENT'); },
  },
  getters: {
    double: (state) => state.count * 2,
  },
};

const moduleB = {
  namespaced: true,
  state: { name: 'B' },
  // ...
};

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB,
  },
});
```

### 6.2 访问模块

```js
// state
store.state.a.count;
store.state.b.name;

// namespaced 模块的 getters/actions/mutations
store.getters['a/double'];
store.commit('a/INCREMENT');
store.dispatch('a/increment');

// 组件中
computed: {
  ...mapState('a', ['count']),
  ...mapGetters('a', ['double']),
}
methods: {
  ...mapMutations('a', ['INCREMENT']),
  ...mapActions('a', ['increment']),
}
```

### 6.3 模块间通信

```js
// 在模块 a 中调用模块 b 的 action
actions: {
  async actionInA({ dispatch, commit, rootState }) {
    await dispatch('b/someAction', null, { root: true });
    commit('b/SOME_MUTATION', null, { root: true });
  },
}
```

### 6.4 模块注册

```js
// 动态注册
store.registerModule('user', {
  state: { name: 'Tom' },
});

// 卸载
store.unregisterModule('user');
```

---

## 七、严格模式

```js
const store = new Vuex.Store({
  strict: true,  // 严禁直接修改 state（必须通过 mutation）
  state: { count: 0 },
  mutations: { /* ... */ },
});

// ❌ 严格模式下报错
store.state.count = 1;

// ✅ 通过 mutation
store.commit('INCREMENT');
```

> 严格模式有性能开销，**生产环境必须关闭**：

```js
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
});
```

---

## 八、表单处理

### 8.1 v-model 与 Vuex

```vue
<template>
  <input v-model="message" />
</template>

<script>
export default {
  computed: {
    message: {
      get() { return this.$store.state.obj.message; },
      set(value) { this.$store.commit('updateMessage', value); },
    },
  },
};
</script>
```

### 8.2 双向绑定的对象

```js
mutations: {
  updateMessage(state, value) {
    state.obj.message = value;
  },
}
```

---

## 九、插件

### 9.1 持久化

```bash
npm install vuex-persistedstate
```

```js
import createPersistedState from 'vuex-persistedstate';

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'my-app',
      paths: ['user'], // 只持久化 user 模块
      storage: window.localStorage,
    }),
  ],
  // ...
});
```

### 9.2 自定义插件

```js
const myPlugin = (store) => {
  // 初始化时
  console.log('store 初始化', store.state);

  // 每次 mutation 后
  store.subscribe((mutation, state) => {
    console.log(mutation.type, mutation.payload);
    localStorage.setItem('state', JSON.stringify(state));
  });
};

const store = new Vuex.Store({
  plugins: [myPlugin],
});
```

---

## 十、最佳实践

### 10.1 目录结构

```
src/
├── store/
│   ├── index.js           # 入口
│   ├── mutation-types.js  # 常量
│   ├── actions.js         # 根 actions（可选）
│   └── modules/
│       ├── user.js
│       ├── cart.js
│       └── products.js
```

### 10.2 模块模板

```js
// store/modules/user.js
import { SET_USER, SET_TOKEN, LOGOUT } from '../mutation-types';
import userApi from '@/api/user';

const state = {
  user: null,
  token: localStorage.getItem('token') || '',
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  username: (state) => state.user?.name,
};

const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  },
  [SET_TOKEN](state, token) {
    state.token = token;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  },
  [LOGOUT](state) {
    state.user = null;
    state.token = '';
    localStorage.removeItem('token');
  },
};

const actions = {
  async login({ commit }, { username, password }) {
    const { user, token } = await userApi.login(username, password);
    commit(SET_USER, user);
    commit(SET_TOKEN, token);
  },
  async logout({ commit }) {
    await userApi.logout();
    commit(LOGOUT);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
```

### 10.3 命名约定

- Mutation：**全大写下划线**（`SET_USER`）
- Action：**小驼峰**（`fetchUser`）
- Getter：**小驼峰**（`currentUser`）

### 10.4 何时使用 Vuex

| 场景                      | 推荐                      |
| ------------------------- | ------------------------- |
| 单组件状态                 | 组件 data                 |
| 父子组件通信              | props/$emit               |
| 兄弟组件通信              | 状态提升或 EventBus        |
| 多层级跨组件共享           | Vuex / Pinia              |
| 全局共享（用户/权限/主题） | Vuex / Pinia              |

---

## 十一、Vuex 4（Vue 3）

```ts
import { createStore } from 'vuex';

const store = createStore({
  state: { count: 0 },
  mutations: { INCREMENT(state) { state.count++; } },
  actions: { increment({ commit }) { commit('INCREMENT'); } },
});

import { createApp } from 'vue';
const app = createApp(App);
app.use(store);
app.mount('#app');
```

Vuex 4 与 Vuex 3 API 基本一致，仅入口改为 `createStore`。

---

## 十二、学习建议

1. **单向数据流**：理解 state → mutations → actions 的设计
2. **mutations 必须同步**：知道为什么
3. **模块化**：namespaced 是关键
4. **从 Vuex 迁移到 Pinia**：Vue 3 项目推荐 Pinia

---

## 参考

- [Vuex 3 文档](https://v3.vuex.vuejs.org/zh/)
- [Vuex 4 文档](https://vuex.vuejs.org/zh/)
