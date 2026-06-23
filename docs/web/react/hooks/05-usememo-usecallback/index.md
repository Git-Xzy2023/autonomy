---
title: useMemo 与 useCallback
---

# useMemo 与 useCallback

> useMemo 和 useCallback 用于性能优化，避免不必要的计算和重渲染。

---

## 一、为什么需要性能优化？

### 1.1 React 重渲染机制

```
┌─────────────────────────────────────────┐
│           React 重渲染触发条件           │
├─────────────────────────────────────────┤
│                                         │
│  1. State 变化                          │
│  2. Props 变化                          │
│  3. 父组件重渲染（子组件也会重渲染）     │
│  4. Context 变化                        │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 性能问题示例

```typescript
function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // ❌ 每次渲染都会重新计算（即使 count 没变）
  const expensiveValue = expensiveCalculation(count)

  // ❌ 每次渲染都是新函数，导致子组件重渲染
  const handleClick = () => {
    console.log(count)
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>{expensiveValue}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  )
}
```

---

## 二、useMemo

### 2.1 基本用法

```typescript
import { useMemo } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // ✅ 只有 count 变化时才重新计算
  const expensiveValue = useMemo(() => {
    return expensiveCalculation(count)
  }, [count])

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>{expensiveValue}</p>
    </div>
  )
}
```

### 2.2 语法

```typescript
const memoizedValue = useMemo(() => {
  // 计算逻辑
  return result
}, [dependencies])
```

### 2.3 使用场景

#### 场景 1：昂贵计算

```typescript
function App({ data }) {
  const [filter, setFilter] = useState('')

  // ✅ 仅在 data 或 filter 变化时重新计算
  const filteredData = useMemo(() => {
    console.log('过滤数据')
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

#### 场景 2：保持引用稳定

```typescript
function App({ user }) {
  const [count, setCount] = useState(0)

  // ✅ 保持对象引用稳定
  const userInfo = useMemo(() => ({
    name: user.name,
    email: user.email,
    avatar: user.avatar
  }), [user.name, user.email, user.avatar])

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <UserCard info={userInfo} />  {/* 不会因 count 变化而重渲染 */}
    </div>
  )
}
```

#### 场景 3：引用比较

```typescript
function App({ items }) {
  const [sortOrder, setSortOrder] = useState('asc')

  // ✅ 排序后的数组引用稳定
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) =>
      sortOrder === 'asc' ? a.id - b.id : b.id - a.id
    )
  }, [items, sortOrder])

  return (
    <div>
      <button onClick={() => setSortOrder('asc')}>升序</button>
      <button onClick={() => setSortOrder('desc')}>降序</button>
      <ItemList items={sortedItems} />
    </div>
  )
}
```

---

## 三、useCallback

### 3.1 基本用法

```typescript
import { useCallback } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // ✅ 只有 count 变化时才重新创建函数
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

### 3.2 语法

```typescript
const memoizedCallback = useCallback(() => {
  // 函数逻辑
}, [dependencies])
```

### 3.3 useMemo vs useCallback

```typescript
// useMemo：返回值（任意类型）
const value = useMemo(() => computeValue(), [deps])

// useCallback：返回函数
const fn = useCallback(() => doSomething(), [deps])

// useCallback 等价于 useMemo 返回函数
const fn = useMemo(() => () => doSomething(), [deps])
```

### 3.4 使用场景

#### 场景 1：传递给被 memo 的子组件

```typescript
const ChildComponent = memo(function ChildComponent({ onClick }) {
  console.log('子组件渲染')
  return <button onClick={onClick}>子组件</button>
})

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // ✅ 保持函数引用稳定，避免子组件重渲染
  const handleClick = useCallback(() => {
    console.log(count)
  }, [count])

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildComponent onClick={handleClick} />
    </div>
  )
}
```

#### 场景 2：作为 useEffect 依赖

```typescript
function App({ userId }) {
  const [data, setData] = useState(null)

  // ✅ 稳定的函数引用
  const fetchData = useCallback(async () => {
    const response = await fetch(`/api/users/${userId}`)
    const json = await response.json()
    setData(json)
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return <div>{data?.name}</div>
}
```

---

## 四、React.memo

### 4.1 基本用法

`React.memo` 是高阶组件，用于避免子组件不必要的重渲染：

```typescript
import { memo } from 'react'

const MyComponent = memo(function MyComponent(props) {
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

### 4.2 自定义比较函数

```typescript
const MyComponent = memo(function MyComponent(props) {
  return <div>{props.user.name}</div>
}, (prevProps, nextProps) => {
  // 返回 true 表示不重渲染，false 表示重渲染
  return prevProps.user.id === nextProps.user.id
})
```

### 4.3 memo + useCallback + useMemo

```typescript
const UserCard = memo(function UserCard({ user, onUpdate, onClick }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => onUpdate(user.id)}>更新</button>
      <button onClick={onClick}>点击</button>
    </div>
  )
})

function App() {
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)

  // ✅ 保持 user 引用稳定
  const currentUser = useMemo(() => users[0], [users])

  // ✅ 保持函数引用稳定
  const handleUpdate = useCallback((id) => {
    console.log('更新', id)
  }, [])

  const handleClick = useCallback(() => {
    console.log('点击')
  }, [])

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <UserCard user={currentUser} onUpdate={handleUpdate} onClick={handleClick} />
    </div>
  )
}
```

---

## 五、何时使用性能优化？

### 5.1 不要过度优化

```typescript
function App() {
  const [count, setCount] = useState(0)

  // ❌ 不必要的优化：简单计算不需要 useMemo
  const doubled = useMemo(() => count * 2, [count])

  // ❌ 不必要的优化：没有传递给子组件
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <button onClick={handleClick}>{doubled}</button>
}
```

### 5.2 适合优化的场景

| 场景                         | 使用     |
| ---------------------------- | -------- |
| 昂贵计算                     | useMemo  |
| 传递对象/数组给 memo 子组件  | useMemo  |
| 传递函数给 memo 子组件       | useCallback |
| 函数作为 useEffect 依赖      | useCallback |
| 简单计算                     | ❌ 不需要 |
| 没有传递给子组件             | ❌ 不需要 |

### 5.3 性能检测

使用 React DevTools 的 Profiler 检测性能问题：

```typescript
import { Profiler } from 'react'

function App() {
  return (
    <Profiler id="App" onRender={(id, phase, actualTime) => {
      console.log(`${id} ${phase} 耗时 ${actualTime}ms`)
    }}>
      <YourComponent />
    </Profiler>
  )
}
```

---

## 六、常见陷阱

### 6.1 依赖数组遗漏

```typescript
function App({ userId }) {
  const [data, setData] = useState(null)

  // ❌ 遗漏 userId 依赖
  const fetchData = useCallback(() => {
    fetch(`/api/users/${userId}`).then(setData)
  }, [])  // userId 变化时不会更新

  // ✅ 正确依赖
  const fetchData = useCallback(() => {
    fetch(`/api/users/${userId}`).then(setData)
  }, [userId])
}
```

### 6.2 每次都创建新对象

```typescript
function App() {
  const [count, setCount] = useState(0)

  // ❌ 每次渲染都创建新对象
  const style = { color: 'red', fontSize: '16px' }

  // ✅ 使用 useMemo 保持引用稳定
  const style = useMemo(() => ({ color: 'red', fontSize: '16px' }), [])

  return <ChildComponent style={style} />
}
```

### 6.3 memo 失效

```typescript
const Child = memo(function Child({ onClick, data }) {
  return <div onClick={onClick}>{data.name}</div>
})

function App() {
  const [count, setCount] = useState(0)

  // ❌ 即使 memo，每次渲染都是新函数和新对象
  return (
    <Child
      onClick={() => console.log(count)}
      data={{ name: '张三' }}
    />
  )

  // ✅ 使用 useCallback 和 useMemo
  const handleClick = useCallback(() => console.log(count), [count])
  const data = useMemo(() => ({ name: '张三' }), [])

  return <Child onClick={handleClick} data={data} />
}
```

---

## 七、总结

### ✅ 关键知识点

1. **useMemo**：缓存计算结果，避免重复计算
2. **useCallback**：缓存函数，保持引用稳定
3. **React.memo**：高阶组件，避免子组件重渲染
4. **使用场景**：昂贵计算、传递给 memo 子组件、effect 依赖
5. **不要过度优化**：简单场景不需要
6. **性能检测**：使用 React DevTools Profiler

### 🔜 下一章

- 下一章：[useReducer 复杂状态](/web/react/hooks/06-usereducer/)
- 上一章：[useContext 上下文](/web/react/hooks/04-usecontext/)
- 上一级：[Hooks](/web/react/hooks/)
