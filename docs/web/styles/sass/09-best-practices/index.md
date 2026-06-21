---
title: Sass 最佳实践
---

# Sass 最佳实践

## 一、命名规范

### 1. 变量命名

```scss
// ✅ 推荐：分类 + 语义
$color-primary: #3498db;
$color-success: #2ecc71;
$color-danger: #e74c3c;

$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-lg: 18px;

$z-index-dropdown: 1000;
$z-index-modal: 1050;

// ❌ 避免
$c1: #3498db;
$x: 16px;
```

### 2. Mixin 命名

```scss
// ✅ 推荐：动词或描述性
@mixin flex-center { }
@mixin text-ellipsis { }
@mixin respond-to($bp) { }
@mixin triangle($dir, $size, $color) { }

// ❌ 避免
@mixin center { }  // 不明确
@mixin mixin1 { }  // 无意义
```

### 3. 占位符命名

```scss
// ✅ 推荐：以 % 开头，语义化
%card-base { }
%button-base { }
%list-reset { }
```

---

## 二、文件组织

### 1. 使用 7-1 模式

参考 [模块化与 @use](/web/styles/sass/08-modules/) 章节。

### 2. 文件命名

- 部分文件以下划线开头：`_variables.scss`
- 入口文件无下划线：`main.scss`
- 使用小写 + 连字符：`_button-group.scss`

### 3. 每个文件单一职责

```scss
// ✅ 推荐：_buttons.scss 只放按钮相关样式
.btn { }
.btn-primary { }
.btn-danger { }

// ❌ 避免：_buttons.scss 里放表单样式
.btn { }
.form-input { }  // 应该在 _forms.scss
```

---

## 三、嵌套规范

### 1. 最多 3 层嵌套

```scss
// ✅ 推荐
.nav {
  li {
    a {
      color: white;
    }
  }
}

// ❌ 避免：嵌套过深
.nav {
  ul {
    li {
      a {
        span {
          color: red;  // 4 层，选择器特异性过高
        }
      }
    }
  }
}
```

### 2. 合理使用 `&`

```scss
// ✅ 推荐
.btn {
  &--primary { }      // BEM 修饰符
  &__icon { }          // BEM 元素
  &:hover { }          // 伪类
  &.is-active { }      // 状态类
}

// ❌ 避免：过度使用 &
.btn {
  &__wrapper {
    &__inner {
      &__content {  // 过度 BEM
        &__title { }
      }
    }
  }
}
```

---

## 四、Mixin vs Extend 选择

| 场景 | 推荐 | 原因 |
|------|------|------|
| 需要传参 | Mixin | Extend 无法传参 |
| 共享无参样式 | Extend + 占位符 | 产物更小 |
| 浏览器前缀 | Mixin | 需要参数 |
| 响应式媒体查询 | Mixin + `@content` | 需要传入样式块 |
| 基础按钮样式 | Extend + `%` | 合并选择器 |

```scss
// ✅ Mixin：需要参数
@mixin button-variant($bg, $color: white) {
  background: $bg;
  color: $color;
}

// ✅ Extend：共享无参样式
%button-base {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
```

---

## 五、性能优化

### 1. 避免过度使用 `@extend`

`@extend` 会生成组合选择器，过度使用会导致选择器爆炸：

```scss
// ❌ 危险：选择器爆炸
.base { }
.a { @extend .base; }
.b { @extend .base; }
.c { @extend .base; }
// 生成：.base, .a, .b, .c { }

// 如果 .a, .b, .c 又被其他选择器 extend，会指数级增长
```

### 2. 使用 `@use` 替代 `@import`

`@import` 会重复加载文件，`@use` 只加载一次。

### 3. 避免在循环中创建复杂样式

```scss
// ❌ 慢：循环内嵌套大量样式
@for $i from 1 through 100 {
  .item-#{$i} {
    width: $i * 10px;
    height: $i * 10px;
    margin: $i * 2px;
    padding: $i * 1px;
    // ... 更多样式
  }
}

// ✅ 快：简化循环内的样式
@for $i from 1 through 100 {
  .item-#{$i} {
    width: $i * 10px;
  }
}
```

