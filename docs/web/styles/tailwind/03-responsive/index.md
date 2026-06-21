---
title: Tailwind 响应式与状态
---

# Tailwind 响应式与状态

## 一、响应式断点

Tailwind 默认提供 5 个断点：

| 前缀   | 最小宽度 | 适用         |
| ------ | -------- | ------------ |
| `sm:`  | 640px    | 小屏手机横屏 |
| `md:`  | 768px    | 平板         |
| `lg:`  | 1024px   | 笔记本       |
| `xl:`  | 1280px   | 桌面大屏     |
| `2xl:` | 1536px   | 超宽屏       |

### 移动优先

Tailwind 采用**移动优先**策略：未加前缀的样式默认应用于所有屏幕，加前缀的样式从该断点开始生效。

```html
<!-- 手机端 1 列，平板 2 列，桌面 3 列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>卡片 1</div>
  <div>卡片 2</div>
  <div>卡片 3</div>
</div>
```

### 常见响应式模式

```html
<!-- 响应式导航：手机端垂直，桌面水平 -->
<nav class="flex flex-col md:flex-row md:items-center md:justify-between">
  <div class="logo">Logo</div>
  <ul class="flex flex-col md:flex-row md:space-x-4">
    <li>首页</li>
    <li>关于</li>
    <li>联系</li>
  </ul>
</nav>

<!-- 响应式文字大小 -->
<h1 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
  响应式标题
</h1>

<!-- 响应式间距 -->
<div class="p-4 md:p-6 lg:p-8">
  内容
</div>

<!-- 响应式显示/隐藏 -->
<div class="hidden md:block">桌面端显示</div>
<div class="block md:hidden">手机端显示</div>
```

---

## 二、状态修饰符

### 交互状态

| 修饰符             | 作用                    |
| ------------------ | ----------------------- |
| `hover:`           | 鼠标悬停                |
| `focus:`           | 获得焦点                |
| `focus-within:`    | 子元素获得焦点          |
| `focus-visible:`   | 键盘聚焦（非鼠标点击）  |
| `active:`          | 被点击/激活             |
| `visited:`         | 已访问的链接            |
| `disabled:`        | 禁用状态                |
| `target:`          | URL 锚点目标            |

```html
<button
  class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  提交
</button>

<input
  class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
  placeholder="输入..."
/>
```

### 子元素状态

| 修饰符             | 作用                    |
| ------------------ | ----------------------- |
| `first:`           | 第一个子元素            |
| `last:`            | 最后一个子元素          |
| `only:`            | 唯一子元素              |
| `odd:`             | 奇数子元素              |
| `even:`            | 偶数子元素              |
| `first-of-type:`   | 同类型第一个            |
| `last-of-type:`    | 同类型最后一个          |

```html
<ul>
  <li class="border-b border-gray-200 last:border-0">项目 1</li>
  <li class="border-b border-gray-200 last:border-0">项目 2</li>
  <li class="border-b border-gray-200 last:border-0">项目 3</li>
</ul>

<table>
  <tr class="odd:bg-gray-100 even:bg-white">
    <td>行 1</td>
  </tr>
  <tr class="odd:bg-gray-100 even:bg-white">
    <td>行 2</td>
  </tr>
</table>
```

### 表单状态

| 修饰符         | 作用           |
| -------------- | -------------- |
| `checked:`     | 勾选状态       |
| `required:`    | 必填字段       |
| `valid:`       | 校验通过       |
| `invalid:`     | 校验失败       |
| `in-range:`    | 在范围内       |
| `out-of-range:`| 超出范围       |

```html
<input
  type="email"
  class="border border-gray-300 invalid:border-red-500 valid:border-green-500"
  required
/>
```

---

## 三、暗黑模式

### 配置

在 `tailwind.config.js` 中启用：

```js
module.exports = {
  darkMode: 'class', // 或 'media'
  // ...
};
```

- `class`：通过添加 `.dark` 类切换（推荐）
- `media`：根据系统偏好自动切换

### 使用 `dark:` 前缀

```html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">标题</h1>
  <p class="text-gray-600 dark:text-gray-300">内容</p>
</div>
```

### 切换暗黑模式

```html
<html class="dark">
  <!-- 暗黑模式 -->
</html>
```

```js
// JS 切换
document.documentElement.classList.toggle('dark');
```

### 组合使用

```html
<div class="bg-white dark:bg-gray-900 hover:dark:bg-gray-800">
  支持暗黑模式的悬停效果
</div>
```

---

## 四、组合修饰符

多个修饰符可以组合使用：

```html
<!-- 响应式 + 状态 -->
<button class="bg-blue-500 md:hover:bg-blue-600 lg:focus:bg-blue-700">
  组合修饰符
</button>

<!-- 暗黑模式 + 响应式 -->
<div class="bg-white dark:bg-gray-900 md:dark:bg-gray-800">
  响应式暗黑模式
</div>

<!-- 状态 + 状态 -->
<input class="focus:hover:border-blue-500" />
```

---

## 五、自定义断点

在 `tailwind.config.js` 中自定义：

```js
module.exports = {
  theme: {
    screens: {
      xs: '475px',    // 自定义超小屏
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px', // 自定义超宽屏
    },
  },
};
```

使用：

```html
<div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4">
  ...
</div>
```

---

## 六、`max-*` 斔点

Tailwind 3.2+ 支持最大宽度断点：

```js
module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      screens: {
        'max-sm': { max: '639px' },
        'max-md': { max: '767px' },
        'max-lg': { max: '1023px' },
      },
    },
  },
};
```

使用：

```html
<!-- 只在小屏幕生效 -->
<div class="max-md:hidden">仅小屏可见</div>
```

---

## 七、`@media` 任意值

```html
<!-- 任意媒体查询 -->
<div class="[@media(print)]:hidden">打印时隐藏</div>

<!-- 任意特性查询 -->
<div class="[&:nth-child(3)]:bg-red-500">第三个变红</div>
```

---

## 八、下一步

- 上一章：[工具类速查](/web/styles/tailwind/02-utilities/)
- 下一章：[自定义主题](/web/styles/tailwind/04-theme/)
