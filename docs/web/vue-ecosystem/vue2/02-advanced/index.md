---
title: Vue 2 进阶与最佳实践
---

# Vue 2 进阶与最佳实践

> 本章涵盖 Vue 2 的进阶用法：Mixins、自定义指令、过滤器、插件、性能优化、常见陷阱与团队规范。

---

## 一、Mixins

### 1.1 基础用法

```js
// mixin.js
export const counterMixin = {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  created() {
    console.log('mixin created');
  },
};
```

```js
// 组件使用
import { counterMixin } from './mixin';
export default {
  mixins: [counterMixin],
  created() {
    console.log('component created');
  },
};
```

### 1.2 合并策略

| 选项        | 合并规则                       |
| ----------- | ------------------------------ |
| `data`      | 组件优先，递归合并              |
| `methods`   | 组件优先                        |
| `computed`  | 组件优先                        |
| 生命周期    | 都会执行，mixin 先于组件        |
| `components`| 合并为同一对象                  |

### 1.3 全局 Mixin

```js
// 不推荐，会影响所有组件
Vue.mixin({
  created() {
    console.log('全局 mixin');
  },
});
```

### 1.4 Mixins 的问题

- ❌ 数据来源不清晰
- ❌ 命名冲突难排查
- ❌ 类型推断差

> Vue 3 用 Composition API 替代了 Mixins。

---

## 二、自定义指令

### 2.1 指令钩子

```js
Vue.directive('my-directive', {
  bind(el, binding, vnode) {
    // 第一次绑定到元素时调用
  },
  inserted(el, binding, vnode) {
    // 元素插入父节点时
  },
  update(el, binding, vnode, oldVnode) {
    // 所在组件 VNode 更新时
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 所在组件及其子 VNode 全部更新后
  },
  unbind(el, binding, vnode) {
    // 解绑时
  },
});
```

### 2.2 钩子参数

```js
{
  el,           // DOM 元素
  binding: {
    name,       // 指令名（不含 v-）
    value,      // 绑定值
    oldValue,   // 旧值
    expression, // 字符串表达式
    arg,        // 参数：v-my:foo 的 foo
    modifiers,  // 修饰符：v-my.bar 的 { bar: true }
  },
  vnode,        // 虚拟节点
  oldVnode,     // 上一个虚拟节点
}
```

### 2.3 实战：复制指令

```js
Vue.directive('copy', {
  bind(el, { value }) {
    el._copyHandler = () => {
      const input = document.createElement('input');
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    };
    el.addEventListener('click', el._copyHandler);
  },
  update(el, { value }) {
    el._copyHandler && (el._copyHandler._value = value);
  },
  unbind(el) {
    el._copyHandler && el.removeEventListener('click', el._copyHandler);
  },
});
```

---

## 三、过滤器

> 注意：Vue 3 已移除过滤器，建议用 computed 或方法替代。

### 3.1 注册与使用

```js
// 全局注册
Vue.filter('capitalize', (value) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// 局部注册
export default {
  filters: {
    currency(value, symbol = '¥') {
      return symbol + Number(value).toFixed(2);
    },
  },
};
```

```vue
<template>
  <p>{{ message | capitalize }}</p>
  <p>{{ price | currency('$') }}</p>
  <p>{{ date | formatDate | capitalize }}</p>
</template>
```

---

## 四、插件

### 4.1 编写插件

```js
// my-plugin.js
const MyPlugin = {
  install(Vue, options) {
    // 1. 添加全局方法
    Vue.myGlobalMethod = function () {};

    // 2. 添加全局指令
    Vue.directive('my-directive', { /* ... */ });

    // 3. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {};

    // 4. 注册组件
    Vue.component('my-component', { /* ... */ });

    // 5. 注入 mixin
    Vue.mixin({ /* ... */ });
  },
};

export default MyPlugin;
```

### 4.2 使用插件

```js
import MyPlugin from './my-plugin';
Vue.use(MyPlugin, { someOption: true });
```

---

## 五、函数式组件

无状态、无实例、无 this 的轻量组件。

```vue
<template functional>
  <div class="card">
    <slot />
  </div>
</template>
```

```js
// 函数式组件
export default {
  functional: true,
  props: ['level'],
  render(h, ctx) {
    return h(`h${ctx.props.level}`, ctx.children);
  },
};
```

特点：
- ✅ 渲染快（无实例化开销）
- ✅ 适合展示型组件
- ❌ 无 this、无 data、无生命周期

---

## 六、keep-alive 缓存

```vue
<template>
  <keep-alive :include="['UserList', 'UserDetail']" :max="10">
    <router-view />
  </keep-alive>
</template>
```

