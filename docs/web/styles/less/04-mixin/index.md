---
title: Less Mixin
---

# Less Mixin

## 一、什么是 Mixin？

**Mixin（混合）** 是一段可复用的样式代码块。Less 的 Mixin 写法比 Sass 更简洁——**任何类都可以作为 Mixin 使用**。

---

## 二、基础用法

### 1. 类作为 Mixin

```less
// 定义一个普通类
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 使用（直接引用类名）
.box {
  .flex-center;
  height: 100vh;
}
```

> ⚠️ 这样 `.flex-center` 也会输出到 CSS 中。如果不希望输出，使用括号 `()`。

### 2. 不输出的 Mixin（带括号）

```less
// 定义：带括号，不会输出到 CSS
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 使用
.box {
  .flex-center();  // 括号可省略：.flex-center;
}
```

编译结果（`.flex-center` 不输出）：

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

---

## 三、带参数的 Mixin

### 1. 普通参数

```less
.border-radius(@radius: 4px) {
  border-radius: @radius;
  -webkit-border-radius: @radius;
}

.btn { .border-radius(); }       // 使用默认值 4px
.card { .border-radius(8px); }   // 传入 8px
```

### 2. 多参数

```less
.button(@bg, @color: white) {
  background: @bg;
  color: @color;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

.btn-primary { .button(#3498db); }
.btn-danger { .button(#e74c3c); }
.btn-warning { .button(#f39c12, black); }
```

### 3. 可变参数 `...`

```less
.box-shadow(@shadows...) {
  -webkit-box-shadow: @shadows;
  box-shadow: @shadows;
}

.card {
  .box-shadow(0 1px 3px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2));
}
```

### 4. `@arguments` 变量

`@arguments` 包含所有传入的参数：

```less
.border(@width, @style, @color) {
  border: @arguments;
}

.box {
  .border(1px, solid, #ccc);
  // 等价于 border: 1px solid #ccc;
}
```

### 5. `@rest` 变量

```less
.padding(@rest...) {
  padding: @rest;
}

.box {
  .padding(10px, 20px, 30px, 40px);
}
```

---

## 四、常用 Mixin 示例

### 1. 浏览器前缀

```less
.prefix(@property, @value) {
  -webkit-@{property}: @value;
  -moz-@{property}: @value;
  -ms-@{property}: @value;
  @{property}: @value;
}

.box {
  .prefix(transform, rotate(45deg));
  .prefix(transition, all 0.3s ease);
}
```

### 2. 响应式断点

```less
.respond-to(@breakpoint, @rules) {
  & when (@breakpoint = sm) {
    @media (max-width: 640px) { @rules(); }
  }
  & when (@breakpoint = md) {
    @media (max-width: 768px) { @rules(); }
  }
  & when (@breakpoint = lg) {
    @media (max-width: 1024px) { @rules(); }
  }
}

.container {
  width: 1200px;

  .respond-to(md, {
    width: 100%;
    padding: 0 16px;
  });
}
```

### 3. 文本截断

```less
.text-ellipsis(@lines: 1) {
  & when (@lines = 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & when (@lines > 1) {
    display: -webkit-box;
    -webkit-line-clamp: @lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.title { .text-ellipsis(); }
.description { .text-ellipsis(3); }
```

### 4. 三角形

```less
.triangle(@direction, @size, @color) {
  width: 0;
  height: 0;
  border: @size solid transparent;

  & when (@direction = up) { border-bottom-color: @color; }
  & when (@direction = down) { border-top-color: @color; }
  & when (@direction = left) { border-right-color: @color; }
  & when (@direction = right) { border-left-color: @color; }
}

.arrow-up { .triangle(up, 10px, red); }
.arrow-right { .triangle(right, 10px, blue); }
```

---

## 五、Mixin 的条件守卫

使用 `when` 给 Mixin 添加条件：

```less
.text-color(@bg) when (lightness(@bg) > 50%) {
  color: black;
}
.text-color(@bg) when (lightness(@bg) <= 50%) {
  color: white;
}

.btn-light { background: #eee; .text-color(#eee); }  // color: black
.btn-dark { background: #333; .text-color(#333); }   // color: white
```

详见 [守卫与循环](/web/styles/less/06-guard-loop/) 章节。

---

## 六、Mixin 的模式匹配

通过参数值实现类似函数重载的效果：

```less
// 不同的 mode 对应不同的样式
.theme(dark, @color) {
  background: black;
  color: @color;
}
.theme(light, @color) {
  background: white;
  color: @color;
}
// 通配符
.theme(_, @color) {
  border: 1px solid @color;
}

.header {
  .theme(dark, white);  // 匹配 dark + 通配
}
```

---

## 七、Mixin vs 类继承

| 特性 | Mixin | 类继承（`:extend`） |
|------|-------|---------------------|
| 是否复制样式 | ✅ 复制 | ❌ 合并选择器 |
| 支持参数 | ✅ | ❌ |
| 产物大小 | 较大 | 较小 |
| 灵活性 | 高 | 低 |

```less
// Mixin：复制样式
.flex-center() { display: flex; justify-content: center; align-items: center; }
.box { .flex-center; }  // 复制一份

// Extend：合并选择器
.flex-center { display: flex; justify-content: center; align-items: center; }
.box:extend(.flex-center) { }  // 合并：.flex-center, .box { ... }
```

---

## 八、下一步

- 上一章：[嵌套](/web/styles/less/03-nesting/)
- 下一章：[函数与运算](/web/styles/less/05-functions/)
