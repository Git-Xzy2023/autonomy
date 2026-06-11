---
title: "`Map` 和普通对象 `Object` 有什么区别？什么时候用 `Map`？"
---

# `Map` 和普通对象 `Object` 有什么区别？什么时候用 `Map`？

| 对比项 | 普通对象 `{}` | `new Map()` |
| --- | --- | --- |
| 键的类型 | 只能是字符串/Symbol（其他会被 `toString`） | **任意类型**（包括对象、函数、数字） |
| 键的顺序 | ES2015 之前不保证；之后整数键会被排序插入 | **保持插入顺序** |
| 大小 | 需要 `Object.keys(obj).length` 手动算 | `.size` |
| 迭代 | 需要 `Object.keys/values/entries` 先转换 | 天生可迭代：`for...of`、`.forEach` |
| 性能 | 键数量小时很灵活；频繁增删 + 字符串键稍慢 | 频繁增删场景更快 |
| 原型链污染 | `obj.__proto__` 等存在风险（可用 `Object.create(null)` 规避） | 完全安全 |

**经典场景**：

- 「用对象作为 key」的映射关系（比如缓存每个 DOM 节点的元数据）：
  ```js
  const cache = new Map();
  cache.set(domNode, { lastClickAt: Date.now() });
  ```
- 需要按插入顺序遍历的字典。
- 键可能不是字符串的场景。

---
