---
title: 盒模型
---

# 盒模型（Box Model）

> 文档中的**每个元素**，在浏览器眼里都是一个**矩形盒子**。这个盒子由四部分组成，从内到外依次是：
>
> - **content**（内容）
> - **padding**（内边距）
> - **border**（边框）
> - **margin**（外边距）
>
> 理解盒子如何计算尺寸、如何与相邻盒子互动，是实现任何布局的前提。

---

## 一、盒模型四件套

```text
┌──────────────────────────────────────┐
│         margin（外边距，透明）        │
│  ┌─────────────────────────────────┐ │
│  │    border（边框）               │ │
│  │  ┌─────────────────────────┐   │ │
│  │  │   padding（内边距）     │   │ │
│  │  │  ┌───────────────────┐  │   │ │
│  │  │  │  content（内容） │  │   │ │
│  │  │  │    宽 × 高        │  │   │ │
│  │  │  └───────────────────┘  │   │ │
│  │  │                         │   │ │
│  │  └─────────────────────────┘   │ │
│  │                                │ │
│  └─────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

### 1. 内容区（Content）

元素真正用来显示内容的区域。由 `width` / `height` 或 `inline-size` / `block-size` 控制。

```css
.box {
  width: 200px;
  height: 100px;
  background: #eee;
}
```

### 2. 内边距（Padding）

内容与边框之间的"呼吸空间"。背景色会延伸到 padding。

```css
/* 四值：上 右 下 左 */
padding: 10px 20px 30px 40px;

/* 两值：上下 / 左右 */
padding: 12px 24px;

/* 单值：四面一致 */
padding: 16px;

/* 单独某边 */
padding-top: 8px;
padding-right: 16px;
padding-bottom: 8px;
padding-left: 16px;

/* 逻辑属性（随 writing-mode 变化） */
padding-inline: 16px;   /* 行内方向的两侧 */
padding-block: 8px;    /* 块级方向的两侧 */
```

### 3. 边框（Border）

```css
/* 三合一简写：宽度 样式 颜色 */
border: 1px solid #ccc;

/* 也可以单独写 */
border-width: 1px;
border-style: solid;   /* solid / dashed / dotted / double / groove / ridge / inset / outset / none */
border-color: #ccc;

/* 单条边 */
border-top: 2px dashed red;
border-bottom: 1px solid #ddd;

/* 圆角 */
border-radius: 8px;
border-radius: 8px 16px;          /* 左上+右下 / 右上+左下 */
border-radius: 4px 8px 12px 16px; /* 顺时针对角：左上 右上 右下 左下 */
border-radius: 50%;                /* 圆（当宽高相等时） */

/* 图片边框（不常用但存在） */
border-image: url(border.png) 30 round;
```

### 4. 外边距（Margin）

盒子与**其他盒子之间**的空白。背景色**不会**延伸到 margin。

```css
margin: 10px 20px 30px 40px;   /* 顺时针：上 右 下 左 */
margin: 12px 24px;             /* 上下 / 左右 */
margin: auto;                  /* 经典：水平居中（配合指定 width） */

/* 逻辑属性 */
margin-inline: auto;           /* 行内方向两侧自动 —— 现代写法的水平居中 */
margin-block: 16px;
```

> 📌 `margin: auto` 只能在**水平方向**做居中，且要求元素有一个明确的 `width`。垂直方向的 `auto` 会被解析为 0。

---

## 二、`box-sizing`：两种尺寸计算模式

这是本节最重要的属性，也是前端面试几乎必考的点。

### 模式 1：`content-box`（默认值，W3C 标准盒）

```css
box-sizing: content-box;
```

- `width` / `height` **只定义了内容区**的尺寸
- 最终显示的盒子总宽 = `width + padding-left/right + border-left/right`
- margin 不参与盒子内部尺寸计算，只影响外部间距

**示例**：

```css
.box {
  width: 200px;
  padding: 0 20px;
  border: 2px solid #000;
  box-sizing: content-box; /* 默认值 */
}
/* 实际内容渲染宽度 = 200px
             padding   = 40px  (左 20 + 右 20)
             border    = 4px   (左 2 + 右 2)
             总可见宽度 = 244px */
```

开发者设置了 `200px`，但浏览器实际展示了 **244px**——这就是为什么老项目里你总是需要"心算"。

### 模式 2：`border-box`（怪异盒 / IE 盒 / 推荐）

```css
box-sizing: border-box;
```

- `width` / `height` **定义了整个盒子的尺寸**（包括 content + padding + border）
- 内容区实际尺寸 = `width − padding − border`

同样示例：

```css
.box {
  width: 200px;
  padding: 0 20px;
  border: 2px solid #000;
  box-sizing: border-box;
}
/* 盒子总宽度 = 200px
   padding + border = 44px
   实际内容宽度   = 156px */
