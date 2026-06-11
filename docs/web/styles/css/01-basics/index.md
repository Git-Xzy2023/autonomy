---
title: CSS 基础
---

# CSS 基础

> **CSS**（Cascading Style Sheets，层叠样式表）是一种用来描述**结构化文档（HTML / XML）** 外观与格式的样式语言。它与 HTML、JavaScript 并称前端三大核心技术：
>
> - **HTML** 负责"是什么"（结构/内容）
> - **CSS** 负责"长什么样"（样式/布局）
> - **JavaScript** 负责"能做什么"（行为/交互）

---

## 一、CSS 引入方式

CSS 有**三种主要引入方式**，以及一种在现代前端工程中非常常见的 "CSS-in-JS" 方案。

### 1. 内联样式（Inline Style）

直接通过元素的 `style` 属性书写样式。优先级最高，但维护性最差。

```html
<p style="color: red; font-size: 18px; line-height: 1.6;">
  这是一段红色的文字。
</p>
```

**使用场景**：

- 动态计算的样式（比如 <code v-pre>style={{ width: calculatedValue }}</code>）
- 需要覆盖所有外部样式（极少使用）
- HTML 邮件模板（因为邮件客户端对外部 CSS 支持较差）

**缺点**：

- 样式与结构混在一起，无法复用
- 不能使用伪类、伪元素、媒体查询
- 对代码可读性与维护性都是负担

### 2. 内部样式（Internal / Embedded Style）

通过 HTML 中的 `<style>` 标签写在 `<head>` 里。

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>内部样式示例</title>
    <style>
      body {
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        background-color: #f5f7fa;
      }
      h1 {
        color: #2c3e50;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h1>你好，CSS</h1>
  </body>
</html>
```

**使用场景**：单个页面的独立样式、临时 demo。

### 3. 外部样式（External Style Sheet）

将 CSS 写在独立的 `.css` 文件中，通过 `<link rel="stylesheet">` 引入。**这是推荐且最常用的方式**。

```html
<link rel="stylesheet" href="style.css" />

<!-- 也可以设置 media 属性，只在特定条件下生效 -->
<link rel="stylesheet" href="print.css" media="print" />
<link
  rel="stylesheet"
  href="mobile.css"
  media="screen and (max-width: 768px)"
/>
```

在 `style.css` 中：

```css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #fff;
  color: #333;
}
```

**优点**：

- 样式与结构完全分离，便于维护
- 多页面可以复用同一个 CSS 文件
- 浏览器可缓存，加速重复访问
- 方便使用浏览器的"查看源码"进行调试

### 4. `@import` 规则（了解即可）

`@import` 可以在一个 CSS 文件中引入另一个 CSS 文件。

```css
/* 必须写在所有普通规则之前 */
@import url("reset.css");
@import url("layout.css") screen;

body {
  /* ... */
}
```

⚠️ **注意**：`@import` 会**阻塞样式的并行加载**（浏览器必须先下载主 CSS，再下载被导入的 CSS），因此一般不推荐在生产环境使用（构建工具会自动帮你合并）。现代工程中用打包工具或 `@use`（Sass）代替。

### 引入方式优先级

当多种方式同时作用在同一个元素上时，**优先级从高到低**大致为：

1. `!important` 声明（任何位置都可，但极力不推荐）
2. 内联样式（`style` 属性）
3. 内部样式 / 外部样式（取决于它们在 HTML 中的位置，后者覆盖前者）
4. 浏览器默认样式（user agent stylesheet）

---

## 二、CSS 语法结构

一条 CSS 规则由 **选择器（Selector）** 和 **声明块（Declaration Block）** 组成。

```text
┌ 选择器 ───┐  ┌──────────────── 声明块 ────────────────┐
    h1         { color: red; font-size: 24px; }
             │      │      │      │
             │      │      │      │
             │    属性   冒号   值    分号
             └──────────────────────────────────────────┘
```

### 规则示例

```css
/* 1. 基本规则 */
h1 {
  color: #e74c3c;
  font-size: 2rem;
  font-weight: 700;
}

/* 2. 多条规则共用一个声明块（逗号是"或"的关系） */
h1,
h2,
h3 {
  font-family: inherit;
  line-height: 1.2;
}

/* 3. CSS 注释：不会出现在最终渲染中 */
/* 这是一行注释 */
/*
  这是多行注释
*/

/* 4. @-rules（At 规则） */
@media (max-width: 768px) {
  /* 当视口 <= 768px 时生效 */
  h1 {
    font-size: 1.5rem;
  }
}

