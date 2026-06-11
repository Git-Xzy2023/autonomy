---
title: "CSS 变量（Custom Properties）"
---

# CSS 变量（Custom Properties）

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
