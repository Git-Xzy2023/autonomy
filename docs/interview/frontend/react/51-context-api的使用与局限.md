---
title: "Context API 的使用与局限"
---

# Context API 的使用与局限

**Q1: Context API 的基本使用？**

```jsx
import { createContext, useContext, useState } from 'react';

// 1. 创建 Context
const ThemeContext = createContext(null);

// 2. Provider 提供数据
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consumer 消费数据
function Page() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  );
}
```

**Q2: Context 的局限是什么？**

1. **任何 Context 值变化，所有消费组件都重渲染**

```jsx
// 问题：即使用户只关心 name，age 变化也会触发重渲染
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'Alice', age: 25 });
  return (
    <UserContext.Provider value={user}>
      <UserName />  {/* 只用 name */}
      <UserAge />   {/* 只用 age */}
    </UserContext.Provider>
  );
  // age 变化 → UserName 也重渲染
}
```

2. **不适合高频更新**

```jsx
// ❌ 不适合：鼠标位置等高频更新数据
const MouseContext = createContext();
// 鼠标移动每秒触发几十次，所有消费组件都会频繁重渲染
```

3. **无法精细订阅**：无法只订阅 Context 的一部分。

4. **调试困难**：Context 变更没有时间旅行等调试工具。

**Q3: 如何优化 Context 性能？**

**方案 1：拆分 Context**

```jsx
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

**方案 2：状态和操作分离**

```jsx
const StateContext = createContext();
const DispatchContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // dispatch 引用永远不变，DispatchContext 的消费者不会因 state 变化重渲染
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Components />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 只需要 dispatch 的组件不会因 state 变化重渲染
function ActionButton() {
  const dispatch = useContext(DispatchContext); // 不订阅 state
  return <button onClick={() => dispatch({ type: 'increment' })}>+</button>;
}
```

**方案 3：使用外部状态管理库**

当 Context 性能不够时，考虑 Zustand、Jotai 等支持精细订阅的库。

**Q4: Context 适合管理什么类型的状态？**

| 适合 | 不适合 |
| --- | --- |
| 主题（theme） | 高频更新数据（鼠标位置、滚动位置） |
| 用户信息（当前登录用户） | 表单状态 |
| 语言/国际化（i18n） | 列表数据（分页、筛选） |
| 路由信息 | 实时数据（WebSocket 消息） |
| 全局配置 | 临时 UI 状态（modal 开关） |

**Q5: Context 的嵌套地狱问题？**

```jsx
// 嵌套地狱
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <ToastProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </ToastProvider>
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// 解决：组合 Provider
function composeProviders(...providers) {
  return providers.reduce((Acc, Provider) => {
    return ({ children }) => (
      <Provider>{children}</Provider>
    );
  });
}

const AppProviders = composeProviders(
  ThemeProvider,
  AuthProvider,
  RouterProvider,
  ToastProvider,
  ModalProvider,
);

function App() {
  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}
```

---
