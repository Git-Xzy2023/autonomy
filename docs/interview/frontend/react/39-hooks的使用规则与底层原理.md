---
title: "Hooks 的使用规则与底层原理"
---

# Hooks 的使用规则与底层原理

**Q1: Hooks 的两条规则是什么？**

1. **只在顶层调用 Hook**：不要在循环、条件、嵌套函数中调用 Hook。
2. **只在 React 函数中调用 Hook**：不要在普通 JS 函数中调用（自定义 Hook 除外）。

```jsx
// ❌ 违反规则 1：在条件中调用
function Bad({ isLogin }) {
  if (isLogin) {
    const [user, setUser] = useState(null); // 条件调用
  }
  const [count, setCount] = useState(0);
  // isLogin 变化会导致 Hook 顺序错乱
}

// ✅ 正确：把条件放在 Hook 内部
function Good({ isLogin }) {
  const [user, setUser] = useState(isLogin ? fetchUser() : null);
  const [count, setCount] = useState(0);
}

// ❌ 违反规则 2：在普通函数中调用
function helper() {
  const [count, setCount] = useState(0); // 报错！
}

// ✅ 自定义 Hook 中可以调用（因为以 use 开头，React 认为它是 Hook）
function useCounter() {
  const [count, setCount] = useState(0); // ✅ 合法
  return [count, setCount];
}
```

**Q2: 为什么 Hooks 有这些规则？（底层原理）**

React 通过**调用顺序**来关联 Hook 和内部状态。每个组件维护一个 Hook 链表，按调用顺序存储。

```
组件首次渲染：
  useState('Alice')  → hooks[0] = 'Alice'
  useState(25)       → hooks[1] = 25
  useEffect(fn)      → hooks[2] = effect

组件第二次渲染：
  useState('Alice')  → 读取 hooks[0]
  useState(25)       → 读取 hooks[1]
  useEffect(fn)      → 读取 hooks[2]

如果第二次渲染时跳过了第一个 useState（条件调用）：
  useState(25)       → 读取 hooks[0]（应该是 'Alice'）→ 拿到了 25！
  useEffect(fn)      → 读取 hooks[1]（应该是 25）→ 错误！
```

**Q3: Hook 链表的结构是怎样的？**

```jsx
// React 内部简化结构
type Hook = {
  memoizedState: any,      // 当前值
  baseState: any,          // 初始值
  baseQueue: Update<any>,  // 待处理的更新队列
  queue: UpdateQueue<any>, // 更新队列
  next: Hook | null,       // 指向下一个 Hook
};

// Fiber 节点中的 hook 链表
fiber.memoizedState = {
  memoizedState: 'Alice',  // useState 的值
  next: {
    memoizedState: 25,     // 第二个 useState 的值
    next: {
      memoizedState: effect, // useEffect 的 effect 对象
      next: null,
    },
  },
};
```

**Q4: useState 和 useReducer 在底层有什么关系？**

`useState` 本质上是 `useReducer` 的语法糖。

```jsx
// React 内部实现（简化）
function useState(initialValue) {
  return useReducer(
    (state, action) => {
      return typeof action === 'function' ? action(state) : action;
    },
    initialValue,
  );
}
```

**Q5: useEffect 的底层是如何工作的？**

```
渲染阶段（Render Phase）：
  1. 组件函数执行
  2. useEffect 被调用，创建 effect 对象
  3. effect 对象挂到 fiber.updateQueue
  4. effect 对象包含：tag（类型）、create（回调函数）、destroy（清理函数）、deps（依赖）

提交阶段（Commit Phase）：
  1. React 更新 DOM
  2. 浏览器绘制
  3. 遍历 fiber.updateQueue 中的 effects
  4. 对比新旧 deps：
     - 首次执行：调用 create
     - deps 变化：先调用上一个 destroy（cleanup），再调用 create
     - deps 未变：跳过
  5. 组件卸载：调用所有 destroy
```

**Q6: 闭包陷阱是什么？如何解决？**

每次渲染，组件函数都会创建新的闭包，捕获当次的 props 和 state。如果在异步回调中使用这些值，可能拿到过期的值。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // 闭包陷阱：count 永远是首次渲染的 0
      console.log(count); // 0, 0, 0, ...
      setCount(count + 1); // 1, 1, 1, ...（不会递增）
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 空依赖，只执行一次

  return <div>{count}</div>;
}

// 解决方案：

// 方案 1：函数式更新（推荐）
setCount(c => c + 1);

// 方案 2：用 useRef 保存最新值
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
});
useEffect(() => {
  const timer = setInterval(() => {
    setCount(countRef.current + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);

// 方案 3：把 count 加入依赖（但会反复创建定时器）
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]);
```

**Q7: 如何检测 Hook 规则违反？**

使用 `eslint-plugin-react-hooks` 插件。

```json
// .eslintrc
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",      // 检查 Hook 规则
    "react-hooks/exhaustive-deps": "warn"       // 检查依赖完整性
  }
}
```

---
