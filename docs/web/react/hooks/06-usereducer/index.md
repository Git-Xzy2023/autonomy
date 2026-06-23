---
title: useReducer 复杂状态
---

# useReducer 复杂状态

> useReducer 是 useState 的替代方案，用于管理复杂的状态逻辑。

---

## 一、useReducer 简介

### 1.1 useState vs useReducer

```
┌─────────────────────────────────────────┐
│         useState vs useReducer          │
├─────────────────────────────────────────┤
│                                         │
│  useState                               │
│  ├── 简单状态                            │
│  ├── 独立的状态                          │
│  └── 直接设置新值                        │
│                                         │
│  useReducer                             │
│  ├── 复杂状态逻辑                        │
│  ├── 相关的状态                          │
│  ├── 多种操作类型                        │
│  └── 状态转换可预测                      │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 何时使用 useReducer？

- ✅ 状态逻辑复杂
- ✅ 多个子状态相互依赖
- ✅ 下一个状态依赖前一个状态
- ✅ 状态更新需要可预测、可测试

---

## 二、基本用法

### 2.1 计数器示例

```typescript
import { useReducer } from 'react'

// 1. 定义 reducer
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    case 'set':
      return { count: action.payload }
    default:
      return state
  }
}

// 2. 初始状态
const initialState = { count: 0 }

// 3. 使用
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState)

  return (
    <div>
      <p>计数：{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
      <button onClick={() => dispatch({ type: 'set', payload: 10 })}>设为 10</button>
    </div>
  )
}
```

### 2.2 语法

```typescript
const [state, dispatch] = useReducer(reducer, initialArg, init)

// reducer: (state, action) => newState
// initialArg: 初始状态
// init: 可选，惰性初始化函数
```

---

## 三、复杂状态管理

### 3.1 表单状态

```typescript
interface FormState {
  username: string
  email: string
  password: string
  errors: {
    username?: string
    email?: string
    password?: string
  }
  isSubmitting: boolean
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; errors: object }
  | { type: 'RESET' }

const initialState: FormState = {
  username: '',
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: undefined }
      }
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined }
      }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return { ...initialState }
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const handleChange = (field) => (e) => {
    dispatch({ type: 'SET_FIELD', field, value: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'SUBMIT_START' })

    try {
      await api.submit(state)
      dispatch({ type: 'SUBMIT_SUCCESS' })
    } catch (err) {
      dispatch({ type: 'SUBMIT_ERROR', errors: err.errors })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.username}
        onChange={handleChange('username')}
      />
      {state.errors.username && <span>{state.errors.username}</span>}
      <button disabled={state.isSubmitting}>提交</button>
    </form>
  )
}
```

### 3.2 异步操作

```typescript
interface DataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

type DataAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' }

function dataReducer<T>(state: DataState<T>, action: DataAction<T>): DataState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null }
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.payload }
    case 'RESET':
      return { data: null, loading: false, error: null }
    default:
      return state
  }
}

function useFetch<T>(url: string) {
  const [state, dispatch] = useReducer(dataReducer<T>, {
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' })
      try {
        const response = await fetch(url)
        const data = await response.json()
        if (isMounted) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data })
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: 'FETCH_ERROR', payload: err.message })
        }
      }
    }

    fetchData()

    return () => { isMounted = false }
  }, [url])

  return state
}
```

---

## 四、惰性初始化

### 4.1 使用第三个参数

```typescript
function init(initialCount) {
  return {
    count: initialCount,
    history: []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, state.count]
      }
    case 'reset':
      return init(action.payload)
    default:
      return state
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init)

  return (
    <div>
      <p>计数：{state.count}</p>
      <p>历史：{state.history.join(', ')}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>重置</button>
    </div>
  )
}
```

---

## 五、结合 Context 使用

### 5.1 全局状态管理

```typescript
// store.ts
import { createContext, useContext, useReducer, Dispatch } from 'react'

interface State {
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }

const initialState: State = {
  user: null,
  theme: 'light',
  notifications: []
}

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    default:
      return state
  }
}

const StateContext = createContext<State | null>(null)
const DispatchContext = createContext<Dispatch<Action> | null>(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(StateContext)
  if (!context) throw new Error('useAppState 必须在 AppProvider 内使用')
  return context
}

export function useDispatch() {
  const context = useContext(DispatchContext)
  if (!context) throw new Error('useDispatch 必须在 AppProvider 内使用')
  return context
}
```

### 5.2 使用

```typescript
function Header() {
  const { user, theme } = useAppState()
  const dispatch = useDispatch()

  return (
    <header>
      {user ? (
        <button onClick={() => dispatch({ type: 'LOGOUT' })}>退出</button>
      ) : (
        <Link to="/login">登录</Link>
      )}
      <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  )
}
```

---

## 六、useReducer vs useState

### 6.1 选择建议

| 场景                         | 推荐       |
| ---------------------------- | ---------- |
| 简单的独立状态               | useState   |
| 复杂的状态逻辑               | useReducer |
| 多个相关状态                 | useReducer |
| 状态转换有明确规则           | useReducer |
| 需要可测试的状态逻辑         | useReducer |
| 全局状态管理                 | useReducer + Context |

### 6.2 重构示例

```typescript
// useState 版本
function TodoList() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, done: false }])
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }
}

// useReducer 版本（更清晰）
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, todos: [...state.todos, action.payload] }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, done: !t.done } : t
        )
      }
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id)
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
    loading: false
  })

  const addTodo = (text) => {
    dispatch({
      type: 'ADD',
      payload: { id: Date.now(), text, done: false }
    })
  }
}
```

---

## 七、测试 reducer

reducer 是纯函数，易于测试：

```typescript
import { todoReducer } from './todoReducer'

describe('todoReducer', () => {
  const initialState = {
    todos: [],
    filter: 'all'
  }

  test('添加 todo', () => {
    const action = {
      type: 'ADD',
      payload: { id: 1, text: '学习 React', done: false }
    }
    const newState = todoReducer(initialState, action)

    expect(newState.todos).toHaveLength(1)
    expect(newState.todos[0].text).toBe('学习 React')
  })

  test('切换 todo 状态', () => {
    const state = {
      todos: [{ id: 1, text: '学习', done: false }],
      filter: 'all'
    }
    const action = { type: 'TOGGLE', id: 1 }
    const newState = todoReducer(state, action)

    expect(newState.todos[0].done).toBe(true)
  })
})
```

---

## 八、总结

### ✅ 关键知识点

1. **useReducer**：用于复杂状态逻辑
2. **reducer**：纯函数 `(state, action) => newState`
3. **dispatch**：触发状态更新
4. **惰性初始化**：第三个参数 `init` 函数
5. **结合 Context**：实现全局状态管理
6. **可测试性**：reducer 是纯函数，易于测试
7. **选择依据**：简单用 useState，复杂用 useReducer

### 🔜 下一章

- 下一章：[自定义 Hooks](/web/react/hooks/07-custom-hooks/)
- 上一章：[useMemo 与 useCallback](/web/react/hooks/05-usememo-usecallback/)
- 上一级：[Hooks](/web/react/hooks/)