@supports (display: grid) {
  /* 浏览器支持 grid 时才生效 */
  .layout {
    display: grid;
  }
}

@layer base, components, utilities; /* CSS Cascade Layers */
```

### 语法上的几个小知识点

1. **声明之间必须用分号 `;` 分隔**。最后一条声明的分号是可选的，但推荐统一加上，方便维护。
2. **属性名对大小写不敏感**（`COLOR` 和 `color` 是一样的），但规范写法始终小写。
3. **属性值对大小写是否敏感取决于属性本身**：颜色关键字 `red` 不敏感；URL、字体名、自定义属性 `--Color` 等是**大小写敏感**的。
4. **HTML 中的 `class` 对大小写敏感**；**自定义属性 `--Foo` 和 `--foo` 不是同一个**。
5. 多余的空白（空格、换行、制表符）在 CSS 中会被忽略，方便排版。

---

## 三、CSS 数值与单位

CSS 的单位分为**绝对单位**与**相对单位**两大类。

### 绝对单位（Absolute Units）

| 单位        | 含义                                                          | 典型使用场景                 |
| ----------- | ------------------------------------------------------------- | ---------------------------- |
| `px`        | 像素（屏幕上的一个物理点，在现代高 DPI 屏上已经是"逻辑像素"） | 精准尺寸（边框、间距、图标） |
| `pt`        | 点（Point，1/72 英寸）                                        | 打印样式                     |
| `pc`        | Pica，1 pc = 12 pt                                            | 打印                         |
| `in`        | 英寸（1 in = 2.54 cm）                                        | 打印                         |
| `cm` / `mm` | 厘米 / 毫米                                                   | 打印                         |

> 💡 **前端中几乎只使用 `px`，其他单位仅用于印刷或特殊需求。**

### 相对单位（Relative Units）

| 单位   | 含义                                                              | 相对于什么                                                                                          | 典型使用场景                   |
| ------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| `em`   | 当前元素的字体大小（若作用于 `font-size` 自身，则继承父元素字体） | 父 / 当前字体大小                                                                                   | 段落内缩进、与文字相关的间距   |
| `rem`  | **根元素（`html`）** 的字体大小                                   | `html` 的 `font-size`                                                                               | 全局统一的响应式布局           |
| `%`    | 百分比                                                            | 取决于属性：`width` 相对父元素；`line-height` 相对自身 `font-size`；`margin/padding` 相对父元素宽度 | 自适应尺寸                     |
| `vw`   | 视口宽度的 1%                                                     | 视口宽度                                                                                            | 响应式标题、整屏布局           |
| `vh`   | 视口高度的 1%                                                     | 视口高度                                                                                            | 全屏容器、移动端布局           |
| `vmin` | `min(vw, vh)`                                                     | 视口较小边                                                                                          | 正方形自适应元素               |
| `vmax` | `max(vw, vh)`                                                     | 视口较大边                                                                                          | 全屏封面                       |
| `ch`   | 数字 "0" 的宽度                                                   | 字体中 "0" 字符的宽                                                                                 | 控制单行文本长度               |
| `ex`   | 小写 "x" 的高度                                                   | 字体                                                                                                | 垂直排版（极少直接用）         |
| `lh`   | 元素自身的行高                                                    | 自身 `line-height`                                                                                  | 与行高对齐的间距（兼容性较差） |

### `em` 与 `rem` 的核心区别（面试高频）

```css
html {
  font-size: 16px;
} /* 浏览器默认 */

