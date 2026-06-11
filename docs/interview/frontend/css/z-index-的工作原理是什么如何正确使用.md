---
title: "z-index 的工作原理是什么？如何正确使用？"
---

# z-index 的工作原理是什么？如何正确使用？

**z-index 的核心概念：**

- z-index 只在**定位元素**（`position` 不为 `static`）上有效
- z-index 创建**层叠上下文**（Stacking Context）
- 子元素的 z-index 只在父层叠上下文中有意义

**层叠顺序（从下到上）：**

1. 形成层叠上下文的元素的背景和边框
2. 负 z-index 的子元素
3. 常规流中的块级元素
4. 浮动元素
5. 常规流中的行内元素
6. z-index: auto 或 z-index: 0 的定位元素
7. 正 z-index 的子元素（数值越大越靠上）

**创建层叠上下文的条件：**

```css
/* 1. 根元素（html） */

/* 2. 定位元素且 z-index 不为 auto */
.box {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}

/* 3. opacity 小于 1 */
.box {
  opacity: 0.99; /* 创建层叠上下文 */
}

/* 4. transform 不为 none */
.box {
  transform: translateZ(0); /* 创建层叠上下文 */
}

/* 5. will-change 不为 none */
.box {
  will-change: transform; /* 创建层叠上下文 */
}

/* 6. contain 包含 layout、paint 或 strict */
.box {
  contain: layout paint; /* 创建层叠上下文 */
}

/* 7. Flex/Grid 容器的子项且 z-index 不为 auto */
.flex-item {
  z-index: 1; /* 创建层叠上下文 */
}
```

**常见误区：**

```css
/* ❌ 误区1：非定位元素设置 z-index 无效 */
.static-box {
  position: static; /* 默认值 */
  z-index: 100; /* 无效！ */
}

/* ✅ 正确写法 */
.relative-box {
  position: relative;
  z-index: 100; /* 有效 */
}

/* ❌ 误区2：子元素的 z-index 无法超越父层叠上下文 */
.parent {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}
.child {
  position: relative;
  z-index: 9999; /* 这个 z-index 只在 parent 内部有效 */
}
/* 由于 parent 的 z-index 是 1，child 无论多大都在 z-index: 2 的元素之下 */

/* ✅ 解决方案：提高父元素的 z-index，或避免创建不必要的层叠上下文 */
.parent {
  position: relative;
  /* z-index: auto; 不创建层叠上下文 */
}
.child {
  position: relative;
  z-index: 100; /* 现在 z-index 在全局范围内生效 */
}
```

**最佳实践：**

```css
/* 1. 制定 z-index 规范 */
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}

.dropdown {
  z-index: var(--z-dropdown);
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}

.modal {
  z-index: var(--z-modal);
}

/* 2. 避免使用过大的数字（如 999999） */

/* 3. 使用 CSS 变量统一管理 z-index */

/* 4. 理解层叠上下文，避免嵌套陷阱 */
```

---
