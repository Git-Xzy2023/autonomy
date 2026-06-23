---
title: 自定义 Hooks
---

# 自定义 Hooks

> 自定义 Hooks 是将组件逻辑提取为可复用函数的方式，名称以 `use` 开头。

---

## 一、为什么需要自定义 Hooks？

### 1.1 逻辑复用问题

```
┌─────────────────────────────────────────┐
│           逻辑复用方式对比               │
├─────────────────────────────────────────┤
│                                         │
│  HOC（高阶组件）                        │
│  ├── 嵌套地狱                           │
│  ├── 难以理解数据来源                   │
│  └── 命名冲突                           │
│                                         │
│  Render Props                           │
│  ├── 嵌套地狱                           │
│  └── 难以在回调中使用                   │
│                                         │
│  自定义 Hooks ✅                        │
│  ├── 无嵌套                             │
│  ├── 清晰的数据来源                     │
│  └── 灵活组合                           │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 自定义 Hook 规则

1. **命名以 `use` 开头**：如 `useFetch`、`useLocalStorage`
2. **只能在函数组件或自定义 Hook 中调用**
3. **顶层调用**：不要在循环、条件中调用

---

## 二、第一个自定义 Hook

### 2.1 提取前

```typescript
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `计数：${count}`
  }, [count])

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
```

### 2.2 提取后

```typescript
// 自定义 Hook
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

// 使用
function Counter() {
  const [count, setCount] = useState(0)
  useDocumentTitle(`计数：${count}`)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
```

---

## 三、常用自定义 Hooks

### 3.1 useLocalStorage

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('保存到 localStorage 失败', err)
    }
  }, [key, value])

  return [value, setValue] as const
}

// 使用
function App() {
  const [name, setName] = useLocalStorage('name', '')
  const [settings, setSettings] = useLocalStorage('settings', {
    theme: 'light',
    language: 'zh'
  })

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}>
        切换主题
      </button>
    </div>
  )
}
```

### 3.2 useFetch

```typescript
interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useFetch<T>(url: string, options?: RequestInit): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null })

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err as Error })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [url])

  return state
}

// 使用
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch<User>(
    `/api/users/${userId}`
  )

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误：{error.message}</div>
  return <div>{user.name}</div>
}
```

### 3.3 useDebounce

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// 使用
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
      searchAPI(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  )
}
```

### 3.4 useWindowSize

```typescript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// 使用
function App() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>窗口宽度：{width}</p>
      <p>窗口高度：{height}</p>
      {width < 768 && <p>移动端视图</p>}
    </div>
  )
}
```

### 3.5 usePrevious

```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  // 返回的是更新前的值
  return ref.current
}

// 使用
function App() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>当前：{count}</p>
      <p>上一次：{previousCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
```

### 3.6 useToggle

```typescript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse, setValue }
}

// 使用
function App() {
  const { value: isOpen, toggle, setTrue, setFalse } = useToggle(false)

  return (
    <div>
      <button onClick={toggle}>切换</button>
      <button onClick={setTrue}>打开</button>
      <button onClick={setFalse}>关闭</button>
      {isOpen && <Modal />}
    </div>
  )
}
```

### 3.7 useInterval

```typescript
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // 保存最新回调
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // 设置定时器
  useEffect(() => {
    if (delay === null) return

    const timer = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => clearInterval(timer)
  }, [delay])
}

// 使用
function App() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useInterval(() => {
    setCount(c => c + 1)
  }, isRunning ? 1000 : null)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '暂停' : '开始'}
      </button>
    </div>
  )
}
```

### 3.8 useEventListener

```typescript
function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: HTMLElement | Window = window
) {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const eventListener = (event: Event) => {
      savedHandler.current(event)
    }

    element.addEventListener(eventName, eventListener)
    return () => element.removeEventListener(eventName, eventListener)
  }, [eventName, element])
}

