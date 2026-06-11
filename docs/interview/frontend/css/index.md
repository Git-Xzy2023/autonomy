---
title: "CSS 的引入方式有哪些？它们的优先级如何？"
---

# CSS 的引入方式有哪些？它们的优先级如何？

**CSS 的四种引入方式：**

1. **内联样式（Inline Style）**：写在 HTML 标签的 `style` 属性中

```html
<p style="color: red; font-size: 14px;">这是一段红色的文字</p>
```

2. **内部样式表（Internal Style Sheet）**：写在 `<style>` 标签中，放在 `<head>` 内

```html
<head>
  <style>
    p {
      color: blue;
      font-size: 16px;
    }
  </style>
</head>
```

3. **外部样式表（External Style Sheet）**：通过 `<link>` 标签引入外部 `.css` 文件

```html
<head>
  <link rel="stylesheet" href="style.css" />
</head>
```

4. **导入样式（@import）**：在 CSS 文件或 `<style>` 标签中使用 `@import` 导入

```css
@import url("style.css");
```

**优先级（从高到低）：**

- 内联样式 > 内部样式表 > 外部样式表 > 导入样式

> **注意**：如果后面的样式覆盖前面的，还与书写顺序有关，后面的会覆盖前面的。另外，`!important` 声明会打破正常的优先级规则，拥有最高优先级。

---
