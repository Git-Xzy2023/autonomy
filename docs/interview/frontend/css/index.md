---
title: CSS面试题
---

# CSS面试题

## 一、CSS基础

### CSS 的引入方式有哪些？它们的优先级如何？

**CSS 的四种引入方式：**

1. **内联样式（Inline Style）**：写在 HTML 标签的 `style` 属性中

```html
<p style="color: red; font-size: 14px;">这是一段红色的文字</p>
```

2. **内部样式表（Internal Style Sheet）**：写在 `<style>` 标签中，放在 `<head>` 内

```html
<head>
  <style>
    p {
      color: blue;
      font-size: 16px;
    }
  </style>
</head>
```

3. **外部样式表（External Style Sheet）**：通过 `<link>` 标签引入外部 `.css` 文件

```html
<head>
  <link rel="stylesheet" href="style.css" />
</head>
```

4. **导入样式（@import）**：在 CSS 文件或 `<style>` 标签中使用 `@import` 导入

```css
@import url("style.css");
```

**优先级（从高到低）：**

- 内联样式 > 内部样式表 > 外部样式表 > 导入样式

> **注意**：如果后面的样式覆盖前面的，还与书写顺序有关，后面的会覆盖前面的。另外，`!important` 声明会打破正常的优先级规则，拥有最高优先级。

---

### 什么是 CSS 选择器？有哪些常见的选择器？

**CSS 选择器是一种模式，用于选择需要添加样式的 HTML 元素。**

**常见的 CSS 选择器分类：**

#### 1. 基础选择器

| 选择器       | 示例                | 描述                                |
| ------------ | ------------------- | ----------------------------------- |
| 元素选择器   | `p { }`             | 选择所有 `<p>` 元素                 |
| ID 选择器    | `#header { }`       | 选择 `id="header"` 的元素           |
| 类选择器     | `.container { }`    | 选择所有 `class="container"` 的元素 |
| 通配符选择器 | `* { }`             | 选择所有元素                        |
| 属性选择器   | `[type="text"] { }` | 选择 `type="text"` 的元素           |

#### 2. 组合选择器

| 选择器         | 示例             | 描述                                           |
| -------------- | ---------------- | ---------------------------------------------- |
| 后代选择器     | `div p { }`      | 选择 `<div>` 内部的所有 `<p>` 元素（所有层级） |
| 子选择器       | `div > p { }`    | 选择 `<div>` 的直接子元素 `<p>`                |
| 相邻兄弟选择器 | `div + p { }`    | 选择紧接在 `<div>` 之后的 `<p>` 元素           |
| 通用兄弟选择器 | `div ~ p { }`    | 选择 `<div>` 之后的所有同级 `<p>` 元素         |
| 并集选择器     | `h1, h2, h3 { }` | 同时选择多个元素                               |

#### 3. 伪类选择器

| 选择器            | 示例                   | 描述                       |
| ----------------- | ---------------------- | -------------------------- |
| `:hover`          | `a:hover { }`          | 鼠标悬停时的状态           |
| `:active`         | `button:active { }`    | 元素被激活时的状态         |
| `:focus`          | `input:focus { }`      | 元素获得焦点时的状态       |
| `:visited`        | `a:visited { }`        | 已访问过的链接             |
| `:first-child`    | `li:first-child { }`   | 选择父元素的第一个子元素   |
| `:last-child`     | `li:last-child { }`    | 选择父元素的最后一个子元素 |
| `:nth-child(n)`   | `li:nth-child(2) { }`  | 选择父元素的第 n 个子元素  |
| `:nth-of-type(n)` | `p:nth-of-type(2) { }` | 选择同类型中的第 n 个元素  |
| `:not(selector)`  | `:not(.active) { }`    | 选择不匹配选择器的元素     |
| `:empty`          | `div:empty { }`        | 选择没有子元素的元素       |

#### 4. 伪元素选择器

| 选择器           | 示例                  | 描述                   |
| ---------------- | --------------------- | ---------------------- |
| `::before`       | `p::before { }`       | 在元素内容之前插入内容 |
| `::after`        | `p::after { }`        | 在元素内容之后插入内容 |
| `::first-letter` | `p::first-letter { }` | 选择元素的第一个字母   |
| `::first-line`   | `p::first-line { }`   | 选择元素的第一行       |
| `::selection`    | `::selection { }`     | 选择用户选中的部分     |

---

### CSS 选择器的优先级是怎样的？

**CSS 选择器的优先级可以用一个四位数来表示（从左到右，权重依次降低）：**

- **第一级**：内联样式（1, 0, 0, 0）—— `style="..."`
- **第二级**：ID 选择器（0, 1, 0, 0）—— `#id`
- **第三级**：类选择器、属性选择器、伪类（0, 0, 1, 0）—— `.class`, `[attr]`, `:hover`
- **第四级**：元素选择器、伪元素（0, 0, 0, 1）—— `div`, `::before`
- **通配符、子选择器、相邻选择器等**：（0, 0, 0, 0）—— `*`, `>`, `+`

**计算规则：**

1. 从左到右比较，哪一位数字大，优先级就高
2. 如果数字相同，则比较下一位
3. 优先级相同的情况下，后面写的样式会覆盖前面的

**优先级计算示例：**

```css
/* 优先级：0, 1, 0, 1 */
#header p {
  color: red;
}

/* 优先级：0, 0, 2, 1 */
.container .box p {
  color: blue;
}

/* 0,1,0,1 > 0,0,2,1，所以最终颜色是 red */
```

**常见选择器优先级排序（从高到低）：**

```
!important > 内联样式 > ID 选择器 > 类/属性/伪类 > 元素/伪元素 > 通配符
```

> **小技巧**：可以把优先级想象成数字，ID 是 100，类是 10，元素是 1，然后累加比较。但这只是一个便于理解的简化，实际上 CSS 是按位比较的。

---

### 什么是 CSS 继承？哪些属性可以继承？

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

### 什么是层叠上下文？层叠顺序是怎样的？

**层叠上下文（Stacking Context）是 HTML 元素在三维空间（Z 轴）上的排列规则。**

当元素满足以下任一条件时，会创建一个新的层叠上下文：

1. 根元素（`<html>`）
2. `position` 为 `relative/absolute` 且 `z-index` 不为 `auto`
3. `position` 为 `fixed/sticky`
4. `flex` 容器的子项，且 `z-index` 不为 `auto`
5. `grid` 容器的子项，且 `z-index` 不为 `auto`
6. `opacity` 值小于 1
7. `transform`, `filter`, `perspective`, `clip-path`, `mask` 等属性不为 `none`
8. `will-change` 指定了任意属性
9. `contain` 属性值包含 `layout`, `paint`, 或 `strict` 等

**层叠顺序（Stacking Order）：** 在同一个层叠上下文中，元素按照以下顺序从下到上排列（后面的会覆盖前面的）：

1. 形成层叠上下文的元素的背景和边框
2. 负 `z-index` 值的子元素（数值越小越靠下）
3. 常规流（非定位）的块级元素（按 HTML 顺序）
4. 常规流（非定位）的浮动元素（按 HTML 顺序）
5. 常规流（非定位）的行内元素（按 HTML 顺序）
6. `z-index: auto` 或 `z-index: 0` 的定位元素（按 HTML 顺序）
7. 正 `z-index` 值的子元素（数值越大越靠上）

**层叠顺序可视化示例：**

```
┌─────────────────────────────────────┐
│  正 z-index（越大约靠上）            │ ← 最上层
├─────────────────────────────────────┤
│  z-index: 0 / auto 的定位元素       │
├─────────────────────────────────────┤
│  行内元素                            │
├─────────────────────────────────────┤
│  浮动元素                            │
├─────────────────────────────────────┤
│  块级元素                            │
├─────────────────────────────────────┤
│  负 z-index（越小越靠下）            │
├─────────────────────────────────────┤
│  背景和边框                          │ ← 最底层
└─────────────────────────────────────┘
```

> **关键点**：层叠上下文是嵌套的，子层叠上下文的所有元素都被限制在父层叠上下文内。也就是说，父元素的 `z-index` 决定了整个子元素组的层级，子元素内部无论 `z-index` 多大，都无法越过父元素的层级限制。

---

## 二、盒模型

### 什么是 CSS 盒模型？标准盒模型和 IE 盒模型有什么区别？

**CSS 盒模型（Box Model）描述了 HTML 元素在页面中所占空间的计算方式。**

每个 HTML 元素都可以看作一个盒子，盒子由以下四个部分组成（从内到外）：

1. **content（内容）**：盒子的核心区域，显示文本或图像
2. **padding（内边距）**：内容周围的空白区域，会影响盒子大小
3. **border（边框）**：围绕内边距和内容的边界
4. **margin（外边距）**：盒子与其他盒子之间的间距，不会影响盒子大小

**盒模型示意图：**

