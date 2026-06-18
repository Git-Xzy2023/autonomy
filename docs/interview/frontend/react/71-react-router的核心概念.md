---
title: "React Router 的核心概念"
---

# React Router 的核心概念

**Q1: React Router 的核心概念有哪些？**

| 概念        | 说明                                 |
| ----------- | ------------------------------------ |
| Router      | 路由容器（BrowserRouter/HashRouter） |
| Routes      | 路由匹配容器                         |
| Route       | 单个路由规则                         |
| Link        | 声明式导航                           |
| NavLink     | 带激活状态的 Link                    |
| useNavigate | 编程式导航                           |
| useParams   | 获取路由参数                         |
| useLocation | 获取当前 URL 信息                    |
| Outlet      | 嵌套路由的出口                       |

```jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
  useNavigate,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/users/123">用户</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="posts" element={<UserPosts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Q2: BrowserRouter 和 HashRouter 的区别？**

| 特性       | BrowserRouter                   | HashRouter            |
| ---------- | ------------------------------- | --------------------- |
| URL 格式   | `example.com/about`             | `example.com/#/about` |
| 服务器配置 | 需要（所有路径返回 index.html） | 不需要                |
| SEO        | 更友好                          | 较差                  |
| 兼容性     | 现代浏览器                      | 所有浏览器            |
| 原理       | History API（pushState）        | hashchange 事件       |

```jsx
// BrowserRouter：需要服务器配置
// Nginx:
// location / {
//   try_files $uri $uri/ /index.html;
// }

// HashRouter：不需要服务器配置
// URL 中有 #，如 http://example.com/#/about
```

**Q3: 嵌套路由怎么实现？**

```jsx
// 路由定义
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>;

// 父组件用 Outlet 指定子路由渲染位置
function DashboardLayout() {
  return (
    <div>
      <Sidebar>
        <Link to="/dashboard">首页</Link>
        <Link to="/dashboard/analytics">分析</Link>
        <Link to="/dashboard/settings">设置</Link>
      </Sidebar>
      <main>
        <Outlet /> {/* 子路由在这里渲染 */}
      </main>
    </div>
  );
}

// 访问 /dashboard → DashboardLayout + DashboardHome
// 访问 /dashboard/analytics → DashboardLayout + Analytics
```

**Q4: 路由参数和查询参数的区别？**

```jsx
// 路由参数（URL 参数）：定义在路由路径中
<Route path="/users/:id" element={<User />} />;

function User() {
  const { id } = useParams(); // { id: '123' }
  return <div>User ID: {id}</div>;
}
// URL: /users/123 → id = '123'

// 查询参数：URL 中 ? 后面的部分
function Search() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q"); // 'react'
  return <div>搜索：{query}</div>;
}
// URL: /search?q=react → query = 'react'

// React Router v6 的 useSearchParams
function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  return <div>搜索：{query}</div>;
}
```

**Q5: 编程式导航怎么实现？**

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      // 导航到指定路径
      navigate("/dashboard");

      // 替换历史记录（不能后退回来）
      navigate("/dashboard", { replace: true });

      // 后退/前进
      navigate(-1); // 后退
      navigate(1); // 前进

      // 传递 state（不显示在 URL 中）
      navigate("/dashboard", { state: { fromLogin: true } });
    }
  };

  return <button onClick={handleLogin}>登录</button>;
}

// 接收 state
function Dashboard() {
  const location = useLocation();
  console.log(location.state); // { fromLogin: true }
}
```

**Q6: React Router v6 相比 v5 有什么变化？**

::: v-pre
| 特性 | v5 | v6 |
| ---------- | --------------------------- | --------------------------- |
| 路由切换 | `<Switch>` | `<Routes>` |
| 路由属性 | `component={Home}` | `element={<Home />}` |
| 嵌套路由 | 复杂的配置 | 简洁的嵌套 `<Route>` |
| 重定向 | `<Redirect>` | `<Navigate>` |
| 路由匹配 | 相对路径需完整写 | 支持相对路径 |
| 包体积 | 较大 | 减小约 60% |
| 类型安全 | 较弱 | 更好的 TS 支持 |
:::

```jsx
// v5
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about">
    <About />
  </Route>
  <Redirect from="/old" to="/new" />
</Switch>

// v6
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/old" element={<Navigate to="/new" replace />} />
</Routes>
```

---
