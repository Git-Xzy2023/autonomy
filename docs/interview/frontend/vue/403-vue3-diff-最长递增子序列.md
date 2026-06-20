---
title: "Vue3 Diff 算法：最长递增子序列"
---

# Vue3 Diff 算法：最长递增子序列

## Vue3 为什么换 diff 算法

Vue2 的双端 diff 用 4 个指针交叉比较，对常见操作（头尾增删）高效，但**移动决策不是最优**。比如 `[A,B,C,D]` → `[D,A,B,C]`，双端 diff 会移动 D 一次（看似好），但反过来 `[D,A,B,C]` → `[A,B,C,D]` 会移动 A、B、C 三次。

Vue3 用**最长递增子序列（LIS）**算法，保证移动次数最少：找出"新旧都有的节点中，在新列表里位置递增的最长子序列"，这些节点**不需要移动**，只需移动不在子序列里的节点。

## 算法步骤

```
1. 从头同步相同前缀
2. 从尾同步相同后缀
3. 处理中间部分：
   a. 旧节点多：删除多余
   b. 新节点多：新增
   c. 都有：用 key 建映射，计算 LIS，移动不在 LIS 的节点
```

## 源码解析

```js
// packages/runtime-core/src/renderer.ts
function patchKeyedChildren(c1, c2, container, parentAnchor) {
  let i = 0;
  const l2 = c2.length;
  let e1 = c1.length - 1;
  let e2 = l2 - 1;

  // 1. 从头同步相同前缀
  while (i <= e1 && i <= e2) {
    if (isSameVNodeType(c1[i], c2[i])) {
      patch(c1[i], c2[i], container);
    } else {
      break;
    }
    i++;
  }

  // 2. 从尾同步相同后缀
  while (i <= e1 && i <= e2) {
    if (isSameVNodeType(c1[e1], c2[e2])) {
      patch(c1[e1], c2[e2], container);
    } else {
      break;
    }
    e1--;
    e2--;
  }

  // 3. 处理中间部分
  if (i > e1) {
    // 3a. 旧节点处理完，新节点还有：新增
    if (i <= e2) {
      const nextPos = e2 + 1;
      const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
      while (i <= e2) {
        patch(null, c2[i], container, anchor);
        i++;
      }
    }
  } else if (i > e2) {
    // 3b. 新节点处理完，旧节点还有：删除
    while (i <= e1) {
      unmount(c1[i]);
      i++;
    }
  } else {
    // 3c. 都有中间节点：核心 diff
    const s1 = i; // 旧中间起始
    const s2 = i; // 新中间起始
    const toBePatched = e2 - s2 + 1; // 新中间节点数
    let patched = 0;

    // 新节点 key → 索引映射
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0);

    // 新节点 key → 索引（用于查找）
    const keyToNewIndexMap = new Map();
    for (i = s2; i <= e2; i++) {
      keyToNewIndexMap.set(c2[i].key, i);
    }

    // 遍历旧中间节点：找到在新列表的位置，未找到则删除
    let moved = false;
    let maxNewIndexSoFar = 0;
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      if (patched >= toBePatched) {
        unmount(prevChild); // 新列表没有，删除
        continue;
      }
      let newIndex = keyToNewIndexMap.get(prevChild.key);
      if (newIndex == null) {
        unmount(prevChild); // 新列表没有，删除
      } else {
        newIndexToOldIndexMap[newIndex - s2] = i + 1; // 记录旧位置（+1 避免 0）
        if (newIndex < maxNewIndexSoFar) {
          moved = true; // 出现逆序，需要移动
        } else {
          maxNewIndexSoFar = newIndex;
        }
        patch(prevChild, c2[newIndex], container); // patch 内容
        patched++;
      }
    }

    // 计算最长递增子序列（只有需要移动时才计算）
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : [];

    let j = increasingNewIndexSequence.length - 1;

    // 从后往前遍历新中间节点，移动不在 LIS 的节点
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i;
      const nextChild = c2[nextIndex];
      const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;

      if (newIndexToOldIndexMap[i] === 0) {
        // 旧列表没有：新增
        patch(null, nextChild, container, anchor);
      } else if (moved) {
        // 需要移动：判断是否在 LIS
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          move(nextChild, container, anchor); // 不在 LIS：移动
        } else {
          j--; // 在 LIS：不移动
        }
      }
    }
  }
}
```

