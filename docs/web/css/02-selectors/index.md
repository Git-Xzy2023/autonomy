---
title: 选择器
---

# 选择器

> **选择器（Selector）** 是 CSS 的"灵魂"。它告诉浏览器：**哪些元素要被应用下面的样式**。掌握选择器，意味着你可以精准地"指哪儿打哪儿"，而不是粗暴地加 `id` 或 滥用 `!important`。

本章系统地梳理所有主流选择器、它们的写法、适用场景以及**如何计算优先级（Specificity）**。

---

## 一、基础选择器（Simple Selectors）

### 1. 通配符选择器（Universal Selector）

```css
* {
  box-sizing: border-box;  /* 非常常见的全局 reset 写法 */
  margin: 0;
  padding: 0;
}
```

- 匹配**所有元素**（包括 `html`、`body`、伪元素 `::before`、`::after` 等）。
- **优先级最低**（特异性为 0,0,0）。
- 现代工程中一般仅在 reset.css 里使用，不推荐在具体业务模块里滥用（性能差、容易意外地覆盖子元素样式）。

### 2. 元素/类型选择器（Type Selector）

```css
p { margin: 1em 0; }
h1 { font-size: 2rem; }
a { color: #3b82f6; }
```

- 以 HTML 标签名直接选择元素。
- 常用于**全局基础样式**或 reset。

### 3. 类选择器（Class Selector）

```css
.btn { padding: 8px 16px; }
.btn--primary { background: #3b82f6; color: #fff; }
.btn-large { font-size: 18px; }
```

- 通过 `.类名` 匹配带对应 `class` 的元素。
- 最常见、最灵活的选择器，现代前端几乎所有样式都应通过 class 来组织。
- 一个元素可以有多个 class（`<div class="btn btn--primary">`），组合使用是 BEM 方法论的核心。

### 4. ID 选择器（ID Selector）

```css
#app-header {
  position: sticky;
  top: 0;
}
```

- 通过 `#id` 匹配带对应 `id` 的元素。
- 优先级**高于类选择器**（这通常是个坑：你想用 class 覆盖 id 的样式，会失败）。
- **推荐在 CSS 中少用 ID 选择器**，因为它们不可复用、优先级高、会造成后续难以维护的"特异性战争"。ID 更适合给 JS 做 DOM 查询锚点。

### 5. 属性选择器（Attribute Selector）

以元素的属性（如 `type`、`href`、`data-*`）为条件进行匹配。

| 语法 | 含义 | 示例 |
| --- | --- | --- |
| `[attr]` | 存在 `attr` 属性 | `a[target]` |
| `[attr="val"]` | 属性值**精确等于** `val` | `input[type="checkbox"]` |
| `[attr~="val"]` | 属性值**以空格分隔的词中**包含 `val` | `[data-tags~="css"]` |
| `[attr\|="val"]` | 属性值**等于 `val` 或以 `val-` 开头** | `[lang\|="zh"]`（匹配 zh、zh-CN…） |
| `[attr^="val"]` | 属性值**以 `val` 开头** | `a[href^="https://"]` |
| `[attr$="val"]` | 属性值**以 `val` 结尾** | `a[href$=".pdf"]` |
| `[attr*="val"]` | 属性值**任意位置**包含 `val`（子串匹配） | `[class*="btn-"]` |

**真实用例**：

```css
/* 选中所有外部链接，加上箭头图标 */
a[href^="http"]::after {
  content: " ↗";
  font-size: 0.75em;
}

/* 选中所有 PDF 链接 */
a[href$=".pdf"]::before {
  content: "📄 ";
}

/* 禁用的输入框 */
input[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* data-* 属性做视觉变体（比多写一个 class 更"语义"） */
.button[data-variant="ghost"] {
  background: transparent;
  border: 1px solid currentColor;
}
```

属性选择器的**优先级与类选择器相同**（即 (0,1,0)）。

### 6. 伪类选择器（Pseudo-classes）

伪类以单冒号 `:` 开头，表示元素的**状态**或**上下文关系**，比如 `:hover`、`:first-child`、`:checked` 等。

按用途大致分为：

#### A. 用户交互伪类（User Action）

```css
a:link    { color: blue; }    /* 未访问过的链接 */
a:visited { color: purple; }  /* 已访问过（浏览器隐私限制：仅能改颜色等少数属性） */
a:hover   { color: red; }     /* 鼠标悬停 */
a:active  { color: orange; }  /* 正在被点击（按下未弹起） */
a:focus   { outline: 2px solid #0066cc; } /* 获得键盘焦点 */
```

