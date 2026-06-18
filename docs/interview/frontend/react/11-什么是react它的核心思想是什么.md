---
title: "什么是 React？它的核心思想是什么？"
---

# 什么是 React？它的核心思想是什么？

**Q1: 什么是 React？它的核心思想是什么？**

React 是由 Facebook（现 Meta）开发并开源的用于构建用户界面的 **JavaScript 库**。注意：React 是"库"而不是"框架"，它只关注视图层。

**核心思想：**

1. **声明式编程**：你只需要描述 UI 在任何给定时刻应该长什么样，React 负责在数据变化时高效地更新和渲染组件，而不需要手动操作 DOM。

2. **组件化**：将复杂的 UI 拆分成独立、可复用的组件。组件接收输入（props）并返回描述屏幕内容的 React 元素。

3. **单向数据流**：数据从父组件流向子组件（通过 props），状态变更只能通过特定的方式（如 setState）触发，使得数据流向可预测。

4. **虚拟 DOM**：React 在内存中维护一个虚拟 DOM 树，通过 Diff 算法对比新旧虚拟 DOM，最小化对真实 DOM 的操作。

**声明式 vs 命令式对比：**

```jsx
// 命令式：手动操作 DOM
const button = document.getElementById('btn');
button.addEventListener('click', () => {
  const counter = document.getElementById('counter');
  counter.textContent = Number(counter.textContent) + 1;
});

// 声明式：描述 UI 应该是什么样
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <span id="counter">{count}</span>
      <button id="btn" onClick={() => setCount(count + 1)}>+1</button>
    </>
  );
}
```

**Q2: React 是 MVC 中的哪一层？**

React 严格来说是 MVC 中的 **View 层**。它不包含 Model（数据层）和 Controller（业务逻辑层）的完整实现。

但实际项目中，React 配合状态管理工具（如 Redux、Zustand）和路由库（如 React Router），可以构建出完整的"框架级"应用。这也是为什么有人把 React 生态称为"React 框架"，但 React 本身只是视图库。

**Q3: 声明式编程相比命令式编程有什么优势？**

| 特性       | 命令式编程                   | 声明式编程                       |
| ---------- | ---------------------------- | -------------------------------- |
| 关注点     | "怎么做"（步骤）             | "做什么"（结果）                 |
| DOM 操作   | 手动查询、修改、删除节点     | 描述状态对应的 UI，React 自动更新 |
| 可读性     | 逻辑与 DOM 操作混杂          | UI 与状态一一对应，直观          |
| 可维护性   | 状态分散，难以追踪           | 单一数据源，状态驱动 UI          |
| 测试难度   | 需要 mock DOM 环境           | 组件纯函数，易于测试             |

---
