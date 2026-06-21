---
title: Sass Mixin 与 Include
---

# Sass Mixin 与 Include

## 一、什么是 Mixin？

**Mixin（混合）** 是一段可复用的样式代码块，可以接收参数，类似于编程语言中的"函数"。它用于：

- 抽取重复的样式逻辑
- 处理浏览器前缀
- 生成复杂的样式组合

---

## 二、定义与使用

使用 `@mixin` 定义，`@include` 调用：

```scss
// 定义无参 mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 使用
.container {
  @include flex-center;
  height: 100vh;
}
```

编译结果：

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

---

## 三、带参数的 Mixin

### 1. 普通参数

```scss
@mixin button($bg-color, $text-color: white) {
  background: $bg-color;
  color: $text-color;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary { @include button(#3498db); }
.btn-danger { @include button(#e74c3c); }
.btn-warning { @include button(#f39c12, black); } // 覆盖默认值
```

### 2. 关键字参数

```scss
.btn {
  @include button($bg-color: blue, $text-color: white);
}
```

### 3. 可变参数 `...`

当参数数量不确定时，使用 `...`：

```scss
@mixin box-shadow($shadows...) {
  -webkit-box-shadow: $shadows;
  -moz-box-shadow: $shadows;
  box-shadow: $shadows;
}

.card {
  @include box-shadow(0 1px 3px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2));
}
```

### 4. 传递列表给 Mixin

```scss
@mixin padding($values) {
  padding: $values;
}

.box {
  @include padding(10px 20px 30px 40px);
}
```

---

## 四、常用 Mixin 示例

### 1. 浏览器前缀

```scss
@mixin prefix($property, $value) {
  -webkit-#{$property}: $value;
  -moz-#{$property}: $value;
  -ms-#{$property}: $value;
  #{$property}: $value;
}

.box {
  @include prefix(transform, rotate(45deg));
  @include prefix(transition, all 0.3s ease);
}
```

### 2. 响应式断点

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (max-width: 640px) { @content; }
  } @else if $breakpoint == md {
    @media (max-width: 768px) { @content; }
  } @else if $breakpoint == lg {
    @media (max-width: 1024px) { @content; }
  }
}

.container {
  width: 1200px;

  @include respond-to(md) {
    width: 100%;
    padding: 0 16px;
  }

  @include respond-to(sm) {
    padding: 0 8px;
  }
}
```

### 3. 文本截断

```scss
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.title {
  @include text-ellipsis;
}

.description {
  @include text-ellipsis(3);
}
```

### 4. 三角形

```scss
@mixin triangle($direction, $size, $color) {
  width: 0;
  height: 0;
  border: $size solid transparent;

  @if $direction == up {
    border-bottom-color: $color;
  } @else if $direction == down {
    border-top-color: $color;
  } @else if $direction == left {
    border-right-color: $color;
  } @else if $direction == right {
    border-left-color: $color;
  }
}

.arrow-up { @include triangle(up, 10px, red); }
.arrow-right { @include triangle(right, 10px, blue); }
```

---

## 五、`@content` 传递内容块

`@content` 允许在使用 `@include` 时传入额外的样式块：

```scss
@mixin breakpoint($size) {
  @media (min-width: $size) {
    @content;
  }
}

.container {
  display: block;

  @include breakpoint(768px) {
    display: flex;
    flex-direction: row;
  }

  @include breakpoint(1024px) {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 六、Mixin vs 函数

| 特性 | Mixin | 函数 |
|------|-------|------|
| 定义 | `@mixin` | `@function` |
| 调用 | `@include` | 直接调用 `function-name()` |
| 返回值 | 输出样式 | 返回值 |
| 用途 | 生成样式块 | 计算并返回值 |

```scss
// Mixin：生成样式
@mixin center { display: flex; justify-content: center; align-items: center; }

// 函数：返回值
@function rem($px) {
  @return $px / 16px * 1rem;
}
```

---

## 七、下一步

- 上一章：[嵌套与作用域](/web/styles/sass/03-nesting/)
- 下一章：[继承与占位符](/web/styles/sass/05-extend/)
