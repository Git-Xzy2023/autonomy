---
title: memo 与性能优化
---

# memo 与性能优化

> React.memo、useMemo、useCallback 是 React 性能优化的三大工具。

---

## 一、React.memo

### 1.1 基本用法

```typescript
import { memo } from 'react'

const MyComponent = memo(function MyComponent(props) {
  console.log('渲染')
  return <div>{props.name}</div>
})

// 只有 props 变化时才重渲染
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MyComponent name="张三" />  {/* 不会因 count 变化而重渲染 */}
    </div>
  )
}
```

### 1.2 自定义比较函数

```typescript
const MyComponent = memo(
  function MyComponent(props) {
    return <div>{props.user.name}</div>
  },
  (prevProps, nextProps) => {
    // 返回 true：不重渲染
    // 返回 false：重渲染
    return prevProps.user.id === nextProps.user.id
  }
)
```

### 1.3 memo 的限制

```typescript
// ❌ memo 失效：每次渲染都是新对象/函数
function App() {
  const [count, setCount] = useState(0)

  return (
    <MyComponent
      data={{ name: '张三' }}  // 新对象
      onClick={() => {}}       // 新函数
    />
  )
}

// ✅ 使用 useMemo 和 useCallback
function App() {
  const [count, setCount] = useState(0)

  const data = useMemo(() => ({ name: '张三' }), [])
  const handleClick = useCallback(() => {}, [])

  return (
    <MyComponent data={data} onClick={handleClick} />
  )
}
```

---

## 二、useMemo

### 2.1 缓存计算结果

```typescript
function App({ data }) {
  const [filter, setFilter] = useState('')

  // ✅ 只有 data 或 filter 变化时才重新计算
  const filteredData = useMemo(() => {
    return data.filter(item => item.name.includes(filter))
  }, [data, filter])

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>
        {filteredData.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}
```

### 2.2 保持引用稳定

```typescript
function App({ user }) {
  const [count, setCount] = useState(0)

  // ✅ 保持对象引用稳定
  const userInfo = useMemo(() => ({
    name: user.name,
    email: user.email
  }), [user.name, user.email])

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <UserCard info={userInfo} />  {/* 不会因 count 变化而重渲染 */}
    </div>
  )
}
```

---

## 三、useCallback

### 3.1 缓存函数

```typescript
function App() {
  const [count, setCount] = useState(0)

  // ✅ 保持函数引用稳定
  const handleClick = useCallback(() => {
    console.log(count)
  }, [count])

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ChildComponent onClick={handleClick} />
    </div>
  )
}
```

### 3.2 作为 useEffect 依赖

```typescript
function App({ userId }) {
  const [data, setData] = useState(null)

  const fetchData = useCallback(async () => {
    const response = await fetch(`/api/users/${userId}`)
    setData(await response.json())
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return <div>{data?.name}</div>
}
```

---

## 四、虚拟化长列表

### 4.1 react-window

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window'

function List({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemSize={50}
      itemCount={items.length}
    >
      {Row}
    </FixedSizeList>
  )
}
```

### 4.2 react-virtualized

```bash
npm install react-virtualized
```

```typescript
import { List } from 'react-virtualized'

function MyList({ items }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  )

  return (
    <List
      width={300}
      height={500}
      rowCount={items.length}
      rowHeight={50}
      rowRenderer={rowRenderer}
    />
  )
}
```

---

## 五、代码分割

### 5.1 路由分割

```typescript
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  )
}
```

### 5.2 组件分割

```typescript
const HeavyChart = lazy(() => import('./HeavyChart'))