```
┌─────────────────────────────────┐
│          margin（外边距）         │
│  ┌───────────────────────────┐  │
│  │      border（边框）        │  │
│  │  ┌─────────────────────┐  │  │
│  │  │   padding（内边距）  │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │   content     │  │  │  │
│  │  │  │   （内容）    │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**标准盒模型（W3C 盒模型 / content-box）：**

- 盒子的 **width** 和 **height** 只包含 **content** 部分
- 元素实际宽度 = width + padding + border
- 元素实际高度 = height + padding + border

```css
.box {
  box-sizing: content-box; /* 默认值 */
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid red;
  /* 实际占用宽度：200 + 20*2 + 5*2 = 250px */
  /* 实际占用高度：100 + 20*2 + 5*2 = 150px */
}
```

**IE 盒模型（怪异盒模型 / border-box）：**

- 盒子的 **width** 和 **height** 包含 **content + padding + border**
- 元素实际宽度 = width（padding 和 border 包含在内）
- 元素实际高度 = height（padding 和 border 包含在内）

```css
.box {
  box-sizing: border-box;
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid red;
  /* 实际占用宽度：200px（padding 和 border 向内挤压） */
  /* 实际占用高度：100px */
  /* content 实际大小：width = 200 - 40 - 10 = 150px */
}
```

**两种盒模型的对比：**

| 特性              | 标准盒模型（content-box） | IE 盒模型（border-box）            |
| ----------------- | ------------------------- | ---------------------------------- |
| 计算公式          | width = content width     | width = content + padding + border |
| 加 padding/border | 盒子会变大                | 盒子大小不变，内容变小             |
| 便于控制          | 控制内容大小方便          | 控制盒子总大小方便                 |
| 使用场景          | 传统布局                  | 现代布局（更直观）                 |

> **实际开发建议**：通常会使用全局重置，将所有元素设为 `border-box`，这样更符合直觉：
>
> ```css
> *,
> *::before,
> *::after {
>   box-sizing: border-box;
> }
> ```

---

### 什么是 margin 合并（塌陷）？如何解决？

**margin 合并（Margin Collapsing）是指当两个或多个垂直方向的 margin 相遇时，它们会合并成一个 margin，而不是简单相加。**

**margin 合并的三种情况：**

#### 1. 相邻兄弟元素的 margin 合并

```html
<p style="margin-bottom: 20px;">第一段文字</p>
<p style="margin-top: 30px;">第二段文字</p>
<!-- 两个 <p> 之间的间距不是 50px，而是 30px（取较大值） -->
```

#### 2. 父元素和第一个/最后一个子元素的 margin 合并

```html
<div style="margin-top: 20px;">
  <p style="margin-top: 30px;">子元素</p>
</div>
<!-- 父元素和子元素的 margin-top 合并，最终取 30px -->
```

#### 3. 空块级元素的 margin 合并

```html
<div style="margin-top: 20px; margin-bottom: 30px;"></div>
<!-- 空元素的上下 margin 合并，最终为 30px -->
```

**margin 合并的规则：**

1. **只发生在垂直方向**：水平方向的 margin 永远不会合并
2. **取较大值**：合并后的 margin 等于参与合并的 margin 中的最大值
3. **负 margin 影响**：
   - 都是正值：取最大值
   - 都是负值：取最小值（更负）
   - 一正一负：相加

```css
/* 都是正值：取较大值 50px */
.margin1 {
  margin-bottom: 20px;
}
.margin2 {
  margin-top: 50px;
}

/* 都是负值：取较小值 -30px */
.margin3 {
  margin-bottom: -10px;
}
.margin4 {
  margin-top: -30px;
}

/* 一正一负：相加得 20px */
.margin5 {
  margin-bottom: 50px;
}
.margin6 {
  margin-top: -30px;
}
```

**解决 margin 合并的方法：**

| 方法                                        | 示例                                               | 原理                     |
| ------------------------------------------- | -------------------------------------------------- | ------------------------ |
| 给父元素添加 `overflow: hidden/auto/scroll` | `.parent { overflow: hidden; }`                    | 创建 BFC                 |
| 给父元素添加 `border`                       | `.parent { border: 1px solid transparent; }`       | 阻断合并                 |
| 给父元素添加 `padding`                      | `.parent { padding-top: 1px; }`                    | 阻断合并                 |
| 使用 `display: inline-block`                | `.child { display: inline-block; }`                | 行内块不参与合并         |
| 使用 `display: flex/grid`                   | `.parent { display: flex; }`                       | flex/grid 子项不参与合并 |
| 子元素使用 `float`                          | `.child { float: left; }`                          | 浮动元素不参与合并       |
| 子元素使用 `position: absolute`             | `.child { position: absolute; }`                   | 绝对定位不参与合并       |
| 使用 `::before` / `::after` 伪元素          | `.parent::before { content: ''; display: table; }` | 创建 BFC                 |

> **最常用的解决方案**：给父元素添加 `overflow: hidden` 或使用 BFC 相关的方法。在现代布局中，使用 Flexbox 或 Grid 可以天然避免 margin 合并问题。

---

## 三、布局

### display 属性有哪些常用值？它们的区别是什么？

**`display` 属性控制元素的显示方式和布局行为。**

**常见的 `display` 值：**

#### 1. 基础显示类型

| 值             | 描述       | 特点                                                     |
| -------------- | ---------- | -------------------------------------------------------- |
| `block`        | 块级元素   | 独占一行，可以设置 width/height，默认宽度 100%           |
| `inline`       | 行内元素   | 不独占一行，无法设置 width/height，大小由内容决定        |
| `inline-block` | 行内块元素 | 不独占一行（行内特性），可以设置宽高（块级特性）         |
| `none`         | 隐藏元素   | 元素不显示，也不占据空间（与 `visibility: hidden` 不同） |

**block 元素示例：** `<div>`, `<p>`, `<h1>~<h6>`, `<ul>`, `<li>`, `<form>`

**inline 元素示例：** `<span>`, `<a>`, `<em>`, `<strong>`, `<img>`, `<input>`

> **注意**：`<img>` 和 `<input>` 虽然是 inline 元素，但可以设置宽高，它们的实际行为更接近 `inline-block`。

#### 2. 表格相关

| 值                   | 描述               |
| -------------------- | ------------------ |
| `table`              | 作为块级表格显示   |
| `table-row`          | 作为表格行显示     |
| `table-cell`         | 作为表格单元格显示 |
| `table-row-group`    | 作为表格行组显示   |
| `table-header-group` | 作为表格表头组显示 |
| `table-footer-group` | 作为表格表尾组显示 |

#### 3. 弹性盒子（Flexbox）

| 值            | 描述                 |
| ------------- | -------------------- |
| `flex`        | 作为块级弹性容器显示 |
| `inline-flex` | 作为行内弹性容器显示 |

#### 4. 网格布局（Grid）

| 值            | 描述                 |
| ------------- | -------------------- |
| `grid`        | 作为块级网格容器显示 |
| `inline-grid` | 作为行内网格容器显示 |

#### 5. 其他

| 值          | 描述                                 |
| ----------- | ------------------------------------ |
| `list-item` | 作为列表项显示（`<li>` 的默认值）    |
| `run-in`    | 根据上下文作为块级或行内元素         |
| `contents`  | 元素本身不生成盒子，其子元素直接显示 |

**block、inline、inline-block 的对比：**

| 特性                  | block              | inline       | inline-block |
| --------------------- | ------------------ | ------------ | ------------ |
| 独占一行              | ✅ 是              | ❌ 否        | ❌ 否        |
| 可设置 width/height   | ✅ 是              | ❌ 否        | ✅ 是        |
| 可设置 margin/padding | ✅ 是              | 水平方向有效 | ✅ 是        |
| 默认宽度              | 100%（父容器宽度） | 内容宽度     | 内容宽度     |
| 可以容纳其他块元素    | ✅ 是              | ❌ 否        | ✅ 是        |

**display: none 与 visibility: hidden 的区别：**

| 特性         | display: none | visibility: hidden |
| ------------ | ------------- | ------------------ |
| 是否占据空间 | ❌ 不占据     | ✅ 占据空间        |
| 文档流影响   | 元素被移除    | 元素仍在文档流中   |
| 是否触发回流 | ✅ 触发回流   | ❌ 只触发重绘      |
| 子元素影响   | 子元素也隐藏  | 子元素也隐藏       |

---

### 什么是浮动（float）？它有哪些问题？如何清除浮动？

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

### 什么是定位（position）？有哪些定位方式？

**`position` 属性用于指定元素的定位方式，决定元素在文档中的位置计算规则。**

#### position 的五种值

| 值         | 描述               | 是否脱离文档流    | 参照物                         |
| ---------- | ------------------ | ----------------- | ------------------------------ |
| `static`   | 静态定位（默认值） | ❌ 否             | 正常文档流                     |
| `relative` | 相对定位           | ❌ 否             | 元素自身原来的位置             |
| `absolute` | 绝对定位           | ✅ 是             | 最近的非 static 定位的祖先元素 |
| `fixed`    | 固定定位           | ✅ 是             | 浏览器窗口（视口）             |
| `sticky`   | 粘性定位           | ❌/✅（条件触发） | 最近的可滚动祖先或视口         |

#### 详细说明

**1. static（静态定位）**

- 默认值，元素按照正常文档流排列
- `top/right/bottom/left/z-index` 属性无效

```css
.box {
  position: static; /* 默认，可以省略 */
}
```

**2. relative（相对定位）**

- 相对于元素自身原来的位置进行偏移
- 偏移后，原来占据的空间仍然保留（不脱离文档流）
- 常作为 `absolute` 定位元素的父容器

```css
.box {
  position: relative;
  top: 20px; /* 向下移动 20px */
  left: 30px; /* 向右移动 30px */
}
```

**3. absolute（绝对定位）**

- 脱离文档流，不占据空间
- 相对于最近的"已定位"（非 static）祖先元素定位
- 如果没有已定位的祖先元素，则相对于 `<html>`（初始包含块）定位

```css
.parent {
  position: relative; /* 作为定位参照物 */
}
.child {
  position: absolute;
  top: 10px;
  right: 20px;
  width: 100px;
  height: 100px;
}
```

**4. fixed（固定定位）**

- 脱离文档流，不占据空间
- 相对于浏览器窗口（视口）定位
- 页面滚动时位置保持不变

```css
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
```

**5. sticky（粘性定位）**

- 相对定位和固定定位的混合体
- 在特定滚动阈值之前是相对定位，之后变为固定定位
- 需要配合 `top/right/bottom/left` 使用

```css
.nav {
  position: sticky;
  top: 0; /* 滚动到顶部时固定 */
}
```

#### 定位相关属性

| 属性      | 描述                             |
| --------- | -------------------------------- |
| `top`     | 元素顶部距离参考物顶部的距离     |
| `right`   | 元素右侧距离参考物右侧的距离     |
| `bottom`  | 元素底部距离参考物底部的距离     |
| `left`    | 元素左侧距离参考物左侧的距离     |
| `z-index` | 元素的堆叠顺序（数值越大越靠前） |

#### 定位的经典应用场景

| 场景           | 推荐使用的定位方式              |
| -------------- | ------------------------------- |
| 元素微调       | relative                        |
| 弹窗、下拉菜单 | relative（父） + absolute（子） |
| 回到顶部按钮   | fixed                           |
| 吸附导航栏     | sticky                          |
| 遮罩层         | fixed                           |

> **小技巧**：使用 `absolute` 定位实现元素水平垂直居中：
>
> ```css
> .center {
>   position: absolute;
>   top: 50%;
>   left: 50%;
>   transform: translate(-50%, -50%);
> }
> ```

---

### 什么是 BFC？如何创建 BFC？它有什么作用？

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

### 如何实现元素的水平垂直居中？

**实现水平垂直居中有多种方法，以下是最常用的几种：**

#### 方法 1：Flexbox（最推荐，现代方案）

```css
/* 父容器 */
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 子元素不需要特殊设置 */
```

#### 方法 2：绝对定位 + transform（子元素无需固定宽高）

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 向左上移动自身宽高的一半 */
}
```

