---
title: "事件委托（Event Delegation）是什么？为什么要用它？"
---

# 事件委托（Event Delegation）是什么？为什么要用它？

**事件委托 = 把事件绑在父元素上，利用"冒泡"机制统一处理子元素的事件**。

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```js
// ❌ 不好：每个 li 单独绑定（新增的 li 还得重绑）
document.querySelectorAll("#list li").forEach((li) => {
  li.addEventListener("click", () => console.log(li.textContent));
});

// ✅ 好：委托给父元素 ul
document.getElementById("list").addEventListener("click", (e) => {
  const target = e.target.closest("li"); // 点到 li 内部的子元素也能正确匹配
  if (target) console.log(target.textContent);
});
```

**优点**：

- 内存占用少（只绑 1 个 instead of N 个）
- 动态新增的元素自动生效（不需要重新绑定）
- 代码更简洁

---
