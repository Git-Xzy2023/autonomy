---
title: "`e.target` vs `e.currentTarget` vs `this`？"
---

# `e.target` vs `e.currentTarget` vs `this`？

| 变量              | 含义                                       | 何时变化            |
| ----------------- | ------------------------------------------ | ------------------- |
| `e.target`        | **实际触发事件**的元素（最内层）           | 不变                |
| `e.currentTarget` | **当前正在处理事件**的元素（绑事件的那个） | 冒泡/捕获路径上变化 |
| `this`            | 同 `currentTarget`（箭头函数除外）         | 同上                |

```html
<div id="outer">
  <button id="inner">点我</button>
</div>
```

```js
document.getElementById("outer").addEventListener("click", function (e) {
  console.log(e.target.id); // 'inner'（实际被点击的）
  console.log(e.currentTarget.id); // 'outer'（绑事件的元素）
  console.log(this.id); // 'outer'（同 currentTarget）
});
```

---
