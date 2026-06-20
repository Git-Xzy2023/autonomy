---
title: "Vue2 provide/inject 原理与响应式陷阱"
---

# Vue2 provide/inject 原理与响应式陷阱

## 为什么会有这个功能

`props` 是父子组件一层层传递，深层嵌套时（祖父 → 父 → 子 → 孙）需要"prop drilling"，中间组件被迫传递它根本不关心的 prop。`provide/inject` 让祖先组件"提供"数据，任意后代组件直接"注入"使用，跳过中间层。典型场景：主题、i18n、表单上下文。

## 用法

```js
// 祖先组件
export default {
  provide() {
    return {
      theme: this.theme,
      user: this.user
    };
  },
  data() {
    return { theme: 'dark', user: { name: 'Tom' } };
  }
}

// 后代组件（任意层级）
export default {
  inject: ['theme', 'user'],
  // 或对象写法
  inject: {
    theme: { from: 'theme', default: 'light' }
  }
}
```

## 原理

**1. provide 的收集**

组件初始化时，把 `provide` 选项的返回值挂到 `this._provided`。同时合并父组件的 `_provided`（子组件的 provide 覆盖父组件同名 key）：

```js
// 源码 src/core/instance/inject.js
export function initProvide(vm) {
  const provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
  }
}
```

**2. inject 的解析**

组件初始化时，从 `this.$parent._provided` 沿着父链向上查找，直到找到对应 key：

```js
export function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    // 通过 defineReactive 把 inject 的值变成响应式
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key]);
    });
  }
}

function resolveInject(inject, vm) {
  const result = {};
  for (const key in inject) {
    const provideKey = inject[key].from || key;
    let source = vm;
    while (source) {
      if (source._provided && hasOwn(source._provided, provideKey)) {
        result[key] = source._provided[provideKey];
        break;
      }
      source = source.$parent;
    }
  }
  return result;
}
```

## 响应式陷阱（Vue2 的核心问题）

**Vue2 的 provide/inject 默认不是响应式的！**

```js
// 祖先
provide() { return { count: this.count }; }
data() { return { count: 0 }; }
mounted() { this.count++; } // 后代组件不会更新！

// 后代
inject: ['count']
// this.count 永远是初始值 0
```

**原因：** `provide` 在组件初始化时执行一次，返回的是 `this.count` 当时的**值**（基本类型的快照），不是响应式引用。后续 `this.count` 变化，`_provided.count` 不会变。

**Vue2 的 workaround：**

```js
// 1. 传递响应式对象（对象引用）
provide() {
  return { state: this.$data }; // 传整个 data 对象
}
// 后代 inject: ['state']，访问 this.state.count 是响应式的

// 2. 传递函数
provide() {
  return { getCount: () => this.count };
}
// 后代 inject: ['getCount']，模板里用 getCount()

// 3. Vue.observable（2.6+）
const state = Vue.observable({ count: 0 });
provide() { return { state }; }
```

## Vue3 的改进

Vue3 的 `provide/inject` **天然响应式**，因为底层是 Proxy：

```js
import { provide, ref, inject, reactive } from 'vue';

// 祖先
const count = ref(0);
provide('count', count); // 直接传 ref，响应式

// 后代
const count = inject('count'); // 拿到的是 ref，响应式
```

**原理：** Vue3 的 provide 把值（包括 ref/reactive）原样存到组件实例的 `provides` 对象，inject 直接取出来。因为 ref/reactive 本身就是响应式引用，所以天然响应式。
