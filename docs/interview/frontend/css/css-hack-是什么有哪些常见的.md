---
title: "CSS Hack 是什么？有哪些常见的？"
---

# CSS Hack 是什么？有哪些常见的？

**CSS Hack 是为了解决不同浏览器的样式差异而使用的特殊 CSS 写法。**

#### 1. 条件注释（IE 专属）

```html
<!--[if IE]>
  <link rel="stylesheet" href="ie-styles.css" />
<![endif]-->

<!--[if IE 8]>
  <style>
    /* 仅 IE8 样式 */
  </style>
<![endif]-->

<!--[if lt IE 9]>
  <style>
    /* IE9 以下版本 */
  </style>
<![endif]-->
```

#### 2. 选择器 Hack

```css
/* IE6 及以下 */
* html .selector {
  color: red;
}

/* IE7 */
*:first-child + html .selector {
  color: red;
}

/* IE8 及以下 */
@media \0screen {
  .selector {
    color: red;
  }
}

/* IE9 及以下 */
:root .selector {
  color: red\9;
}
```

#### 3. 属性 Hack

```css
.box {
  color: red; /* 所有浏览器 */
  color: blue\9; /* IE6-8 */
  *color: green; /* IE6-7 */
  _color: yellow; /* IE6 */
}
```

> **注意**：现代前端开发中，CSS Hack 已不推荐使用，应使用 Autoprefixer、Babel 等工具处理兼容性问题。

---
