---
title: Vue 2 学习指南
---

# Vue 2 学习指南

> Vue 2 是 Vue.js 的第二代主版本，基于 Options API 与 Object.defineProperty 实现响应式。虽然 Vue 3 已发布，但大量存量项目仍在使用 Vue 2，理解 Vue 2 仍具价值。

---

## 一、Vue 2 概述

### 1.1 核心特性

- 🎯 **响应式**：基于 `Object.defineProperty` 数据劫持
- 🧩 **组件化**：单文件组件（SFC）
- 📜 **Options API**：配置式的 API 风格
- 🛣️ **生态完整**：Vue Router 3、Vuex 3
- 🌐 **虚拟 DOM**：基于 Snabbdom 实现

### 1.2 Vue 2 vs Vue 3

| 对比项         | Vue 2                     | Vue 3                            |
| -------------- | ------------------------- | -------------------------------- |
| **API 风格**   | Options API               | Composition API + Options API    |
| **响应式**     | Object.defineProperty     | Proxy                            |
| **生命周期**   | created/mounted/destroyed | setup/onMounted/onUnmounted      |
| **模板**       | 单根节点                  | 支持多根节点（Fragment）         |
| **TypeScript** | 支持有限                  | 一等公民                         |
| **体积**       | 较大                      | 更小（Tree Shaking）             |
| **性能**       | 全量 diff                 | 编译期优化（静态提升/PatchFlag） |
| **状态管理**   | Vuex 3                    | Pinia                            |

---

## 二、Options API

### 2.1 实例与数据

```vue
<template>
  <div>{{ message }} - {{ count }}</div>
</template>

<script>
export default {
  // 组件名
  name: "HelloWorld",

  // 父子通信
  props: {
    title: {
      type: String,
      required: true,
    },
  },

  // 数据（响应式）
  data() {
    return {
      message: "Hello",
      count: 0,
    };
  },

  // 计算属性（缓存）
  computed: {
    double() {
      return this.count * 2;
    },
  },

  // 侦听器（副作用）
  watch: {
    count(newVal, oldVal) {
      console.log(`${oldVal} → ${newVal}`);
    },
  },

  // 方法
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

### 2.2 computed vs methods vs watch

| 对比项     | computed | methods    | watch           |
| ---------- | -------- | ---------- | --------------- |
| **缓存**   | ✅ 有    | ❌ 无      | -               |
| **返回值** | 计算值   | 任意       | 无              |
| **场景**   | 派生状态 | 事件处理   | 异步/开销大操作 |
| **依赖**   | 自动追踪 | 调用即执行 | 显式声明        |

---

## 三、生命周期

```
┌──────────────────────────────────────────────┐
│           Vue 2 组件生命周期                  │
├──────────────────────────────────────────────┤
│                                              │
│  beforeCreate  ──► created                   │
│  (数据未初始化)    (data/methods 可用)        │
│                                              │
│         ↓                                    │
│  beforeMount   ──► mounted                   │
│  (虚拟 DOM 创建)   (真实 DOM 挂载完成)        │
│                                              │
│         ↓                                    │
│  ┌─── 数据变化 ───┐                          │
│  │ beforeUpdate    │                          │
│  │   ↓             │                          │
│  │ updated         │                          │
│  └────────────────┘                          │
│                                              │
│         ↓                                    │
│  beforeDestroy ──► destroyed                │
│  (实例仍可用)       (清理完成)                │
│                                              │
└──────────────────────────────────────────────┘
```

### 常见用途

| 钩子            | 常用场景                       |
| --------------- | ------------------------------ |
| `created`       | 发起请求、初始化非响应式数据   |
| `mounted`       | 操作 DOM、初始化第三方库       |
| `beforeDestroy` | 清除定时器、解绑事件、销毁实例 |
| `activated`     | keep-alive 缓存组件激活        |
| `deactivated`   | keep-alive 缓存组件停用        |

---

## 四、组件通信

### 4.1 父子通信

```vue
<!-- 父组件 -->
<template>
  <Child :msg="parentMsg" @child-event="handle" />
</template>

<script>
import Child from "./Child.vue";
export default {
  components: { Child },
  data() {
    return { parentMsg: "Hi" };
  },
  methods: {
    handle(payload) {
      console.log("子组件触发:", payload);
    },
  },
};
</script>
```

```vue
<!-- 子组件 -->
<template>
  <button @click="emitEvent">{{ msg }}</button>
</template>

