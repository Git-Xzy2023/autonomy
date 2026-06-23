---
title: useEffect 副作用
---

# useEffect 副作用

> useEffect 用于处理副作用，如数据请求、订阅、定时器、DOM 操作等。

---

## 一、什么是副作用？

```
┌─────────────────────────────────────────┐
│              副作用分类                  │
├─────────────────────────────────────────┤
│                                         │
│  副作用（Side Effects）                 │
│  ├── 数据请求（fetch、axios）           │
│  ├── 订阅（WebSocket、事件监听）        │
│  ├── 定时器（setTimeout、setInterval）  │
│  ├── DOM 操作（修改样式、聚焦）         │
│  ├── 本地存储（localStorage）           │
│  └── 控制台输出（console.log）          │
│                                         │
│  纯操作（Pure Operations）              │
│  ├── 计算值                             │
│  ├── 渲染 UI                            │
│  └── 状态更新                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、基本用法

```typescript
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `点击了 ${count} 次`
  }, [count])

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 语法结构

```typescript
useEffect(() => {
  // 副作用逻辑

  return () => {
    // 清理函数（可选）
  }
}, [dependencies])  // 依赖数组（可选）
```

---

## 三、依赖数组

### 3.1 三种形式

```typescript
// 1. 无依赖数组：每次渲染后都执行
useEffect(() => {
  console.log('每次渲染后执行')
})

// 2. 空数组：只在挂载后执行一次
useEffect(() => {
  console.log('只在挂载后执行')
}, [])

// 3. 有依赖：依赖变化时执行
useEffect(() => {
  console.log('count 变化时执行', count)
}, [count])
```

### 3.2 执行时机

```
组件挂载
    │
    ▼
首次渲染
    │
    ▼
useEffect 执行（所有形式都会执行）
    │
    ▼
State/Props 变化
    │
    ▼
重新渲染
    │
    ▼
useEffect 执行（根据依赖数组判断）
    │
    ▼
组件卸载
    │
    ▼
清理函数执行
```

### 3.3 依赖数组规则

```typescript
function App({ userId, theme }) {
  const [data, setData] = useState(null)

  // ✅ 正确：包含所有外部依赖
  useEffect(() => {
    fetchData(userId).then(setData)
  }, [userId])

  // ❌ 错误：遗漏依赖（eslint 会警告）
  useEffect(() => {
    fetchData(userId).then(setData)
  }, [])

  // ✅ 多个依赖
  useEffect(() => {
    console.log(userId, theme)
  }, [userId, theme])
}
```

---

## 四、清理函数

### 4.1 清理定时器

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 清理函数：组件卸载时执行
    return () => {
      clearInterval(timer)
    }
  }, [])

  return <div>{seconds}</div>
}
```

### 4.2 移除事件监听

```typescript
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <div>{position.x}, {position.y}</div>
}
```

### 4.3 取消订阅

```typescript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const connection = new WebSocket(`ws://chat/${roomId}`)

    connection.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)])
    }

    // 切换房间或卸载时关闭连接
    return () => {
      connection.close()
    }
  }, [roomId])

  return <div>{messages.length} 条消息</div>
}
```

### 4.4 清理函数执行时机

```
首次渲染
    │
    ▼
effect 执行
    │
    ▼
依赖变化
    │
    ▼
清理函数执行（清理上一次的 effect）
    │
    ▼
新的 effect 执行
    │
    ▼
组件卸载
    │
    ▼
清理函数执行（清理最后一次的 effect）
```

---

## 五、常见场景

### 5.1 数据请求

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true  // 防止内存泄漏

    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()
        if (isMounted) {
          setUser(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [userId])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误：{error.message}</div>
  return <div>{user.name}</div>
}
```

### 5.2 监听窗口大小

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
```

### 5.3 本地存储同步

```typescript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

### 5.4 DOM 操作

```typescript
function AutoFocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return <input ref={inputRef} />
}
```

---

## 六、异步处理

### 6.1 不能直接使用 async

```typescript
// ❌ 错误：useEffect 不能返回 Promise
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// ✅ 正确：内部定义异步函数
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch('/api/data')
    const json = await data.json()
    setData(json)
  }
  fetchData()
}, [])
```

