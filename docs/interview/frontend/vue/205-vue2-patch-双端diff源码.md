---
title: "Vue2 patch 双端 diff 源码"
---

# Vue2 patch 双端 diff 源码

## 为什么用双端 diff

列表更新常见操作：头部插入、尾部追加、头部删除、尾部删除、反转。朴素的"从头到尾遍历"对这些场景都要新建/删除节点。双端 diff 用 4 个指针（旧头、旧尾、新头、新尾）交叉比较，能高效处理这些常见操作。

## 核心源码

```js
// src/core/vdom/patch.js
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // 跳过已处理的
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 1. 旧头 vs 新头
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 2. 旧尾 vs 新尾
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 3. 旧头 vs 新尾：旧头移到尾部
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 4. 旧尾 vs 新头：旧尾移到头部
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 5. 以上都不匹配：用 key 建索引查找
      if (isUndef(oldKeyToIdx)) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      if (isUndef(idxInOld)) {
        // 新节点在旧列表不存在：创建
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
      } else {
        // 找到：复用并移动
        vnodeToMove = oldCh[idxInOld];
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined; // 标记已处理
          nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          // key 相同但 tag 不同：当新节点创建
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }

  // 收尾：处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 旧列表处理完，新列表还有：批量新增
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
  } else if (newStartIdx > newEndIdx) {
    // 新列表处理完，旧列表还有：批量删除
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}

function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory)))
  );
}
```

## 四种快捷比较的意义

| 比较          | 场景                     | 操作         |
| ------------- | ------------------------ | ------------ |
| 旧头 vs 新头  | 头部相同，整体后移       | 不动，指针后移 |
| 旧尾 vs 新尾  | 尾部相同                 | 不动，指针前移 |
| 旧头 vs 新尾  | 反转（旧头变成新尾）     | 旧头移到尾部 |
| 旧尾 vs 新头  | 反转（旧尾变成新头）     | 旧尾移到头部 |

这四种情况覆盖了大部分列表更新场景，避免进入第 5 步的 key 查找。

## patchVnode

当 `sameVnode` 判定为同一节点，进入 `patchVnode` 更新内容：

```js
function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode === vnode) return;

  const elm = vnode.elm = oldVnode.elm;

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    return; // 异步组件占位，跳过
  }

  // 都是静态节点且 key 相同：直接复用
  if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  const i = vnode.data;
  if (isDef(i) && isDef(i = i.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode); // 组件 prepatch 钩子
  }

  const oldCh = oldVnode.children;
  const ch = vnode.children;

  if (isUndef(vnode.text)) {
    // 非文本节点
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); // 都有子节点：递归 diff
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue); // 新增子节点
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1); // 删除旧子节点
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, ''); // 清空文本
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text); // 更新文本
  }
}
```

## 局限性

1. **第 5 步 key 查找是 O(n)**：用 `createKeyToOldIdx` 建 map，查找 O(1)，但移动决策不是最优。
2. **无法跳过静态节点**：即使子节点全是静态的，仍要逐个 diff。
3. **移动次数非最优**：比如 `[A,B,C,D]` → `[D,A,B,C]`，双端 diff 会移动 D 到头部（1 次移动），但如果反过来 `[D,A,B,C]` → `[A,B,C,D]`，会移动 A、B、C 三次。

## Vue3 的改进

Vue3 改用**最长递增子序列（LIS）**算法决定移动哪些节点：

- 找出新旧节点都存在的部分，计算它们在新列表中的最长递增子序列。
- 子序列中的节点**不需要移动**，只需移动不在子序列中的节点。
- 移动次数最少，是最优解。

```js
// Vue3 简化逻辑
const newIndexToOldIndexMap = [/* 新位置 → 旧位置 */];
const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap); // LIS
// 从后往前遍历，不在 LIS 中的节点才移动
for (let i = newChildren.length - 1; i >= 0; i--) {
  if (!isInLIS(i)) {
    move(newChildren[i]);
  }
}
```
