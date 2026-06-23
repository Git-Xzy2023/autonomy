---
title: React 并发特性
---

# React 并发特性

> React 18 引入的并发特性，包括 Concurrent Rendering、useTransition、useDeferredValue 等。

---

## 一、并发渲染概述

### 1.1 什么是并发渲染？

```
┌─────────────────────────────────────────┐
│              并发渲染                   │
├─────────────────────────────────────────┤
│                                         │
│  传统渲染（同步）：                      │
│  ├── 一次性完成所有渲染                  │
│  ├── 阻塞主线程                         │
│  └── 用户输入可能卡顿                   │
│                                         │
│  并发渲染（可中断）：                    │
│  ├── 可中断、可恢复                     │
│  ├── 优先级调度                         │
│  ├── 不阻塞主线程                       │
│  └── 保持响应性                         │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 React 18 新特性

| 特性                | 作用                       |
| ------------------- | -------------------------- |
| **Concurrent Rendering** | 并发渲染              |
| **Automatic Batching**   | 自动批处理            |
| **Transitions**          | 过渡更新              |
| **Suspense**             | 数据获取              |
| **useDeferredValue**     | 延迟值                |
| **useSyncExternalStore** | 同步外部存储          |

---

## 二、自动批处理

### 2.1 React 17 的批处理

```typescript
// React 17：只在事件处理函数中批处理
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const handleClick = () => {
    // ✅ 批处理：一次渲染
    setCount(1)
    setName('张三')
  }

  const handleAsync = async () => {
    await fetch('/api')
    // ❌ 不批处理：两次渲染
    setCount(1)
    setName('张三')
  }

  return <button onClick={handleClick}>点击</button>
}
```

### 2.2 React 18 自动批处理

```typescript
// React 18：所有更新都自动批处理
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const handleAsync = async () => {
    await fetch('/api')
    // ✅ React 18：自动批处理，一次渲染
    setCount(1)
    setName('张三')
  }

  const handleTimeout = () => {
    setTimeout(() => {
      // ✅ React 18：自动批处理
      setCount(1)
      setName('张三')
    }, 1000)
  }
}
```

### 2.3 flushSync 强制同步

```typescript
import { flushSync } from 'react-dom'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    // 强制立即更新
    flushSync(() => {
      setCount(1)
    })
    // 此时 DOM 已更新

    flushSync(() => {
      setCount(2)
    })
    // 再次立即更新
  }
}
```

---

## 三、useTransition

### 3.1 基本用法

```typescript
import { useState, useTransition } from 'react'

function App() {
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const handleChange = (e) => {
    setInput(e.target.value)  // 高优先级：立即更新

    startTransition(() => {
      // 低优先级：可以被打断
      const filtered = heavyFilter(e.target.value)
      setResults(filtered)
    })
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <div>搜索中...</div>}
      <ul>
        {results.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  )
}
```

### 3.2 使用场景

```typescript
// 场景 1：搜索过滤
function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e) => {
    setQuery(e.target.value)  // 高优先级
    startTransition(() => {
      setResults(filterItems(e.target.value))  // 低优先级
    })
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending ? <Spinner /> : <Results items={results} />}
    </div>
  )
}

// 场景 2：标签切换
function Tabs() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  const handleTabChange = (newTab) => {
    startTransition(() => {
      setTab(newTab)
    })
  }

  return (
    <div>
      <button onClick={() => handleTabChange('home')}>首页</button>
      <button onClick={() => handleTabChange('about')}>关于</button>
      {isPending && <Spinner />}
      <TabContent tab={tab} />
    </div>
  )
}
```

### 3.3 useTransition 注意事项

```typescript
// ❌ 不要在高优先级更新中使用
startTransition(() => {
  setInput(value)  // 输入框应该立即响应
})

// ✅ 正确：将低优先级更新放入 transition
setInput(value)  // 高优先级
startTransition(() => {
  setResults(filter(value))  // 低优先级
})
```

---

## 四、useDeferredValue

### 4.1 基本用法

```typescript
import { useState, useDeferredValue, useMemo } from 'react'

function App() {
  const [input, setInput] = useState('')
  const deferredInput = useDeferredValue(input)

  const results = useMemo(() => {
    return heavyFilter(deferredInput)
  }, [deferredInput])

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <ul>
        {results.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  )
}
```

### 4.2 useTransition vs useDeferredValue

```typescript
// useTransition：控制状态更新的优先级
const [isPending, startTransition] = useTransition()

