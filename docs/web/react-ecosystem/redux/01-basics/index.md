---
title: Redux 基础
---

# Redux 基础

> 学习 Redux 的核心概念和基本使用。

---

## 一、Redux 简介

### 1.1 什么是 Redux？

```
┌─────────────────────────────────────────┐
│              Redux 核心                 │
├─────────────────────────────────────────┤
│                                         │
│  单一数据源                             │
│  ├── 整个应用的状态在单个 store 中      │
│  └── 易于调试和追踪                     │
│                                         │
│  状态只读                               │
│  ├── 不能直接修改状态                   │
│  └── 通过 dispatch action 触发变更      │
│                                         │
│  纯函数变更                             │
│  ├── reducer 是纯函数                   │
│  └── 相同输入永远得到相同输出           │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 何时使用 Redux

```
✅ 适合使用 Redux
- 大型应用，状态复杂
- 多个组件需要共享状态
- 需要追踪状态变化
- 需要时间旅行调试

❌ 不适合使用 Redux
- 小型应用
- 状态简单
- 组件间状态共享少
- 可以用 useState/useContext 解决
```

---

## 二、核心概念

### 2.1 Action

```typescript
// Action 是描述发生了什么的对象
interface Action {
  type: string        // 必须的 type 字段
  payload?: any       // 可选的 payload
}

// 示例
const addTodo = {
  type: 'ADD_TODO',
  payload: {
    id: 1,
    text: '学习 Redux'
  }
}

const toggleTodo = {
  type: 'TOGGLE_TODO',
  payload: { id: 1 }
}
```

### 2.2 Action Creator

```typescript
// Action Creator 是创建 action 的函数
const addTodo = (text: string) => ({
  type: 'ADD_TODO',
  payload: {
    id: Date.now(),
    text
  }
})

const toggleTodo = (id: number) => ({
  type: 'TOGGLE_TODO',
  payload: { id }
})

// 使用
dispatch(addTodo('学习 Redux'))
dispatch(toggleTodo(1))
```

### 2.3 Reducer

```typescript
// Reducer 是根据 action 更新状态的纯函数
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface State {
  todos: Todo[]
}

const initialState: State = {
  todos: []
}

function todoReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }

    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      }

    default:
      return state
  }
}
```

### 2.4 Store

```typescript
import { createStore } from 'redux'

// 创建 store
const store = createStore(todoReducer)

// 获取当前状态
console.log(store.getState())

// 订阅状态变化
const unsubscribe = store.subscribe(() => {
  console.log('状态变化：', store.getState())
})

// 取消订阅
unsubscribe()

// 派发 action
store.dispatch(addTodo('学习 Redux'))
```

---

## 三、React 集成

### 3.1 安装

```bash
npm install redux react-redux
```

### 3.2 Provider

```typescript
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(rootReducer)

function App() {
  return (
    <Provider store={store}>
      <RootComponent />
    </Provider>
  )
}
```

### 3.3 useSelector

```typescript
import { useSelector } from 'react-redux'

function TodoList() {
  // 获取状态
  const todos = useSelector((state: State) => state.todos)

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

### 3.4 useDispatch

```typescript
import { useDispatch } from 'react-redux'

function AddTodo() {
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    dispatch(addTodo(text))
    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">添加</button>
    </form>
  )
}
```

---

## 四、组合 Reducer

### 4.1 多个 Reducer

```typescript
import { combineReducers } from 'redux'

// todos reducer
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload]
    default:
      return state
  }
}

// filter reducer
function filter(state = 'all', action) {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

// 组合
const rootReducer = combineReducers({
  todos,
  filter
})

// 状态结构
// {
//   todos: [...],
//   filter: 'all'
// }
```

### 4.2 使用

```typescript
function App() {
  const todos = useSelector(state => state.todos)
  const filter = useSelector(state => state.filter)

  // ...
}
```

---

## 五、Redux 数据流

### 5.1 单向数据流

```
┌─────────────────────────────────────────┐
│           Redux 单向数据流              │
├─────────────────────────────────────────┤
│                                         │
│  1. 用户交互                            │
│     ↓                                   │
│  2. dispatch(action)                    │
│     ↓                                   │
│  3. store 调用 reducer                  │
│     ↓                                   │
│  4. reducer 返回新状态                  │
│     ↓                                   │
│  5. store 更新                          │
│     ↓                                   │
│  6. 通知订阅者                          │
│     ↓                                   │
│  7. UI 更新                             │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 示例流程

```typescript
// 1. 用户点击按钮
<button onClick={() => dispatch(addTodo('新任务'))}>添加</button>

// 2. dispatch action
// action = { type: 'ADD_TODO', payload: { id: 1, text: '新任务' } }

// 3. reducer 处理
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload]  // 4. 返回新状态
    default:
      return state
  }
}

// 5. store 更新
// 6. useSelector 检测到变化
// 7. 组件重新渲染
```

---

## 六、总结

### ✅ 关键知识点

1. **三大原则**：单一数据源、状态只读、纯函数变更
2. **Action**：描述发生了什么
3. **Reducer**：根据 action 更新状态
4. **Store**：保存状态的对象
5. **Provider**：提供 store
6. **useSelector**：获取状态
7. **useDispatch**：派发 action
8. **combineReducers**：组合多个 reducer

### 🔜 下一章

- 下一章：[Redux Toolkit](/web/react-ecosystem/redux/02-toolkit/)
- 上一级：[Redux](/web/react-ecosystem/redux/)
