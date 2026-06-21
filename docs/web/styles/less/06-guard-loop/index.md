---
title: Less 守卫与循环
---

# Less 守卫与循环

## 一、守卫（Guard）

Less 使用 `when` 实现条件逻辑，类似 Sass 的 `@if`：

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

### 比较运算符

```less
.mixin(@n) when (@n > 10) { }
.mixin(@n) when (@n >= 10) { }
.mixin(@n) when (@n < 10) { }
.mixin(@n) when (@n <= 10) { }
.mixin(@n) when (@n = 10) { }
.mixin(@n) when (@n != 10) { }
```

### 逻辑运算

```less
// 与
.mixin(@a, @b) when (@a > 0) and (@b > 0) { }

// 或
.mixin(@a) when (@a > 0), (@a < -10) { }

// 非
.mixin(@a) when not (@a = 0) { }
```

### 类型守卫

```less
.padding(@value) when (ispixel(@value)) {
  padding: @value;
}
.padding(@value) when (ispercentage(@value)) {
  padding: @value;
}

.box { .padding(10px); }      // padding: 10px
.container { .padding(50%); } // padding: 50%
```

---

## 二、循环

Less 使用**递归 Mixin** 实现循环：

### 1. 基本循环

```less
.loop(@n) when (@n > 0) {
  .col-@{n} {
    width: (@n * 100% / 12);
  }
  .loop(@n - 1);  // 递归调用
}

.loop(12);  // 启动循环
```

编译结果：

```css
.col-12 { width: 100%; }
.col-11 { width: 91.66666667%; }
.col-10 { width: 83.33333333%; }
// ... 直到 .col-1
```

### 2. `each()` 函数（Less 3.7+）

```less
@colors: red, green, blue, yellow;

each(@colors, {
  .text-@{value} {
    color: @value;
  }
});
```

### 3. 遍历 Map（用列表模拟）

```less
@theme-colors: primary #3498db, success #2ecc71, warning #f39c12, danger #e74c3c;

each(@theme-colors, {
  .btn-@{key} {
    background: @value;
    color: white;
  }
  .text-@{key} {
    color: @value;
  }
});
```

### 4. `range()` 生成数字序列

```less
each(range(5), {
  .mt-@{value} {
    margin-top: @value * 4px;
  }
});
```

编译结果：

```css
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mt-5 { margin-top: 20px; }
```

### 5. `range()` 指定范围和步长

```less
each(range(0, 100, 20), {
  .w-@{value} {
    width: @value * 1%;
  }
});
// 生成 .w-0, .w-20, .w-40, .w-60, .w-80, .w-100
```

---

## 三、综合实战

### 1. 生成间距工具类

```less
@spacing-sizes: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12;
@spacing-unit: 4px;

each(@spacing-sizes, {
  @value-px: @value * @spacing-unit;

  .m-@{value}  { margin: @value-px; }
  .mt-@{value} { margin-top: @value-px; }
  .mb-@{value} { margin-bottom: @value-px; }
  .ml-@{value} { margin-left: @value-px; }
  .mr-@{value} { margin-right: @value-px; }
  .p-@{value}  { padding: @value-px; }
  .pt-@{value} { padding-top: @value-px; }
  .pb-@{value} { padding-bottom: @value-px; }
  .pl-@{value} { padding-left: @value-px; }
  .pr-@{value} { padding-right: @value-px; }
});
```

### 2. 生成栅格系统

```less
.loop-columns(@n, @i: 1) when (@i <= @n) {
  .col-@{i} {
    width: (@i * 100% / @n);
  }
  .loop-columns(@n, @i + 1);
}

.loop-columns(12);
```

### 3. 生成图标类

```less
@icons: home '\e900', user '\e901', settings '\e902', search '\e903';

each(@icons, {
  .icon-@{key} {
    font-family: 'iconfont';
    &::before {
      content: @value;
    }
  }
});
```

### 4. 响应式断点

```less
@breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px;

each(@breakpoints, {
  @media (min-width: @value) {
    .container-@{key} {
      max-width: @value;
      margin: 0 auto;
    }
  }
});
```

### 5. 主题色生成

```less
@theme-colors:
  primary #3498db,
  success #2ecc71,
  warning #f39c12,
  danger #e74c3c,
  info #95a5a6;

each(@theme-colors, {
  // 背景色
  .bg-@{key} { background: @value; }

  // 文字色
  .text-@{key} { color: @value; }

  // 按钮变体
  .btn-@{key} {
    background: @value;
    color: white;
    &:hover { background: darken(@value, 10%); }
    &:active { background: darken(@value, 20%); }
  }

  // 边框色
  .border-@{key} { border: 1px solid @value; }
});
```

---

## 四、条件 Mixin 实战

### 1. 主题切换

```less
.theme(@mode) when (@mode = dark) {
  background: #1a1a1a;
  color: #f0f0f0;
}
.theme(@mode) when (@mode = light) {
  background: #ffffff;
  color: #333333;
}

.card {
  .theme(dark);
}
```

### 2. 响应式工具

```less
.show-on(@size) when (@size = mobile) {
  @media (max-width: 768px) { display: block; }
  @media (min-width: 769px) { display: none; }
}
.show-on(@size) when (@size = desktop) {
  @media (max-width: 768px) { display: none; }
  @media (min-width: 769px) { display: block; }
}

.mobile-only { .show-on(mobile); }
.desktop-only { .show-on(desktop); }
```

---

## 五、下一步

- 上一章：[函数与运算](/web/styles/less/05-functions/)
- 下一章：[最佳实践](/web/styles/less/07-best-practices/)