#### 方法 3：绝对定位 + 负 margin（子元素需要固定宽高）

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 100px;
  margin-top: -50px; /* 负的 height/2 */
  margin-left: -100px; /* 负的 width/2 */
}
```

#### 方法 4：绝对定位 + margin: auto（子元素需要固定宽高）

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}
```

#### 方法 5：Grid 布局（CSS Grid）

```css
.parent {
  display: grid;
  place-items: center; /* 等同于 justify-items: center + align-items: center */
}
```

#### 方法 6：行内元素水平垂直居中

```css
/* 单行文本垂直居中 */
.single-line {
  height: 100px;
  line-height: 100px; /* line-height 等于 height */
  text-align: center;
}

/* 行内块元素水平居中 */
.parent {
  text-align: center;
}
.child {
  display: inline-block;
  vertical-align: middle; /* 垂直方向居中 */
}
```

#### 方法 7：使用 table-cell

```css
.parent {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
```

**方法对比：**

| 方法                   | 是否需要固定宽高 | 兼容性          | 推荐指数   | 适用场景         |
| ---------------------- | ---------------- | --------------- | ---------- | ---------------- |
| Flexbox                | ❌ 不需要        | ✅ 现代浏览器   | ⭐⭐⭐⭐⭐ | 所有场景（首选） |
| absolute + transform   | ❌ 不需要        | ✅ 较好（IE9+） | ⭐⭐⭐⭐   | 需要兼容旧浏览器 |
| absolute + 负 margin   | ✅ 需要          | ✅ 好           | ⭐⭐⭐     | 子元素固定宽高   |
| absolute + margin auto | ✅ 需要          | ✅ 好           | ⭐⭐⭐     | 子元素固定宽高   |
| Grid                   | ❌ 不需要        | ✅ 现代浏览器   | ⭐⭐⭐⭐   | 需要网格布局时   |
| table-cell             | ❌ 不需要        | ✅ 好           | ⭐⭐       | 表格布局相关     |

> **实际开发建议**：如果不需要兼容 IE9 以下浏览器，首选 **Flexbox**；如果需要兼容，使用 **absolute + transform**。

---

### Flexbox（弹性盒子）详解

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

### Grid（网格布局）详解

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

## 四、动画与变换

### CSS 动画有哪些实现方式？

**CSS 中实现动画主要有以下几种方式：**

#### 1. transition（过渡动画）

**`transition` 用于在元素的不同状态之间创建平滑的过渡效果。**

```css
/* 基本用法 */
.box {
  width: 100px;
  height: 100px;
  background: red;
  transition:
    width 1s,
    background 2s;
}
.box:hover {
  width: 200px;
  background: blue;
}

/* 完整属性 */
.box {
  transition-property: width; /* 要过渡的属性 */
  transition-duration: 1s; /* 过渡时间 */
  transition-timing-function: ease; /* 时间函数 */
  transition-delay: 0.5s; /* 延迟时间 */

  /* 简写（推荐） */
  transition: width 1s ease 0.5s;

  /* 多个属性 */
  transition:
    width 1s,
    height 2s,
    color 0.5s;

  /* 所有属性 */
  transition: all 1s;
}
```

**transition-timing-function（时间函数）的可选值：**

| 值                      | 描述               |
| ----------------------- | ------------------ |
| `ease`                  | 慢-快-慢（默认值） |
| `linear`                | 匀速               |
| `ease-in`               | 慢开始，加速       |
| `ease-out`              | 慢结束，减速       |
| `ease-in-out`           | 慢开始和结束       |
| `cubic-bezier(n,n,n,n)` | 自定义贝塞尔曲线   |
| `steps(n, start/end)`   | 阶梯式过渡         |

**使用场景**：hover 效果、状态切换（如展开/收起）、简单的交互反馈

---

#### 2. transform（变换）

**`transform` 用于对元素进行旋转、缩放、倾斜、移动等变换操作。**

```css
/* 2D 变换 */
.box {
  transform: translate(50px, 30px); /* 移动 */
  transform: translateX(50px); /* 水平移动 */
  transform: translateY(30px); /* 垂直移动 */

  transform: rotate(45deg); /* 旋转 */

  transform: scale(1.5); /* 缩放（宽高都放大 1.5 倍） */
  transform: scaleX(2); /* 水平缩放 */
  transform: scaleY(0.5); /* 垂直缩放 */

  transform: skew(30deg, 20deg); /* 倾斜 */
  transform: skewX(30deg); /* 水平倾斜 */
  transform: skewY(20deg); /* 垂直倾斜 */

  /* 组合使用 */
  transform: translate(50px, 50px) rotate(45deg) scale(1.2);
}

/* 3D 变换 */
.box {
  transform: translateZ(100px); /* Z 轴移动 */
  transform: translate3d(50px, 30px, 100px); /* 3D 移动 */

  transform: rotateX(45deg); /* 绕 X 轴旋转 */
  transform: rotateY(45deg); /* 绕 Y 轴旋转 */
  transform: rotateZ(45deg); /* 绕 Z 轴旋转（等同于 rotate） */
  transform: rotate3d(1, 1, 1, 45deg); /* 3D 旋转 */

  transform: scaleZ(2); /* Z 轴缩放 */
  transform: scale3d(2, 1.5, 2); /* 3D 缩放 */

  transform: perspective(500px); /* 透视效果 */
}
```

**transform 的相关属性：**

```css
.box {
  /* 变换原点 */
  transform-origin: center; /* 默认值，中心 */
  transform-origin: top left; /* 左上角 */
  transform-origin: 50px 50px; /* 自定义坐标 */

  /* 变换样式（3D 相关） */
  transform-style: flat; /* 2D 平面（默认） */
  transform-style: preserve-3d; /* 保留 3D 空间 */

  /* 透视效果 */
  perspective: 500px;
  perspective-origin: center;

  /* 背面是否可见 */
  backface-visibility: visible; /* 可见（默认） */
  backface-visibility: hidden; /* 不可见 */
}
```

**使用场景**：按钮点击效果、卡片翻转、图标动画、2D/3D 视觉效果

---

#### 3. animation（关键帧动画）

**`animation` 可以创建更复杂的动画效果，通过 `@keyframes` 定义动画的关键帧。**

```css
/* 定义关键帧 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 使用百分比定义更精细的动画 */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 应用动画 */
.box {
  animation-name: slideIn;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  animation-iteration-count: 1; /* 播放次数：1, infinite... */
  animation-direction: normal; /* normal, reverse, alternate, alternate-reverse */
  animation-fill-mode: forwards; /* none, forwards, backwards, both */
  animation-play-state: running; /* running, paused */

  /* 简写（推荐） */
  animation: slideIn 1s ease 0.5s 1 normal forwards;
}

/* 鼠标悬停时暂停动画 */
.box:hover {
  animation-play-state: paused;
}
```

**animation-direction（播放方向）：**

| 值                  | 描述                           |
| ------------------- | ------------------------------ |
| `normal`            | 正常播放（默认）               |
| `reverse`           | 反向播放                       |
| `alternate`         | 交替播放（奇数正向，偶数反向） |
| `alternate-reverse` | 反向交替播放                   |

**animation-fill-mode（填充模式）：**

| 值          | 描述                           |
| ----------- | ------------------------------ |
| `none`      | 不设置（默认）                 |
| `forwards`  | 动画结束后保持最后一帧状态     |
| `backwards` | 动画开始前应用第一帧状态       |
| `both`      | 同时应用 forwards 和 backwards |

**使用场景**：加载动画、页面入场动画、循环动画、复杂交互效果

---

#### 三种动画方式对比

| 特性       | transition                               | transform                             | animation              |
| ---------- | ---------------------------------------- | ------------------------------------- | ---------------------- |
| 触发方式   | 需要事件触发（hover, click, class 变化） | 通常配合 transition 或 animation 使用 | 自动播放或触发播放     |
| 动画复杂度 | 简单（状态过渡）                         | 静态变换                              | 复杂（多关键帧）       |
| 循环播放   | ❌ 不支持                                | ❌ 不支持                             | ✅ 支持（infinite）    |
| 控制灵活性 | 一般                                     | 高（可组合多种变换）                  | 高（可精细控制每一帧） |
| 性能       | ✅ 好                                    | ✅ 好（GPU 加速）                     | ✅ 较好                |

---

### 如何优化 CSS 动画性能？

**CSS 动画性能优化的核心原则：**

#### 1. 使用 transform 和 opacity 进行动画

```css
/* 推荐：使用 transform 和 opacity（GPU 加速，不触发回流和重绘） */
.good {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.good:hover {
  transform: translateX(50px);
  opacity: 0.8;
}

/* 不推荐：使用 top/left（触发回流和重绘） */
.bad {
  transition:
    left 0.3s,
    top 0.3s;
  position: relative;
  left: 0;
  top: 0;
}
.bad:hover {
  left: 50px;
  top: 50px;
}
```

**为什么 transform 和 opacity 性能更好？**

- 它们可以在**合成线程**中处理，不会触发回流（Reflow）和重绘（Repaint）
- 可以利用 GPU 加速
- 不会影响文档流中的其他元素

**影响性能的属性（避免动画）：**

