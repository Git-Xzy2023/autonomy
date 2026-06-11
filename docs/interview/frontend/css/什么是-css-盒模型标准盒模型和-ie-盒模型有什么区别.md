---
title: "什么是 CSS 盒模型？标准盒模型和 IE 盒模型有什么区别？"
---

# 什么是 CSS 盒模型？标准盒模型和 IE 盒模型有什么区别？

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
