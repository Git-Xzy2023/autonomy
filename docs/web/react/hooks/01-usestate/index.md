---
title: useState 状态管理
---

# useState 状态管理

> useState 是最基础的 Hook，用于在函数组件中添加状态。

---

## 一、基本用法

```typescript
import { useState } from 'react'

function Counter() {
  // 返回 [当前值, 更新函数]
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### 参数与返回值

```
useState(initialValue)
   │
   ├── 参数：初始值（任意类型，或返回初始值的函数）
   │
   └── 返回：[state, setState]
            │       │
            │       └── 更新函数（接收新值或函数）
            │
            └── 当前状态值
```

---

## 二、初始值类型

### 2.1 简单初始值

```typescript
const [count, setCount] = useState(0)           // 数字
const [name, setName] = useState('')            // 字符串
const [isActive, setIsActive] = useState(false) // 布尔
const [list, setList] = useState([])            // 数组
const [user, setUser] = useState(null)          // 对象或 null
```

### 2.2 惰性初始化

当初始值需要计算时，使用函数形式避免每次渲染都计算：

```typescript
// ✅ 推荐：函数形式，只在首次渲染时执行
const [data, setData] = useState(() => {
  const saved = localStorage.getItem('data')
  return saved ? JSON.parse(saved) : []
})

// ❌ 错误：每次渲染都会执行
const [data, setData] = useState(JSON.parse(localStorage.getItem('data') || '[]'))
```

### 2.3 TypeScript 类型

```typescript
// 显式指定类型
const [user, setUser] = useState<User | null>(null)
const [list, setList] = useState<string[]>([])
const [count, setCount] = useState<number>(0)

interface User {
  id: number
  name: string
  email: string
}
```

---

## 三、更新 State

### 3.1 直接更新

```typescript
const [count, setCount] = useState(0)

// 直接设置新值
setCount(5)
setCount(count + 1)
```

### 3.2 函数式更新

当新值依赖旧值时，使用函数式更新：

```typescript
const [count, setCount] = useState(0)

// ✅ 推荐：函数式更新
setCount(prev => prev + 1)
setCount(prev => prev * 2)

