---
title: 最佳实践
---

# 最佳实践

## 命名规范

```css
/* BEM */
.block {}
.block__element {}
.block--modifier {}

/* SMACSS */
.layout {}
.module {}
.state {}
.theme {}

/* 语义化命名 */
.header {}
.nav {}
.content {}
.sidebar {}
.footer {}
```

## 性能优化

```css
/* 避免过度使用通配符 */
* { } /* 不推荐 */

/* 避免过度嵌套 */
.container .header .nav .item .link { } /* 不推荐 */

/* 使用 CSS 变量 */
:root {
  --primary-color: #333;
  --font-size: 16px;
}

/* 减少重绘和重排 */
transform: translateZ(0);
will-change: transform;
```

## 可访问性

```css
/* 为键盘用户提供可见的焦点样式 */
:focus {
  outline: 2px solid #0066cc;
}

/* 高对比度 */
body {
  color: #333;
  background-color: #fff;
}
```
