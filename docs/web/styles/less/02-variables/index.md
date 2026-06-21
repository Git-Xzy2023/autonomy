---
title: Less 变量
---

# Less 变量

## 一、变量声明与使用

Less 使用 `@` 符号声明变量：

```less
// 变量声明
@primary-color: #3498db;
@spacing: 16px;
@font-stack: 'Helvetica', 'Arial', sans-serif;

// 变量使用
body {
  font-family: @font-stack;
  color: @primary-color;
  padding: @spacing;
}
```

---

## 二、变量作用域

Less 的变量作用域遵循**就近原则**（与 Sass 不同）：

```less
@color: red;

.box {
  @color: blue; // 局部变量
  color: @color; // blue（就近原则）
}

.other {
  color: @color; // red（使用全局）
}
```

### 块级作用域

```less
.container {
  @padding: 10px;
  .inner {
    padding: @padding; // 10px
  }
  // @padding 在这里仍然可见（Less 的变量提升特性）
}

.outer {
  padding: @padding; // ❌ 报错：未定义
}
```

> ⚠️ Less 的作用域规则与 Sass 略有不同，Less 中变量在定义后整个文件都可见（类似 var 提升），但块内重新赋值只影响块内。

---

## 三、变量的延迟求值

Less 变量是"懒加载"的，同作用域内最后一次定义的值生效：

```less
@var: 0;
.box {
  @var: 1;
  width: @var;  // 2（不是 1）
  @var: 2;
}
```

---

## 四、变量插值

变量可以用于选择器、属性名、URL 等：

```less
// 选择器插值
@selector: btn;
.@{selector}-primary { }
.@{selector}-danger { }

// 属性名插值
@property: color;
.box {
  @{property}: red;
  background-@{property}: blue;
}

// URL 插值
@images: '../assets/img';
.logo {
  background: url('@{images}/logo.png');
}

// 媒体查询插值
@breakpoint: 768px;
@media (min-width: @breakpoint) {
  .container { width: 100%; }
}
```

---

## 五、变量运算

```less
@base: 10px;

.box {
  width: @base + 20px;    // 30px
  height: @base * 2;      // 20px
  margin: @base - 5px;    // 5px
  padding: @base / 2;     // 5px
}
```

### 带单位的运算

```less
@width: 100px;

// 相同单位运算
.container {
  width: @width + 50px;   // 150px
  margin: @width - 20px;  // 80px
}

// 不同单位运算（Less 会转换）
.box {
  width: 10cm + 20mm;     // 12cm
  font-size: 16px + 2pt;  // 18.666px
}
```

### 颜色运算

```less
@color: #3498db;

.lighter { background: @color + #111; }  // #44a9ec
.darker { background: @color - #111; }   // #2488ca
```

> 💡 推荐使用颜色函数：`lighten()`、`darken()`、`fade()` 等。

---

## 六、变量作为变量名

```less
@primary: blue;
@color-key: primary;

.box {
  color: @@color-key; // 等价于 @primary，即 blue
}
```

---

## 七、默认变量

Less 没有 `!default`，但可以通过覆盖实现：

```less
// _variables.less
@primary: blue;

// 业务代码（在 import 之后覆盖）
@import 'variables';
@primary: red; // 覆盖

.btn {
  background: @primary; // red
}
```

---

## 八、变量命名规范

```less
// ✅ 推荐：分类 + 语义
@color-primary: #3498db;
@color-success: #2ecc71;
@color-danger: #e74c3c;

@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;

@font-size-sm: 12px;
@font-size-base: 14px;
@font-size-lg: 18px;

@z-index-dropdown: 1000;
@z-index-modal: 1050;

// ❌ 避免
@c1: #3498db;
@x: 16px;
```

---

## 九、使用 Map 模拟（用列表）

Less 没有原生的 Map 类型，但可以用列表模拟：

```less
@breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px;

each(@breakpoints, {
  @media (min-width: @value) {
    .container-@{key} { max-width: @value; }
  }
});
```

---

## 十、下一步

- 上一章：[Less 入门与安装](/web/styles/less/01-intro/)
- 下一章：[嵌套](/web/styles/less/03-nesting/)
