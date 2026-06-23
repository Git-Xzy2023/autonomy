---
title: 设计模式在前端的应用
---

# 设计模式在前端的应用

> 设计模式在前端框架和库中无处不在。本章通过实际案例理解设计模式如何应用于 React、Vue 等现代前端框架。

---

## 一、React 中的设计模式

### 1.1 观察者模式 — 状态管理

```typescript
// Redux 的实现原理就是观察者模式
class Store {
  private state: any
  private listeners: Function[] = []

  constructor(private reducer: Function, initialState: any) {
    this.state = initialState
  }

  getState() {
    return this.state
  }

  dispatch(action: any) {
    this.state = this.reducer(this.state, action)
    this.listeners.forEach(listener => listener())
  }

  subscribe(listener: Function) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}

// 使用
const store = new Store(reducer, { count: 0 })
store.subscribe(() => console.log(store.getState()))
store.dispatch({ type: 'INCREMENT' })
```

### 1.2 装饰器模式 — 高阶组件（HOC）

```typescript
// HOC 是典型的装饰器模式
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return class extends React.Component<P, { isAuth: boolean }> {
    state = { isAuth: false }

    componentDidMount() {
      const token = localStorage.getItem('token')
      this.setState({ isAuth: !!token })
    }

    render() {
      if (!this.state.isAuth) {
        return <div>请登录</div>
      }
      return <WrappedComponent {...this.props} />
    }
  }
}

// 使用
const ProtectedPage = withAuth(Dashboard)
```

### 1.3 组合模式 — 组件组合

```typescript
// 复合组件模式（Compound Components）
function Tabs({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>
}

Tabs.Tab = function TabsTab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  return (
    <button
      className={activeIndex === index ? 'active' : ''}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabsPanel({ index, children }) {
  const { activeIndex } = useContext(TabsContext)
  return activeIndex === index ? <div>{children}</div> : null
}

// 使用
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>标签1</Tabs.Tab>
    <Tabs.Tab index={1}>标签2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>内容1</Tabs.Panel>
  <Tabs.Panel index={1}>内容2</Tabs.Panel>
</Tabs>
```

### 1.4 策略模式 — 条件渲染

```typescript
// 根据不同状态渲染不同 UI
const strategies: Record<string, React.FC> = {
  loading: () => <div>加载中...</div>,
  error: () => <div>加载失败</div>,
  empty: () => <div>暂无数据</div>,
  success: ({ data }) => <List items={data} />
}

function DataView({ status, data }: { status: string; data: any[] }) {
  const Component = strategies[status] || strategies.empty
  return <Component data={data} />
}
```

### 1.5 代理模式 — React.memo

```typescript
// React.memo 是代理模式的应用
const ExpensiveComponent = React.memo(({ data }) => {
  console.log('渲染')
  return <div>{JSON.stringify(data)}</div>
}, (prevProps, nextProps) => {
  // 自定义比较函数，控制何时重新渲染
  return prevProps.data.id === nextProps.data.id
})

// useMemo / useCallback 也是代理模式
function Component({ items }) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.id - b.id),
    [items]
  )
  return <List items={sortedItems} />
}
```

---

## 二、Vue 中的设计模式

### 2.1 观察者模式 — 响应式系统

```typescript
// Vue 3 响应式原理
let activeEffect: Function | null = null

function effect(fn: Function) {
  activeEffect = fn
  fn()
  activeEffect = null
}

function reactive(target: object) {
  const deps = new Map<string, Set<Function>>()

  return new Proxy(target, {
    get(obj, key: string) {
      if (activeEffect) {
        if (!deps.has(key)) deps.set(key, new Set())
        deps.get(key)!.add(activeEffect)
      }
      return obj[key]
    },
    set(obj, key: string, value) {
      obj[key] = value
      deps.get(key)?.forEach(effect => effect())
      return true
    }
  })
}

// 使用
const state = reactive({ count: 0 })
effect(() => console.log('count:', state.count))
state.count++  // 输出: count: 1
```

### 2.2 组合模式 — 组件树

```vue
<!-- Vue 组件本身就是组合模式 -->
<template>
  <div class="app">
    <Header>
      <Logo />
    </Header>
    <Main>
      <Sidebar />
      <Content>
        <Article />
      </Content>
    </Main>
  </div>
</template>
```

### 2.3 工厂模式 — createApp

```typescript
// Vue 3 的 createApp 是工厂模式
import { createApp, h } from 'vue'

const app = createApp({
  data() {
    return { count: 0 }
  },
  render() {
    return h('div', this.count)
  }
})

app.mount('#app')
```

---

## 三、常见库中的设计模式

### 3.1 Axios — 适配器模式

