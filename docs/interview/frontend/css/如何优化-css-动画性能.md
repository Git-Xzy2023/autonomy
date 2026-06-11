---
title: "如何优化 CSS 动画性能？"
---

# 如何优化 CSS 动画性能？

**CSS 动画性能优化的核心原则：**

#### 1. 使用 transform 和 opacity 进行动画

```css
/* 推荐：使用 transform 和 opacity（GPU 加速，不触发回流和重绘） */
.good {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.good:hover {
  transform: translateX(50px);
  opacity: 0.8;
}

/* 不推荐：使用 top/left（触发回流和重绘） */
.bad {
  transition:
    left 0.3s,
    top 0.3s;
  position: relative;
  left: 0;
  top: 0;
}
.bad:hover {
  left: 50px;
  top: 50px;
}
```

**为什么 transform 和 opacity 性能更好？**

- 它们可以在**合成线程**中处理，不会触发回流（Reflow）和重绘（Repaint）
- 可以利用 GPU 加速
- 不会影响文档流中的其他元素

**影响性能的属性（避免动画）：**

| 属性                             | 触发                         | 性能影响 |
| -------------------------------- | ---------------------------- | -------- |
| `width`, `height`                | 回流 + 重绘                  | ⚠️ 高    |
| `top`, `left`, `right`, `bottom` | 回流 + 重绘                  | ⚠️ 高    |
| `margin`, `padding`              | 回流 + 重绘                  | ⚠️ 高    |
| `border`                         | 回流 + 重绘                  | ⚠️ 高    |
| `font-size`                      | 回流 + 重绘                  | ⚠️ 高    |
| `color`                          | 重绘                         | ✅ 中等  |
| `background`                     | 重绘                         | ✅ 中等  |
| `visibility`                     | 重绘                         | ✅ 中等  |
| `transform`                      | 不触发                       | ✅ 最佳  |
| `opacity`                        | 不触发（不与其他属性混用时） | ✅ 最佳  |

---

#### 2. 使用 will-change 提示浏览器

```css
/* 告诉浏览器这个元素即将发生变化，提前准备优化 */
.box {
  will-change: transform, opacity;
}

/* 或者使用 transform 提升到独立图层 */
.box {
  transform: translateZ(0); /* 3D 变换，强制创建新图层 */
  /* 或使用 */
  will-change: transform;
}
```

> **注意**：`will-change` 不要过度使用，否则会消耗过多内存。只在确实需要动画的元素上使用。

---

#### 3. 避免使用影响布局的属性动画

```css
/* ❌ 不推荐：改变 width 会影响布局 */
.bad {
  transition: width 0.3s;
}
.bad:hover {
  width: 200px;
}

/* ✅ 推荐：使用 scale 替代 */
.good {
  transition: transform 0.3s;
  transform-origin: left center;
}
.good:hover {
  transform: scaleX(1.5); /* 视觉效果类似，但不影响布局 */
}
```

---

#### 4. 减少动画元素的数量

```css
/* ❌ 避免：过多元素同时动画 */
.items .item {
  transition: transform 0.3s;
}

/* ✅ 推荐：只动画必要的元素 */
.item.active {
  transform: scale(1.1);
}
```

---

#### 5. 使用 contain 属性隔离渲染

```css
.box {
  contain: layout paint; /* 告诉浏览器这个元素的渲染不影响外部 */
}
```

---

#### 6. 避免在移动设备上使用复杂动画

- 减少同时动画的元素数量
- 使用 `@media (prefers-reduced-motion: reduce)` 尊重用户设置

```css
/* 尊重用户的动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### 7. 使用 requestAnimationFrame 控制动画（JavaScript）

```javascript
function animate() {
  // 更新动画状态
  element.style.transform = "translateX(...)";

  // 下一帧继续
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

---

**性能优化总结：**

1. ✅ **优先使用** `transform` 和 `opacity` 进行动画
2. ✅ 使用 `will-change` 或 `translateZ(0)` 创建独立图层
3. ✅ 避免动画 `width`、`top`、`left` 等属性
4. ✅ 减少同时动画的元素数量
5. ✅ 尊重用户的 `prefers-reduced-motion` 设置
6. ✅ 复杂动画考虑使用 JavaScript + requestAnimationFrame

---
