---
title: 嵌套路由
---

# 嵌套路由

> 嵌套路由让复杂的页面结构更清晰。

---

## 一、嵌套路由基础

### 1.1 基本结构

```
┌─────────────────────────────────────────┐
│              嵌套路由结构               │
├─────────────────────────────────────────┤
│                                         │
│  /                                      │
│  └── Layout                             │
│      ├── index → Home                   │
│      ├── about → About                  │
│      └── users/                         │
│          ├── index → UserList           │
│          ├── :id → UserDetail           │
│          └── new → NewUser              │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 基本实现

```typescript
function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/users">用户</Link>
      </nav>
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="users" element={<UsersLayout />}>
            <Route index element={<UserList />} />
            <Route path=":id" element={<UserDetail />} />
            <Route path="new" element={<NewUser />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 二、多级嵌套

### 2.1 用户管理示例

```typescript
function UsersLayout() {
  return (
    <div>
      <h2>用户管理</h2>
      <Outlet />
    </div>
  )
}

function UserList() {
  const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ]

  return (
    <div>
      <h3>用户列表</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function UserDetail() {
  const { id } = useParams()

  return (
    <div>
      <h3>用户详情</h3>
      <p>用户 ID: {id}</p>
      <Link to="edit">编辑</Link>
      <Outlet />  {/* 可以继续嵌套 */}
    </div>
  )
}

function UserEdit() {
  return <div>编辑用户</div>
}

// 路由配置
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="users" element={<UsersLayout />}>
            <Route index element={<UserList />} />
            <Route path=":id" element={<UserDetail />}>
              <Route path="edit" element={<UserEdit />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 三、Index 路由

### 3.1 index 路由作用

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 当访问 / 时渲染 Home */}
          <Route index element={<Home />} />

          <Route path="about" element={<About />} />
          <Route path="users" element={<UsersLayout />}>
            {/* 当访问 /users 时渲染 UserList */}
            <Route index element={<UserList />} />
            <Route path=":id" element={<UserDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 四、相对路径

### 4.1 相对路径导航

```typescript
function UserDetail() {
  return (
    <div>
      <h3>用户详情</h3>
      {/* 相对路径 */}
      <Link to="edit">编辑</Link>
      <Link to="../">返回列表</Link>
      <Link to="../../">返回首页</Link>
    </div>
  )
}
```

### 4.2 相对路径规则

```
当前路径：/users/123

to="edit"        → /users/123/edit
to="./edit"      → /users/123/edit
to="../"         → /users
to="../456"      → /users/456
to="../../"      → /
to="/about"      → /about（绝对路径）
```

---

## 五、动态路由嵌套

### 5.1 多级动态路由

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="categories" element={<Categories />}>
            <Route path=":categoryId" element={<CategoryDetail />}>
              <Route path="products" element={<ProductList />}>
                <Route path=":productId" element={<ProductDetail />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

// 访问：/categories/1/products/2
// 渲染：Layout > Categories > CategoryDetail > ProductList > ProductDetail
```

### 5.2 获取多级参数

```typescript
function ProductDetail() {
  const { categoryId, productId } = useParams()

  return (
    <div>
      <p>分类：{categoryId}</p>
      <p>商品：{productId}</p>
    </div>
  )
}
```

---

## 六、布局组合

### 6.1 多布局应用

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开布局 */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 管理布局（需要认证） */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function ProtectedLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
```

### 6.2 错误边界

```typescript
function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div>
      <h1>出错了</h1>
      <p>{error.message}</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
          <Route index element={<Home />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 七、总结

### ✅ 关键知识点

1. **嵌套路由**：Route 嵌套 + Outlet
2. **Index 路由**：父路由的默认页面
3. **相对路径**：to="edit"、to="../"
4. **多级嵌套**：支持任意层级
5. **多布局**：不同路由使用不同布局
6. **错误边界**：errorElement 处理错误

### 🔜 下一章

- 下一章：[编程式导航](/web/react-ecosystem/react-router/03-navigation/)
- 上一章：[基础](/web/react-ecosystem/react-router/01-basics/)
- 上一级：[React Router](/web/react-ecosystem/react-router/)
