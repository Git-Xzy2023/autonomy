---
title: "常见面试题"
---

# 常见面试题

**Q1: 虚拟 DOM 一定比直接操作真实 DOM 快吗？**

不一定。虚拟 DOM 的开销 = diff 计算 + 最小化的真实 DOM 操作。

- 首次渲染：虚拟 DOM 反而更慢（需要额外创建 VNode 树再 patch）
- 小范围更新：直接操作 `document.getElementById('x').innerText = 'a'` 可能更快
- 复杂场景大量 DOM 更新：虚拟 DOM 通过批量更新和 diff 减少回流重绘，优势明显

结论：虚拟 DOM 最大价值是**跨平台 + 声明式编程 + 优化心智负担**，性能是附带的好处，且在复杂场景下才有优势。

**Q2: Vue2 和 Vue3 diff 最大的区别是什么？**

- Vue2：双端对比，策略较简单，最差情况下有较多 DOM 移动
- Vue3：① 头尾预处理快速收敛 ② 用 LIS 算法找出无需移动的最长序列，DOM 移动次数最少 ③ 编译期优化（PatchFlags、Block Tree、静态提升）大幅减少运行时 diff 工作量

**Q3: key 用 index 会有什么问题？举一个场景。**

场景：一个列表 `[A, B, C]` 渲染 3 个带 input 的组件，用户在 A 的 input 输入"hello"。

- 如果用 index 做 key，然后在头部插入新项 `Z`，新列表为 `[Z, A, B, C]`
- 此时 index 对应的 key 变为：Z→0, A→1, B→2, C→3
- Diff 时发现 key=0 的节点从 A 变成了 Z，key=1 的节点从 B 变成了 A，依此类推
- Vue 会**复用**原来 key=0 的 DOM（即 A 的那个节点），只更新内容为 Z
- 结果：input 里的"hello"仍然出现在 Z 对应位置，发生状态错乱

正确做法：使用业务唯一 id 作为 key。
