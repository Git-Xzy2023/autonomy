---
title: Render Props
---

# Render Props

> Render Props 是一种在 React 组件间共享代码的技术，使用值为函数的 prop。

---

## 一、Render Props 概述

### 1.1 什么是 Render Props？

```
┌─────────────────────────────────────────┐
│              Render Props               │
├─────────────────────────────────────────┤
│                                         │
│  Render Prop：值为函数的 prop           │
│                                         │
│  <Component render={(data) => (        │
│    <div>{data.name}</div>              │
│  )} />                                  │
│                                         │
│  组件通过调用 render prop 共享数据      │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 与 HOC 对比

| 特性         | HOC            | Render Props    |
| ------------ | -------------- | --------------- |
| **实现方式** | 包装组件       | 函数 prop       |
| **数据来源** | 难以追踪       | 清晰            |
| **嵌套**     | 多层嵌套       | 单层            |
| **类型推导** | 复杂           | 简单            |
| **推荐**     | ❌ 旧代码      | ❌ 被 Hooks 替代 |

---

## 二、基本用法

### 2.1 第一个 Render Props

```typescript
// Mouse 组件：跟踪鼠标位置
class Mouse extends Component {
  state = { x: 0, y: 0 }

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY })
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

// 使用
function App() {
  return (
    <Mouse render={({ x, y }) => (
      <p>鼠标位置：{x}, {y}</p>
    )} />
  )
}
```

### 2.2 使用 children prop

```typescript
class Mouse extends Component {
  state = { x: 0, y: 0 }

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY })
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    )
  }
}

// 使用 children
function App() {
  return (
    <Mouse>
      {({ x, y }) => <p>鼠标位置：{x}, {y}</p>}
    </Mouse>
  )
}
```

### 2.3 函数组件版本

```typescript
function Mouse({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div onMouseMove={handleMouseMove}>
      {children(position)}
    </div>
  )
}
```

---

## 三、常见 Render Props 模式

### 3.1 数据提供者

```typescript
// 数据获取组件
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [url])

  return render({ data, loading, error })
}

// 使用
function App() {
  return (
    <DataFetcher
      url="/api/users"
      render={({ data, loading, error }) => {
        if (loading) return <div>加载中...</div>
        if (error) return <div>错误</div>
        return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
      }}
    />
  )
}
```

### 3.2 状态管理

```typescript
function Counter({ children }) {
  const [count, setCount] = useState(0)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(0)

  return children({ count, increment, decrement, reset })
}

// 使用
function App() {
  return (
    <Counter>
      {({ count, increment, decrement, reset }) => (
        <div>
          <p>{count}</p>
          <button onClick={increment}>+1</button>
          <button onClick={decrement}>-1</button>
          <button onClick={reset}>重置</button>
        </div>
      )}
    </Counter>
  )
}
```

### 3.3 表单处理

```typescript
function Form({ initialValues, children }) {
  const [values, setValues] = useState(initialValues)

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('提交', values)
  }

  const reset = () => setValues(initialValues)

  return children({ values, handleChange, handleSubmit, reset })
}

// 使用
function App() {
  return (
    <Form initialValues={{ name: '', email: '' }}>
      {({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <input
            value={values.name}
            onChange={e => handleChange('name', e.target.value)}
          />
          <input
            value={values.email}
            onChange={e => handleChange('email', e.target.value)}
          />
          <button type="submit">提交</button>
        </form>
      )}
    </Form>
  )
}
```

### 3.4 动画

```typescript
function Animation({ children, duration = 1000 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        clearInterval(timer)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [duration])

  return children({ progress })
}

// 使用
function App() {
  return (
    <Animation duration={2000}>
      {({ progress }) => (
        <div
          style={{
            width: `${progress * 100}%`,
            height: '20px',
            background: 'blue'
          }}
        />
      )}
    </Animation>
  )
}
```

---

## 四、Render Props 与 Hooks

### 4.1 Render Props 转换为 Hooks

```typescript
// Render Props 版本
function Mouse({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
      {children(position)}
    </div>
  )
}

// Hooks 版本
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// 使用
function App() {
  const { x, y } = useMouse()
  return <p>鼠标位置：{x}, {y}</p>
}
```

### 4.2 对比

```typescript
// Render Props：嵌套结构
function App() {
  return (
    <Mouse>
      {({ x, y }) => (
        <WindowSize>
          {({ width, height }) => (
            <div>
              鼠标：{x}, {y}
              窗口：{width} x {height}
            </div>
          )}
        </WindowSize>
      )}
    </Mouse>
  )
}

// Hooks：扁平结构
function App() {
  const { x, y } = useMouse()
  const { width, height } = useWindowSize()

  return (
    <div>
      鼠标：{x}, {y}
      窗口：{width} x {height}
    </div>
  )
}
```

---

## 五、Render Props 注意事项

### 5.1 性能问题

```typescript
// ❌ 每次渲染都创建新函数
function App() {
  return (
    <Mouse>
      {({ x, y }) => <p>{x}, {y}</p>}
    </Mouse>
  )
}

// ✅ 提取为变量或使用 useCallback
const renderMouse = useCallback(({ x, y }) => <p>{x}, {y}</p>, [])

function App() {
  return <Mouse>{renderMouse}</Mouse>
}
```

### 5.2 Pure Component 优化

```typescript
// 使用 shouldComponentUpdate 或 React.memo 时，函数 prop 会破坏优化
const MouseTracker = React.memo(({ render }) => {
  // ...
})

// 每次渲染 render 都是新函数，memo 失效
```

---

## 六、总结

### ✅ 关键知识点

1. **Render Props**：值为函数的 prop，用于共享代码
2. **children prop**：常用作 render prop
3. **数据提供者**：通过函数调用传递数据
4. **vs HOC**：数据来源更清晰
5. **vs Hooks**：新项目推荐使用 Hooks
6. **性能注意**：函数 prop 可能影响优化

### 🔜 下一章

- 下一章：[错误边界](/web/react/advanced/05-error-boundaries/)
- 上一章：[高阶组件 HOC](/web/react/advanced/03-hoc/)
- 上一级：[React 进阶特性](/web/react/advanced/)
