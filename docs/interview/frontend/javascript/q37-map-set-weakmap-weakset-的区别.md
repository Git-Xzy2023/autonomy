---
title: "`Map` / `Set` / `WeakMap` / `WeakSet` 的区别？"
---

# `Map` / `Set` / `WeakMap` / `WeakSet` 的区别？

**Set = 不重复的元素集合**
**Map = 键值对集合（键可以是任意类型，不仅是字符串）**

```js
// Set：常用于去重、判断元素存在
const s = new Set([1, 2, 2, 3]);
s.add(4).has(2);
[...s]; // [1, 2, 3, 4]

// Map：常用于需要"对象作键"或"保持插入顺序"的场景
const m = new Map();
const key = { id: 1 };
m.set(key, "value");
m.get(key); // 'value'
for (const [k, v] of m) {
  /* ... */
}
```

**Weak 版（弱引用）**：

- 键必须是**对象**
- 对键是"弱引用"——当对象只被 WeakMap/WeakSet 引用时，可以被 GC 回收
- **不可迭代**（没有 `size`、没有 `keys/values/entries`）
- 应用场景：**给第三方对象"挂私有数据"**、**缓存但不阻止 GC**

```js
// 典型场景：保存 DOM 节点的元数据，节点被移除时自动释放
const metadata = new WeakMap();
function process(el) {
  metadata.set(el, { processedAt: Date.now() });
}
// 当 el 被 DOM 移除后，它在 WeakMap 里的条目也会被 GC 回收 —— 不会泄漏
```

| 特性            | Map          | WeakMap                | Set | WeakSet    |
| --------------- | ------------ | ---------------------- | --- | ---------- |
| 键类型          | 任意         | 只能是对象             | ——  | 只能是对象 |
| 可迭代          | ✅           | ❌                     | ✅  | ❌         |
| 有 `size`       | ✅           | ❌                     | ✅  | ❌         |
| GC 影响键的存在 | ❌（强引用） | ✅（弱引用，会自动删） | ❌  | ✅         |

---
