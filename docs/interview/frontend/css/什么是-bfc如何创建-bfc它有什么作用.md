---
title: "什么是 BFC？如何创建 BFC？它有什么作用？"
---

# 什么是 BFC？如何创建 BFC？它有什么作用？

**BFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素的布局不会影响外部元素。**

#### 如何创建 BFC

满足以下任一条件的元素会创建 BFC：

| 方法                         | 示例代码                       | 适用场景   |
| ---------------------------- | ------------------------------ | ---------- |
| 根元素                       | `<html>`                       | 默认创建   |
| 浮动元素                     | `float: left/right`            | 浮动布局   |
| 绝对定位元素                 | `position: absolute/fixed`     | 定位布局   |
| overflow 非 visible          | `overflow: hidden/auto/scroll` | 最常用     |
| display: inline-block        | `display: inline-block`        | 行内块     |
| display: table-cell          | `display: table-cell`          | 表格单元格 |
| display: flex                | `display: flex/inline-flex`    | Flex 容器  |
| display: grid                | `display: grid/inline-grid`    | Grid 容器  |
| contain: layout/paint/strict | `contain: layout`              | 性能优化   |

#### BFC 的特性

1. **内部的块级盒子会在垂直方向一个接一个排列**
2. **盒子垂直方向的距离由 margin 决定**：同一个 BFC 内的相邻盒子 margin 会合并
3. **每个元素的左外边距与包含块的左边界相接触**（从左到右）
4. **BFC 的区域不会与 float 元素重叠**
5. **BFC 是一个独立的容器，内部子元素不会影响外部元素**
6. **计算 BFC 的高度时，浮动元素也会参与计算**

#### BFC 的应用场景

**1. 清除浮动（解决高度塌陷）**

```html
<style>
  .parent {
    overflow: hidden; /* 创建 BFC */
    border: 1px solid red;
  }
  .child {
    float: left;
    width: 100px;
    height: 100px;
    background: blue;
  }
</style>
<div class="parent">
  <div class="child"></div>
</div>
<!-- 父元素高度不会塌陷，红色边框正常显示 -->
```

**2. 阻止 margin 合并**

```html
<style>
  .wrapper {
    overflow: hidden; /* 创建 BFC */
  }
  .box1 {
    margin-bottom: 20px;
  }
  .box2 {
    margin-top: 30px;
  }
</style>
<div class="box1">第一段</div>
<div class="wrapper">
  <div class="box2">第二段</div>
</div>
<!-- 两段之间的间距为 20px + 30px = 50px，不会合并 -->
```

**3. 阻止元素被浮动元素覆盖**

```html
<style>
  .float-box {
    float: left;
    width: 100px;
    height: 100px;
    background: blue;
  }
  .text-box {
    overflow: hidden; /* 创建 BFC，阻止被浮动元素覆盖 */
    height: 200px;
    background: red;
  }
</style>
<div class="float-box"></div>
<div class="text-box">这段文字不会被浮动元素覆盖</div>
```

**4. 自适应两栏布局**

```html
<style>
  .sidebar {
    float: left;
    width: 200px;
    height: 500px;
    background: blue;
  }
  .main {
    overflow: hidden; /* 创建 BFC，自动填充剩余空间 */
    height: 500px;
    background: red;
  }
</style>
<div class="sidebar">侧边栏</div>
<div class="main">主内容区（自适应宽度）</div>
```

> **BFC 的理解技巧**：可以把 BFC 想象成一个"结界"，结界内部的元素不会影响外部，外部也不会影响内部。结界会把浮动元素"包裹"起来，同时保持自己的独立性。

---
