---
title: "如何优化 CSS 的加载性能？"
---

# 如何优化 CSS 的加载性能？

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
