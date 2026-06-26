---
title: Vue 虚拟 DOM 与 Diff 算法
---

# Vue 虚拟 DOM 与 Diff 算法

> 本章深入剖析 Vue 2 与 Vue 3 的虚拟 DOM 实现与 diff 算法：从 VNode 结构到 patch 流程，从双端对比到 Block Tree 优化。

---

## 一、为什么需要虚拟 DOM

### 1.1 直接操作 DOM 的问题

```js
// 传统 DOM 操作
document.getElementById('app').innerHTML = `<h1>${title}</h1>`;
```

问题：
- 频繁操作 DOM 触发重排重绘
- 直接操作 DOM 难以优化（无法批量）
- 跨平台能力差

### 1.2 虚拟 DOM 的价值

```
数据变化 → 生成新 VNode → 与旧 VNode diff → 最小化 DOM 操作
```

优势：
- 🚀 **批量更新**：合并多次数据变化为一次 DOM 操作
- 🎯 **最小化操作**：通过 diff 只更新变化的部分
- 🌐 **跨平台**：VNode 是 JS 对象，可渲染到不同平台（Web、SSR、Weex、Native）
- 📝 **声明式**：开发者描述 UI 应该是什么样，框架处理如何更新

---

## 二、VNode 结构

### 2.1 Vue 2 VNode

```js
// src/core/vdom/vnode.js
export default class VNode {
  tag: string | void;          // 标签名
  data: VNodeData | void;      // 属性/事件/class/style
  children: ?Array<VNode>;    // 子节点
  text: string | void;         // 文本
  elm: Node | void;            // 真实 DOM
  ns: string | void;           // 命名空间
  context: Component;          // 所属组件
  key: string | number | void; // key
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void;
  parent: VNode | void;        // 父 VNode
  isAsyncPlaceholder: boolean;
  ...
}
```

### 2.2 Vue 3 VNode

```ts
// packages/runtime-core/src/vnode.ts
export interface VNode<
  HostNode = RendererNode,
  HostElement = RendererElement,
  ExtraProps = { [key: string]: any }
> {
  __v_isVNode: true;            // 类型标志
  [ReactiveFlags.SKIP]: true;
  type: VNodeTypes;             // 标签或组件
  props: (VNodeProps & ExtraProps) | null;
  key: string | number | null;
  ref: VNodeNormalizedRef | null;
  scopeId: string | null;

  children: VNodeNormalizedChildren;
  component: ComponentInternalInstance | null;
  dirs: DirectiveBinding[] | null;
  transition: TransitionHooks<HostElement> | null;

  // DOM 相关
  el: HostNode | null;
  anchor: HostNode | null;
  target: HostElement | null;

  // PatchFlag（Vue 3 新增）
  patchFlag: number;
  dynamicProps: string[] | null;
  dynamicChildren: VNode[] | null;  // Block Tree 关键
}
```

### 2.3 Vue 3 PatchFlag

```ts
export const enum PatchFlags {
  TEXT = 1,           // 动态 textContent
  CLASS = 1 << 1,    // 动态 class
  STYLE = 1 << 2,    // 动态 style
  PROPS = 1 << 3,    // 动态 props
  FULL_PROPS = 1 << 4, // 带 key，需全量 diff
  HYDRATE_EVENTS = 1 << 5,
  STABLE_FRAGMENT = 1 << 6,  // 子节点顺序不变
  KEYED_FRAGMENT = 1 << 7,
  UNKEYED_FRAGMENT = 1 << 8,
  NEED_PATCH = 1 << 9,        // 需要 patch（ref、自定义指令）
  DYNAMIC_SLOTS = 1 << 10,
  HOISTED = -1,                // 静态提升节点
  BAIL = -2                    // 退出 diff 优化模式
}
```

---

## 三、Vue 2 patch 流程

### 3.1 入口

