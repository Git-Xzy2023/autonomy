---
title: "React 元素与组件的区别"
---

# React 元素与组件的区别

**Q1: React Element、Component、Instance 有什么区别？**

这是三个容易混淆的概念：

1. **React Element（元素）**：一个普通对象，描述 DOM 节点或其他组件。是 React 应用的最小构建单元。

2. **React Component（组件）**：一个函数或类，接收 props 作为输入，返回 React Element。

3. **React Instance（实例）**：类组件被渲染后创建的实例，拥有 state 和生命周期方法。

```jsx
// 1. 组件：一个函数
function Button({ label }) {
  return <button>{label}</button>;
}

// 2. 元素：一个普通对象（JSX 产生的结果）
const element = <Button label="Click" />;
// 等价于：const element = { type: Button, props: { label: 'Click' } };

// 3. 实例：类组件渲染后创建的对象
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 }; // 实例属性
  }
  render() {
    return <div>{this.state.count}</div>;
  }
}
// 当 <Counter /> 被渲染时，React 会 new 一个 Counter 实例
```

**Q2: React Element 的结构是什么样的？**

```jsx
const element = <div className="box" id="main">Hello</div>;

// element 是一个冻结的普通对象，大致结构：
{
  $$typeof: Symbol(react.element),  // 安全标记，防止 XSS
  type: 'div',                       // 元素类型（字符串=DOM节点，函数/类=组件）
  key: null,                         // key 属性
  ref: null,                         // ref 属性
  props: {                           // 属性和子节点
    className: 'box',
    id: 'main',
    children: 'Hello'
  },
  _owner: null,                      // 创建该元素的组件实例（调试用）
  _store: {}                         // 内部存储
}
```

**Q3: 为什么说"元素是不可变的"？**

React Element 一旦创建，它的 `type`、`props`、`children` 等属性就不可更改。要更新 UI，只能创建一个全新的元素树，交给 React 去对比（Diff）并更新真实 DOM。

```jsx
// ❌ 错误：试图修改元素
const element = <div>Hello</div>;
element.props.children = 'World'; // 不会生效，元素是冻结的

// ✅ 正确：创建新元素
function Clock() {
  const [time, setTime] = useState(new Date());
  // 每次渲染都创建新的元素
  return <div>{time.toLocaleTimeString()}</div>;
}
```

**Q4: 函数组件和类组件返回的都是元素吗？**

是的。无论是函数组件还是类组件的 `render()` 方法，返回的都是 React Element。

```jsx
// 函数组件：直接返回元素
function FuncComp() {
  return <div>I'm a function component</div>;
}

// 类组件：render 方法返回元素
class ClassComp extends React.Component {
  render() {
    return <div>I'm a class component</div>;
  }
}

// 使用时，<FuncComp /> 和 <ClassComp /> 都是创建元素
// 元素的 type 字段分别指向函数和类
```

---
