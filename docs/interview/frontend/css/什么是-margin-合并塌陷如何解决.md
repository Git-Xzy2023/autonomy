---
title: "什么是 margin 合并（塌陷）？如何解决？"
---

# 什么是 margin 合并（塌陷）？如何解决？

**margin 合并（Margin Collapsing）是指当两个或多个垂直方向的 margin 相遇时，它们会合并成一个 margin，而不是简单相加。**

**margin 合并的三种情况：**

#### 1. 相邻兄弟元素的 margin 合并

```html
<p style="margin-bottom: 20px;">第一段文字</p>
<p style="margin-top: 30px;">第二段文字</p>
<!-- 两个 <p> 之间的间距不是 50px，而是 30px（取较大值） -->
```

#### 2. 父元素和第一个/最后一个子元素的 margin 合并

```html
<div style="margin-top: 20px;">
  <p style="margin-top: 30px;">子元素</p>
</div>
<!-- 父元素和子元素的 margin-top 合并，最终取 30px -->
```

#### 3. 空块级元素的 margin 合并

```html
<div style="margin-top: 20px; margin-bottom: 30px;"></div>
<!-- 空元素的上下 margin 合并，最终为 30px -->
```

**margin 合并的规则：**

1. **只发生在垂直方向**：水平方向的 margin 永远不会合并
2. **取较大值**：合并后的 margin 等于参与合并的 margin 中的最大值
3. **负 margin 影响**：
   - 都是正值：取最大值
   - 都是负值：取最小值（更负）
   - 一正一负：相加

```css
/* 都是正值：取较大值 50px */
.margin1 {
  margin-bottom: 20px;
}
.margin2 {
  margin-top: 50px;
}

/* 都是负值：取较小值 -30px */
.margin3 {
  margin-bottom: -10px;
}
.margin4 {
  margin-top: -30px;
}

/* 一正一负：相加得 20px */
.margin5 {
  margin-bottom: 50px;
}
.margin6 {
  margin-top: -30px;
}
```

**解决 margin 合并的方法：**

| 方法                                        | 示例                                               | 原理                     |
| ------------------------------------------- | -------------------------------------------------- | ------------------------ |
| 给父元素添加 `overflow: hidden/auto/scroll` | `.parent { overflow: hidden; }`                    | 创建 BFC                 |
| 给父元素添加 `border`                       | `.parent { border: 1px solid transparent; }`       | 阻断合并                 |
| 给父元素添加 `padding`                      | `.parent { padding-top: 1px; }`                    | 阻断合并                 |
| 使用 `display: inline-block`                | `.child { display: inline-block; }`                | 行内块不参与合并         |
| 使用 `display: flex/grid`                   | `.parent { display: flex; }`                       | flex/grid 子项不参与合并 |
| 子元素使用 `float`                          | `.child { float: left; }`                          | 浮动元素不参与合并       |
| 子元素使用 `position: absolute`             | `.child { position: absolute; }`                   | 绝对定位不参与合并       |
| 使用 `::before` / `::after` 伪元素          | `.parent::before { content: ''; display: table; }` | 创建 BFC                 |

> **最常用的解决方案**：给父元素添加 `overflow: hidden` 或使用 BFC 相关的方法。在现代布局中，使用 Flexbox 或 Grid 可以天然避免 margin 合并问题。

---
