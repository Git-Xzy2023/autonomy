---
title: "什么是定位（position）？有哪些定位方式？"
---

# 什么是定位（position）？有哪些定位方式？

**`position` 属性用于指定元素的定位方式，决定元素在文档中的位置计算规则。**

#### position 的五种值

| 值         | 描述               | 是否脱离文档流    | 参照物                         |
| ---------- | ------------------ | ----------------- | ------------------------------ |
| `static`   | 静态定位（默认值） | ❌ 否             | 正常文档流                     |
| `relative` | 相对定位           | ❌ 否             | 元素自身原来的位置             |
| `absolute` | 绝对定位           | ✅ 是             | 最近的非 static 定位的祖先元素 |
| `fixed`    | 固定定位           | ✅ 是             | 浏览器窗口（视口）             |
| `sticky`   | 粘性定位           | ❌/✅（条件触发） | 最近的可滚动祖先或视口         |

#### 详细说明

**1. static（静态定位）**

- 默认值，元素按照正常文档流排列
- `top/right/bottom/left/z-index` 属性无效

```css
.box {
  position: static; /* 默认，可以省略 */
}
```

**2. relative（相对定位）**

- 相对于元素自身原来的位置进行偏移
- 偏移后，原来占据的空间仍然保留（不脱离文档流）
- 常作为 `absolute` 定位元素的父容器

```css
.box {
  position: relative;
  top: 20px; /* 向下移动 20px */
  left: 30px; /* 向右移动 30px */
}
```

**3. absolute（绝对定位）**

- 脱离文档流，不占据空间
- 相对于最近的"已定位"（非 static）祖先元素定位
- 如果没有已定位的祖先元素，则相对于 `<html>`（初始包含块）定位

```css
.parent {
  position: relative; /* 作为定位参照物 */
}
.child {
  position: absolute;
  top: 10px;
  right: 20px;
  width: 100px;
  height: 100px;
}
```

**4. fixed（固定定位）**

- 脱离文档流，不占据空间
- 相对于浏览器窗口（视口）定位
- 页面滚动时位置保持不变

```css
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
```

**5. sticky（粘性定位）**

- 相对定位和固定定位的混合体
- 在特定滚动阈值之前是相对定位，之后变为固定定位
- 需要配合 `top/right/bottom/left` 使用

```css
.nav {
  position: sticky;
  top: 0; /* 滚动到顶部时固定 */
}
```

#### 定位相关属性

| 属性      | 描述                             |
| --------- | -------------------------------- |
| `top`     | 元素顶部距离参考物顶部的距离     |
| `right`   | 元素右侧距离参考物右侧的距离     |
| `bottom`  | 元素底部距离参考物底部的距离     |
| `left`    | 元素左侧距离参考物左侧的距离     |
| `z-index` | 元素的堆叠顺序（数值越大越靠前） |

#### 定位的经典应用场景

| 场景           | 推荐使用的定位方式              |
| -------------- | ------------------------------- |
| 元素微调       | relative                        |
| 弹窗、下拉菜单 | relative（父） + absolute（子） |
| 回到顶部按钮   | fixed                           |
| 吸附导航栏     | sticky                          |
| 遮罩层         | fixed                           |

> **小技巧**：使用 `absolute` 定位实现元素水平垂直居中：
>
> ```css
> .center {
>   position: absolute;
>   top: 50%;
>   left: 50%;
>   transform: translate(-50%, -50%);
> }
> ```

---