💡 **记忆顺序**：`LVHA`（**L**ink **V**isited **H**over **A**ctive）。如果顺序错了，后面的会被前面的覆盖而失效。

#### B. 结构伪类（Structural）

它们基于元素在 HTML 中的位置进行选择。

```css
/* 作为第一个/最后一个子元素 */
li:first-child { color: red; }
li:last-child  { color: blue; }
li:only-child  { font-weight: bold; }

/* 第 n 个孩子（n 从 1 开始，支持表达式） */
li:nth-child(2) { color: green; }      /* 第 2 个 */
li:nth-child(2n) { background: #eee; }  /* 偶数项（也可以写 even） */
li:nth-child(2n+1) { background: #f5f5f5; } /* 奇数项（也可以写 odd） */
li:nth-child(-n+3) { font-weight: 700; }     /* 前 3 个 */
li:nth-last-child(2) { color: orange; }      /* 倒数第 2 个 */

/* 上面几个伪类都是"在所有兄弟里排序"。
   下面几个是"在同类型的兄弟里排序"——非常容易搞混！ */
article h2:first-of-type  { margin-top: 0; }   /* 第一个 <h2> */
article p:last-of-type    { margin-bottom: 0; } /* 最后一个 <p> */
article p:nth-of-type(2)  { color: purple; }    /* 第 2 个 <p> */
article p:only-of-type    { color: teal; }      /* 唯一一个 <p> */
```

⚠️ **`-child` vs `-of-type` 的核心区别**：

- `p:first-child`：**必须是父元素的第 1 个子元素，并且是 `<p>`**。如果父元素里先出现一个 `<h1>`，那 `<p>` 永远选不到。
- `p:first-of-type`：**在所有 `<p>` 兄弟里排第一的那个**。不要求它是父元素的第一个子元素。

这是一道**高频面试题**，务必分清楚。

#### C. 表单状态伪类（UI States）

```css
input:enabled  { /* ... */ }
input:disabled { opacity: 0.6; }
input:checked  + label { font-weight: 700; }  /* 被选中的单选/复选框 */
input:required { border-color: red; }
input:optional { border-color: #ccc; }
input:valid    { border-color: green; }        /* 通过原生校验的 */
input:invalid  { border-color: red; }          /* 未通过的 */
input:in-range { background: lightgreen; }
input:out-of-range { background: lightpink; }
input:read-only { background: #eee; }
input:read-write { background: #fff; }
```

#### D. 否定伪类：`:not(selector)`

```css
/* 除了最后一个，其他项都加分隔线 */
.item + .item:not(:last-child) {
  border-top: 1px solid #eee;
}

/* 任何不含 .no-margin 的 .box 都加 margin */
.box:not(.no-margin) { margin: 12px; }

/* 支持传入多个选择器（现代浏览器，Level 4） */
button:not(:disabled, .plain) { background: #3b82f6; color: #fff; }
```

`:not()` 的一个神奇特性是：**它本身不会增加特异性**，其优先级等于内部选择器的优先级。例如 `:not(#x)` 的特异性是 (1,0,0)。

#### E. 其他实用伪类

```css
/* :is() 和 :where()（Level 4）——都是"任选其一命中即可" */
/* :is() 取参数中最高的特异性；:where() 特异性永远为 0 */
:is(h1, h2, h3, h4) { margin-top: 1.5em; }
.card :where(.title, .subtitle) { color: #222; }  /* 不会与子组件特异性打架 */

/* :has()（Level 4，相对新，但非常强大——"父选择器"） */
form:has(input:invalid) button[type="submit"] {
  opacity: 0.5;
  cursor: not-allowed;
}
.card:has(img) { padding: 0; }  /* 包含图片的卡片去掉内边距 */

/* :root 选择文档根元素（HTML 中就是 <html>） */
:root { --primary: #3b82f6; }   /* 用于定义全局 CSS 变量 */

/* :empty 选择没有任何子元素（也没有文本节点）的元素 */
p:empty { display: none; }
```

> 💡 `:has()` 是 CSS 史上最接近"父选择器"的东西——它让你可以根据**子元素的存在与否**来给父元素加样式，颠覆了以往 CSS 只能"从上到下"选择的思维方式。

