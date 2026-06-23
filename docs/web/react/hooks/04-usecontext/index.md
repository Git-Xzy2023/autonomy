---
title: useContext 上下文
---

# useContext 上下文

> useContext 用于跨组件共享数据，避免 props 逐层传递（prop drilling）。

---

## 一、为什么需要 Context？

### 1.1 Prop Drilling 问题

```
┌─────────────────────────────────────────────┐
│              Prop Drilling 问题              │
├─────────────────────────────────────────────┤
│                                             │
│  App                                        │
│   │ (传递 user)                             │
│   ▼                                         │
│  Layout                                     │
│   │ (传递 user)                             │
│   ▼                                         │
│  Sidebar                                    │
│   │ (传递 user)                             │
│   ▼                                         │
│  UserAvatar  ← 真正使用 user 的组件          │
│                                             │
│  问题：中间组件不需要 user，但仍需传递       │
│                                             │
└─────────────────────────────────────────────┘
```

### 1.2 Context 解决方案

```
┌─────────────────────────────────────────────┐
│              Context 解决方案                │
├─────────────────────────────────────────────┤
│                                             │
│  App                                        │
│   ├── UserContext.Provider (提供 user)      │
│   │                                         │
│   ▼                                         │
│  Layout  (无需传递 user)                    │
│   │                                         │
│   ▼                                         │
│  Sidebar  (无需传递 user)                   │
│   │                                         │
│   ▼                                         │
│  UserAvatar  ← useContext(UserContext)      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 二、Context 基础

### 2.1 创建 Context

```typescript
import { createContext } from 'react'

// 创建 Context，参数为默认值
const UserContext = createContext(null)

export default UserContext
```

### 2.2 TypeScript 类型

```typescript
interface User {
  id: number
  name: string
  email: string
}

const UserContext = createContext<User | null>(null)
```

### 2.3 Provider 提供数据

```typescript
function App() {
  const [user, setUser] = useState({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com'
  })

  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  )
}
```

### 2.4 Consumer 消费数据

```typescript
import { useContext } from 'react'
import UserContext from './UserContext'

function UserAvatar() {
  const user = useContext(UserContext)

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  )
}
```

---

## 三、完整示例

### 3.1 主题切换

```typescript
// ThemeContext.ts
import { createContext } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
})

// App.tsx
import { useState } from 'react'
import { ThemeContext } from './ThemeContext'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 使用
function Toolbar() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>
        切换到 {theme === 'light' ? '深色' : '浅色'} 模式
      </button>
    </div>
  )
}
```

### 3.2 用户认证

```typescript
// AuthContext.ts
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(null!)

// AuthProvider.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    setUser(data.user)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 使用
function Navbar() {
  const { user, logout } = useContext(AuthContext)

  if (!user) return <Link to="/login">登录</Link>

  return (
    <div>
      <span>{user.name}</span>
      <button onClick={logout}>退出</button>
    </div>
  )
}
```

---

## 四、Context 更新

### 4.1 通过 Provider 更新

```typescript
function App() {
  const [count, setCount] = useState(0)

  return (
    <CountContext.Provider value={{ count, setCount }}>
      <Child />
    </CountContext.Provider>
  )
}

function Child() {
  const { count, setCount } = useContext(CountContext)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### 4.2 使用 useReducer 管理复杂状态

```typescript
import { useReducer } from 'react'

const initialState = {
  user: null,
  loading: false,
  error: null
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true }
    case 'LOGIN_SUCCESS':
      return { user: action.payload, loading: false, error: null }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...initialState }
    default:
      return state
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const user = await apiLogin(email, password)
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message })
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 五、Context 性能优化

### 5.1 性能问题

Context 值变化时，所有消费该 Context 的组件都会重渲染：

```typescript
// ❌ 问题：每次 App 渲染，所有消费者都重渲染
function App() {
  const [count, setCount] = useState(0)  // count 变化导致 App 重渲染

  return (
    <UserContext.Provider value={{ name: '张三' }}>
      <UserAvatar />  {/* 也会重渲染 */}
    </UserContext.Provider>
  )
}
```

### 5.2 拆分 Context

```typescript
// 拆分为多个 Context
const UserContext = createContext()
const ThemeContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}
```

### 5.3 使用 memo 优化

```typescript
const UserAvatar = memo(function UserAvatar() {
  const user = useContext(UserContext)

  return <div>{user.name}</div>
})
```

### 5.4 使用 useMemo 优化 value

```typescript
function App() {
  const [user, setUser] = useState(null)
  const [count, setCount] = useState(0)

  // ✅ 使用 useMemo 保持 value 引用稳定
  const value = useMemo(() => ({ user, setUser }), [user])

  return (
    <UserContext.Provider value={value}>
      <UserAvatar />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </UserContext.Provider>
  )
}
```

---

## 六、自定义 Hook 封装 Context

### 6.1 创建 useAuth Hook

```typescript
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }

  return context
}
```

### 6.2 使用

```typescript
function Login() {
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 七、Context 使用场景

### 7.1 适合使用 Context 的场景

- ✅ 主题切换（theme）
- ✅ 用户认证（user、login、logout）
- ✅ 国际化（i18n、locale）
- ✅ 路由信息
- ✅ 全局配置

### 7.2 不适合使用 Context 的场景

- ❌ 高频变化的数据（如实时计数器）
- ❌ 只在少数组件间共享的数据（用 props 即可）
- ❌ 复杂的状态逻辑（用 Redux/Zustand）

---

## 八、Context 与状态管理库对比

| 特性           | Context        | Redux          | Zustand        |
| -------------- | -------------- | -------------- | -------------- |
| **复杂度**     | 低             | 高             | 低             |
| **性能**       | 一般（全量更新）| 好             | 好             |
| **中间件**     | ❌             | ✅             | ✅             |
| **DevTools**   | ❌             | ✅             | ✅             |
| **适合场景**   | 低频全局数据   | 复杂应用       | 中等应用       |

---

## 九、总结

### ✅ 关键知识点

1. **createContext**：创建 Context，参数为默认值
2. **Provider**：提供数据给后代组件
3. **useContext**：消费 Context 数据
4. **避免 Prop Drilling**：Context 的主要作用
5. **性能优化**：拆分 Context、useMemo、memo
6. **自定义 Hook**：封装 Context 使用，添加错误检查
7. **使用场景**：主题、认证、国际化等低频全局数据

### 🔜 下一章

- 下一章：[useMemo 与 useCallback](/web/react/hooks/05-usememo-usecallback/)
- 上一章：[useRef 与 DOM](/web/react/hooks/03-useref/)
- 上一级：[Hooks](/web/react/hooks/)