.article {
  font-size: 1.25rem; /* 1.25 * 16px = 20px */
  padding: 1em; /* 1em = 当前元素的 font-size = 20px */
}
.article p {
  font-size: 0.8em; /* 0.8 * 父元素 20px = 16px */
  padding: 1em; /* 16px */
}
```

- **`em` 会随层级累积**，嵌套越深越容易失控；
- **`rem` 始终相对根元素**，是现代响应式的首选单位。

### 无单位数值

- `line-height: 1.6;` —— 推荐无单位，子元素会继承系数而不是计算后的值
- `font-weight: 400;`
- `opacity: 0.8;`
- `z-index: 10;`
- `flex: 1;`

---

## 四、颜色系统

CSS 提供了多种颜色表示方法，它们最终都被浏览器解析为 **RGBA** 颜色空间。

### 1. 关键字颜色（Named Colors）

CSS 定义了 140+ 颜色关键字，常用的有：

```css
color: red;
color: blue;
color: green;
color: white;
color: black;
color: transparent; /* 完全透明（特殊关键字） */
color: currentColor; /* 继承当前 color 的值（非常好用） */
```

> `currentColor` 是 CSS 原生的第一个"变量"，让图标、边框等自动继承文字颜色。

### 2. 十六进制（HEX / Hexadecimal）

```css
color: #ff0000; /* #RRGGBB */
color: #f00; /* #RGB（简写，每一位重复一次） */
color: #ff000080; /* #RRGGBBAA（带透明度，AA = 80 表示 ~50%） */
color: #f008; /* #RGBA（简写） */
```

透明度的 16 进制换算：`00` = 完全透明，`FF` = 完全不透明。

### 3. RGB / RGBA

```css
color: rgb(255, 0, 0); /* 红 */
color: rgb(100%, 0%, 0%); /* 百分比写法（不推荐混合数字和百分比） */
color: rgba(255, 0, 0, 0.5); /* 带 50% 透明度的红 */
color: rgba(
  255 0 0 / 0.5
); /* CSS Colors Level 4 的新写法（空格分隔 + /alpha） */
color: rgba(255 0 0 / 50%); /* 新写法，alpha 支持百分比 */
```

### 4. HSL / HSLA

**HSL** = 色相（Hue） + 饱和度（Saturation） + 亮度（Lightness）。对人类来说比 RGB 更直观。

```css
color: hsl(0, 100%, 50%); /* 红色：色相 0°，满饱和度，中等亮度 */
color: hsl(120, 100%, 50%); /* 绿色 */
color: hsl(240, 100%, 50%); /* 蓝色 */
color: hsla(0, 100%, 50%, 0.8);
color: hsl(0 100% 50% / 0.8); /* 新语法 */
```

- **色相（H）**：取值 0–360（度），0 是红，120 绿，240 蓝
- **饱和度（S）**：0% = 灰，100% = 最鲜艳
- **亮度（L）**：0% = 黑，100% = 白，50% = 原色

### 5. CSS 颜色函数（CSS Colors Level 4 / OKLCH）

现代浏览器已经支持**感知更均匀**的色彩空间：

```css
color: oklch(68% 0.2 30); /* OKLCH：亮度 / 色饱和度 / 色相（最推荐） */
color: oklab(68% 0.1 0.1); /* OKLab */
color: lch(50% 100 30);
color: lab(50% 30 -30);

/* 色彩混合 */
background: color-mix(in oklch, red, blue);
```

> 💡 **为什么要了解 OKLCH？**
> HSL 中同样的 "50% 亮度"在不同色相下人眼感知并不一致（绿色看起来更亮）。OKLCH 是**感知均匀**的色彩空间，适合做设计系统的色阶生成。

### 6. `transparent` 与 `currentColor`

```css
.ghost-button {
  color: #3b82f6;
  border: 1px solid currentColor; /* 自动跟随 color 变化 */
  background-color: transparent;
}
```

---

## 五、CSS 注释与空白

```css
/* 这是单行注释 */

/*
 * 这是
 * 多行注释
 */

/* 注释可以放在规则之间，也可以放在声明块里（但不能嵌套） */
.selector {
  /* color: red;  —— 临时禁用的声明 */
  font-size: 16px;
}
```

> ❌ CSS 没有 `//` 注释语法，**`//` 在 CSS 里属于非法字符，会被解析器吞掉**。Sass/Less 等预处理器支持 `//`。

---

## 六、CSS 变量（自定义属性，Custom Properties）

虽然归类在 "基础"，但 CSS 变量是现代 CSS 最重要的特性之一。

```css
/* 1. 在 :root（根元素）上声明，整个文档都可用 */
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --font-size-base: 16px;
  --spacing-md: 12px;
  --radius-sm: 4px;
}

/* 2. 使用 var() 读取 */
.button {
  background-color: var(--color-primary);
  color: #fff;
  padding: var(--spacing-md) calc(var(--spacing-md) * 2);
  border-radius: var(--radius-sm);
}

/* 3. 变量可以指定默认值，当变量未定义时使用 */
.card {
  background: var(--card-bg, #fff);
  box-shadow: var(--card-shadow, 0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 4. 变量是动态的：可以在子作用域中覆盖 */
.dark-theme {
  --color-primary: #60a5fa;
  --card-bg: #1f2937;
}
```

**关键特性**：