```js
// src/core/vdom/patch.js
function patch(oldVnode, vnode, hydrating, removeOnly) {
  // 新旧相同则跳过
  if (oldVnode === vnode) return;

  // 是否是真实 DOM（首次挂载）
  const isRealElement = isDef(oldVnode.nodeType);
  if (!isRealElement && sameVnode(oldVnode, vnode)) {
    // 同一个 VNode：patchVnode
    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
  } else {
    // 不同：创建新 DOM，移除旧
    if (isRealElement) {
      // SSR hydrating
    }
    const oldEl = oldVnode.elm;
    const parentEl = nodeOps.parentNode(oldEl);
    createElm(vnode, insertedVnodeQueue, parentEl, oldEl);
    removeVnodes([oldVnode], 0, 0);
  }

  return vnode.elm;
}
```

### 3.2 sameVnode 判断

```js
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory &&
    (
      (a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)) ||
      (isTrue(a.asyncFactory.error) && isAsyncPlaceholder(a))
    )
  );
}
```

### 3.3 patchVnode

```js
function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode === vnode) return;

  const elm = (vnode.elm = oldVnode.elm);

  // 异步组件
  if (isDef(oldVnode.asyncFactory)) {
    hydrate(oldVnode, vnode);
    return;
  }

  const oldCh = oldVnode.children;
  const newCh = vnode.children;
  const data = vnode.data;

  // 文本节点
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(newCh)) {
      if (oldCh !== newCh) updateChildren(elm, oldCh, newCh, ...);
    } else if (isDef(newCh)) {
      // 新有子节点，旧无
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
      addVnodes(elm, null, newCh, 0, newCh.length - 1);
    } else if (isDef(oldCh)) {
      // 旧有子节点，新无
      removeVnodes(oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    // 文本不同
    nodeOps.setTextContent(elm, vnode.text);
  }
}
```

### 3.4 updateChildren：双端 diff

```js
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
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 新旧头头相同
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 新旧尾尾相同
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 旧头 = 新尾：旧头移到末尾
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 旧尾 = 新头：旧尾移到开头
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 4 种情况都不匹配，用 key 索引表
      if (isUndef(oldKeyToIdx)) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.key];
      if (isUndef(idxInOld)) {
        // 新节点在旧节点中不存在，创建
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
      } else {
        // 存在，移动
        vnodeToMove = oldCh[idxInOld];
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }

  // 收尾：剩余节点处理
  if (newStartIdx <= newEndIdx) {
    addVnodes(parentElm, newCh, newStartIdx, newEndIdx);
  }
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
}
```

### 3.5 双端 diff 示意

```
旧：[A, B, C, D]
新：[D, A, B, C]

步骤：
1. 头头比：A vs D，不同
2. 尾尾比：D vs C，不同
3. 旧头 = 新尾：A == C，不同
4. 旧尾 = 新头：D == D，✅ 移动 D 到开头
   结果：[D, A, B, C]
```

---

## 四、Vue 3 patch 流程

### 4.1 主入口

```ts
// packages/runtime-core/src/renderer.ts
const patch = (
  n1: VNode | null,
  n2: VNode,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  slotScopeIds = null
) => {
  // 新旧相同则跳过
  if (n1 === n2) return;

  // 类型不同，卸载旧的，挂载新的
  if (n1 && !isSameVNodeType(n1, n2)) {
    unmount(n1, parentComponent, parentSuspense, true);
    n1 = null;
  }

  const { type, ref, shapeFlag } = n2;

  switch (type) {
    case Text:
      processText(n1, n2, container, anchor);
      break;
    case Comment:
      processCommentNode(n1, n2, container, anchor);
      break;
    case Fragment:
      processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, slotScopeIds);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds);
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, slotScopeIds);
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
        (type as typeof Teleport).process(n1, n2, container, anchor, parentComponent, parentSuspense, slotScopeIds, internals);
      } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
        // ...
      }
  }

  if (ref) setRef(ref, n2, parentComponent, n2);
};
```

### 4.2 isSameVNodeType

```ts
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  // 类型相同 && key 相同
  return n2.type === n1.type && n2.key === n1.key;
}
```

### 4.3 patchElement

