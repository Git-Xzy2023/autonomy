---
title: Sass 继承与占位符
---

# Sass 继承与占位符

## 一、`@extend` 继承

`@extend` 让一个选择器继承另一个选择器的所有样式：

```scss
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  @extend .btn;
  background: blue;
  color: white;
}

.btn-danger {
  @extend .btn;
  background: red;
  color: white;
}
```

编译结果：

```css
.btn,
.btn-primary,
.btn-danger {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background: blue;
  color: white;
}
.btn-danger {
  background: red;
  color: white;
}
```

---

## 二、占位符选择器 `%`

占位符选择器以 `%` 开头，**本身不会输出到 CSS 中**，只有被 `@extend` 时才会生成样式：

```scss
// 占位符：不会输出到 CSS
%card-base {
  padding: 16px;
  border-radius: 4px;
  background: white;
}

.card-info {
  @extend %card-base;
  border-left: 4px solid blue;
}

.card-warning {
  @extend %card-base;
  border-left: 4px solid orange;
}
```

编译结果（`%card-base` 本身不输出）：

```css
.card-info,
.card-warning {
  padding: 16px;
  border-radius: 4px;
  background: white;
}
.card-info {
  border-left: 4px solid blue;
}
.card-warning {
  border-left: 4px solid orange;
}
```

### 占位符 vs 类选择器

| 特性                   | 类选择器 `.btn`  | 占位符 `%btn`  |
| ---------------------- | ---------------- | -------------- |
| 是否输出到 CSS         | ✅ 输出          | ❌ 不输出      |
| 能否直接在 HTML 中使用 | ✅ 可以          | ❌ 不可以      |
| 适用场景               | 既要输出又要继承 | 仅作为继承基类 |

---

## 三、链式继承

```scss
%base {
  display: inline-block;
  padding: 8px 16px;
}

%button {
  @extend %base;
  border: none;
  cursor: pointer;
}

.btn-primary {
  @extend %button;
  background: blue;
  color: white;
}
```

编译结果：

```css
.btn-primary {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  background: blue;
  color: white;
}
```

---

## 四、多重继承

一个选择器可以继承多个选择器：

```scss
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

%rounded {
  border-radius: 8px;
}

.modal {
  @extend %flex-center;
  @extend %rounded;
  background: white;
}
```

---

## 五、`@extend` 的注意事项

### 1. 会生成组合选择器

```scss
.icon {
  width: 16px;
}
.icon-large {
  @extend .icon;
  width: 32px;
}

// 编译结果
.icon,
.icon-large {
  width: 16px;
}
.icon-large {
  width: 32px;
}
```

### 2. ⚠️ 不要 `@extend` 跨模块

```scss
// ❌ 危险：跨模块 extend
// _buttons.scss
.btn {
  padding: 8px;
}

// _cards.scss
.card-button {
  @extend .btn;
}
```

跨模块 `@extend` 会导致：

- 编译顺序难以预测
- 样式来源难以追踪
- 可能产生意外的组合选择器

### 3. `@extend` 无法传递参数

```scss
// ❌ 无法这样写
.btn {
  @extend .base($color: red);
}
```

如果需要参数，请使用 **Mixin**。

---

## 六、`@extend` vs `@mixin` 选择

| 场景                     | 推荐                   |
| ------------------------ | ---------------------- |
| 需要传参                 | `@mixin`               |
| 共享一组相同样式，无参数 | `@extend` + 占位符     |
| 需要输出样式到 HTML 类名 | 类选择器 + `@extend`   |
| 仅作为内部复用基类       | 占位符 `%` + `@extend` |

### 性能对比

```scss
// Mixin：每个调用点都复制一份样式（产物大）
@mixin border-radius {
  border-radius: 4px;
}
.a {
  @include border-radius;
}
.b {
  @include border-radius;
}
.c {
  @include border-radius;
}
// 生成 3 份重复的 border-radius

// Extend：合并选择器（产物小）
%border-radius {
  border-radius: 4px;
}
.a {
  @extend %border-radius;
}
.b {
  @extend %border-radius;
}
.c {
  @extend %border-radius;
}
// 生成 .a, .b, .c { border-radius: 4px; }
```

---

## 七、下一步

- 上一章：[Mixin 与 Include](/web/styles/sass/04-mixin/)
- 下一章：[函数与运算](/web/styles/sass/06-functions/)
