---
title: 路由守卫
---

# 路由守卫

> 路由守卫控制访问权限，保护敏感页面。

---

## 一、认证守卫

### 1.1 基本认证守卫

```typescript
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // 加载中
  if (loading) {
    return <LoadingSpinner />
  }

  // 未登录
  if (!user) {
    // 记录用户想访问的页面，登录后跳转
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
```

### 1.2 使用守卫

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 受保护路由 */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* 受保护的管理后台 */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 二、角色权限守卫

### 2.1 角色守卫

```typescript
function RoleRoute({ children, roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 检查角色
  if (!roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return children
}

// 使用
<Route path="/admin" element={
  <RoleRoute roles={['admin', 'superadmin']}>
    <Admin />
  </RoleRoute>
} />

<Route path="/editor" element={
  <RoleRoute roles={['editor', 'admin']}>
    <Editor />
  </RoleRoute>
} />
```

### 2.2 权限守卫

```typescript
function PermissionRoute({ children, permissions }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 检查权限
  const hasPermission = permissions.some(p => user.permissions.includes(p))

  if (!hasPermission) {
    return <Navigate to="/403" replace />
  }

  return children
}

// 使用
<Route path="/settings" element={
  <PermissionRoute permissions={['settings:read', 'settings:write']}>
    <Settings />
  </PermissionRoute>
} />
```

---

## 三、布局守卫

### 3.1 守卫布局组件

```typescript
function AuthenticatedLayout() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" replace />

  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />

        {/* 认证路由 */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### 3.2 多角色布局

```typescript
function AdminLayout() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/403" replace />

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

---

## 四、数据加载守卫

### 4.1 loader 守卫

```typescript
import { redirect } from 'react-router-dom'

// 路由 loader
async function protectedLoader({ request }) {
  const token = localStorage.getItem('token')

  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', new URL(request.url).pathname)
    return redirect(url.toString())
  }

  // 验证 token
  try {
    const user = await verifyToken(token)
    return { user }
  } catch {
    localStorage.removeItem('token')
    return redirect('/login')
  }
}

// 路由配置
const router = createBrowserRouter([
  {
    path: '/dashboard',
    loader: protectedLoader,
    element: <Dashboard />,
    errorElement: <ErrorBoundary />
  }
])
```

### 4.2 角色检查 loader

```typescript
async function adminLoader({ request }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return redirect('/login')
  }

  const user = await verifyToken(token)

  if (user.role !== 'admin') {
    return redirect('/403')
  }

  return { user }
}

const router = createBrowserRouter([
  {
    path: '/admin',
    loader: adminLoader,
    element: <Admin />
  }
])
```

---

## 五、登录后跳转

### 5.1 记录来源页面

```typescript
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate
      to="/login"
      state={{ from: location.pathname + location.search }}
      replace
    />
  }

  return children
}
```

### 5.2 登录后跳转

```typescript
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // 获取来源页面
  const from = location.state?.from || '/'

  const handleLogin = async (credentials) => {
    await login(credentials)
    // 跳转回来源页面
    navigate(from, { replace: true })
  }

  return <LoginForm onSubmit={handleLogin} />
}
```

---

## 六、全局守卫

### 6.1 全局认证检查

```typescript
function App() {
  const { loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* 公开路由 */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* 受保护路由 */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 管理员路由 */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### 6.2 守卫组件模式

```typescript
function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

function RoleRoute({ roles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/403" replace />

  return <Outlet />
}
```

---

## 七、路由元信息

### 7.1 定义路由元信息

```typescript
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        meta: { title: '首页', public: true }
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        meta: { title: '仪表盘', auth: true }
      },
      {
        path: 'admin',
        element: <Admin />,
        meta: { title: '管理后台', auth: true, roles: ['admin'] }
      }
    ]
  }
]
```

### 7.2 使用元信息

```typescript
function useRouteMeta() {
  const matches = useMatches()

  const meta = matches.reduce((acc, match) => {
    return { ...acc, ...match.handle?.meta }
  }, {})

  return meta
}

function App() {
  const meta = useRouteMeta()

  useEffect(() => {
    document.title = meta.title || 'My App'
  }, [meta.title])

  return <Routes>...</Routes>
}
```

---

## 八、总结

### ✅ 关键知识点

1. **认证守卫**：检查登录状态
2. **角色守卫**：检查用户角色
3. **权限守卫**：检查具体权限
4. **布局守卫**：在布局层做守卫
5. **loader 守卫**：数据加载时验证
6. **登录跳转**：记录来源页面
7. **全局守卫**：统一处理权限
8. **路由元信息**：路由附加信息

### 🔜 下一章

- 下一章：[Redux 基础](/web/react-ecosystem/redux/01-basics/)
- 上一章：[编程式导航](/web/react-ecosystem/react-router/03-navigation/)
- 上一级：[React Router](/web/react-ecosystem/react-router/)
