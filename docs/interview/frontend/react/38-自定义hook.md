---
title: "自定义 Hook"
---

# 自定义 Hook

**Q1: 什么是自定义 Hook？**

自定义 Hook 是一个以 `use` 开头的函数，内部可以调用其他 Hook。用于**提取和复用组件逻辑**。

```jsx
// 自定义 Hook：获取窗口尺寸
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 使用
function App() {
  const { width, height } = useWindowSize();
  return <div>窗口：{width} x {height}</div>;
}
```

**Q2: 自定义 Hook 和普通函数有什么区别？**

1. **命名约定**：必须以 `use` 开头
2. **可以使用 Hook**：内部可以调用 useState、useEffect 等
3. **React 感知**：React 会检查自定义 Hook 内部的 Hook 调用规则

```jsx
// ❌ 普通函数：不能使用 Hook
function fetchData(url) {
  const [data, setData] = useState(null); // 报错！
  // ...
}

// ✅ 自定义 Hook：可以使用 Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

**Q3: 常用的自定义 Hook 有哪些？**

```jsx
// 1. 防抖
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 2. 节流
function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      setThrottledValue(value);
      lastRun.current = now;
    }
  }, [value, delay]);

  return throttledValue;
}

// 3. 本地存储
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 4. 事件监听
function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => element.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
}

// 5. 媒体查询
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// 6. 前一个值
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 7. 挂载状态（防止卸载后 setState）
function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  return () => isMounted.current; // 返回函数，避免 ref 被外部修改
}

// 8. 异步请求
function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    setState(s => ({ ...s, loading: true }));

    asyncFn()
      .then(data => {
        if (isMounted) setState({ data, loading: false, error: null });
      })
      .catch(error => {
        if (isMounted) setState({ data: null, loading: false, error });
      });

    return () => { isMounted = false; };
  }, deps);

  return state;
}
```

**Q4: 自定义 Hook 相比 HOC 和 Render Props 有什么优势？**

```jsx
// HOC 方式：嵌套地狱
const App = withAuth(withTheme(withRouter(withUser(MyComponent))));

// Render Props 方式：回调嵌套
<App>
  {(user) => (
    <Theme>
      {(theme) => (
        <Router>
          {(router) => <MyComponent user={user} theme={theme} router={router} />}
        </Router>
      )}
    </Theme>
  )}
</App>

// 自定义 Hook：扁平清晰
function MyComponent() {
  const user = useAuth();
  const theme = useTheme();
  const router = useRouter();
  return <div>...</div>;
}
```

优势：
1. **无嵌套地狱**：扁平使用
2. **无组件层级污染**：DevTools 中不会多出包装组件
3. **逻辑与视图分离**：Hook 只管逻辑，组件只管渲染
4. **更易测试**：直接调用 Hook 测试逻辑

**Q5: 多个组件使用同一个自定义 Hook，会共享状态吗？**

不会。每次调用自定义 Hook 都是独立的。

```jsx
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

function ComponentA() {
  const [count, setCount] = useCounter();
  // count 是独立的 0
  return <button onClick={() => setCount(count + 1)}>A: {count}</button>;
}

function ComponentB() {
  const [count, setCount] = useCounter();
  // count 是独立的 0，和 A 互不影响
  return <button onClick={() => setCount(count + 1)}>B: {count}</button>;
}
```

如果需要共享状态，要配合 Context。

---
