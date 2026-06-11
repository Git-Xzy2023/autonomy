---
title: "什么是回流（Reflow）和重绘（Repaint）？如何优化？"
---

# 什么是回流（Reflow）和重绘（Repaint）？如何优化？

#### 基本概念

**回流（Reflow / Layout）**：当渲染树中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程。

**会导致回流的操作：**

- 页面首次渲染
- 浏览器窗口大小改变
- 元素尺寸或位置改变
- 元素内容变化（文字数量或图片大小等）
- 元素字体大小变化
- 添加或删除可见的 DOM 元素
- 激活 CSS 伪类（如 `:hover`）
- 设置 `style` 属性
- 查询某些属性或调用某些方法（如 `offsetWidth`、`getBoundingClientRect`）

**重绘（Repaint / Paint）**：当元素样式的改变不影响布局时（如 `color`、`background-color`、`visibility` 等），浏览器将对元素进行重新绘制。

**回流必将引起重绘，重绘不一定会引起回流。**

#### 性能影响

- **回流**：成本较高，需要重新计算布局
- **重绘**：成本相对较低，只需要重新绘制像素

#### 优化方案

```javascript
// ✅ 1. 避免频繁操作样式，一次性修改
// ❌ 不推荐
element.style.width = "100px";
element.style.height = "100px";
element.style.margin = "10px";

// ✅ 推荐
element.style.cssText = "width: 100px; height: 100px; margin: 10px;";
// 或
element.classList.add("new-style");

// ✅ 2. 避免频繁操作 DOM
// ❌ 不推荐
for (let i = 0; i < 100; i++) {
  const div = document.createElement("div");
  document.body.appendChild(div);
}

// ✅ 推荐：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement("div");
  fragment.appendChild(div);
}
document.body.appendChild(fragment);

// ✅ 3. 先隐藏元素，操作后再显示
element.style.display = "none";
// 进行多次 DOM 操作...
element.style.display = "block";

// ✅ 4. 避免频繁读取会触发回流的属性
// ❌ 不推荐
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = elements[i].offsetWidth + 10 + "px";
}

// ✅ 推荐：先缓存所有值
const widths = elements.map((el) => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px";
});
```

```css
/* ✅ 5. 使用 transform 和 opacity 做动画（GPU 加速，不触发回流） */
.animated {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.animated:hover {
  transform: translateX(50px);
  opacity: 0.8;
}

/* ✅ 6. 使用 will-change 提示浏览器 */
.box {
  will-change: transform, opacity;
}

/* ✅ 7. 使用 contain 属性隔离渲染 */
.card {
  contain: layout paint;
}
```

---
