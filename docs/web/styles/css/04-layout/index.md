---
title: 布局
---

# 布局

CSS 布局是前端开发的核心技能之一。本节将详细介绍现代 CSS 布局技术，包括 Flexbox、Grid、定位和浮动。

---

## 一、布局的发展历程

在深入学习现代布局技术之前，了解 CSS 布局的发展历程有助于理解每种技术的适用场景。

| 时代 | 主要技术 | 特点 | 适用场景 |
|------|---------|------|----------|
| 早期 | Table 布局 | 使用表格元素布局 | 复杂的表格数据展示 |
| 中期 | Float + Clear | 浮动布局，需要清除浮动 | 简单的多列布局 |
| 现代 | Flexbox | 一维布局，灵活强大 | 组件内的元素排列、导航栏、卡片布局 |
| 现代 | Grid | 二维布局，精准控制 | 整页布局、复杂网格系统 |

---

## 二、Flexbox（弹性盒子布局）

Flexbox 是一种一维布局模型，擅长在容器中对齐和分配空间。它非常适合用于组件级布局，如导航栏、按钮组、卡片列表等。

### 2.1 Flexbox 的核心概念

Flexbox 由两个核心元素组成：

- **Flex 容器（Flex Container）：设置了 `display: flex` 的父元素
- **Flex 项目（Flex Item）**：容器的直接子元素

```
┌──────────────────────────────────────────────────┐
│  Flex Container                             │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ Item │ │ Item │ │ Item │            │
│  └──────┘ └──────┘ └──────┘            │
│  主轴 (Main Axis) →                      │
└──────────────────────────────────────────────────┘
            ↑
        交叉轴 (Cross Axis)
```

### 2.2 主轴与交叉轴

- **主轴（Main Axis）**：Flex 项目排列的主要方向
  - 默认水平方向（从左到右）
  - 可以通过 `flex-direction` 改变
- **交叉轴（Cross Axis）**：垂直于主轴的方向

### 2.3 Flex 容器属性

#### display：创建 Flex 容器

```css
/* 块级 Flex 容器，占据整行 */
display: flex;

/* 行内 Flex 容器，宽度由内容决定 */
display: inline-flex;
```

#### flex-direction：设置主轴方向

```css
/* 默认值，从左到右 */
flex-direction: row;

/* 从右到左 */
flex-direction: row-reverse;

/* 从上到下 */
flex-direction: column;

/* 从下到上 */
flex-direction: column-reverse;
```

**示例：**

```css
.container {
  display: flex;
  flex-direction: column;
}
```

```html
<div class="container">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>
```

#### flex-wrap：设置项目是否换行

```css
/* 默认值，不换行，项目可能被压缩 */
flex-wrap: nowrap;

/* 换行，第一行在上方 */
flex-wrap: wrap;

/* 换行，第一行在下方 */
flex-wrap: wrap-reverse;
```

**示例：**

```css
.container {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
}
.item {
  width: 100px;
  height: 100px;
}
```

#### flex-flow：flex-direction 和 flex-wrap 的简写

```css
/* 等同于 flex-direction: row; flex-wrap: nowrap; */
flex-flow: row nowrap;

/* 等同于 flex-direction: column; flex-wrap: wrap; */
flex-flow: column wrap;
```

#### justify-content：主轴对齐方式

```css
/* 默认值，从起始位置开始排列 */
justify-content: flex-start;

/* 从结束位置开始排列 */
justify-content: flex-end;

/* 居中排列 */
justify-content: center;

/* 两端对齐，项目之间间隔相等 */
justify-content: space-between;

/* 每个项目两侧间隔相等（项目之间的间隔是项目与边框间隔的两倍） */
justify-content: space-around;

/* 所有间隔相等（项目之间和项目与边框的间隔都相同） */
justify-content: space-evenly;
```

**示例：**

```css
/* 水平居中 */
.container {
  display: flex;
  justify-content: center;
}

/* 两端对齐，常用于导航栏 */
.nav {
  display: flex;
  justify-content: space-between;
}
```

#### align-items：交叉轴对齐方式（单行）

```css
/* 默认值，拉伸以填满容器 */
align-items: stretch;

/* 交叉轴起始位置对齐 */
align-items: flex-start;

/* 交叉轴结束位置对齐 */
align-items: flex-end;

/* 交叉轴居中对齐 */
align-items: center;

/* 基线对齐，按文字的基线对齐 */
align-items: baseline;
```

**示例：**

```css
/* 垂直居中 */
.container {
  display: flex;
  align-items: center;
  height: 200px;
}
```

