---
title: "Concurrent Mode 并发模式"
---

# Concurrent Mode 并发模式

**Q1: 什么是 Concurrent Mode（并发模式）？**

并发模式是 React 18 引入的**并发渲染**能力。它允许 React 在渲染过程中**中断、暂停、放弃或重试**，从而保持 UI 的响应性。

```
旧模式（同步渲染）：
  ┌──────────────────────────┐
  │  渲染 100ms（不可中断）   │  ← 主线程被占用，用户交互无响应
  └──────────────────────────┘

并发模式：
  ┌────┐ ┌──┐ ┌────┐ ┌──┐ ┌────┐
  │渲染 │ │交互│ │渲染 │ │绘制│ │渲染 │  ← 可被高优先级任务打断
  └────┘ └──┘ └────┘ └──┘ └────┘
```

**Q2: 并发模式和并发特性有什么区别？**

React 18 中没有显式的"Concurrent Mode"开关，而是通过使用并发特性（如 `startTransition`、`useDeferredValue`）来启用并发渲染。

```jsx
// React 18 之前（计划中的 ConcurrentMode）
// <React.StrictMode>
//   <Root />
// </React.StrictMode>

// React 18：直接使用 createRoot，并发特性按需启用
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
// 并发特性（startTransition 等）可以直接使用
```

**Q3: 并发模式的核心能力是什么？**

1. **可中断渲染**：渲染过程可以被更高优先级的更新打断。

2. **优先级调度**：不同更新有不同优先级，高优先级先处理。

```jsx
// 用户输入（高优先级）vs 搜索结果（低优先级）
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    // 高优先级：立即更新输入框
    setQuery(e.target.value);

    // 低优先级：搜索结果可以稍后更新
    startTransition(() => {
      setResults(heavyFilter(e.target.value));
    });
  };

  // 用户输入流畅，搜索结果异步更新
  return (
    <>
      <input value={query} onChange={handleChange} />
      <List items={results} />
    </>
  );
}
```

3. **批量更新**：多个状态更新合并为一次渲染。

4. **Suspense 支持**：组件可以"等待"异步数据。

**Q4: 并发模式对现有代码有什么影响？**

React 18 的并发特性是**可选的**，不使用并发特性时，行为与之前一致。但需要注意：

1. **Strict Mode 更严格**：开发模式下会双重调用某些函数。

```jsx
// Strict Mode 下，这些函数会被调用两次：
// - 组件函数（render）
// - useState/useReducer 的初始化函数
// - useMemo/useCallback 的函数
// 目的：检测副作用
```

2. **副作用需要是幂等的**：因为渲染可能被中断和重试。

```jsx
// ❌ 不安全：渲染期间有副作用
function Bad() {
  // 渲染期间修改全局变量
  window.count = (window.count || 0) + 1;
  return <div>{window.count}</div>;
}

// ✅ 安全：副作用放在 useEffect 中
function Good() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // 只在提交后执行一次
  }, []);
  return <div>{count}</div>;
}
```

**Q5: 并发模式解决了什么问题？**

| 问题 | 旧模式 | 并发模式 |
| --- | --- | --- |
| 大列表渲染卡顿 | 渲染期间无法响应 | 可中断，保持响应 |
| 搜索框输入卡顿 | 搜索计算阻塞输入 | 低优先级更新不阻塞输入 |
| 数据加载白屏 | 等待数据才渲染 | Suspense 显示骨架屏 |
| 多个状态更新 | 可能多次渲染 | 自动批处理 |

**Q6: 如何迁移到 React 18？**

```jsx
// 1. 安装 React 18
// npm install react@18 react-dom@18

// 2. 更新入口文件
// 旧：
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// 新：
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// 3. TypeScript 类型更新
// window.React = React; // 如果需要

// 4. 检查 Strict Mode 下的副作用问题
```

---