```ts
const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
  let el = (n2.el = n1.el!);
  let { patchFlag, dynamicChildren, dirs } = n2;

  let oldProps = n1.props || EMPTY_OBJ;
  let newProps = n2.props || EMPTY_OBJ;

  // 子节点处理
  if (dynamicChildren) {
    // ★ Block 优化：只 diff 动态子节点
    patchBlockChildren(
      n1.dynamicChildren!,
      dynamicChildren,
      el,
      parentComponent,
      parentSuspense
    );
  } else if (!optimized) {
    // 全量 diff 子节点
    patchChildren(n1, n2, el, null, parentComponent, parentSuspense, isSVG, slotScopeIds);
  }

  // props 更新（基于 PatchFlag 优化）
  if (patchFlag > 0) {
    if (patchFlag & PatchFlags.FULL_PROPS) {
      // 全量 props diff
      patchProps(el, oldProps, newProps, parentComponent);
    } else {
      // class
      if (patchFlag & PatchFlags.CLASS) {
        if (oldProps.class !== newProps.class) {
          hostPatchProp(el, 'class', null, newProps.class, isSVG);
        }
      }
      // style
      if (patchFlag & PatchFlags.STYLE) {
        hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
      }
      // props
      if (patchFlag & PatchFlags.PROPS) {
        const propsToUpdate = n2.dynamicProps!;
        for (let i = 0; i < propsToUpdate.length; i++) {
          const key = propsToUpdate[i];
          const prev = oldProps[key];
          const next = newProps[key];
          if (prev !== next) {
            hostPatchProp(el, key, prev, next, isSVG);
          }
        }
      }
    }
    // text
    if (patchFlag & PatchFlags.TEXT) {
      if (n1.children !== n2.children) {
        hostSetElementText(el, n2.children as string);
      }
    }
  } else if (!optimized && dynamicChildren == null) {
    // 全量 props
    patchProps(el, oldProps, newProps, parentComponent);
  }
};
```

### 4.4 patchKeyedChildren：最长递增子序列

Vue 3 用**最长递增子序列（LIS）**算法替代 Vue 2 的双端 diff，减少不必要的 DOM 移动：

```ts
const patchKeyedChildren = (
  c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds
) => {
  let i = 0;
  const l2 = c2.length;
  let e1 = c1.length - 1;
  let e2 = l2 - 1;

  // 1. 从头部开始同步
  while (i <= e1 && i <= e2) {
    if (isSameVNodeType(c1[i], c2[i])) {
      patch(c1[i], c2[i], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds);
    } else break;
    i++;
  }

  // 2. 从尾部开始同步
  while (i <= e1 && i <= e2) {
    if (isSameVNodeType(c1[e1], c2[e2])) {
      patch(c1[e1], c2[e2], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds);
    } else break;
    e1--;
    e2--;
  }

  // 3. 新节点比旧多：挂载
  if (i > e1) {
    if (i <= e2) {
      const nextPos = e2 + 1;
      const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
      while (i <= e2) {
        patch(null, c2[i], container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds);
        i++;
      }
    }
  }
  // 4. 旧节点比新多：卸载
  else if (i > e2) {
    while (i <= e1) {
      unmount(c1[i], parentComponent, parentSuspense, true);
      i++;
    }
  }
  // 5. 未知序列：LIS 算法
  else {
    const s1 = i;
    const s2 = i;

    // 5.1 为新节点建立 key → index 映射
    const keyToNewIndexMap = new Map();
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i);
      }
    }

    // 5.2 遍历旧节点，patch 或卸载
    let j;
    let patched = 0;
    const toBePatched = e2 - s2 + 1;
    let moved = false;
    let maxNewIndexSoFar = 0;

    // newIndex → oldIndex 的映射（用于 LIS）
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0);

    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      if (patched >= toBePatched) {
        unmount(prevChild, parentComponent, parentSuspense, true);
        continue;
      }
      let newIndex;
      if (prevChild.key != null) {
        newIndex = keyToNewIndexMap.get(prevChild.key);
      } else {
        for (j = s2; j <= e2; j++) {
          if (isSameVNodeType(prevChild, c2[j])) {
            newIndex = j;
            break;
          }
        }
      }
      if (newIndex === undefined) {
        unmount(prevChild, parentComponent, parentSuspense, true);
      } else {
        newIndexToOldIndexMap[newIndex - s2] = i + 1;
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          moved = true;
        }
        patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds);
        patched++;
      }
    }

    // 5.3 移动与挂载
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : EMPTY_ARR;

    j = increasingNewIndexSequence.length - 1;
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i;
      const nextChild = c2[nextIndex];
      const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
      if (newIndexToOldIndexMap[i] === 0) {
        // 新节点，挂载
        patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds);
      } else if (moved) {
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          // 需要移动
          move(nextChild, container, anchor, MoveType.REORDER);
        } else {
          j--;
        }
      }
    }
  }
};
```

