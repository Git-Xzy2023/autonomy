---
title: 方案对比与选型
---

# 方案对比与选型

本章对比各种 CSS 方案，帮助你在项目中做出合适的选择。

---

## 一、方案总览

| 方案 | 代表 | 作用域 | 动态样式 | 运行时 | 学习成本 |
|------|------|--------|----------|--------|----------|
| 原生 CSS | - | 全局 | ❌ | 无 | 低 |
| BEM + Sass | - | 命名约定 | ❌ | 无 | 中 |
| CSS Modules | - | 编译时 | ❌ | 无 | 低 |
| CSS-in-JS | styled-components | 组件级 | ✅ | 有 | 中 |
| 原子化 CSS | Tailwind | 工具类 | ❌ | 无 | 中 |
| 零运行时 CSS-in-JS | linaria | 编译时 | ✅ | 无 | 中 |

---

## 二、详细对比

### 1. 原生 CSS

```css
/* 全局作用域，容易冲突 */
.btn { ... }
.btn-primary { ... }
```

- ✅ 无依赖，浏览器原生支持
- ✅ 性能最好
- ❌ 全局作用域，类名易冲突
- ❌ 难以维护大型项目

### 2. BEM + Sass

```scss
.card {
  &__title { ... }
  &__body { ... }
  &--active { ... }
}
```

- ✅ 命名规范清晰
- ✅ Sass 提供变量、嵌套、mixin
- ❌ 类名冗长
- ❌ 依赖命名约定，团队协作成本高

### 3. CSS Modules

```jsx
import styles from './Button.module.css';
<button className={styles.btn}>按钮</button>
```

- ✅ 局部作用域，无冲突
- ✅ 编译时生成，无运行时
- ✅ 与现有 CSS 语法兼容
- ❌ 无法动态生成样式
- ❌ 类名引用繁琐

### 4. CSS-in-JS（styled-components）

```jsx
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
`;
```

- ✅ 组件级隔离
- ✅ 动态样式（根据 props）
- ✅ 主题支持
- ❌ 运行时开销
- ❌ 包体积增加
- ❌ SSR 复杂
- ❌ React 专属

### 5. 原子化 CSS（Tailwind）

```html
<button class="bg-blue-500 text-white px-4 py-2 rounded">按钮</button>
```

- ✅ 开发速度快
- ✅ 产物体积小（Tree-shaking）
- ✅ 设计系统统一
- ❌ 类名冗长
- ❌ HTML 与样式强耦合
- ❌ 学习曲线

### 6. 零运行时 CSS-in-JS（linaria）

```jsx
const Button = styled.button`
  background: ${props => props.$primary ? 'blue' : 'gray'};
`;
```

- ✅ 编译时提取，无运行时
- ✅ 支持动态样式
- ✅ 性能接近原生 CSS
- ❌ 配置复杂
- ❌ 生态较小

---

## 三、选型决策树

```
项目类型？
├── 小型项目 / 静态页面
│   └── 原生 CSS + CSS 变量
│
├── 中型项目
│   ├── 团队熟悉 Sass → BEM + Sass
│   ├── React 项目 → CSS Modules 或 Tailwind
│   └── Vue 项目 → Scoped CSS 或 Tailwind
│
├── 大型项目 / 设计系统
│   ├── 需要严格设计规范 → Tailwind
│   ├── 需要组件级动态样式 → CSS-in-JS（React）
│   └── 多团队协作 → CSS Modules + Design Token
│
└── 组件库
    ├── React 组件库 → CSS-in-JS 或 Tailwind
    └── 跨框架组件库 → CSS Modules + CSS 变量
```

---

## 四、不同场景推荐

### 1. 个人博客 / 文档站

**推荐：原生 CSS + CSS 变量**

```css
:root {
  --primary: #3498db;
  --text: #333;
}

body {
  color: var(--text);
}
```

理由：简单、无依赖、性能好。

### 2. 企业官网 / 营销页

**推荐：Tailwind CSS**

```html
<section class="bg-gradient-to-r from-blue-500 to-purple-500 py-20">
  <div class="container mx-auto text-center text-white">
    <h1 class="text-4xl font-bold mb-4">标题</h1>
  </div>
