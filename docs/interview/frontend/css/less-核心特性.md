---
title: "Less 核心特性"
---

# Less 核心特性

```less
// 变量
@primary-color: #007bff;
@padding: 16px;

// 使用变量
.button {
  background-color: @primary-color;
  padding: @padding;
}

// 嵌套
.nav {
  background: #333;

  ul {
    list-style: none;
  }

  a {
    color: white;
    &:hover {
      color: @primary-color;
    }
  }
}

// 混合（Mixins）
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  .flex-center();
}

// 函数（Less 内置函数）
.lighten-color {
  background-color: lighten(@primary-color, 20%);
}

// 条件语句
.button when (@color = red) {
  background: red;
}

// 循环
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .col-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}
```

---
