---
title: 预处理器
---

# CSS 预处理器

CSS 预处理器是一种脚本语言，它扩展了 CSS 的功能，然后将代码编译成标准的 CSS 文件。最流行的预处理器是 Sass/SCSS 和 Less。

---

## 一、为什么使用预处理器

### 1.1 预处理器的优势

| 特性 | 描述 |
|------|------|
| **变量** | 定义可复用的值，如颜色、字体、间距 |
| **嵌套** | 按照 HTML 的结构组织 CSS，更易读 |
| **混合（Mixin）** | 定义可复用的样式块 |
| **函数** | 执行计算和操作的可复用代码 |
| **继承** | 共享样式规则 |
| **模块化** | 将代码分成多个文件，便于维护 |
| **循环和条件** | 编程式的样式生成 |

### 1.2 常见的预处理器

| 预处理器 | 文件扩展名 | 特点 |
|---------|----------|------|
| **Sass** | `.sass` | 缩进语法，简洁但严格 |
| **SCSS** | `.scss` | CSS-like 语法，最流行 |
| **Less** | `.less` | 语法简单，学习曲线低 |
| **Stylus** | `.styl` | 灵活的语法，可选花括号和分号 |

---

## 二、Sass/SCSS 详解

SCSS 是 Sass 的一种语法，它完全兼容标准 CSS，同时添加了强大的功能。

### 2.1 变量（Variables）

```scss
// 定义变量
$primary-color: #3498db;
$secondary-color: #2ecc71;
$font-family: 'Helvetica Neue', Arial, sans-serif;
$font-size: 16px;
$spacing: 20px;
$border-radius: 4px;

// 使用变量
.button {
  background-color: $primary-color;
  color: white;
  font-family: $font-family;
  font-size: $font-size;
  padding: $spacing / 2 $spacing;
  border-radius: $border-radius;
}
```

**编译后的 CSS：**

```css
.button {
  background-color: #3498db;
  color: white;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 4px;
}
```

**变量类型：**

```scss
// 数字
$number: 10;
$length: 10px;
$percentage: 50%;

// 字符串
$string: "hello";
$single-quoted: 'world';
$unquoted: no-quoted;

// 颜色
$color: #ff0000;
$color-name: red;
$color-rgba: rgba(255, 0, 0, 0.5);

// 布尔值
$boolean: true;
$boolean-false: false;

// 空值
$null: null;

// 列表
$list: 1px 2px 3px;
$list-comma: a, b, c;

// 映射（Map）
$colors: (
  primary: #3498db,
  secondary: #2ecc71,
  danger: #e74c3c
);
```

### 2.2 嵌套（Nesting）

```scss
// 基础嵌套
.nav {
  background: #333;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    display: inline-block;
  }
  
  a {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    
    &:hover {
      background: #555;
    }
  }
}
```

**编译后的 CSS：**

```css
.nav {
  background: #333;
}

.nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav li {
  display: inline-block;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
}

.nav a:hover {
  background: #555;
}
```

**使用 & 符号引用父选择器：**

```scss
.button {
  background: blue;
  color: white;
  
  &:hover {
    background: darkblue;
  }
  
  &:active {
    background: navy;
  }
  
  &.disabled {
    background: gray;
    cursor: not-allowed;
  }
  
  &-primary {
    background: #3498db;
  }
  
  &-secondary {
    background: #95a5a6;
  }
}
```

**编译后的 CSS：**

```css
.button {
  background: blue;
  color: white;
}

.button:hover {
  background: darkblue;
}

.button:active {
  background: navy;
}

.button.disabled {
  background: gray;
  cursor: not-allowed;
}

.button-primary {
  background: #3498db;
}

.button-secondary {
  background: #95a5a6;
}
```

**嵌套属性：**

```scss
.box {
  border: {
    top: 1px solid #000;
    right: 2px solid #333;
    bottom: 1px solid #000;
    left: 2px solid #333;
  }
  
  font: {
    family: Arial, sans-serif;
    size: 16px;
    weight: bold;
  }
  
  margin: {
    top: 10px;
    bottom: 20px;
  }
}
```

**编译后的 CSS：**