## 最长递增子序列算法

```js
// packages/shared/src/seq.ts
function getSequence(arr) {
  const p = arr.slice(); // 前驱索引
  const result = [0];    // 结果索引（存的是 arr 的索引）
  let i, j, u, v, c;
  const len = arr.length;

  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI === 0) continue; // 0 表示新节点（无旧位置），跳过

    j = result[result.length - 1];
    if (arr[j] < arrI) {
      // 比结果末尾大：直接追加
      p[i] = j;
      result.push(i);
      continue;
    }

    // 二分查找：找到 result 中第一个 >= arrI 的位置
    u = 0;
    v = result.length;
    while (u < v) {
      c = (u + v) >> 1;
      if (arr[result[c]] < arrI) {
        u = c + 1;
      } else {
        v = c;
      }
    }

    if (u > 0) {
      p[i] = result[u - 1]; // 记录前驱
    }
    result[u] = i; // 替换
  }

  // 回溯前驱，得到正确的 LIS
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }

  return result;
}
```

**算法复杂度：** O(n log n)，用二分查找 + 前驱回溯。

## 示例演示

**场景：** `[A, B, C, D, E]` → `[A, D, B, C, E]`（D 移到 B 前面）

```
1. 从头同步：A 相同，i=1
2. 从尾同步：E 相同，e1=3, e2=3
3. 中间部分：旧 [B, C, D]（s1=1, e1=3），新 [D, B, C]（s2=1, e2=3）

   新节点 key → 索引：{ D: 1, B: 2, C: 3 }

   遍历旧中间：
   - B（旧位置 1）→ 新位置 2，newIndexToOldIndexMap[1] = 2
   - C（旧位置 2）→ 新位置 3，newIndexToOldIndexMap[2] = 3
   - D（旧位置 3）→ 新位置 1，newIndexToOldIndexMap[0] = 4

   newIndexToOldIndexMap = [4, 2, 3]（D=4, B=2, C=3）

   moved = true（D 的新位置 1 < maxNewIndexSoFar 3）

   LIS([4, 2, 3]) = [1, 2]（索引，对应 B、C）
   B 和 C 不需要移动，D 需要移动

4. 从后往前遍历新中间：
   - i=2（C）：在 LIS，不移动
   - i=1（B）：在 LIS，不移动
   - i=0（D）：不在 LIS，移动到 B 前面

结果：只移动 D 一次，B 和 C 不动。
```

## 与 Vue2 双端 diff 的对比

| 维度       | Vue2 双端 diff          | Vue3 LIS diff            |
| ---------- | ----------------------- | ------------------------ |
| 移动决策   | 4 种快捷比较 + key 查找 | LIS，保证移动最少        |
| 时间复杂度 | O(n)                    | O(n log n)（LIS 计算）   |
| 最优性     | 非最优（可能多移动）    | 最优（移动次数最少）     |
| 实现复杂度 | 较简单                  | 较复杂（LIS 算法）       |

**Vue3 的优势：** 移动次数最少，对复杂列表操作更高效。虽然 LIS 计算是 O(n log n)，但实际场景中中间节点不多，且移动 DOM 的代价远大于计算。

## 配合 Block Tree

Vue3 的 diff 还配合 Block Tree：

- 如果父节点是 Block，子节点 diff 用 `dynamicChildren`（只 diff 动态节点）。
- 列表 diff（v-for）仍用完整 diff，因为列表项可能整体变化。

## 总结

- **LIS 算法**：找出"不需要移动"的节点，只移动其余节点，保证移动最少。
- **步骤**：同步前缀 → 同步后缀 → 处理中间（删除/新增/移动）。
- **优势**：移动决策最优，比 Vue2 双端 diff 更高效。
- **复杂度**：O(n log n)，但实际场景中间节点少，性能优于 Vue2。

Vue3 的 diff 是"算法最优"和"工程实践"的平衡，是 Vue3 渲染性能提升的关键之一。
