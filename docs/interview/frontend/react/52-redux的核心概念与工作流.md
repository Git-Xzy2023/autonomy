---
title: "Redux 的核心概念与工作流"
---

# Redux 的核心概念与工作流

**Q1: Redux 的核心概念是什么？**

Redux 有三个核心概念：**Store、Action、Reducer**。

```
单向数据流：
  Action → Dispatcher → Reducer → Store → View
    ↑                                          |
    └──────────────────────────────────────────┘
```

1. **Store**：全局唯一的状态树
2. **Action**：描述"发生了什么"的纯对象
3. **Reducer**：根据 Action 返回新 State 的纯函数

```jsx
// 1. Action：描述事件
const addAction = { type: 'ADD_TODO', payload: { id: 1, text: 'Learn Redux' } };

// 2. Reducer：处理逻辑
function todoReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.payload.id);
    default:
      return state;
  }
}

// 3. Store：创建全局状态
const store = createStore(todoReducer);

// 4. 使用
store.dispatch({ type: 'ADD_TODO', payload: { id: 1, text: 'Learn Redux' } });
console.log(store.getState()); // [{ id: 1, text: 'Learn Redux' }]
```

**Q2: Redux 的三大原则？**

1. **单一数据源**：整个应用的状态存储在一个 Store 中。

2. **状态只读**：唯一改变状态的方式是触发 Action。

3. **纯函数变更**：Reducer 必须是纯函数，无副作用，返回新 State。

```jsx
// ❌ 违反纯函数原则
function badReducer(state, action) {
  state.items.push(action.payload); // 直接修改原 state
  return state;
}

// ✅ 正确
function goodReducer(state, action) {
  return [...state, action.payload]; // 返回新数组
}
```

**Q3: 在 React 中如何使用 Redux？**

```jsx
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Store
const store = createStore(reducer);

// 根组件包裹 Provider
function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}

// 函数组件使用 Hooks
function TodoApp() {
  // 订阅 state
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: { text } });
  };

  return (
    <div>
      {todos.map(todo => <div key={todo.id}>{todo.text}</div>)}
      <button onClick={() => addTodo('New')}>Add</button>
    </div>
  );
}
```

**Q4: Redux 的中间件是什么？**

中间件用于处理 Action 和 Reducer 之间的逻辑，最常见的是**异步操作**。

```
Action → Middleware → Reducer → Store
```

```jsx
// redux-thunk：处理异步 action
const fetchUser = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_START' });
    try {
      const res = await fetch(`/api/users/${userId}`);
      const user = await res.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_ERROR', payload: error });
    }
  };
};

// 使用
dispatch(fetchUser(1)); // dispatch 一个函数而不是对象

// 中间件原理（简化）
function applyMiddleware(store, middlewares) {
  let dispatch = store.dispatch;
  middlewares.forEach(mw => {
    dispatch = mw(store)(dispatch);
  });
  store.dispatch = dispatch;
}
```

**Q5: Redux 和 Context 的区别？**

| 特性       | Redux                    | Context API              |
| ---------- | ------------------------ | ------------------------ |
| 数据流     | 严格单向                 | 单向                     |
| 性能       | 精细订阅，按需更新       | 值变化所有消费者重渲染   |
| 中间件     | ✅ 强大（thunk、saga）   | ❌ 需自己实现            |
| 调试工具   | Redux DevTools（时间旅行）| 有限                     |
| 异步处理   | 中间件支持               | 需自己处理               |
| 样板代码   | 多                       | 少                       |
| 学习成本   | 高                       | 低                       |
| 适用场景   | 中大型应用               | 中小型应用               |

**Q6: Redux 的性能优化？**

```jsx
// 1. 精细订阅：只选择需要的字段
const name = useSelector(state => state.user.name); // 只订阅 name
// name 不变时，组件不重渲染

// 2. 返回新引用时用 equality 函数
const items = useSelector(state => state.items, shallowEqual);

// 3. 使用 reselect 做记忆化选择器
import { createSelector } from 'reselect';

const getVisibleTodos = createSelector(
  [state => state.todos, state => state.filter],
  (todos, filter) => {
    switch (filter) {
      case 'completed': return todos.filter(t => t.done);
      case 'active': return todos.filter(t => !t.done);
      default: return todos;
    }
  }
);
// 只有 todos 或 filter 变化时才重新计算
```

**Q7: 什么时候该用 Redux？**

- 同一状态需要在多处共享
- 状态更新逻辑复杂
- 需要时间旅行调试
- 需要统一的异步处理方案

**什么时候不该用 Redux？**
- 小型应用（用 Context + useReducer 足够）
- 临时状态（表单、UI 开关）
- 服务端缓存（用 React Query / SWR）

---