- 变量名必须以 `--` 开头（避免与未来的 CSS 关键字冲突）
- **区分大小写**：`--Color` 与 `--color` 是不同的
- **可以参与计算**：`calc(var(--base) * 2)`
- **可以被 JS 读取/修改**：
  ```js
  document.documentElement.style.setProperty("--color-primary", "#f00");
  const val = getComputedStyle(document.documentElement).getPropertyValue(
    "--color-primary",
  );
  ```
- 可以作用于 `@property`（CSS Houdini），让浏览器知道变量的类型，实现**可过渡/可动画**的自定义属性。

---

## 七、样式层叠与继承（Cascade & Inheritance）初步认知

"CSS" 中的 "C" 是 **Cascading（层叠）**，这是它最核心的机制。这里只给一个基础认识，后续章节会详细展开。

### 1. 什么会被继承？

与**文本排版**相关的属性会自动继承：

- `color`、`font-*`、`line-height`、`text-align`、`letter-spacing`
- `list-style-*`、`cursor`、`visibility`

与**布局/盒子**相关的属性**不会**继承：

- `margin`、`padding`、`border`、`background`、`width`、`height`、`position`

强制继承：`color: inherit;`
强制不继承：`color: initial;` / `color: unset;`（unset = 可继承就继承，不可继承就重置）

### 2. 什么是层叠？

当同一个属性被多条规则声明时，浏览器按以下顺序**从低到高**采用（高者胜出）：

1. 浏览器默认样式（User Agent stylesheet）
2. 用户自定义样式（User stylesheet，几乎没有）
3. 开发者的 CSS（Author stylesheet）
4. 开发者 `!important`
5. 用户 `!important`（几乎没有）
6. 浏览器 `!important`

同一层级内再按**特异性（Specificity）** 和 **源顺序（Order）** 比较——**同等特异性下，写在后面的覆盖前面的**。

> 本节会在"选择器"章节中通过优先级计算详细讲解。

---

## 八、一些容易被忽视的"基础知识"

### 1. 属性简写（Shorthand）

```css
/* margin 的四值顺序：上 右 下 左（顺时针） */
margin: 10px 20px 30px 40px; /* top right bottom left */
margin: 10px 20px; /* 上下 10，左右 20 */
margin: 10px; /* 四面都是 10 */

/* font 简写：style weight size/line-height family（必须至少有 size 和 family） */
font:
  italic 700 16px/1.5 "PingFang SC",
  sans-serif;

/* background 简写：color image position/size repeat attachment origin clip */
background: #f00 url("x.png") 50% 50% / cover no-repeat;
```

⚠️ **陷阱**：简写属性会把你没写的值重置为初始值。下面例子中第二个声明会把 `border-top-color` 还原回初始颜色（通常是 `currentColor`），而不是保留红色！

```css
.a {
  border-top: 2px solid red;
  border: 1px solid #000; /* 先设了四面，再单独设置一个方向时顺序相反就没事；
                               但如果先单独后整体，整体会覆盖单独设置。 */
}
```

### 2. `inherit` / `initial` / `unset` / `revert`

```css
.a {
  color: inherit; /* 强制继承父元素的 color（常用于覆盖继承链被打断的情况） */
  margin: initial; /* 使用该属性的初始值（margin 的初始值是 0） */
  padding: unset; /* 可继承属性 → inherit；不可继承属性 → initial */
  border: revert; /* 回到浏览器或用户样式表中的值（较少用） */
}
```

### 3. `all` 属性

一键重置所有属性：

```css
.reset {
  all: unset;
} /* 全部 unset：继承可继承，不可继承用 initial */
```

---

## 九、本章小结与最佳实践

✅ **推荐做法**：

1. **样式全部放在外部 CSS 文件**，通过 `<link>` 引入，而不是内联或内部；
2. **使用 CSS 变量**定义颜色、间距、字号等主题化的值；
3. **优先使用相对单位 `rem`** 做字号与响应式间距；`px` 用于精确的边框等；
4. **`line-height` 用无单位值**（如 `1.6`），便于正确继承；
5. **`color` 里合理使用 `currentColor`**，减少重复；
6. **保持声明顺序一致**（布局 → 盒模型 → 视觉 → 文本），便于其他人阅读。

❌ **避免做法**：

1. 滥用 `!important`（几乎唯一合理场景是覆盖第三方库的内联样式）；
2. 在大型项目中使用内联样式；
3. 使用 `@import` 串联引入大量 CSS（影响加载性能）；
4. 随意混用颜色格式（项目内统一 HEX 或 OKLCH）。

下一章我们将深入学习**选择器**，掌握更精准地"选中元素并施加样式"的能力。