#### align-content：交叉轴对齐方式（多行）

```css
/* 默认值，拉伸以填满容器 */
align-content: stretch;

/* 交叉轴起始位置对齐 */
align-content: flex-start;

/* 交叉轴结束位置对齐 */
align-content: flex-end;

/* 交叉轴居中对齐 */
align-content: center;

/* 两端对齐 */
align-content: space-between;

/* 每个项目两侧间隔相等 */
align-content: space-around;
```

**注意：** `align-content` 只在有多行时才生效，即 `align-items` 用于单行。

#### gap：设置项目之间的间距

```css
/* 统一设置行间距和列间距 */
gap: 10px;

/* 分别设置行间距和列间距 */
gap: 10px 20px;

/* 也可以使用 row-gap 和 column-gap */
row-gap: 10px;
column-gap: 20px;
```

**示例：**

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
```

### 2.4 Flex 项目属性

#### order：设置项目的排列顺序

```css
/* 默认值为 0，值越小越靠前 */
order: 0;

/* 可以为负值 */
order: -1;

/* 也可以为正值 */
order: 1;
```

**示例：**

```css
.item-1 { order: 3; }
.item-2 { order: 1; } /* 这个项目会排在最前面 */
.item-3 { order: 2; }
```

#### flex-grow：设置项目的放大比例

```css
/* 默认值为 0，不放大 */
flex-grow: 0;

/* 值为 1，表示占据剩余空间 */
flex-grow: 1;

/* 值为 2，表示占据的空间是 flex-grow: 1 的两倍 */
flex-grow: 2;
```

**示例：**

```css
.container {
  display: flex;
  width: 600px;
}
.item-1 { flex-grow: 1; } /* 占据 200px */
.item-2 { flex-grow: 2; } /* 占据 400px */
```

#### flex-shrink：设置项目的缩小比例

```css
/* 默认值为 1，空间不足时会缩小 */
flex-shrink: 1;

/* 值为 0，表示不缩小 */
flex-shrink: 0;

/* 值为 2，表示缩小的比例更大 */
flex-shrink: 2;
```

#### flex-basis：设置项目在主轴上的初始大小

```css
/* 默认值，根据内容决定 */
flex-basis: auto;

/* 固定宽度 */
flex-basis: 200px;

/* 百分比 */
flex-basis: 50%;
```

#### flex：flex-grow、flex-shrink、flex-basis 的简写

```css
/* 默认值 */
flex: 0 1 auto;

/* 三个属性值 */
flex: 1; /* 等同于 flex: 1 1 0%; 占据剩余空间 */

/* 两个属性值 */
flex: 1 0; /* flex-grow: 1; flex-shrink: 0; flex-basis: 0%; */
```

**常用值：

```css
/* 自适应宽度，不缩小 */
flex: 0 0 auto;

/* 占据剩余空间，可以缩小 */
flex: 1 1 auto;
```

#### align-self：覆盖容器的 align-items

```css
/* 默认值，继承容器的 align-items */
align-self: auto;

/* 其他值与 align-items 相同 */
align-self: flex-start;
align-self: flex-end;
align-self: center;
align-self: baseline;
align-self: stretch;
```

**示例：**

```css
.container {
  display: flex;
  align-items: center;
}
.item-2 {
  align-self: flex-start; /* 这个项目会单独对齐到顶部 */
}
```

### 2.5 Flexbox 实战示例

#### 示例 1：水平垂直居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 示例 2：导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-left, .nav-right {
  display: flex;
  gap: 20px;
}
```

```html
<nav class="nav">
  <div class="nav-left">
    <a href="#">首页</a>
    <a href="#">产品</a>
    <a href="#">关于</a>
  </div>
  <div class="nav-right">
    <a href="#">登录</a>
    <a href="#">注册</a>
  </div>
</nav>
```

#### 示例 3：卡片布局

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 300px; /* 最小宽度 300px，可以放大和缩小 */
}
```

#### 示例 4：底部固定

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main {
  flex: 1; /* 占据剩余空间，使底部固定在底部 */
}
```

---

## 三、Grid（网格布局）

Grid 是一种二维布局模型，可以同时控制行和列。它非常适合用于页面级布局和复杂的网格系统。

### 3.1 Grid 的核心概念

- **Grid 容器（Grid Container）**：设置了 `display: grid` 的父元素
- **Grid 项目（Grid Item）**：容器的直接子元素
- **Grid 线（Grid Line）**：分隔网格的线
- **Grid 轨道（Grid Track）**：两条相邻网格线之间的空间（行或列）
- **Grid 单元格（Grid Cell）**：由相邻行和列交叉形成的单元格
- **Grid 区域（Grid Area）**：由任意网格线包围的矩形区域