</section>
```

理由：开发快、设计统一、产物小。

### 3. 后台管理系统

**推荐：Tailwind + 组件库（如 Ant Design / Element Plus）**

理由：组件库提供复杂组件，Tailwind 处理定制样式。

### 4. React 组件库

**推荐：CSS-in-JS（styled-components）或 Tailwind**

```jsx
// styled-components 方案
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
`;
```

理由：组件级隔离、动态样式、主题支持。

### 5. 跨框架组件库

**推荐：CSS Modules + CSS 变量**

```css
/* Button.module.css */
.btn {
  background: var(--btn-bg, blue);
  color: var(--btn-color, white);
}
```

理由：与框架无关、可定制、性能好。

### 6. 移动端 H5

**推荐：Tailwind + rem/vw 适配**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        // 基于 rem 的间距
      },
    },
  },
};
```

理由：响应式开发快、适配方便。

---

## 五、迁移策略

### 从全局 CSS 迁移到 CSS Modules

1. **逐步迁移**：新组件使用 CSS Modules，旧组件保持不变
2. **文件命名**：将 `Button.css` 重命名为 `Button.module.css`
3. **更新引用**：`className="btn"` → `className={styles.btn}`

### 从 Sass 迁移到 Tailwind

1. **保留设计变量**：将 Sass 变量映射到 Tailwind theme
2. **逐步替换**：新组件用 Tailwind，旧组件保持 Sass
3. **使用 `@apply`**：过渡期可用 `@apply` 复用工具类

### 从 styled-components 迁移到 Tailwind

1. **识别动态样式**：将 props 驱动的样式转为条件类名
2. **使用 `clsx`**：管理动态类名
3. **保留主题**：通过 Tailwind theme 配置实现

---

## 六、混合使用策略

大型项目可以混合使用多种方案：

```
项目结构：
├── components/        # 通用组件
│   └── Button/
│       └── Button.module.css  # CSS Modules
├── pages/            # 页面
│   └── Home/
│       └── Home.jsx   # 页面内用 Tailwind
├── styles/
│   ├── theme.css     # CSS 变量（Design Token）
│   └── global.css    # 全局样式
└── tailwind.config.js
```

**原则**：

- **Design Token** 用 CSS 变量统一管理
- **通用组件** 用 CSS Modules（框架无关）
- **页面级样式** 用 Tailwind（开发快）
- **动态样式** 用 CSS 变量 + data 属性

---

## 七、未来趋势

### 1. 原生 CSS 增强

随着 CSS 嵌套、容器查询、`:has()` 等特性的普及，对预处理器的依赖会减少。

### 2. 零运行时 CSS-in-JS

linaria、vanilla-extract 等零运行时方案越来越流行。

### 3. 原子化 CSS

Tailwind 模式被广泛接受，类似方案（UnoCSS、Windi CSS）涌现。

### 4. CSS-in-JS 衰退

随着 React Server Components 的普及，运行时 CSS-in-JS 面临挑战。

### 5. CSS Modules + CSS 变量

成为跨框架组件库的主流方案。

---

## 八、总结

| 场景 | 推荐方案 |
|------|----------|
| 小型项目 | 原生 CSS + CSS 变量 |
| 中大型项目 | Tailwind CSS |
| React 组件库 | Tailwind 或 CSS Modules |
| 跨框架组件库 | CSS Modules + CSS 变量 |
| 需要动态样式 | CSS 变量 + data 属性 |
| 团队习惯 Sass | BEM + Sass |

**核心原则**：

1. **不要过度设计**：选择最简单的方案
2. **统一规范**：团队内保持一致
3. **关注性能**：优先考虑无运行时方案
4. **面向未来**：关注原生 CSS 新特性

---

## 九、学习路线回顾

- [01 CSS Modules](/web/styles/modern/01-css-modules/)
- [02 CSS-in-JS](/web/styles/modern/02-css-in-js/)
- [03 CSS 新特性](/web/styles/modern/03-new-features/)
- [04 方案对比与选型](/web/styles/modern/04-comparison/)

恭喜完成现代方案学习！🎉 返回 [样式模块首页](/web/styles/)。
