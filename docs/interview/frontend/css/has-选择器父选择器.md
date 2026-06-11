---
title: ":has() 选择器（父选择器）"
---

# :has() 选择器（父选择器）

**可以根据子元素来选择父元素。**

```css
/* 如果有 <img> 子元素，就给父元素添加样式 */
.card:has(img) {
  padding: 20px;
  background: #f5f5f5;
}

/* 如果没有 <p> 子元素，就给父元素添加样式 */
.article:not(:has(p)) {
  border: 1px dashed #ccc;
}

/* 组合使用 */
.form:has(input:required) label::after {
  content: " *";
  color: red;
}

/* 根据子元素状态改变父元素 */
.card:has(.button:hover) {
  transform: translateY(-5px);
}
```

---
