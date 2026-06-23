---
title: React Query 最佳实践
---

# React Query 最佳实践

> React Query 的最佳实践和模式。

---

## 一、查询键组织

### 1.1 查询键层级

```typescript
// 推荐的查询键结构
['users']                              // 所有用户
['users', 'list', { page: 1 }]         // 用户列表
['users', 'detail', userId]            // 用户详情
['users', 'posts', userId]             // 用户的文章

// 示例
useQuery({
  queryKey: ['users', 'list', { page, status }],
  queryFn: () => fetchUsers(page, status)
})

useQuery({
  queryKey: ['users', 'detail', userId],
  queryFn: () => fetchUser(userId)
})
```

### 1.2 失效查询

```typescript
// 失效所有用户相关查询
queryClient.invalidateQueries({ queryKey: ['users'] })

// 只失效用户列表
queryClient.invalidateQueries({ queryKey: ['users', 'list'] })

// 精确失效
queryClient.invalidateQueries({
  queryKey: ['users', 'detail', userId],
  exact: true
})
```

---

## 二、自定义 Hook 封装

### 2.1 查询 Hook

```typescript
// hooks/queries/useUser.ts
import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../../api/users'

export function useUser(userId: number) {
  return useQuery({
    queryKey: ['users', 'detail', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5
  })
}

// hooks/queries/useUsers.ts
export function useUsers(page: number, status?: string) {
  return useQuery({
    queryKey: ['users', 'list', { page, status }],
    queryFn: () => fetchUsers(page, status),
    placeholderData: keepPreviousData
  })
}
```

### 2.2 Mutation Hook

```typescript
// hooks/mutations/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../../api/users'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // 更新用户详情缓存
      queryClient.setQueryData(['users', 'detail', data.id], data)

      // 失效用户列表
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    }
  })
}
```

### 2.3 使用

```typescript
function UserProfile({ userId }) {
  const { data, isLoading } = useUser(userId)
  const updateUser = useUpdateUser()

  if (isLoading) return <div>加载中...</div>

  return (
    <div>
      <h2>{data.name}</h2>
      <button onClick={() => updateUser.mutate({ ...data, name: '新名字' })}>
        更新
      </button>
    </div>
  )
}
```

---

## 三、API 层分离

### 3.1 API 函数

```typescript
// api/users.ts
export async function fetchUsers(page: number, status?: string) {
  const params = new URLSearchParams({ page: String(page) })
  if (status) params.set('status', status)

  const response = await fetch(`/api/users?${params}`)
  if (!response.ok) {
    throw new Error('获取用户列表失败')
  }
  return response.json()
}

export async function fetchUser(userId: number) {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error('获取用户详情失败')
  }
  return response.json()
}

export async function createUser(data: CreateUserDTO) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('创建用户失败')
  }
  return response.json()
}
```

### 3.2 类型定义

```typescript
// types/user.ts
export interface User {
  id: number
  name: string
  email: string
  avatar: string
  createdAt: string
}

export interface UserListResponse {
  items: User[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CreateUserDTO {
  name: string
  email: string
  password: string
}
```

---

## 四、错误处理

### 4.1 全局错误处理

```typescript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // 全局查询错误处理
      toast.error(error.message)
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // 全局 mutation 错误处理
      toast.error(error.message)
    }
  })
})
```

### 4.2 401 处理

```typescript
// api/client.ts
let isRefreshing = false

export async function apiClient(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options?.headers
    }
  })

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const newToken = await refreshToken()
        setToken(newToken)
        isRefreshing = false
        // 重试原请求
        return apiClient(url, options)
      } catch {
        // 刷新失败，跳转登录
        window.location.href = '/login'
      }
    }
  }

  return response
}
```

---

## 五、预加载策略

### 5.1 路由预加载

```typescript
// 路由配置
const routes = [
  {
    path: '/',
    element: <Home />,
    loader: async () => {
      // 路由加载时预获取数据
      return queryClient.prefetchQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboard
      })
    }
  }
]
```

### 5.2 用户行为预加载

```typescript
function UserList() {
  const prefetchUser = usePrefetchUser()

  return (
    <ul>
      {users.map(user => (
        <li
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}

function usePrefetchUser() {
  const queryClient = useQueryClient()

  return useCallback((userId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['users', 'detail', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60
    })
  }, [queryClient])
}
```

---

## 六、性能优化

### 6.1 合理设置 staleTime

```typescript
// 不常变化的数据：长 staleTime
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: 1000 * 60 * 60  // 1 小时
})

// 经常变化的数据：短 staleTime
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 1000 * 30  // 30 秒
})

// 实时数据：轮询
useQuery({
  queryKey: ['live-data'],
  queryFn: fetchLiveData,
  refetchInterval: 5000  // 5 秒轮询
})
```

### 6.2 select 优化

```typescript
// 使用 select 转换数据，避免在组件中计算
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (users) => users
    .filter(user => user.active)
    .map(user => ({
      id: user.id,
      name: user.name,
      initials: user.name.charAt(0)
    }))
})
```

---

## 七、SSR 支持

### 7.1 Next.js 中使用

```typescript
// app/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserList />
    </HydrationBoundary>
  )
}
```

---

## 八、测试

### 8.1 测试组件

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
}

function renderWithClient(component) {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

test('用户列表', async () => {
  // Mock API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: '张三' }])
    })
  )

  const { findByText } = renderWithClient(<UserList />)

  expect(await findByText('张三')).toBeInTheDocument()
})
```

---

## 九、总结

### ✅ 关键知识点

1. **查询键组织**：层级结构，便于失效
2. **自定义 Hook**：封装查询和变更
3. **API 层分离**：API 函数独立
4. **错误处理**：全局错误处理
5. **预加载**：路由和行为预加载
6. **性能优化**：合理 staleTime、select
7. **SSR**：HydrationBoundary
8. **测试**：QueryClientProvider 包装

### 🔜 下一章

- 下一章：[Next.js 基础](/web/react-ecosystem/nextjs/01-basics/)
- 上一章：[变更](/web/react-ecosystem/react-query/03-mutations/)
- 上一级：[React Query](/web/react-ecosystem/react-query/)
