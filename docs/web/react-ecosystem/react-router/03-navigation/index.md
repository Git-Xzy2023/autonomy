---
title: 编程式导航
---

# 编程式导航

> 使用 JavaScript 进行路由跳转。

---

## 一、useNavigate

### 1.1 基本用法

```typescript
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login(username, password)
    // 跳转到首页
    navigate('/')
    // 或指定路径
    navigate('/dashboard')
  }

  return <button onClick={handleLogin}>登录</button>
}
```

### 1.2 导航选项

```typescript
function MyComponent() {
  const navigate = useNavigate()

  const handleClick = () => {
    // 替换当前历史记录（不留下历史）
    navigate('/about', { replace: true })

    // 携带 state
    navigate('/users/1', { state: { from: 'list' } })

    // 返回上一页
    navigate(-1)

    // 前进
    navigate(1)

    // 返回多页
    navigate(-2)
  }
}
```

---

## 二、传递状态

### 2.1 通过 state 传递

```typescript
// 发送方
function UserList() {
  const navigate = useNavigate()

  const handleClick = (user) => {
    navigate(`/users/${user.id}`, {
      state: { user }  // 传递整个用户对象
    })
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => handleClick(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  )
}

// 接收方
function UserDetail() {
  const location = useLocation()
  const user = location.state?.user

  if (user) {
    return <div>{user.name}</div>
  }

  // 如果没有 state，从 API 获取
  return <div>加载中...</div>
}
```

### 2.2 通过 URL 参数传递

```typescript
// 发送方
function SearchPage() {
  const navigate = useNavigate()

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return <input onKeyDown={e => {
    if (e.key === 'Enter') {
      handleSearch(e.target.value)
    }
  }} />
}

// 接收方
function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  return <div>搜索：{query}</div>
}
```

---

## 三、useLocation

### 3.1 获取当前位置

```typescript
import { useLocation } from 'react-router-dom'

function MyComponent() {
  const location = useLocation()

  console.log(location.pathname)  // 当前路径
  console.log(location.search)    // 查询字符串
  console.log(location.hash)      // hash
  console.log(location.state)     // state
  console.log(location.key)       // 唯一标识

  return <div>当前路径：{location.pathname}</div>
}
```

### 3.2 监听路由变化

```typescript
function App() {
  const location = useLocation()

  useEffect(() => {
    // 路由变化时执行
    console.log('路由变化：', location.pathname)

    // 例如：发送页面访问统计
    analytics.page(location.pathname)
  }, [location])

  return <Routes>...</Routes>
}
```

---

## 四、useMatch

### 4.1 匹配当前路由

```typescript
import { useMatch } from 'react-router-dom'

function Navigation() {
  const isHome = useMatch('/')
  const isUserPage = useMatch('/users/:id')

  return (
    <nav>
      <Link to="/" className={isHome ? 'active' : ''}>首页</Link>
      <Link to="/users" className={isUserPage ? 'active' : ''}>用户</Link>
    </nav>
  )
}
```

---

## 五、useResolvedPath

### 5.1 解析路径

```typescript
import { useResolvedPath } from 'react-router-dom'

function Breadcrumb() {
  const path = useResolvedPath('/users/123')

  console.log(path)
  // { pathname: '/users/123', search: '', hash: '' }

  return <div>面包屑</div>
}
```

---

## 六、重定向

### 6.1 Navigate 组件

```typescript
import { Navigate } from 'react-router-dom'

function ProtectedPage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <div>受保护的内容</div>
}
```

### 6.2 条件重定向

```typescript
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/old-path" element={<Navigate to="/" replace />} />
      <Route path="/users" element={<UserList />} />
    </Routes>
  )
}
```

### 6.3 路由配置重定向

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Navigate to="/" replace /> },
      { path: 'users', element: <UserList /> }
    ]
  }
])
```

---

## 七、路由守卫

### 7.1 认证守卫

```typescript
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

### 7.2 角色守卫

```typescript
function RoleRoute({ children, roles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return children
}

// 使用
<Route path="/admin" element={
  <RoleRoute roles={['admin']}>
    <Admin />
  </RoleRoute>
} />
```

---

## 八、滚动恢复

### 8.1 滚动到顶部

```typescript
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>...</Routes>
    </BrowserRouter>
  )
}
```

### 8.2 恢复滚动位置

```typescript
function ScrollRestoration() {
  const { pathname } = useLocation()
  const scrollPositions = useRef(new Map())

  // 保存滚动位置
  useEffect(() => {
    return () => {
      scrollPositions.current.set(pathname, window.scrollY)
    }
  }, [pathname])

  // 恢复滚动位置
  useEffect(() => {
    const saved = scrollPositions.current.get(pathname)
    if (saved !== undefined) {
      window.scrollTo(0, saved)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
```

---

## 九、总结

### ✅ 关键知识点

1. **useNavigate**：编程式导航
2. **传递状态**：state 或 URL 参数
3. **useLocation**：获取当前位置
4. **useMatch**：匹配当前路由
5. **Navigate**：组件式重定向
6. **路由守卫**：认证、角色控制
7. **滚动恢复**：ScrollToTop、ScrollRestoration

### 🔜 下一章

- 下一章：[路由守卫](/web/react-ecosystem/react-router/04-guards/)
- 上一章：[嵌套路由](/web/react-ecosystem/react-router/02-nested/)
- 上一级：[React Router](/web/react-ecosystem/react-router/)
