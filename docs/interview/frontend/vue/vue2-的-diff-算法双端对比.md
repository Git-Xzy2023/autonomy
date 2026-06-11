---
title: "Vue2 的 Diff 算法（双端对比）"
---

# Vue2 的 Diff 算法（双端对比）

Vue2 的 diff 是**同层比较**+**双指针**策略，时间复杂度 O(n)。

**四个指针**：`oldStartIdx`、`oldEndIdx`、`newStartIdx`、`newEndIdx`

**比较策略（依次尝试）：**

1. **oldStart vs newStart** → 相同则两个头指针都右移
2. **oldEnd vs newEnd** → 相同则两个尾指针都左移
3. **oldStart vs newEnd** → 相同则 oldStart 节点移到末尾，头指针右移尾指针左移
4. **oldEnd vs newStart** → 相同则 oldEnd 节点移到开头，尾指针左移头指针右移
5. 以上四种都不匹配 → 使用 `newStartVNode.key` 在旧列表中**查找**（建立一个 `key → index` 的 Map）
   - 找到：移动该节点到 newStart 位置
   - 未找到：创建一个新节点

**当 oldStartIdx > oldEndIdx** 说明新列表有剩余，批量插入；当 **newStartIdx > newEndIdx** 说明旧列表有剩余，批量删除。

**为什么需要 key？**

没有 key 时 Vue2 会走"就地复用"策略（in-place patch），直接复用相同位置的节点，只更新内容。这在列表项有状态（如 input 输入框、组件内部状态）时会导致状态错乱。key 让 diff 能精确识别节点身份，减少 DOM 移动/重建。

```
key 必须唯一、稳定，不能用数组 index（排序/插入时 index 会变化，等同于没 key）
```
