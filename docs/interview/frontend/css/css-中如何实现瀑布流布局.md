---
title: "CSS 中如何实现瀑布流布局？"
---

# CSS 中如何实现瀑布流布局？

```css
/* 方案一：CSS Columns（最简单的方式） */
.masonry-columns {
  column-count: 3; /* 列数 */
  column-gap: 20px; /* 列间距 */
}
.masonry-columns .item {
  break-inside: avoid; /* 避免在元素内断列 */
  margin-bottom: 20px;
}

/* 方案二：CSS Grid（需配合 JS 计算高度） */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-flow: dense; /* 紧密填充 */
}

/* 方案三：Flexbox（需要已知高度或 JS 配合） */
.masonry-flex {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 1000px; /* 需要固定高度 */
  align-content: space-between;
}
.masonry-flex .item {
  width: calc(33.33% - 10px);
  margin-bottom: 20px;
}
```

---
