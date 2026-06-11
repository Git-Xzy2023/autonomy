---
title: "CSS Logical Properties（逻辑属性）"
---

# CSS Logical Properties（逻辑属性）

**逻辑属性使用 `start`/`end` 代替 `left`/`right`，使布局更适应不同书写方向。**

```css
/* 传统属性 */
.box {
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 10px;
  text-align: left;
  border-left: 1px solid #000;
}

/* 逻辑属性（推荐） */
.box {
  margin-inline-start: 20px; /* LTR 中 = margin-left */
  margin-inline-end: 20px; /* LTR 中 = margin-right */
  padding-inline-start: 10px;
  text-align: start;
  border-inline-start: 1px solid #000;
}

/* 完整对照表 */
/*
| 物理属性        | 逻辑属性           |
| -------------- | ----------------- |
| margin-left    | margin-inline-start |
| margin-right   | margin-inline-end   |
| margin-top     | margin-block-start  |
| margin-bottom  | margin-block-end    |
| padding-left   | padding-inline-start |
| padding-right  | padding-inline-end   |
| width          | inline-size         |
| height         | block-size          |
| left           | inset-inline-start  |
| right          | inset-inline-end    |
| top            | inset-block-start   |
| bottom         | inset-block-end     |
*/
```

---
