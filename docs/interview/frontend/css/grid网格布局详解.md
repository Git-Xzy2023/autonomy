---
title: "Grid（网格布局）详解"
---

# Grid（网格布局）详解

**CSS Grid 是一种二维布局系统，可以同时控制行和列，是目前最强大的 CSS 布局方案。**

#### Grid 的基本概念

- **Grid 容器（Grid Container）**：设置了 `display: grid` 的元素
- **Grid 项目（Grid Items）**：Grid 容器的直接子元素
- **Grid 线（Grid Lines）**：划分网格的线
- **Grid 轨道（Grid Tracks）**：相邻网格线之间的空间（行或列）
- **Grid 单元格（Grid Cell）**：由相邻行列网格线交叉形成的区域
- **Grid 区域（Grid Area）**：由任意网格线围成的矩形区域

```
  列线 1  列线 2  列线 3  列线 4
    │       │       │       │
行线1├───────┼───────┼───────┤
    │ 单元格 │ 单元格 │ 单元格 │
行线2├───────┼───────┼───────┤
    │ 单元格 │ 单元格 │ 单元格 │
行线3└───────┴───────┴───────┘
```

#### Grid 容器的属性

**1. display**

```css
.container {
  display: grid; /* 块级网格容器 */
  display: inline-grid; /* 行内网格容器 */
}
```

**2. grid-template-columns（定义列）**

```css
.container {
  /* 固定宽度的三列 */
  grid-template-columns: 100px 200px 100px;

  /* 百分比宽度 */
  grid-template-columns: 33% 33% 33%;

  /* 使用 fr 单位（fraction，剩余空间的比例） */
  grid-template-columns: 1fr 2fr 1fr; /* 按 1:2:1 分配 */

  /* 混合使用 */
  grid-template-columns: 100px 1fr 200px;

  /* repeat() 函数：重复定义 */
  grid-template-columns: repeat(3, 100px); /* 3 列，每列 100px */
  grid-template-columns: repeat(3, 1fr); /* 3 列等分 */
  grid-template-columns: repeat(2, 100px 1fr); /* 重复 100px 1fr 两次 */

  /* auto-fill / auto-fit 自动填充 */
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

  /* minmax() 函数：最小最大值 */
  grid-template-columns: repeat(3, minmax(100px, 1fr));
}
```

**3. grid-template-rows（定义行）**

```css
.container {
  /* 与 grid-template-columns 语法相同 */
  grid-template-rows: 100px 200px;
  grid-template-rows: repeat(2, 1fr);
}
```

**4. grid-template-areas（定义区域）**

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}
```

**5. gap（网格间距）**

```css
.container {
  gap: 10px; /* 行间距和列间距都是 10px */
  gap: 10px 20px; /* 行间距 10px，列间距 20px */
  row-gap: 10px; /* 行间距 */
  column-gap: 20px; /* 列间距 */
}
```

**6. justify-items（单元格内容水平对齐）**

| 值        | 描述               |
| --------- | ------------------ |
| `start`   | 左对齐             |
| `end`     | 右对齐             |
| `center`  | 居中对齐           |
| `stretch` | 拉伸填满（默认值） |

**7. align-items（单元格内容垂直对齐）**

| 值        | 描述               |
| --------- | ------------------ |
| `start`   | 顶部对齐           |
| `end`     | 底部对齐           |
| `center`  | 居中对齐           |
| `stretch` | 拉伸填满（默认值） |

**8. place-items（justify-items + align-items 简写）**

```css
.container {
  place-items: center; /* 水平垂直都居中 */
  place-items: start end; /* justify-items: start; align-items: end; */
}
```

**9. justify-content（整个内容区域水平对齐）**

| 值              | 描述                 |
| --------------- | -------------------- |
| `start`         | 起点对齐（默认值）   |
| `end`           | 终点对齐             |
| `center`        | 居中对齐             |
| `stretch`       | 拉伸填满             |
| `space-between` | 两端对齐             |
| `space-around`  | 每个轨道两侧间距相等 |
| `space-evenly`  | 所有间距相等         |

**10. align-content（整个内容区域垂直对齐）**

- 与 `justify-content` 相同，但作用于垂直方向

**11. place-content（justify-content + align-content 简写）**

```css
.container {
  place-content: center;
}
```

**12. grid-auto-columns / grid-auto-rows（隐式网格大小）**

```css
.container {
  /* 超出定义的行/列的默认大小 */
  grid-auto-rows: 100px;
  grid-auto-columns: 100px;
}
```

**13. grid-auto-flow（自动排列方式）**

| 值       | 描述                   |
| -------- | ---------------------- |
| `row`    | 按行排列（默认值）     |
| `column` | 按列排列               |
| `dense`  | 紧密排列，尽量填充空隙 |

#### Grid 项目的属性

**1. grid-column-start / grid-column-end（列位置）**

```css
.item {
  grid-column-start: 1; /* 从第 1 条列线开始 */
  grid-column-end: 3; /* 到第 3 条列线结束（跨越 2 列） */

  /* 简写 */
  grid-column: 1 / 3;

  /* 使用 span 关键字 */
  grid-column: span 2; /* 跨越 2 列 */
  grid-column: 1 / span 2; /* 从第 1 条线开始，跨越 2 列 */
}
```

**2. grid-row-start / grid-row-end（行位置）**

```css
.item {
  grid-row-start: 1;
  grid-row-end: 3;

  /* 简写 */
  grid-row: 1 / 3;
  grid-row: span 2;
}
```

**3. grid-area（位置简写）**

```css
.item {
  /* grid-row-start / grid-column-start / grid-row-end / grid-column-end */
  grid-area: 1 / 1 / 3 / 3;

  /* 或使用在 grid-template-areas 中定义的区域名 */
  grid-area: header;
}
```

**4. justify-self（项目自身水平对齐）**

| 值        | 描述           |
| --------- | -------------- |
| `start`   | 左对齐         |
| `end`     | 右对齐         |
| `center`  | 居中           |
| `stretch` | 拉伸（默认值） |

**5. align-self（项目自身垂直对齐）**

- 与 `justify-self` 相同，作用于垂直方向

**6. place-self（justify-self + align-self 简写）**

```css
.item {
  place-self: center;
}
```

#### Grid 布局示例

**1. 经典圣杯布局**

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header header header"
    "left main right"
    "footer footer footer";
  min-height: 100vh;
}
.header {
  grid-area: header;
}
.left {
  grid-area: left;
}
.main {
  grid-area: main;
}
.right {
  grid-area: right;
}
.footer {
  grid-area: footer;
}
```

**2. 响应式卡片网格**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
```

**3. 12 栅格系统**

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
}
.col-6 {
  grid-column: span 6;
}
.col-4 {
  grid-column: span 4;
}
```

**Flexbox vs Grid**

| 特性     | Flexbox               | Grid                      |
| -------- | --------------------- | ------------------------- |
| 维度     | 一维（行或列）        | 二维（行和列）            |
| 适用场景 | 组件内部布局、导航栏  | 页面整体布局、复杂网格    |
| 内容优先 | ✅ 是（内容决定布局） | ❌ 否（布局决定内容位置） |
| 布局优先 | ❌ 否                 | ✅ 是                     |
| 兼容性   | ✅ 非常好             | ✅ 好（现代浏览器）       |

> **使用建议**：
>
> - **组件内部布局** → 使用 Flexbox
> - **页面整体布局** → 使用 Grid
> - 两者可以嵌套使用，Grid 容器内可以使用 Flexbox，反之亦然

---
