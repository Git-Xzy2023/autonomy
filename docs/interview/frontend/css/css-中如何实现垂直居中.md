---
title: "CSS 中如何实现垂直居中？"
---

# CSS 中如何实现垂直居中？

这个问题在布局章节有详细说明，这里做一个快速回顾：

```css
/* 方案一：Flexbox（最推荐） */
.flex-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 方案二：Grid */
.grid-center {
  display: grid;
  place-items: center;
}

/* 方案三：绝对定位 + transform */
.absolute-center {
  position: relative;
}
.absolute-center .child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方案四：绝对定位 + margin: auto（需要固定宽高） */
.margin-auto-center {
  position: relative;
}
.margin-auto-center .child {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}

/* 方案五：行内元素垂直居中（单行文本） */
.text-center {
  height: 100px;
  line-height: 100px; /* line-height = height */
  text-align: center;
}
```

---
