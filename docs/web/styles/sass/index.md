---
title: Sass / SCSS 入门
---

# Sass / SCSS 入门

**Sass**（Syntactically Awesome Style Sheets）是最流行的 CSS 预处理器之一，而 **SCSS**（Sassy CSS）是 Sass 的一种语法，完全兼容标准 CSS。

---

## 一、为什么使用 Sass？

Sass 在原生 CSS 基础上提供了以下增强能力：

| 能力 | 说明 |
|------|------|
| **变量** | 统一管理颜色、字体、间距，修改一处即可全局生效 |
| **嵌套** | 按照 HTML 结构组织 CSS，代码更清晰 |
| **混合（Mixin）** | 定义可复用的样式片段 |
| **函数** | 自定义计算逻辑 |
| **继承** | 共享一组声明，减少重复 |
| **模块化** | 将代码拆分成多个文件，按需导入 |
| **流程控制** | 使用 `@if` / `@for` / `@each` 等生成动态样式 |

---

## 二、快速安装

Sass 的编译工具有很多种，推荐使用 **Dart Sass**：

```bash
# 方式一：npm 全局安装
npm install -g sass

# 方式二：项目内安装（推荐）
npm install -D sass

# 单文件编译
sass input.scss output.css

# 监听文件变化
sass --watch input.scss output.css
```

在 Vite / Webpack 等构建工具中，安装 `sass` 后，直接在 JS/TS 中 `import './style.scss'` 即可自动编译。

---

## 三、核心特性速览

### 1. 变量（Variables）

```scss
$primary: #3498db;
$spacing: 16px;

.btn {
  background: $primary;
  padding: $spacing $spacing * 2;
}
```

### 2. 嵌套（Nesting）

```scss
.nav {
  background: #333;

  ul { list-style: none; }
  li { display: inline-block; }

  a {
    color: white;
    &:hover { background: #555; }
  }
}
```

### 3. 混合（Mixins）

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box { @include flex-center; }
```

### 4. 继承（Extend）

```scss
%btn-base {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  @extend %btn-base;
  background: $primary;
  color: white;
}
```

### 5. 循环与条件

```scss
@for $i from 1 through 5 {
  .mt-#{$i} { margin-top: $i * 4px; }
}
```

---

## 四、项目结构建议

```
scss/
├── abstracts/      # 变量、mixin、函数
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/           # 重置、排版
│   ├── _reset.scss
│   └── _typography.scss
├── components/     # 组件样式
│   ├── _buttons.scss
│   └── _cards.scss
├── layout/         # 布局
│   ├── _header.scss
│   └── _grid.scss
└── main.scss       # 主入口
```

在 `main.scss` 中按顺序引入：

```scss
@use 'abstracts/variables';
@use 'abstracts/mixins';
@use 'base/reset';
@use 'components/buttons';
```

> 💡 现代 Sass 推荐使用 `@use` 替代传统的 `@import`，避免全局污染与重复编译。

---

## 五、下一步

- 完整教程：[CSS 预处理器](/web/styles/css/07-preprocessor/)
- 学习如何与 Less 对比
- 在项目中结合 BEM 或 CSS Modules 使用
