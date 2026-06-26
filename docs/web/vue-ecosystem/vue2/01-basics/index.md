---
title: Vue 2 基础与组件
---

# Vue 2 基础与组件

> 本章介绍 Vue 2 的环境搭建、模板语法、指令、组件、生命周期等核心基础，是上手 Vue 2 项目的必读内容。

---

## 一、环境搭建

### 1.1 通过 CDN 引入

```html
<!-- 开发环境 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>

<!-- 生产环境 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js"></script>
```

### 1.2 通过 Vue CLI 创建项目

```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 创建项目
vue create my-app
cd my-app
npm run serve
```

### 1.3 通过 Vite 创建（不推荐但可用）

```bash
npm create vite@latest my-app -- --template vue
cd my-app
npm install
npm run dev
```

> 注意：Vite 默认装的是 Vue 3，要使用 Vue 2 需手动修改 `package.json` 与 `main.js`。

### 1.4 单文件组件结构

```vue
<template>
  <div class="hello">{{ msg }}</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: { msg: String },
};
</script>

<style scoped>
.hello { color: red; }
</style>
```

---

## 二、模板语法

### 2.1 文本插值

```vue
<template>
  <div>{{ message }}</div>
  <div v-once>{{ onceMessage }}</div> <!-- 一次性渲染 -->
</template>
```

### 2.2 表达式

```vue
<template>
  <div>{{ number + 1 }}</div>
  <div>{{ ok ? 'YES' : 'NO' }}</div>
  <div>{{ message.split('').reverse().join('') }}</div>
  <div :id="'list-' + id"></div>
</template>
```

> 表达式只能是单个 JS 表达式，不能写语句（如 `var a = 1`）。

### 2.3 指令

```vue
<template>
  <!-- 条件 -->
  <p v-if="show">显示</p>
  <p v-else-if="other">其他</p>
  <p v-else>否则</p>

  <!-- 循环 -->
  <li v-for="(item, index) in list" :key="item.id">
    {{ index }}: {{ item.name }}
  </li>

  <!-- 属性绑定 -->
  <img :src="imageUrl" :alt="altText" />

  <!-- 事件 -->
  <button @click="onClick">点击</button>
  <button @click="onClick($event, '参数')">带参</button>
  <input @keyup.enter="onSubmit" />

  <!-- 双向绑定 -->
  <input v-model="username" />
</template>
```

### 2.4 修饰符

| 修饰符         | 说明                        |
| -------------- | --------------------------- |
| `.stop`        | 调用 `event.stopPropagation()` |
| `.prevent`     | 调用 `event.preventDefault()`  |
| `.capture`     | 使用捕获模式                |
| `.self`        | 仅 event.target 是当前元素 |
| `.once`        | 只触发一次                  |
| `.passive`     | 提升滚动性能                |
| `.enter/.tab`  | 按键修饰符                  |
| `.ctrl/.alt`   | 系统修饰符                  |
| `.left/.right` | 鼠标按键                    |
| `.sync`        | prop 双向绑定（语法糖）     |

---

## 三、计算属性

### 3.1 基础用法

```js
export default {
  data() {
    return {
      firstName: '张',
      lastName: '三',
    };
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    },
    // 带 setter
    fullNameWithSetter: {
      get() {
        return this.firstName + this.lastName;
      },
      set(newVal) {
        this.firstName = newVal[0];
        this.lastName = newVal.slice(1);
      },
    },
  },
};
```

### 3.2 计算属性的缓存

```js
computed: {
  now() {
    return Date.now(); // ❌ 不要做无响应式依赖的计算
  },
},
```

计算属性只在依赖的响应式数据变化时才重新计算。

---

## 四、侦听器

### 4.1 基础用法

```js
export default {
  data() {
    return { question: '', answer: '请输入问题' };
  },
  watch: {
    // 简写
    question(newVal, oldVal) {
      this.getAnswer();
    },
    // 深度监听
    user: {
      handler(newVal, oldVal) {
        console.log('用户变化');
      },
      deep: true, // 监听对象内部变化
      immediate: true, // 立即执行一次
    },
  },
  methods: {
    getAnswer() { /* ... */ },
  },
};
```