```
    列线 1   列线 2   列线 3   列线 4
     │        │        │        │
行线 1─┼────────┼────────┼────────┼─
     │  单元格  │  单元格  │  单元格  │
行线 2─┼────────┼────────┼────────┼─
     │  单元格  │  单元格  │  单元格  │
行线 3─┼────────┼────────┼────────┼─
     │  单元格  │  单元格  │  单元格  │
行线 4─┼────────┼────────┼────────┼─
```

### 3.2 Grid 容器属性

#### display：创建 Grid 容器

```css
/* 块级 Grid 容器 */
display: grid;

/* 行内 Grid 容器 */
display: inline-grid;
```

#### grid-template-columns：定义列

```css
/* 三列，每列 100px */
grid-template-columns: 100px 100px 100px;

/* 三列，每列占据相等的剩余空间 */
grid-template-columns: 1fr 1fr 1fr;

/* 使用 repeat() 函数重复 */
grid-template-columns: repeat(3, 1fr);

/* 混合使用 */
grid-template-columns: 100px auto 100px;

/* 使用百分比 */
grid-template-columns: 20% 30% 50%;

/* 使用 minmax() 函数设置最小和最大尺寸 */
grid-template-columns: repeat(3, minmax(100px, 1fr));

/* 自动填充，自动创建列 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* 自动适配，自动创建列并填充 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

**fr 单位详解：**

`fr` 是 Grid 中特有的单位，表示剩余空间的比例。

```css
/* 第一列占据 1 份，第二列占据 2 份，第三列占据 3 份 */
grid-template-columns: 1fr 2fr 3fr;
```

**repeat() 函数详解：**

```css
/* 重复 3 次 1fr */
grid-template-columns: repeat(3, 1fr);

/* 重复多个值 */
grid-template-columns: repeat(2, 100px 200px);
/* 等同于 100px 200px 100px 200px */
```

**minmax() 函数详解：**

```css
/* 最小 100px，最大占据剩余空间 */
grid-template-columns: repeat(3, minmax(100px, 1fr));

/* 最小内容宽度，最大 500px */
grid-template-columns: repeat(3, minmax(min-content, 500px));
```

**auto-fill vs auto-fit：**

```css
/* auto-fill：尽可能多地创建列，即使是空的 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit：自动创建列，并拉伸填充 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

#### grid-template-rows：定义行

```css
/* 两行，每行 100px */
grid-template-rows: 100px 100px;

/* 两行，第一行 1 份，第二行 2 份 */
grid-template-rows: 1fr 2fr;

/* 使用 auto */
grid-template-rows: auto 1fr;
```

#### grid-template-areas：定义网格区域

```css
/* 定义区域名称 */
grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";
```

**示例：**

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}
```

```html
<div class="layout">
  <header style="grid-area: header;">头部</header>
  <aside style="grid-area: sidebar;">侧边栏</aside>
  <main style="grid-area: main;">主内容</main>
  <footer style="grid-area: footer;">底部</footer>
</div>
```

#### gap：设置网格间距

```css
/* 统一设置行间距和列间距 */
gap: 10px;

/* 分别设置行间距和列间距 */
gap: 10px 20px;

/* 也可以使用 row-gap 和 column-gap */
row-gap: 10px;
column-gap: 20px;
```

#### justify-items：设置单元格内项目的水平对齐

```css
/* 默认值，拉伸填满单元格 */
justify-items: stretch;

/* 左对齐 */
justify-items: start;

/* 右对齐 */
justify-items: end;

/* 居中对齐 */
justify-items: center;
```

#### align-items：设置单元格内项目的垂直对齐

```css
/* 默认值，拉伸填满单元格 */
align-items: stretch;

/* 顶部对齐 */
align-items: start;

/* 底部对齐 */
align-items: end;

/* 居中对齐 */
align-items: center;
```

#### place-items：justify-items 和 align-items 的简写

```css
/* 水平垂直都居中 */
place-items: center;

/* 分别设置 */
place-items: start end;
```

#### justify-content：设置整个网格的水平对齐（网格总宽度小于容器时）

```css
/* 默认值，从起始位置开始 */
justify-content: start;

/* 从结束位置开始 */
justify-content: end;

/* 居中 */
justify-content: center;

/* 拉伸填满 */
justify-content: stretch;

/* 两端对齐 */
justify-content: space-between;

/* 每个项目两侧间隔相等 */
justify-content: space-around;

/* 所有间隔相等 */
justify-content: space-evenly;
```

