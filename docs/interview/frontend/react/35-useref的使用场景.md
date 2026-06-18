---
title: "useRef 的使用场景"
---

# useRef 的使用场景

**Q1: useRef 的常见使用场景有哪些？**

1. **访问 DOM 元素**
2. **保存可变值**（不触发重渲染）
3. **保存定时器 ID**
4. **保存上一次的值**
5. **跨渲染周期保存数据**

```jsx
// 1. 访问 DOM
function FocusInput() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}

// 2. 保存可变值（不触发重渲染）
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const runningRef = useRef(false);

  const toggle = () => {
    runningRef.current = !runningRef.current; // 不触发重渲染
    if (runningRef.current) {
      startTimer();
    }
  };
  // ...
}

// 3. 保存定时器 ID
function Timer() {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);
}

// 4. 保存上一次的值
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

**Q2: useRef 和变量声明有什么区别？**

```jsx
function App() {
  // ❌ 普通变量：每次渲染都重新创建，值丢失
  let timerId = null;
  // 第一次渲染：timerId = null
  // 第二次渲染：timerId = null（上次的值丢了）

  // ✅ useRef：跨渲染保持同一个引用
  const timerRef = useRef(null);
  // 第一次渲染：timerRef.current = null
  // 第二次渲染：timerRef.current 保持上次的值
}
```

**Q3: useRef 能用来解决闭包陷阱吗？**

能。`useRef` 的 `.current` 始终指向最新值，可以绕过闭包捕获旧值的问题。

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 保持 ref 和 state 同步
  useEffect(() => {
    countRef.current = count;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // ❌ 闭包陷阱：count 永远是 0
      // setCount(count + 1);

      // ✅ 方案 1：函数式更新
      setCount(c => c + 1);

      // ✅ 方案 2：用 ref 读取最新值
      setCount(countRef.current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>{count}</div>;
}
```

**Q4: useRef 的初始值有什么讲究？**

```jsx
// DOM 元素：初始值设为 null
const inputRef = useRef(null);
// 挂载前：null
// 挂载后：DOM 节点

// 可变值：根据用途设置
const timerRef = useRef(null); // 定时器 ID
const countRef = useRef(0);    // 计数器
const dataRef = useRef([]);    // 缓存数组

// ⚠️ 不要用 useRef 存储需要驱动 UI 的数据
const ref = useRef(0);
// ref.current = 100; // 不会触发重渲染，UI 不会更新
// 这种数据应该用 useState
```

**Q5: 如何在自定义 Hook 中使用 useRef 共享数据？**

```jsx
// 自定义 Hook：防抖
function useDebounce(callback, delay) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);

  // 保持最新的 callback
  useEffect(() => {
    callbackRef.current = callback;
  });

  const debouncedFn = useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  // 清理
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debouncedFn;
}

// 使用
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value) => {
    fetch(`/api/search?q=${value}`);
  }, 500);

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

---