// ❌ 危险：连续调用可能不生效
setCount(count + 1)
setCount(count + 1)  // 仍然使用旧值
```

### 3.3 函数式更新的场景

```typescript
function Counter() {
  const [count, setCount] = useState(0)

  const addThree = () => {
    // ✅ 正确：使用函数式更新，结果 +3
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  const wrongAddThree = () => {
    // ❌ 错误：批处理下只 +1
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return <button onClick={addThree}>{count}</button>
}
```

---

## 四、对象 State 更新

### 4.1 展开运算符

```typescript
const [user, setUser] = useState({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com'
})

// ✅ 正确：展开旧对象，覆盖新值
const updateName = (name) => {
  setUser({ ...user, name })
}

// ❌ 错误：直接修改会丢失其他属性
const updateName = (name) => {
  setUser({ name })  // age 和 email 丢失！
}

// ❌ 错误：直接修改对象
const updateName = (name) => {
  user.name = name
  setUser(user)  // React 不会检测到变化
}
```

### 4.2 嵌套对象更新

```typescript
const [state, setState] = useState({
  user: {
    name: '张三',
    address: {
      city: '北京',
      street: '朝阳路'
    }
  }
})

// 更新嵌套属性
const updateCity = (city) => {
  setState({
    ...state,
    user: {
      ...state.user,
      address: {
        ...state.user.address,
        city
      }
    }
  })
}
```

### 4.3 使用 immer 简化

```bash
npm install immer use-immer
```

```typescript
import { useImmer } from 'use-immer'

function App() {
  const [state, updateState] = useImmer({
    user: {
      name: '张三',
      address: { city: '北京' }
    }
  })

  // 直接修改（immer 内部处理不可变性）
  const updateCity = (city) => {
    updateState(draft => {
      draft.user.address.city = city
    })
  }

  return <div>...</div>
}
```

---

## 五、数组 State 更新

### 5.1 添加元素

```typescript
const [list, setList] = useState([1, 2, 3])

// 添加到末尾
setList([...list, 4])

// 添加到开头
setList([0, ...list])

// 函数式
setList(prev => [...prev, 4])
```

### 5.2 删除元素

```typescript
const [list, setList] = useState([
  { id: 1, text: '苹果' },
  { id: 2, text: '香蕉' }
])

// 按 id 删除
const removeItem = (id) => {
  setList(list.filter(item => item.id !== id))
}
```

### 5.3 修改元素

```typescript
const [list, setList] = useState([
  { id: 1, text: '苹果', done: false },
  { id: 2, text: '香蕉', done: false }
])

// 修改特定元素
const toggleItem = (id) => {
  setList(list.map(item =>
    item.id === id
      ? { ...item, done: !item.done }
      : item
  ))
}
```

### 5.4 排序

```typescript
const [list, setList] = useState([3, 1, 4, 1, 5])

// 排序（先复制再排序，避免修改原数组）
const sortList = () => {
  setList([...list].sort((a, b) => a - b))
}
```

---

## 六、多个 State 的管理

### 6.1 独立 State

```typescript
function Form() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState(0)

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />
    </form>
  )
}
```

### 6.2 对象 State

```typescript
function Form() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: 0
  })

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form>
      <input
        value={form.name}
        onChange={e => updateField('name', e.target.value)}
      />
      <input
        value={form.email}
        onChange={e => updateField('email', e.target.value)}
      />
    </form>
  )
}
```

### 6.3 选择建议

| 场景                 | 推荐方式       |
| -------------------- | -------------- |
| 独立的状态           | 多个 useState  |
| 相关的状态           | 一个对象 state |
| 复杂的状态逻辑       | useReducer     |

---

## 七、State 批处理

React 18+ 自动批处理所有 state 更新：

```typescript
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const handleClick = () => {
    // 一次渲染，多次更新被批处理
    setCount(1)
    setName('张三')
    setCount(2)
  }

  // 异步函数中的更新也会被批处理（React 18+）
  const handleAsync = async () => {
    await fetch('/api')
    setCount(1)      // 这两个更新会被批处理
    setName('张三')
  }

  return <button onClick={handleClick}>点击</button>
}
```

### flushSync 强制同步更新

```typescript
import { flushSync } from 'react-dom'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    flushSync(() => {
      setCount(1)  // 立即更新并渲染
    })
    // 此时 DOM 已更新
    flushSync(() => {
      setCount(2)  // 再次立即更新
    })
  }

  return <button onClick={handleClick}>{count}</button>
}
```

> ⚠️ `flushSync` 会影响性能，仅在必要时使用（如滚动位置、焦点管理等）。

---

## 八、常见陷阱

### 8.1 闭包陷阱

```typescript
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      // ❌ 闭包陷阱：count 永远是 0
      console.log(count)
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])  // 空依赖导致 count 闭包为 0

  // ✅ 解决方案 1：函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1)  // 使用 prev 而非 count
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // ✅ 解决方案 2：添加依赖
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [count])  // count 变化时重新设置定时器

  return <div>{count}</div>
}
```

### 8.2 直接修改 state

```typescript
const [list, setList] = useState([1, 2, 3])

// ❌ 错误：直接修改
list.push(4)
setList(list)  // React 不会重新渲染

// ✅ 正确：返回新数组
setList([...list, 4])
```

---

## 九、总结

### ✅ 关键知识点

1. **基本用法**：`const [state, setState] = useState(initialValue)`
2. **惰性初始化**：`useState(() => init())` 避免 repeated 计算
3. **函数式更新**：`setState(prev => newValue)` 避免批处理问题
4. **不可变性**：必须返回新对象/数组，不能直接修改
5. **对象更新**：使用展开运算符 `{...obj, key: value}`
6. **数组更新**：使用 `map`、`filter`、`[...arr]` 等返回新数组
7. **闭包陷阱**：使用函数式更新或正确设置依赖

### 🔜 下一章

- 下一章：[useEffect 副作用](/web/react/hooks/02-useeffect/)
- 上一章：[Hooks](/web/react/hooks/)
- 上一级：[Hooks](/web/react/hooks/)
