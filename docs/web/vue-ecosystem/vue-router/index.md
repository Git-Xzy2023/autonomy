---
title: Vue Router 路由管理
---

# Vue Router 路由管理

> Vue Router 是 Vue.js 官方路由管理器，支持嵌套路由、动态路由、命名视图、路由守卫等。本章对比 Vue Router 3（Vue 2）与 Vue Router 4（Vue 3）。

---

## 一、核心概念

| 概念         | 说明                                  |
| ------------ | ------------------------------------- |
| **路由**     | URL → 组件的映射                       |
| **嵌套路由** | 父子路由，配合 `<router-view>` 出口   |
| **动态路由** | URL 参数，如 `/user/:id`              |
| **命名路由** | 给路由起名，按名字跳转                 |
| **命名视图** | 同时渲染多个 `<router-view>`          |
| **路由守卫** | 全局/路由/组件内钩子                  |
| **过渡**     | 路由切换动画                          |
| **滚动行为** | 切换时控制滚动位置                    |

---

## 二、安装与基本使用

### 2.1 Vue Router 3（Vue 2）

```js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: () => import('./views/About.vue') },
  ],
});

new Vue({ router, render: h => h(App) }).$mount('#app');
```

### 2.2 Vue Router 4（Vue 3）

```js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: () => import('./views/About.vue') },
  ],
});

createApp(App).use(router).mount('#app');
```

### 2.3 路由模式

| 模式         | Vue Router 3                | Vue Router 4                | URL 形态              |
| ------------ | --------------------------- | --------------------------- | --------------------- |
| **History**  | `mode: 'history'`           | `createWebHistory()`        | `/about`              |
| **Hash**     | `mode: 'hash'`              | `createWebHashHistory()`    | `/#/about`            |
| **Memory**   | `mode: 'abstract'`          | `createMemoryHistory()`     | 无 URL（SSR/测试）    |

### 2.4 视图出口

```vue
<template>
  <div>
    <router-view />
  </div>
</template>
```

---

## 三、动态路由

### 3.1 参数

```js
const routes = [
  { path: '/user/:id', component: User },
  { path: '/user/:id/posts/:postId', component: UserPost },
];
```

```vue
<!-- User.vue -->
<template>
  <div>User {{ $route.params.id }}</div>
</template>

<script>
export default {
  computed: {
    id() { return this.$route.params.id; }
  }
};
</script>
```

### 3.2 Composition API 获取

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(route.params.id);
router.push(`/user/${route.params.id}/edit`);
</script>
```

### 3.3 参数变化监听

```js
// Vue 2
watch: {
  $route(to, from) {
    // ...
  }
}

// Vue 3
import { watch } from 'vue';
watch(() => route.params.id, (newId) => { /* ... */ });
```

### 3.4 捕获所有路由

```js
const routes = [
  { path: '/user/:id' },
  { path: '/:pathMatch(.*)*', component: NotFound }, // Vue 3
  // Vue 2: { path: '*', component: NotFound }
];
```

---

## 四、嵌套路由

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: UserHome },         // /user/123
      { path: 'profile', component: UserProfile }, // /user/123/profile
      { path: 'posts', component: UserPosts },     // /user/123/posts
    ],
  },
];
```

```vue
<!-- User.vue -->
<template>
  <div>
    <h2>User {{ $route.params.id }}</h2>
    <router-view />
  </div>
</template>
```

---

## 五、命名路由与编程式导航

### 5.1 命名路由

```js
const routes = [
  { path: '/user/:id', name: 'user', component: User },
];
```

```js
// 字符串
router.push('/user/123');

// 对象
router.push({ path: '/user/123' });

// 命名路由 + params
router.push({ name: 'user', params: { id: '123' } });

// 带 query
router.push({ path: '/register', query: { plan: 'private' } });

// 替换
router.replace({ path: '/login' });

// 前进/后退
router.go(-1);
router.back();
router.forward();
```

### 5.2 模板跳转

```vue
<template>
  <router-link to="/about">About</router-link>
  <router-link :to="{ name: 'user', params: { id: 123 } }">User 123</router-link>
  <router-link :to="{ path: '/search', query: { q: 'vue' } }">Search</router-link>
</template>
```

---

## 六、路由守卫

### 6.1 全局守卫

