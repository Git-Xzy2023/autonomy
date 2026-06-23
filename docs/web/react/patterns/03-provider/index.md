---
title: Provider 模式
---

# Provider 模式

> Provider 模式通过 Context 将状态和逻辑提供给整个应用或部分组件树。

---

## 一、Provider 模式概述

### 1.1 什么是 Provider 模式？

```
┌─────────────────────────────────────────┐
│              Provider 模式              │
├─────────────────────────────────────────┤
│                                         │
│  通过 Context.Provider 提供全局状态     │
│                                         │
│  特点：                                  │
│  ├── 集中管理状态                       │
│  ├── 跨组件共享数据                     │
│  ├── 封装业务逻辑                       │
│  └── 易于测试                           │
│                                         │
│  适用场景：                              │
│  ├── 用户认证                           │
│  ├── 主题切换                           │
│  ├── 国际化                             │
│  └── 全局通知                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、Provider 模式实现

### 2.1 基本结构

```typescript
// 1. 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. 创建 Provider 组件
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 业务逻辑
  const login = async (email, password) => {
    setLoading(true)
    try {
      const user = await api.login(email, password)
      setUser(user)
      localStorage.setItem('token', user.token)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  // 初始化：检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.getCurrentUser().then(setUser).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. 创建自定义 Hook
function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return context
}

export { AuthProvider, useAuth }
```

### 2.2 使用

```typescript
// App.tsx
import { AuthProvider } from './contexts/AuthContext'

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
import { useAuth } from './contexts/AuthContext'

function Login() {
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// Header.tsx
function Header() {
  const { user, logout } = useAuth()

  return (
    <header>
      {user ? (
        <>
          <span>{user.name}</span>
          <button onClick={logout}>退出</button>
        </>
      ) : (
        <Link to="/login">登录</Link>
      )}
    </header>
  )
}
```

---

## 三、多个 Provider 组合

### 3.1 Provider 嵌套

```typescript
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <Router>
              <App />
            </Router>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
```

### 3.2 Provider 组合组件

```typescript
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

// 使用
function App() {
  return (
    <AppProviders>
      <Router>
        <Routes />
      </Router>
    </AppProviders>
  )
}
```

---

## 四、常见 Provider 实现

### 4.1 ThemeProvider

```typescript
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 从 localStorage 读取
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved

    // 从系统偏好读取
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    // 应用主题到 document
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme 必须在 ThemeProvider 内使用')
  return context
}
```

### 4.2 NotificationProvider

```typescript
interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface NotificationContextType {
  notifications: Notification[]
  notify: (message: string, type?: Notification['type']) => void
  dismiss: (id: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const dismiss = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const notify = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])

    // 3 秒后自动消失
    setTimeout(() => dismiss(id), 3000)
  }, [dismiss])

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  )
}

function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification 必须在 NotificationProvider 内使用')
  return context
}
```

### 4.3 I18nProvider

```typescript
interface I18nContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, params?: Record<string, string>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

function I18nProvider({ children, messages }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'zh'
  })

  useEffect(() => {
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  }, [locale])

  const t = useCallback((key: string, params?: Record<string, string>) => {
    let message = messages[locale]?.[key] || key

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        message = message.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      })
    }

    return message
  }, [locale, messages])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n 必须在 I18nProvider 内使用')
  return context
}
```

---

## 五、Provider 性能优化

### 5.1 拆分 Context

```typescript
// ❌ 单个 Context：任何值变化都触发所有消费者重渲染
const AppContext = createContext()

// ✅ 拆分为状态和操作
const AppStateContext = createContext()
const AppDispatchContext = createContext()

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}
```

### 5.2 使用 useMemo 优化 value

```typescript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

---

## 六、Provider 测试

### 6.1 测试组件

```typescript
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function TestComponent() {
  const { user, login, logout } = useAuth()

  return (
    <div>
      <span>{user?.name || '未登录'}</span>
      <button onClick={() => login('test@test.com', 'password')}>登录</button>
      <button onClick={logout}>退出</button>
    </div>
  )
}

test('AuthProvider 提供认证功能', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  )

  expect(screen.getByText('未登录')).toBeInTheDocument()
})
```

### 6.2 Mock Provider

```typescript
function MockAuthProvider({ children, user = null }) {
  return (
    <AuthContext.Provider value={{
      user,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false
    }}>
      {children}
    </AuthContext.Provider>
  )
}

test('显示用户信息', () => {
  render(
    <MockAuthProvider user={{ name: '张三' }}>
      <TestComponent />
    </MockAuthProvider>
  )

  expect(screen.getByText('张三')).toBeInTheDocument()
})
```

---

## 七、总结

### ✅ 关键知识点

1. **Provider 模式**：通过 Context 提供全局状态
2. **基本结构**：Context + Provider + 自定义 Hook
3. **多 Provider 组合**：嵌套或组合组件
4. **常见 Provider**：Theme、Auth、Notification、I18n
5. **性能优化**：拆分 Context、useMemo
6. **测试**：Mock Provider 简化测试

### 🔜 下一章

- 下一章：[Jest 基础](/web/react/testing/01-jest/)
- 上一章：[自定义 Hook 模式](/web/react/patterns/02-custom-hooks/)
- 上一级：[React 设计模式](/web/react/patterns/)
