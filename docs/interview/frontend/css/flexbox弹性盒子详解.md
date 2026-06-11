---
title: "Flexbox（弹性盒子）详解"
---

# Flexbox（弹性盒子）详解

**Flexbox（Flexible Box，弹性盒子）是 CSS3 中新增的一种布局模式，用于简化复杂布局的实现。**

#### Flexbox 的基本概念

- **Flex 容器（Flex Container）**：设置了 `display: flex` 的元素
- **Flex 项目（Flex Items）**：Flex 容器的直接子元素
- **主轴（Main Axis）**：Flex 项目排列的主要方向
- **交叉轴（Cross Axis）**：与主轴垂直的方向

```
┌─────────────────────────────────────────────────┐
│  主轴（Main Axis）                               │
│  ─────────────────────────────────────────────>  │
│  ┌────────┐ ┌────────┐ ┌────────┐               │
│  │ Item 1 │ │ Item 2 │ │ Item 3 │               │
│  └────────┘ └────────┘ └────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
         ↑ 交叉轴（Cross Axis）
```

#### Flex 容器的属性

**1. display**

```css
.container {
  display: flex; /* 块级弹性容器 */
  display: inline-flex; /* 行内弹性容器 */
}
```

**2. flex-direction（主轴方向）**

| 值               | 描述                         |
| ---------------- | ---------------------------- |
| `row`            | 水平方向，从左到右（默认值） |
| `row-reverse`    | 水平方向，从右到左           |
| `column`         | 垂直方向，从上到下           |
| `column-reverse` | 垂直方向，从下到上           |

**3. justify-content（主轴对齐方式）**

| 值              | 描述                   |
| --------------- | ---------------------- |
| `flex-start`    | 起点对齐（默认值）     |
| `flex-end`      | 终点对齐               |
| `center`        | 居中对齐               |
| `space-between` | 两端对齐，中间间隔相等 |
| `space-around`  | 每个项目两侧间隔相等   |
| `space-evenly`  | 所有间隔完全相等       |

**4. align-items（交叉轴对齐方式）**

| 值           | 描述                   |
| ------------ | ---------------------- |
| `stretch`    | 拉伸填满容器（默认值） |
| `flex-start` | 起点对齐               |
| `flex-end`   | 终点对齐               |
| `center`     | 居中对齐               |
| `baseline`   | 基线对齐               |

**5. flex-wrap（换行方式）**

| 值             | 描述                       |
| -------------- | -------------------------- |
| `nowrap`       | 不换行（默认值），可能溢出 |
| `wrap`         | 换行，新行在下方           |
| `wrap-reverse` | 换行，新行在上方           |

**6. align-content（多行内容的对齐方式）**

| 值              | 描述               |
| --------------- | ------------------ |
| `stretch`       | 拉伸填满（默认值） |
| `flex-start`    | 起点对齐           |
| `flex-end`      | 终点对齐           |
| `center`        | 居中对齐           |
| `space-between` | 两端对齐           |
| `space-around`  | 每行两侧间隔相等   |

**7. gap（项目间的间距）**

```css
.container {
  gap: 10px; /* 行列间距相同 */
  gap: 10px 20px; /* 行间距 10px，列间距 20px */
  row-gap: 10px; /* 行间距 */
  column-gap: 20px; /* 列间距 */
}
```

#### Flex 项目的属性

**1. flex-grow（放大比例）**

```css
.item {
  flex-grow: 1; /* 默认值为 0，表示不放大；值越大，放大越多 */
}
```

**2. flex-shrink（缩小比例）**

```css
.item {
  flex-shrink: 1; /* 默认值为 1，表示可以缩小；0 表示不缩小 */
}
```

**3. flex-basis（初始大小）**

```css
.item {
  flex-basis: 100px; /* 默认值为 auto，表示项目原始大小 */
  flex-basis: 50%; /* 也可以使用百分比 */
}
```

**4. flex（简写属性）**

```css
.item {
  flex: 1; /* 等同于 flex: 1 1 0% */
  flex: 1 1 100px; /* flex-grow flex-shrink flex-basis */
  flex: auto; /* 等同于 flex: 1 1 auto */
  flex: none; /* 等同于 flex: 0 0 auto */
}
```

**5. align-self（单独设置对齐方式）**

```css
.item {
  align-self: auto; /* 默认值，继承父容器的 align-items */
  align-self: flex-start;
  align-self: center;
  /* 其他值与 align-items 相同 */
}
```

**6. order（排列顺序）**

```css
.item1 {
  order: 2;
} /* 数值越小越靠前，默认值为 0 */
.item2 {
  order: 1;
} /* 这个会排在 item1 前面 */
```

#### Flexbox 常见布局示例

**1. 水平垂直居中**

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**2. 两栏布局（固定宽度 + 自适应）**

```css
.container {
  display: flex;
}
.sidebar {
  width: 200px;
  flex-shrink: 0; /* 禁止缩小 */
}
.main {
  flex: 1; /* 自动填充剩余空间 */
}
```

**3. 三栏布局**

```css
.container {
  display: flex;
}
.left,
.right {
  width: 200px;
  flex-shrink: 0;
}
.middle {
  flex: 1;
}
```

**4. 底部导航栏**

```css
.nav {
  display: flex;
}
.nav-item {
  flex: 1; /* 平均分配宽度 */
  text-align: center;
}
```

**5. 等高布局**

```css
.container {
  display: flex;
}
.column {
  /* 自动等高 */
}
```

> **Flexbox 的优势**：Flexbox 的出现使得布局变得简单直观，之前需要使用浮动、定位、表格等复杂方式实现的布局，现在用 Flexbox 几行代码就能搞定。Flexbox 是现代 CSS 布局的首选方案。

---
