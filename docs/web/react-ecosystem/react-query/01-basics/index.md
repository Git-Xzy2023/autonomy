---
title: React Query 基础
---

# React Query 基础

> 学习 React Query 的基本概念和使用方法。

---

## 一、安装

```bash
npm install @tanstack/react-query
```

---

## 二、配置

### 2.1 QueryClientProvider

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 分钟
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootComponent />
    </QueryClientProvider>
  )
}
```

### 2.2 Devtools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootComponent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## 三、基本查询

### 3.1 useQuery

```typescript
import { useQuery } from '@tanstack/react-query'

// 获取用户
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('获取用户失败')
      }
      return response.json()
    }
  })

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误：{error.message}</div>

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  )
}
```

### 3.2 查询状态

```typescript
function UserProfile({ userId }) {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,      // 是否正在获取（包括后台）
    isStale,         // 数据是否过期
    refetch          // 手动重新获取
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: fetchUser
  })

  return (
    <div>
      {isLoading && <div>加载中...</div>}
      {isError && <div>错误：{error.message}</div>}
      {data && (
        <>
          <h2>{data.name}</h2>
          {isFetching && <span>更新中...</span>}
          <button onClick={() => refetch()}>刷新</button>
        </>
      )}
    </div>
  )
}
```

---

## 四、查询键

### 4.1 查询键的作用

```
┌─────────────────────────────────────────┐
│              查询键                     │
├─────────────────────────────────────────┤
│                                         │
│  查询键是缓存的标识                     │
│                                         │
│  相同的查询键 → 使用缓存               │
│  不同的查询键 → 新请求                  │
│                                         │
│  格式：                                 │
│  ├── 字符串：['users']                 │
│  ├── 数组：['user', userId]            │
│  └── 对象：['users', { page: 1 }]      │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 查询键示例

```typescript
// 简单查询
useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

// 带参数
useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId)
})

// 带多个参数
useQuery({
  queryKey: ['todos', { status, page }],
  queryFn: () => fetchTodos(status, page)
})

// 带排序和过滤
useQuery({
  queryKey: ['todos', { sort: 'desc', filter: 'active' }],
  queryFn: fetchTodos
})
```

---

## 五、配置选项

### 5.1 常用配置

```typescript
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,

  // 启用/禁用
  enabled: !!userId,  // userId 存在时才查询

  // 重试
  retry: 3,           // 失败重试 3 次
  retryDelay: 1000,   // 重试间隔

  // 缓存时间
  staleTime: 1000 * 60 * 5,   // 5 分钟内不重新获取
  cacheTime: 1000 * 60 * 30,  // 30 分钟后清除缓存

  // 后台更新
  refetchOnWindowFocus: true,  // 窗口聚焦时更新
  refetchOnMount: true,        // 组件挂载时更新
  refetchOnReconnect: true,    // 网络重连时更新

  // 轮询
  refetchInterval: 5000,       // 每 5 秒轮询

  // 选择数据
  select: (data) => data.name,  // 只取 name 字段
})
```

### 5.2 条件查询

```typescript
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId  // userId 存在时才查询
  })

  return <div>{data?.name}</div>
}
```

---

## 六、并行查询

### 6.1 多个查询

```typescript
function Dashboard() {
  // 并行执行
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const postsQuery = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  const commentsQuery = useQuery({ queryKey: ['comments'], queryFn: fetchComments })

  if (usersQuery.isLoading || postsQuery.isLoading || commentsQuery.isLoading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <h2>用户：{usersQuery.data.length}</h2>
      <h2>文章：{postsQuery.data.length}</h2>
      <h2>评论：{commentsQuery.data.length}</h2>
    </div>
  )
}
```

### 6.2 useQueries

```typescript
import { useQueries } from '@tanstack/react-query'

function UserList({ userIds }) {
  const queries = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id)
    }))
  })

  const isLoading = queries.some(q => q.isLoading)

  if (isLoading) return <div>加载中...</div>

  return (
    <ul>
      {queries.map((query, i) => (
        <li key={userIds[i]}>{query.data?.name}</li>
      ))}
    </ul>
  )
}
```

---

## 七、依赖查询

### 7.1 串行查询

```typescript
function UserProjects({ userId }) {
  // 先获取用户
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })

  // 用户获取成功后，获取项目
  const projectsQuery = useQuery({
    queryKey: ['projects', userId],
    queryFn: () => fetchProjects(userQuery.data.projectIds),
    enabled: !!userQuery.data  // 用户数据存在时才查询
  })

  if (userQuery.isLoading) return <div>加载用户...</div>
  if (projectsQuery.isLoading) return <div>加载项目...</div>

  return (
    <div>
      <h2>{userQuery.data.name} 的项目</h2>
      <ul>
        {projectsQuery.data.map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 八、初始数据

### 8.1 placeholderData

```typescript
// 占位数据（不缓存）
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  placeholderData: { name: '加载中...', email: '' }
})

// 使用上一次的数据作为占位
import { keepPreviousData } from '@tanstack/react-query'

useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  placeholderData: keepPreviousData
})
```

### 8.2 initialData

```typescript
// 初始数据（会缓存）
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  initialData: () => {
    // 从其他查询获取初始数据
    const cached = queryClient.getQueryData(['users'])
    return cached?.find(user => user.id === userId)
  },
  initialDataUpdatedAt: () => {
    // 初始数据的更新时间
    return queryClient.getQueryState(['users'])?.dataUpdatedAt
  }
})
```

---

## 九、总结

### ✅ 关键知识点

1. **QueryClientProvider**：提供 QueryClient
2. **useQuery**：执行查询
3. **查询键**：缓存的标识
4. **配置选项**：enabled、retry、staleTime 等
5. **并行查询**：多个查询同时执行
6. **依赖查询**：enabled 控制查询时机
7. **初始数据**：placeholderData、initialData

### 🔜 下一章

- 下一章：[查询](/web/react-ecosystem/react-query/02-queries/)
- 上一级：[React Query](/web/react-ecosystem/react-query/)
