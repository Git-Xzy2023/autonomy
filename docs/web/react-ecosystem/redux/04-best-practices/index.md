---
title: Redux 最佳实践
---

# Redux 最佳实践

> Redux 开发的最佳实践和模式。

---

## 一、项目结构

### 1.1 Feature 文件夹结构

```
src/
├── app/                    # 应用配置
│   ├── store.ts
│   └── hooks.ts
├── features/               # 功能模块
│   ├── counter/
│   │   ├── counterSlice.ts
│   │   ├── Counter.tsx
│   │   └── index.ts
│   ├── todos/
│   │   ├── todosSlice.ts
│   │   ├── Todos.tsx
│   │   └── index.ts
│   └── auth/
│       ├── authSlice.ts
│       ├── Login.tsx
│       └── index.ts
├── components/             # 通用组件
├── services/               # API 服务
└── utils/                  # 工具函数
```

### 1.2 Slice 文件组织

```typescript
// features/todos/todosSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// 类型定义
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodosState {
  items: Todo[]
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: TodosState = {
  items: [],
  loading: false,
  error: null
}

// 异步 thunk
export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async () => {
    const response = await fetch('/api/todos')
    return response.json()
  }
)

// Slice
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload)
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload)
      if (todo) todo.completed = !todo.completed
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
  }
})

// 导出 actions
export const { addTodo, toggleTodo } = todosSlice.actions

// 导出 selector
export const selectAllTodos = (state: RootState) => state.todos.items
export const selectTodoById = (state: RootState, id: number) =>
  state.todos.items.find(t => t.id === id)

// 导出 reducer
export default todosSlice.reducer
```

---

## 二、Selector 模式

### 2.1 基本 Selector

```typescript
// 在 slice 文件中定义 selector
export const selectAllTodos = (state: RootState) => state.todos.items
export const selectTodosLoading = (state: RootState) => state.todos.loading

// 组件中使用
function TodoList() {
  const todos = useAppSelector(selectAllTodos)
  const loading = useAppSelector(selectTodosLoading)

  // ...
}
```

### 2.2 参数化 Selector

```typescript
// 使用 createSelector 创建 memoized selector
import { createSelector } from '@reduxjs/toolkit'

export const selectTodoById = createSelector(
  [selectAllTodos, (_, id: number) => id],
  (todos, id) => todos.find(todo => todo.id === id)
)

// 使用
function TodoItem({ id }) {
  const todo = useAppSelector(state => selectTodoById(state, id))
  // ...
}
```

### 2.3 派生数据

```typescript
// 计算未完成的 todos
export const selectActiveTodos = createSelector(
  [selectAllTodos],
  (todos) => todos.filter(todo => !todo.completed)
)

// 计算统计信息
export const selectTodoStats = createSelector(
  [selectAllTodos],
  (todos) => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  })
)
```

---

## 三、状态规范化

### 3.1 使用 createEntityAdapter

```typescript
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

interface Todo {
  id: number
  text: string
  completed: boolean
}

// 创建 entity adapter
const todosAdapter = createEntityAdapter<Todo>({
  sortComparer: (a, b) => a.text.localeCompare(b.text)
})

// 初始状态
const initialState = todosAdapter.getInitialState({
  loading: false,
  error: null
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: todosAdapter.addOne,
    updateTodo: todosAdapter.updateOne,
    removeTodo: todosAdapter.removeOne
  }
})

// 导出 selector
export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds
} = todosAdapter.getSelectors((state: RootState) => state.todos)
```

---

## 四、中间件

### 4.1 自定义中间件

```typescript
import { configureStore } from '@reduxjs/toolkit'

const loggerMiddleware = store => next => action => {
  console.log('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  return result
}

const errorMiddleware = store => next => action => {
  try {
    return next(action)
  } catch (error) {
    console.error('Action error:', error)
    // 上报错误
    errorReporter.report(error)
  }
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loggerMiddleware)
      .concat(errorMiddleware)
})
```

### 4.2 条件中间件

```typescript
const authMiddleware = store => next => action => {
  // 拦截需要认证的 action
  if (action.meta?.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return store.dispatch({ type: 'auth/logout' })
    }
    action.headers = { ...action.headers, Authorization: `Bearer ${token}` }
  }
  return next(action)
}
```

---

## 五、测试

### 5.1 测试 Reducer

```typescript
import todosReducer, { addTodo, toggleTodo } from './todosSlice'

test('添加 todo', () => {
  const initialState = { items: [], loading: false, error: null }
  const action = addTodo({ id: 1, text: '学习', completed: false })

  const newState = todosReducer(initialState, action)

  expect(newState.items).toHaveLength(1)
  expect(newState.items[0].text).toBe('学习')
})

test('切换 todo 状态', () => {
  const initialState = {
    items: [{ id: 1, text: '学习', completed: false }],
    loading: false,
    error: null
  }
  const action = toggleTodo(1)

  const newState = todosReducer(initialState, action)

  expect(newState.items[0].completed).toBe(true)
})
```

### 5.2 测试异步 Thunk

```typescript
import { fetchTodos } from './todosSlice'

// Mock fetch
global.fetch = jest.fn()

test('fetchTodos 成功', async () => {
  const mockTodos = [{ id: 1, text: '学习', completed: false }]
  fetch.mockResolvedValueOnce({
    json: () => Promise.resolve(mockTodos)
  })

  const dispatch = jest.fn()
  const thunk = fetchTodos()

  await thunk(dispatch, () => ({}), undefined)

  expect(dispatch).toHaveBeenCalledWith(fetchTodos.pending())
  expect(dispatch).toHaveBeenCalledWith(fetchTodos.fulfilled(mockTodos))
})
```

### 5.3 测试组件

```typescript
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../app/store'

function renderWithProvider(component) {
  return render(<Provider store={store}>{component}</Provider>)
}

test('Counter 组件', () => {
  const { getByText } = renderWithProvider(<Counter />)
  expect(getByText('0')).toBeInTheDocument()
})
```

---

## 六、性能优化

### 6.1 使用 memoized selector

```typescript
import { createSelector } from '@reduxjs/toolkit'

// ✅ 使用 createSelector 缓存计算结果
const selectFilteredTodos = createSelector(
  [selectAllTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed)
      case 'completed': return todos.filter(t => t.completed)
      default: return todos
    }
  }
)

// ❌ 每次都重新计算
const selectFilteredTodos = (state) => {
  const todos = state.todos.items
  const filter = state.todos.filter
  return todos.filter(t => /* ... */)
}
```

### 6.2 细粒度订阅

```typescript
// ❌ 订阅整个 todos 对象
const todos = useAppSelector(state => state.todos)

// ✅ 只订阅需要的字段
const items = useAppSelector(state => state.todos.items)
const loading = useAppSelector(state => state.todos.loading)

// ✅ 使用 equalityFn 避免不必要渲染
const todo = useAppSelector(
  state => state.todos.items.find(t => t.id === id),
  shallowEqual
)
```

---

## 七、总结

### ✅ 关键知识点

1. **项目结构**：Feature 文件夹组织
2. **Selector 模式**：集中定义、memoized
3. **状态规范化**：createEntityAdapter
4. **中间件**：自定义中间件处理通用逻辑
5. **测试**：Reducer、Thunk、组件
6. **性能优化**：memoized selector、细粒度订阅

### 🔜 下一章

- 下一章：[Zustand 基础](/web/react-ecosystem/zustand/01-basics/)
- 上一章：[异步操作](/web/react-ecosystem/redux/03-async/)
- 上一级：[Redux](/web/react-ecosystem/redux/)
