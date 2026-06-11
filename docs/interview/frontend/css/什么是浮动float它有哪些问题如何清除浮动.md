---
title: "什么是浮动（float）？它有哪些问题？如何清除浮动？"
---

# 什么是浮动（float）？它有哪些问题？如何清除浮动？

**浮动（float）是一种用于实现元素左右排列的布局方式，浮动元素会脱离正常的文档流。**

#### float 的基本用法

```css
/* 左浮动 */
.float-left {
  float: left;
}

/* 右浮动 */
.float-right {
  float: right;
}

/* 不浮动 */
.no-float {
  float: none;
}
```

**浮动的特点：**

1. **脱离文档流**：浮动元素不再占据正常的文档流位置
2. **文字环绕**：文字会环绕在浮动元素周围
3. **块级元素行内排列**：多个浮动块级元素可以在同一行排列
4. **宽度收缩**：浮动元素如果没有设置宽度，会收缩为内容宽度

#### 浮动带来的问题

**1. 父元素高度塌陷**

```html
<div class="parent" style="border: 1px solid red;">
  <div
    class="child"
    style="float: left; width: 100px; height: 100px; background: blue;"
  ></div>
</div>
<!-- 父元素高度为 0，看不到红色边框 -->
```

**2. 影响后续元素的布局**

```html
<div style="float: left; width: 100px; height: 100px; background: blue;"></div>
<div style="width: 200px; height: 100px; background: red;"></div>
<!-- 第二个 div 会被浮动元素覆盖 -->
```

#### 清除浮动的方法

**方法 1：给父元素添加 overflow（创建 BFC）**

```css
.parent {
  overflow: hidden; /* 或 auto、scroll */
}
```

**方法 2：使用空标签清除浮动**

```html
<div class="parent">
  <div class="child" style="float: left;"></div>
  <div style="clear: both;"></div>
</div>
```

**方法 3：使用 ::after 伪元素（最推荐的方法）**

```css
.clearfix::after {
  content: "";
  display: block; /* 或 table */
  clear: both;
  /* 兼容性写法 */
  height: 0;
  visibility: hidden;
}

/* 现代浏览器简洁写法 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

**方法 4：父元素也浮动**

```css
.parent {
  float: left; /* 但会产生新的浮动问题 */
}
```

**方法 5：使用 flex 或 grid 布局**

```css
.parent {
  display: flex; /* 或 grid */
}
```

**clear 属性的可选值：**

| 值      | 描述                   |
| ------- | ---------------------- |
| `left`  | 清除左侧浮动的影响     |
| `right` | 清除右侧浮动的影响     |
| `both`  | 清除左右两侧浮动的影响 |
| `none`  | 不清除浮动（默认值）   |

> **最佳实践**：在实际开发中，最推荐使用 `::after` 伪元素的方式清除浮动，或者直接使用 Flexbox/Grid 布局替代浮动布局。

---
