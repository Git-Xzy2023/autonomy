---
title: Vue 3 新特性与迁移
---

# Vue 3 新特性与迁移

> 本章梳理 Vue 3 相对 Vue 2 的重要新特性，以及从 Vue 2 项目升级到 Vue 3 的迁移指南。

---

## 一、编译期优化

### 1.1 静态提升（Static Hoisting）

Vue 2：每次渲染都重新创建静态节点

```js
// Vue 2
function render() {
  return [
    _c('h1', null, '标题'), // 每次创建
    _c('p', null, '静态内容'), // 每次创建
    _c('p', null, this.dynamic),
  ];
}
```

Vue 3：静态节点提升到 render 函数外，只创建一次

```js
// Vue 3
const _hoisted_1 = createVNode('h1', null, '标题');
const _hoisted_2 = createVNode('p', null, '静态内容');

function render(_ctx, _cache) {
  return [
    _hoisted_1,
    _hoisted_2,
    createVNode('p', null, _ctx.dynamic),
  ];
}
```

### 1.2 PatchFlag

Vue 3 编译时标记每个 VNode 的动态类型，diff 时只比较动态部分：

```js
// 编译输出
createVNode('div', { class: 'static' }, '静态', PatchFlags.TEXT); // 只 patch 文本
createVNode('div', { id: _ctx.id }, '内容', PatchFlags.PROPS, ['id']); // 只 patch props
```

PatchFlag 枚举：

```ts
enum PatchFlags {
  TEXT = 1,          // 动态文本
  CLASS = 2,         // 动态 class
  STYLE = 4,         // 动态 style
  PROPS = 8,         // 动态 props（非 class/style）
  FULL_PROPS = 16,  // 带 key 的 props（需全量 diff）
  HYDRATE_EVENTS = 32,
  STABLE_FRAGMENT = 64,
  KEYED_FRAGMENT = 128,
  UNKEYED_FRAGMENT = 256,
  NEED_PATCH = 512,
  DYNAMIC_SLOTS = 1024,
}
```

### 1.3 Block Tree

Vue 3 将模板分成块（Block），每个 Block 内的动态节点被收集到 `dynamicChildren` 数组，diff 时跳过静态节点：

```js
// Vue 2：全量 diff
diff(vnode1.children, vnode2.children);

// Vue 3：只 diff 动态节点
diff(block1.dynamicChildren, block2.dynamicChildren);
```

**v-if/v-for 会开启新 Block**，所以动态结构会分裂 Block。

### 1.4 缓存事件处理

```vue
<!-- Vue 2：每次渲染创建新函数 -->
<button @click="onClick">点击</button>

<!-- Vue 3：事件处理函数缓存 -->
<button onClick={_cache[0] || (_cache[0] = (...args) => (_ctx.onClick(...args)))}>点击</button>
```

### 1.5 性能对比

| 场景             | Vue 2    | Vue 3    | 提升 |
| ---------------- | -------- | -------- | ---- |
| 静态内容渲染     | 1.0x     | 2-3x     | 2-3x |
| 大量动态节点 diff | 1.0x     | 1.3-2x   | 30%-100% |
| 内存占用         | 1.0x     | 0.5-0.7x | 减少 30%-50% |
| Bundle 体积      | 20KB+    | 12-14KB  | 减少 40% |

---

## 二、v-model 新语法

### 2.1 Vue 2 vs Vue 3

```vue
<!-- Vue 2：只能一个 v-model -->
<Child v-model="value" />
<!-- 等价于 -->
<Child :value="value" @input="value = $event" />

<!-- Vue 3：可多个 v-model -->
<Child v-model:title="title" v-model:content="content" />
```

### 2.2 Vue 3 v-model 实现

```vue
<!-- 子组件 -->
<script setup>
const title = defineModel<string>('title');
const content = defineModel<string>('content');
</script>

<!-- 或用 props + emit -->
<script setup>
const props = defineProps({
  title: String,
  content: String,
});
const emit = defineEmits(['update:title', 'update:content']);
</script>
```

### 2.3 自定义修饰符

```vue
<!-- 父组件 -->
<Child v-model.capitalize="text" />

<!-- 子组件 -->
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  },
});
</script>
```

---

## 三、其他新特性

### 3.1 Fragment 多根节点

```vue
<!-- Vue 2：必须单根 -->
<template>
  <div class="wrapper">  <!-- 必须包一层 -->
    <header>...</header>
    <main>...</main>
  </div>
</template>

<!-- Vue 3：支持多根 -->
<template>
  <header>...</header>
  <main>...</main>
</template>
```

### 3.2 Teleport 传送门

```vue
<template>
  <button @click="show = true">打开</button>

  <teleport to="body">
    <div v-if="show" class="modal">弹窗</div>
  </teleport>
</template>
```

应用场景：
- 弹窗、抽屉、Toast
- 全局 Loading
- 避免父级 overflow:hidden / z-index 干扰

### 3.3 Suspense

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

### 3.4 全局 API 挂载

```js
// Vue 2：全局 API 直接挂在 Vue 上
Vue.use(VueRouter);
Vue.component('MyComp', {});
Vue.directive('focus', {});

// Vue 3：改为应用实例方法
const app = createApp(App);
app.use(router);
app.component('MyComp', {});
app.directive('focus', {});
app.mount('#app');
```