```js
// 全局前置
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

// 全局解析
router.beforeResolve((to, from, next) => {
  // 在组件内守卫和异步路由组件被解析后调用
  next();
});

// 全局后置
router.afterEach((to, from) => {
  document.title = to.meta.title || 'My App';
});
```

### 6.2 路由独享守卫

```js
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin()) next();
      else next('/403');
    },
  },
];
```

### 6.3 组件内守卫

```js
// Vue 2 Options API
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => { /* 通过 vm 访问组件实例 */ });
  },
  beforeRouteUpdate(to, from, next) {
    // 路由变化但组件复用（如 /user/1 → /user/2）
    next();
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm('确定离开？');
    if (answer) next();
    else next(false);
  },
};
```

```js
// Vue 3 Composition API
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

onBeforeRouteUpdate((to, from) => {});
onBeforeRouteLeave((to, from) => {});
```

### 6.4 守卫执行顺序

```
1. beforeRouteLeave（离开组件）
2. beforeEach（全局前置）
3. beforeEnter（路由独享）
4. beforeRouteEnter（进入组件）
5. beforeResolve（全局解析）
6. afterEach（全局后置）
7. beforeRouteUpdate（如果复用组件）
```

### 6.5 meta 字段

```js
const routes = [
  { path: '/login', meta: { public: true } },
  { path: '/admin', meta: { requiresAuth: true, role: 'admin' } },
];

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    // 检查登录状态
  }
});
```

---

## 七、路由元信息与命名视图

### 7.1 命名视图

```vue
<template>
  <router-view />
  <router-view name="sidebar" />
  <router-view name="footer" />
</template>
```

```js
const routes = [
  {
    path: '/',
    components: {
      default: Home,
      sidebar: Sidebar,
      footer: Footer,
    },
  },
];
```

### 7.2 重定向与别名

```js
const routes = [
  // 重定向
  { path: '/home', redirect: '/' },
  { path: '/home', redirect: { name: 'home' } },
  { path: '/search/:q', redirect: to => `/search?q=${to.params.q}` },

  // 别名
  { path: '/user/:id', component: User, alias: '/u/:id' },
];
```

---

## 八、过渡与滚动行为

### 8.1 路由过渡

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

### 8.2 滚动行为

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 后退前进时恢复
    if (savedPosition) return savedPosition;

    // 锚点跳转
    if (to.hash) return { el: to.hash, behavior: 'smooth' };

    // 默认顶部
    return { top: 0 };
  },
});
```

---

## 九、动态路由

### 9.1 addRoute

```js
// 添加
router.addRoute({ path: '/admin', component: Admin });

// 添加子路由
router.addRoute('admin', { path: 'settings', component: Settings });

// 删除
router.removeRoute('admin');
```

### 9.2 应用场景

- 基于用户权限动态加载路由
- 微前端动态注册子应用路由

```js
// 权限路由
async function setupRoutes() {
  const permissions = await fetchUserPermissions();
  permissions.forEach(perm => {
    if (perm.type === 'route') {
      router.addRoute({
        path: perm.path,
        component: () => import(`@/views/${perm.component}.vue`),
        meta: { requiresAuth: true }
      });
    }
  });
}
```

---

## 十、Vue Router 3 vs 4

| 对比项         | Vue Router 3             | Vue Router 4                |
| -------------- | ------------------------ | --------------------------- |
| **初始化**     | `new VueRouter()`        | `createRouter()`            |
| **模式**       | `mode: 'history'`        | `history: createWebHistory()` |
| **`*` 路由**   | 支持                     | 用 `/:pathMatch(.*)*` 替代  |
| **isReady**    | 无                       | `router.isReady()`          |
| **动态路由**   | `addRoutes`              | `addRoute` / `removeRoute`  |
| **Composition**| 无                       | `useRoute`/`useRouter`      |
| **类型**       | Flow                     | TypeScript                  |

---

## 十一、学习建议

1. **基础**：动态路由、嵌套路由、命名路由
2. **守卫**：理解执行顺序，掌握鉴权拦截
3. **动态**：addRoute 用于权限路由
4. **对比**：Vue Router 4 的 API 变化

---

## 参考

- [Vue Router 4 文档](https://router.vuejs.org/zh/)
- [Vue Router 3 文档](https://v3.router.vuejs.org/zh/)
