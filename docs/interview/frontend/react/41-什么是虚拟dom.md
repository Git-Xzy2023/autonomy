---
title: "什么是虚拟 DOM"
---

# 什么是虚拟 DOM

**Q1: 什么是虚拟 DOM？**

虚拟 DOM（Virtual DOM）是 React 在内存中维护的**轻量级 JavaScript 对象树**，是真实 DOM 的抽象描述。React 通过对比新旧虚拟 DOM 来最小化对真实 DOM 的操作。

```jsx
// 这段 JSX
<div className="container">
  <h1>Hello</h1>
  <p>World</p>
</div>

// 会被转换为虚拟 DOM 对象
{
  type: 'div',
  props: {
    className: 'container',
    children: [
      { type: 'h1', props: { children: 'Hello' } },
      { type: 'p', props: { children: 'World' } },
    ],
  },
}
```

**Q2: 为什么需要虚拟 DOM？**

直接操作真实 DOM 代价很高：
1. **DOM 操作昂贵**：触发重排（reflow）和重绘（repaint）
2. **频繁操作导致性能问题**：每次修改都触发浏览器渲染流程

虚拟 DOM 的价值：
1. **批量更新**：先在内存中计算所有变更，最后一次性更新真实 DOM
2. **跨平台**：虚拟 DOM 是 JS 对象，可以渲染到不同平台（浏览器、移动端、SSR）
3. **声明式编程**：开发者描述 UI 应该是什么样，React 负责高效更新

```
数据变化
  ↓
生成新的虚拟 DOM 树
  ↓
Diff 算法对比新旧虚拟 DOM
  ↓
计算出最小变更集（patch）
  ↓
一次性更新真实 DOM
```

**Q3: 虚拟 DOM 一定比直接操作 DOM 快吗？**

**不一定。** 虚拟 DOM 的优势在于"足够快"的同时提供"声明式编程"的体验。

| 场景                   | 虚拟 DOM | 直接操作 DOM |
| ---------------------- | -------- | ------------ |
| 简单的、已知的 DOM 更新 | 较慢（有 diff 开销） | 更快         |
| 复杂的、大规模 UI 更新  | 较快（批量更新）     | 需手动优化   |
| 开发效率               | 高（声明式）         | 低（命令式） |
| 可维护性               | 高                   | 低           |

```jsx
// 直接操作 DOM：理论上最快，但难以维护
document.getElementById('count').textContent = newCount;

// 虚拟 DOM：有 diff 开销，但代码更清晰
function Counter() {
  const [count, setCount] = useState(0);
  return <div onClick={() => setCount(count + 1)}>{count}</div>;
}
```

**Q4: 虚拟 DOM 和真实 DOM 有什么区别？**

| 特性       | 虚拟 DOM              | 真实 DOM                  |
| ---------- | --------------------- | ------------------------- |
| 本质       | JavaScript 对象       | 浏览器原生对象            |
| 性能       | 操作快（内存操作）    | 操作慢（触发渲染）        |
| 属性数量   | 少（只有 type、props）| 多（几百个属性）          |
| 跨平台     | ✅                    | ❌（仅浏览器）            |
| 直接操作   | 通过 React API        | 通过原生 API              |

```jsx
// 真实 DOM 节点有大量属性
const div = document.createElement('div');
// div 有 200+ 属性：align, title, lang, dir, ...
// 还有原型链上的方法

// 虚拟 DOM 节点很轻量
const vdom = {
  type: 'div',
  props: { className: 'box', children: 'Hello' },
  key: null,
  ref: null,
};
```

**Q5: 虚拟 DOM 的更新过程是怎样的？**

```
1. state/props 变化
   ↓
2. render() 返回新的虚拟 DOM 树
   ↓
3. Diff 算法对比新旧虚拟 DOM 树
   ↓
4. 生成变更列表（patches）
   ↓
5. 将 patches 应用到真实 DOM（commit 阶段）
   ↓
6. 浏览器绘制
```

```jsx
// 旧虚拟 DOM
<div>
  <span>A</span>
  <span>B</span>
</div>

// 新虚拟 DOM（删除 B，新增 C）
<div>
  <span>A</span>
  <span>C</span>
</div>

// Diff 结果：
// - 保留 div
// - 保留 span(A)
// - 更新 span(B) → span(C)（或删除 B 新增 C，取决于 key）
```

---
