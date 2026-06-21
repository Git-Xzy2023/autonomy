---
title: Sass 入门与安装
---

# Sass 入门与安装

## 一、为什么使用 Sass？

Sass 在原生 CSS 基础上提供了以下增强能力：

| 能力 | 说明 |
|------|------|
| **变量** | 统一管理颜色、字体、间距，修改一处即可全局生效 |
| **嵌套** | 按照 HTML 结构组织 CSS，代码更清晰 |
| **混合（Mixin）** | 定义可复用的样式片段 |
| **函数** | 自定义计算逻辑 |
| **继承** | 共享一组声明，减少重复 |
| **模块化** | 将代码拆分成多个文件，按需导入 |
| **流程控制** | 使用 `@if` / `@for` / `@each` 等生成动态样式 |

---

## 二、Sass vs SCSS

Sass 有两种语法：

| 语法 | 扩展名 | 特点 |
| ---- | ------ | ---- |
| **Sass（缩进式）** | `.sass` | 不使用花括号和分号，靠缩进表示层级 |
| **SCSS** | `.scss` | 完全兼容 CSS 语法，使用花括号和分号 |

```scss
// SCSS 语法
.nav {
  background: #333;
  a {
    color: white;
  }
}
```

```sass
// Sass 语法
.nav
  background: #333
  a
    color: white
```

> 💡 本教程统一使用 **SCSS** 语法，因为它更接近原生 CSS，学习成本更低，且兼容所有现有 CSS 代码。

---

## 三、快速安装

Sass 的编译工具有很多种，推荐使用 **Dart Sass**（官方实现）：

### 方式一：npm 安装

```bash
# 全局安装
npm install -g sass

# 项目内安装（推荐）
npm install -D sass
```

### 方式二：使用 npx（不安装）

```bash
npx sass input.scss output.css
```

### 方式三：通过包管理器

```bash
# Homebrew (macOS)
brew install sass/sass/sass

# Chocolatey (Windows)
choco install sass
```

---

## 四、命令行编译

```bash
# 单文件编译
sass input.scss output.css

# 监听文件变化（自动编译）
sass --watch input.scss output.css

# 监听整个目录
sass --watch src/scss:dist/css

# 压缩输出
sass --style=compressed input.scss output.css

# 输出格式选项
#   expanded（默认，展开格式）
#   nested（嵌套格式）
#   compact（紧凑格式）
#   compressed（压缩格式）
```

---

## 五、与构建工具配合

### Vite

Vite 开箱即用，安装 `sass` 后直接 `import './style.scss'` 即可：

```bash
npm install -D sass
```

```js
import './style.scss';
```

### Webpack

需要 `sass-loader`：

```bash
npm install -D sass sass-loader
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
```

### Vue SFC

```vue
<style lang="scss">
$primary: #3498db;
.title {
  color: $primary;
}
</style>
```

---

## 六、第一个 SCSS 文件

创建 `style.scss`：

```scss
// 定义变量
$primary-color: #3498db;
$font-size: 16px;

// 使用变量
body {
  font-size: $font-size;
}

.btn {
  background: $primary-color;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: darken($primary-color, 10%);
  }
}
```

编译为 CSS：

```bash
sass style.scss style.css
```

---

## 七、下一步

- 下一章：[变量与数据类型](/web/styles/sass/02-variables/)
- 完整 API 参考：[Sass 官方文档](https://sass-lang.com/documentation)
