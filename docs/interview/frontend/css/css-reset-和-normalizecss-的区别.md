---
title: "CSS Reset 和 Normalize.css 的区别？"
---

# CSS Reset 和 Normalize.css 的区别？

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
