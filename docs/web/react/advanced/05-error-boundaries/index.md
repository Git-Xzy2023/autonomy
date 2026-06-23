---
title: 错误边界
---

# 错误边界

> 错误边界是 React 组件，用于捕获子组件树的 JavaScript 错误，显示备用 UI。

---

## 一、为什么需要错误边界？

### 1.1 React 错误处理问题

```
┌─────────────────────────────────────────┐
│           React 错误处理问题            │
├─────────────────────────────────────────┤
│                                         │
│  JavaScript 错误 → 整个组件树卸载       │
│                                         │
│  用户看到：白屏                         │
│                                         │
│  错误边界：捕获错误，显示备用 UI        │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 错误边界能捕获的错误

✅ 渲染期间的错误
✅ 生命周期方法中的错误
✅ 子组件树的错误

### 1.3 错误边界不能捕获的错误

❌ 事件处理程序中的错误
❌ 异步代码中的错误
❌ 服务端渲染的错误
❌ 错误边界自身的错误

---

## 二、创建错误边界

### 2.1 类组件错误边界

```typescript
import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // 静态方法：渲染时抛出错误时调用
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // 生命周期方法：捕获错误信息
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('错误边界捕获：', error, errorInfo)
    // 可以上报错误到监控系统
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>出错了</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
```

### 2.2 使用错误边界

```typescript
function App() {
  return (
    <ErrorBoundary fallback={<div>页面出错了</div>}>
      <Header />
      <Main />
      <Footer />
    </ErrorBoundary>
  )
}
```

### 2.3 嵌套错误边界

```typescript
function App() {
  return (
    <ErrorBoundary fallback={<div>整个应用出错了</div>}>
      <Header />
      <ErrorBoundary fallback={<div>主内容出错了</div>}>
        <Main />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  )
}
```

---

## 三、错误边界进阶

### 3.1 自定义 fallback

```typescript
interface ErrorBoundaryProps {
  fallback?: (error: Error, reset: () => void) => ReactNode
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false, error: undefined }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('错误：', error, errorInfo)
    // 上报到错误监控系统
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error)
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.reset)
      }
      return this.props.fallback || <div>出错了</div>
    }
    return this.props.children
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <h2>出错了</h2>
          <p>{error.message}</p>
          <button onClick={reset}>重试</button>
        </div>
      )}
    >
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### 3.2 HOC 形式的错误边界

```typescript
function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}

// 使用
const SafeComponent = withErrorBoundary(MyComponent, <div>出错了</div>)
```

---

## 四、错误上报

### 4.1 集成 Sentry

```typescript
import * as Sentry from '@sentry/react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      contexts: { react: errorInfo }
    })
  }

  render() {
    if (this.state.hasError) {
      return <div>出错了</div>
    }
    return this.props.children
  }
}
```

### 4.2 自定义错误上报

```typescript
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // 上报到自己的错误监控系统
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    })
  }

  render() {
    if (this.state.hasError) {
      return <div>出错了</div>
    }
    return this.props.children
  }
}
```

---

## 五、错误边界使用策略

### 5.1 关键位置使用

```typescript
function App() {
  return (
    // 顶层错误边界
    <ErrorBoundary fallback={<AppError />}>
      <Layout>
        {/* 路由级错误边界 */}
        <ErrorBoundary fallback={<PageError />}>
          <Routes />
        </ErrorBoundary>

        {/* 组件级错误边界 */}
        <ErrorBoundary fallback={<WidgetError />}>
          <Widget />
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  )
}
```

### 5.2 不同粒度的错误边界

```typescript
// 顶层：捕获所有错误
<ErrorBoundary fallback={<FullPageError />}>
  <App />
</ErrorBoundary>

// 页面级：捕获页面错误
<ErrorBoundary fallback={<PageError />}>
  <Page />
</ErrorBoundary>

// 组件级：捕获单个组件错误
<ErrorBoundary fallback={<div>组件出错了</div>}>
  <Chart />
</ErrorBoundary>
```

---

## 六、事件处理错误

错误边界不能捕获事件处理程序中的错误，需要 try/catch：

```typescript
function MyComponent() {
  const handleClick = async () => {
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      // 处理数据
    } catch (error) {
      console.error('事件处理错误：', error)
      // 显示错误提示
      setError(error.message)
    }
  }

  return <button onClick={handleClick}>点击</button>
}
```

---

## 七、React 18 错误处理

### 7.1 错误处理变化

React 18 对错误处理做了调整：

```typescript
// React 18：错误边界不会自动卸载整个树
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // React 18：可以在这里调用 setState
    // 但建议使用 getDerivedStateFromError
  }

  render() {
    if (this.state.hasError) {
      return <div>出错了</div>
    }
    return this.props.children
  }
}
```

### 7.2 React Error Boundary 库

使用 `react-error-boundary` 库简化：

```bash
npm install react-error-boundary
```

```typescript
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div>
          <h2>出错了</h2>
          <p>{error.message}</p>
          <button onClick={resetErrorBoundary}>重试</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('错误：', error, errorInfo)
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  )
}
```

---

## 八、总结

### ✅ 关键知识点

1. **错误边界**：类组件，捕获子组件树错误
2. **getDerivedStateFromError**：渲染时错误，更新 state
3. **componentDidCatch**：捕获错误信息，可上报
4. **不能捕获**：事件处理、异步代码、SSR 错误
5. **使用策略**：顶层、页面级、组件级
6. **错误上报**：集成 Sentry 或自定义上报
7. **事件错误**：使用 try/catch 处理

### 🔜 下一章

- 下一章：[Portals 传送门](/web/react/advanced/06-portals/)
- 上一章：[Render Props](/web/react/advanced/04-render-props/)
- 上一级：[React 进阶特性](/web/react/advanced/)
