---
title: 生命周期与副作用
---

# 生命周期与副作用

> 本章介绍类组件的生命周期方法和函数组件的副作用处理，理解组件从创建到销毁的完整过程。

---

## 一、组件生命周期

React 组件从创建到销毁会经历多个阶段，每个阶段都有对应的钩子函数。

```
┌─────────────────────────────────────────────────────────┐
│                   React 组件生命周期                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  挂载阶段（Mounting）                                    │
│  ├── constructor                                        │
│  ├── getDerivedStateFromProps                           │
│  ├── render                                             │
│  └── componentDidMount                                  │
│                                                         │
│  更新阶段（Updating）                                    │
│  ├── getDerivedStateFromProps                           │
│  ├── shouldComponentUpdate                              │
│  ├── render                                             │
│  ├── getSnapshotBeforeUpdate                            │
│  └── componentDidUpdate                                 │
│                                                         │
│  卸载阶段（Unmounting）                                  │
│  └── componentWillUnmount                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 二、类组件生命周期

### 2.1 挂载阶段

```typescript
class App extends Component {
  constructor(props) {
    super(props)
    console.log('1. 构造函数')
    this.state = { count: 0 }
  }

  static getDerivedStateFromProps(props, state) {
    console.log('2. 从 props 派生 state')
    // 返回对象更新 state，返回 null 不更新
    return null
  }

  componentDidMount() {
    console.log('4. 组件挂载完成')
    // 适合：请求数据、添加事件监听、设置定时器
  }

  render() {
    console.log('3. 渲染')
    return <div>{this.state.count}</div>
  }
}
```

### 2.2 更新阶段

```typescript
class App extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    console.log('是否应该更新')
    // 返回 false 阻止更新
    return nextState.count !== this.state.count
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('获取更新前快照')
    // 返回值会传给 componentDidUpdate
    return { scrollPosition: window.scrollY }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('组件更新完成', snapshot)
    // 适合：操作 DOM、根据变化请求数据
  }
}
```

### 2.3 卸载阶段

```typescript
class App extends Component {
  componentWillUnmount() {
    console.log('组件即将卸载')
    // 适合：清除定时器、移除事件监听、取消请求
  }
}
```

### 2.4 完整生命周期示例

```typescript
class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    console.log('constructor')
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps')
    return null
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.timer = setInterval(() => {
      this.setState({ count: this.state.count + 1 })
    }, 1000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate')
    return nextState.count < 10  // 计数到 10 停止
  }

  getSnapshotBeforeUpdate() {
    console.log('getSnapshotBeforeUpdate')
    return null
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    clearInterval(this.timer)
  }

  render() {
    console.log('render')
    return <div>{this.state.count}</div>
  }
}
```

---

## 三、函数组件与 useEffect

函数组件没有生命周期方法，使用 `useEffect` 处理副作用。

### 3.1 useEffect 基础

```typescript
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // 相当于 componentDidMount + componentDidUpdate + componentWillUnmount
  useEffect(() => {
    console.log('组件挂载或更新')

    // 清理函数（相当于 componentWillUnmount）
    return () => {
      console.log('组件卸载或下次 effect 执行前')
    }
  })

  return <div>{count}</div>
}
```

### 3.2 依赖数组

```typescript
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // 1. 无依赖数组：每次渲染后都执行
  useEffect(() => {
    console.log('每次渲染后执行')
  })

  // 2. 空数组：只在挂载后执行一次（相当于 componentDidMount）
  useEffect(() => {
    console.log('只在挂载后执行')
  }, [])

  // 3. 有依赖：依赖变化时执行
  useEffect(() => {
    console.log('count 变化时执行', count)
  }, [count])

  // 4. 多个依赖：任一变化时执行
  useEffect(() => {
    console.log('count 或 name 变化时执行')
  }, [count, name])

  return <div>{count}</div>
}
```

### 3.3 生命周期对照表

| 类组件生命周期           | useEffect 等价写法                       |
| ------------------------ | ---------------------------------------- |
| `componentDidMount`      | `useEffect(() => {}, [])`                |
| `componentDidUpdate`     | `useEffect(() => {})`                    |
| `componentWillUnmount`   | `useEffect(() => { return () => {} }, [])` |
| `shouldComponentUpdate`  | `React.memo` / `useMemo` / `useCallback` |

---

## 四、常见副作用场景

### 4.1 数据请求

```typescript
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    }

    fetchUsers()
  }, [])  // 只在挂载时请求

  if (loading) return <div>加载中...</div>
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### 4.2 事件监听

```typescript
function WindowSize() {
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

    // 添加监听
    window.addEventListener('resize', handleResize)

    // 清理监听（重要！）
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <div>{size.width} x {size.height}</div>
}
```

