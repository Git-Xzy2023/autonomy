---
title: Less 嵌套
---

# Less 嵌套

## 一、嵌套语法

Less 允许按照 HTML 结构嵌套 CSS：

```less
// Less
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
.nav { background: #333; padding: 16px; }
.nav ul { list-style: none; margin: 0; padding: 0; }
.nav li { display: inline-block; margin-right: 20px; }
.nav a { color: white; text-decoration: none; }
```

---

## 二、父选择器 `&`

`&` 代表父选择器：

```less
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
  }

  &.disabled {
    opacity: 0.5;
  }
}
```

### BEM 风格

```less
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

### 反向嵌套

```less
.main {
  .container & {
    // 生成 .container .main
    width: 100%;
  }
}
```

### `&` 的高级用法

```less
// 生成多个选择器
.button {
  & + & { margin-left: 10px; }  // .button + .button
  & ~ & { opacity: 0.5; }       // .button ~ .button
}
```

---

## 三、嵌套的陷阱

### 1. 过度嵌套

```less
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
// 生成 .nav ul li a span { color: red; }
// 选择器层级过深，性能差，特异性高
```

### 2. 规则：嵌套不超过 3 层

```less
// ✅ 推荐
.nav {
  li {
    a {
      // 到此为止
    }
  }
}
```

---

## 四、媒体查询嵌套

Less 允许将媒体查询嵌套在选择器内：

```less
.container {
  width: 100%;

  @media (min-width: 768px) {
    width: 750px;
  }

  @media (min-width: 1024px) {
    width: 970px;
  }
}
```

编译结果：

```css
.container { width: 100%; }
@media (min-width: 768px) {
  .container { width: 750px; }
}
@media (min-width: 1024px) {
  .container { width: 970px; }
}
```

---

## 五、下一步

- 上一章：[变量](/web/styles/less/02-variables/)
- 下一章：[Mixin](/web/styles/less/04-mixin/)
