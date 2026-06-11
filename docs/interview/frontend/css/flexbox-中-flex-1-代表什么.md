---
title: "Flexbox 中 flex: 1 代表什么？"
---

# Flexbox 中 flex: 1 代表什么？

**`flex: 1` 是以下三个属性的简写：**

```css
.item {
  flex-grow: 1; /* 放大比例：如果有剩余空间，可以放大 */
  flex-shrink: 1; /* 缩小比例：如果空间不足，可以缩小 */
  flex-basis: 0%; /* 初始大小：从 0 开始计算 */
}
```

**常见的 flex 简写值：**

| 简写             | 含义                              |
| ---------------- | --------------------------------- |
| `flex: 1`        | `flex: 1 1 0%` - 平均分配剩余空间 |
| `flex: auto`     | `flex: 1 1 auto` - 根据内容分配   |
| `flex: none`     | `flex: 0 0 auto` - 不放大也不缩小 |
| `flex: 0 1 auto` | 默认值，不放大可缩小              |

**示例对比：**

```css
.container {
  display: flex;
  width: 600px;
}

/* flex: 1 - 三个项目平分空间，各 200px */
.item-equal {
  flex: 1;
}

/* flex: auto - 三个项目根据内容分配，再平分剩余空间 */
.item-auto {
  flex: auto;
}

/* flex: 2 1 0% - 第一个项目占其他项目的两倍空间 */
.item-first {
  flex: 2;
}
.item-second,
.item-third {
  flex: 1;
}
```

---
