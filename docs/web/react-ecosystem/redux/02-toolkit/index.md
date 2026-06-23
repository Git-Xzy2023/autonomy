---
title: Redux Toolkit
---

# Redux Toolkit

> Redux Toolkit（RTK）是官方推荐的编写 Redux 逻辑的方式。

---

## 一、RTK 简介

### 1.1 为什么使用 RTK

```
┌─────────────────────────────────────────┐
│           Redux Toolkit 优势            │
├─────────────────────────────────────────┤
│                                         │
│  ✅ 更少的样板代码                       │
│  ✅ 自动配置                             │
│  ✅ 内置 Immer（不可变更新）             │
│  ✅ 内置 Redux DevTools                  │
│  ✅ 内置 thunk 中间件                    │
│  ✅ TypeScript 友好                      │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 安装

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 二、configureStore

### 2.1 基本配置

```typescript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import todoReducer from './features/todos/todoSlice'

// 自动配置 DevTools 和 thunk 中间件
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer
  }
})

// 类型导出
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 2.2 添加中间件

```typescript
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger)
})
```

---

## 三、createSlice

### 3.1 基本用法

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // 使用 Immer，可以直接修改 state
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    // 带参数的 action
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    // 带对象的 action
    setValue: (state, action: PayloadAction<{ value: number }>) => {
      state.value = action.payload.value
    }
  }
})

// 导出 actions
export const { increment, decrement, incrementByAmount, setValue } = counterSlice.actions

// 导出 reducer
export default counterSlice.reducer
```

### 3.2 使用

```typescript
// 组件中使用
import { useSelector, useDispatch } from 'react-redux'
import { increment, incrementByAmount } from './counterSlice'
import type { RootState } from '../../store'

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  )
}
```

---

## 四、Typed Hooks

### 4.1 创建类型安全的 Hooks

```typescript
// hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// 类型安全的 useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 类型安全的 useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### 4.2 使用

```typescript
import { useAppDispatch, useAppSelector } from './hooks'
import { increment } from './features/counter/counterSlice'

function Counter() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()

  return <button onClick={() => dispatch(increment())}>{count}</button>
}
```

---

## 五、extraReducers

### 5.1 处理其他 action

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 异步 thunk
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: number) => {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})
```

---

## 六、完整示例

### 6.1 Todo 应用

```typescript
// features/todos/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  items: Todo[]
  filter: 'all' | 'active' | 'completed'
}

const initialState: TodoState = {
  items: [],
  filter: 'all'
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      })
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(t => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(t => t.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<TodoState['filter']>) => {
      state.filter = action.payload
    }
  }
})

export const { addTodo, toggleTodo, removeTodo, setFilter } = todoSlice.actions
export default todoSlice.reducer
```

### 6.2 组件使用

```typescript
// components/TodoList.tsx
import { useAppSelector, useAppDispatch } from '../../hooks'
import { toggleTodo, removeTodo } from '../../features/todos/todoSlice'

function TodoList() {
  const { items, filter } = useAppSelector(state => state.todos)
  const dispatch = useAppDispatch()

  const filteredTodos = items.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <ul>
      {filteredTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => dispatch(removeTodo(todo.id))}>删除</button>
        </li>
      ))}
    </ul>
  )
}
```

---

## 七、总结

### ✅ 关键知识点

1. **configureStore**：自动配置 store
2. **createSlice**：简化 reducer 编写
3. **Immer**：直接修改 state，自动处理不可变
4. **Typed Hooks**：useAppDispatch、useAppSelector
5. **extraReducers**：处理其他 action
6. **PayloadAction**：类型安全的 action

### 🔜 下一章

- 下一章：[异步操作](/web/react-ecosystem/redux/03-async/)
- 上一章：[基础](/web/react-ecosystem/redux/01-basics/)
- 上一级：[Redux](/web/react-ecosystem/redux/)