<script>
export default {
  props: ["msg"],
  methods: {
    emitEvent() {
      this.$emit("child-event", { data: "子组件数据" });
    },
  },
};
</script>
```

### 4.2 通信方式对比

| 方式                | 关系 | 说明                   |
| ------------------- | ---- | ---------------------- |
| `props/$emit`       | 父子 | 推荐，单向数据流       |
| `$parent/$children` | 父子 | 不推荐，耦合严重       |
| `$refs`             | 父子 | 直接访问子组件实例     |
| `provide/inject`    | 祖孙 | 跨层级注入             |
| `EventBus`          | 任意 | 简单场景可用，复杂易乱 |
| `Vuex`              | 任意 | 推荐的状态管理方案     |
| `$attrs/$listeners` | 父子 | 高阶组件透传           |

---

## 五、指令

### 5.1 内置指令

| 指令          | 说明                   |
| ------------- | ---------------------- |
| `v-text`      | 文本渲染（等价 {{ }}） |
| `v-html`      | 渲染 HTML（注意 XSS）  |
| `v-show`      | 切换 display           |
| `v-if/v-else` | 条件渲染（销毁/创建）  |
| `v-for`       | 列表渲染（需 key）     |
| `v-on`/`@`    | 事件绑定               |
| `v-bind`/`:`  | 属性绑定               |
| `v-model`     | 双向绑定               |
| `v-once`      | 一次性渲染             |
| `v-slot`      | 插槽                   |

### 5.2 v-if vs v-show

| 对比项   | v-if           | v-show            |
| -------- | -------------- | ----------------- |
| **本质** | 创建/销毁元素  | 切换 display 样式 |
| **开销** | 初始低、切换高 | 初始高、切换低    |
| **场景** | 不常切换       | 频繁切换          |

### 5.3 v-for key 的作用

```vue
<!-- ❌ 不要用 index -->
<li v-for="(item, index) in list" :key="index">{{ item }}</li>

<!-- ✅ 用唯一 id -->
<li v-for="item in list" :key="item.id">{{ item }}</li>
```

key 是 diff 算法识别节点的唯一标识，使用 index 在增删时会导致状态错乱。

### 5.4 自定义指令

```js
// 全局注册：自动聚焦指令
Vue.directive("focus", {
  inserted(el) {
    el.focus();
  },
});

// 局部注册
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
};
```

指令钩子：`bind`、`inserted`、`update`、`componentUpdated`、`unbind`。

---

## 六、插槽

### 6.1 默认插槽

```vue
<!-- 子组件 -->
<template>
  <div class="card">
    <slot>默认内容</slot>
  </div>
</template>

<!-- 父组件 -->
<Card>
  <p>这里是插入的内容</p>
</Card>
```

### 6.2 具名插槽

```vue
<!-- 子组件 -->
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
  <footer><slot name="footer" /></footer>
</template>

<!-- 父组件 -->
<Card>
  <template #header><h1>标题</h1></template>
  <template #default><p>正文</p></template>
  <template #footer><span>底部</span></template>
</Card>
```

### 6.3 作用域插槽

```vue
<!-- 子组件 -->
<template>
  <ul>
    <li v-for="item in list" :key="item.id">
      <slot :item="item" :index="index" />
    </li>
  </ul>
</template>

<!-- 父组件 -->
<List :list="users">
  <template #default="{ item, index }">
    {{ index }} - {{ item.name }}
  </template>
</List>
```

---

## 七、响应式原理

### 7.1 Object.defineProperty

```js
// Vue 2 响应式简化版
function defineReactive(obj, key, val) {
  let dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend(); // 收集依赖
      return val;
    },
    set(newVal) {
      if (val === newVal) return;
      val = newVal;
      dep.notify(); // 触发更新
    },
  });
}
```

### 7.2 局限性

| 局限         | 说明     | 解决方案             |
| ------------ | -------- | -------------------- |
| 新增属性     | 无法检测 | `Vue.set(obj, k, v)` |
| 删除属性     | 无法检测 | `Vue.delete(obj, k)` |
| 数组索引修改 | 无法检测 | `Vue.set(arr, i, v)` |
| 数组 length  | 无法检测 | 使用 splice          |
| Map/Set      | 不支持   | 无法支持，需 Vue 3   |

### 7.3 数组方法的处理

Vue 2 重写了 7 个变更方法以触发更新：

```js
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
```

---

## 八、最佳实践

### 8.1 v-for 与 v-if

```vue
<!-- ❌ 不要同时用在一个元素 -->
<li v-for="item in list" v-if="item.show" :key="item.id" />

<!-- ✅ 用 computed 过滤 -->
<li v-for="item in showList" :key="item.id" />
```

### 8.2 组件命名

- 组件名用 PascalCase：`<MyComponent />`
- props 用 camelCase：`userName`
- 事件用 kebab-case：`@user-click`

### 8.3 data 必须是函数

```js
// ❌ 错误：所有实例共享同一 data
data: { count: 0 }

// ✅ 正确：每个实例独立
data() { return { count: 0 }; }
```

---

## 九、学习建议

1. **Options API**：掌握 data/computed/methods/watch 的协作
2. **组件通信**：props/$emit 是基础，复杂场景上 Vuex
3. **响应式原理**：理解 defineReactive，知道 Vue 2 的局限
4. **迁移准备**：学习 Vue 3 时对比记忆，理解为什么改用 Proxy

---

## 参考

- [Vue 2 官方文档](https://v2.cn.vuejs.org/)
- [Vue 2 源码](https://github.com/vuejs/vue/tree/v2.6.14)
