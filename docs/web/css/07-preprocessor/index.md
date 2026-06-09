---
title: 预处理器
---

# 预处理器

## Sass/SCSS

```scss
// 变量
$primary-color: #333;
$font-family: Arial, sans-serif;

// 嵌套
.container {
  .title {
    font-size: 24px;
  }
}

// 混合
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 继承
%clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

// 运算
$width: 100px;
.container {
  width: $width * 2;
}
```

## Less

```less
// 变量
@primary-color: #333;
@font-family: Arial, sans-serif;

// 嵌套
.container {
  .title {
    font-size: 24px;
  }
}

// 混合
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 运算
@width: 100px;
.container {
  width: @width * 2;
}
```
