---
title: Sass 变量与数据类型
---

# Sass 变量与数据类型

## 一、变量声明与使用

Sass 使用 `$` 符号声明变量：

```scss
// 变量声明
$primary-color: #3498db;
$spacing: 16px;
$font-stack: 'Helvetica', 'Arial', sans-serif;

// 变量使用
body {
  font-family: $font-stack;
  color: $primary-color;
  padding: $spacing;
}
```

### 变量作用域

变量有**局部作用域**和**全局作用域**：

```scss
$global-var: red;

.container {
  $local-var: blue; // 局部变量
  color: $local-var; // ✅ blue
}

.other {
  color: $local-var; // ❌ 报错：未定义
}
```

使用 `!global` 将局部变量提升为全局（Sass 3.4+）：

```scss
.container {
  $local-var: blue !global;
}

.other {
  color: $local-var; // ✅ blue
}
```

> ⚠️ 现代 Sass 推荐使用 `@use` 模块化方式管理变量，而不是依赖 `!global`。

### 默认值 `!default`

如果变量已经被赋值，则不再赋值；如果未赋值或为 `null`，则赋值。常用于配置文件：

```scss
// _variables.scss
$primary: #3498db !default;
$font-size: 16px !default;

// 业务代码
$primary: #e74c3c; // 覆盖默认值
@use 'variables';

.btn {
  background: $primary; // #e74c3c
}
```

---

## 二、数据类型

Sass 支持 7 种数据类型：

### 1. 数字（Number）

```scss
$width: 100px;
$line-height: 1.5; // 无单位
$margin: 2em;
$zero: 0;

// 运算
$total: $width + 20px; // 120px
$half: $width / 2; // 50px
```

### 2. 字符串（String）

```scss
$font: 'Helvetica', sans-serif;
$name: "my-class";
$url: url("image.png");

// 插值
$prefix: "btn";
.#{$prefix}-primary { } // .btn-primary
```

### 3. 颜色（Color）

```scss
$primary: #3498db;
$success: rgb(46, 204, 113);
$warning: hsl(40, 100%, 50%);

// 颜色函数
$dark-primary: darken($primary, 10%);
$light-primary: lighten($primary, 20%);
$transparent: rgba($primary, 0.5);
```

### 4. 布尔值（Boolean）

```scss
$enabled: true;
$disabled: false;

@if $enabled {
  .btn { display: block; }
}
```

### 5. 空值（Null）

```scss
$value: null;

@if $value == null {
  // 不输出任何样式
}
```

### 6. 列表（List）

类似 JS 的数组：

```scss
$padding: 10px 20px;
$margin: 1px 2px 3px 4px;
$colors: red, green, blue;

// 访问
$first: nth($colors, 1); // red（索引从 1 开始）
$length: length($colors); // 3

// 追加
$new-colors: append($colors, yellow);
```

### 7. 映射（Map）

类似 JS 的对象：

```scss
$theme: (
  primary: #3498db,
  success: #2ecc71,
  warning: #f39c12,
  danger: #e74c3c,
);

// 访问
$primary: map-get($theme, primary); // #3498db

// 遍历
@each $name, $color in $theme {
  .text-#{$name} {
    color: $color;
  }
}
```

---

## 三、插值 `#{}`

插值允许在任何位置使用变量：

```scss
$name: "btn";
$size: 5;

.#{$name} {
  width: #{$size * 10}px;
}

// 属性名插值
$property: margin;
.box {
  #{$property}-top: 10px;
  #{$property}-bottom: 20px;
}
```

---

## 四、变量使用建议

### 1. 命名规范

```scss
// ✅ 推荐：语义化命名
$color-primary: #3498db;
$color-success: #2ecc71;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// ❌ 避免：无意义命名
$c1: #3498db;
$s1: 8px;
```

### 2. 分层管理

```
scss/
├── abstracts/
│   ├── _variables.scss    // 全局变量
│   ├── _variables-theme.scss // 主题变量
│   └── _variables-spacing.scss // 间距变量
```

### 3. 使用 Map 组织相关变量

```scss
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
);

$z-index: (
  dropdown: 1000,
  sticky: 1020,
  modal: 1050,
  toast: 1080,
);
```

---

## 五、下一步

- 上一章：[Sass 入门与安装](/web/styles/sass/01-intro/)
- 下一章：[嵌套与作用域](/web/styles/sass/03-nesting/)
