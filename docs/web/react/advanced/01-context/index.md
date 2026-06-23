---
title: Context API 深入
---

# Context API 深入

> Context API 是 React 提供的跨组件数据传递方案，本章深入介绍其原理和最佳实践。

---

## 一、Context API 概述

### 1.1 解决的问题

```
┌─────────────────────────────────────────┐
│           Prop Drilling 问题            │
├─────────────────────────────────────────┤
│                                         │
│  App                                    │
│   └─ props ─▶ Layout                   │
│                └─ props ─▶ Sidebar     │
│                             └─ props ─▶ UserAvatar │
│                                         │
│  问题：中间层组件不需要数据但仍需传递   │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           Context 解决方案              │
├─────────────────────────────────────────┤
│                                         │
│  App                                    │
│   └─ <UserContext.Provider>             │
│        └─ Layout（无需 props）          │
│             └─ Sidebar（无需 props）    │
│                  └─ UserAvatar          │
│                       └─ useContext()   │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 API 组成

| API                    | 作用                       |
| ---------------------- | -------------------------- |
| `createContext`        | 创建 Context               |
| `Provider`             | 提供数据                   |
| `Consumer`             | 消费数据（旧 API）         |
| `useContext`           | 消费数据（Hook，推荐）     |
| `contextType`          | 类组件消费 Context         |

---

## 二、创建 Context

### 2.1 基本创建

```typescript
import { createContext } from 'react'

// 创建 Context，参数为默认值
const ThemeContext = createContext('light')

export default ThemeContext
```

### 2.2 TypeScript 类型

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface UserContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// 创建带类型的 Context
const UserContext = createContext<UserContextType | undefined>(undefined)
```

---

## 三、Provider 提供数据

### 3.1 基本 Provider

```typescript
function App() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  )
}
```

### 3.2 嵌套 Provider

```typescript
function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={{ user, setUser }}>
        <AuthContext.Provider value={{ login, logout }}>
          <Layout />
        </AuthContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}
```

### 3.3 动态 Provider

```typescript
function App() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <UserContext.Provider value={currentUser}>
      <ThemeContext.Provider value={currentUser?.preferences.theme || 'light'}>
        <Layout />
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
```

---

## 四、消费 Context

### 4.1 useContext Hook（推荐）

```typescript
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

function Button() {
  const theme = useContext(ThemeContext)

  return (
    <button style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      按钮
    </button>
  )
}
```

### 4.2 Consumer 组件

```typescript
function Button() {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <button style={{ background: theme === 'light' ? '#fff' : '#333' }}>
          按钮
        </button>
      )}
    </ThemeContext.Consumer>
  )
}
```

### 4.3 类组件 contextType

```typescript
class Button extends Component {
  static contextType = ThemeContext

  render() {
    const theme = this.context
    return <button>{theme}</button>
  }
}
```

---

## 五、Context 更新

### 5.1 通过 Provider value 更新

```typescript
function App() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
      <Layout />
    </ThemeContext.Provider>
  )
}
```

### 5.2 在 Context 中提供更新方法

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
})

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const value = {
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={value}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 使用
function Toolbar() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>切换</button>
    </div>
  )
}
```

---

## 六、Context 最佳实践

### 6.1 封装 Provider 组件

```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
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

// 自定义 Hook
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
// App.tsx
import { AuthProvider } from './AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  )
}

// Login.tsx
import { useAuth } from './AuthContext'

function Login() {
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 七、Context 性能优化

### 7.1 性能问题

Context 值变化时，所有消费该 Context 的组件都会重渲染：

```typescript
// ❌ 问题：value 每次都是新对象
function App() {
  const [user, setUser] = useState(null)
  const [count, setCount] = useState(0)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <UserAvatar />  {/* count 变化时也会重渲染 */}
    </UserContext.Provider>
  )
}
```

### 7.2 优化方案 1：useMemo

```typescript
function App() {
  const [user, setUser] = useState(null)
  const [count, setCount] = useState(0)

  const value = useMemo(() => ({ user, setUser }), [user])

  return (
    <UserContext.Provider value={value}>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <UserAvatar />  {/* count 变化时不会重渲染 */}
    </UserContext.Provider>
  )
}
```

### 7.3 优化方案 2：拆分 Context

```typescript
// 拆分为状态和 dispatch
const UserStateContext = createContext<User | null>(null)
const UserDispatchContext = createContext<Dispatch<UserAction> | null>(null)

function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

// 消费时按需选择
function UserAvatar() {
  const user = useContext(UserStateContext)  // 只在 user 变化时重渲染
  return <div>{user?.name}</div>
}

function LogoutButton() {
  const dispatch = useContext(UserDispatchContext)  // dispatch 引用稳定
  return <button onClick={() => dispatch({ type: 'LOGOUT' })}>退出</button>
}
```

---

## 八、Context 使用场景

### 8.1 适合的场景

- ✅ 主题切换
- ✅ 用户认证
- ✅ 国际化（i18n）
- ✅ 路由信息
- ✅ 全局配置
- ✅ 通知/消息系统

### 8.2 不适合的场景

- ❌ 高频变化的数据（如实时计数器）
- ❌ 简单的父子组件通信（用 props）
- ❌ 复杂的状态管理（用 Redux/Zustand）

---

## 九、总结

### ✅ 关键知识点

1. **createContext**：创建 Context，参数为默认值
2. **Provider**：提供数据给后代组件
3. **useContext**：Hook 方式消费 Context（推荐）
4. **封装 Provider**：将 Provider 逻辑封装为组件
5. **自定义 Hook**：封装 Context 使用，添加错误检查
6. **性能优化**：useMemo、拆分 Context
7. **使用场景**：低频全局数据（主题、认证、i18n）

### 🔜 下一章

- 下一章：[Refs 与 forwardRef](/web/react/advanced/02-refs/)
- 上一章：[Hooks](/web/react/hooks/)
- 上一级：[React 进阶特性](/web/react/advanced/)
