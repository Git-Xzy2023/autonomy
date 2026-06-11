---
title: "CSS 中如何实现粘性定位（Sticky）？"
---

# CSS 中如何实现粘性定位（Sticky）？

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
