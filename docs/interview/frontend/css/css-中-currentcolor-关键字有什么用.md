---
title: "CSS 中 `currentColor` 关键字有什么用？"
---

# CSS 中 `currentColor` 关键字有什么用？

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
