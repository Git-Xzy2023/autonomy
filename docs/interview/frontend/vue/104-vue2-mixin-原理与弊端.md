---
title: "Vue2 mixin 原理与弊端（为什么 Vue3 舍弃）"
---

# Vue2 mixin 原理与弊端（为什么 Vue3 舍弃）

## 为什么会有这个功能

Vue2 的组件是 Options API（`data/methods/computed/...` 各自一块），跨组件复用逻辑只能靠 `mixin`。mixin 允许把一组选项抽出来，"混入"到多个组件里，实现逻辑复用（如：通用弹窗逻辑、权限校验、表单校验）。

## 用法

```js
// mixin
const modalMixin = {
  data() {
    return { visible: false };
  },
  methods: {
    open() { this.visible = true; },
    close() { this.visible = false; }
  }
};

// 组件使用
export default {
  mixins: [modalMixin],
  // this.visible / this.open() 都可用
}
```

## 合并策略

Vue2 的 `mergeOptions` 按字段类型有不同的合并策略：

| 选项          | 合并策略                                                     |
| ------------- | ------------------------------------------------------------ |
| data          | 递归合并，组件自身的优先；data 是函数，分别执行后合并返回值 |
| props/methods/computed | 同名时**组件自身覆盖 mixin**                          |
| 生命周期钩子  | 合并成**数组**，mixin 的先执行，组件自身的后执行            |
| watch         | 合并成数组（同一个 key 多个 watcher 都会触发）              |
| components/directives/filters | 同名时组件自身覆盖                              |

```js
// 源码 src/core/util/options.js
strats.data = function(parentVal, childVal, vm) {
  // 合并 data
};
strats.created = strats.beforeMount = ... = function(parentVal, childVal) {
  // 生命周期合并成数组
  return mergeHook(parentVal, childVal);
};
```

## 弊端（为什么 Vue3 舍弃）

**1. 隐式依赖（来源不清晰）**

组件里 `this.fetchList()` 从哪来？是组件自己定义的，还是 mixin A 还是 mixin B 注入的？IDE 跳转困难，新人接手痛苦。

**2. 命名冲突**

多个 mixin 注入同名 data/methods，后者覆盖前者（且无警告），调试时数据被覆盖很难排查。

**3. 数据来源不可追溯**

mixin 内部访问 `this.xxx`，这个 `xxx` 可能来自组件、其他 mixin、全局 API，形成隐式耦合。

**4. 无法清晰传参**

mixin 是静态合并，无法在引入时传参。要参数化只能用"mixin 工厂函数"，但写法丑陋：

```js
export default function createModalMixin(options) {
  return { data() { return { ...options } } };
}
```

**5. 类型推断差**

TypeScript 无法推断 mixin 注入的字段类型，组件里用 `this.xxx` 没有 IDE 提示。

## Vue3 的替代方案：Composition API

Vue3 用 **Composition API + 自定义 Composable 函数** 取代 mixin：

```js
// useModal.js —— 一个普通的函数
import { ref } from 'vue';
export function useModal() {
  const visible = ref(false);
  const open = () => { visible.value = true; };
  const close = () => { visible.value = false; };
  return { visible, open, close };
}

// 组件使用
import { useModal } from './useModal';
export default {
  setup() {
    const { visible, open } = useModal(); // 显式引入，来源清晰
    return { visible, open };
  }
}
```

**优势：**

- 来源清晰：`useModal()` 返回什么就用什么，IDE 能跳转。
- 无命名冲突：可以解构重命名 `const { visible: modalVisible } = useModal()`。
- 可传参：`useModal({ initial: true })`。
- 类型推断好：TS 能推断返回类型。
- Tree-shaking 友好：未引入的 composable 不会打包。
