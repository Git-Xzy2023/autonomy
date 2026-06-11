---
title: "回流（Reflow / Layout）与重绘（Repaint）？如何优化？"
---

# 回流（Reflow / Layout）与重绘（Repaint）？如何优化？

**回流 = 布局重新计算**（元素尺寸/位置变化 → 整个渲染树要重算）
**重绘 = 像素重新绘制**（如颜色变化，不影响布局 → 只需要重绘）

> 回流一定触发重绘，重绘不一定触发回流。

```js
// ❌ 差：每次读+写交替，浏览器被迫在每一行都回流
const el = document.getElementById("box");
el.style.width = "100px";
console.log(el.offsetWidth); // 强制同步布局
el.style.height = "200px";
console.log(el.offsetHeight); // 又一次回流

// ✅ 好：先读后写（批量写入 DOM）
const w = el.offsetWidth;
const h = el.offsetHeight;
el.style.width = w * 2 + "px";
el.style.height = h * 2 + "px";

// ✅ 更好：用 CSS class 批量修改
el.classList.add("active");

// ✅ 或：离屏操作（DocumentFragment）
const frag = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  frag.appendChild(document.createElement("div"));
}
container.appendChild(frag); // 只触发 1 次回流

// ✅ 或：先 display:none，操作后再恢复（对大改动有用）
container.style.display = "none";
// ...大量 DOM 操作...
container.style.display = "";
```

**其他优化手段**：

- 用 `transform / opacity` 做动画（只触发合成层，不回流不重绘）
- `will-change: transform` 提前提升为合成层
- 避免频繁读取 `offsetWidth / getBoundingClientRect` 等布局属性
- 图片设宽高，避免加载后挤压导致回流
- 用 `requestAnimationFrame` 把 DOM 操作合并到同一帧

---