```css
.box {
  border-top: 1px solid #000;
  border-right: 2px solid #333;
  border-bottom: 1px solid #000;
  border-left: 2px solid #333;
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
}
```

### 2.3 混合（Mixins）

混合允许你定义可复用的样式块。

**基本用法：**

```scss
// 定义 mixin
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  -ms-border-radius: $radius;
  border-radius: $radius;
}

// 使用 mixin
.box {
  @include border-radius(4px);
}

.button {
  @include border-radius(8px);
}
```

**编译后的 CSS：**

```css
.box {
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  border-radius: 4px;
}

.button {
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  border-radius: 8px;
}
```

**带默认值的 mixin：**

```scss
@mixin box-shadow($x: 0, $y: 2px, $blur: 4px, $color: rgba(0, 0, 0, 0.1)) {
  -webkit-box-shadow: $x $y $blur $color;
  -moz-box-shadow: $x $y $blur $color;
  box-shadow: $x $y $blur $color;
}

// 使用默认值
.card {
  @include box-shadow;
}

// 覆盖默认值
.card-hover {
  @include box-shadow(0, 4px, 8px, rgba(0, 0, 0, 0.2));
}
```

**多个参数：**

```scss
@mixin button($background, $color, $padding: 10px 20px) {
  background-color: $background;
  color: $color;
  padding: $padding;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: darken($background, 10%);
  }
}

.button-primary {
  @include button(#3498db, white);
}

.button-secondary {
  @include button(#95a5a6, white);
}

.button-danger {
  @include button(#e74c3c, white, 12px 24px);
}
```

**内容块 mixin（@content）：**

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == phone {
    @media (max-width: 767px) {
      @content;
    }
  }
  @else if $breakpoint == tablet {
    @media (min-width: 768px) and (max-width: 1024px) {
      @content;
    }
  }
  @else if $breakpoint == desktop {
    @media (min-width: 1025px) {
      @content;
    }
  }
}