### 7. 伪元素选择器（Pseudo-elements）

伪元素以**双冒号 `::`** 开头（CSS3 规范），用于选中**不存在于 DOM 中的"虚拟部分"**，例如文本的第一个字母、某个元素前后插入的内容等。

> 为向后兼容，浏览器允许写成单冒号（如 `:before`），**但规范推荐新写法用 `::`**。

```css
/* 最常用：在元素前/后插入内容 */
.tag::before {
  content: "# ";           /* content 是必需的！不写 content 就不会显示 */
  color: #999;
}
.external-link::after {
  content: "↗";
  display: inline-block;
  margin-left: 4px;
}

/* 文本装饰类 */
p::first-letter { font-size: 2em; font-weight: 700; color: #b91c1c; }
p::first-line   { text-transform: uppercase; }

/* 用户选中的文本高亮色 */
::selection { background: #fef08a; color: #111; }

/* 表单占位符 */
input::placeholder { color: #9ca3af; font-style: italic; }

/* 列表 / 滚动条等 */
ul li::marker { color: red; font-weight: 700; }  /* 列表项前的"点" */
::-webkit-scrollbar { width: 8px; }              /* 滚动条（WebKit） */
```

> 📌 **伪类 vs 伪元素** — 面试高频题：
>
> - **伪类**（:hover, :nth-child, :not）：选择"处于某个状态/位置的真实元素"，特异性按 (0,1,0) 算。
> - **伪元素**（::before, ::after, ::first-letter）：选择"并不真实存在的虚拟部分"，特异性按 (0,0,1) 算（等同元素选择器）。

---

## 二、组合器（Combinators）

组合器用于把多个选择器**按结构关系组合**在一起。

| 组合器 | 写法 | 含义 | 示例 |
| --- | --- | --- | --- |
| 后代组合器 | 空格 | 选中 A **内部的** B（无论嵌套多深） | `.nav a` |
| 子组合器 | `>` | 选中 A **直接子元素** B（只下一层） | `.nav > li` |
| 相邻兄弟组合器 | `+` | 选中 A **紧邻其后**的同级 B | `h2 + p`（紧跟 h2 的 p） |
| 通用兄弟组合器 | `~` | 选中 A **之后所有**同级 B | `h2 ~ p`（h2 之后所有 p） |

```css
/* 1. 后代组合器（空格） */
.nav a { color: #333; }  /* .nav 内部任何层级的 <a> */

/* 2. 子组合器（>） */
.nav > li { list-style: none; }  /* 仅 .nav 的直接 <li> */

/* 3. 相邻兄弟（+）：紧跟在 h2 后面的第一个 p */
h2 + p { margin-top: 0; }

/* 4. 通用兄弟（~）：h2 后面的所有同级 p */
h2 ~ p { color: #555; }
```

💡 组合器本身**不会增加特异性**，只负责"关系表达"。特异性只计算组合器两侧的选择器。

---

## 三、选择器组（Selector List）

用逗号分隔的多个选择器，表示"任一命中即生效"：

```css
h1, h2, h3, h4 { line-height: 1.2; font-weight: 700; }
```

⚠️ **陷阱**：如果选择器组中**任何一个选择器是非法的**（浏览器不认识），则**整个规则全部失效**。这就是为什么需要 `-webkit-` 前缀的属性通常要分开写。

```css
/* 错误示范：老旧浏览器不认识 :has()，整行失效 */
h2, :has(img) { color: red; }

/* 正确：分开写，或用 :is() —— :is() 会默默忽略不认识的参数 */
h2 { color: red; }
:is(:has(img)) { color: red; }
```

---

## 四、特异性 / 优先级（Specificity）详解

> **这是学习 CSS 必须掌握的核心知识，没有之一。** 所有"为什么我的样式没生效"的问题，90% 都与特异性相关。

### 1. 特异性的四元组

一条选择器的特异性是一个形如 **(A, B, C, D)** 的四元组：

| 级别 | 内容 | 得分点 |
| --- | --- | --- |
| A | 内联样式（`style="..."`） | 存在则 +1 |
| B | ID 选择器（`#id`） | 每出现一次 +1 |
| C | 类选择器（`.class`）、属性选择器（`[attr]`）、伪类（`:hover`） | 每出现一次 +1 |
| D | 元素选择器（`div`）、伪元素（`::before`） | 每出现一次 +1 |

