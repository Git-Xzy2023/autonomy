---
title: 异步操作
---

# 异步操作

> 使用 createAsyncThunk 处理异步逻辑。

---

## 一、createAsyncThunk

### 1.1 基本用法

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// 创建异步 thunk
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: number, thunkAPI) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('用户不存在')
      }
      return await response.json()
    } catch (error) {
      // 返回错误信息
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// 在 slice 中处理
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
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})
```

### 1.2 组件中使用

```typescript
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchUserById } from './userSlice'

function UserProfile({ userId }) {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector(state => state.user)

  useEffect(() => {
    dispatch(fetchUserById(userId))
  }, [userId, dispatch])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误：{error}</div>

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  )
}
```

---

## 二、带参数的异步操作

### 2.1 传递参数

```typescript
// 传递单个参数
export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId: number) => {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  }
)

// 传递对象参数
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return response.json()
  }
)
```

### 2.2 使用 thunkAPI

```typescript
export const fetchWithAuth = createAsyncThunk(
  'data/fetch',
  async (params, thunkAPI) => {
    // 获取当前状态
    const state = thunkAPI.getState() as RootState
    const token = state.auth.token

    // 检查条件
    if (!token) {
      return thunkAPI.rejectWithValue('未登录')
    }

    // 可以 dispatch 其他 action
    thunkAPI.dispatch(setLoading(true))

    try {
      const response = await fetch('/api/data', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return await response.json()
    } finally {
      thunkAPI.dispatch(setLoading(false))
    }
  }
)
```

---

## 三、CRUD 示例

### 3.1 完整 CRUD

```typescript
// features/posts/postsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface Post {
  id: number
  title: string
  content: string
}

// 获取所有文章
export const fetchPosts = createAsyncThunk(
  'posts/fetchAll',
  async () => {
    const response = await fetch('/api/posts')
    return response.json()
  }
)

// 创建文章
export const createPost = createAsyncThunk(
  'posts/create',
  async (post: Omit<Post, 'id'>) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    return response.json()
  }
)

// 更新文章
export const updatePost = createAsyncThunk(
  'posts/update',
  async (post: Post) => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    return response.json()
  }
)

// 删除文章
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    return id
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [] as Post[],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      // 创建
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // 更新
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // 删除
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload)
      })
      // 错误处理
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false
          state.error = action.error.message
        }
      )
  }
})
```

---

## 四、乐观更新

### 4.1 实现乐观更新

```typescript
export const toggleTodo = createAsyncThunk(
  'todos/toggle',
  async (todo: Todo) => {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    })
    return response.json()
  }
)

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] as Todo[] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 乐观更新：请求前就更新 UI
      .addCase(toggleTodo.pending, (state, action) => {
        const todo = state.items.find(t => t.id === action.meta.arg.id)
        if (todo) {
          todo.completed = !todo.completed
        }
      })
      // 请求成功：用服务器数据更新
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // 请求失败：回滚
      .addCase(toggleTodo.rejected, (state, action) => {
        const todo = state.items.find(t => t.id === action.meta.arg.id)
        if (todo) {
          todo.completed = !todo.completed  // 回滚
        }
      })
  }
})
```

---

## 五、取消请求

### 5.1 使用 AbortController

```typescript
export const fetchSearchResults = createAsyncThunk(
  'search/fetch',
  async (query: string, thunkAPI) => {
    const { signal } = thunkAPI

    const response = await fetch(`/api/search?q=${query}`, { signal })
    return response.json()
  }
)

// 组件中取消
function SearchComponent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // 每次输入变化时，取消之前的请求
    const promise = dispatch(fetchSearchResults(query))

    return () => {
      promise.abort()
    }
  }, [query, dispatch])
}
```

---

## 六、总结

### ✅ 关键知识点

1. **createAsyncThunk**：处理异步逻辑
2. **三个状态**：pending、fulfilled、rejected
3. **thunkAPI**：获取状态、dispatch、rejectWithValue
4. **CRUD 操作**：完整的增删改查
5. **乐观更新**：先更新 UI，失败回滚
6. **取消请求**：使用 AbortController

### 🔜 下一章

- 下一章：[最佳实践](/web/react-ecosystem/redux/04-best-practices/)
- 上一章：[Redux Toolkit](/web/react-ecosystem/redux/02-toolkit/)
- 上一级：[Redux](/web/react-ecosystem/redux/)
