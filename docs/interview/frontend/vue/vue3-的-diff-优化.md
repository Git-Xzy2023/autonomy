---
title: "Vue3 的 Diff 优化"
---

# Vue3 的 Diff 优化

Vue3 在 Vue2 双端 diff 的基础上做了以下改进：

1. **预处理**：先从头尾两端同步比较**静态/相同**的节点，快速跳过无需处理的部分，缩小 diff 范围
2. **最长递增子序列（LIS）**：在需要移动节点时，先计算出最长递增子序列，子序列中的节点不需要移动，只移动其余节点，比 Vue2 减少了 DOM 移动次数
3. **静态提升（hoistStatic）**：编译时将不变的静态 VNode 提升到 render 函数外部，每次更新直接复用，避免重复创建
4. **PatchFlags 动态标记**：编译时给动态节点打上标记（如 `1: TEXT`、`2: CLASS`），diff 时只比较标记过的动态部分，跳过静态属性
5. **Block Tree**：将动态节点用 Block 组织，diff 时只遍历 Block 内部的动态节点，跳过大量静态层级

**LIS 核心思路（packages/runtime-core/src/renderers.ts）：**

```js
// 得到 newIndexToOldIndexMap（新序列每个位置对应旧序列的索引+1，0 表示新增）
// 例如：[2, 3, 1, 4] → LIS 是 [0, 1, 3]（即 indices 0,1,3 位置无需移动）
function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    ...
  }
  // 回溯得到完整 LIS
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
```
