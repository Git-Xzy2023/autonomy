---
title: "`innerHTML`、`textContent`、`innerText` 的区别？"
---

# `innerHTML`、`textContent`、`innerText` 的区别？

| API           | 内容                  | 性能                     | 安全性      |
| ------------- | --------------------- | ------------------------ | ----------- |
| `innerHTML`   | 解析 HTML             | 慢（触发重排+解析）      | ⚠️ XSS 风险 |
| `textContent` | 纯文本                | 快                       | 安全        |
| `innerText`   | 受 CSS 影响的可见文本 | 最慢（触发回流计算样式） | 安全        |

```html
<p id="demo">Hello <b style="display:none">hidden</b> world</p>
```

```js
demo.textContent; // 'Hello hidden world'（包括 display:none 的）
demo.innerText; // 'Hello  world'（受 CSS 影响，不含隐藏文本）
demo.innerHTML; // 'Hello <b style="display:none">hidden</b> world'
```

> ✅ **最佳实践**：纯文本一律用 `textContent`；需要 HTML 结构时确保内容可信，或用 `DOMPurify` 过滤。

---
