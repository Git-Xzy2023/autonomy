---
title: "React.memo 与浅比较"
---

# React.memo 与浅比较

**Q1: React.memo 的作用是什么？**

`React.memo` 是一个高阶组件，对函数组件进行记忆化。只有当 props 变化时才重渲染。

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
});

// 父组件重渲染时，如果 props.name 没变，MyComponent 不会重渲染
```

**Q2: React.memo 的浅比较是怎么做的？**

默认使用 `Object.is` 逐个比较 props：

```jsx
// React.memo 的浅比较（简化）
function shallowEqual(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  // 1. 键数量不同 → 不相等
  if (prevKeys.length !== nextKeys.length) return false;

  // 2. 逐个比较值
  for (const key of prevKeys) {
    if (!Object.is(prevProps[key], nextProps[key])) {
      return false;
    }
  }

  return true;
}

// Object.is 的行为：
Object.is(1, 1)       // true
Object.is('a', 'a')   // true
Object.is({}, {})     // false（不同引用）
Object.is([], [])     // false（不同引用）
Object.is(NaN, NaN)   // true（比 === 更准确）
```

**Q3: 什么情况下 React.memo 会失效？**

当 props 中包含**每次渲染都创建的新对象/函数**时，浅比较会认为 props 变了。

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染创建新对象 → memo 失效
  const config = { theme: 'dark' };
  const data = [1, 2, 3];

  // ❌ 每次渲染创建新函数 → memo 失效
  const handleClick = () => console.log('click');

  return (
    <MemoizedChild
      config={config}
      data={data}
      onClick={handleClick}
    />
  );
  // 即使 count 变化与 Child 无关，Child 也会重渲染
}

// ✅ 修复
function Parent() {
  const [count, setCount] = useState(0);

  const config = useMemo(() => ({ theme: 'dark' }), []);
  const data = useMemo(() => [1, 2, 3], []);
  const handleClick = useCallback(() => console.log('click'), []);

  return (
    <MemoizedChild
      config={config}
      data={data}
      onClick={handleClick}
    />
  );
}
```

**Q4: 如何自定义 React.memo 的比较函数？**

```jsx
const MyComponent = React.memo(
  ({ user, settings }) => {
    return <div>{user.name} - {settings.theme}</div>;
  },
  (prevProps, nextProps) => {
    // 返回 true：props "相等"，不重渲染
    // 返回 false：props "不等"，重渲染
    return (
      prevProps.user.id === nextProps.user.id &&  // 只比较 id
      prevProps.settings.theme === nextProps.settings.theme
    );
  }
);
```

**Q5: React.memo 和 useMemo 的区别？**

| 特性       | `React.memo`             | `useMemo`                 |
| ---------- | ------------------------ | ------------------------- |
| 作用对象   | 组件                     | 值                        |
| 比较方式   | 浅比较 props             | 浅比较依赖数组            |
| 返回值     | 组件                     | 计算结果                  |
| 使用位置   | 组件定义时               | 组件内部                  |
| 场景       | 避免子组件重渲染         | 避免重复计算              |

```jsx
// React.memo：包裹整个组件
const ExpensiveChild = React.memo(({ data }) => {
  return <div>{data.map(item => <span key={item.id}>{item.name}</span>)}</div>;
});

// useMemo：缓存计算结果
function Parent({ raw }) {
  const processed = useMemo(() => {
    return raw.filter(x => x.active).map(x => x.name);
  }, [raw]);

  return <ExpensiveChild data={processed} />;
}
```

**Q6: 类组件的 shouldComponentUpdate 和 React.memo 有什么关系？**

`React.memo` 相当于函数组件版的 `shouldComponentUpdate`。

```jsx
// 类组件
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }
  render() {
    return <div>{this.props.value}</div>;
  }
}

// 函数组件等价写法
const MyComponent = React.memo(
  ({ value }) => <div>{value}</div>,
  (prev, next) => prev.value === next.value // 返回 true 不更新
);

// React.PureComponent：内置浅比较的 shouldComponentUpdate
class MyComponent extends React.PureComponent {
  // 自动浅比较 props 和 state
  render() {
    return <div>{this.props.value}</div>;
  }
}
```

**Q7: React.memo 有什么缺点？**

1. **比较本身有开销**：每次渲染都要浅比较所有 props。
2. **不是所有组件都适合**：如果 props 几乎每次都变，memo 反而增加开销。
3. **需要配合 useMemo/useCallback**：否则对象/函数 props 每次都是新引用。
4. **不能阻止内部 state 变化导致的重渲染**：只防 props 变化。

```jsx
// memo 无法阻止内部 state 变化
const Counter = React.memo(() => {
  const [count, setCount] = useState(0);
  // count 变化时，Counter 仍然会重渲染
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
});
```

---