### 6.2 使用 AbortController 取消请求

```typescript
useEffect(() => {
  const controller = new AbortController()

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      })
      const data = await response.json()
      setData(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('请求被取消')
      } else {
        setError(err)
      }
    }
  }

  fetchData()

  return () => {
    controller.abort()  // 取消请求
  }
}, [])
```

---

## 七、useEffect 进阶

### 7.1 多个 useEffect

```typescript
function App({ userId }) {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])

  // 分离不同逻辑
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])

  useEffect(() => {
    fetchPosts(userId).then(setPosts)
  }, [userId])

  useEffect(() => {
    document.title = user?.name || 'App'
  }, [user])

  return <div>...</div>
}
```

### 7.2 依赖函数

```typescript
function App() {
  const [count, setCount] = useState(0)

  // 函数定义在组件内
  const handleClick = () => {
    console.log(count)
  }

  // ❌ 错误：handleClick 每次渲染都是新函数
  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [handleClick])  // 每次渲染都会重新绑定

  // ✅ 方案 1：useCallback
  const stableHandler = useCallback(() => {
    console.log(count)
  }, [count])

  useEffect(() => {
    window.addEventListener('click', stableHandler)
    return () => window.removeEventListener('click', stableHandler)
  }, [stableHandler])

  // ✅ 方案 2：把函数移到 effect 内部
  useEffect(() => {
    const handler = () => console.log(count)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [count])
}
```

---

## 八、常见错误

### 8.1 无限循环

```typescript
function App() {
  const [count, setCount] = useState(0)

  // ❌ 无依赖数组：每次渲染都执行 → setState → 重渲染 → 执行 → 死循环
  useEffect(() => {
    setCount(count + 1)
  })

  // ✅ 添加依赖或条件
  useEffect(() => {
    setCount(count + 1)
  }, [])  // 只执行一次

  return <div>{count}</div>
}
```

### 8.2 遗漏依赖

```typescript
function App({ userId }) {
  const [data, setData] = useState(null)

  // ❌ 遗漏 userId 依赖
  useEffect(() => {
    fetchData(userId).then(setData)
  }, [])  // userId 变化时不会重新请求

  // ✅ 正确依赖
  useEffect(() => {
    fetchData(userId).then(setData)
  }, [userId])
}
```

### 8.3 在 effect 中直接修改 state

```typescript
function App() {
  const [count, setCount] = useState(0)

  // ❌ 可能导致无限循环
  useEffect(() => {
    setCount(count + 1)
  }, [count])  // count 变化 → effect 执行 → setCount → count 变化 → ...

  // ✅ 添加条件
  useEffect(() => {
    if (count < 10) {
      setCount(count + 1)
    }
  }, [count])
}
```

---

## 九、useEffect vs useLayoutEffect

| 特性           | useEffect        | useLayoutEffect    |
| -------------- | ---------------- | ------------------ |
| **执行时机**   | 浏览器绘制后     | DOM 更新后、绘制前 |
| **是否阻塞**   | 异步，不阻塞     | 同步，阻塞绘制     |
| **适用场景**   | 大多数副作用     | DOM 测量、避免闪烁 |
| **性能**       | 好               | 较差               |

```typescript
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

function Tooltip({ text }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // ✅ 使用 useLayoutEffect：避免 tooltip 位置闪烁
  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: rect.x,
      y: rect.y - 30
    })
  }, [text])

  return (
    <div ref={ref} style={{ position: 'absolute', left: position.x, top: position.y }}>
      {text}
    </div>
  )
}
```

---

## 十、总结

### ✅ 关键知识点

1. **副作用**：数据请求、订阅、定时器、DOM 操作等
2. **依赖数组**：控制 effect 执行时机
3. **清理函数**：return 的函数，用于清理副作用
4. **异步处理**：内部定义 async 函数，使用 AbortController 取消
5. **避免无限循环**：正确设置依赖，添加条件
6. **useLayoutEffect**：DOM 测量场景使用

### 🔜 下一章

- 下一章：[useRef 与 DOM](/web/react/hooks/03-useref/)
- 上一章：[useState 状态管理](/web/react/hooks/01-usestate/)
- 上一级：[Hooks](/web/react/hooks/)