| 属性      | 说明                            |
| --------- | ------------------------------- |
| `include` | 匹配组件名，缓存指定组件       |
| `exclude` | 排除指定组件                    |
| `max`     | 最大缓存数（LRU 淘汰）         |

被缓存的组件会触发 `activated` 与 `deactivated` 钩子。

---

## 七、常见陷阱

### 7.1 v-for 与 v-if 优先级

```vue
<!-- Vue 2 中 v-for 优先级高于 v-if -->
<!-- ❌ 每次循环都判断，浪费性能 -->
<li v-for="user in users" v-if="user.active" :key="user.id" />

<!-- ✅ 用 computed 提前过滤 -->
```

### 7.2 数组更新

```js
export default {
  data() {
    return { list: [1, 2, 3] };
  },
  methods: {
    bad() {
      this.list[0] = 99; // ❌ 不触发更新
      this.list.length = 0; // ❌ 不触发更新
    },
    good() {
      this.$set(this.list, 0, 99); // ✅
      this.list.splice(0); // ✅ 清空
      this.list.push(4); // ✅ 变更方法
    },
  },
};
```

### 7.3 对象新属性

```js
export default {
  data() {
    return { user: { name: 'Tom' } };
  },
  methods: {
    bad() {
      this.user.age = 18; // ❌ 不响应
    },
    good() {
      this.$set(this.user, 'age', 18); // ✅
      this.user = { ...this.user, age: 18 }; // ✅ 替换整个对象
    },
  },
};
```

### 7.4 闭包陷阱

```js
export default {
  methods: {
    bad() {
      // ❌ setTimeout 内的 this 不是 Vue 实例
      setTimeout(function () {
        this.count++; // 报错
      }, 1000);
    },
    good() {
      // ✅ 箭头函数继承 this
      setTimeout(() => {
        this.count++;
      }, 1000);
    },
  },
};
```

---

## 八、性能优化

### 8.1 列表优化

```vue
<template>
  <!-- ❌ 一次性渲染所有 -->
  <li v-for="item in bigList" :key="item.id">{{ item.name }}</li>

  <!-- ✅ 虚拟滚动 -->
  <virtual-list :size="50" :remain="8" :data="bigList" />
</template>
```

### 8.2 v-once 与 v-memo

```vue
<template>
  <!-- 静态内容一次性渲染 -->
  <div v-once>{{ staticContent }}</div>
</template>
```

### 8.3 路由懒加载

```js
const router = new VueRouter({
  routes: [
    {
      path: '/about',
      component: () => import('./views/About.vue'), // 懒加载
    },
  ],
});
```

### 8.4 组件懒加载

```js
export default {
  components: {
    HeavyComponent: () => import('./HeavyComponent.vue'),
  },
};
```

### 8.5 通用优化清单

| 优化项           | 效果                          |
| ---------------- | ----------------------------- |
| 路由懒加载       | 减小首屏体积                  |
| 组件懒加载       | 按需加载重型组件              |
| v-once           | 静态内容只渲染一次            |
| Object.freeze    | 跳过响应式，减少初始化开销    |
| 虚拟列表         | 长列表性能 10 倍提升          |
| 事件销毁         | 防止内存泄漏                  |
| keep-alive       | 缓存页面避免重复请求          |
| 图片懒加载       | 减少首屏图片请求              |

---

## 九、团队规范

### 9.1 目录结构

```
src/
├── api/          # 接口请求
├── assets/       # 静态资源
├── components/   # 通用组件
├── directives/   # 自定义指令
├── filters/      # 过滤器
├── mixins/       # Mixins
├── router/       # 路由
├── store/        # Vuex
├── utils/        # 工具函数
└── views/        # 页面组件
```

### 9.2 组件顺序

```js
export default {
  name: 'MyComponent',
  components: {},
  directives: {},
  filters: {},
  mixins: [],
  props: {},
  data() { return {}; },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
};
```

### 9.3 命名规范

- 组件名：PascalCase `UserCard.vue`
- props 名：camelCase `userName`
- 事件名：kebab-case `@user-click`
- CSS 类：BEM 或 scoped + kebab-case

---

## 十、学习建议

1. **进阶 API**：掌握 Mixins、自定义指令、插件
2. **避坑指南**：理解响应式的局限，避免数组/对象的坑
3. **性能优化**：路由懒加载、keep-alive、虚拟列表三件套
4. **规范**：建立团队代码顺序与命名约定

---

## 参考

- [Vue 2 风格指南](https://v2.cn.vuejs.org/v2/style-guide/)
- [Vue 2 Cookbook](https://v2.cn.vuejs.org/v2/cookbook/)