### 4.3 定时器

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 清理定时器
    return () => clearInterval(timer)
  }, [])

  return <div>已运行 {seconds} 秒</div>
}
```

### 4.4 订阅/取消订阅

```typescript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()

    connection.on('message', (message) => {
      setMessages(prev => [...prev, message])
    })

    // 切换房间或卸载时断开连接
    return () => connection.disconnect()
  }, [roomId])  // roomId 变化时重新订阅

  return <div>{messages.length} 条消息</div>
}
```

### 4.5 操作 DOM

```typescript
function FocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    // 挂载后自动聚焦
    inputRef.current.focus()
  }, [])

  return <input ref={inputRef} />
}
```

---

## 五、useEffect 进阶

### 5.1 多个 useEffect

可以将不同的副作用拆分到多个 useEffect：

```typescript
function App({ userId }) {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])

  // 获取用户信息
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])

  // 获取用户文章
  useEffect(() => {
    fetchPosts(userId).then(setPosts)
  }, [userId])

  // 监听窗口大小
  useEffect(() => {
    const handler = () => console.log(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return <div>...</div>
}
```

### 5.2 异步 useEffect

`useEffect` 不能直接使用 async，需要内部定义函数：

```typescript
// ❌ 错误：useEffect 不能返回 Promise
useEffect(async () => {
  const data = await fetchData()
}, [])

// ✅ 正确：内部定义异步函数
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch('/api/data')
    const json = await data.json()
    setState(json)
  }
  fetchData()
}, [])
```

### 5.3 竞态条件处理

处理快速切换导致的竞态问题：

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let isMounted = true  // 标记是否仍然挂载

    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()

      // 仅在仍然挂载时更新
      if (isMounted) {
        setUser(data)
      }
    }

    fetchUser()

    return () => {
      isMounted = false  // 清理时标记为已卸载
    }
  }, [userId])

  return <div>{user?.name}</div>
}
```

---

## 六、useLayoutEffect

`useLayoutEffect` 与 `useEffect` 类似，但执行时机不同：

```typescript
import { useLayoutEffect, useEffect, useRef, useState } from 'react'

function App() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  // useEffect：浏览器绘制后执行（用户可能看到闪烁）
  useEffect(() => {
    setWidth(ref.current.offsetWidth)
  }, [])

  // useLayoutEffect：DOM 更新后、浏览器绘制前执行（无闪烁）
  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth)
  }, [])

  return <div ref={ref}>宽度：{width}px</div>
}
```

### 执行顺序

```
组件渲染
    │
    ▼
DOM 更新
    │
    ▼
useLayoutEffect 执行（同步，阻塞绘制）
    │
    ▼
浏览器绘制
    │
    ▼
useEffect 执行（异步，不阻塞绘制）
```

> 💡 大多数情况使用 `useEffect`，仅在需要测量 DOM 或避免闪烁时使用 `useLayoutEffect`。

---

## 七、自定义 Hook 处理副作用

将副作用逻辑抽取为自定义 Hook：

```typescript
// 自定义 Hook：窗口大小
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handler = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return size
}

// 自定义 Hook：数据请求
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url)
        const json = await response.json()
        if (isMounted) {
          setData(json)
          setError(null)
        }
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [url])

  return { data, loading, error }
}

// 使用
function App() {
  const { width, height } = useWindowSize()
  const { data, loading, error } = useFetch('/api/user')

  return <div>...</div>
}
```

---

## 八、常见错误与最佳实践

### 8.1 忘记清理副作用

```typescript
// ❌ 错误：没有清理定时器
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)
  // 组件卸载后定时器还在运行！
}, [])

// ✅ 正确：清理定时器
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

### 8.2 依赖数组遗漏

```typescript
// ❌ 错误：遗漏依赖
useEffect(() => {
  fetchUser(userId)  // 使用了 userId 但未声明依赖
}, [])  // eslint 会警告

// ✅ 正确：声明所有依赖
useEffect(() => {
  fetchUser(userId)
}, [userId])
```

### 8.3 在 useEffect 中直接更新 state

```typescript
// ❌ 可能导致无限循环
useEffect(() => {
  setCount(count + 1)  // 触发重渲染 → useEffect 再次执行 → 无限循环
})

// ✅ 正确：添加依赖或使用条件
useEffect(() => {
  if (shouldUpdate) {
    setCount(prev => prev + 1)
  }
}, [shouldUpdate])
```

---

## 九、总结

### ✅ 关键知识点

1. **生命周期三阶段**：挂载、更新、卸载
2. **useEffect**：函数组件处理副作用的核心 Hook
3. **依赖数组**：控制 effect 执行时机
4. **清理函数**：return 的函数用于清理副作用
5. **竞态处理**：使用 `isMounted` 标志
6. **useLayoutEffect**：DOM 测量场景使用
7. **自定义 Hook**：抽取复用副作用逻辑

### 🔜 下一章

- 下一章：[useState 状态管理](/web/react/hooks/01-usestate/)
- 上一章：[State 与事件处理](/web/react/basics/04-state-events/)
- 上一级：[React 基础](/web/react/basics/)
