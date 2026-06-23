---
title: 性能优化实践
---

# 性能优化实践

> 汇总 React 性能优化的实际场景和解决方案。

---

## 一、性能优化策略

### 1.1 优化层次

```
┌─────────────────────────────────────────┐
│           性能优化层次                   │
├─────────────────────────────────────────┤
│                                         │
│  1. 网络层                              │
│     ├── 代码分割                        │
│     ├── 懒加载                          │
│     └── 预加载                          │
│                                         │
│  2. 渲染层                              │
│     ├── 避免不必要渲染                  │
│     ├── 虚拟化长列表                    │
│     └── 状态管理优化                    │
│                                         │
│  3. 计算层                              │
│     ├── 缓存计算结果                    │
│     ├── 防抖节流                        │
│     └── Web Worker                      │
│                                         │
│  4. 交互层                              │
│     ├── 并发特性                        │
│     ├── 骨架屏                          │
│     └── 乐观更新                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、列表优化

### 2.1 虚拟化长列表

```typescript
import { FixedSizeList, VariableSizeList } from 'react-window'

// 固定高度列表
function FixedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )

  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemSize={50}
      itemCount={items.length}
    >
      {Row}
    </FixedSizeList>
  )
}

// 可变高度列表
function VariableList({ items }) {
  const getItemSize = (index) => {
    return items[index].height || 50
  }

  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].content}
    </div>
  )

  return (
    <VariableSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  )
}
```

### 2.2 分页加载

```typescript
function PaginatedList() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    const newItems = await fetchItems(page)

    if (newItems.length === 0) {
      setHasMore(false)
    } else {
      setItems(prev => [...prev, ...newItems])
      setPage(p => p + 1)
    }
    setLoading(false)
  }, [page, loading, hasMore])

  // 滚动加载
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMore()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      {loading && <div>加载中...</div>}
      {!hasMore && <div>没有更多了</div>}
    </div>
  )
}
```

### 2.3 列表项优化

```typescript
// ✅ 列表项使用 memo
const ListItem = memo(function ListItem({ item, onClick }) {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  )
})

function List({ items }) {
  const handleClick = useCallback((id) => {
    console.log(id)
  }, [])

  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} onClick={handleClick} />
      ))}
    </div>
  )
}
```

---

## 三、图片优化

### 3.1 懒加载图片

```typescript
import { useState, useRef, useEffect } from 'react'

function LazyImage({ src, alt, placeholder }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          imgRef.current.src = src
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [src])

  return (
    <img
      ref={imgRef}
      alt={alt}
      src={placeholder}
      onLoad={() => setLoaded(true)}
      style={{ opacity: loaded ? 1 : 0.5, transition: 'opacity 0.3s' }}
    />
  )
}
```

### 3.2 响应式图片

```typescript
function ResponsiveImage({ src, alt }) {
  return (
    <img
      src={src}
      srcSet={`
        ${src}?w=320 320w,
        ${src}?w=640 640w,
        ${src}?w=1024 1024w
      `}
      sizes="(max-width: 600px) 320px, (max-width: 900px) 640px, 1024px"
      alt={alt}
      loading="lazy"
    />
  )
}
```

---

## 四、表单优化

### 4.1 防抖输入

```typescript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

function SearchInput() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (debouncedSearch) {
      searchAPI(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="搜索..."
    />
  )
}
```

### 4.2 非受控组件

```typescript
function Form() {
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(inputRef.current.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 非受控：每次输入不触发重渲染 */}
      <input ref={inputRef} defaultValue="" />
      <button type="submit">提交</button>
    </form>
  )
}
```

---

## 五、数据获取优化

### 5.1 请求缓存

```typescript
const cache = new Map()

function useFetch(url) {
  const [state, setState] = useState(() => {
    // 从缓存读取
    if (cache.has(url)) {
      return { data: cache.get(url), loading: false, error: null }
    }
    return { data: null, loading: true, error: null }
  })

  useEffect(() => {
    if (cache.has(url)) {
      setState({ data: cache.get(url), loading: false, error: null })
      return
    }

    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        cache.set(url, data)
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error })
        }
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [url])

  return state
}
```

### 5.2 请求去重

```typescript
const pendingRequests = new Map()

function fetchWithDedup(url) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)
  }

  const promise = fetch(url)
    .then(res => res.json())
    .finally(() => {
      pendingRequests.delete(url)
    })

  pendingRequests.set(url, promise)
  return promise
}
```

### 5.3 预加载

```typescript
function App() {
  const [showDetail, setShowDetail] = useState(false)

  // 鼠标悬停时预加载
  const handleMouseEnter = () => {
    import('./Detail').then(() => {
      console.log('预加载完成')
    })
  }

  return (
    <div>
      <button
        onMouseEnter={handleMouseEnter}
        onClick={() => setShowDetail(true)}
      >
        查看详情
      </button>
      {showDetail && (
        <Suspense fallback={<Loading />}>
          <Detail />
        </Suspense>
      )}
    </div>
  )
}
```

---

## 六、状态管理优化

### 6.1 状态拆分

```typescript
// ❌ 单个大 state
const [state, setState] = useState({
  user: null,
  posts: [],
  comments: [],
  filter: '',
  theme: 'light'
})