```typescript
// Axios 使用适配器模式适配不同环境
interface Adapter {
  request(config: AxiosRequestConfig): AxiosPromise
}

class XHRAdapter implements Adapter {
  request(config: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      // ... XMLHttpRequest 实现
    })
  }
}

class HTTPAdapter implements Adapter {
  request(config: AxiosRequestConfig) {
    // Node.js http 模块实现
  }
}

// 根据环境选择适配器
function getDefaultAdapter() {
  if (typeof XMLHttpRequest !== 'undefined') {
    return new XHRAdapter()
  } else if (typeof process !== 'undefined') {
    return new HTTPAdapter()
  }
}
```

### 3.2 Express — 责任链模式

```typescript
// Express 中间件就是责任链模式
const express = require('express')
const app = express()

// 每个中间件处理请求后调用 next() 传递给下一个
app.use((req, res, next) => {
  console.log('1. 日志记录')
  next()
})

app.use((req, res, next) => {
  console.log('2. 身份验证')
  if (req.headers.authorization) {
    next()
  } else {
    res.status(401).send('未授权')
  }
})

app.use((req, res) => {
  console.log('3. 处理请求')
  res.send('Hello')
})
```

### 3.3 jQuery — 外观模式

```typescript
// jQuery 是外观模式的典型应用
// 封装了复杂的 DOM 操作，提供简洁的 API
$('#button').on('click', function() {
  // 内部处理了不同浏览器的兼容性
})

// $.ajax 封装了 XMLHttpRequest
$.ajax({
  url: '/api/users',
  method: 'GET',
  success: function(data) { console.log(data) }
})
```

### 3.4 Redux — 中介者模式

```typescript
// Redux Store 作为中介者，协调各组件通信
const store = createStore(reducer)

// 组件 A 发送消息
store.dispatch({ type: 'ADD_TODO', text: '学习' })

// 组件 B 接收更新
store.subscribe(() => {
  const state = store.getState()
  // 更新 UI
})
```

---

## 四、实际项目中的模式应用

### 4.1 状态管理方案选择

```
┌─────────────────────────────────────────┐
│        状态管理方案选择                  │
├─────────────────────────────────────────┤
│                                         │
│  组件内部状态                            │
│  → useState / useReducer               │
│                                         │
│  跨组件共享（少量）                      │
│  → Context + useReducer                │
│                                         │
│  跨组件共享（大量/复杂）                 │
│  → Redux（中介者模式）                  │
│  → Zustand（观察者模式）                │
│                                         │
│  服务端状态                              │
│  → React Query（观察者模式）            │
│  → SWR                                 │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 组件设计原则

```typescript
// 单一职责原则：一个组件只做一件事
// ❌ 不好：组件做了太多事
function UserPage() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchUser().then(setUser)
    fetchPosts().then(setPosts)
  }, [])

  // 渲染用户信息 + 文章列表 + 评论
}

// ✅ 好：拆分为多个组件
function UserPage() {
  return (
    <>
      <UserProfile />
      <UserPosts />
      <UserComments />
    </>
  )
}

// 开闭原则：通过组合扩展，而非修改
// ❌ 不好：修改原有组件
function Button({ label, variant, size, icon, loading }) {
  // 越来越多的 props
}

// ✅ 好：通过组合扩展
const IconButton = withIcon(Button)
const LoadingButton = withLoading(Button)
```

### 4.3 错误处理模式

```typescript
// 责任链模式处理错误
class ErrorHandler {
  private next: ErrorHandler | null = null

  setNext(handler: ErrorHandler): ErrorHandler {
    this.next = handler
    return handler
  }

  handle(error: Error): boolean {
    if (this.next) {
      return this.next.handle(error)
    }
    return false
  }
}

class NetworkErrorHandler extends ErrorHandler {
  handle(error: Error): boolean {
    if (error instanceof NetworkError) {
      console.log('网络错误，重试中...')
      return true
    }
    return super.handle(error)
  }
}

class AuthErrorHandler extends ErrorHandler {
  handle(error: Error): boolean {
    if (error instanceof AuthError) {
      console.log('认证失败，跳转登录')
      return true
    }
    return super.handle(error)
  }
}

// 使用
const handler = new NetworkErrorHandler()
handler.setNext(new AuthErrorHandler())
handler.handle(error)
```

---

## 五、总结

### ✅ 设计模式在前端的价值

1. **React**：HOC（装饰器）、Context（观察者）、Compound Components（组合）
2. **Vue**：响应式（观察者 + 代理）、组件树（组合）、createApp（工厂）
3. **Redux**：Store（中介者）、subscribe（观察者）
4. **Express**：中间件（责任链）
5. **Axios**：适配器模式
6. **jQuery**：外观模式

### ⚠️ 注意事项

- **不要过度设计**：简单问题不要用复杂模式
- **理解意图**：模式是解决问题的工具，不是目的
- **结合实际**：根据项目需求选择合适的模式
- **持续重构**：随着需求变化，适时引入模式

### 🔚 结束

- 上一章：[行为型模式](/web/architecture/design-patterns/03-behavioral/)
- 上一级：[设计模式](/web/architecture/design-patterns/)
- 下一模块：[架构模式](/web/architecture/architecture-patterns/)