| 属性                             | 触发                         | 性能影响 |
| -------------------------------- | ---------------------------- | -------- |
| `width`, `height`                | 回流 + 重绘                  | ⚠️ 高    |
| `top`, `left`, `right`, `bottom` | 回流 + 重绘                  | ⚠️ 高    |
| `margin`, `padding`              | 回流 + 重绘                  | ⚠️ 高    |
| `border`                         | 回流 + 重绘                  | ⚠️ 高    |
| `font-size`                      | 回流 + 重绘                  | ⚠️ 高    |
| `color`                          | 重绘                         | ✅ 中等  |
| `background`                     | 重绘                         | ✅ 中等  |
| `visibility`                     | 重绘                         | ✅ 中等  |
| `transform`                      | 不触发                       | ✅ 最佳  |
| `opacity`                        | 不触发（不与其他属性混用时） | ✅ 最佳  |

---

#### 2. 使用 will-change 提示浏览器

```css
/* 告诉浏览器这个元素即将发生变化，提前准备优化 */
.box {
  will-change: transform, opacity;
}

/* 或者使用 transform 提升到独立图层 */
.box {
  transform: translateZ(0); /* 3D 变换，强制创建新图层 */
  /* 或使用 */
  will-change: transform;
}
```

> **注意**：`will-change` 不要过度使用，否则会消耗过多内存。只在确实需要动画的元素上使用。

---

#### 3. 避免使用影响布局的属性动画

```css
/* ❌ 不推荐：改变 width 会影响布局 */
.bad {
  transition: width 0.3s;
}
.bad:hover {
  width: 200px;
}

/* ✅ 推荐：使用 scale 替代 */
.good {
  transition: transform 0.3s;
  transform-origin: left center;
}
.good:hover {
  transform: scaleX(1.5); /* 视觉效果类似，但不影响布局 */
}
```

---

#### 4. 减少动画元素的数量

```css
/* ❌ 避免：过多元素同时动画 */
.items .item {
  transition: transform 0.3s;
}

/* ✅ 推荐：只动画必要的元素 */
.item.active {
  transform: scale(1.1);
}
```

---

#### 5. 使用 contain 属性隔离渲染

```css
.box {
  contain: layout paint; /* 告诉浏览器这个元素的渲染不影响外部 */
}
```

---

#### 6. 避免在移动设备上使用复杂动画

- 减少同时动画的元素数量
- 使用 `@media (prefers-reduced-motion: reduce)` 尊重用户设置

```css
/* 尊重用户的动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### 7. 使用 requestAnimationFrame 控制动画（JavaScript）

```javascript
function animate() {
  // 更新动画状态
  element.style.transform = "translateX(...)";

  // 下一帧继续
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

---

**性能优化总结：**

1. ✅ **优先使用** `transform` 和 `opacity` 进行动画
2. ✅ 使用 `will-change` 或 `translateZ(0)` 创建独立图层
3. ✅ 避免动画 `width`、`top`、`left` 等属性
4. ✅ 减少同时动画的元素数量
5. ✅ 尊重用户的 `prefers-reduced-motion` 设置
6. ✅ 复杂动画考虑使用 JavaScript + requestAnimationFrame

---

## 五、响应式设计

### 什么是响应式设计？如何实现？

**响应式设计（Responsive Web Design）是一种使网站在不同设备和屏幕尺寸上都能良好显示的设计方法。**

#### 响应式设计的三大核心

**1. 弹性网格布局（Fluid Grid）**

```css
/* 使用百分比或 fr 单位代替固定像素 */
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 使用 Flexbox 实现弹性布局 */
.row {
  display: flex;
  flex-wrap: wrap;
}
.column {
  flex: 1;
  min-width: 280px;
}

/* 使用 Grid 实现响应式网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
```

**2. 弹性图片/媒体（Flexible Images）**

```css
/* 图片自适应容器宽度 */
img {
  max-width: 100%;
  height: auto;
}

/* 视频和嵌入内容 */
video,
iframe {
  max-width: 100%;
}
```

**3. 媒体查询（CSS Media Queries）**

```css
/* 基础媒体查询语法 */
@media screen and (max-width: 768px) {
  /* 移动端样式 */
  .container {
    width: 95%;
  }
}

/* 常用断点 */
@media screen and (min-width: 1200px) {
  /* 超大屏幕（>=1200px） */
}

@media screen and (min-width: 992px) and (max-width: 1199px) {
  /* 大屏（992-1199px） */
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  /* 中屏（768-991px） */
}

@media screen and (max-width: 767px) {
  /* 小屏（<768px） */
}
```

---

### viewport 是什么？如何设置？

**viewport（视口）是用户在网页上可见的区域，在移动设备上尤为重要。**

```html
<!-- 标准 viewport 设置 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

**viewport 属性说明：**

| 属性                 | 说明                 |
| -------------------- | -------------------- |
| `width=device-width` | 视口宽度等于设备宽度 |
| `initial-scale=1.0`  | 初始缩放比例为 1     |
| `maximum-scale=1.0`  | 最大缩放比例为 1     |
| `minimum-scale=1.0`  | 最小缩放比例为 1     |
| `user-scalable=no`   | 禁止用户手动缩放     |

---

### 移动端适配方案有哪些？

#### 1. rem 方案

**rem（root em）是相对于根元素 `<html>` 的字体大小的单位。**

```javascript
// 动态设置 html 的 font-size
function setRem() {
  const designWidth = 750; // 设计稿宽度
  const baseSize = 100; // 基准值，1rem = 100px
  const currentWidth = document.documentElement.clientWidth;
  const fontSize = (currentWidth / designWidth) * baseSize;
  document.documentElement.style.fontSize = fontSize + "px";
}

window.addEventListener("resize", setRem);
window.addEventListener("DOMContentLoaded", setRem);
```

```css
/* 在 CSS 中使用 rem */
.container {
  width: 7.5rem; /* 750px / 100 = 7.5rem */
  font-size: 0.28rem; /* 28px / 100 = 0.28rem */
}
```

#### 2. vw/vh 方案

**vw（viewport width）和 vh（viewport height）是相对于视口尺寸的单位。**

- `1vw` = 视口宽度的 1%
- `1vh` = 视口高度的 1%
- `1vmin` = 较小值（vw 和 vh 中的较小值）
- `1vmax` = 较大值（vw 和 vh 中的较大值）

```css
/* 设计稿宽度为 750px */
/* 1vw = 7.5px，所以 100px = 13.33vw */

.container {
  width: 100vw;
  height: 100vh;
}

.box {
  width: 13.33vw; /* 100px / 7.5px = 13.33vw */
  height: 13.33vw;
}
```

#### 3. 百分比方案

```css
.container {
  width: 100%;
  padding: 5% 2%;
}

.box {
  width: 33.33%;
  float: left;
}
```

#### 4. Flexbox 方案

```css
.row {
  display: flex;
  flex-wrap: wrap;
}

.column {
  flex: 1;
  min-width: 200px;
  padding: 10px;
}
```

**方案对比：**

| 方案    | 优点               | 缺点               | 适用场景   |
| ------- | ------------------ | ------------------ | ---------- |
| rem     | 兼容性好，可控性强 | 需要 JS 动态计算   | 移动端 H5  |
| vw/vh   | 纯 CSS，无需 JS    | 老浏览器兼容性差   | 现代浏览器 |
| 百分比  | 简单易上手         | 计算复杂，不够精确 | 简单布局   |
| Flexbox | 布局灵活           | 需要理解 flex 模型 | 大多数布局 |

---

### 响应式布局常见技巧

**1. 使用 box-sizing: border-box**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

**2. 使用 aspect-ratio 保持比例**

```css
/* CSS 新特性，保持宽高比 */
.image-container {
  aspect-ratio: 16 / 9;
}

/* 兼容方案 */
.image-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
}
.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**3. 使用 clamp() 动态调整**

```css
/* 最小 16px，最大 24px，理想值为 4vw */
.text {
  font-size: clamp(16px, 4vw, 24px);
}

/* 响应式内边距 */
.container {
  padding: clamp(10px, 3vw, 30px);
}
```

**4. 隐藏/显示元素**

```css
/* 仅在移动端显示 */
.mobile-only {
  display: none;
}
@media screen and (max-width: 768px) {
  .mobile-only {
    display: block;
  }
  .desktop-only {
    display: none;
  }
}
```

**5. 响应式表格**

```css
/* 方案一：水平滚动 */
.table-wrapper {
  overflow-x: auto;
}

/* 方案二：移动端转为卡片布局 */
@media screen and (max-width: 768px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  td {
    position: relative;
    padding-left: 50%;
  }
  td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 45%;
    padding-right: 10px;
  }
}
```

---

## 六、CSS 新特性

### CSS 变量（Custom Properties）

**CSS 变量可以存储和复用值，支持动态修改。**

```css
/* 定义变量（通常在 :root 中定义） */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* 使用变量 */
.button {
  background-color: var(--primary-color);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* 带默认值 */
.box {
  background: var(--bg-color, #ffffff); /* 没有 --bg-color 时使用白色 */
}

/* 动态修改（JavaScript） */
document.documentElement.style.setProperty("--primary-color", "#ff0000");
```

**CSS 变量的特点：**

- ✅ 支持级联和继承
- ✅ 可以在媒体查询中重新定义
- ✅ 可以通过 JavaScript 动态修改
- ✅ 支持计算（`calc()`）

```css
/* 主题切换示例 */
:root {
  --bg: #ffffff;
  --text: #333333;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #ffffff;
}

body {
  background: var(--bg);
  color: var(--text);
  transition:
    background 0.3s,
    color 0.3s;
}
```

---

### CSS Grid 进阶特性

**1. subgrid（子网格）**

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid; /* 继承父级网格线 */
}
```

**2. 命名网格线**

```css
.container {
  display: grid;
  grid-template-columns:
    [col-start] 1fr
    [col-2] 1fr
    [col-3] 1fr
    [col-end];
  grid-template-rows:
    [row-start] auto
    [row-2] auto
    [row-end];
}

