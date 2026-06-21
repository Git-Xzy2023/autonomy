---
title: Less 最佳实践
---

# Less 最佳实践

## 一、命名规范

### 1. 变量命名

```less
// ✅ 推荐：分类 + 语义
@color-primary: #3498db;
@color-success: #2ecc71;
@color-danger: #e74c3c;

@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;

@font-size-sm: 12px;
@font-size-base: 14px;
@font-size-lg: 18px;

@z-index-dropdown: 1000;
@z-index-modal: 1050;

// ❌ 避免
@c1: #3498db;
@x: 16px;
```

### 2. Mixin 命名

```less
// ✅ 推荐：动词或描述性
.flex-center() { }
.text-ellipsis() { }
.respond-to(@bp) { }
.triangle(@dir, @size, @color) { }

// ❌ 避免
.center() { }  // 不明确
.mixin1() { }  // 无意义
```

---

## 二、文件组织

### 1. 推荐目录结构

```
less/
├── abstracts/       # 抽象层
│   ├── _variables.less
│   ├── _mixins.less
│   └── _functions.less
├── base/            # 基础层
│   ├── _reset.less
│   └── _typography.less
├── components/      # 组件层
│   ├── _buttons.less
│   ├── _cards.less
│   └── _forms.less
├── layout/          # 布局层
│   ├── _header.less
│   └── _grid.less
├── pages/           # 页面层
│   ├── _home.less
│   └── _about.less
├── themes/          # 主题层
│   └── _dark.less
└── main.less        # 主入口
```

### 2. `main.less` 入口

```less
// abstracts
@import 'abstracts/_variables.less';
@import 'abstracts/_mixins.less';

// base
@import 'base/_reset.less';
@import 'base/_typography.less';

// layout
@import 'layout/_header.less';
@import 'layout/_grid.less';

// components
@import 'components/_buttons.less';
@import 'components/_cards.less';

// pages
@import 'pages/_home.less';

// themes
@import 'themes/_dark.less';
```

### 3. `@import` 选项

```less
// inline：将文件内容内联到当前文件
@import (inline) 'vendor.css';

// reference：引用但不输出
@import (reference) '_variables.less';

// less：强制作为 Less 文件处理
@import (less) 'styles.css';

// css：强制作为 CSS 文件处理
@import (css) 'reset.css';

// once：只导入一次（默认行为）
@import (once) '_variables.less';

// multiple：允许多次导入
@import (multiple) '_mixins.less';
```

---

## 三、嵌套规范

### 1. 最多 3 层嵌套

```less
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
          color: red;  // 4 层
        }
      }
    }
  }
}
```

### 2. 合理使用 `&`

```less
// ✅ 推荐
.btn {
  &--primary { }      // BEM 修饰符
  &__icon { }          // BEM 元素
  &:hover { }          // 伪类
  &.is-active { }      // 状态类
}
```

---

## 四、Mixin vs Extend 选择

| 场景 | 推荐 | 原因 |
|------|------|------|
| 需要传参 | Mixin | Extend 无法传参 |
| 共享无参样式 | Extend | 产物更小 |
| 浏览器前缀 | Mixin | 需要参数 |
| 响应式媒体查询 | Mixin | 需要传入样式块 |
| 基础按钮样式 | Extend | 合并选择器 |

### Extend 用法

```less
// 定义
.btn-base {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

// 使用 Extend
.btn-primary:extend(.btn-base) {
  background: blue;
  color: white;
}

.btn-danger:extend(.btn-base) {
  background: red;
  color: white;
}
```

编译结果（合并选择器）：

```css
.btn-base, .btn-primary, .btn-danger {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
.btn-primary { background: blue; color: white; }
.btn-danger { background: red; color: white; }
```

---

## 五、性能优化

### 1. 避免过度使用 Extend

```less
// ❌ 危险：选择器爆炸
.base { }
.a:extend(.base) { }
.b:extend(.base) { }
.c:extend(.base) { }
// 生成 .base, .a, .b, .c { }
```

### 2. 使用 `@import (reference)`

引用但不输出文件内容：

```less
@import (reference) '_variables.less';
// _variables.less 的内容不会输出到最终 CSS
```

### 3. 生产环境压缩

```bash
lessc --clean-css input.less output.css
```

### 4. 避免深层嵌套

深层嵌套会生成过长的选择器，影响性能。

---

## 六、与 BEM 命名结合

```less
// _card.less
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

### 1. 使用变量覆盖

```less
// _theme-default.less
@bg-color: #ffffff;
@text-color: #333333;

// _theme-dark.less
@bg-color: #1a1a1a;
@text-color: #f0f0f0;

// 使用
@import '_theme-dark.less';

body {
  background: @bg-color;
  color: @text-color;
}
```

### 2. 使用 CSS 变量 + Less 变量

```less
// _variables.less
@colors: primary #3498db, success #2ecc71, danger #e74c3c;

:root {
  each(@colors, {
    --color-@{key}: @value;
  });
}

// 使用
.btn {
  background: var(--color-primary);
}
```

---

## 八、常见反模式

### 1. ❌ 过度抽象

```less
// 反模式：为了一次使用创建 mixin
.card-padding() {
  padding: 16px;
}

.card {
  .card-padding();  // 直接写 padding: 16px 更清晰
}
```

### 2. ❌ 魔法数字

```less
// 反模式
.title {
  margin-top: 23px;  // 这个 23 哪来的？
}

// 推荐
.title {
  margin-top: @spacing-md;  // 语义化
}
```

### 3. ❌ 深层嵌套

```less
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

1. **语义化命名变量**：`@color-primary` 而非 `@c1`
2. **遵循文件分层结构**：abstracts / base / components / layout / pages
3. **嵌套不超过 3 层**：避免选择器特异性过高
4. **合理选择 Mixin / Extend**：需要参数用 Mixin，共享无参样式用 Extend
5. **使用 `@import (reference)`**：引用但不输出
6. **生产环境压缩输出**：减小产物体积
7. **结合 BEM 命名**：让样式更易维护
8. **使用 `each()` 生成工具类**：避免手写重复代码

---

## 十、学习路线回顾

- [01 入门与安装](/web/styles/less/01-intro/)
- [02 变量](/web/styles/less/02-variables/)
- [03 嵌套](/web/styles/less/03-nesting/)
- [04 Mixin](/web/styles/less/04-mixin/)
- [05 函数与运算](/web/styles/less/05-functions/)
- [06 守卫与循环](/web/styles/less/06-guard-loop/)
- [07 最佳实践](/web/styles/less/07-best-practices/)

恭喜完成 Less 学习！🎉 接下来可以学习 [Tailwind CSS](/web/styles/tailwind/) 或对比 [Sass](/web/styles/sass/)。
