---
title: Sass 函数与运算
---

# Sass 函数与运算

## 一、运算

Sass 支持基本的数学运算：

### 1. 算术运算

```scss
$width: 100px;

.container {
  width: $width + 20px; // 加：120px
  width: $width - 20px; // 减：80px
  width: $width * 2; // 乘：200px
  width: $width / 2; // 除：50px
  width: $width % 30; // 取模：10px
}
```

> ⚠️ `/` 在 CSS 中用于分隔（如 `font: 16px/1.5`），Sass 中要明确使用 `math.div()`：

```scss
@use "sass:math";

.container {
  width: math.div(100px, 2); // 50px
}
```

### 2. 比较运算

```scss
@if $width > 100px {
}
@if $width == 100px {
}
@if $width != 100px {
}
@if $width <= 100px {
}
```

### 3. 逻辑运算

```scss
@if $enabled and $visible {
}
@if $enabled or $visible {
}
@if not $disabled {
}
```

### 4. 颜色运算

```scss
$primary: #3498db;

.lighter {
  background: $primary + #111;
} // 变亮
.darker {
  background: $primary - #111;
} // 变暗
```

> 💡 推荐使用颜色函数代替直接运算：`lighten()`、`darken()`、`mix()` 等。

---

## 二、自定义函数

使用 `@function` 定义函数，`@return` 返回值：

```scss
@function rem($px, $base: 16px) {
  @return ($px / $base) * 1rem;
}

.title {
  font-size: rem(24px); // 1.5rem
  padding: rem(16px); // 1rem
}
```

### 复杂函数示例

```scss
// 计算对比色（黑或白）
@function text-contrast($bg) {
  @if lightness($bg) > 50 {
    @return #000;
  } @else {
    @return #fff;
  }
}

.btn-primary {
  background: #3498db;
  color: text-contrast(#3498db); // #000
}

.btn-dark {
  background: #2c3e50;
  color: text-contrast(#2c3e50); // #fff
}
```

### Z-index 管理函数

```scss
$z-indexes: (
  base: 1,
  dropdown: 1000,
  sticky: 1020,
  modal: 1050,
  toast: 1080,
);

@function z($name) {
  @return map-get($z-indexes, $name);
}

.dropdown {
  z-index: z(dropdown);
} // 1000
.modal {
  z-index: z(modal);
} // 1050
```

---

## 三、内置函数

Sass 提供了大量内置函数，按类别整理：

### 1. 颜色函数

```scss
$color: #3498db;

// 调整明度
lighten($color, 20%);   // 变亮
darken($color, 20%);    // 变暗

// 调整饱和度
saturate($color, 20%);  // 增加饱和度
desaturate($color, 20%); // 降低饱和度

// 调整色相
adjust-hue($color, 30deg);

// 调整透明度
rgba($color, 0.5);
opacify($color, 0.3);   // 增加不透明度
transparentize($color, 0.3); // 增加透明度

// 混合颜色
mix(red, blue);         // 紫色

// 获取颜色属性
lightness($color);      // 明度
hue($color);            // 色相
saturation($color);     // 饱和度
alpha($color);          // 透明度
```

### 2. 数字函数

```scss
percentage(0.5);   // 50%
round(2.4);        // 2
ceil(2.1);         // 3
floor(2.9);        // 2
abs(-10);          // 10
min(1, 2, 3);      // 1
max(1, 2, 3);      // 3
random();          // 0-1 随机数
random(100);       // 1-100 随机整数
```

### 3. 字符串函数

```scss
to-upper-case('hello');  // 'HELLO'
to-lower-case('HELLO');  // 'hello'
quote(hello);            // '"hello"'
unquote('"hello"');      // 'hello'
str-length('hello');     // 5
str-insert('world', 'hello ', 1); // 'hello world'
str-index('hello', 'll'); // 3
str-slice('hello', 2, 4); // 'ell'
```

### 4. 列表函数

```scss
$colors: red, green, blue;

length($colors);          // 3
nth($colors, 2);          // green（索引从 1 开始）
set-nth($colors, 2, yellow); // red, yellow, blue
join(red, green);         // red, green
append($colors, yellow);  // red, green, blue, yellow
index($colors, green);    // 2
```

### 5. 映射函数

```scss
$theme: (primary: blue, success: green);

map-get($theme, primary);           // blue
map-keys($theme);                   // primary, success
map-values($theme);                 // blue, green
map-has-key($theme, primary);       // true
map-merge($theme, (warning: yellow)); // 合并
map-remove($theme, primary);        // 删除键
```

### 6. 类型判断函数

```scss
type-of(10px);      // 'number'
type-of('hello');   // 'string'
type-of(red);       // 'color'
type-of((a: b));    // 'map'
type-of(1 2 3);     // 'list'

unit(10px);         // 'px'
unitless(10);       // true
comparable(10px, 5em); // false
```

---

## 四、使用 `sass:math` 模块

现代 Sass 推荐使用模块化的函数：

```scss
@use "sass:math";

.container {
  width: math.div(100%, 3); // 33.33%
  padding: math.max(10px, 20px); // 20px
  margin: math.min(10px, 20px); // 10px
  font-size: math.round(2.4) * 1px; // 2px
}
```

---

## 五、下一步

- 上一章：[继承与占位符](/web/styles/sass/05-extend/)
- 下一章：[控制指令](/web/styles/sass/07-control/)
