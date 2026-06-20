---
title: "Vue2 过滤器原理（为什么 Vue3 移除）"
---

# Vue2 过滤器原理（为什么 Vue3 移除）

## 为什么会有这个功能

模板里经常需要做简单的文本格式化：金额加千分位、日期格式化、状态码转文案。Vue2 提供 `filter` 让这种"纯展示转换"以管道语法 `{{ value | filterName }}` 表达，类似 Shell 管道。

## 用法

```js
// 全局过滤器
Vue.filter('currency', function(val) {
  return '¥' + val.toFixed(2);
});

// 局部过滤器
export default {
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString();
    }
  }
}

// 模板使用
<p>{{ price | currency }}</p>
<p>{{ time | date('YYYY-MM-DD') }}</p>
<p>{{ price | currency | uppercase }}</p> <!-- 链式调用 -->
```

## 原理

**编译阶段：**

`{{ value | filterName }}` 被编译成 `_f('filterName')(value)` 调用：

```js
// 源码 src/compiler/codegen/index.js
genFilterSegments -> genFilter -> `_f("${filterName}")(${value})`
```

`_f` 是 `resolveFilter` 的别名，从组件的 `filters` 和全局 `Vue.options.filters` 中查找过滤器函数。

**运行时：**

```js
// src/core/instance/render-helpers/resolve-filter.js
export function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}
```

链式 `a | b | c` 编译成 `_f('c')(_f('b')(_f('a')(a_val)))`，从右到左嵌套调用。

## 弊端（为什么 Vue3 移除）

**1. 与方法调用语义重复**

`{{ price | currency }}` 完全等价于 `{{ currency(price) }}` 或 `{{ formatCurrency(price) }}`，过滤器只是语法糖，没有提供新能力。

**2. 只能在模板里用**

过滤器无法在 JS 逻辑里调用（比如 `methods` 里要格式化还得再写一份），导致逻辑割裂。

**3. 参数传递不直观**

`{{ time | date('YYYY-MM-DD') }}` 的写法看起来像函数调用，但实际是 `date(time, 'YYYY-MM-DD')`，参数顺序反直觉。

**4. 类型推断差**

过滤器是字符串查找（`_f('currency')`），TypeScript 无法推断返回类型，模板里没有类型提示。

**5. 增加编译器复杂度**

`|` 既要处理位运算又要处理过滤器，编译器需要额外区分。

## Vue3 的替代方案

Vue3 移除 `filter`，推荐用以下方式：

```js
// 1. 普通函数（最推荐）
import { formatCurrency } from './utils';
// 模板：{{ formatCurrency(price) }}

// 2. 计算属性
computed: {
  formattedPrice() { return formatCurrency(this.price); }
}

// 3. 全局属性（替代全局过滤器）
app.config.globalProperties.$filters = {
  currency(val) { return '¥' + val.toFixed(2); }
};
// 模板：{{ $filters.currency(price) }}
```

**优势：** 函数可在 JS 和模板中复用；TS 类型推断完整；无特殊语法，学习成本低。
