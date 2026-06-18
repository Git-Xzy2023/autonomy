---
title: "useState 的工作原理"
---

# useState 的工作原理

**Q1: useState 的工作原理是什么？**

`useState` 是 React 提供的 Hook，让函数组件能够拥有内部状态。

```jsx
const [state, setState] = useState(initialValue);
```

工作原理：

1. React 为每个组件维护一个 **Hook 链表**（按调用顺序排列）
2. 首次渲染时，`useState` 将初始值存入链表节点
3. 后续渲染时，`useState` 按相同顺序从链表读取当前值
4. 调用 `setState` 时，React 更新链表中的值并触发重渲染

```jsx
// React 内部简化模型
let hookIndex = 0;
const hooks = [];

function useState(initialValue) {
  const currentIndex = hookIndex;

  if (hooks[currentIndex] === undefined) {
    hooks[currentIndex] = initialValue;
  }

  const setState = (newValue) => {
    hooks[currentIndex] = typeof newValue === 'function'
      ? newValue(hooks[currentIndex])
      : newValue;
    triggerReRender();
  };

  hookIndex++;
  return [hooks[currentIndex], setState];
}

// 每次渲染前重置 index
function render(Component) {
  hookIndex = 0;
  return Component();
}
```

**Q2: 为什么 Hooks 不能放在条件语句里？**

因为 React 依赖**调用顺序**来匹配 Hook 和状态。如果顺序变化，会导致状态错乱。

```jsx
function Bad() {
  const [name, setName] = useState('Alice');

  // ❌ 条件调用 Hook
  if (name === 'Alice') {
    const [age, setAge] = useState(25);
  }

  const [email, setEmail] = useState('a@b.com');
  // 第一次渲染：hooks = [name, age, email]
  // name 变化后 age 消失：hooks = [name, email]
  // React 会把 email 的值当成 age，状态全乱了！

  return <div>...</div>;
}

// ✅ 正确：把条件放在 Hook 内部
function Good() {
  const [name, setName] = useState('Alice');
  const [age, setAge] = useState(name === 'Alice' ? 25 : 30);
  const [email, setEmail] = useState('a@b.com');
}
```

**Q3: useState 的初始值可以是函数吗？**

可以。当初始值需要复杂计算时，用函数形式避免每次渲染都计算（惰性初始化）。

```jsx
// ❌ 每次渲染都会执行 expensiveCalc（即使只用第一次的结果）
const [data, setData] = useState(expensiveCalc());

// ✅ 惰性初始化：只在首次渲染时执行
const [data, setData] = useState(() => expensiveCalc());

// 常见场景：从 localStorage 读取
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});
```

**Q4: setState 是同步还是异步的？**

在 React 18 之前，行为取决于调用位置：
- React 事件处理函数中：批处理（"异步"）
- setTimeout、Promise.then、原生事件中：同步

React 18 之后，**所有更新默认批处理**（Automatic Batching）。

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    // React 18：批处理，只触发一次重渲染
    setCount(1);
    setFlag(true);
    console.log(count); // 0（还没更新）
  };

  const handleAsync = async () => {
    await fetch('/api');
    // React 18：也是批处理
    setCount(2);
    setFlag(false);
  };

  // 如果需要立即更新（退出批处理）
  const flushUpdate = () => {
    flushSync(() => {
      setCount(3);
    });
    // 此时 DOM 已更新
    console.log(document.getElementById('count').textContent); // 3
  };
}
```

**Q5: 多次调用 setState 会怎样？**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // ❌ 基于当前闭包的 count
    setCount(count + 1); // count = 0 + 1 = 1
    setCount(count + 1); // count = 0 + 1 = 1（还是用旧的 count）
    setCount(count + 1); // count = 0 + 1 = 1
    // 最终 count = 1

    // ✅ 函数式更新：基于最新值
    setCount(prev => prev + 1); // 0 + 1 = 1
    setCount(prev => prev + 1); // 1 + 1 = 2
    setCount(prev => prev + 1); // 2 + 1 = 3
    // 最终 count = 3
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

**Q6: 如何用 useState 存储对象？**

更新对象 state 时，必须创建新对象（不可变更新）。

```jsx
function Form() {
  const [form, setForm] = useState({ name: '', email: '', age: 0 });

  // ❌ 错误：直接修改
  // form.name = e.target.value; setForm(form);

  // ✅ 正确：展开创建新对象
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ 函数式更新（更安全）
  const handleChange2 = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}
```

---
