---
title: "CSS Grid 进阶特性"
---

# CSS Grid 进阶特性

**1. subgrid（子网格）**

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid; /* 继承父级网格线 */
}
```

**2. 命名网格线**

```css
.container {
  display: grid;
  grid-template-columns:
    [col-start] 1fr
    [col-2] 1fr
    [col-3] 1fr
    [col-end];
  grid-template-rows:
    [row-start] auto
    [row-2] auto
    [row-end];
}

.item {
  grid-column: col-start / col-3;
  grid-row: row-start / row-end;
}
```

**3. auto-fit vs auto-fill**

```css
/* auto-fit：有多少项目就占多少空间 */
.fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* auto-fill：尽量填充，即使没有足够项目 */
.fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

---
