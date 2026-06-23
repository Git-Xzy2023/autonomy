---
title: 变更
---

# 变更

> 使用 useMutation 处理数据变更操作。

---

## 一、useMutation 基础

### 1.1 基本 Mutation

```typescript
import { useMutation } from '@tanstack/react-query'

function AddTodo() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      }).then(res => res.json())
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ title: e.target.title.value })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? '添加中...' : '添加'}
      </button>

      {mutation.isError && (
        <div>错误：{mutation.error.message}</div>
      )}

      {mutation.isSuccess && (
        <div>添加成功！</div>
      )}
    </form>
  )
}
```

### 1.2 Mutation 状态

```typescript
const mutation = useMutation({
  mutationFn: addTodo
})

// 状态
mutation.isIdle       // 空闲
mutation.isPending    // 进行中
mutation.isSuccess    // 成功
mutation.isError      // 失败

// 数据
mutation.data         // 成功返回的数据
mutation.error        // 错误信息
mutation.variables    // mutate 传递的参数

// 方法
mutation.mutate(data)      // 执行变更
mutation.mutateAsync(data) // 异步执行
mutation.reset()           // 重置状态
```

---

## 二、Mutation 回调

### 2.1 回调函数

```typescript
const mutation = useMutation({
  mutationFn: addTodo,

  // 变更前
  onMutate: (variables) => {
    console.log('变更前', variables)
    // 返回上下文，用于 onError 回滚
    return { previousData: someData }
  },

  // 成功
  onSuccess: (data, variables, context) => {
    console.log('成功', data)
    // 可以在这里更新缓存
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },

  // 失败
  onError: (error, variables, context) => {
    console.error('失败', error)
    // 可以回滚
    if (context?.previousData) {
      // 恢复数据
    }
  },

  // 完成（无论成功失败）
  onSettled: (data, error, variables, context) => {
    console.log('完成')
  }
})
```

### 2.2 组件级回调

```typescript
const mutation = useMutation({
  mutationFn: addTodo
}, {
  // 组件级回调（在 mutationFn 回调后执行）
  onSuccess: () => {
    // 关闭弹窗
    setOpen(false)
    // 显示通知
    toast.success('添加成功')
  },
  onError: (error) => {
    toast.error(error.message)
  }
})
```

---

## 三、更新缓存

### 3.1 添加数据

```typescript
function useAddTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData(['todos'])

      // 乐观更新：添加到列表
      queryClient.setQueryData(['todos'], (old) => [...old, newTodo])

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      // 回滚
      queryClient.setQueryData(['todos'], context.previousTodos)
    },
    onSettled: () => {
      // 重新获取
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}
```

### 3.2 更新数据

```typescript
function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData(['todos'])

      // 乐观更新
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
        )
      )

      return { previousTodos }
    },
    onError: (err, updatedTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}
```

### 3.3 删除数据

```typescript
function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData(['todos'])

      // 乐观删除
      queryClient.setQueryData(['todos'], (old) =>
        old.filter(todo => todo.id !== todoId)
      )

      return { previousTodos }
    },
    onError: (err, todoId, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}
```

---

## 四、批量操作

### 4.1 顺序执行

```typescript
async function addMultipleTodos(todos) {
  for (const todo of todos) {
    await mutation.mutateAsync(todo)
  }
}
```

### 4.2 并行执行

```typescript
async function addMultipleTodos(todos) {
  await Promise.all(
    todos.map(todo => mutation.mutateAsync(todo))
  )
}
```

---

## 五、乐观更新 UI

### 5.1 完整示例

```typescript
function TodoList() {
  const queryClient = useQueryClient()
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old) =>
        old.filter(todo => todo.id !== todoId)
      )

      return { previousTodos }
    },
    onError: (err, todoId, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
      toast.error('删除失败')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  return (
    <ul>
      {todos?.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => deleteMutation.mutate(todo.id)}>
            删除
          </button>
        </li>
      ))}
    </ul>
  )
}
```

---

## 六、重试

### 6.1 重试配置

```typescript
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,           // 失败重试 3 次
  retryDelay: 1000    // 重试间隔
})
```

### 6.2 条件重试

```typescript
const mutation = useMutation({
  mutationFn: addTodo,
  retry: (failureCount, error) => {
    // 只对特定错误重试
    if (error.status === 500) {
      return failureCount < 3
    }
    return false
  }
})
```

---

## 七、Mutation Key

### 7.1 命名 Mutation

```typescript
const mutation = useMutation({
  mutationKey: ['addTodo'],
  mutationFn: addTodo
})

// 可以在外部获取状态
const state = useMutationState({
  mutationKey: ['addTodo'],
  filters: { status: 'pending' }
})
```

---

## 八、总结

### ✅ 关键知识点

1. **useMutation**：执行变更操作
2. **状态**：isIdle、isPending、isSuccess、isError
3. **回调**：onMutate、onSuccess、onError、onSettled
4. **乐观更新**：onMutate 先更新，onError 回滚
5. **缓存更新**：setQueryData、invalidateQueries
6. **批量操作**：顺序或并行执行
7. **重试**：retry 配置

### 🔜 下一章

- 下一章：[最佳实践](/web/react-ecosystem/react-query/04-best-practices/)
- 上一章：[查询](/web/react-ecosystem/react-query/02-queries/)
- 上一级：[React Query](/web/react-ecosystem/react-query/)
