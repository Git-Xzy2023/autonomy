---
title: "container queries（容器查询）"
---

# container queries（容器查询）

**根据父容器的尺寸而非视口尺寸来调整样式。**

```css
/* 定义容器 */
.card-container {
  container-type: inline-size; /* 基于内联尺寸 */
  container-name: card;
}

/* 简写 */
.card-container {
  container: card / inline-size;
}

/* 根据容器尺寸应用样式 */
.card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@container card (min-width: 500px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 800px) {
  .card {
    grid-template-columns: 300px 1fr 200px;
  }
}
```

---
