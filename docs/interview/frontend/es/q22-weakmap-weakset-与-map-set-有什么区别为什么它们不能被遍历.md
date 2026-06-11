---
title: "`WeakMap` / `WeakSet` 与 `Map` / `Set` 有什么区别？为什么它们不能被遍历？"
---

# `WeakMap` / `WeakSet` 与 `Map` / `Set` 有什么区别？为什么它们不能被遍历？

核心区别：**键（WeakMap）或值（WeakSet）必须是对象，且对它们保持「弱引用」**。

| 类型 | 内容 | 键/值是否弱引用 | 可否迭代 | 可用方法 |
| --- | --- | --- | --- | --- |
| `Map` | 键值对 | 强引用 | ✅ | `get/set/has/delete/clear/size/keys/values/entries/forEach` |
| `WeakMap` | 键值对，键必须是对象 | **键是弱引用** | ❌ | `get/set/has/delete` |
| `Set` | 唯一值集合 | 强引用 | ✅ | `add/has/delete/clear/size/...` |
| `WeakSet` | 唯一对象集合 | **值是弱引用** | ❌ | `add/has/delete` |

**为什么不能遍历 / 没有 size**：
因为键是弱引用，GC 可能在任意时刻回收掉其中的对象。如果允许「遍历」或「读取 size」，结果会在遍历过程中随 GC 而变化，语义上不可靠，所以规范直接禁止。

**典型应用**：

- **WeakMap：给对象「打标签」而不影响它被 GC**（如 DOM 节点元数据、私有数据、Vue3 的响应式系统里用来存依赖映射）。
  ```js
  const metadata = new WeakMap();
  function tagElement(el, meta) {
    metadata.set(el, meta); // el 被移除 DOM → 自动可 GC，metadata 里也会自动消失
  }
  ```
- **WeakSet：记录「某些对象是否曾经出现过」而不阻止它们被回收**（例如检测循环引用的工具、防止重复绑定事件的白名单）。

---
