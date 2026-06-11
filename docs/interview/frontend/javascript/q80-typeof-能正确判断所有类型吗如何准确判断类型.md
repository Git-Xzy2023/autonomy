---
title: "`typeof` 能正确判断所有类型吗？如何准确判断类型？"
---

# `typeof` 能正确判断所有类型吗？如何准确判断类型？

```js
// typeof 的坑
typeof null; // 'object'（历史 bug）
typeof []; // 'object'
typeof new Date(); // 'object'
typeof /abc/; // 'object'（ES2015+ 修正为 'object'，但之前是 'function'）
typeof new Function(); // 'function'
typeof Symbol(); // 'symbol'
typeof 123n; // 'bigint'

// ✅ 精准判断：Object.prototype.toString.call()
function getType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}
getType(null); // 'null'
getType([]); // 'array'
getType(new Date()); // 'date'
getType(/abc/); // 'regexp'
getType(new Map()); // 'map'
getType(Promise.resolve()); // 'promise'
```

---

**结语**：JavaScript 知识点庞大，建议复习路径 —— 基础语法 → 闭包/原型/this → 异步/Promise/事件循环 → 浏览器/DOM → 模块化 → 工程化 → 性能优化。配合大量手写练习，面试时才能思路清晰、代码流畅。
