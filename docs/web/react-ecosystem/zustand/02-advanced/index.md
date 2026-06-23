---
title: Zustand 进阶
---

# Zustand 进阶

> Zustand 的高级用法和最佳实践。

---

## 一、中间件

### 1.1 devtools 中间件

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    {
      name: 'counter-store',  // Redux DevTools 中的名称
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)
```

### 1.2 immer 中间件

```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  immer((set) => ({
    user: {
      name: '张三',
      address: {
        city: '北京'
      }
    },

    // 可以直接修改（Immer 处理不可变性）
    updateCity: (city) =>
      set((state) => {
        state.user.address.city = city
      }),

    updateName: (name) =>
      set((state) => {
        state.user.name = name
      })
  }))
)
```

### 1.3 组合中间件

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 }))
      }),
      { name: 'counter' }
    ),
    { name: 'counter-store' }
  )
)
```

---

## 二、Slice 模式

### 2.1 拆分 Store

```typescript
// slices/counterSlice.ts
export const createCounterSlice = (set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
})

// slices/userSlice.ts
export const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
})

// store.ts
import { create } from 'zustand'
import { createCounterSlice } from './slices/counterSlice'
import { createUserSlice } from './slices/userSlice'

export const useStore = create((...a) => ({
  ...createCounterSlice(...a),
  ...createUserSlice(...a)
}))
```

### 2.2 使用

```typescript
function App() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)
  const user = useStore((state) => state.user)

  // ...
}
```

---

## 三、订阅

### 3.1 订阅状态变化

```typescript
// 订阅整个 store
const unsubscribe = useStore.subscribe((state) => {
  console.log('状态变化：', state)
})

// 取消订阅
unsubscribe()

// 订阅特定字段
const unsubscribe = useStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log(`count: ${prevCount} → ${count}`)
  }
)
```

### 3.2 使用 selector 订阅

```typescript
import { subscribeWithSelector } from 'zustand/middleware'

const useStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }))
)

// 订阅特定条件
useStore.subscribe(
  (state) => state.count,
  (count) => {
    if (count > 10) {
      console.log('count 超过 10')
    }
  },
  {
    equalityFn: (a, b) => a === b,
    fireImmediately: false
  }
)
```

---

## 四、在组件外使用

### 4.1 获取状态

```typescript
// 在非组件代码中使用
import { useStore } from './store'

// 获取当前状态
const currentState = useStore.getState()
console.log(currentState.count)

// 订阅
const unsubscribe = useStore.subscribe((state) => {
  console.log(state)
})

// 取消订阅
unsubscribe()
```

### 4.2 在工具函数中使用

```typescript
// utils/api.ts
import { useAuthStore } from '../store'

export async function fetchWithAuth(url: string) {
  const token = useAuthStore.getState().token

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.json()
}
```

---

## 五、性能优化

### 5.1 精确选择

```typescript
// ❌ 选择整个 state
const state = useStore()

// ✅ 只选择需要的字段
const count = useStore((state) => state.count)
const name = useStore((state) => state.name)

// ✅ 使用 useShallow 选择多个字段
import { useShallow } from 'zustand/react/shallow'

const { count, name } = useStore(
  useShallow((state) => ({ count: state.count, name: state.name }))
)
```

### 5.2 计算值

```typescript
const useStore = create((set) => ({
  items: [1, 2, 3, 4, 5],

  // 不存储计算值，使用时计算
  // ❌ sum: 15
}))

// 在组件中计算
function Sum() {
  const items = useStore((state) => state.items)
  const sum = items.reduce((a, b) => a + b, 0)

  return <div>{sum}</div>
}

// 或使用 selector
function Sum() {
  const sum = useStore((state) =>
    state.items.reduce((a, b) => a + b, 0)
  )

  return <div>{sum}</div>
}
```

---

## 六、测试

### 6.1 测试 Store

```typescript
import { useStore } from './store'

beforeEach(() => {
  // 重置 store
  useStore.setState({ count: 0 })
})

test('increment', () => {
  useStore.getState().increment()
  expect(useStore.getState().count).toBe(1)
})

test('decrement', () => {
  useStore.getState().decrement()
  expect(useStore.getState().count).toBe(-1)
})
```

### 6.2 测试组件

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { useStore } from './store'
import Counter from './Counter'

beforeEach(() => {
  useStore.setState({ count: 0 })
})

test('Counter 组件', () => {
  render(<Counter />)

  expect(screen.getByText('0')).toBeInTheDocument()

  fireEvent.click(screen.getByText('+'))
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

---

## 七、Zustand vs Redux

### 7.1 对比

```
┌─────────────────────────────────────────┐
│         Zustand vs Redux               │
├─────────────────────────────────────────┤
│                                         │
│  Zustand                                │
│  ├── 更简单                             │
│  ├── 无样板代码                         │
│  ├── 无 Provider                        │
│  ├── 体积小                             │
│  └── 适合中小型项目                     │
│                                         │
│  Redux                                  │
│  ├── 更成熟                             │
│  ├── 生态丰富                           │
│  ├── DevTools 强大                     │
│  ├── 中间件丰富                         │
│  └── 适合大型项目                       │
│                                         │
└─────────────────────────────────────────┘
```

### 7.2 选择建议

- **小型项目**：Zustand
- **中型项目**：Zustand 或 Redux Toolkit
- **大型项目**：Redux Toolkit
- **需要时间旅行**：Redux Toolkit
- **追求简单**：Zustand

---

## 八、总结

### ✅ 关键知识点

1. **中间件**：devtools、immer、persist
2. **Slice 模式**：拆分大型 store
3. **订阅**：subscribe、subscribeWithSelector
4. **组件外使用**：getState、setState
5. **性能优化**：精确选择、useShallow
6. **测试**：setState 重置、getState 测试
7. **选择**：根据项目规模选择 Zustand 或 Redux

### 🔜 下一章

- 下一章：[React Query 基础](/web/react-ecosystem/react-query/01-basics/)
- 上一章：[基础](/web/react-ecosystem/zustand/01-basics/)
- 上一级：[Zustand](/web/react-ecosystem/zustand/)