const handleChange = (e) => {
  setInput(e.target.value)
  startTransition(() => {
    setResults(filter(e.target.value))
  })
}

// useDeferredValue：延迟某个值的更新
const deferredInput = useDeferredValue(input)
const results = useMemo(() => filter(deferredInput), [deferredInput])
```

### 4.3 使用场景

```typescript
// 场景：搜索框
function SearchInput() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const isStale = search !== deferredSearch

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ opacity: isStale ? 0.7 : 1 }}
      />
      <Results query={deferredSearch} />
    </div>
  )
}
```

---

## 五、Suspense 数据获取

### 5.1 基本用法

```typescript
import { Suspense } from 'react'

// 数据获取包装器
function wrapPromise<T>(promise: Promise<T>) {
  let status = 'pending'
  let result: T
  let error: Error

  const suspender = promise.then(
    (r) => { status = 'success'; result = r },
    (e) => { status = 'error'; error = e }
  )

  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'error') throw error
      return result
    }
  }
}

// 数据获取组件
function UserProfile({ userId }) {
  const user = fetchUser(userId).read()
  return <div>{user.name}</div>
}

// 使用 Suspense
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId={1} />
    </Suspense>
  )
}
```

### 5.2 嵌套 Suspense

```typescript
function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Header />
      <Suspense fallback={<ContentLoading />}>
        <Content />
      </Suspense>
      <Suspense fallback={<CommentsLoading />}>
        <Comments />
      </Suspense>
    </Suspense>
  )
}
```

---

## 六、useSyncExternalStore

### 6.1 基本用法

用于订阅外部数据源（如 Redux、Zustand）：

```typescript
import { useSyncExternalStore } from 'react'

// 订阅外部 store
function useStore<T>(store: {
  subscribe: (callback: () => void) => () => void
  getState: () => T
}): T {
  return useSyncExternalStore(
    store.subscribe,
    store.getState
  )
}

// 使用
function App() {
  const state = useStore(myStore)
  return <div>{state.count}</div>
}
```

### 6.2 实现简单 Store

```typescript
function createStore<T>(initialState: T) {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (newState: T | ((prev: T) => T)) => {
      state = typeof newState === 'function'
        ? (newState as (prev: T) => T)(state)
        : newState
      listeners.forEach(l => l())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

const store = createStore({ count: 0 })

function Counter() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getState
  )

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => store.setState(s => ({ count: s.count + 1 }))}>
        +1
      </button>
    </div>
  )
}
```

---

## 七、并发特性最佳实践

### 7.1 何时使用 useTransition

```typescript
// ✅ 适合：昂贵的状态更新
startTransition(() => {
  setResults(filter(data))  // 大量数据过滤
})

// ✅ 适合：页面切换
startTransition(() => {
  setCurrentPage('about')
})

// ❌ 不适合：输入框值更新
startTransition(() => {
  setInputValue(value)  // 输入应该立即响应
})
```

### 7.2 何时使用 useDeferredValue

```typescript
// ✅ 适合：依赖某个值的昂贵计算
const deferredQuery = useDeferredValue(query)
const results = useMemo(() => search(deferredQuery), [deferredQuery])

// ✅ 适合：无法控制状态更新的场景
// 比如接收来自 props 的值
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => search(deferredQuery), [deferredQuery])
  return <List items={results} />
}
```

### 7.3 性能检测

```typescript
// 使用 Profiler 检测并发渲染效果
<Profiler id="search" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase}: ${actualDuration}ms`)
}}>
  <SearchPage />
</Profiler>
```

---

## 八、总结

### ✅ 关键知识点

1. **并发渲染**：可中断、可恢复、优先级调度
2. **自动批处理**：React 18 所有更新都批处理
3. **useTransition**：标记低优先级更新
4. **useDeferredValue**：延迟值更新
5. **Suspense**：数据获取和代码分割
6. **useSyncExternalStore**：订阅外部数据源
7. **flushSync**：强制同步更新（谨慎使用）

### 🔜 下一章

- 下一章：[性能优化实践](/web/react/performance/04-optimization/)
- 上一章：[memo 与性能优化](/web/react/performance/02-memo/)
- 上一级：[React 性能优化](/web/react/performance/)