#### align-content：设置整个网格的垂直对齐（网格总高度小于容器时）

```css
/* 值与 justify-content 相同 */
align-content: start;
align-content: end;
align-content: center;
align-content: stretch;
align-content: space-between;
align-content: space-around;
align-content: space-evenly;
```

#### place-content：justify-content 和 align-content 的简写

```css
/* 水平垂直都居中 */
place-content: center;
```

### 3.3 Grid 项目属性

#### grid-column：设置项目的列位置

```css
/* 从第 1 列线到第 3 列线 */
grid-column: 1 / 3;

/* 使用 span 关键字 */
grid-column: span 2; /* 跨越 2 列 */

/* 分别设置起始和结束 */
grid-column-start: 1;
grid-column-end: 3;

/* 使用负数，从右边开始计数 */
grid-column: 1 / -1; /* 从第一列到最后一列 */
```

#### grid-row：设置项目的行位置

```css
/* 从第 1 行线到第 2 行线 */
grid-row: 1 / 2;

/* 使用 span 关键字 */
grid-row: span 1; /* 跨越 1 行 */

/* 分别设置起始和结束 */
grid-row-start: 1;
grid-row-end: 2;
```

#### grid-area：设置项目的区域位置

```css
/* 使用区域名称 */
grid-area: header;

/* 也可以简写为 grid-row-start / grid-column-start / grid-row-end / grid-column-end */
grid-area: 1 / 1 / 2 / 3;
```

#### justify-self：覆盖容器的 justify-items

```css
/* 值与 justify-items 相同 */
justify-self: stretch;
justify-self: start;
justify-self: end;
justify-self: center;
```

#### align-self：覆盖容器的 align-items

```css
/* 值与 align-items 相同 */
align-self: stretch;
align-self: start;
align-self: end;
align-self: center;
```

#### place-self：justify-self 和 align-self 的简写

```css
/* 水平垂直都居中 */
place-self: center;
```

### 3.4 Grid 实战示例

#### 示例 1：圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "left main right"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

```html
<div class="holy-grail">
  <header style="grid-area: header;">头部</header>
  <nav style="grid-area: left;">左侧导航</nav>
  <main style="grid-area: main;">主内容</main>
  <aside style="grid-area: right;">右侧边栏</aside>
  <footer style="grid-area: footer;">底部</footer>
</div>
```

#### 示例 2：响应式图片网格

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

#### 示例 3：仪表盘布局

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
}
.card-wide {
  grid-column: span 2; /* 跨越两列 */
}
.card-tall {
  grid-row: span 2; /* 跨越两行 */
}
```

#### 示例 4：自适应表单布局

```css
.form {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px 20px;
}
.form label {
  text-align: right;
}
.form .full-width {
  grid-column: 1 / -1; /* 跨越所有列 */
}
```

---

## 四、定位（Position）

定位用于将元素放置在页面的特定位置。

### 4.1 position 属性值

```css
/* 默认值，正常文档流 */
position: static;

/* 相对定位，相对于自身原位置偏移 */
position: relative;

/* 绝对定位，相对于最近的已定位祖先元素 */
position: absolute;

/* 固定定位，相对于视口 */
position: fixed;

/* 粘性定位，相对定位和固定定位的混合 */
position: sticky;
```

### 4.2 偏移属性

```css
/* 距离顶部的距离 */
top: 10px;

/* 距离右侧的距离 */
right: 10px;

/* 距离底部的距离 */
bottom: 10px;

/* 距离左侧的距离 */
left: 10px;
```

**注意：** 这些属性只在 `position` 值不为 `static` 时才生效。

### 4.3 z-index：层叠顺序

```css
/* 默认值为 auto，值越大越靠前 */
z-index: 1;

