---
title: Suspense 与懒加载
---

# Suspense 与懒加载

> Suspense 让组件在渲染前等待某些操作完成，配合 React.lazy 实现代码分割。

---

## 一、Suspense 概述

### 1.1 什么是 Suspense？

```
┌─────────────────────────────────────────┐
│              Suspense                   │
├─────────────────────────────────────────┤
│                                         │
│  Suspense：等待组件加载完成             │
│                                         │
│  <Suspense fallback={<Loading />}>     │
│    <LazyComponent />                   │
│  </Suspense>                            │
│                                         │
│  作用：                                  │
│  ├── 代码分割（React.lazy）             │
│  ├── 数据获取（React 18+）              │
│  └── 流式 SSR（Next.js）                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、React.lazy 代码分割

### 2.1 基本用法

```typescript
import { lazy, Suspense } from 'react'

// 懒加载组件
const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

### 2.2 路由级分割

```typescript
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>页面加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

### 2.3 嵌套 Suspense

```typescript
function App() {
  return (
    <Suspense fallback={<div>页面加载中...</div>}>
      <Header />
      <main>
        <Suspense fallback={<div>内容加载中...</div>}>
          <Content />
        </Suspense>
      </main>
      <Footer />
    </Suspense>
  )
}
```

---

## 三、Suspense 加载状态

### 3.1 自定义 fallback

```typescript
function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <p>加载中...</p>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  )
}
```

### 3.2 骨架屏

```typescript
function Skeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  )
}

function Article() {
  return (
    <div>
      <h1>文章标题</h1>
      <p>文章内容...</p>
    </div>
  )
}

const LazyArticle = lazy(() => import('./Article'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <LazyArticle />
    </Suspense>
  )
}
```

---

## 四、React 18 Suspense 数据获取

### 4.1 使用 Suspense 获取数据

React 18 支持在 Suspense 中等待数据获取：

```typescript
// 简化的资源包装器
function wrapPromise<T>(promise: Promise<T>) {
  let status = 'pending'
  let result: T
  let error: Error

  const suspender = promise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      error = e
    }
  )

  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'error') throw error
      return result
    }
  }
}

// 使用
function fetchUser(id: number) {
  return wrapPromise(
    fetch(`/api/users/${id}`).then(res => res.json())
  )
}

function UserProfile({ userId }) {
  const user = fetchUser(userId).read()  // 会抛出 promise，被 Suspense 捕获

  return <div>{user.name}</div>
}

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <UserProfile userId={1} />
    </Suspense>
  )
}
```

### 4.2 多个 Suspense

```typescript
function App() {
  return (
    <div>
      <Suspense fallback={<div>用户加载中...</div>}>
        <UserProfile userId={1} />
      </Suspense>

      <Suspense fallback={<div>文章加载中...</div>}>
        <UserPosts userId={1} />
      </Suspense>
    </div>
  )
}
```

### 4.3 嵌套 Suspense

```typescript
function App() {
  return (
    <Suspense fallback={<div>整体加载中...</div>}>
      <Header />
      <Suspense fallback={<div>内容加载中...</div>}>
        <Content />
      </Suspense>
    </Suspense>
  )
}
```

---

## 五、Error Boundary 与 Suspense

### 5.1 捕获懒加载错误

```typescript
import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('懒加载失败：', error)
  }

  render() {
    if (this.state.hasError) {
      return <div>组件加载失败</div>
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>加载中...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

### 5.2 重试机制

```typescript
function withRetry(fn, retries = 3) {
  return new Promise((resolve, reject) => {
    let attempt = 0

    const tryLoad = () => {
      fn()
        .then(resolve)
        .catch((err) => {
          attempt++
          if (attempt >= retries) {
            reject(err)
          } else {
            setTimeout(tryLoad, 1000 * attempt)
          }
        })
    }

    tryLoad()
  })
}

const LazyComponent = lazy(() =>
  withRetry(() => import('./LazyComponent'))
)
```

---

## 六、Suspense List（实验性）

> ⚠️ SuspenseList 仍是实验性特性，API 可能变化。

```typescript
import { SuspenseList, Suspense } from 'react'

function App() {
  return (
    <SuspenseList revealOrder="forwards" tail="collapsed">
      <Suspense fallback={<div>用户加载中...</div>}>
        <UserProfile />
      </Suspense>
      <Suspense fallback={<div>文章加载中...</div>}>
        <UserPosts />
      </Suspense>
      <Suspense fallback={<div>评论加载中...</div>}>
        <Comments />
      </Suspense>
    </SuspenseList>
  )
}
```

---

## 七、并发特性（React 18）

### 7.1 useTransition

将低优先级更新标记为过渡：

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

### 7.2 useDeferredValue

延迟更新某个值：

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

---

## 八、最佳实践

### 8.1 合理拆分代码

```typescript
// ✅ 路由级拆分
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

// ✅ 大组件拆分
const HeavyChart = lazy(() => import('./components/HeavyChart'))

// ❌ 不要过度拆分小组件
const Button = lazy(() => import('./Button'))  // 不必要
```

### 8.2 预加载

```typescript
// 鼠标悬停时预加载
const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  const preload = () => {
    // 触发懒加载
    import('./LazyComponent')
  }

  return (
    <div>
      <button onMouseEnter={preload} onClick={...}>
        显示组件
      </button>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </div>
  )
}
```

### 8.3 流式 SSR

```typescript
// Next.js 中的流式 SSR
import { Suspense } from 'react'

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />  {/* 不阻塞其他内容 */}
      </Suspense>
      <Footer />
    </div>
  )
}
```

---

## 九、总结

### ✅ 关键知识点

1. **React.lazy**：懒加载组件，实现代码分割
2. **Suspense**：等待组件加载，显示 fallback
3. **路由级分割**：按页面拆分代码
4. **嵌套 Suspense**：不同部分独立加载
5. **数据获取**：React 18 支持数据获取的 Suspense
6. **Error Boundary**：捕获懒加载错误
7. **并发特性**：useTransition、useDeferredValue

### 🔜 下一章

- 下一章：[虚拟 DOM 与 Diff](/web/react/performance/01-virtual-dom/)
- 上一章：[Portals 传送门](/web/react/advanced/06-portals/)
- 上一级：[React 进阶特性](/web/react/advanced/)