以下元素**不计入特异性**：

- 通配符 `*`
- 组合器（空格、`>`、`+`、`~`）
- `:not()`、`:is()`、`:has()` 本身（但它们内部的选择器算）
- `:where()`（内部选择器也不计！）

### 2. 计算示例

```css
*                {}    /* (0,0,0,0) */
li               {}    /* (0,0,0,1) */
ul li            {}    /* (0,0,0,2) */
ul li + li       {}    /* (0,0,0,3) */
.item            {}    /* (0,0,1,0) */
ul .item         {}    /* (0,0,1,1) */
[type="text"]    {}    /* (0,0,1,0) */
li.item:hover    {}    /* (0,0,2,1) */
#nav             {}    /* (0,1,0,0) */
#nav .item       {}    /* (0,1,1,0) */
#nav a.active    {}    /* (0,1,1,1) */
style 属性内联样式   /* (1,0,0,0) */

/* 特殊：:is() / :has() / :not() 取内部参数中最高的特异性 */
:is(#nav, .menu) li {}  /* 因为 #nav 是 (0,1,0,0)，整体等效 (0,1,0,1) */
:where(#nav) li      {}  /* 永远 (0,0,0,1)！where 不会增加特异性 */
```

### 3. 比较规则

从高位开始比较，**高位大的就直接胜出**，不需要再加低位。例如：

- `(0,1,0,0)` 永远胜 `(0,0,99,99)`
- `(0,0,2,0)` 永远胜 `(0,0,1,99)`

**"特异性战争"**：当你试图覆盖 `#nav a.active` 时，你的新样式也必须达到 (0,1,1,1) 以上才能生效，所以不得不加更多 ID 或 class，无限升级。这就是为什么**推荐用 class + 一致的命名规范（如 BEM）**，从一开始就避免引入高特异性选择器。

### 4. 源顺序（Source Order）

当两条规则的**特异性完全相同时**，**写在后面（更靠近被引用元素）的规则胜出**。

```css
.card { color: blue; }
.card { color: red; }  /* 同一个选择器，后写的覆盖先写的 → 最终红色 */
```

### 5. `!important`

`!important` 直接覆盖上述所有规则（除了另一个 `!important`）。在大型项目中这等于"作弊"——一旦开了先例，就会有越来越多的 `!important` 去覆盖别人的 `!important`。

> 🎯 **原则**：普通业务代码中**永远不要使用 `!important`**。只有当你需要覆盖不受你控制的内联样式（如第三方组件、JS 注入的 style）时才是合理场景。

**完整的优先级天梯（从高到低）**：

1. 开发者写的 `!important`
2. 内联样式（`style` 属性）
3. 内部/外部 CSS，按特异性排序 → 再按源顺序
4. 浏览器默认样式（User Agent stylesheet）

---

## 五、继承（Inheritance）回顾

有些属性会**从父元素自动继承到子元素**，这可以大幅减少重复代码。

| 常被继承 | 不被继承 |
| --- | --- |
| `color` | `background` |
| `font-size` / `font-family` / `font-weight` | `width` / `height` |
| `line-height` | `margin` / `padding` / `border` |
| `text-align` / `text-*` 系列 | `display` / `position` |
| `letter-spacing` / `word-spacing` | `top` / `left` 等定位值 |
| `cursor` / `visibility` | `transform` / `opacity`（看似"继承"，实际是视觉叠加） |
| `list-style-*` | `overflow` |

强制继承：`color: inherit`
强制使用初始值：`margin: initial`
智能重置（继承或初始）：`padding: unset`
恢复到浏览器默认（几乎不用）：`color: revert`

---

## 六、层叠（Cascade）与层叠层（CSS Layers）

**完整的层叠顺序**（从低到高，高者覆盖低者）：

1. 浏览器默认样式（User Agent）
2. 用户自定义样式
3. 开发者的普通 CSS（Author，无 `!important`）
4. 开发者的 `!important`
5. 用户的 `!important`
6. 浏览器的 `!important`

在"开发者的普通 CSS"同一层级内，再按"特异性 → 源顺序"比较。

**CSS Cascade Layers（`@layer`，2022 年进入规范）**：

允许你**主动划分多个"样式层"并声明它们之间的优先级**，**后声明的层优先级更高**，哪怕里面的选择器特异性更低也能胜过高特异性的层。这对于**设计系统**、**覆盖第三方样式**非常有用：

