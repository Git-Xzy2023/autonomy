---
title: "CSS 中如何实现暗色模式（Dark Mode）？"
---

# CSS 中如何实现暗色模式（Dark Mode）？

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
