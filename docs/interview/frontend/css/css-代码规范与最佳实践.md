---
title: "CSS 代码规范与最佳实践"
---

# CSS 代码规范与最佳实践

#### 1. 命名规范（BEM）

**BEM（Block Element Modifier）是一种流行的 CSS 命名方法论。**

```css
/* Block: 组件 */
.button {
}

/* Element: 组件的一部分 */
.button__icon {
}
.button__text {
}

/* Modifier: 变体/状态 */
.button--primary {
}
.button--disabled {
}
.button--large {
}

/* 完整示例 */
.card {
}
.card__header {
}
.card__body {
}
.card__title {
}
.card--featured {
}
.card--dark {
}
```

#### 2. 组织架构

```
styles/
├── base/
│   ├── reset.css         /* 重置样式 */
│   ├── normalize.css     /* 标准化样式 */
│   └── typography.css    /* 排版样式 */
├── variables/
│   ├── colors.scss       /* 颜色变量 */
│   └── spacing.scss      /* 间距变量 */
├── components/
│   ├── button.scss       /* 按钮组件 */
│   ├── card.scss         /* 卡片组件 */
│   └── form.scss         /* 表单组件 */
├── layout/
│   ├── grid.scss         /* 网格布局 */
│   └── header.scss       /* 头部布局 */
├── pages/
│   ├── home.scss         /* 首页样式 */
│   └── about.scss        /* 关于页样式 */
└── main.scss             /* 主入口文件 */
```

#### 3. 性能优化建议

```css
/* ✅ 避免使用通配符选择器 */
/* ❌ 不推荐 */
* {
  margin: 0;
}

/* ✅ 推荐：显式指定元素 */
body,
h1,
h2,
h3,
p,
ul {
  margin: 0;
}

/* ✅ 避免过深的嵌套 */
/* ❌ 不推荐 */
.page .header .nav .menu .item a {
}

/* ✅ 推荐 */
.nav-item a {
}

/* ✅ 使用简写属性 */
/* ❌ 不推荐 */
.box {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}

/* ✅ 推荐 */
.box {
  margin: 10px 20px;
}

/* ✅ 避免使用 !important */
/* ❌ 不推荐 */
.text {
  color: red !important;
}

/* ✅ 推荐：通过提高选择器优先级解决 */
.card .text {
  color: red;
}

/* ✅ 减少 reflow */
.box {
  will-change: transform;
}
```

---
