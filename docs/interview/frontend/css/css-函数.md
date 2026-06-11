---
title: "CSS 函数"
---

# CSS 函数

**1. calc() - 计算**

```css
.element {
  width: calc(100% - 20px);
  font-size: calc(16px + 2vw);
  margin: calc(10% - 5px);
}
```

**2. min() / max() - 最小/最大值**

```css
.container {
  width: min(1200px, 100%); /* 不超过 1200px，且不超过 100% */
  font-size: max(16px, 2vw); /* 至少 16px，或 2vw（取较大值） */
}
```

**3. clamp() - 限制范围**

```css
.text {
  /* 最小 16px，理想 4vw，最大 24px */
  font-size: clamp(16px, 4vw, 24px);
}
```

**4. minmax() - 网格大小范围**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
}
```

**5. attr() - 获取属性值**

```css
/* 目前主要用于 content */
a::after {
  content: " (" attr(href) ")";
}

/* 实验性功能（未来可用） */
img {
  width: attr(data-width px, 100px);
}
```

---
