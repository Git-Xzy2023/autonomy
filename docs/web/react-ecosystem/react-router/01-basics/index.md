---
title: React Router 基础
---

# React Router 基础

> 学习 React Router 的基本概念和使用方法。

---

## 一、安装

### 1.1 安装 React Router

```bash
npm install react-router-dom
```

### 1.2 版本说明

```
┌─────────────────────────────────────────┐
│           React Router 版本             │
├─────────────────────────────────────────┤
│                                         │
│  v6（推荐）                             │
│  ├── 更简洁的 API                       │
│  ├── 性能更好                           │
│  └── 更严格的类型支持                   │
│                                         │
│  v7（最新）                             │
│  ├── 合并了 Remix                       │
│  ├── 支持数据加载                       │
│  └── 更强大的功能                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、基本使用

### 2.1 路由配置

```typescript
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

// 页面组件
function Home() {
  return <h1>首页</h1>
}

function About() {
  return <h1>关于</h1>
}

function Contact() {
  return <h1>联系</h1>
}

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  }
])

// 应用
function App() {
  return <RouterProvider router={router} />
}
```

### 2.2 使用 Routes 和 Route

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 三、导航

### 3.1 Link 组件

```typescript
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Link to="/contact">联系</Link>
    </nav>
  )
}
```

### 3.2 NavLink 组件

```typescript
import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        首页
      </NavLink>
      <NavLink
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? 'red' : 'black'
        })}
      >
        关于
      </NavLink>
    </nav>
  )
}
```

### 3.3 404 页面

```typescript
function NotFound() {
  return <h1>404 - 页面不存在</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 四、路由参数

### 4.1 动态路由

```typescript
// 路由配置
<Route path="/users/:id" element={<UserDetail />} />

// 获取参数
import { useParams } from 'react-router-dom'

function UserDetail() {
  const { id } = useParams()

  return <h1>用户 ID: {id}</h1>
}
```

### 4.2 查询参数

```typescript
import { useSearchParams } from 'react-router-dom'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query || '', page: String(newPage) })
  }

  return (
    <div>
      <p>搜索：{query}</p>
      <p>页码：{page}</p>
      <button onClick={() => handlePageChange(2)}>下一页</button>
    </div>
  )
}
```

### 4.3 多个参数

```typescript
// 路由
<Route path="/posts/:category/:id" element={<PostDetail />} />

// 获取
function PostDetail() {
  const { category, id } = useParams()
  return <h1>{category} - 文章 {id}</h1>
}
```

---

## 五、布局路由

### 5.1 基本布局

```typescript
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>导航栏</header>
      <main>
        <Outlet />  {/* 子路由渲染位置 */}
      </main>
      <footer>页脚</footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### 5.2 多个布局

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 管理后台布局 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 前台布局 */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 六、路由配置方式

### 6.1 JSX 配置

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 6.2 对象配置

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  }
])

function App() {
  return <RouterProvider router={router} />
}
```

### 6.3 集中式路由配置

```typescript
// routes.tsx
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'users/:id', element: <UserDetail /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]

// App.tsx
function App() {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}
```

---

## 七、总结

### ✅ 关键知识点

1. **安装**：`react-router-dom`
2. **路由配置**：createBrowserRouter 或 Routes/Route
3. **导航**：Link、NavLink
4. **路由参数**：useParams、useSearchParams
5. **布局路由**：Outlet 实现嵌套布局
6. **404**：`path="*"` 匹配所有未定义路由

### 🔜 下一章

- 下一章：[嵌套路由](/web/react-ecosystem/react-router/02-nested/)
- 上一级：[React Router](/web/react-ecosystem/react-router/)