// 使用
function App() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEventListener('mousemove', (e: MouseEvent) => {
    setCoords({ x: e.clientX, y: e.clientY })
  })

  return <div>{coords.x}, {coords.y}</div>
}
```

---

## 四、组合多个 Hooks

```typescript
function useUser(userId: string) {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`)
  const prevUser = usePrevious(user)

  useEffect(() => {
    if (user && (!prevUser || prevUser.id !== user.id)) {
      console.log('用户切换', user.name)
    }
  }, [user, prevUser])

  return { user, loading, error }
}

function useUserPosts(userId: string) {
  const { data: posts, loading } = useFetch<Post[]>(`/api/users/${userId}/posts`)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  return { posts, loading, selectedPost, setSelectedPost }
}

// 组合使用
function UserPage({ userId }) {
  const { user, loading: userLoading } = useUser(userId)
  const { posts, loading: postsLoading } = useUserPosts(userId)

  if (userLoading) return <div>加载用户...</div>

  return (
    <div>
      <h1>{user.name}</h1>
      {postsLoading ? (
        <div>加载文章...</div>
      ) : (
        <ul>
          {posts.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
      )}
    </div>
  )
}
```

---

## 五、自定义 Hooks 最佳实践

### 5.1 命名规范

```typescript
// ✅ 以 use 开头，名称描述功能
useFetch          // 数据获取
useLocalStorage   // 本地存储
useDebounce       // 防抖
useWindowSize     // 窗口大小

// ❌ 错误命名
fetchData         // 没有 use 前缀
useGetData        // 冗余
```

### 5.2 返回值

```typescript
// 方式 1：返回数组（类似 useState）
function useToggle() {
  const [value, setValue] = useState(false)
  const toggle = () => setValue(v => !v)
  return [value, toggle] as const
}

// 方式 2：返回对象（多个值时更清晰）
function useFetch(url) {
  // ...
  return { data, loading, error, refetch }
}

// 方式 3：返回函数
function useLocalStorage(key) {
  const get = () => JSON.parse(localStorage.getItem(key))
  const set = (value) => localStorage.setItem(key, JSON.stringify(value))
  return { get, set }
}
```

### 5.3 参数设计

```typescript
// ✅ 支持可选参数
function useFetch(url: string, options?: {
  method?: string
  headers?: Record<string, string>
  body?: string
}) {
  // ...
}

// ✅ 使用对象参数便于扩展
function usePagination(options: {
  initialPage?: number
  pageSize?: number
  total?: number
}) {
  const { initialPage = 1, pageSize = 10, total = 0 } = options
  // ...
}
```

### 5.4 类型定义

```typescript
// 为自定义 Hook 添加完整类型
interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
  // ...
}
```

---

## 六、Hooks 使用规则

### 6.1 只在顶层调用

```typescript
function App() {
  // ✅ 正确：顶层调用
  const [count, setCount] = useState(0)

  // ❌ 错误：条件中调用
  if (count > 0) {
    const [name, setName] = useState('')  // 违反规则
  }

  // ❌ 错误：循环中调用
  for (let i = 0; i < 3; i++) {
    useEffect(() => {})  // 违反规则
  }

  // ❌ 错误：嵌套函数中调用
  const handleClick = () => {
    useState(0)  // 违反规则
  }
}
```

### 6.2 ESLint 插件

使用 `eslint-plugin-react-hooks` 检查 Hooks 规则：

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 七、总结

### ✅ 关键知识点

1. **自定义 Hook**：以 `use` 开头的函数，复用逻辑
2. **常用 Hooks**：useLocalStorage、useFetch、useDebounce、useToggle 等
3. **组合 Hooks**：多个自定义 Hook 可以组合使用
4. **命名规范**：以 `use` 开头，名称描述功能
5. **返回值**：数组或对象，根据场景选择
6. **使用规则**：只在顶层调用，不要在条件/循环中调用

### 🔜 下一章

- 下一章：[Context API 深入](/web/react/advanced/01-context/)
- 上一章：[useReducer 复杂状态](/web/react/hooks/06-usereducer/)
- 上一级：[Hooks](/web/react/hooks/)
