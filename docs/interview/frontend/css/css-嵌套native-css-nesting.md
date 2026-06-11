---
title: "CSS 嵌套（Native CSS Nesting）"
---

# CSS 嵌套（Native CSS Nesting）

**原生 CSS 支持嵌套写法，类似 Sass/Less。**

```css
/* 传统写法 */
.button {
  background: blue;
}
.button:hover {
  background: darkblue;
}
.button .icon {
  margin-right: 8px;
}

/* 原生嵌套写法 */
.button {
  background: blue;

  &:hover {
    background: darkblue;
  }

  & .icon {
    margin-right: 8px;
  }
}

/* 更多示例 */
.card {
  background: white;
  padding: 20px;

  &.featured {
    border: 2px solid gold;
  }

  & > .title {
    font-size: 1.5em;
  }

  @media (min-width: 768px) {
    display: flex;
  }
}
```

---
