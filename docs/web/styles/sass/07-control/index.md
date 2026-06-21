---
title: Sass 控制指令
---

# Sass 控制指令

Sass 提供了流程控制指令：`@if` / `@else`、`@for`、`@each`、`@while`，用于动态生成样式。

## 一、`@if` / `@else if` / `@else`

```scss
@mixin button-style($type) {
  @if $type == primary {
    background: blue;
    color: white;
  } @else if $type == danger {
    background: red;
    color: white;
  } @else if $type == warning {
    background: orange;
    color: black;
  } @else {
    background: gray;
    color: white;
  }
}

.btn-primary { @include button-style(primary); }
.btn-danger { @include button-style(danger); }
```

### 单行条件

```scss
$dark-mode: true;

body {
  background: if($dark-mode, #333, #fff);
  color: if($dark-mode, #fff, #333);
}
```

---

## 二、`@for` 循环

### 1. `through`（包含结束值）

```scss
@for $i from 1 through 3 {
  .col-#{$i} {
    width: $i * 33.33%;
  }
}
```

编译结果：

```css
.col-1 { width: 33.33%; }
.col-2 { width: 66.66%; }
.col-3 { width: 99.99%; }
```

### 2. `from`（不包含结束值）

```scss
@for $i from 1 to 3 {
  .item-#{$i} { margin-left: $i * 10px; }
}
```

编译结果：

```css
.item-1 { margin-left: 10px; }
.item-2 { margin-left: 20px; }
```

### 实战：生成栅格系统

```scss
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage(math.div($i, 12));
  }
}
// 生成 .col-1 到 .col-12
```

---

## 三、`@each` 遍历

### 1. 遍历列表

```scss
$colors: red, green, blue, yellow;

@each $color in $colors {
  .text-#{$color} {
    color: $color;
  }
}
```

### 2. 遍历映射

```scss
$theme-colors: (
  primary: #3498db,
  success: #2ecc71,
  warning: #f39c12,
  danger: #e74c3c,
);

@each $name, $color in $theme-colors {
  .btn-#{$name} {
    background: $color;
    color: white;
  }

  .text-#{$name} {
    color: $color;
  }

  .bg-#{$name} {
    background: $color;
  }
}
```

### 3. 遍历多维列表

```scss
$sizes: (
  (small, 12px, 8px),
  (medium, 16px, 12px),
  (large, 20px, 16px),
);

@each $name, $font-size, $padding in $sizes {
  .btn-#{$name} {
    font-size: $font-size;
    padding: $padding;
  }
}
```

### 4. 遍历带索引

```scss
$icons: home, user, settings;

@each $icon in $icons {
  $index: index($icons, $icon);
  .icon-#{$icon} {
    background-position: -#{$index * 20}px 0;
  }
}
```

---

## 四、`@while` 循环

```scss
$i: 1;
@while $i <= 5 {
  .mt-#{$i} { margin-top: $i * 4px; }
  $i: $i + 1;
}
```

编译结果：

```css
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mt-5 { margin-top: 20px; }
```

> ⚠️ `@while` 容易造成死循环，使用时务必确保循环条件最终会变为 false。

---

## 五、综合实战

### 1. 生成间距工具类

```scss
$spacing-unit: 4px;
$spacing-sizes: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12;

@each $size in $spacing-sizes {
  $value: $size * $spacing-unit;

  .m-#{$size}  { margin: $value; }
  .mt-#{$size} { margin-top: $value; }
  .mb-#{$size} { margin-bottom: $value; }
  .ml-#{$size} { margin-left: $value; }
  .mr-#{$size} { margin-right: $value; }
  .mx-#{$size} { margin-left: $value; margin-right: $value; }
  .my-#{$size} { margin-top: $value; margin-bottom: $value; }

  .p-#{$size}  { padding: $value; }
  .pt-#{$size} { padding-top: $value; }
  // ... 其他方向
}
```

### 2. 生成响应式断点

```scss
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
);

@each $name, $size in $breakpoints {
  @media (min-width: $size) {
    @for $i from 1 through 12 {
      .col-#{$name}-#{$i} {
        width: percentage(math.div($i, 12));
      }
    }
  }
}
```

### 3. 生成图标类

```scss
$icons: (
  home: '\e900',
  user: '\e901',
  settings: '\e902',
  search: '\e903',
);

@each $name, $code in $icons {
  .icon-#{$name} {
    font-family: 'iconfont';
    &::before {
      content: $code;
    }
  }
}
```

---

## 六、下一步

- 上一章：[函数与运算](/web/styles/sass/06-functions/)
- 下一章：[模块化与 @use](/web/styles/sass/08-modules/)