.item {
  grid-column: col-start / col-3;
  grid-row: row-start / row-end;
}
```

**3. auto-fit vs auto-fill**

```css
/* auto-fit：有多少项目就占多少空间 */
.fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* auto-fill：尽量填充，即使没有足够项目 */
.fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

---

### CSS 函数

**1. calc() - 计算**

```css
.element {
  width: calc(100% - 20px);
  font-size: calc(16px + 2vw);
  margin: calc(10% - 5px);
}
```

**2. min() / max() - 最小/最大值**

```css
.container {
  width: min(1200px, 100%); /* 不超过 1200px，且不超过 100% */
  font-size: max(16px, 2vw); /* 至少 16px，或 2vw（取较大值） */
}
```

**3. clamp() - 限制范围**

```css
.text {
  /* 最小 16px，理想 4vw，最大 24px */
  font-size: clamp(16px, 4vw, 24px);
}
```

**4. minmax() - 网格大小范围**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
}
```

**5. attr() - 获取属性值**

```css
/* 目前主要用于 content */
a::after {
  content: " (" attr(href) ")";
}

/* 实验性功能（未来可用） */
img {
  width: attr(data-width px, 100px);
}
```

---

### CSS Logical Properties（逻辑属性）

**逻辑属性使用 `start`/`end` 代替 `left`/`right`，使布局更适应不同书写方向。**

```css
/* 传统属性 */
.box {
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 10px;
  text-align: left;
  border-left: 1px solid #000;
}

/* 逻辑属性（推荐） */
.box {
  margin-inline-start: 20px; /* LTR 中 = margin-left */
  margin-inline-end: 20px; /* LTR 中 = margin-right */
  padding-inline-start: 10px;
  text-align: start;
  border-inline-start: 1px solid #000;
}

/* 完整对照表 */
/*
| 物理属性        | 逻辑属性           |
| -------------- | ----------------- |
| margin-left    | margin-inline-start |
| margin-right   | margin-inline-end   |
| margin-top     | margin-block-start  |
| margin-bottom  | margin-block-end    |
| padding-left   | padding-inline-start |
| padding-right  | padding-inline-end   |
| width          | inline-size         |
| height         | block-size          |
| left           | inset-inline-start  |
| right          | inset-inline-end    |
| top            | inset-block-start   |
| bottom         | inset-block-end     |
*/
```

---

### aspect-ratio（宽高比）

**直接设置元素的宽高比，无需使用 padding 技巧。**

```css
/* 16:9 比例 */
.video {
  aspect-ratio: 16 / 9;
  width: 100%;
}

/* 1:1 正方形 */
.square {
  aspect-ratio: 1 / 1;
  width: 200px;
}

/* 4:3 比例 */
.photo {
  aspect-ratio: 4 / 3;
}
```

---

### :has() 选择器（父选择器）

**可以根据子元素来选择父元素。**

```css
/* 如果有 <img> 子元素，就给父元素添加样式 */
.card:has(img) {
  padding: 20px;
  background: #f5f5f5;
}

/* 如果没有 <p> 子元素，就给父元素添加样式 */
.article:not(:has(p)) {
  border: 1px dashed #ccc;
}

/* 组合使用 */
.form:has(input:required) label::after {
  content: " *";
  color: red;
}

/* 根据子元素状态改变父元素 */
.card:has(.button:hover) {
  transform: translateY(-5px);
}
```

---

### container queries（容器查询）

**根据父容器的尺寸而非视口尺寸来调整样式。**

```css
/* 定义容器 */
.card-container {
  container-type: inline-size; /* 基于内联尺寸 */
  container-name: card;
}

/* 简写 */
.card-container {
  container: card / inline-size;
}

/* 根据容器尺寸应用样式 */
.card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@container card (min-width: 500px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 800px) {
  .card {
    grid-template-columns: 300px 1fr 200px;
  }
}
```

---

### CSS 嵌套（Native CSS Nesting）

**原生 CSS 支持嵌套写法，类似 Sass/Less。**

```css
/* 传统写法 */
.button {
  background: blue;
}
.button:hover {
  background: darkblue;
}
.button .icon {
  margin-right: 8px;
}

/* 原生嵌套写法 */
.button {
  background: blue;

  &:hover {
    background: darkblue;
  }

  & .icon {
    margin-right: 8px;
  }
}

/* 更多示例 */
.card {
  background: white;
  padding: 20px;

  &.featured {
    border: 2px solid gold;
  }

  & > .title {
    font-size: 1.5em;
  }

  @media (min-width: 768px) {
    display: flex;
  }
}
```

---

## 七、CSS 预处理器

### 什么是 CSS 预处理器？有哪些常见的？

**CSS 预处理器是一种脚本语言，扩展了 CSS 的功能，编译后生成普通的 CSS 文件。**

**常见的 CSS 预处理器：**

| 预处理器  | 扩展名            | 特点                             |
| --------- | ----------------- | -------------------------------- |
| Sass/SCSS | `.scss` / `.sass` | 最流行，功能丰富，社区活跃       |
| Less      | `.less`           | 语法接近 CSS，学习曲线平缓       |
| Stylus    | `.styl`           | 灵活，语法简洁，可选大括号和分号 |

---

### Sass/SCSS 核心特性

#### 1. 变量（Variables）

```scss
// 定义变量
$primary-color: #007bff;
$font-stack: "Helvetica", sans-serif;
$base-padding: 16px;
$border-radius: 4px;

// 使用变量
.button {
  background-color: $primary-color;
  padding: $base-padding;
  border-radius: $border-radius;
}

// 变量插值
$property: color;
.box {
  #{$property}: red;
}
```

#### 2. 嵌套（Nesting）

```scss
.nav {
  background: #333;

  ul {
    list-style: none;
    margin: 0;
  }

  li {
    display: inline-block;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        color: $primary-color;
      }
    }
  }
}

// 编译后：
// .nav { background: #333; }
// .nav ul { list-style: none; margin: 0; }
// .nav li { display: inline-block; }
// .nav li a { color: white; text-decoration: none; }
// .nav li a:hover { color: #007bff; }
```

#### 3. 混合（Mixins）

```scss
// 定义 mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin border-radius($radius: 4px) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

// 使用 mixin
.box {
  @include flex-center;
  @include border-radius(8px);
}

// 带条件的 mixin
@mixin theme($is-dark: false) {
  @if $is-dark {
    background: #333;
    color: #fff;
  } @else {
    background: #fff;
    color: #333;
  }
}

.card-dark {
  @include theme(true);
}
```

#### 4. 函数（Functions）

```scss
// 自定义函数
@function calculate-rem($size, $base: 16) {
  @return $size / $base * 1rem;
}

// 使用函数
.text {
  font-size: calculate-rem(24); // 1.5rem
}

// 内置函数
$color: #007bff;
.lighten-color {
  background: lighten($color, 20%); // 变亮
}
.darken-color {
  background: darken($color, 20%); // 变暗
}
.transparent-color {
  background: rgba($color, 0.5); // 透明度
}
```

#### 5. 继承/占位符（Extend/Placeholder）

```scss
// 定义可复用的样式
%button-base {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

// 继承
.btn-primary {
  @extend %button-base;
  background: $primary-color;
  color: white;
}

.btn-secondary {
  @extend %button-base;
  background: #6c757d;
  color: white;
}
```

#### 6. 模块化（Partials & Import）

```scss
// _variables.scss
$primary: #007bff;
$secondary: #6c757d;

// _buttons.scss
@mixin button($color) {
  background: $color;
  padding: 10px 20px;
}

// main.scss
@import "variables";
@import "buttons";

// 使用
.button {
  @include button($primary);
}

// 推荐使用 @use（新语法）
@use "variables" as *;
@use "buttons" as *;
```

#### 7. 控制指令

```scss
// @if / @else
@mixin text-color($is-dark: false) {
  @if $is-dark {
    color: white;
  } @else {
    color: black;
  }
}

// @for 循环
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage($i / 12);
  }
}

// @each 遍历
$colors: (
  primary: #007bff,
  success: #28a745,
  warning: #ffc107,
  danger: #dc3545,
);

@each $name, $color in $colors {
  .text-#{$name} {
    color: $color;
  }
  .bg-#{$name} {
    background-color: $color;
  }
}

// @while 循环
$i: 1;
@while $i <= 5 {
  .mt-#{$i} {
    margin-top: $i * 4px;
  }
  $i: $i + 1;
}
```

---

### Less 核心特性

```less
// 变量
@primary-color: #007bff;
@padding: 16px;

// 使用变量
.button {
  background-color: @primary-color;
  padding: @padding;
}

// 嵌套
.nav {
  background: #333;

  ul {
    list-style: none;
  }

  a {
    color: white;
    &:hover {
      color: @primary-color;
    }
  }
}

// 混合（Mixins）
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  .flex-center();
}

// 函数（Less 内置函数）
.lighten-color {
  background-color: lighten(@primary-color, 20%);
}

// 条件语句
.button when (@color = red) {
  background: red;
}

