---
title: "Automatic Batching 自动批处理"
---

# Automatic Batching 自动批处理

**Q1: 什么是自动批处理（Automatic Batching）？**

自动批处理是 React 18 的特性：**多个状态更新会自动合并为一次重渲染**，无论它们在哪里被调用。

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    // 三个更新合并为一次重渲染
    setCount(1);
    setFlag(true);
    setCount(2);
    // 只渲染一次，最终 count=2, flag=true
  };

  return <div>{count} {String(flag)}</div>;
}
```

**Q2: React 17 和 React 18 的批处理有什么区别？**

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  // 场景 1：React 事件处理函数
  const handleClick = () => {
    setCount(1);
    setFlag(true);
    // React 17：✅ 批处理（1 次渲染）
    // React 18：✅ 批处理（1 次渲染）
  };

  // 场景 2：异步回调
  const handleAsync = async () => {
    await fetch('/api');
    setCount(1);
    setFlag(true);
    // React 17：❌ 不批处理（2 次渲染）
    // React 18：✅ 批处理（1 次渲染）
  };

  // 场景 3：setTimeout
  const handleTimeout = () => {
    setTimeout(() => {
      setCount(1);
      setFlag(true);
      // React 17：❌ 不批处理（2 次渲染）
      // React 18：✅ 批处理（1 次渲染）
    }, 0);
  };

  // 场景 4：Promise
  const handlePromise = () => {
    Promise.resolve().then(() => {
      setCount(1);
      setFlag(true);
      // React 17：❌ 不批处理（2 次渲染）
      // React 18：✅ 批处理（1 次渲染）
    });
  };

  // 场景 5：原生事件
  const handleNative = () => {
    document.getElementById('btn').addEventListener('click', () => {
      setCount(1);
      setFlag(true);
      // React 17：❌ 不批处理（2 次渲染）
      // React 18：✅ 批处理（1 次渲染）
    });
  };
}
```

**Q3: React 17 为什么在异步中不批处理？**

React 17 只在 React 事件处理函数中批处理，因为批处理是通过一个"是否在 React 事件中"的标记控制的。一旦离开 React 事件上下文（如 setTimeout、Promise.then），标记就被清除，后续的更新不再批处理。

```
React 17 的批处理范围：
  ┌─ React 事件处理 ──────────────┐
  │  setCount()  ← 批处理         │
  │  setFlag()   ← 批处理         │
  └───────────────────────────────┘
  setTimeout(() => {
    setCount()  ← 不批处理（独立渲染）
    setFlag()   ← 不批处理（独立渲染）
  }, 0)
```

React 18 通过新的调度机制，让所有上下文中的更新都默认批处理。

**Q4: 如何退出批处理（立即更新）？**

使用 `flushSync` 强制同步更新。

```jsx
import { flushSync } from 'react-dom';

function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    // flushSync 内的更新会立即提交
    flushSync(() => {
      setCount(1);
    });
    // 此时 DOM 已更新，count = 1

    flushSync(() => {
      setFlag(true);
    });
    // 此时 DOM 已更新，flag = true
    // 总共 2 次渲染

    // 后续的更新恢复批处理
    setCount(2);
    setFlag(false);
    // 1 次渲染
  };
}
```

**使用场景**：需要在更新后立即读取 DOM（如测量元素尺寸、触发动画）。

```jsx
function App() {
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  const handleClick = () => {
    flushSync(() => {
      setHeight(500);
    });
    // DOM 已更新，可以准确测量
    const scrollHeight = ref.current.scrollHeight;
    console.log(scrollHeight); // 500
  };

  return <div ref={ref} style={{ height }}>Content</div>;
}
```

**Q5: 批处理对性能有什么影响？**

```jsx
// 不批处理：3 次渲染
fetch('/api').then(() => {
  setLoading(false);  // 渲染 1
  setData(data);      // 渲染 2
  setError(null);     // 渲染 3
});

// 批处理：1 次渲染（React 18 自动）
fetch('/api').then(() => {
  setLoading(false);
  setData(data);
  setError(null);
  // 只渲染 1 次
});
```

减少渲染次数 = 减少 Diff 计算 = 减少 DOM 操作 = 更好的性能。

**Q6: 批处理有什么注意事项？**

1. **同一个事件中的多次 setState 仍然只渲染一次**，即使值不同。

```jsx
setCount(1);
setCount(2);
setCount(3);
// 最终 count = 3，只渲染一次
```

2. **不同组件的更新也会批处理**。

```jsx
function Parent() {
  const handleClick = () => {
    childRef.current.update(); // 调用子组件的 setState
    setParentCount(1);         // 父组件的 setState
    // 仍然只渲染一次
  };
}
```

3. **flushSync 慎用**：过度使用会降低性能。

---
