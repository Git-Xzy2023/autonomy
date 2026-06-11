---
title: "Sass/SCSS 核心特性"
---

# Sass/SCSS 核心特性

#### 1. 变量（Variables）

```scss
// 定义变量
$primary-color: #007bff;
$font-stack: "Helvetica", sans-serif;
$base-padding: 16px;
$border-radius: 4px;

// 使用变量
.button {
  background-color: $primary-color;
  padding: $base-padding;
  border-radius: $border-radius;
}

// 变量插值
$property: color;
.box {
  #{$property}: red;
}
```

#### 2. 嵌套（Nesting）

```scss
.nav {
  background: #333;

  ul {
    list-style: none;
    margin: 0;
  }

  li {
    display: inline-block;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        color: $primary-color;
      }
    }
  }
}

// 编译后：
// .nav { background: #333; }
// .nav ul { list-style: none; margin: 0; }
// .nav li { display: inline-block; }
// .nav li a { color: white; text-decoration: none; }
// .nav li a:hover { color: #007bff; }
```

#### 3. 混合（Mixins）

```scss
// 定义 mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin border-radius($radius: 4px) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

// 使用 mixin
.box {
  @include flex-center;
  @include border-radius(8px);
}

// 带条件的 mixin
@mixin theme($is-dark: false) {
  @if $is-dark {
    background: #333;
    color: #fff;
  } @else {
    background: #fff;
    color: #333;
  }
}

.card-dark {
  @include theme(true);
}
```

#### 4. 函数（Functions）

```scss
// 自定义函数
@function calculate-rem($size, $base: 16) {
  @return $size / $base * 1rem;
}

// 使用函数
.text {
  font-size: calculate-rem(24); // 1.5rem
}

// 内置函数
$color: #007bff;
.lighten-color {
  background: lighten($color, 20%); // 变亮
}
.darken-color {
  background: darken($color, 20%); // 变暗
}
.transparent-color {
  background: rgba($color, 0.5); // 透明度
}
```

#### 5. 继承/占位符（Extend/Placeholder）

```scss
// 定义可复用的样式
%button-base {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

// 继承
.btn-primary {
  @extend %button-base;
  background: $primary-color;
  color: white;
}

.btn-secondary {
  @extend %button-base;
  background: #6c757d;
  color: white;
}
```

#### 6. 模块化（Partials & Import）

```scss
// _variables.scss
$primary: #007bff;
$secondary: #6c757d;

// _buttons.scss
@mixin button($color) {
  background: $color;
  padding: 10px 20px;
}

// main.scss
@import "variables";
@import "buttons";

// 使用
.button {
  @include button($primary);
}

// 推荐使用 @use（新语法）
@use "variables" as *;
@use "buttons" as *;
```

#### 7. 控制指令

```scss
// @if / @else
@mixin text-color($is-dark: false) {
  @if $is-dark {
    color: white;
  } @else {
    color: black;
  }
}

// @for 循环
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage($i / 12);
  }
}

// @each 遍历
$colors: (
  primary: #007bff,
  success: #28a745,
  warning: #ffc107,
  danger: #dc3545,
);

@each $name, $color in $colors {
  .text-#{$name} {
    color: $color;
  }
  .bg-#{$name} {
    background-color: $color;
  }
}

// @while 循环
$i: 1;
@while $i <= 5 {
  .mt-#{$i} {
    margin-top: $i * 4px;
  }
  $i: $i + 1;
}
```

---
