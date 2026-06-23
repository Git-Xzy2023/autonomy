---
title: Zustand 基础
---

# Zustand 基础

> 学习 Zustand 的基本使用方法。

---

## 一、安装

```bash
npm install zustand
```

---

## 二、创建 Store

### 2.1 基本 Store

```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: () => void
  decrease: () => void
  reset: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
  reset: () => set({ bears: 0 })
}))
```

### 2.2 使用 Store

```typescript
function BearCounter() {
  // 获取状态
  const bears = useBearStore((state) => state.bears)
  // 获取 action
  const increase = useBearStore((state) => state.increase)

  return (
    <div>
      <p>熊的数量：{bears}</p>
      <button onClick={increase}>增加</button>
    </div>
  )
}
```

### 2.3 获取多个状态

```typescript
// ❌ 会导致任何状态变化都重渲染
const { bears, increase } = useBearStore()

// ✅ 分别选择
const bears = useBearStore((state) => state.bears)
const increase = useBearStore((state) => state.increase)

// ✅ 使用 shallow 比较多个值
import { shallow } from 'zustand/shallow'

const { bears, increase } = useBearStore(
  (state) => ({ bears: state.bears, increase: state.increase }),
  shallow
)
```

---

## 三、Set 函数

### 3.1 基本用法

```typescript
const useStore = create((set) => ({
  count: 0,

  // 直接设置
  setCount: (value) => set({ count: value }),

  // 基于前值更新
  increment: () => set((state) => ({ count: state.count + 1 })),

  // 设置多个字段
  setMultiple: () => set({ count: 0, name: '张三' })
}))
```

### 3.2 替换 vs 合并

```typescript
const useStore = create((set) => ({
  count: 0,
  name: '张三',

  // 合并（默认）
  updateCount: (value) => set({ count: value }),
  // 结果：{ count: value, name: '张三' }

  // 替换（第二个参数为 true）
  replace: () => set({ count: 100 }, true),
  // 结果：{ count: 100 }（name 被删除）
}))
```

---

## 四、Get 函数

### 4.1 获取当前状态

```typescript
const useStore = create((set, get) => ({
  count: 0,
  step: 5,

  // 使用 get 获取当前状态
  increment: () => set((state) => ({ count: state.count + state.step })),

  // 或使用 get
  incrementByStep: () => {
    const { count, step } = get()
    set({ count: count + step })
  }
}))
```

### 4.2 跨 Store 调用

```typescript
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user })
}))

const useCartStore = create((set, get) => ({
  items: [],

  addToCart: (item) => {
    // 获取其他 store 的状态
    const { user } = useAuthStore.getState()

    if (!user) {
      throw new Error('请先登录')
    }

    set((state) => ({ items: [...state.items, item] }))
  }
}))
```

---

## 五、异步操作

### 5.1 异步 Action

```typescript
const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (userId) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`/api/users/${userId}`)
      const user = await response.json()
      set({ user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))
```

### 5.2 组件中使用

```typescript
function UserProfile({ userId }) {
  const { user, loading, error, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser(userId)
  }, [userId])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误：{error}</div>

  return <div>{user?.name}</div>
}
```

---

## 六、TypeScript 支持

### 6.1 类型定义

```typescript
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoStore {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  setFilter: (filter: TodoStore['filter']) => void
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filter: 'all',

  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, {
        id: Date.now(),
        text,
        completed: false
      }]
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    })),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter(todo => todo.id !== id)
    })),

  setFilter: (filter) => set({ filter })
}))
```

---

## 七、持久化

### 7.1 persist 中间件

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null })
    }),
    {
      name: 'auth-storage',  // localStorage key
      // 只持久化部分字段
      partialize: (state) => ({ token: state.token })
    }
  )
)
```

### 7.2 自定义存储

```typescript
const useStore = create(
  persist(
    (set) => ({
      // ...
    }),
    {
      name: 'my-storage',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => sessionStorage.removeItem(name)
      }
    }
  )
)
```

---

## 八、总结

### ✅ 关键知识点

1. **create**：创建 store
2. **set**：更新状态
3. **get**：获取当前状态
4. **选择器**：精确订阅状态
5. **shallow**：浅比较多个值
6. **异步操作**：直接在 action 中处理
7. **TypeScript**：完整类型支持
8. **persist**：状态持久化

### 🔜 下一章

- 下一章：[进阶](/web/react-ecosystem/zustand/02-advanced/)
- 上一级：[Zustand](/web/react-ecosystem/zustand/)