```

开发者设置 `200px`，浏览器就渲染成 **200px**，不需要心算。

### 工程化默认设置

几乎所有现代项目都会在 reset.css 顶部这样写：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

这样一来，项目里所有元素默认就是"你写多宽就是多宽"的直观行为，大幅减少 bug。

---

## 三、`outline` 与 `box-shadow`："伪边框"

它们视觉上类似 border，但**不计入盒子尺寸**，非常有用。

### 1. `outline`（轮廓线）

```css
/* 简写：宽度 样式 颜色 */
outline: 2px solid #0066cc;

/* 与外边距之间的空隙 */
outline-offset: 2px;   /* 让 outline 与元素本体之间有 2px 间距 */
```

- 始终是**整个矩形框**（不跟随 `border-radius`——早期是这样，现代浏览器已逐步支持圆角跟随）
- **不占空间**，不会改变盒子尺寸
- 常用于**键盘可访问性**的焦点样式：`:focus-visible { outline: 2px solid #0066cc; outline-offset: 2px; }`

### 2. `box-shadow`（阴影）

```css
/* 偏移 x | 偏移 y | 模糊半径 | 扩散半径 | 颜色 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* 多阴影叠加（逗号分隔，前面的在上层） */
box-shadow:
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* inset 内阴影 */
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
```

`box-shadow` 也不占布局空间，只会超出盒子。常用于卡片、按钮的视觉层次。

> 💡 **一个小技巧**：如果想给元素加一条视觉边框，但又**不希望它改变盒子尺寸**（比如 hover 时临时加个轮廓而避免跳动），可以用 `outline` 代替 `border`，或者用 `box-shadow: 0 0 0 2px #0066cc inset`。

---

## 四、margin 合并（Margin Collapsing）

这是盒模型里最容易踩坑、最经典的考点。

### 1. 什么是 margin 合并？

**在常规流（Normal Flow）中，两个或多个相邻盒子的 `margin` 会合并成一个 `margin`**，大小等于它们当中**最大的那个**。

```html
<div class="box-1">盒子 1</div>
<div class="box-2">盒子 2</div>
<style>
  .box-1 { margin-bottom: 30px; }
  .box-2 { margin-top: 20px; }
</style>
```

你可能以为它们中间会有 `30 + 20 = 50px` 的空隙，**实际只有 `30px`**——两个 margin 合并成一个，取最大值。

### 2. 发生合并的三种情况

#### A. 相邻兄弟元素（最常见）

```html
<p>段落 1</p>
<p>段落 2</p>
<style>
  p { margin: 16px 0; }  /* 上下各 16px，但两段之间实际还是 16px，不是 32px */
</style>
```

#### B. 父子元素之间（第一个子元素的 margin-top 溢出父元素）

```html
<header>
  <h1>标题</h1>
</header>
<style>
  header { background: #eee; }  /* 没有 border / padding 把 h1 的 margin-top 挡住 */
  h1     { margin-top: 30px; }  /* 这个 30px 会"跑"到 header 外面！ */
</style>
```

h1 的 `margin-top` 会**穿透**父元素 header，最终导致 header 顶部出现 30px 而不是 h1 与 header 上沿之间。

#### C. 空的块元素自己的 margin 合并

如果一个空 `<div>` 同时有 `margin-top` 和 `margin-bottom`，它们会合并成一个。

### 3. 合并规则

- **正数取最大**：30px 和 20px → 30px
- **一正一负相加**：30px 和 −20px → 10px
- **两个负数取最小（绝对值最大的负数）**：−30px 和 −20px → −30px

### 4. 如何阻止 margin 合并？

**只要让两个盒子之间出现 "边界"**，margin 就不会合并。常见方式：

| 方案 | 适用场景 |
| --- | --- |
| 在父元素上加 `border-top: 1px solid transparent` | 阻止父子穿透 |
| 在父元素上加 `padding-top: 1px` | 同上 |
| 在父元素上 `overflow: hidden / auto` | 触发 BFC |
| 用 `display: flow-root`（推荐） | 触发 BFC，语义最干净 |
| 在两个兄弟之间加一个空的 `::before` 内容节点 | 极端场景 |
| 用 Flex / Grid 布局（子元素不合并 margin） | 改用现代布局直接避开问题 |

**实战建议**：**同一方向上只用一个 margin**（比如只给每个元素加 `margin-bottom`，不要同时加 top 和 bottom）。或者干脆用 Flex/Grid 的 `gap` 属性——**`gap` 不会合并**，也不会"穿透"父容器，是现代布局的首选。

```css
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;    /* 干净、可控、不会合并、不会穿透 */
}
```

---

## 五、块级盒子 vs 行内盒子

盒模型的行为取决于元素的 `display` 模式。

| 行为 | 块级元素（`<div>`, `<p>`, `<h1>`…） | 行内元素（`<span>`, `<a>`, `<em>`…） |
| --- | --- | --- |
| 是否独占一行 | 是 | 否，与其他文字流动排列 |
| `width` / `height` | 生效 | 通常不生效（除非是可替换元素） |
| `margin` 上下 | 生效 | **不影响行高**（视觉上会溢出） |
| `padding` 上下 | 生效 | 同上 |
| `border` 上下 | 生效 | 会渲染，但不影响相邻行 |

```html
<style>
  span {
    margin: 20px;     /* 左右生效，上下"看起来"有空间但不推开其他行 */
    padding: 20px;    /* 左右生效，上下会撑开背景但不撑开行高 */
    border: 2px solid red;
    background: #fde68a;
  }
</style>

<p>Hello <span>inline box</span> World</p>
<p>上下两行文字可能被 span 的 margin/padding 视觉覆盖，说明它们不影响行高</p>
```

> 💡 **`inline-block`**：内部像 block（可以设置宽高），外部像 inline（和文字在一行流动）。是最灵活的混合模式。

---

## 六、可替换元素（Replaced Elements）

**可替换元素**的内容不是由 CSS 决定的，而是由外部资源（如图片、视频、iframe、表单控件）"替换"进去的。它们的尺寸计算有自己的规则：

```css
img {
  width: 200px;         /* 对可替换元素生效 */
  height: auto;         /* 保持宽高比 */
}
input {
  width: 200px;         /* 同样生效 */
  height: 40px;
}
```

可替换元素的默认 `box-sizing` 行为可以看作是 `border-box`（它们自身的 border/padding 不会再额外撑大设置的 `width`）。

---

## 七、`max-*` / `min-*` 与响应式盒模型

```css
.responsive-box {
  width: 100%;            /* 想占满父容器 */
  max-width: 960px;       /* 但不能超过 960px */
  min-width: 320px;       /* 也不能小于 320px */
  height: auto;           /* 高度自适应内容 */
  max-height: 80vh;       /* 但不会超过视口的 80% */
  padding: 16px;
}

img {
  max-width: 100%;        /* 经典：图片不超出父容器宽度 */
  height: auto;           /* 保持比例 */
}
```

`min-content` / `max-content` / `fit-content()` 是 CSS 新增的三个内在尺寸关键字：

```css
.title {
  width: max-content;      /* 按"一行能写多长"给宽度（可能超出父容器） */
  width: min-content;      /* 按"最短能多短"给宽度（以最长单词为基准） */
  width: fit-content;      /* 优先 max-content，超过父容器时自动换行 */
  width: fit-content(400px); /* 在 fit-content 基础上再加一个上限 */
}
```

---

## 八、`overflow`：内容溢出时怎么办？

```css
.card {
  width: 300px;
  height: 100px;
  overflow: hidden;          /* 溢出部分裁掉 */
  overflow: scroll;          /* 始终显示滚动条（即使没溢出） */
  overflow: auto;            /* 需要时才显示滚动条 */
  overflow: visible;         /* 默认：内容直接溢出盒子 */
  overflow: clip;            /* 类似 hidden，但不允许程序滚动（现代属性） */

  /* 也可以分别控制水平 / 垂直 */
  overflow-x: auto;
  overflow-y: hidden;

  /* 文本截断的经典组合 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;   /* 末尾显示省略号 */

  /* 多行截断（-webkit- 前缀，主流浏览器均支持） */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

> ⚠️ 注意：`overflow: hidden / auto / scroll` 会**创建 BFC**（块级格式化上下文），这是一个副作用——它会阻止 margin 合并、阻止内部浮动元素溢出。

---

## 九、可视化调试

浏览器 DevTools 的 "Elements" 面板提供了完美的盒模型可视化：

1. 在 Chrome 中右键 → **Inspect**
2. 选中元素，右侧切换到 **Computed** 标签
3. 你会看到一个**交互式的盒模型示意图**，四个方向的 `margin / border / padding / content` 的具体数值都会显示出来
4. 鼠标悬停在某个方向上，页面上对应的区域会高亮

这个工具在排查"为什么这里有个多余的 2px 空白？"这类问题时非常高效。

---

## 十、本章小结

✅ **要点清单**：

1. 每个元素都是一个盒子，由 `content → padding → border → margin` 组成
2. **`box-sizing: border-box`** 应该是你项目的默认值，让尺寸直观可控
3. **`outline` 和 `box-shadow` 不占空间**，适合做视觉效果而不影响布局
4. **margin 合并**是常规流里的正常行为，不要试图"修复"它——改用 gap、flex、grid，或加 padding/border 做隔离
5. **行内元素 vs 块级元素**对 padding/margin 的响应截然不同，调试时要注意
6. **可替换元素**（img, iframe, input…）有自己的尺寸逻辑
7. 用 DevTools 的 Computed 面板实时查看盒模型，是最快速的调试手段

下一章我们将进入**布局系统**（Flexbox、Grid、浮动、定位），看看这些盒子如何"排列在一起"。
