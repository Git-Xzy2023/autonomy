---
title: "Props 与 State 的区别"
---

# Props 与 State 的区别

**Q1: Props 和 State 有什么区别？**

这是 React 最基础的面试题之一。

| 特性         | Props                          | State                            |
| ------------ | ------------------------------ | -------------------------------- |
| 含义         | 外部传入的配置数据             | 组件内部的状态数据               |
| 可变性       | **只读**，组件内不能修改       | **可变**，通过 setState 修改     |
| 所有者       | 父组件                         | 当前组件                         |
| 触发重渲染   | 父组件重新渲染时传入新 props   | 调用 setState/dispatch 时        |
| 函数组件     | ✅ 支持                        | ✅ 支持（useState）              |
| 类组件       | ✅ 支持（this.props）          | ✅ 支持（this.state）            |
| 能否在子组件修改 | ❌ 绝对不能                | 子组件无法直接访问父组件的 state |

**Q2: 为什么 Props 是只读的？**

React 坚持"**单向数据流**"原则：数据从父组件流向子组件。如果允许子组件修改 props，会导致数据流向不可追踪，状态难以管理。

```jsx
// ❌ 错误：不能修改 props
function User({ user }) {
  user.name = 'New Name'; // 不要这样做！
  return <div>{user.name}</div>;
}

// ✅ 正确：如果需要修改，用 state 存一份
function User({ user }) {
  const [name, setName] = useState(user.name);
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
    </div>
  );
}

// ✅ 正确：如果父组件需要知道变更，通过回调通知
function User({ user, onRename }) {
  return (
    <input
      value={user.name}
      onChange={e => onRename(e.target.value)}
    />
  );
}
```

**Q3: State 的更新是同步还是异步的？**

在 React 18 之前，在 React 事件处理函数中的 setState 是"异步"的（批处理），在 setTimeout/Promise 中是同步的。React 18 之后，**所有更新默认都是批处理的**（Automatic Batching）。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 批处理：只会触发一次重渲染，最终 count = 1
    setCount(0);
    setCount(1);
    console.log(count); // 0（还没更新）

    // React 18 之前：setTimeout 中是同步的
    // React 18 之后：也是批处理
    setTimeout(() => {
      setCount(2);
      setCount(3);
      console.log(count); // 仍然可能是旧值
    }, 0);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

**Q4: 如何正确地基于前一次 state 更新？**

当新 state 依赖前一次 state 时，必须使用**函数式更新**，否则可能因为批处理导致状态丢失。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // ❌ 危险：基于闭包中的旧 count 计算
    setCount(count + 1);
    setCount(count + 1); // 结果是 1，不是 2！

    // ✅ 正确：使用函数式更新
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // 结果是 2
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

**Q5: State 的"不可变"原则是什么？为什么不能直接修改 state？**

```jsx
// ❌ 错误：直接修改 state
class App extends React.Component {
  state = { list: [1, 2, 3] };

  addItem = () => {
    this.state.list.push(4); // 直接修改原数组
    this.setState({ list: this.state.list }); // 引用没变，可能不触发重渲染
  };
}

// ✅ 正确：创建新引用
addItem = () => {
  this.setState({
    list: [...this.state.list, 4] // 新数组
  });
};

// ✅ 函数组件同理
function App() {
  const [list, setList] = useState([1, 2, 3]);

  const addItem = () => {
    // ❌ 不要 push
    // list.push(4); setList(list);

    // ✅ 创建新数组
    setList(prev => [...prev, 4]);
  };
}
```

原因：React 通过浅比较（`Object.is`）判断 state 是否变化来决定是否重渲染。直接修改原对象，引用不变，React 可能跳过更新。

---