### 4.2 computed vs watch

| 对比项       | computed          | watch                |
| ------------ | ----------------- | -------------------- |
| **缓存**     | 有                | 无                   |
| **异步**     | 不支持            | 支持                 |
| **返回值**   | 必须返回          | 不必                 |
| **场景**     | 派生状态         | 异步/开销大操作       |

---

## 五、组件注册

### 5.1 全局注册

```js
// main.js
import Vue from 'vue';
import MyComponent from './MyComponent.vue';

Vue.component('MyComponent', MyComponent);
```

### 5.2 局部注册

```vue
<script>
import MyComponent from './MyComponent.vue';

export default {
  components: {
    MyComponent, // 注册后可在 template 中使用
  },
};
</script>
```

### 5.3 组件名规范

- **PascalCase**：`<MyComponent />`（推荐，IDE 友好）
- **kebab-case**：`<my-component />`（DOM 模板必须）

---

## 六、组件通信

### 6.1 父传子：Props

```js
// 子组件
export default {
  props: {
    title: String, // 类型检查
    count: {
      type: Number,
      default: 0, // 默认值
      required: false,
      validator(value) {
        return value >= 0; // 自定义校验
      },
    },
  },
};
```

```vue
<!-- 父组件 -->
<Child title="hello" :count="10" />
```

### 6.2 子传父：$emit

```js
// 子组件
export default {
  methods: {
    onClick() {
      this.$emit('update', { count: 1 });
    },
  },
};
```

```vue
<!-- 父组件 -->
<Child @update="onUpdate" />
```

### 6.3 双向绑定：.sync 修饰符

```vue
<!-- 父组件 -->
<Child :title.sync="pageTitle" />

<!-- 等价于 -->
<Child :title="pageTitle" @update:title="pageTitle = $event" />

<!-- 子组件触发 -->
<script>
export default {
  props: ['title'],
  methods: {
    changeTitle(newTitle) {
      this.$emit('update:title', newTitle);
    },
  },
};
</script>
```

### 6.4 父子直接访问

```js
// 父访问子
this.$refs.childRef.someMethod();

// 子访问父
this.$parent.someMethod();

// 访问根实例
this.$root.someMethod();
```

---

## 七、生命周期实战

### 7.1 各阶段适合做什么

```js
export default {
  data() {
    return { list: [] };
  },
  created() {
    // 数据已初始化，可发请求
    this.fetchList();
  },
  mounted() {
    // DOM 已挂载，可操作 DOM 或初始化三方库
    this.initChart();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    // 清理副作用
    window.removeEventListener('resize', this.onResize);
    this.chart?.dispose();
  },
};
```

### 7.2 父子生命周期顺序

```
创建：
父 beforeCreate → 父 created → 父 beforeMount
→ 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted
→ 父 mounted

更新：
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated

销毁：
父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed
```

---

## 八、过渡与动画

### 8.1 transition 组件

```vue
<template>
  <transition name="fade">
    <p v-if="show">Hello</p>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 8.2 过渡类名

```
fade-enter       → fade-enter-active    → fade-enter-to
                (进入过渡)               (最终状态)

fade-leave-to   ← fade-leave-active   ← fade-leave
                (离开过渡)               (起始状态)
```

### 8.3 列表过渡

```vue
<template>
  <transition-group name="list" tag="ul">
    <li v-for="item in list" :key="item.id">{{ item.text }}</li>
  </transition-group>
</template>
```

---

## 九、学习建议

1. **模板语法**：插值、指令、修饰符要熟练
2. **计算与监听**：理解缓存与异步场景
3. **组件化**：掌握 props/$emit 的标准通信
4. **生命周期**：知道每个阶段能做什么

---

## 参考

- [Vue 2 官方教程](https://v2.cn.vuejs.org/v2/guide/)
- [Vue 2 API](https://v2.cn.vuejs.org/v2/api/)
