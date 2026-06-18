---
title: "Ref 的作用与使用方式"
---

# Ref 的作用与使用方式

**Q1: Ref 是什么？什么时候使用？**

Ref（Reference）是用来**直接访问 DOM 节点或组件实例**的逃生舱。React 是声明式的，通常不需要直接操作 DOM，但以下场景需要 Ref：

1. **管理焦点**、文本选择、媒体播放
2. **集成第三方 DOM 库**（如 D3、Chart.js）
3. **触发命令式动画**
4. **测量元素尺寸/位置**

```jsx
// 场景：自动聚焦输入框
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

**Q2: useRef 有哪些使用方式？**

```jsx
// 1. 访问 DOM 元素
function App() {
  const divRef = useRef(null);
  return <div ref={divRef}>Hello</div>;
  // divRef.current 指向 DOM 节点
}

// 2. 保存可变值（不触发重渲染）
function Timer() {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
}

// 3. 保存上一次的值
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

**Q3: useRef 和 useState 的区别？**

| 特性         | `useState`                      | `useRef`                        |
| ------------ | ------------------------------- | ------------------------------- |
| 修改是否触发重渲染 | ✅ 触发                    | ❌ 不触发                       |
| 用途         | 存储需要驱动 UI 的状态          | 存储不需要驱动 UI 的数据        |
| 值的访问     | 直接访问变量                    | `ref.current`                   |
| 更新方式     | `setState(newValue)`            | `ref.current = newValue`        |
| 闭包问题     | 每次渲染拿到新值                | 始终是最新值（同一引用）        |

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  const handleAdd = () => {
    setCount(count + 1);
    countRef.current++;
    // 两者都 +1，但只有 setCount 会触发重渲染
  };

  // count 是渲染时的快照
  // countRef.current 始终是最新值
}
```

**Q4: forwardRef 是什么？**

`forwardRef` 允许父组件通过 ref 访问子组件内部的 DOM 节点。

```jsx
// 函数组件默认不能接收 ref 属性
const MyInput = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// 父组件使用
function App() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // 可以访问子组件的 DOM
  };

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

**Q5: useImperativeHandle 有什么作用？**

`useImperativeHandle` 可以自定义暴露给父组件的 ref 值，而不是直接暴露 DOM 节点，实现更受控的接口。

```jsx
const MyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // 只暴露 focus 方法，而不是整个 DOM 节点
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} />;
});

// 父组件
function App() {
  const inputRef = useRef(null);

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}
```

**Q6: 回调 Ref 是什么？**

除了 `useRef`，还可以用函数形式的 ref（回调 ref），在节点挂载/卸载时执行。

```jsx
function App() {
  // 回调 ref：节点挂载时调用，卸载时传 null
  const setInputRef = (node) => {
    if (node) {
      node.focus();
    }
  };

  return <input ref={setInputRef} />;
}
```

---