.container {
  width: 100%;
  padding: 20px;
  
  @include respond-to(tablet) {
    padding: 30px;
  }
  
  @include respond-to(desktop) {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**常用 mixin 示例：**

```scss
// 清除浮动
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

// Flexbox 居中
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 绝对定位
@mixin absolute($top: null, $right: null, $bottom: null, $left: null) {
  position: absolute;
  top: $top;
  right: $right;
  bottom: $bottom;
  left: $left;
}

// 过渡
@mixin transition($properties...) {
  @if length($properties) == 0 {
    transition: all 0.3s ease;
  } @else {
    transition: $properties;
  }
}

// 截断文本
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### 2.4 函数（Functions）

函数允许你定义可复用的计算逻辑。

**内置函数：**

```scss
// 颜色函数
darken(#3498db, 10%);    // 加深 10%
lighten(#3498db, 10%);   // 变浅 10%
rgba(#3498db, 0.5);      // 设置透明度
saturate(#3498db, 20%);  // 增加饱和度
desaturate(#3498db, 20%); // 减少饱和度
grayscale(#3498db);      // 灰度
complement(#3498db);     // 互补色

// 数学函数
round(10.4);    // 10
ceil(10.1);     // 11
floor(10.9);    // 10
abs(-10);       // 10
min(1, 2, 3);   // 1
max(1, 2, 3);   // 3
percentage(0.5); // 50%

// 字符串函数
to-upper-case("hello");  // "HELLO"
to-lower-case("HELLO");  // "hello"
str-length("hello");     // 5
```

**自定义函数：**

```scss
// 计算 rem
@function rem($pixels, $base: 16) {
  @return ($pixels / $base) * 1rem;
}

// 使用
.title {
  font-size: rem(24);  // 1.5rem
  padding: rem(16) rem(24);  // 1rem 1.5rem
}

// 计算百分比
@function percentage($value, $total) {
  @return ($value / $total) * 100%;
}

// 使用
.column-half {
  width: percentage(1, 2);  // 50%
}

// 根据背景色选择文字颜色
@function text-color($bg-color) {
  $lightness: lightness($bg-color);
  @if $lightness < 50% {
    @return white;
  } @else {
    @return black;
  }
}

// 使用
.card {
  background: #3498db;
  color: text-color(#3498db);  // white
}
```

### 2.5 继承（Inheritance）

继承允许你共享样式规则。

```scss
// 定义基础样式
%button-base {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

// 继承基础样式
.button-primary {
  @extend %button-base;
  background: #3498db;
  color: white;
}

.button-secondary {
  @extend %button-base;
  background: #95a5a6;
  color: white;
}

// 也可以继承普通选择器
.message {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid;
}

.error {
  @extend .message;
  background: #fdecea;
  border-color: #e74c3c;
  color: #c0392b;
}

.success {
  @extend .message;
  background: #d4edda;
  border-color: #28a745;
  color: #155724;
}
```

**编译后的 CSS：**

```css
.message, .error, .success {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid;
}

.button-primary, .button-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary {
  background: #3498db;
  color: white;
}

.button-secondary {
  background: #95a5a6;
  color: white;
}

.error {
  background: #fdecea;
  border-color: #e74c3c;
  color: #c0392b;
}

.success {
  background: #d4edda;
  border-color: #28a745;
  color: #155724;
}
```

### 2.6 导入（Partials & Import）

将代码分成多个文件，便于组织和维护。

**文件结构示例：**

```
styles/
├── main.scss          # 主文件
├── _variables.scss    # 变量定义
├── _mixins.scss       # 混合定义
├── _reset.scss        # 重置样式
├── _buttons.scss      # 按钮样式
├── _forms.scss        # 表单样式
└── _layout.scss       # 布局样式
```

**_variables.scss：**

```scss
// 颜色
$primary: #3498db;
$secondary: #2ecc71;
$danger: #e74c3c;
$warning: #f39c12;

// 字体
$font-sans: 'Helvetica Neue', Arial, sans-serif;
$font-mono: 'Courier New', monospace;

// 间距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 40px;

// 断点
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

**_mixins.scss：**

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin border-radius($radius: 4px) {
  border-radius: $radius;
}
```

**main.scss：**

```scss
// 导入其他文件
@import 'variables';
@import 'mixins';
@import 'reset';
@import 'buttons';
@import 'forms';
@import 'layout';

// 主文件的样式
body {
  font-family: $font-sans;
  color: #333;
}
```

**注意：** 文件名以下划线开头表示是 partials，不会被单独编译成 CSS 文件。

### 2.7 列表和映射（Lists & Maps）

**列表：**

```scss
// 定义列表
$colors: red green blue;
$breakpoints: 576px 768px 992px 1200px;

// 访问列表项
nth($colors, 1);    // red
nth($colors, 2);    // green

// 列表长度
length($colors);    // 3

// 遍历列表
@each $color in $colors {
  .text-#{$color} {
    color: $color;
  }
}
```

**映射（Map）：**

```scss
// 定义映射
$theme-colors: (
  primary: #3498db,
  secondary: #2ecc71,
  danger: #e74c3c,
  warning: #f39c12,
  info: #17a2b8
);

// 访问映射值
map-get($theme-colors, primary);   // #3498db
map-get($theme-colors, danger);    // #e74c3c

// 检查键是否存在
map-has-key($theme-colors, primary);  // true

// 获取所有键
map-keys($theme-colors);   // ('primary', 'secondary', 'danger', 'warning', 'info')

// 获取所有值
map-values($theme-colors); // (#3498db, #2ecc71, #e74c3c, #f39c12, #17a2b8)

// 遍历映射
@each $name, $color in $theme-colors {
  .bg-#{$name} {
    background-color: $color;
  }
  
  .text-#{$name} {
    color: $color;
  }
}
```

**编译后的 CSS：**

```css
.bg-primary {
  background-color: #3498db;
}

.text-primary {
  color: #3498db;
}

.bg-secondary {
  background-color: #2ecc71;
}

.text-secondary {
  color: #2ecc71;
}

/* ... 更多 ... */
```

### 2.8 控制指令（Control Directives）

**@if / @else：**

```scss
$theme: dark;

.container {
  @if $theme == dark {
    background: #333;
    color: white;
  } @else if $theme == light {
    background: white;
    color: #333;
  } @else {
    background: #f5f5f5;
    color: #333;
  }
}
```

**@for 循环：**

```scss
// 生成间距类
@for $i from 1 through 5 {
  .mt-#{$i} {
    margin-top: $i * 4px;
  }
}
```

**编译后的 CSS：**

```css
.mt-1 {
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mt-5 {
  margin-top: 20px;
}
```

**@each 循环：**

```scss
// 定义图标列表
$icons: (
  home: "\f015",
  user: "\f007",
  search: "\f002",
  settings: "\f013"
);

// 生成图标类
@each $name, $code in $icons {
  .icon-#{$name}::before {
    content: $code;
    font-family: 'Font Awesome';
  }
}
```

**@while 循环：**

```scss
$i: 1;
@while $i <= 5 {
  .col-#{$i} {
    width: $i * 20%;
  }
  $i: $i + 1;
}
```

### 2.9 插值（Interpolation）

使用 `#{}` 在选择器、属性名和字符串中插入变量。

```scss
$property: color;
$value: blue;
$class: button;

.#{$class} {
  #{$property}: $value;
}

// 编译后
.button {
  color: blue;
}
```

**更多示例：**

```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px
);

@each $name, $value in $breakpoints {
  @media (min-width: $value) {
    .text-#{$name} {
      font-size: 16px;
    }
  }
}
```

---

## 三、Less 详解

Less 是另一个流行的 CSS 预处理器，语法更接近原生 CSS。

### 3.1 变量

```less
// 定义变量
@primary-color: #3498db;
@secondary-color: #2ecc71;
@font-family: 'Helvetica Neue', Arial, sans-serif;
@font-size: 16px;
@spacing: 20px;
@border-radius: 4px;

// 使用变量
.button {
  background-color: @primary-color;
  color: white;
  font-family: @font-family;
  font-size: @font-size;
  padding: @spacing / 2 @spacing;
  border-radius: @border-radius;
}
```

**编译后的 CSS：**

```css
.button {
  background-color: #3498db;
  color: white;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 4px;
}
```

**变量插值：**

```less
@my-selector: banner;

.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}

// 编译后
.banner {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```

### 3.2 嵌套

```less
.nav {
  background: #333;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    display: inline-block;
  }
  
  a {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    
    &:hover {
      background: #555;
    }
  }
}
```

**编译后的 CSS 与 SCSS 相同。**

### 3.3 混合（Mixins）

**基本用法：**

```less
// 定义 mixin
.border-radius(@radius) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  -ms-border-radius: @radius;
  border-radius: @radius;
}

// 使用 mixin
.box {
  .border-radius(4px);
}

.button {
  .border-radius(8px);
}
```

**带默认值的 mixin：**

```less
.box-shadow(@x: 0, @y: 2px, @blur: 4px, @color: rgba(0, 0, 0, 0.1)) {
  -webkit-box-shadow: @x @y @blur @color;
  -moz-box-shadow: @x @y @blur @color;
  box-shadow: @x @y @blur @color;
}

.card {
  .box-shadow;
}

.card-hover {
  .box-shadow(0, 4px, 8px, rgba(0, 0, 0, 0.2));
}
```

**不带括号的 mixin：**

```less
.clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

.container {
  .clearfix;
}
```

**条件 mixin：**

```less
.mixin(@a) when (@a > 10) {
  background-color: black;
}

.mixin(@a) when (@a <= 10) {
  background-color: white;
}

.class1 {
  .mixin(5);   // white
}

.class2 {
  .mixin(15);  // black
}
```

### 3.4 函数

Less 提供了丰富的内置函数。

**颜色函数：**

```less
darken(#3498db, 10%);    // 加深
lighten(#3498db, 10%);   // 变浅
fade(#3498db, 50%);       // 设置透明度
saturate(#3498db, 20%);  // 增加饱和度
desaturate(#3498db, 20%); // 减少饱和度
spin(#3498db, 30);        // 旋转色相
mix(#3498db, #e74c3c, 50%); // 混合颜色
```

**数学函数：**

```less
ceil(2.4);     // 3
floor(2.6);    // 2
round(2.5);    // 3
sqrt(4);       // 2
abs(-5);       // 5
percentage(0.5); // 50%
```

**自定义函数：**

```less
// Less 不支持自定义函数，但可以通过 mixin 模拟

// 使用变量计算
@base: 16px;

.title {
  font-size: @base * 1.5;  // 24px
}
```

### 3.5 导入

```less
// 导入其他文件
@import "variables.less";
@import "mixins.less";
@import "buttons.less";

// 也可以导入 CSS 文件
@import "reset.css";

// 带选项的导入
@import (reference) "framework.less";  // 只使用，不输出
@import (inline) "raw.css";              // 直接插入内容
```

### 3.6 循环

Less 使用 `each` 函数进行循环。

```less
// 定义颜色列表
@colors: red, green, blue, yellow;

// 使用 each 循环
each(@colors, {
  .text-@{value} {
    color: @value;
  }
});

// 使用 range 生成数字序列
each(range(5), {
  .mt-@{index} {
    margin-top: @index * 4px;
  }
});
```

**编译后的 CSS：**

```css
.text-red {
  color: red;
}

.text-green {
  color: green;
}

.text-blue {
  color: blue;
}

.text-yellow {
  color: yellow;
}

.mt-1 {
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mt-5 {
  margin-top: 20px;
}
```

### 3.7 条件语句

Less 使用 `when` 关键字进行条件判断。

```less
@theme: dark;

.container when (@theme = dark) {
  background: #333;
  color: white;
}

.container when (@theme = light) {
  background: white;
  color: #333;
}

// 多个条件
.mixin(@value) when (@value > 0) and (@value < 100) {
  width: @value;
}

.element {
  .mixin(50);
}
```

---

## 四、Sass/SCSS vs Less 对比

| 特性 | Sass/SCSS | Less |
|------|----------|------|
| **语法** | Sass 缩进语法，SCSS CSS-like | CSS-like 语法 |
| **变量** | `$variable` | `@variable` |
| **混合** | `@mixin` / `@include` | 直接调用 `.mixin()` |
| **函数** | `@function` / `@return` | 内置函数，不支持自定义 |
| **循环** | `@for`, `@each`, `@while` | `each()` 函数 |
| **条件** | `@if` / `@else` | `when` 关键字 |
| **继承** | `@extend` | `:extend()` 伪类 |
| **映射** | 原生支持 Map | 需要模拟 |
| **社区** | 更大，更多资源 | 较大 |
| **学习曲线** | 较高 | 较低 |

---

## 五、完整示例项目

### 5.1 SCSS 项目结构

```
scss/
├── abstracts/
│   ├── _variables.scss    # 变量
│   ├── _mixins.scss       # 混合
│   ├── _functions.scss    # 函数
│   └── _placeholders.scss # 占位选择器
├── base/
│   ├── _reset.scss        # 重置样式
│   ├── _typography.scss   # 排版
│   └── _base.scss         # 基础样式
├── components/
│   ├── _buttons.scss      # 按钮
│   ├── _cards.scss        # 卡片
│   ├── _forms.scss        # 表单
│   └── _navigation.scss   # 导航
├── layout/
│   ├── _grid.scss         # 网格
│   ├── _header.scss       # 头部
│   ├── _footer.scss       # 底部
│   └── _sidebar.scss      # 侧边栏
├── pages/
│   ├── _home.scss         # 首页
│   └── _about.scss        # 关于页
└── main.scss              # 主文件
```

### 5.2 main.scss 示例

```scss
// Abstracts
@import 'abstracts/variables';
@import 'abstracts/mixins';
@import 'abstracts/functions';
@import 'abstracts/placeholders';

// Base
@import 'base/reset';
@import 'base/typography';
@import 'base/base';

// Components
@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';
@import 'components/navigation';

// Layout
@import 'layout/grid';
@import 'layout/header';
@import 'layout/footer';
@import 'layout/sidebar';

// Pages
@import 'pages/home';
@import 'pages/about';
```

### 5.3 _variables.scss 示例

```scss
// ============ 颜色 ============
$color-primary: #3498db;
$color-secondary: #2ecc71;
$color-success: #28a745;
$color-info: #17a2b8;
$color-warning: #f39c12;
$color-danger: #e74c3c;

$color-text: #333;
$color-text-light: #666;
$color-bg: #fff;
$color-bg-light: #f5f5f5;
$color-border: #ddd;

// ============ 字体 ============
$font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-mono: 'Courier New', monospace;

$font-size-base: 16px;
$font-size-sm: 14px;
$font-size-lg: 18px;
$font-size-xl: 24px;

// ============ 间距 ============
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 40px;

// ============ 断点 ============
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// ============ 阴影 ============
$box-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
$box-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$box-shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);

// ============ 圆角 ============
$border-radius-sm: 2px;
$border-radius-md: 4px;
$border-radius-lg: 8px;
$border-radius-xl: 16px;
```

### 5.4 _mixins.scss 示例

```scss
// ============ Flexbox ============
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@mixin flex($direction: row, $justify: flex-start, $align: stretch) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

// ============ 响应式 ============
@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: $breakpoint-sm) {
      @content;
    }
  } @else if $breakpoint == md {
    @media (min-width: $breakpoint-md) {
      @content;
    }
  } @else if $breakpoint == lg {
    @media (min-width: $breakpoint-lg) {
      @content;
    }
  } @else if $breakpoint == xl {
    @media (min-width: $breakpoint-xl) {
      @content;
    }
  }
}

// ============ 按钮 ============
@mixin button($bg-color, $text-color: white) {
  display: inline-block;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-color;
  color: $text-color;
  border: none;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-size: $font-size-base;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: darken($bg-color, 10%);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// ============ 截断文本 ============
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// ============ 清除浮动 ============
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}
```

### 5.5 _buttons.scss 示例

```scss
// ============ 基础按钮 ============
.button {
  display: inline-block;
  padding: $spacing-sm $spacing-md;
  border: none;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-size: $font-size-base;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// ============ 按钮变体 ============
.button-primary {
  @include button($color-primary);
}

.button-secondary {
  @include button($color-secondary);
}

.button-success {
  @include button($color-success);
}

.button-warning {
  @include button($color-warning);
}

.button-danger {
  @include button($color-danger);
}

// ============ 按钮尺寸 ============
.button-sm {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-sm;
}

.button-lg {
  padding: $spacing-md $spacing-lg;
  font-size: $font-size-lg;
}

// ============ 禁用状态 ============
.button:disabled,
.button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  
  &:hover {
    transform: none;
  }
}
```

---

## 六、最佳实践

### 6.1 文件组织

1. **使用 partials**：以下划线开头的文件不会被单独编译
2. **模块化**：按功能或组件组织文件
3. **清晰的目录结构**：如 abstracts, base, components, layout, pages

### 6.2 命名规范

1. **变量命名**：使用有意义的名称，如 `$color-primary` 而非 `$blue`
2. **BEM 风格**：结合 BEM 命名选择器
3. **一致性**：保持命名风格一致

### 6.3 使用变量

1. **集中定义**：在一个地方定义所有变量
2. **语义化命名**：不要使用颜色名称作为变量名
3. **避免魔法数字**：将数字定义为变量

### 6.4 使用混合

1. **复用代码**：将重复的样式封装成 mixin
2. **合理的参数**：提供默认值，使 mixin 更灵活
3. **不要过度使用**：mixin 会增加代码量，适度使用

### 6.5 性能考虑

1. **避免深度嵌套**：嵌套过深会增加选择器的特异性
2. **合理使用继承**：继承可以减少重复代码，但可能产生意外结果
3. **编译优化**：使用压缩输出，减少文件大小
4. **避免不必要的计算**：编译时计算会增加编译时间

---

## 七、总结

CSS 预处理器是现代前端开发的重要工具，它们提供了：

1. ✅ **变量**：统一管理颜色、字体、间距等
2. ✅ **嵌套**：更清晰的代码结构
3. ✅ **混合**：可复用的样式块
4. ✅ **函数**：动态计算样式
5. ✅ **模块化**：更好的代码组织
6. ✅ **编程特性**：循环、条件判断等

**选择哪个预处理器？**

- **SCSS**：功能最强大，社区最大，学习资源丰富
- **Less**：语法更简单，学习曲线低，Node.js 生态友好

无论选择哪个，预处理器都会大大提高你的 CSS 开发效率和代码质量。
