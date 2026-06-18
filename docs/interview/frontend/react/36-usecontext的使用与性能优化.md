---
title: "useContext 的使用与性能优化"
---

# useContext 的使用与性能优化

**Q1: useContext 的作用是什么？**

`useContext` 用于跨组件层级传递数据，避免"props 逐层透传"（prop drilling）。

```jsx
// 1. 创建 Context
const ThemeContext = createContext('light');

// 2. 在上层提供值
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. 在任意子组件消费
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

**Q2: 没有 useContext 之前的问题？**

```jsx
// ❌ Prop Drilling：数据要逐层传递
function App() {
  const [user, setUser] = useState({ name: 'Alice' });
  return <Layout user={user} />; // 传递
}

function Layout({ user }) {
  return <Sidebar user={user} />; // 再传递
}

function Sidebar({ user }) {
  return <UserInfo user={user} />; // 再传递
}

function UserInfo({ user }) {
  return <div>{user.name}</div>; // 终于用到了
}

// 问题：
// 1. 中间组件（Layout、Sidebar）被迫接收不相关的 props
// 2. 如果数据结构变化，所有中间层都要改
// 3. 难以追踪数据来源
```

**Q3: useContext 的性能问题是什么？**

当 Context 的值变化时，**所有消费该 Context 的组件都会重渲染**，即使它们只用到了变化值的一部分。

```jsx
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'Alice', age: 25, email: 'a@b.com' });

  return (
    <UserContext.Provider value={user}>
      <UserName />   {/* 只用 name */}
      <UserAge />    {/* 只用 age */}
      <UserEmail />  {/* 只用 email */}
    </UserContext.Provider>
  );
  // 问题：age 变化时，UserName 和 UserEmail 也会重渲染
}

function UserName() {
  const { name } = useContext(UserContext);
  return <div>{name}</div>;
}
```

**Q4: 如何优化 Context 的性能？**

**方案 1：拆分 Context**

```jsx
// 把不同数据拆到不同 Context
const NameContext = createContext();
const AgeContext = createContext();

function App() {
  const [name, setName] = useState('Alice');
  const [age, setAge] = useState(25);

  return (
    <NameContext.Provider value={name}>
      <AgeContext.Provider value={age}>
        <UserName />
        <UserAge />
      </AgeContext.Provider>
    </NameContext.Provider>
  );
}
```

**方案 2：使用选择器模式 + useMemo**

```jsx
// 自定义 Hook：只订阅需要的部分
function useUserContext(selector) {
  const user = useContext(UserContext);
  return useMemo(() => selector(user), [user, selector]);
}

function UserName() {
  const name = useUserContext(u => u.name); // 只关心 name
  return <div>{name}</div>;
}
```

**方案 3：使用 use-context-selector 库**

```jsx
import { createContext, useContextSelector } from 'use-context-selector';

const UserContext = createContext(null);

function UserName() {
  const name = useContextSelector(UserContext, state => state.name);
  // 只有 name 变化时才重渲染
  return <div>{name}</div>;
}
```

**方案 4：值用 useMemo 缓存**

```jsx
function App() {
  const [name, setName] = useState('Alice');
  const [age, setAge] = useState(25);

  // ✅ 用 useMemo 防止 Provider value 每次渲染都创建新对象
  const value = useMemo(() => ({ name, age }), [name, age]);

  return (
    <UserContext.Provider value={value}>
      <UserInfo />
    </UserContext.Provider>
  );
}
```

**Q5: Context 的默认值什么时候有用？**

```jsx
// 默认值：当组件不在 Provider 内时使用
const ThemeContext = createContext('light');

// 不在 Provider 内的组件会拿到 'light'
function Button() {
  const theme = useContext(ThemeContext); // 'light'
  return <button className={theme}>Click</button>;
}

// 默认值的另一个用途：测试时独立渲染组件
// 不需要包裹 Provider 就能测试 Button
```

**Q6: useContext 能替代 Redux 吗？**

对于**中小型应用**可以，但 Redux 仍有优势：

| 特性       | Context API       | Redux                |
| ---------- | ----------------- | -------------------- |
| 适用规模   | 中小型            | 中大型               |
| 性能优化   | 需手动拆分/选择器 | 内置精细化订阅       |
| 调试工具   | 有限              | Redux DevTools 强大  |
| 中间件     | 需自己实现        | redux-thunk/saga 等  |
| 时间旅行   | ❌                | ✅                   |
| 学习成本   | 低                | 较高                 |

---
