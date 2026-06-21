---
title: Sass 嵌套与作用域
---

# Sass 嵌套与作用域

## 一、嵌套语法

Sass 允许按照 HTML 结构嵌套 CSS，让代码更清晰：

```scss
// SCSS
.nav {
  background: #333;
  padding: 16px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
    margin-right: 20px;
  }

  a {
    color: white;
    text-decoration: none;
  }
}
```

编译为 CSS：

```css
.nav {
  background: #333;
  padding: 16px;
}
.nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav li {
  display: inline-block;
  margin-right: 20px;
}
.nav a {
  color: white;
  text-decoration: none;
}
```

---

## 二、父选择器 `&`

`&` 代表父选择器，常用于伪类、伪元素、状态修饰：

```scss
.btn {
  background: blue;
  color: white;

  &:hover {
    background: darkblue;
  }

  &:active {
    transform: scale(0.98);
  }

  &::before {
    content: '';
    display: block;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

编译结果：

```css
.btn { background: blue; color: white; }
.btn:hover { background: darkblue; }
.btn:active { transform: scale(0.98); }
.btn::before { content: ''; display: block; }
.btn.disabled { opacity: 0.5; cursor: not-allowed; }
```

### `&` 的高级用法

`&` 也可以用在选择器开头，生成 BEM 风格的类名：

```scss
.card {
  background: white;

  &__title {
    font-size: 20px;
  }

  &__body {
    padding: 16px;
  }

  &--highlighted {
    border: 2px solid yellow;
  }
}
```

编译结果：

```css
.card { background: white; }
.card__title { font-size: 20px; }
.card__body { padding: 16px; }
.card--highlighted { border: 2px solid yellow; }
```

### 反向嵌套（父选择器后缀）

```scss
.main {
  .container & {
    // 生成 .container .main
    width: 100%;
  }
}
```

---

## 三、嵌套属性

某些 CSS 属性有相同的命名空间（如 `font-`、`margin-`、`padding-`），可以简写：

```scss
// 简写
.card {
  font: {
    family: 'Arial', sans-serif;
    size: 14px;
    weight: bold;
  }
  margin: {
    top: 10px;
    bottom: 20px;
  }
  border: {
    width: 1px;
    style: solid;
    color: #ccc;
  }
}
```

等价于：

```scss
.card {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
}
```

---

## 四、嵌套的陷阱

### 1. 过度嵌套导致选择器过长

```scss
// ❌ 反面教材
.nav {
  ul {
    li {
      a {
        span {
          color: red;
        }
      }
    }
  }
}

// 编译结果：.nav ul li a span { color: red; }
// 选择器层级过深，性能差，特异性高，难以覆盖
```

```scss
// ✅ 推荐：扁平化
.nav-link-text {
  color: red;
}
```

### 2. 规则：嵌套不超过 3 层

```scss
// ✅ 推荐：最多 3 层
.nav {
  li {
    a {
      // 到此为止
    }
  }
}
```

---

## 五、占位符选择器与嵌套

```scss
%card-base {
  padding: 16px;
  border-radius: 4px;

  &.highlighted {
    border-color: gold;
  }
}

.card {
  @extend %card-base;
  background: white;
}
```

---

## 六、下一步

- 上一章：[变量与数据类型](/web/styles/sass/02-variables/)
- 下一章：[Mixin 与 Include](/web/styles/sass/04-mixin/)
