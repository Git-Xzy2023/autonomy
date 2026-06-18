---
title: "useMemo 与 useCallback 的区别"
---

# useMemo 与 useCallback 的区别

**Q1: useMemo 和 useCallback 有什么区别？**

```jsx
// useMemo：缓存计算结果（值）
const memoizedValue = useMemo(() => expensiveCalc(a, b), [a, b]);

// useCallback：缓存函数引用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useCallback 等价于：
const memoizedCallback = useMemo(() => () => doSomething(a, b), [a, b]);
```

| 特性       | `useMemo`              | `useCallback`          |
| ---------- | ---------------------- | ---------------------- |
| 缓存内容   | 计算结果（任意值）     | 函数引用               |
| 参数       | 工厂函数 + 依赖数组    | 回调函数 + 依赖数组    |
| 返回值     | 工厂函数的返回值       | 传入的函数本身         |
| 主要用途   | 避免重复计算           | 保持函数引用稳定       |

**Q2: 什么时候用 useMemo？**

1. **计算开销大**时，避免每次渲染都重复计算。

```jsx
function ProductList({ products, filterText }) {
  // ❌ 每次渲染都重新过滤和排序
  const filtered = products
    .filter(p => p.name.includes(filterText))
    .sort((a, b) => a.price - b.price);

  // ✅ 只在 products 或 filterText 变化时计算
  const filtered = useMemo(
    () => products
      .filter(p => p.name.includes(filterText))
      .sort((a, b) => a.price - b.price),
    [products, filterText]
  );

  return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

2. **保持引用稳定**，避免子组件不必要的重渲染。

```jsx
function Parent({ data }) {
  // ❌ 每次渲染创建新对象，子组件即使 memo 也会重渲染
  const config = { theme: 'dark', size: 'large' };

  // ✅ 引用稳定
  const config = useMemo(() => ({ theme: 'dark', size: 'large' }), []);

  return <Child config={config} />;
}

const Child = React.memo(({ config }) => {
  return <div>{config.theme}</div>;
});
```

**Q3: 什么时候用 useCallback？**

当把函数作为 props 传给子组件时，保持函数引用稳定，配合 `React.memo` 避免子组件不必要的重渲染。

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ 每次渲染创建新函数，子组件每次都重渲染
  const handleClick = () => {
    setCount(c => c + 1);
  };

  // ✅ 函数引用稳定，count 变化时子组件不重渲染
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <span>{count}</span>
      <MemoizedChild onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('子组件渲染');
  return <button onClick={onClick}>Click</button>;
});
```

**Q4: useMemo/useCallback 滥用会有什么问题？**

1. **增加内存开销**：缓存本身需要存储。
2. **依赖检查开销**：每次渲染都要比较依赖数组。
3. **代码复杂度增加**。

```jsx
// ❌ 过度优化：简单计算不需要 useMemo
const sum = useMemo(() => a + b, [a, b]);
// 直接写 const sum = a + b; 更好

// ❌ 过度优化：没有传给子组件的函数不需要 useCallback
const handleClick = useCallback(() => {
  console.log('click');
}, []);
// 直接写 const handleClick = () => console.log('click'); 更好
```

**经验法则**：
- 只有计算明显耗时（如处理大数组、复杂运算）才用 `useMemo`
- 只有函数作为 props 传给被 `React.memo` 包裹的子组件时才用 `useCallback`

**Q5: useMemo 能用来缓存组件吗？**

可以，但不推荐。应该用 `React.memo`。

```jsx
function App({ tab }) {
  // ❌ 不推荐
  const content = useMemo(() => {
    if (tab === 'home') return <Home />;
    if (tab === 'about') return <About />;
  }, [tab]);

  // ✅ 推荐
  const content = tab === 'home' ? <Home /> : <About />;

  return <div>{content}</div>;
}
```

---