// 循环
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .col-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}
```

---

### CSS 预处理器 vs CSS 新特性

| 功能      | 预处理器              | 原生 CSS                   |
| --------- | --------------------- | -------------------------- |
| 变量      | ✅ `$variable`        | ✅ `--variable`            |
| 嵌套      | ✅ 成熟               | ✅ 支持（新特性）          |
| 混合/函数 | ✅ 功能丰富           | ⚠️ 有限（`@property`）     |
| 模块化    | ✅ `@import` / `@use` | ✅ `@import` + CSS Modules |
| 循环/条件 | ✅ 支持               | ❌ 不支持                  |
| 编译需求  | ✅ 需要编译           | ❌ 不需要                  |

---

## 八、浏览器兼容性与工程化

### CSS Hack 是什么？有哪些常见的？

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

### CSS 前缀（Vendor Prefix）

**浏览器厂商为实验性或私有 CSS 属性添加前缀。**

| 前缀       | 浏览器                                   |
| ---------- | ---------------------------------------- |
| `-webkit-` | Chrome、Safari、Edge（新版）、iOS Safari |
| `-moz-`    | Firefox                                  |
| `-ms-`     | IE、旧版 Edge                            |
| `-o-`      | 旧版 Opera                               |

```css
/* 手动添加前缀（不推荐） */
.box {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* 使用 Autoprefixer 自动处理 */
/* 只需写标准语法 */
.box {
  transform: rotate(45deg);
  display: flex;
  transition: all 0.3s;
}
/* Autoprefixer 会自动生成带前缀的版本 */
```

---

### Can I Use 与浏览器兼容性

**使用 `caniuse.com` 查询 CSS 特性的浏览器支持情况。**

**常见 CSS 特性兼容性：**

| 特性              | Chrome  | Firefox | Safari   | IE            |
| ----------------- | ------- | ------- | -------- | ------------- |
| Flexbox           | ✅ 29+  | ✅ 28+  | ✅ 9+    | ✅ 11（部分） |
| CSS Grid          | ✅ 57+  | ✅ 52+  | ✅ 10.1+ | ❌            |
| CSS 变量          | ✅ 49+  | ✅ 31+  | ✅ 9.1+  | ❌            |
| `clamp()`         | ✅ 79+  | ✅ 75+  | ✅ 13.1+ | ❌            |
| `aspect-ratio`    | ✅ 88+  | ✅ 89+  | ✅ 15+   | ❌            |
| `:has()`          | ✅ 105+ | ✅ 121+ | ✅ 15.4+ | ❌            |
| Container Queries | ✅ 105+ | ✅ 110+ | ✅ 16+   | ❌            |

---

### CSS 工程化工具

#### 1. PostCSS

**PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。**

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"), // 自动添加前缀
    require("postcss-preset-env"), // 使用未来 CSS 特性
    require("cssnano"), // 压缩 CSS
  ],
};
```

#### 2. Browserslist

**指定项目需要支持的浏览器范围。**

```json
// package.json 或 .browserslistrc
{
  "browserslist": ["> 1%", "last 2 versions", "not dead", "not ie 11"]
}
```

#### 3. CSS Modules

**使 CSS 类名自动生成唯一标识，避免全局污染。**

```css
/* Button.module.css */
.button {
  background: blue;
  color: white;
}
```

```jsx
// Button.jsx
import styles from "./Button.module.css";

function Button() {
  return <button className={styles.button}>Click me</button>;
  // 渲染为: <button class="Button_button_1x2y3">Click me</button>
}
```

#### 4. CSS-in-JS

**在 JavaScript 中编写 CSS。**

```jsx
// styled-components 示例
import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => (props.primary ? "blue" : "white")};
  color: ${(props) => (props.primary ? "white" : "blue")};
  padding: 10px 20px;
  border-radius: 4px;
`;

function App() {
  return (
    <>
      <Button primary>Primary</Button>
      <Button>Default</Button>
    </>
  );
}
```

---

### CSS 代码规范与最佳实践

#### 1. 命名规范（BEM）

**BEM（Block Element Modifier）是一种流行的 CSS 命名方法论。**

```css
/* Block: 组件 */
.button {
}

/* Element: 组件的一部分 */
.button__icon {
}
.button__text {
}

/* Modifier: 变体/状态 */
.button--primary {
}
.button--disabled {
}
.button--large {
}

/* 完整示例 */
.card {
}
.card__header {
}
.card__body {
}
.card__title {
}
.card--featured {
}
.card--dark {
}
```

#### 2. 组织架构

```
styles/
├── base/
│   ├── reset.css         /* 重置样式 */
│   ├── normalize.css     /* 标准化样式 */
│   └── typography.css    /* 排版样式 */
├── variables/
│   ├── colors.scss       /* 颜色变量 */
│   └── spacing.scss      /* 间距变量 */
├── components/
│   ├── button.scss       /* 按钮组件 */
│   ├── card.scss         /* 卡片组件 */
│   └── form.scss         /* 表单组件 */
├── layout/
│   ├── grid.scss         /* 网格布局 */
│   └── header.scss       /* 头部布局 */
├── pages/
│   ├── home.scss         /* 首页样式 */
│   └── about.scss        /* 关于页样式 */
└── main.scss             /* 主入口文件 */
```

#### 3. 性能优化建议

```css
/* ✅ 避免使用通配符选择器 */
/* ❌ 不推荐 */
* {
  margin: 0;
}

/* ✅ 推荐：显式指定元素 */
body,
h1,
h2,
h3,
p,
ul {
  margin: 0;
}

/* ✅ 避免过深的嵌套 */
/* ❌ 不推荐 */
.page .header .nav .menu .item a {
}

/* ✅ 推荐 */
.nav-item a {
}

/* ✅ 使用简写属性 */
/* ❌ 不推荐 */
.box {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}

/* ✅ 推荐 */
.box {
  margin: 10px 20px;
}

/* ✅ 避免使用 !important */
/* ❌ 不推荐 */
.text {
  color: red !important;
}

/* ✅ 推荐：通过提高选择器优先级解决 */
.card .text {
  color: red;
}

/* ✅ 减少 reflow */
.box {
  will-change: transform;
}
```

---

## 九、其他高频面试题

### 什么是回流（Reflow）和重绘（Repaint）？如何优化？

#### 基本概念

**回流（Reflow / Layout）**：当渲染树中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程。

**会导致回流的操作：**

- 页面首次渲染
- 浏览器窗口大小改变
- 元素尺寸或位置改变
- 元素内容变化（文字数量或图片大小等）
- 元素字体大小变化
- 添加或删除可见的 DOM 元素
- 激活 CSS 伪类（如 `:hover`）
- 设置 `style` 属性
- 查询某些属性或调用某些方法（如 `offsetWidth`、`getBoundingClientRect`）

**重绘（Repaint / Paint）**：当元素样式的改变不影响布局时（如 `color`、`background-color`、`visibility` 等），浏览器将对元素进行重新绘制。

**回流必将引起重绘，重绘不一定会引起回流。**

#### 性能影响

- **回流**：成本较高，需要重新计算布局
- **重绘**：成本相对较低，只需要重新绘制像素

#### 优化方案

```javascript
// ✅ 1. 避免频繁操作样式，一次性修改
// ❌ 不推荐
element.style.width = "100px";
element.style.height = "100px";
element.style.margin = "10px";

// ✅ 推荐
element.style.cssText = "width: 100px; height: 100px; margin: 10px;";
// 或
element.classList.add("new-style");

// ✅ 2. 避免频繁操作 DOM
// ❌ 不推荐
for (let i = 0; i < 100; i++) {
  const div = document.createElement("div");
  document.body.appendChild(div);
}

// ✅ 推荐：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement("div");
  fragment.appendChild(div);
}
document.body.appendChild(fragment);

// ✅ 3. 先隐藏元素，操作后再显示
element.style.display = "none";
// 进行多次 DOM 操作...
element.style.display = "block";

// ✅ 4. 避免频繁读取会触发回流的属性
// ❌ 不推荐
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = elements[i].offsetWidth + 10 + "px";
}

// ✅ 推荐：先缓存所有值
const widths = elements.map((el) => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px";
});
```

```css
/* ✅ 5. 使用 transform 和 opacity 做动画（GPU 加速，不触发回流） */
.animated {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.animated:hover {
  transform: translateX(50px);
  opacity: 0.8;
}

/* ✅ 6. 使用 will-change 提示浏览器 */
.box {
  will-change: transform, opacity;
}

/* ✅ 7. 使用 contain 属性隔离渲染 */
.card {
  contain: layout paint;
}
```

---

### CSS 选择器的解析顺序是怎样的？

**CSS 选择器是从右向左解析的（从最内层到最外层）。**

```css
/* 这个选择器的解析顺序： */
/* .container .list li a {} */
/* 1. 找到所有 <a> 元素 */
/* 2. 检查其父元素是否是 <li> */
/* 3. 检查 <li> 的祖先是否有 .list */
/* 4. 检查 .list 的祖先是否有 .container */

/* 为什么从右向左？ */
/* 因为浏览器先有 DOM 树，再匹配样式 */
/* 从右向左可以快速排除不匹配的元素，效率更高 */
```

**高效选择器的编写原则：**

```css
/* ✅ 推荐：使用具体的类名 */
.nav-item {
}

/* ❌ 不推荐：过深的嵌套 */
.nav ul li a {
}

/* ✅ 推荐：避免使用通配符 */
.button {
}

/* ❌ 不推荐：属性选择器效率较低 */
input[type="text"] {
}
```

---

### display: none、visibility: hidden、opacity: 0 的区别？

| 特性         | `display: none` | `visibility: hidden` | `opacity: 0` |
| ------------ | --------------- | -------------------- | ------------ |
| 是否占据空间 | ❌ 不占据       | ✅ 占据              | ✅ 占据      |
| 是否可交互   | ❌ 不可点击     | ❌ 不可点击          | ✅ 可点击    |
| 是否触发回流 | ✅ 触发         | ❌ 不触发            | ❌ 不触发    |
| 是否触发重绘 | ✅ 触发         | ✅ 触发              | ✅ 触发      |
| 子元素影响   | 子元素也隐藏    | 子元素也隐藏         | 子元素也透明 |
| 过渡动画     | ❌ 不支持       | ❌ 不支持            | ✅ 支持      |

---

### 如何实现一个自适应的正方形？

```css
/* 方案一：使用 aspect-ratio（现代方案） */
.square {
  aspect-ratio: 1 / 1;
  width: 100%;
}

/* 方案二：使用 padding-top（兼容方案） */
.square {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 比例 */
}
.square-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 方案三：使用 vw/vh */
.square {
  width: 30vw;
  height: 30vw;
}
```

---

### 如何实现两栏布局（左侧固定，右侧自适应）？

```html
<div class="container">
  <div class="sidebar">侧边栏</div>
  <div class="main">主内容</div>
</div>
```

```css
/* 方案一：Flexbox（推荐） */
.container {
  display: flex;
}
.sidebar {
  width: 200px;
  flex-shrink: 0;
}
.main {
  flex: 1;
}

/* 方案二：Grid */
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* 方案三：浮动 */
.sidebar {
  float: left;
  width: 200px;
}
.main {
  overflow: hidden; /* 创建 BFC */
}

/* 方案四：绝对定位 */
.container {
  position: relative;
}
.sidebar {
  position: absolute;
  left: 0;
  width: 200px;
}
.main {
  margin-left: 200px;
}
```

---

### 如何实现三角形？

```css
/* 方案一：使用 border */
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}

