---
title: "DOM 的查询 / 创建 / 插入 / 删除 API？"
---

# DOM 的查询 / 创建 / 插入 / 删除 API？

```js
// ===== 查询 =====
document.getElementById("id");
document.querySelector(".cls"); // 第一个匹配
document.querySelectorAll(".cls"); // 全部（静态 NodeList）
document.getElementsByTagName("div"); // 动态 HTMLCollection
document.getElementsByClassName("cls"); // 动态

// ===== 创建 =====
const div = document.createElement("div");
div.textContent = "hello";
div.innerHTML = "<b>bold</b>"; // ⚠️ XSS 风险！用户输入不要用 innerHTML
div.setAttribute("data-id", "123");
div.dataset.id = "123"; // 同上（data-* 属性）

// ===== 插入 =====
parent.appendChild(child); // 末尾追加
parent.insertBefore(newNode, referenceNode);
parent.prepend(child); // 开头插入
parent.append(child1, child2); // 末尾（支持多个 + 字符串）
element.after(newEl); // 同级后面
element.before(newEl); // 同级前面

// ===== 删除 / 替换 =====
parent.removeChild(child);
child.remove(); // 更简单（现代 API）
parent.replaceChild(newNode, oldNode);

// ===== 克隆 =====
const clone = element.cloneNode(true); // true = 深克隆（含子节点）
```

**NodeList vs HTMLCollection**：

- `querySelectorAll` 返回**静态** NodeList（DOM 变化不会自动更新）
- `getElementsBy*` 返回**动态** HTMLCollection（实时反映 DOM 变化）
- 都能用 `for...of` 遍历，但只有 Array 才有 `map/filter`，需要 `[...list]` 转数组

---
