---
title: "Vue2 v-for 中 key 的作用与 diff"
---

# Vue2 v-for 中 key 的作用与 diff

## 为什么需要 key

Vue 的 diff 算法是"同层比较、就地复用"。当列表数据变化（增删改顺序）时，Vue 默认按位置复用 DOM：第一个 VNode 复用旧的第一个 DOM，第二个复用第二个……这种"按位置复用"在列表项内容变化时会导致：

1. **性能浪费**：本来可以不动的 DOM 被重新渲染（因为内容变了）。
2. **状态错乱**：表单类元素（input、checkbox）的状态会跟着位置走，而不是跟着数据走。

`key` 让 Vue 能"识别"每个节点的身份，即使位置变了也能找到对应 DOM 复用，避免上述问题。

## 用法

```html
<!-- ❌ 错误：用 index 做 key -->
<li v-for="(item, index) in list" :key="index">{{ item.name }}</li>

<!-- ✅ 正确：用唯一 id 做 key -->
<li v-for="item in list" :key="item.id">{{ item.name }}</li>
```

## 为什么不能用 index 做 key

**场景：** 列表 `[A, B, C]`，在头部插入 `X`，变成 `[X, A, B, C]`。

**用 index 做 key：**

| 位置 | 旧 key | 新 key | diff 结果            |
| ---- | ------ | ------ | -------------------- |
| 0    | 0(A)   | 0(X)   | 复用 DOM，内容 A→X   |
| 1    | 1(B)   | 1(A)   | 复用 DOM，内容 B→A   |
| 2    | 2(C)   | 2(B)   | 复用 DOM，内容 C→B   |
| 3    | -      | 3(C)   | 新建 DOM             |

结果：4 个 DOM 全部要更新内容，且如果 A 是 `<input>` 带用户输入，输入会跑到 X 上（状态错乱）。

**用 id 做 key：**

| 位置 | 旧 key | 新 key | diff 结果                  |
| ---- | ------ | ------ | -------------------------- |
| 0    | A      | X      | A 找不到，新建 X 的 DOM    |
| 1    | B      | A      | A 找到，复用 A 的 DOM，移动 |
| 2    | C      | B      | B 找到，复用 B 的 DOM，移动 |
| 3    | -      | C      | C 找到，复用 C 的 DOM，移动 |

结果：只新建 1 个 DOM（X），其他 3 个原样复用，只是移动位置。状态正确跟随数据。

## 原理（Vue2 双端 diff）

Vue2 的 diff 用**双端对比**算法，借助 key 做节点匹配：

```js
// 源码 src/core/vdom/patch.js
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0, newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1, newEndIdx = newCh.length - 1;
  let oldStartVnode = oldCh[0], oldEndVnode = oldCh[oldEndIdx];
  let newStartVnode = newCh[0], newEndVnode = newCh[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 1. 头头相同：patchVnode，指针后移
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 2. 尾尾相同：patchVnode，指针前移
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 3. 旧头 == 新尾：patchVnode + 移到尾部
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 4. 旧尾 == 新头：patchVnode + 移到头部
    } else {
      // 5. 以上都不匹配：用 key 建索引 map，查找复用
      const idxInOld = oldKeyToIdx[oldStartVnode.key];
      if (idxInOld) {
        // 找到：复用并移动
      } else {
        // 没找到：新建
      }
    }
  }
}

function isSameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag; // key 是核心判断条件
}
```

**`isSameVnode` 的核心就是 `a.key === b.key`**。没有 key 时，所有节点的 key 都是 `undefined`，退化成"按位置比较"，失去复用能力。

## key 的其他用途

1. **强制重新渲染**：`<Comp :key="id" />`，改变 key 会销毁旧组件、创建新组件，常用于"重置组件状态"。
2. **`<transition-group>` 动画**：FLIP 动画依赖 key 识别元素移动。

## Vue3 的变化

Vue3 的 diff 算法改为**最长递增子序列（LIS）**优化，但 key 的作用和 Vue2 一致：仍然是节点身份标识，是 diff 能正确复用的前提。Vue3 的改进只是"移动决策更优"，key 的语义不变。
