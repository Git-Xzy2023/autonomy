---
title: 查询
---

# 查询

> 深入学习 React Query 的查询功能。

---

## 一、分页查询

### 1.1 基本分页

```typescript
function PaginatedList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(page),
    keepPreviousData: true  // 保留前一次数据（v4）
    // v5 使用 placeholderData: keepPreviousData
  })

  return (
    <div>
      {isLoading ? (
        <div>加载中...</div>
      ) : (
        <ul>
          {data.items.map(todo => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          上一页
        </button>
        <span>第 {page} 页</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!data.hasMore}
        >
          下一页
        </button>
        {isFetching && <span>更新中...</span>}
      </div>
    </div>
  )
}
```

---

## 二、无限滚动

### 2.1 useInfiniteQuery

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

function InfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: ({ pageParam = 0 }) => fetchTodos(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 0
  })

  if (isLoading) return <div>加载中...</div>

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.items.map(todo => (
            <div key={todo.id}>{todo.text}</div>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? '加载中...'
          : hasNextPage
            ? '加载更多'
            : '没有更多了'}
      </button>
    </div>
  )
}
```

### 2.2 自动加载

```typescript
function InfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: ({ pageParam = 0 }) => fetchTodos(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined
  })

  // 使用 IntersectionObserver 自动加载
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.items.map(todo => (
            <div key={todo.id}>{todo.text}</div>
          ))}
        </div>
      ))}
      <div ref={ref}>
        {isFetching && '加载中...'}
      </div>
    </div>
  )
}
```

---

## 三、预加载

### 3.1 鼠标悬停预加载

```typescript
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  // 预加载用户详情
  const prefetchUser = (userId) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60  // 1 分钟
    })
  }

  return (
    <ul>
      {users.map(user => (
        <li
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}  // 悬停预加载
        >
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### 3.2 路由预加载

```typescript
function Navigation() {
  const navigate = useNavigate()

  const handleHover = (path) => {
    // 预加载路由数据
    if (path === '/dashboard') {
      queryClient.prefetchQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData
      })
    }
  }

  return (
    <nav>
      <Link
        to="/dashboard"
        onMouseEnter={() => handleHover('/dashboard')}
      >
        仪表盘
      </Link>
    </nav>
  )
}
```

---

## 四、查询缓存操作

### 4.1 QueryClient 方法

```typescript
import { useQueryClient } from '@tanstack/react-query'

function MyComponent() {
  const queryClient = useQueryClient()

  // 获取缓存数据
  const data = queryClient.getQueryData(['user', 1])

  // 设置缓存数据
  queryClient.setQueryData(['user', 1], { name: '张三' })

  // 使查询失效
  queryClient.invalidateQueries({ queryKey: ['users'] })

  // 移除查询
  queryClient.removeQueries({ queryKey: ['old-data'] })

  // 清除所有缓存
  queryClient.clear()

  // 重新获取
  queryClient.refetchQueries({ queryKey: ['users'] })
}
```

### 4.2 使查询失效

```typescript
function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', data.id] })

      // 或直接更新缓存
      queryClient.setQueryData(['user', data.id], data)
    }
  })
}
```

---

## 五、乐观更新

### 5.1 查询乐观更新

```typescript
function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleTodo,

    // 请求前乐观更新
    onMutate: async (todo) => {
      // 取消相关查询
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // 保存前值
      const previousTodos = queryClient.getQueryData(['todos'])

      // 乐观更新
      queryClient.setQueryData(['todos'], (old) =>
        old.map(t =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      )

      // 返回上下文（用于回滚）
      return { previousTodos }
    },

    // 失败时回滚
    onError: (err, todo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
    },

    // 完成后重新获取
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}
```

---

## 六、自定义 Hook

### 6.1 封装查询

```typescript
// hooks/useUser.ts
export function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5
  })
}

// hooks/useTodos.ts
export function useTodos(filter?: string) {
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: () => fetchTodos(filter),
    select: (data) => {
      // 转换数据
      return data.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }))
    }
  })
}

// 使用
function UserProfile({ userId }) {
  const { data, isLoading } = useUser(userId)

  if (isLoading) return <div>加载中...</div>
  return <div>{data.name}</div>
}
```

---

## 七、查询回调

### 7.1 回调函数

```typescript
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  // 成功回调
  onSuccess: (data) => {
    console.log('获取成功', data)
  },
  // 错误回调
  onError: (error) => {
    console.error('获取失败', error)
    // 显示错误通知
    toast.error(error.message)
  },
  // 完成回调
  onSettled: (data, error) => {
    console.log('请求完成')
  }
})
```

---

## 八、总结

### ✅ 关键知识点

1. **分页查询**：keepPreviousData 平滑过渡
2. **无限滚动**：useInfiniteQuery
3. **预加载**：prefetchQuery 提升体验
4. **缓存操作**：getQueryData、setQueryData、invalidateQueries
5. **乐观更新**：onMutate 先更新 UI，失败回滚
6. **自定义 Hook**：封装查询逻辑
7. **查询回调**：onSuccess、onError、onSettled

### 🔜 下一章

- 下一章：[变更](/web/react-ecosystem/react-query/03-mutations/)
- 上一章：[基础](/web/react-ecosystem/react-query/01-basics/)
- 上一级：[React Query](/web/react-ecosystem/react-query/)