### 4. 输出格式

生产环境使用 `compressed` 格式：

```bash
sass --style=compressed input.scss output.css
```

---

## 六、与 BEM 命名结合

```scss
// _card.scss
.card {
  background: white;
  border-radius: 4px;
  overflow: hidden;

  &__header {
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  &__title {
    margin: 0;
    font-size: 18px;
  }

  &__body {
    padding: 16px;
  }

  &__footer {
    padding: 12px 16px;
    background: #f9f9f9;
  }

  &--highlighted {
    border: 2px solid gold;
  }

  &--flat {
    border-radius: 0;
    box-shadow: none;
  }
}
```

---

## 七、主题化方案

### 1. 使用 Map 管理主题

```scss
// _themes.scss
$themes: (
  light: (
    bg: #ffffff,
    text: #333333,
    border: #e0e0e0,
  ),
  dark: (
    bg: #1a1a1a,
    text: #f0f0f0,
    border: #333333,
  ),
);

@mixin theme($name) {
  $theme: map-get($themes, $name);

  background: map-get($theme, bg);
  color: map-get($theme, text);
  border-color: map-get($theme, border);
}

// 使用
.card {
  @include theme(light);

  .dark & {
    @include theme(dark);
  }
}
```

### 2. 使用 CSS 变量 + Sass 变量

```scss
// _variables.scss
$colors: (
  primary: #3498db,
  success: #2ecc71,
  danger: #e74c3c,
);

:root {
  @each $name, $color in $colors {
    --color-#{$name}: #{$color};
  }
}

// 使用
.btn {
  background: var(--color-primary);
}
```

---

## 八、常见反模式

### 1. ❌ 过度抽象

```scss
// 反模式：为了一次使用创建 mixin
@mixin card-padding {
  padding: 16px;
}

.card {
  @include card-padding;  // 直接写 padding: 16px 更清晰
}
```

### 2. ❌ 魔法数字

```scss
// 反模式
.title {
  margin-top: 23px;  // 这个 23 哪来的？
}

// 推荐
.title {
  margin-top: $spacing-md;  // 语义化
}
```

### 3. ❌ 深层嵌套

```scss
// 反模式
.page {
  .container {
    .row {
      .col {
        .card {
          .title {  // 6 层嵌套
            color: red;
          }
        }
      }
    }
  }
}
```

---

## 九、总结

1. **使用 `@use` 而非 `@import`**：避免全局污染和重复加载
2. **遵循 7-1 文件结构**：清晰分层，便于维护
3. **嵌套不超过 3 层**：避免选择器特异性过高
4. **语义化命名变量**：`$color-primary` 而非 `$c1`
5. **合理选择 Mixin / Extend**：需要参数用 Mixin，共享无参样式用 Extend
6. **生产环境压缩输出**：减小产物体积
7. **结合 BEM 命名**：让样式更易维护
8. **使用 Map 管理主题**：便于扩展和切换

---

## 十、学习路线回顾

- [01 入门与安装](/web/styles/sass/01-intro/)
- [02 变量与数据类型](/web/styles/sass/02-variables/)
- [03 嵌套与作用域](/web/styles/sass/03-nesting/)
- [04 Mixin 与 Include](/web/styles/sass/04-mixin/)
- [05 继承与占位符](/web/styles/sass/05-extend/)
- [06 函数与运算](/web/styles/sass/06-functions/)
- [07 控制指令](/web/styles/sass/07-control/)
- [08 模块化与 @use](/web/styles/sass/08-modules/)
- [09 最佳实践](/web/styles/sass/09-best-practices/)

恭喜完成 Sass 学习！🎉 接下来可以学习 [Less](/web/styles/less/) 或 [Tailwind CSS](/web/styles/tailwind/)。
