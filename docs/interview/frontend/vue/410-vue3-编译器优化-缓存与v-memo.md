---
title: "Vue3 编译器优化：缓存与 v-memo"
---

# Vue3 编译器优化：缓存与 v-memo

## 为什么需要 v-memo

Vue3 的 Block Tree + PatchFlag 已经能跳过静态节点、只 diff 动态部分。但有一种场景仍无法优化：**v-for 列表里某个项变化时，其他项虽然 props 没变，但仍要 patch**。

```vue
<div v-for="item in list" :key="item.id">
  <span>{{ item.name }}</span>
  <span>{{ item.age }}</span>
</div>
```

如果 `list[0].name` 变了，Vue3 会 diff 第一个 div（patch 它的子节点），但 list[1] 到 list[n] 虽然没变，仍会被遍历检查（即使跳过 patch）。

`v-memo` 让你显式声明"依赖未变就跳过 patch"，实现**子树级别的 memoization**。

## 用法

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.name, item.age]">
  <span>{{ item.name }}</span>
  <span>{{ item.age }}</span>
  <HeavyComponent :data="item" />
</div>
```

**`v-memo` 的值是依赖数组**：只有 `item.name` 或 `item.age` 变化时，才重新 patch 这个 div 及其子树。否则完全跳过（包括 HeavyComponent 的 patch）。

## 原理

### 编译

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.name, item.age]">
  ...
</div>
```

```js
function render(_ctx, _cache) {
  return (openBlock(true), createElementBlock(Fragment, null,
    renderList(_ctx.list, (item) => {
      return openBlock(), createElementBlock('div', { key: item.id }, [
        // ... 子节点
      ], 1024 /* NEED_PATCH */, [
        // v-memo 的依赖
        item.name, item.age
      ]);
    }), 128 /* KEYED_FRAGMENT */
  ));
}
```

**关键：** `v-memo` 的依赖数组被作为 VNode 的 `memo` 属性传入。

### patch 时的优化

```js
// packages/runtime-core/src/renderer.ts
function patchElement(n1, n2, parentComponent) {
  const el = (n2.el = n1.el);

  // v-memo 检查
  if (n2.memo) {
    if (n2.memo !== n1.memo) {
      // memo 变了：正常 patch
    } else {
      // memo 没变：跳过 patch
      n2.children = n1.children; // 复用子节点
      return;
    }
  }

  // 正常 patch 流程
  // ...
}
```

**实际实现更复杂**，会缓存 memo 数组的比较结果：

```js
function getMemoKey(vnode) {
  return vnode.memo ? hash(vnode.memo) : null;
}

// 在 patchChildren 时，如果 memo 相同，跳过整个子树的 patch
```

## v-memo 的性能影响

### 不用 v-memo

```
list 有 1000 项，修改 list[0].name：
- Block Tree 收集所有动态节点
- patch 时遍历 1000 项，每项检查 PatchFlag
- 即使 999 项没变，仍要遍历检查
```

### 用 v-memo

```
list 有 1000 项，修改 list[0].name：
- patch 时遍历 1000 项
- 每项检查 v-memo 依赖
- list[0] 的 memo 变了：patch
- list[1] 到 list[999] 的 memo 没变：跳过整个子树
- 实际只 patch 1 项
```

**性能提升：** 大型列表（如虚拟滚动）的更新性能提升显著。

## v-memo 的适用场景

### 1. 大型 v-for 列表

```vue
<div v-for="item in hugeList" :key="item.id" v-memo="[item.id, item.updatedAt]">
  <HeavyRow :item="item" />
</div>
```

### 2. 静态内容 + 少量动态

```vue
<div v-memo="[active]">
  <!-- 99% 是静态内容 -->
  <div class="complex-layout">...</div>
  <div :class="{ active }">...</div>
</div>
```

### 3. 条件渲染的优化

```vue
<div v-memo="[mode]">
  <template v-if="mode === 'edit'">
    <EditForm />
  </template>
  <template v-else>
    <DisplayView />
  </template>
</div>
```

## v-memo 的陷阱

### 1. 依赖遗漏

```vue
<div v-memo="[item.name]">
  <span>{{ item.age }}</span> <!-- age 没在 memo 里 -->
</div>
```

`item.age` 变化时，v-memo 不触发 patch，UI 不更新。**必须把所有响应式依赖都列在 memo 里。**

### 2. 事件处理函数

```vue
<div v-memo="[item.name]">
  <button @click="item.count++">{{ item.count }}</button>
</div>
```

`item.count` 没在 memo 里，点击按钮后 UI 不更新。需要：

```vue
<div v-memo="[item.name, item.count]">
  <button @click="item.count++">{{ item.count }}</button>
</div>
```

### 3. 子组件的 props

```vue
<div v-memo="[item.name]">
  <Child :data="item" />
</div>
```

`item` 的其他属性变化时，Child 不会更新（v-memo 跳过了整个子树）。需要：

```vue
<div v-memo="[item.name, item]">
  <Child :data="item" />
</div>
```

## v-memo vs React.memo

| 维度       | Vue v-memo                  | React.memo                  |
| ---------- | --------------------------- | --------------------------- |
| 控制粒度   | 依赖数组（显式）            | 浅比较 props（自动）        |
| 作用范围   | 子树（包括子组件）          | 单个组件                    |
| 使用位置   | 模板指令                    | 组件包装                    |
| 依赖遗漏   | 不更新（bug）               | 自动浅比较（安全）          |
| 性能       | 更高（完全跳过子树）        | 较低（仍要浅比较 props）    |

**Vue v-memo 的优势：** 显式控制，能完全跳过子树（包括子组件的 patch），性能更高。

**Vue v-memo 的劣势：** 依赖遗漏会导致 bug，需要开发者手动维护依赖列表。

## v-once：一次性渲染

与 v-memo 相关的 `v-once`：标记的元素只渲染一次，后续永不更新。

```vue
<div v-once>
  {{ Math.random() }} <!-- 只在首次渲染时计算 -->
</div>
```

**原理：** 编译时把 v-once 的 VNode 标记为静态，提升到 render 外，后续 render 直接复用。

**场景：** 真正静态的内容（如配置项、不变的计算结果）。

## 总结

- **v-memo**：显式声明依赖，依赖未变时跳过整个子树的 patch。
- **原理**：编译时把依赖数组作为 VNode 的 memo 属性，patch 时比较 memo。
- **场景**：大型 v-for 列表、静态内容 + 少量动态、条件渲染优化。
- **陷阱**：依赖遗漏导致不更新，必须列出所有响应式依赖。
- **v-once**：一次性渲染，后续永不更新（真正的静态）。

v-memo 是 Vue3 提供的"手动优化"工具，在自动优化（Block Tree + PatchFlag）不够时使用。适合大型列表和性能敏感场景，但要小心依赖遗漏。
