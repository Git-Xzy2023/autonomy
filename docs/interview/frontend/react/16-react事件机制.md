---
title: "React 事件机制"
---

# React 事件机制

**Q1: React 的事件机制和原生事件有什么区别？**

React 实现了一套**合成事件系统**（SyntheticEvent），而不是直接使用原生 DOM 事件。

| 特性         | 原生事件                       | React 合成事件                  |
| ------------ | ------------------------------ | ------------------------------- |
| 事件绑定位置 | 各个 DOM 节点                  | React 17+ 绑定到 root 容器（之前是 document） |
| 事件对象     | 原生 Event 对象                | SyntheticEvent（包装原生事件）  |
| 事件命名     | `onclick`、`oninput`           | `onClick`、`onChange`（驼峰）   |
| 事件池       | 无                             | React 16 有事件池，17+ 移除     |
| 阻止默认行为 | `e.preventDefault()`           | `e.preventDefault()`（不能用 return false） |
| 冒泡         | 原生冒泡                       | React 模拟的冒泡（在 root 处统一处理） |

**Q2: 合成事件的工作原理？**

```
用户点击按钮
  ↓
浏览器触发原生 click 事件，冒泡到 root 容器
  ↓
React 监听 root 上的事件，找到触发事件的 Fiber 节点
  ↓
从触发节点向上收集所有 onClick 处理函数
  ↓
构造 SyntheticEvent 对象
  ↓
按收集顺序执行处理函数（模拟捕获和冒泡）
```

```jsx
// React 17+ 的事件委托
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// React 在 root 容器上监听事件，而不是 document
// 这样多个 React 应用可以共存，不会互相干扰
```

**Q3: React 事件中的 this 为什么会丢失？如何解决？**

这是类组件的经典问题。当把方法作为回调传给 JSX 时，方法会脱离实例，`this` 变成 `undefined`。

```jsx
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  // ❌ 普通方法：this 会丢失
  handleClick() {
    console.log(this); // undefined
    this.setState({ count: this.state.count + 1 });
  }

  // ✅ 方案 1：箭头函数类字段（推荐）
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        {/* ✅ 方案 2：箭头函数包裹 */}
        <button onClick={(e) => this.handleClick(e)}>+</button>

        {/* ✅ 方案 3：构造函数 bind */}
        {/* constructor 中：this.handleClick = this.handleClick.bind(this); */}
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}
```

**Q4: 如何在 React 中获取原生事件对象？**

通过 `e.nativeEvent` 获取。

```jsx
function Input() {
  const handleChange = (e) => {
    // e 是 SyntheticEvent
    console.log(e.target.value);

    // e.nativeEvent 是原生事件
    console.log(e.nativeEvent);
  };
  return <input onChange={handleChange} />;
}
```

**Q5: React 事件和原生事件的执行顺序？**

当同一个节点同时绑定了原生事件和 React 事件时：

```jsx
function App() {
  useEffect(() => {
    const btn = document.getElementById('btn');
    // 原生事件监听
    btn.addEventListener('click', () => {
      console.log('原生事件');
    });
  }, []);

  const handleClick = () => {
    console.log('React 事件');
  };

  return <button id="btn" onClick={handleClick}>Click</button>;
}
// 点击输出顺序：
// 原生事件（目标节点上的原生监听先执行）
// React 事件（冒泡到 root 后才触发）
```

**注意**：不要混用原生事件和 React 事件，容易导致执行顺序混乱和内存泄漏（原生事件需要手动 `removeEventListener`）。

---
