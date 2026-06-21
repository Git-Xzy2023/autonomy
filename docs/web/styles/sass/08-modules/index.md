---
title: Sass 模块化与 @use
---

# Sass 模块化与 @use

## 一、`@use` vs `@import`

Sass 有两种导入方式：

| 特性 | `@import`（已废弃） | `@use`（推荐） |
|------|---------------------|----------------|
| 全局污染 | ✅ 所有变量、mixin 全局可用 | ❌ 命名空间隔离 |
| 重复加载 | 可能多次加载 | 只加载一次 |
| 私有成员 | 无法隐藏 | `_` 前缀表示私有 |
| 编译警告 | ⚠️ 会警告 | ✅ 无警告 |

> 💡 现代 Sass 推荐使用 `@use` 替代 `@import`。

---

## 二、`@use` 基础用法

### 1. 默认命名空间

```scss
// _variables.scss
$primary: #3498db;
$spacing: 16px;

// main.scss
@use 'variables';

.btn {
  background: variables.$primary;  // 使用命名空间
  padding: variables.$spacing;
}
```

### 2. 自定义命名空间 `as`

```scss
@use 'variables' as v;

.btn {
  background: v.$primary;
}
```

### 3. 无命名空间 `as *`

```scss
@use 'variables' as *;

.btn {
  background: $primary;  // 直接使用，无命名空间
}
```

> ⚠️ `as *` 会失去命名空间隔离，可能导致命名冲突，谨慎使用。

---

## 三、文件组织结构

推荐的 7-1 模式（7 个文件夹，1 个入口文件）：

```
scss/
├── abstracts/       # 抽象层：变量、函数、mixin
│   ├── _variables.scss
│   ├── _functions.scss
│   ├── _mixins.scss
│   └── _index.scss
├── base/            # 基础层：reset、排版
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _index.scss
├── components/      # 组件层
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _forms.scss
│   └── _index.scss
├── layout/          # 布局层
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _grid.scss
│   └── _index.scss
├── pages/           # 页面层
│   ├── _home.scss
│   ├── _about.scss
│   └── _index.scss
├── themes/          # 主题层
│   ├── _dark.scss
│   └── _index.scss
├── vendors/         # 第三方
│   └── _index.scss
└── main.scss        # 主入口
```

### `main.scss` 入口

```scss
// abstracts
@use 'abstracts';

// base
@use 'base';

// layout
@use 'layout';

// components
@use 'components';

// pages
@use 'pages';

// themes
@use 'themes';
```

### `_index.scss` 聚合文件

每个文件夹创建一个 `_index.scss` 聚合该目录的所有文件：

```scss
// abstracts/_index.scss
@forward 'variables';
@forward 'functions';
@forward 'mixins';
```

---

## 四、`@forward` 转发

`@forward` 用于将一个模块的成员转发到另一个模块，常用于创建聚合文件：

```scss
// _variables.scss
$primary: #3498db;

// _mixins.scss
@mixin flex-center { }

// _index.scss（聚合）
@forward 'variables';
@forward 'mixins';

// 使用
@use 'abstracts' as *;

.btn {
  background: $primary;          // 来自 variables
  @include flex-center;          // 来自 mixins
}
```

### 控制转发

```scss
// 只转发特定成员
@forward 'variables' show $primary, $secondary;

// 隐藏特定成员
@forward 'variables' hide $internal-var;

// 重命名转发
@forward 'variables' as var-*;
// 使用：var-primary
```

---

## 五、私有成员

以 `_` 开头的成员是私有的，不会被 `@use` / `@forward` 导出：

```scss
// _functions.scss
@function _calculate($n) {
  @return $n * 2;
}

@function public-fn($n) {
  @return _calculate($n) + 10;
}

// 使用
@use 'functions';

.box {
  width: functions.public-fn(5); // ✅ 20
  width: functions._calculate(5); // ❌ 报错：私有成员
}
```

---

## 六、配置变量 `!default` + `@use ... with`

允许使用方覆盖模块的默认变量：

```scss
// _theme.scss
$primary: blue !default;
$danger: red !default;

.btn {
  background: $primary;
}
```

```scss
// main.scss
@use 'theme' with (
  $primary: #3498db,
  $danger: #e74c3c
);
```

---

## 七、内置模块

Sass 提供了多个内置模块：

```scss
@use 'sass:math';      // 数学函数
@use 'sass:color';     // 颜色函数
@use 'sass:string';    // 字符串函数
@use 'sass:list';      // 列表函数
@use 'sass:map';       // 映射函数
@use 'sass:meta';      // 元信息函数
@use 'sass:selector';  // 选择器函数
```

### 示例

```scss
@use 'sass:math';
@use 'sass:color';

.container {
  width: math.percentage(1/3);  // 33.33%
  height: math.div(100px, 2);   // 50px
}

.btn {
  background: color.adjust(#3498db, $lightness: 20%);
}
```

---

## 八、下一步

- 上一章：[控制指令](/web/styles/sass/07-control/)
- 下一章：[最佳实践](/web/styles/sass/09-best-practices/)
