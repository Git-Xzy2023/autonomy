---
title: Less 入门与安装
---

# Less 入门与安装

## 一、什么是 Less？

**Less**（Leaner Style Sheets）是一种 CSS 预处理器，它扩展了 CSS 的能力，添加了变量、嵌套、混合、函数等特性，最终编译成标准 CSS。

### Less 的优势

| 能力 | 说明 |
|------|------|
| **变量** | 用 `@` 声明，统一管理颜色、字体、间距 |
| **嵌套** | 按照 HTML 结构组织 CSS |
| **混合（Mixin）** | 定义可复用的样式片段，支持参数 |
| **函数** | 内置颜色、数学、字符串、列表函数 |
| **运算** | 支持算术运算 |
| **守卫条件** | `when` 实现条件逻辑 |
| **循环** | `each()` 函数实现循环 |
| **模块化** | `@import` 拆分文件 |

---

## 二、Less vs Sass

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

## 三、安装

### 方式一：npm 全局安装

```bash
npm install -g less
```

### 方式二：项目内安装

```bash
npm install -D less
```

### 方式三：CDN（浏览器端编译，不推荐生产）

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="https://cdn.jsdelivr.net/npm/less@4"></script>
```

---

## 四、命令行编译

```bash
# 单文件编译
lessc input.less output.css

# 压缩输出
lessc --clean-css input.less output.css

# 自动添加浏览器前缀
lessc --autoprefix="> 1%, last 2 versions" input.less output.css

# 监听文件变化
lessc --watch input.less output.css
```

---

## 五、与构建工具配合

### Vite

Vite 开箱即用：

```bash
npm install -D less
```

```js
import './style.less';
```

### Webpack

需要 `less-loader`：

```bash
npm install -D less less-loader
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

### Vue SFC

```vue
<style lang="less">
@primary: #3498db;
.title {
  color: @primary;
}
</style>
```

---

## 六、第一个 Less 文件

创建 `style.less`：

```less
// 变量
@primary-color: #3498db;
@spacing: 16px;

// 使用
body {
  font-size: 14px;
}

.btn {
  background: @primary-color;
  color: white;
  padding: @spacing (@spacing * 2);
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: darken(@primary-color, 10%);
  }
}
```

编译为 CSS：

```bash
lessc style.less style.css
```

---

## 七、下一步

- 下一章：[变量](/web/styles/less/02-variables/)
- 官方文档：[lesscss.org](http://lesscss.org/)
