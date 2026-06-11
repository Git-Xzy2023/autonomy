---
title: "什么是 CSS 继承？哪些属性可以继承？"
---

# 什么是 CSS 继承？哪些属性可以继承？

**CSS 继承（Inheritance）是指子元素会继承父元素的某些样式属性。**

**可以继承的属性（主要是文本相关属性）：**

- **字体相关**：`font-family`, `font-size`, `font-weight`, `font-style`, `line-height`
- **文本相关**：`color`, `text-align`, `text-indent`, `letter-spacing`, `word-spacing`, `white-space`
- **列表相关**：`list-style`, `list-style-type`, `list-style-position`, `list-style-image`
- **表格相关**：`border-collapse`, `border-spacing`
- **其他**：`visibility`, `cursor`

**不可以继承的属性（主要是布局和盒模型相关属性）：**

- **盒模型**：`width`, `height`, `margin`, `padding`, `border`
- **定位**：`position`, `top`, `right`, `bottom`, `left`, `z-index`
- **布局**：`display`, `float`, `clear`, `overflow`
- **背景**：`background`, `background-color`, `background-image`
- **其他**：`opacity`, `transform`, `animation`

**强制继承的方法：**

```css
/* 使用 inherit 关键字强制继承 */
.child {
  color: inherit; /* 继承父元素的 color */
  padding: inherit; /* 继承父元素的 padding */
}
```

> **面试时的区分技巧**：如果一个属性与"文字外观"相关，通常可以继承；如果与"盒子大小、位置"相关，通常不能继承。

---