```css
@layer base, components, utilities;   /* 声明三个层，越靠后优先级越高 */

@layer base {
  /* 低优先级的基础样式——写什么都容易被覆盖 */
  h1 { font-size: 2rem; }
}

@layer components {
  /* 组件样式，优先级比 base 高 */
  .card { border: 1px solid #e5e7eb; }
}

@layer utilities {
  /* 工具类，优先级最高 */
  .text-center { text-align: center !important; }
}

/* 不在任何 layer 里的样式优先级最高（覆盖所有层），
   这意味着你可以很轻松地覆盖第三方库通过 @layer 导出的样式。*/
```

---

## 七、选择器性能（Performance）

过去人们对"深层嵌套选择器性能差"非常敏感（例如 `.app .main .content .list .item .title {}`），这在 10 年前确实是个问题。但**现代浏览器的 CSS 匹配引擎已经非常快**，一般业务场景下选择器深度对性能影响微乎其微。

真正影响性能的是：

- **极大量的规则**（数千条以上）
- 频繁触发的 `:hover`、`:focus-within` 等高频率重绘类
- 在动画中使用需要重排的属性（如 `width`、`top`）
- 对大范围元素使用 `* { transition: all 0.3s }`

**书写建议**：

1. 保持选择器**简洁**（2–3 级足矣）
2. **优先使用 class**，让选择器语义化、可读
3. 不要写 `body div ul li a span {}` 这种深层链——它耦合了 DOM 结构，难以维护
4. 组合使用 `:is()` / `:where()` 降低重复代码
5. 用 BEM / CSS Module / Tailwind 等工程化手段**从根源上避免特异性战争**

---

## 八、BEM（Block Element Modifier）速览

BEM 是一种"通过命名约定来确保低特异性、高可维护性"的写法：

```text
Block（块）         .card
                     └ 一个独立、可复用的组件

Element（元素）     .card__title
                     └ 块内部的组成部分，用双下划线

Modifier（修饰符）  .card--dark    .card__title--featured
                     └ 变体/状态，用双破折号
```

```html
<div class="card card--dark">
  <h2 class="card__title card__title--featured">标题</h2>
  <p class="card__body">正文</p>
  <a class="card__link card__link--external" href="#">链接</a>
</div>
```

**好处**：

- 每个类都是 (0,1,0) 的特异性，互相之间天然平等，不存在"覆盖不了"的问题
- 命名自带"结构信息"，一看就知道它属于哪个组件
- 便于组件库化、便于多人协作
- 易于 `grep` 搜索、重构或删除

---

## 九、实战练习：判断输出

**题 1**：下面的 `<p>` 最终是什么颜色？

```html
<p class="text red" id="demo">Hello</p>
<style>
  #demo   { color: blue; }
  .red    { color: red !important; }
  p       { color: green; }
</style>
```

<details>
<summary>查看答案</summary>

**红色**。因为 `.red` 上有 `!important`，在整个层叠顺序中最高。如果去掉 `!important`，则 `#demo` 的 (0,1,0,0) 高于 `.red` 的 (0,0,1,0)，就会是蓝色。
</details>

**题 2**：下面的 `<p>` 最终是什么颜色？

```html
<article class="post">
  <p>Hello</p>
</article>
<style>
  article p  { color: red; }
  .post > p  { color: blue; }
  .post p    { color: green; }
</style>
```

<details>
<summary>查看答案</summary>

**绿色**。三条规则特异性都是 (0,0,1,1)，源顺序越靠后越优先。如果想让 blue 胜出，应该把它挪到最后。
</details>

---

## 十、本章小结

1. **选择器是 CSS 的基础中的基础**——不仅要认识它们，更要知道**它们在工程里为什么这么写**。
2. **特异性（优先级）是必考题**，记住四元组 (A,B,C,D) 的计算方法，理解它如何导致"样式战争"。
3. **伪类和伪元素是不同的东西**：一个是"状态/上下文"，一个是"虚拟节点"。
4. **`:is()` / `:where()` / `:not()` / `:has()`** 让选择器表达力大幅提升，面试中它们属于"加分知识点"。
5. **BEM 不是唯一选择**，但它用最低心智负担解决了特异性和命名的问题，值得每个团队了解。

下一章我们会深入**盒模型**，看看 `box-sizing` 等特性如何影响元素尺寸的计算。