/* 可以为负值 */
z-index: -1;
```

**注意：** `z-index` 只在定位元素上生效（position 值不为 static）。

### 4.4 各种定位详解

#### static（静态定位）

默认值，元素按照正常文档流排列。

```css
.static {
  position: static; /* 默认值，通常不需要显式设置 */
}
```

#### relative（相对定位）

元素按照正常文档流排列，但可以通过 `top`、`right`、`bottom`、`left` 相对于自身原位置偏移。

```css
.relative {
  position: relative;
  top: 20px;
  left: 20px;
}
```

**特点：**
- 元素仍占据原来的空间
- 偏移后，原来的空间仍然保留
- 可作为绝对定位元素的参考容器

#### absolute（绝对定位）

元素脱离正常文档流，相对于最近的已定位祖先元素（position 不为 static 的元素）定位。如果没有已定位的祖先元素，则相对于初始包含块（通常是视口）定位。

```css
.parent {
  position: relative; /* 作为参考容器 */
}
.child {
  position: absolute;
  top: 0;
  right: 0;
}
```

**特点：**
- 脱离文档流，不占据空间
- 相对于已定位的祖先元素定位
- 可以使用 top、right、bottom、left 定位

**示例：在右上角定位一个标签

```css
.badge {
  position: absolute;
  top: -10px;
  right: -10px;
}
```

#### fixed（固定定位）

元素脱离正常文档流，相对于视口定位。即使页面滚动，元素也会固定在视口的固定位置。

```css
.fixed {
  position: fixed;
  top: 0;
  left: 0;
}
```

**特点：**
- 脱离文档流，不占据空间
- 相对于视口定位
- 页面滚动时位置不变

**示例：固定顶部导航栏**

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
```

#### sticky（粘性定位）

元素在跨越特定阈值前为相对定位，之后为固定定位。

```css
.sticky {
  position: sticky;
  top: 0; /* 当滚动到顶部时固定 */
}
```

**特点：**
- 结合了相对定位和固定定位的特性
- 在特定阈值前表现为相对定位
- 超过阈值后表现为固定定位

**示例：粘性标题**

```css
.section-title {
  position: sticky;
  top: 0;
  background: white;
}
```

### 4.5 定位实战示例

#### 示例 1：居中弹窗

```css
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### 示例 2：全屏遮罩

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
```

#### 示例 3：标签徽章

```css
.container {
  position: relative;
}
.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
}
```

---

## 五、浮动（Float）

浮动最初是为了实现文字环绕图片而设计的，后来被用于布局。现在推荐使用 Flexbox 和 Grid，但了解浮动仍然很重要。

### 5.1 float 属性

```css
/* 向左浮动 */
float: left;

/* 向右浮动 */
float: right;

/* 不浮动 */
float: none;
```

### 5.2 浮动的特点

- 元素脱离正常文档流
- 浮动元素会向左或向右移动，直到它的外边缘碰到包含框或另一个浮动元素的外边缘
- 浮动元素会创建一个块级框

### 5.3 clear：清除浮动

```css
/* 清除左侧浮动 */
clear: left;

/* 清除右侧浮动 */
clear: right;

/* 清除两侧浮动 */
clear: both;

/* 不清除浮动 */
clear: none;
```

### 5.4 清除浮动的方法

#### 方法 1：使用 clear 属性

```html
<div style="float: left;">浮动元素</div>
<div style="clear: both;">清除浮动后的元素</div>
```

#### 方法 2：使用伪元素（推荐）

```css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

```html
<div class="clearfix">
  <div style="float: left;">浮动元素</div>
</div>
```

#### 方法 3：使用 overflow

```css
.container {
  overflow: hidden; /* 或 auto */
}
```

### 5.5 浮动实战示例

#### 示例 1：文字环绕图片

```css
img {
  float: left;
  margin-right: 20px;
}
```

```html
<p>
  <img src="image.jpg" alt="图片">
  这里是文字内容，会环绕在图片周围...
</p>
```

#### 示例 2：两列布局

```css
.left {
  float: left;
  width: 200px;
}
.right {
  margin-left: 200px;
}
```

---

## 六、布局技术对比

| 技术 | 维度 | 适用场景 | 优势 | 劣势 |
|------|------|----------|------|------|
| Flexbox | 一维 | 组件级布局、导航栏 | 简单灵活、对齐方便 | 不适合复杂二维布局 |
| Grid | 二维 | 页面级布局、复杂网格 | 强大精准、控制精细 | 学习曲线稍高 |
| Position | - | 特殊位置控制 | 精准定位 | 脱离文档流、需要管理层叠 |
| Float | - | 文字环绕、简单布局 | 兼容性好 | 需要清除浮动、不灵活 |

---

## 七、现代布局最佳实践

1. **优先使用 Flexbox 和 Grid**，它们是现代 CSS 布局的首选
2. **Flexbox 用于组件级布局**，如导航栏、按钮组、卡片列表
3. **Grid 用于页面级布局**，如整页布局、复杂网格系统
4. **定位用于特殊场景**，如弹窗、固定导航、标签徽章
5. **避免使用浮动进行布局**，浮动主要用于文字环绕
6. **结合使用多种布局技术**，根据实际场景选择最合适的技术