**好处**：多个 Vue 应用互不干扰。

### 3.5 Tree Shaking

```js
// Vue 2：全局挂载，无法 tree shake
// Vue.nextTick, Vue.observable... 全在 bundle 里

// Vue 3：按需引入
import { nextTick, ref } from 'vue';

// 不用的 API 不会打包
```

### 3.6 v-if/v-for 优先级

Vue 2：v-for 优先于 v-if（不推荐同用）
Vue 3：v-if 优先于 v-for（不推荐同用）

```vue
<!-- ❌ 任何版本都不推荐 -->
<li v-for="item in list" v-if="item.active" :key="item.id" />

<!-- ✅ 用 computed -->
<li v-for="item in activeList" :key="item.id" />
```

---

## 四、API 变更一览

### 4.1 全局 API 变更

| Vue 2                | Vue 3                       |
| -------------------- | --------------------------- |
| `new Vue()`          | `createApp()`               |
| `Vue.use()`          | `app.use()`                 |
| `Vue.component()`    | `app.component()`           |
| `Vue.directive()`    | `app.directive()`           |
| `Vue.mixin()`        | `app.mixin()`               |
| `Vue.prototype.xxx`  | `app.config.globalProperties.xxx` |
| `Vue.set()`          | 不需要（Proxy 自动）         |
| `Vue.delete()`       | 不需要                       |
| `Vue.observable()`   | `reactive()`                |

### 4.2 生命周期变更

| Vue 2            | Vue 3              |
| ---------------- | ------------------ |
| beforeDestroy    | beforeUnmount      |
| destroyed        | unmounted         |
| (无)             | beforeRouteUpdate  |

### 4.3 其他 API

| Vue 2             | Vue 3                |
| ----------------- | -------------------- |
| `filters`         | computed / 方法       |
| `$on/$off/$once`  | 移除（用 mitt）      |
| `$children`       | 移除（用 ref）       |
| `$listeners`      | 合并到 $attrs        |
| `$scopedSlots`    | 合并到 $slots        |
| `v-on.native`     | 移除                 |
| `v-bind.sync`     | `v-model:xxx`        |
| `h`               | `import { h } from 'vue'` |

---

## 五、迁移指南

### 5.1 迁移构建版本

Vue 3 提供了 `@vue/compat` 构建版本，平滑迁移：

```js
import { createApp } from 'vue/compat';
const app = createApp(App);
```

它会警告废弃 API，但不会立即报错。

### 5.2 迁移步骤

1. **升级依赖**

```bash
npm install vue@3
npm install vue-router@4
npm install vuex@4  # 或迁移到 pinia
```

2. **替换入口文件**

```js
// Vue 2
import Vue from 'vue';
new Vue({ render: h => h(App) }).$mount('#app');

// Vue 3
import { createApp } from 'vue';
createApp(App).mount('#app');
```

3. **修复警告**：用 `@vue/compat` 运行，按警告逐个修复

4. **切换回正式版**

### 5.3 常见迁移问题

| 问题                | 原因                          | 解决                     |
| ------------------- | ----------------------------- | ------------------------ |
| 组件多根节点报错     | Vue 2 限制                    | 用 Fragment 或包一层 div |
| 过滤器失效           | Vue 3 移除                    | 改用 computed/方法       |
| v-model 不工作       | 语法变化                       | 改 `modelValue`          |
| `this.$set` 报错    | Vue 3 不需要                   | 直接赋值                 |
| 事件总线失效         | `$on/$off` 移除               | 用 mitt 或 pinia         |
| $children 失效       | Vue 3 移除                    | 用 template ref          |

---

## 六、工具链升级

### 6.1 Vue CLI → Vite

```js
// Vue CLI (vue.config.js) - Vue 2
module.exports = {
  configureWebpack: { /* ... */ },
};

// Vite (vite.config.js) - Vue 3
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
```

### 6.2 DevTools 升级

Vue 3 DevTools 6+ 与 Vue 2 DevTools 5+ 不兼容，需要切换。

### 6.3 IDE 支持

- VSCode 插件：Volar（替代 Vetur）
- TS 配置：`"vueCompilerOptions"` 选项

---

## 七、实战建议

### 7.1 新项目

直接用 Vue 3 + Vite + Pinia + Vue Router 4。

### 7.2 老项目迁移

- 评估必要性：Vue 2 项目稳定运行，不必强升
- 用 compat 版本渐进迁移
- 优先迁移工具链（Vue CLI → Vite）

### 7.3 是否升级的决策

| 情况                       | 建议                  |
| -------------------------- | --------------------- |
| 新项目                     | Vue 3                 |
| 老项目维护，功能稳定       | 保持 Vue 2            |
| 需要性能/TS/Composition    | 升级 Vue 3            |
| 依赖大量不维护的 Vue 2 库  | 暂不升级              |

---

## 八、学习建议

1. **新特性**：重点关注 Composition API 和编译期优化
2. **迁移路径**：用 compat 版本渐进迁移，不要一次性重写
3. **工具链**：Vite + Pinia + Vue Router 4 是 Vue 3 标准组合

---

## 参考

- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
- [Vue 3 changelog](https://github.com/vuejs/core/blob/main/CHANGELOG.md)
