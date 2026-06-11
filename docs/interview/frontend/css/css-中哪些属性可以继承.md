---
title: "CSS 中哪些属性可以继承？"
---

# CSS 中哪些属性可以继承？

**可继承属性（主要与文本相关）：**

| 分类         | 属性                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| **字体相关** | `font-family`, `font-size`, `font-weight`, `font-style`, `font-variant`, `line-height`                               |
| **文本相关** | `color`, `text-align`, `text-indent`, `text-transform`, `letter-spacing`, `word-spacing`, `white-space`, `direction` |
| **列表相关** | `list-style-type`, `list-style-position`, `list-style-image`, `list-style`                                           |
| **表格相关** | `border-collapse`, `border-spacing`, `caption-side`                                                                  |
| **其他**     | `visibility`, `cursor`, `opacity`（部分浏览器）                                                                      |

**不可继承属性（主要与布局和盒模型相关）：**

| 分类       | 属性                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| **盒模型** | `width`, `height`, `margin`, `padding`, `border`                        |
| **定位**   | `position`, `top`, `right`, `bottom`, `left`, `z-index`                 |
| **布局**   | `display`, `float`, `clear`, `overflow`                                 |
| **背景**   | `background`, `background-color`, `background-image`, `background-size` |
| **其他**   | `transform`, `animation`, `transition`                                  |

**强制继承的两种方式：**

```css
/* 方式一：使用 inherit */
.child {
  color: inherit; /* 继承父元素的 color */
  font-size: inherit;
}

/* 方式二：使用 all: inherit */
.child {
  all: inherit; /* 继承所有可继承属性 */
}

/* 方式三：使用 initial（重置为默认值） */
.reset {
  all: initial; /* 重置所有属性为初始值 */
}

/* 方式四：使用 unset（可继承则继承，否则重置） */
.unset {
  all: unset;
}
```

---
