---
title: Less 入门
---

# Less 入门

**Less**（Leaner Style Sheets）是另一种流行的 CSS 预处理器。相比 Sass，Less 的语法更接近原生 CSS，学习曲线更低。

---

## 一、Less 与 Sass 的主要区别

| 特性 | Less | Sass/SCSS |
|------|------|-----------|
| **变量符号** | `@var-name` | `$var-name` |
| **混合写法** | `.mixin-name()` | `@mixin / @include` |
| **自定义函数** | 不支持（用 mixin 模拟） | 支持 `@function` |
| **循环** | `each()` 函数 | `@for` / `@each` / `@while` |
| **条件** | `when` 守卫 | `@if / @else` |
| **社区生态** | 较大 | 更大 |

Less 尤其适合在 **Node.js 项目**或需要快速上手的团队中使用。

---

## 二、安装与编译

```bash
# 全局安装
npm install -g less

# 单文件编译
lessc input.less output.css

# 在项目中使用（Vite/Webpack）
npm install -D less
```

---

## 三、核心特性速览

### 1. 变量

```less
@primary: #3498db;
@spacing: 16px;

.btn {
  background: @primary;
  padding: @spacing (@spacing * 2);
}
```

### 2. 嵌套

```less
.nav {
  background: #333;

  ul { list-style: none; }
  li { display: inline-block; }

  a {
    color: white;
    &:hover { background: #555; }
  }
}
```

### 3. 混合（Mixins）

Less 的 mixin 写法非常直接：

```less
// 定义
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 使用
.box { .flex-center(); }
```

带参数的 mixin：

```less
.border-radius(@radius: 4px) {
  border-radius: @radius;
}

.btn { .border-radius(8px); }
```

### 4. 守卫条件（when）

```less
.mixin(@a) when (@a > 10) { background: black; }
.mixin(@a) when (@a <= 10) { background: white; }

.dark  { .mixin(15); } // black
.light { .mixin(5); }  // white
```

### 5. 循环（each）

```less
@colors: red, green, blue;

each(@colors, {
  .text-@{value} { color: @value; }
});

// 生成数字序列
each(range(5), {
  .mt-@{index} { margin-top: @index * 4px; }
});
```

---

## 四、与构建工具配合

Less 在 **Vue CLI / Vite / Webpack** 等工具中开箱即用：

```bash
npm install -D less less-loader   # webpack
npm install -D less               # vite（自动识别 .less）
```

单文件组件（SFC）示例：

```vue
<style lang="less">
@color: #333;
.title {
  color: @color;
  &:hover { color: darken(@color, 20%); }
}
</style>
```

---

## 五、下一步

- 完整教程：[CSS 预处理器](/web/styles/css/07-preprocessor/)
- 对比 Sass 与 Less，根据团队习惯做出选择
- 了解如何与 CSS Modules 结合使用