/* 方向变化 */
.triangle-up {
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}

.triangle-down {
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 100px solid red;
}

.triangle-left {
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-right: 100px solid red;
}

.triangle-right {
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 100px solid red;
}

/* 方案二：使用 clip-path（现代方案） */
.triangle-clip {
  width: 100px;
  height: 100px;
  background: red;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
```

---

### 如何实现一个自适应的圆形头像？

```css
/* 方案一：使用 border-radius */
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover; /* 保持图片比例，填充容器 */
}

/* 方案二：使用 aspect-ratio（自适应宽度） */
.avatar-responsive {
  width: 20%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
}
```

---

### 如何实现单行/多行文本溢出省略号？

```css
/* 单行文本溢出 */
.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px; /* 需要固定宽度 */
}

/* 多行文本溢出（WebKit 浏览器） */
.multi-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 显示 3 行 */
  overflow: hidden;
  line-height: 1.5;
  max-height: calc(1.5em * 3); /* 兼容性兜底 */
}

/* 多行文本溢出（纯 CSS 兼容性方案） */
.multi-line-compat {
  position: relative;
  overflow: hidden;
  line-height: 1.5;
  max-height: calc(1.5em * 3);
}
.multi-line-compat::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 1em;
  background: linear-gradient(to right, transparent, #fff 50%);
}
```

---

### CSS 中哪些属性可以继承？

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

### CSS Reset 和 Normalize.css 的区别？

**CSS Reset（重置样式）：**

- **目的**：将所有浏览器的默认样式全部清零
- **方式**：将所有元素的 margin、padding、border 等设置为 0
- **特点**：非常彻底，但可能会丢失一些有用的默认样式

```css
/* 典型的 CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}
```

**Normalize.css（标准化样式）：**

- **目的**：让所有浏览器的默认样式保持一致
- **方式**：保留有用的默认样式，修复浏览器的差异
- **特点**：更温和，保留了 `<h1>` 的大小、列表的缩进等

**两者对比：**

| 特性               | CSS Reset          | Normalize.css      |
| ------------------ | ------------------ | ------------------ |
| **理念**           | 一切归零，从零开始 | 保持一致，修复差异 |
| **保留默认样式**   | ❌ 全部清除        | ✅ 保留有用的      |
| **浏览器差异修复** | ⚠️ 无              | ✅ 有专门修复      |
| **适用场景**       | 需要完全自定义样式 | 希望保留基本排版   |
| **文件大小**       | 较小               | 较大               |

**现代最佳实践：**

```css
/* 使用 modern-normalize 或自定义的轻量重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
svg,
video,
canvas {
  display: block;
  max-width: 100%;
}
```

---

### z-index 的工作原理是什么？如何正确使用？

**z-index 的核心概念：**

- z-index 只在**定位元素**（`position` 不为 `static`）上有效
- z-index 创建**层叠上下文**（Stacking Context）
- 子元素的 z-index 只在父层叠上下文中有意义

**层叠顺序（从下到上）：**

1. 形成层叠上下文的元素的背景和边框
2. 负 z-index 的子元素
3. 常规流中的块级元素
4. 浮动元素
5. 常规流中的行内元素
6. z-index: auto 或 z-index: 0 的定位元素
7. 正 z-index 的子元素（数值越大越靠上）

**创建层叠上下文的条件：**

```css
/* 1. 根元素（html） */

/* 2. 定位元素且 z-index 不为 auto */
.box {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}

/* 3. opacity 小于 1 */
.box {
  opacity: 0.99; /* 创建层叠上下文 */
}

/* 4. transform 不为 none */
.box {
  transform: translateZ(0); /* 创建层叠上下文 */
}

/* 5. will-change 不为 none */
.box {
  will-change: transform; /* 创建层叠上下文 */
}

/* 6. contain 包含 layout、paint 或 strict */
.box {
  contain: layout paint; /* 创建层叠上下文 */
}

/* 7. Flex/Grid 容器的子项且 z-index 不为 auto */
.flex-item {
  z-index: 1; /* 创建层叠上下文 */
}
```

**常见误区：**

```css
/* ❌ 误区1：非定位元素设置 z-index 无效 */
.static-box {
  position: static; /* 默认值 */
  z-index: 100; /* 无效！ */
}

/* ✅ 正确写法 */
.relative-box {
  position: relative;
  z-index: 100; /* 有效 */
}

/* ❌ 误区2：子元素的 z-index 无法超越父层叠上下文 */
.parent {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}
.child {
  position: relative;
  z-index: 9999; /* 这个 z-index 只在 parent 内部有效 */
}
/* 由于 parent 的 z-index 是 1，child 无论多大都在 z-index: 2 的元素之下 */

/* ✅ 解决方案：提高父元素的 z-index，或避免创建不必要的层叠上下文 */
.parent {
  position: relative;
  /* z-index: auto; 不创建层叠上下文 */
}
.child {
  position: relative;
  z-index: 100; /* 现在 z-index 在全局范围内生效 */
}
```

**最佳实践：**

```css
/* 1. 制定 z-index 规范 */
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}

.dropdown {
  z-index: var(--z-dropdown);
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}

.modal {
  z-index: var(--z-modal);
}

/* 2. 避免使用过大的数字（如 999999） */

/* 3. 使用 CSS 变量统一管理 z-index */

/* 4. 理解层叠上下文，避免嵌套陷阱 */
```

---

### Flexbox 中 flex: 1 代表什么？

**`flex: 1` 是以下三个属性的简写：**

```css
.item {
  flex-grow: 1; /* 放大比例：如果有剩余空间，可以放大 */
  flex-shrink: 1; /* 缩小比例：如果空间不足，可以缩小 */
  flex-basis: 0%; /* 初始大小：从 0 开始计算 */
}
```

**常见的 flex 简写值：**

| 简写             | 含义                              |
| ---------------- | --------------------------------- |
| `flex: 1`        | `flex: 1 1 0%` - 平均分配剩余空间 |
| `flex: auto`     | `flex: 1 1 auto` - 根据内容分配   |
| `flex: none`     | `flex: 0 0 auto` - 不放大也不缩小 |
| `flex: 0 1 auto` | 默认值，不放大可缩小              |

**示例对比：**

```css
.container {
  display: flex;
  width: 600px;
}

/* flex: 1 - 三个项目平分空间，各 200px */
.item-equal {
  flex: 1;
}

/* flex: auto - 三个项目根据内容分配，再平分剩余空间 */
.item-auto {
  flex: auto;
}

/* flex: 2 1 0% - 第一个项目占其他项目的两倍空间 */
.item-first {
  flex: 2;
}
.item-second,
.item-third {
  flex: 1;
}
```

---

### CSS 中如何实现垂直居中？

这个问题在布局章节有详细说明，这里做一个快速回顾：

```css
/* 方案一：Flexbox（最推荐） */
.flex-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 方案二：Grid */
.grid-center {
  display: grid;
  place-items: center;
}

/* 方案三：绝对定位 + transform */
.absolute-center {
  position: relative;
}
.absolute-center .child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方案四：绝对定位 + margin: auto（需要固定宽高） */
.margin-auto-center {
  position: relative;
}
.margin-auto-center .child {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}

/* 方案五：行内元素垂直居中（单行文本） */
.text-center {
  height: 100px;
  line-height: 100px; /* line-height = height */
  text-align: center;
}
```

---

### CSS 中常见的单位有哪些？区别是什么？

**绝对单位：**

| 单位        | 描述                           | 场景           |
| ----------- | ------------------------------ | -------------- |
| `px`        | 像素，屏幕显示的最小单位       | 精确的尺寸控制 |
| `pt`        | 磅，印刷单位（1pt ≈ 1/72英寸） | 打印样式       |
| `pc`        | pica，1pc = 12pt               | 印刷排版       |
| `in`        | 英寸                           | 打印样式       |
| `cm` / `mm` | 厘米/毫米                      | 打印样式       |

**相对单位（相对字体大小）：**

| 单位  | 描述                         | 场景                 |
| ----- | ---------------------------- | -------------------- |
| `em`  | 相对父元素的字体大小         | 继承性的尺寸         |
| `rem` | 相对根元素（html）的字体大小 | 移动端适配、统一单位 |
| `ex`  | 相对字体 x 字符的高度        | 特殊排版             |
| `ch`  | 相对字符 0 的宽度            | 等宽字符布局         |

**相对单位（相对视口）：**

| 单位   | 描述                    | 场景           |
| ------ | ----------------------- | -------------- |
| `vw`   | 视口宽度的 1%           | 响应式宽度     |
| `vh`   | 视口高度的 1%           | 响应式高度     |
| `vmin` | `vw` 和 `vh` 中的较小值 | 保持比例的容器 |
| `vmax` | `vw` 和 `vh` 中的较大值 | 全屏布局       |

**百分比：**

| 单位 | 描述               | 场景     |
| ---- | ------------------ | -------- |
| `%`  | 相对父元素的百分比 | 弹性布局 |

**em vs rem 的区别：**

```css
/* 设置根元素字体大小 */
html {
  font-size: 16px; /* 基准值 */
}

/* em - 相对父元素 */
.parent {
  font-size: 20px;
}
.child {
  font-size: 2em; /* 2 * 20px = 40px，相对父元素 */
  padding: 1em; /* 1 * 40px = 40px，相对自身 font-size */
}

/* rem - 相对根元素 */
.parent {
  font-size: 20px;
}
.child {
  font-size: 2rem; /* 2 * 16px = 32px，始终相对 html */
  padding: 1rem; /* 1 * 16px = 16px */
}
```

**实际应用建议：**

```css
/* 移动端适配方案：使用 rem + vw */
html {
  /* 基准：设计稿宽度 750px，1rem = 100px */
  font-size: calc(100vw / 7.5);
}

