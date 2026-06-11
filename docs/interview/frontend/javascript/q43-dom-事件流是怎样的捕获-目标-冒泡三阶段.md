---
title: "DOM 事件流是怎样的？捕获 / 目标 / 冒泡三阶段？"
---

# DOM 事件流是怎样的？捕获 / 目标 / 冒泡三阶段？

```text
   window
     │  ↓  捕获阶段（从外到内，addEventListener 第三个参数为 true 时触发）
   document
     │
    html
     │
    body
     │
    div  ── 目标阶段（target）
     │
    body  ← 冒泡阶段（从内到外，默认行为）
     │
   html
     │
   document
     │
   window
```

**三阶段**：

1. **捕获阶段（Capture）**：事件从 window 一层层向下传递到目标元素
2. **目标阶段（Target）**：事件到达实际触发的元素
3. **冒泡阶段（Bubbling）**：事件再从目标元素一层层向上冒泡回 window

```js
// 第三个参数：true = 捕获阶段触发，false/省略 = 冒泡阶段触发
div.addEventListener("click", () => console.log("捕获-div"), true);
div.addEventListener("click", () => console.log("冒泡-div"), false);

// 点击 div 时，捕获会先于冒泡触发
// 事件流顺序：window 捕获 → document 捕获 → ... → div 目标 → ... → document 冒泡 → window 冒泡
```

**阻止冒泡**：`event.stopPropagation()` 或 `event.stopImmediatePropagation()`（后者还会阻止同元素上后续的监听器）。
**阻止默认行为**：`event.preventDefault()`（如 a 标签跳转、form 提交）。

---