### 4.5 最长递增子序列

```ts
// 算法：返回最长递增子序列的索引（非连续）
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let resultLastIndex;
  let left, right, mid;

  for (let i = 1; i < arr.length; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      resultLastIndex = result[result.length - 1];
      if (arr[resultLastIndex] < arrI) {
        // 大于末尾，直接追加
        p[i] = resultLastIndex;
        result.push(i);
        continue;
      }
      // 二分查找插入位置
      left = 0;
      right = result.length - 1;
      while (left < right) {
        mid = (left + right) >> 1;
        if (arr[result[mid]] < arrI) left = mid + 1;
        else right = mid;
      }
      if (arrI < arr[result[left]]) {
        if (left > 0) p[i] = result[left - 1];
        result[left] = i;
      }
    }
  }

  // 回溯构建最终序列
  let length = result.length;
  let tail = result[length - 1];
  while (length-- > 0) {
    result[length] = tail;
    tail = p[tail];
  }
  return result;
}
```

**意义**：LIS 的节点保持原顺序不需要移动，其他节点才需要移动，最小化 DOM 操作。

---

## 五、Block Tree 优化

### 5.1 问题：动态节点稀疏

```vue
<template>
  <div>
    <h1>静态标题</h1>
    <p>{{ msg }}</p>
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>
```

Vue 2：每次更新都遍历整个 VNode 树，包括大量静态节点。

### 5.2 Vue 3 Block 收集

Vue 3 编译时识别动态节点，把它们收集到 `dynamicChildren`：

```js
// 编译输出（简化）
function render() {
  return {
    type: 'div',
    children: [
      { type: 'h1', children: '静态标题' },         // 静态
      { type: 'p', children: ctx.msg, patchFlag: TEXT },  // 动态
      { type: 'ul', children: [...] },               // 动态（v-for）
    ],
    dynamicChildren: [
      { type: 'p', ... },  // 只追踪动态节点
      { type: 'ul', ... },
    ],
  };
}
```

### 5.3 patchBlockChildren

```ts
const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG) => {
  for (let i = 0; i < newChildren.length; i++) {
    const oldVNode = oldChildren[i];
    const newVNode = newChildren[i];
    // 只 diff 动态节点
    patch(
      oldVNode,
      newVNode,
      fallbackContainer,
      null,
      parentComponent,
      parentSuspense,
      isSVG
    );
  }
};
```

### 5.4 v-if/v-for 开启新 Block

```vue
<template>
  <div>
    <p v-if="show">{{ msg }}</p>  <!-- 新 Block -->
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>  <!-- 新 Block -->
    </ul>
  </div>
</template>
```

每个 v-if/v-for 会分裂 Block，外层 Block 引用内层 Block。

---

## 六、编译期优化总结

| 优化项              | 说明                                  |
| ------------------- | ------------------------------------- |
| **静态提升**        | 静态节点提到 render 函数外，复用      |
| **PatchFlag**       | 标记动态类型，diff 时跳过静态部分     |
| **Block Tree**      | 收集动态节点，避免全树 diff           |
| **缓存事件**        | 内联函数只创建一次                    |
| **静态根**          | 整个静态子树提升                      |
| **v-once**          | 编译为缓存，只渲染一次                |
| **v-memo**          | 指定依赖，依赖不变跳过 patch          |

---

## 七、学习建议

1. **理解 VNode 结构**：是 diff 的基础
2. **Vue 2 双端 diff**：能手动模拟 4 种匹配
3. **Vue 3 LIS**：理解为什么用最长递增子序列
4. **Block Tree**：Vue 3 性能提升的关键
5. **编译期优化**：理解 PatchFlag 与静态提升

---

## 参考

- [Vue 2 patch 源码](https://github.com/vuejs/vue/blob/v2.6.14/src/core/vdom/patch.js)
- [Vue 3 renderer 源码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts)
- [Vue 3 编译优化](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#compiler-in-the-tree)
