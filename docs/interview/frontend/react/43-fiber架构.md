---
title: "Fiber 架构"
---

# Fiber 架构

**Q1: 什么是 Fiber？为什么需要它？**

Fiber 是 React 16 引入的**新的协调引擎**（Reconciler），替代了之前的 Stack Reconciler。

**旧架构的问题：**
- 同步递归更新，一旦开始不能中断
- 大型组件树更新时可能阻塞主线程数秒
- 导致动画卡顿、交互无响应

**Fiber 的目标：**
- **可中断**：更新过程可以暂停
- **可恢复**：暂停后能从断点继续
- **可优先级调度**：高优先级任务能插队

```
旧架构（同步）：
  ┌─────────────────────────────┐
  │     递归 Diff + 渲染（同步）  │  ← 主线程被占用，无法响应交互
  └─────────────────────────────┘

新架构（可中断）：
  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │工作 │ │交互│ │工作 │ │绘制│ │工作 │  ← 可以被交互打断
  └────┘ └────┘ └────┘ └────┘ └────┘
```

**Q2: Fiber 节点是什么？**

每个组件对应一个 Fiber 节点，构成链表树结构。

```js
// Fiber 节点的简化结构
{
  type: 'div',              // 组件类型
  key: null,                // key
  stateNode: DOM节点,        // 真实 DOM 引用

  // 链表结构（指向其他 Fiber）
  return: Fiber | null,     // 父节点
  child: Fiber | null,      // 第一个子节点
  sibling: Fiber | null,    // 下一个兄弟节点

  // 状态
  memoizedState: any,       // 当前状态
  memoizedProps: any,       // 当前 props
  pendingProps: any,        // 待处理的 props

  // 更新队列
  updateQueue: UpdateQueue, // 待处理的更新

  // 副作用
  flags: Flags,             // 标记需要执行的副作用（插入、删除、更新）
  lanes: Lanes,             // 优先级
}
```

```
// Fiber 树结构示例
        App(Fiber)
         |
       child
         ↓
       div(Fiber) ──sibling──→ Header(Fiber)
         |                       |
       child                   child
         ↓                       ↓
       p(Fiber)               h1(Fiber)
```

**Q3: Fiber 的两阶段渲染是什么？**

```
阶段 1：Render Phase（可中断）
  - 遍历 Fiber 树
  - 计算变更（Diff）
  - 构建 workInProgress 树
  - 纯计算，无副作用
  - 可以被中断和恢复

阶段 2：Commit Phase（不可中断）
  - 将变更应用到真实 DOM
  - 执行生命周期/useEffect
  - 同步执行，不能中断
```

```jsx
// 阶段 1 可以执行的方法（纯函数，可重复执行）：
// - constructor
// - getDerivedStateFromProps
// - shouldComponentUpdate
// - render

// 阶段 2 执行的方法（有副作用，只执行一次）：
// - getSnapshotBeforeUpdate
// - componentDidMount
// - componentDidUpdate
// - componentWillUnmount
```

**Q4: Fiber 如何实现可中断？**

React 使用 **时间切片**（Time Slicing）和 **优先级调度**。

```
// 工作循环（简化）
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查是否需要让出主线程
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (nextUnitOfWork) {
    // 还有工作没做完，请求下一帧继续
    requestIdleCallback(workLoop);
  } else {
    // 工作完成，进入 Commit 阶段
    commitRoot();
  }
}
```

**优先级模型（Lanes）：**

```js
// React 18 的优先级（从高到低）
SyncLane          // 同步（最高优先级，如 onClick）
InputContinuousLane // 连续输入（如 onMouseMove）
DefaultLane       // 默认（如 fetch 完成后的更新）
TransitionLane    // 过渡（startTransition）
IdleLane          // 空闲（最低优先级）
```

**Q5: 双缓冲机制是什么？**

Fiber 使用**两棵树**：current 树和 workInProgress 树。

```
current 树（当前屏幕显示的）
    ↓ state 变化
workInProgress 树（正在构建的新树）
    ↓ 构建完成
commit 到 DOM
    ↓
workInProgress 变成 current
```

```js
// 每次更新时：
// 1. 复制 current 树创建 workInProgress 树
// 2. 在 workInProgress 上进行 Diff 和更新
// 3. 完成后，workInProgress 替换 current

// 好处：
// - 中断后不需要清理，直接丢弃 workInProgress
// - 恢复时从 current 重新构建
// - 用户始终看到 current 树（完整的 UI）
```

**Q6: Fiber 带来了什么新能力？**

1. **Concurrent Mode**：并发渲染，高优先级任务插队
2. **Suspense**：异步组件加载
3. **startTransition**：标记低优先级更新
4. **Streaming SSR**：流式服务端渲染
5. **更好的用户体验**：交互不被阻塞

```jsx
// React 18 示例：优先级调度
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    // 高优先级：立即更新输入框
    setQuery(e.target.value);

    // 低优先级：搜索结果可以慢一点更新
    startTransition(() => {
      setResults(search(e.target.value));
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      <List results={results} />
    </>
  );
}
```

---