function App() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>显示图表</button>
      {showChart && (
        <Suspense fallback={<Loading />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
}
```

---

## 六、状态优化

### 6.1 状态下放

```typescript
// ❌ 状态在父组件，导致整个父组件重渲染
function App() {
  const [color, setColor] = useState('red')

  return (
    <div>
      <h1>标题</h1>
      <p>内容</p>
      <input value={color} onChange={e => setColor(e.target.value)} />
      <div style={{ color }}>彩色文字</div>
    </div>
  )
}

// ✅ 状态下放到子组件
function ColorPicker() {
  const [color, setColor] = useState('red')

  return (
    <div>
      <input value={color} onChange={e => setColor(e.target.value)} />
      <div style={{ color }}>彩色文字</div>
    </div>
  )
}

function App() {
  return (
    <div>
      <h1>标题</h1>
      <p>内容</p>
      <ColorPicker />
    </div>
  )
}
```

### 6.2 拆分组件

```typescript
// ❌ 大组件，任何状态变化都重渲染整个组件
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('')

  // 获取用户、文章等...

  return (
    <div>
      <Header user={user} />
      <FilterBar filter={filter} setFilter={setFilter} />
      <PostList posts={posts} filter={filter} />
    </div>
  )
}

// ✅ 拆分为独立组件
function UserDashboard({ userId }) {
  return (
    <div>
      <UserHeader userId={userId} />
      <PostsSection userId={userId} />
    </div>
  )
}
```

---

## 七、Context 优化

### 7.1 拆分 Context

```typescript
// ❌ 单个 Context：任何值变化都触发所有消费者重渲染
const AppContext = createContext({ user: null, theme: 'light', count: 0 })

// ✅ 拆分 Context
const UserContext = createContext()
const ThemeContext = createContext()
const CountContext = createContext()
```

### 7.2 使用 selector

```typescript
// 使用 use-context-selector 库
import { createContext, useContextSelector } from 'use-context-selector'

const UserContext = createContext({ name: '', age: 0 })

function UserName() {
  // 只订阅 name 变化
  const name = useContextSelector(UserContext, state => state.name)
  return <div>{name}</div>
}

function UserAge() {
  // 只订阅 age 变化
  const age = useContextSelector(UserContext, state => state.age)
  return <div>{age}</div>
}
```

---

## 八、性能检测

### 8.1 React DevTools Profiler

```typescript
import { Profiler } from 'react'

function App() {
  return (
    <Profiler
      id="App"
      onRender={(id, phase, actualDuration, baseDuration) => {
        console.log(`${id} ${phase}`)
        console.log(`实际耗时：${actualDuration}ms`)
        console.log(`基础耗时：${baseDuration}ms`)
      }}
    >
      <YourComponent />
    </Profiler>
  )
}
```

### 8.2 为什么渲染

```typescript
import { whyDidYouRender } from '@welldone-software/why-did-you-render'

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: true
  })
}

// 在组件中启用
const MyComponent = memo(() => <div>...</div>)
MyComponent.whyDidYouRender = true
```

---

## 九、优化检查清单

### ✅ 优化检查清单

- [ ] 使用 React.memo 包装纯展示组件
- [ ] 使用 useMemo 缓存昂贵计算
- [ ] 使用 useCallback 缓存传递给子组件的函数
- [ ] 列表使用稳定的 key
- [ ] 长列表使用虚拟化
- [ ] 路由级代码分割
- [ ] 状态下放，避免不必要重渲染
- [ ] 拆分 Context，避免全量更新
- [ ] 使用 Profiler 检测性能问题

### ❌ 避免过度优化

- 简单计算不需要 useMemo
- 没有传递给子组件的函数不需要 useCallback
- 小组件不需要 React.memo
- 先测量，再优化

---

## 十、总结

### ✅ 关键知识点

1. **React.memo**：避免子组件不必要重渲染
2. **useMemo**：缓存计算结果和对象引用
3. **useCallback**：缓存函数引用
4. **虚拟化列表**：react-window、react-virtualized
5. **代码分割**：React.lazy + Suspense
6. **状态下放**：将状态移到需要的组件
7. **Context 优化**：拆分 Context，使用 selector
8. **性能检测**：Profiler、why-did-you-render

### 🔜 下一章

- 下一章：[并发特性](/web/react/performance/03-concurrent/)
- 上一章：[虚拟 DOM 与 Diff](/web/react/performance/01-virtual-dom/)
- 上一级：[React 性能优化](/web/react/performance/)