// ✅ 拆分为多个 state
const [user, setUser] = useState(null)
const [posts, setPosts] = useState([])
const [comments, setComments] = useState([])
const [filter, setFilter] = useState('')
const [theme, setTheme] = useState('light')
```

### 6.2 状态下放

```typescript
// ✅ 将搜索状态下放到 SearchBar
function SearchBar({ onSearch }) {
  const [input, setInput] = useState('')

  return (
    <input
      value={input}
      onChange={e => {
        setInput(e.target.value)
        onSearch(e.target.value)
      }}
    />
  )
}

function App() {
  const [results, setResults] = useState([])

  return (
    <div>
      <Header />
      <SearchBar onSearch={search => setResults(filter(search))} />
      <Results items={results} />
    </div>
  )
}
```

---

## 七、Bundle 优化

### 7.1 分析 Bundle

```bash
# 安装分析工具
npm install --save-dev webpack-bundle-analyzer

# 或使用 Vite
npm install --save-dev rollup-plugin-visualizer
```

### 7.2 按需加载

```typescript
// ✅ 按需加载库
import { debounce } from 'lodash-es'  // 只加载 debounce

// ❌ 加载整个库
import _ from 'lodash'  // 加载所有功能
```

### 7.3 Tree Shaking

```typescript
// ✅ 使用 ES Module
import { Button } from 'antd'  // 支持 tree shaking

// ❌ 使用 CommonJS
const { Button } = require('antd')  // 不支持 tree shaking
```

---

## 八、Web Worker

### 8.1 基本用法

```typescript
// worker.js
self.onmessage = function(e) {
  const result = heavyCalculation(e.data)
  self.postMessage(result)
}

// React 组件
function App() {
  const [result, setResult] = useState(null)

  const calculate = (data) => {
    const worker = new Worker('./worker.js', { type: 'module' })

    worker.onmessage = (e) => {
      setResult(e.data)
      worker.terminate()
    }

    worker.postMessage(data)
  }

  return (
    <div>
      <button onClick={() => calculate(largeData)}>计算</button>
      {result && <div>{result}</div>}
    </div>
  )
}
```

### 8.2 自定义 Hook

```typescript
function useWorker(workerScript) {
  const workerRef = useRef(null)

  useEffect(() => {
    workerRef.current = new Worker(workerScript, { type: 'module' })
    return () => workerRef.current?.terminate()
  }, [workerScript])

  const postMessage = (data) => {
    return new Promise((resolve) => {
      if (!workerRef.current) return

      workerRef.current.onmessage = (e) => resolve(e.data)
      workerRef.current.postMessage(data)
    })
  }

  return { postMessage }
}
```

---

## 九、性能监控

### 9.1 React Profiler

```typescript
function App() {
  return (
    <Profiler
      id="App"
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
        // 上报性能数据
        if (actualDuration > 100) {
          console.warn(`${id} 渲染耗时 ${actualDuration}ms`)
        }
      }}
    >
      <YourComponent />
    </Profiler>
  )
}
```

### 9.2 Web Vitals

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // 上报性能指标
  console.log(metric.name, metric.value)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

---

## 十、优化检查清单

### ✅ 性能优化清单

**网络层**
- [ ] 路由级代码分割
- [ ] 大组件懒加载
- [ ] 图片懒加载和优化
- [ ] 使用 CDN
- [ ] 启用 Gzip/Brotli 压缩

**渲染层**
- [ ] React.memo 优化纯组件
- [ ] useMemo/useCallback 优化
- [ ] 虚拟化长列表
- [ ] 状态下放和拆分
- [ ] 合理使用 key

**计算层**
- [ ] 防抖节流
- [ ] Web Worker 处理重计算
- [ ] 缓存计算结果

**交互层**
- [ ] 骨架屏
- [ ] 乐观更新
- [ ] useTransition/useDeferredValue
- [ ] 预加载

**监控**
- [ ] React Profiler
- [ ] Web Vitals
- [ ] 错误监控

---

## 十一、总结

### ✅ 关键知识点

1. **列表优化**：虚拟化、分页、memo
2. **图片优化**：懒加载、响应式
3. **表单优化**：防抖、非受控
4. **数据获取**：缓存、去重、预加载
5. **状态管理**：拆分、下放
6. **Bundle 优化**：按需加载、Tree Shaking
7. **Web Worker**：重计算分离
8. **性能监控**：Profiler、Web Vitals

### 🔜 下一章

- 下一章：[组合模式](/web/react/patterns/01-compound/)
- 上一章：[并发特性](/web/react/performance/03-concurrent/)
- 上一级：[React 性能优化](/web/react/performance/)
