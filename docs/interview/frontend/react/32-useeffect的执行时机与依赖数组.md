---
title: "useEffect 的执行时机与依赖数组"
---

# useEffect 的执行时机与依赖数组

**Q1: useEffect 的执行时机是什么？**

`useEffect` 在**每次渲染提交到屏幕后**（commit 阶段之后）异步执行，不会阻塞屏幕更新。

```
组件渲染（render）
  ↓
React 更新 DOM（commit）
  ↓
浏览器绘制屏幕（paint）
  ↓
useEffect 执行（异步，不阻塞）
```

```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect 执行', count);
    // 此时 DOM 已经更新，用户已经看到新内容
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
// 首次渲染后：effect 执行 0
// 点击后渲染：effect 执行 1
```

**Q2: 依赖数组的三种情况？**

```jsx
function App({ userId }) {
  const [data, setData] = useState(null);

  // 1. 不传依赖数组：每次渲染后都执行
  useEffect(() => {
    console.log('每次渲染都执行');
  });

  // 2. 空数组：只在挂载后执行一次
  useEffect(() => {
    console.log('只在挂载后执行');
    // 适合：事件监听、定时器
  }, []);

  // 3. 依赖数组：依赖变化时执行
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setData);
  }, [userId]); // userId 变化时重新请求
}
```

**Q3: useEffect 的清理函数（cleanup）何时执行？**

1. 组件卸载时执行
2. 下一次 effect 执行**之前**执行（如果有依赖变化）

```jsx
function Timer({ delay }) {
  useEffect(() => {
    console.log('设置定时器', delay);
    const id = setInterval(() => console.log('tick'), delay);

    // cleanup 函数
    return () => {
      console.log('清理定时器', delay);
      clearInterval(id);
    };
  }, [delay]);

  return <div>Timer</div>;
}

// 执行顺序（delay 从 1000 变成 2000）：
// 1. 首次挂载：设置定时器 1000
// 2. delay 变化：清理定时器 1000 → 设置定时器 2000
// 3. 组件卸载：清理定时器 2000
```

**Q4: 依赖数组应该写什么？**

**规则：effect 内部用到的所有外部变量（props、state、函数等）都应该写进依赖数组。**

```jsx
function Bad({ userId }) {
  const [data, setData] = useState(null);

  // ❌ 缺少依赖：userId 变化时不会重新请求
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(setData);
  }, []); // eslint 会警告

  // ✅ 完整依赖
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(setData);
  }, [userId]);
}
```

使用 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则可以自动检查。

**Q5: 如何避免不必要的 effect 执行？**

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // ❌ 每次输入都请求，包括用户快速打字
    fetch(`/api/search?q=${query}`).then(setResults);
  }, [query]);

  // ✅ 方案 1：防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${query}`).then(setResults);
    }, 300);
    return () => clearTimeout(timer); // 快速输入时取消上一次
  }, [query]);

  // ✅ 方案 2：条件跳过
  useEffect(() => {
    if (query.length < 2) return; // 太短不搜索
    fetch(`/api/search?q=${query}`).then(setResults);
  }, [query]);
}
```

**Q6: useEffect 中使用 async/await 的正确方式？**

`useEffect` 的回调函数不能直接是 async 函数（因为 async 函数返回 Promise，而 useEffect 期望返回 cleanup 函数或 undefined）。

```jsx
// ❌ 错误：effect 不能返回 Promise
useEffect(async () => {
  const res = await fetch('/api/data');
  const data = await res.json();
  setData(data);
}, []);

// ✅ 正确：在内部定义 async 函数
useEffect(() => {
  let isMounted = true; // 防止组件卸载后 setState

  const fetchData = async () => {
    const res = await fetch('/api/data');
    const data = await res.json();
    if (isMounted) setData(data); // 只在组件还在时更新
  };

  fetchData();

  return () => {
    isMounted = false; // 组件卸载时标记
  };
}, []);

// ✅ 或者用 .then()
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
    .catch(console.error);
}, []);
```

**Q7: useEffect 会导致无限循环吗？**

会，常见陷阱：

```jsx
function Bad() {
  const [data, setData] = useState([]);

  // ❌ 无限循环：每次渲染创建新数组，引用变化触发 effect
  useEffect(() => {
    setData([1, 2, 3]); // 触发重渲染
  }); // 没有依赖数组，每次渲染都执行

  // ❌ 对象作为依赖
  const [user, setUser] = useState({ name: '' });
  useEffect(() => {
    setUser({ name: 'new' }); // 触发重渲染
  }, [user]); // user 引用变化又触发 effect

  // ✅ 正确：用基本类型作为依赖
  const [name, setName] = useState('');
  useEffect(() => {
    if (name) {
      // ...
    }
  }, [name]);
}
```

---
