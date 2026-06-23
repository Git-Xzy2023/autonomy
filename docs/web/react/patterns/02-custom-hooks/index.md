---
title: 自定义 Hook 模式
---

# 自定义 Hook 模式

> 自定义 Hook 是 React 中复用状态逻辑的最佳方式。

---

## 一、自定义 Hook 设计原则

### 1.1 原则

```
┌─────────────────────────────────────────┐
│           自定义 Hook 设计原则          │
├─────────────────────────────────────────┤
│                                         │
│  1. 单一职责                            │
│     每个 Hook 只做一件事                │
│                                         │
│  2. 可组合                              │
│     Hook 可以调用其他 Hook              │
│                                         │
│  3. 返回值清晰                          │
│     数组或对象                          │
│                                         │
│  4. 命名规范                            │
│     以 use 开头                         │
│                                         │
│  5. 类型完整                            │
│     完整的 TypeScript 类型              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、常用 Hook 模式

### 2.1 状态管理 Hook

```typescript
// useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse, setValue }
}

// useCounter
function useCounter(initialValue = 0, { min, max }: { min?: number; max?: number } = {}) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount(c => {
      const next = c + 1
      if (max !== undefined && next > max) return c
      return next
    })
  }, [max])

  const decrement = useCallback(() => {
    setCount(c => {
      const next = c - 1
      if (min !== undefined && next < min) return c
      return next
    })
  }, [min])

  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return { count, increment, decrement, reset, setCount }
}
```

### 2.2 副作用 Hook

```typescript
// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// useThrottle
function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRun = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()
    if (now - lastRun.current >= delay) {
      setThrottledValue(value)
      lastRun.current = now
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }, delay - (now - lastRun.current))
      return () => clearTimeout(timer)
    }
  }, [value, delay])

  return throttledValue
}

// useInterval
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
```

### 2.3 DOM 相关 Hook

```typescript
// useClickOutside
function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// useWindowSize
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

// useScrollPosition
function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return position
}
```

### 2.4 数据获取 Hook

```typescript
// useFetch
interface UseFetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
  enabled?: boolean
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { enabled = true, ...fetchOptions } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const [refetchIndex, setRefetchIndex] = useState(0)

  const refetch = useCallback(() => {
    setRefetchIndex(i => i + 1)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let isMounted = true
    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()
        if (isMounted) {
          setData(json)
          setError(null)
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err as Error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [url, refetchIndex, enabled])

  return { data, loading, error, refetch }
}
```

### 2.5 持久化 Hook

```typescript
// useLocalStorage
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
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
      console.error('localStorage 保存失败', err)
    }
  }, [key, value])

  return [value, setValue]
}

// useSessionStorage
function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

---

## 三、Hook 组合

### 3.1 组合多个 Hook

```typescript
// 组合 useFetch 和 useLocalStorage
function useCachedFetch<T>(url: string, cacheKey: string) {
  const [cachedData, setCachedData] = useLocalStorage<T | null>(cacheKey, null)
  const { data, loading, error, refetch } = useFetch<T>(url)

  useEffect(() => {
    if (data) {
      setCachedData(data)
    }
  }, [data, setCachedData])

  return {
    data: data || cachedData,
    loading,
    error,
    refetch
  }
}
```

### 3.2 条件 Hook

```typescript
// useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// 组合使用
function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  return { isMobile, isTablet, isDesktop }
}
```

---

## 四、Hook 最佳实践

### 4.1 返回值设计

```typescript
// ✅ 两个值：返回数组（类似 useState）
function useToggle() {
  const [value, setValue] = useState(false)
  const toggle = () => setValue(v => !v)
  return [value, toggle] as const
}

// ✅ 多个值：返回对象
function useFetch(url) {
  // ...
  return { data, loading, error, refetch }
}

// ✅ 方法集合：返回对象
function useCounter(initialValue) {
  // ...
  return { count, increment, decrement, reset }
}
```

### 4.2 参数设计

```typescript
// ✅ 简单参数
function useDebounce(value: string, delay: number)

// ✅ 复杂参数使用对象
function useFetch(url: string, options?: {
  method?: string
  headers?: Record<string, string>
  body?: string
  enabled?: boolean
})

// ✅ 提供默认值
function useCounter(initialValue = 0, options: { min?: number; max?: number } = {})
```

### 4.3 类型完整

```typescript
interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchResult<T> {
  // ...
}
```

---

## 五、总结

### ✅ 关键知识点

1. **单一职责**：每个 Hook 只做一件事
2. **可组合**：Hook 可以调用其他 Hook
3. **状态管理**：useToggle、useCounter
4. **副作用**：useDebounce、useThrottle、useInterval
5. **DOM 相关**：useClickOutside、useWindowSize
6. **数据获取**：useFetch
7. **持久化**：useLocalStorage、useSessionStorage
8. **组合**：多个 Hook 组合使用

### 🔜 下一章

- 下一章：[Provider 模式](/web/react/patterns/03-provider/)
- 上一章：[组合模式](/web/react/patterns/01-compound/)
- 上一级：[React 设计模式](/web/react/patterns/)