/* 限制最大最小字号 */
html {
  font-size: clamp(14px, 2vw, 20px);
}

/* 布局尺寸：使用 rem 或 px */
.box {
  width: 2rem; /* 移动端更灵活 */
  height: 100px; /* 固定尺寸使用 px */
  padding: 16px; /* 内边距常用 px */
  font-size: 1rem; /* 字体大小推荐 rem */
}

/* 视口相关尺寸：使用 vw/vh */
.full-screen {
  width: 100vw;
  height: 100vh;
}

.hero {
  height: 80vh; /* 80% 视口高度 */
}
```

---

### CSS 中如何实现瀑布流布局？

```css
/* 方案一：CSS Columns（最简单的方式） */
.masonry-columns {
  column-count: 3; /* 列数 */
  column-gap: 20px; /* 列间距 */
}
.masonry-columns .item {
  break-inside: avoid; /* 避免在元素内断列 */
  margin-bottom: 20px;
}

/* 方案二：CSS Grid（需配合 JS 计算高度） */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-flow: dense; /* 紧密填充 */
}

/* 方案三：Flexbox（需要已知高度或 JS 配合） */
.masonry-flex {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 1000px; /* 需要固定高度 */
  align-content: space-between;
}
.masonry-flex .item {
  width: calc(33.33% - 10px);
  margin-bottom: 20px;
}
```

---

### CSS 中如何实现粘性定位（Sticky）？

**`position: sticky` 可以让元素在滚动到特定位置时固定。**

```css
/* 基本用法 */
.sticky-header {
  position: sticky;
  top: 0; /* 滚动到顶部时固定 */
  background: white;
  z-index: 100;
}

/* 侧边栏粘性定位 */
.sticky-sidebar {
  position: sticky;
  top: 20px; /* 距离顶部 20px 时固定 */
  align-self: flex-start; /* 配合 Flexbox 使用 */
}

/* 表格标题粘性定位 */
.sticky-table th {
  position: sticky;
  top: 0;
  background: #f5f5f5;
}

/* 多行表头粘性定位 */
.sticky-table th:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 2;
}
.sticky-table th:nth-child(2) {
  position: sticky;
  left: 100px; /* 第一列的宽度 */
  z-index: 2;
}
```

**sticky 的生效条件：**

1. 父元素的 `overflow` 不能是 `hidden`、`scroll`、`auto`
2. 必须指定 `top`、`right`、`bottom` 或 `left` 中的至少一个
3. 元素必须在父容器的可视范围内
4. 父元素的高度必须大于 sticky 元素的高度

---

### 如何优化 CSS 的加载性能？

**1. 压缩和合并 CSS 文件**

```css
/* 生产环境：使用压缩工具（cssnano、clean-css） */
/* 移除空格、注释、优化属性顺序 */
```

**2. 避免使用 @import**

```css
/* ❌ 不推荐：@import 会阻塞渲染 */
@import url("reset.css");
@import url("layout.css");

/* ✅ 推荐：使用 <link> 标签并行加载 */
/* <link rel="stylesheet" href="reset.css" />
   <link rel="stylesheet" href="layout.css" /> */
```

**3. 使用媒体查询拆分 CSS**

```css
/* 按场景加载不同 CSS */
<link rel="stylesheet" href="main.css" />
<link rel="stylesheet" href="print.css" media="print" />
<link
  rel="stylesheet"
  href="mobile.css"
  media="screen and (max-width: 768px)"
/>
```

**4. 内联关键 CSS（Critical CSS）**

```html
<!-- 将首屏所需的 CSS 内联到 <style> 中 -->
<style>
  /* 首屏关键样式 */
  body {
    font-family: sans-serif;
  }
  .hero {
    height: 80vh;
  }
</style>

<!-- 其余样式异步加载 -->
<link
  rel="stylesheet"
  href="rest.css"
  media="print"
  onload="this.media='all'"
/>
```

**5. 使用 CSS 预加载**

```html
<link rel="preload" href="styles.css" as="style" />
```

**6. 减少选择器的复杂度**

```css
/* ❌ 不推荐：过深的嵌套和复杂选择器 */
.page .header .nav .menu .item a span {
  color: red;
}

/* ✅ 推荐：简单直接的类选择器 */
.nav-item-text {
  color: red;
}
```

**7. 避免使用昂贵的属性**

```css
/* ❌ 尽量避免在滚动或动画中使用 */
.box {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); /* 重绘成本高 */
  border-radius: 50%; /* 圆角绘制成本较高 */
  backdrop-filter: blur(10px); /* 非常昂贵 */
}
```

**8. 使用 CSS 变量而非重复值**

```css
/* ✅ 推荐：集中管理，易于维护 */
:root {
  --primary-color: #007bff;
  --spacing: 16px;
}
.button {
  background: var(--primary-color);
  padding: var(--spacing);
}
```

**9. 使用 Content-Visibility 延迟渲染**

```css
/* 让屏幕外的内容延迟渲染 */
.card {
  content-visibility: auto;
  contain-intrinsic-size: 200px; /* 预估高度，避免滚动条跳动 */
}
```

**10. 使用 Contain 隔离渲染**

```css
/* 告诉浏览器该元素的渲染不会影响外部 */
.component {
  contain: layout paint style;
}
```

---

### CSS 中如何实现暗色模式（Dark Mode）？

**方案一：CSS 变量 + 类名切换**

```css
/* 定义颜色变量 */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --primary-color: #007bff;
  --border-color: #e0e0e0;
}

/* 暗色模式覆盖 */
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --primary-color: #4dabf7;
  --border-color: #444444;
}

/* 使用变量 */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition:
    background-color 0.3s,
    color 0.3s;
}

/* JavaScript 切换主题 */
/*
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  };
*/
```

**方案二：使用 prefers-color-scheme 媒体查询**

```css
/* 默认（亮色） */
:root {
  --bg: #ffffff;
  --text: #333333;
}

/* 跟随系统设置 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #ffffff;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**方案三：混合方案（跟随系统 + 用户选择）**

```css
/* 默认跟随系统 */
:root {
  --bg: #ffffff;
  --text: #333333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #ffffff;
  }
}

/* 用户手动选择覆盖系统设置 */
[data-theme="light"] {
  --bg: #ffffff;
  --text: #333333;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #ffffff;
}
```

**最佳实践：**

```css
/* 1. 为所有颜色使用 CSS 变量 */
/* 2. 为图片添加暗色模式适配 */
img {
  filter: brightness(1);
}
@media (prefers-color-scheme: dark) {
  img {
    filter: brightness(0.8); /* 让图片在暗色模式下不那么刺眼 */
  }
}

/* 3. 尊重用户的减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* 4. 确保颜色对比度符合无障碍标准 */
/* WCAG AA: 普通文本 4.5:1，大文本 3:1 */
```

---

### CSS 中 `currentColor` 关键字有什么用？

**`currentColor` 代表当前元素的 `color` 属性值，可以让其他属性继承文本颜色。**

```css
/* 基本用法 */
.button {
  color: blue;
  border: 1px solid currentColor; /* 边框颜色 = color = blue */
  background: transparent;
}

/* SVG 图标颜色跟随文本 */
.icon {
  color: red;
  fill: currentColor; /* SVG 填充色 = color = red */
  stroke: currentColor; /* SVG 描边色 = color = red */
}

/* 伪元素继承颜色 */
.link {
  color: #007bff;
}
.link::after {
  content: "→";
  color: currentColor; /* 继承父元素的 color */
}

/* box-shadow 使用 currentColor */
.box {
  color: #333;
  box-shadow: 0 0 10px currentColor; /* 阴影颜色 = color */
}

/* 与 CSS 变量配合 */
.card {
  --accent: #ff6b6b;
  color: var(--accent);
  border-color: currentColor;
  box-shadow: 0 2px 8px currentColor;
}
```

**优势：**

- 减少重复代码，只需要修改一个地方
- 组件化更方便，颜色统一管理
- SVG 图标可以跟随文本颜色变化

---

### CSS 选择器有哪些类型？优先级如何计算？

这个问题在基础章节有详细说明，这里做一个快速参考：

**选择器类型（按优先级从低到高）：**

| 选择器类型   | 示例                    | 权重       |
| ------------ | ----------------------- | ---------- |
| 通配符选择器 | `*`                     | 0, 0, 0, 0 |
| 元素选择器   | `div`, `p`              | 0, 0, 0, 1 |
| 伪元素选择器 | `::before`, `::after`   | 0, 0, 0, 1 |
| 类选择器     | `.class`                | 0, 0, 1, 0 |
| 伪类选择器   | `:hover`, `:focus`      | 0, 0, 1, 0 |
| 属性选择器   | `[type="text"]`         | 0, 0, 1, 0 |
| ID 选择器    | `#header`               | 0, 1, 0, 0 |
| 内联样式     | `style="..."`           | 1, 0, 0, 0 |
| `!important` | `color: red !important` | 最高优先级 |

**优先级计算规则：**

- 从左到右比较，哪一位大则优先级高
- 同一位的多个选择器可以累加（但不会进位）
- 优先级相同时，后写的覆盖先写的

**记忆口诀：**

> !important > 内联样式 > ID > 类/属性/伪类 > 元素/伪元素 > 通配符

---

### 总结：CSS 学习路径

**初级（基础）：**

1. 选择器、盒模型、定位（position）
2. 浮动（float）和清除浮动
3. 常见布局技巧（居中、两栏、三栏）

**中级（进阶）：**

1. Flexbox
2. CSS Grid
3. 响应式设计和媒体查询
4. CSS 动画（transition、transform、animation）
5. BFC、层叠上下文

**高级（专家）：**

1. CSS 变量和自定义属性
2. 新特性（aspect-ratio、:has()、container queries）
3. 性能优化（回流、重绘、GPU 加速）
4. CSS 架构（BEM、CSS Modules、CSS-in-JS）
5. 浏览器兼容性和工程化

---

> 这份 CSS 面试题文档涵盖了从基础到高级的所有重要知识点，配合代码示例和对比表格，可以帮助你全面掌握 CSS。祝面试顺利！🎉
