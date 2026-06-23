---
title: 组件化架构
---

# 组件化架构

> 组件化是现代前端开发的核心思想，将 UI 拆分为独立、可复用的组件。

---

## 一、什么是组件化

### 1.1 概念

组件化是将复杂的 UI 拆分为独立、可复用的小块（组件），每个组件管理自己的状态和视图。

```
┌─────────────────────────────────────────┐
│           组件化思想                    │
├─────────────────────────────────────────┤
│                                         │
│  传统开发：                             │
│  一个 HTML 文件包含所有内容             │
│  HTML/CSS/JS 分离                       │
│                                         │
│  组件化开发：                           │
│  UI 拆分为独立组件                      │
│  每个组件包含 HTML/CSS/JS               │
│  组件可复用、可组合                     │
│                                         │
│  好处：                                 │
│  ✅ 复用性高                            │
│  ✅ 维护性好                            │
│  ✅ 团队协作方便                        │
│  ✅ 可测试                              │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 组件的组成

```typescript
// 一个完整的组件包含
interface Component {
  // 1. 视图（Template/JSX）
  template: string

  // 2. 样式（CSS）
  styles: string

  // 3. 逻辑（JavaScript）
  script: {
    state: any          // 状态
    props: any          // 属性
    methods: any        // 方法
    lifecycle: any      // 生命周期
  }
}
```

---

## 二、组件设计原则

### 2.1 单一职责原则

```typescript
// ❌ 不好：一个组件做太多事
function UserDashboard() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

  // 获取用户、文章、评论...
  // 渲染所有内容...

  return (
    <div>
      {/* 大量代码 */}
    </div>
  )
}

// ✅ 好：每个组件只做一件事
function UserDashboard() {
  return (
    <>
      <UserProfile />
      <UserPosts />
      <UserComments />
    </>
  )
}
```

### 2.2 开闭原则

```typescript
// 通过组合扩展，而非修改原有组件
// ❌ 不好：不断修改 Button 组件
function Button({ label, variant, size, icon, loading, disabled }) {
  // 越来越多的 props
}

// ✅ 好：基础组件 + 组合扩展
function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
}

// 通过组合扩展
function IconButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      <Icon name={icon} />
      {children}
    </Button>
  )
}

function LoadingButton({ loading, children, ...props }) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? <Spinner /> : children}
    </Button>
  )
}
```

### 2.3 受控与非受控

```typescript
// 受控组件：状态由父组件控制
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />
}

// 非受控组件：状态由组件自身管理
function UncontrolledInput({ defaultValue }) {
  const inputRef = useRef(null)
  return <input ref={inputRef} defaultValue={defaultValue} />
}

// 同时支持两种模式
function FlexibleInput({ value, defaultValue, onChange }) {
  const isControlled = value !== undefined

  return (
    <input
      value={isControlled ? value : undefined}
      defaultValue={!isControlled ? defaultValue : undefined}
      onChange={e => onChange?.(e.target.value)}
    />
  )
}
```

---

## 三、组件通信

### 3.1 父子通信

```typescript
// 父 → 子：Props
function Parent() {
  return <Child message="hello" />
}

function Child({ message }) {
  return <div>{message}</div>
}

// 子 → 父：回调函数
function Parent() {
  const handleClick = (data) => {
    console.log('子组件传来的数据:', data)
  }

  return <Child onEvent={handleClick} />
}

function Child({ onEvent }) {
  return <button onClick={() => onEvent('child data')}>点击</button>
}
```

### 3.2 兄弟通信

```typescript
// 通过共同的父组件
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Counter value={count} />
      <Button onClick={() => setCount(c => c + 1)} />
    </>
  )
}
```

### 3.3 跨层通信

```typescript
// Context API
const ThemeContext = createContext()

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  )
}

function Header() {
  return <Nav />  // 不需要传递 theme
}

function Nav() {
  const theme = useContext(ThemeContext)  // 直接获取
  return <nav className={theme}>...</nav>
}
```

### 3.4 全局状态

```typescript
// Redux / Zustand 等状态管理
import { useStore } from 'zustand'

function CartButton() {
  const items = useStore(state => state.items)
  const addItem = useStore(state => state.addItem)

  return (
    <button onClick={() => addItem('product')}>
      购物车 ({items.length})
    </button>
  )
}
```

---

## 四、组件类型

### 4.1 展示组件 vs 容器组件

```typescript
// 展示组件：只关心 UI
function UserList({ users, onSelect }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  )
}

// 容器组件：关心数据获取和逻辑
function UserListContainer() {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  return <UserList users={users} onSelect={setSelected} />
}
```

### 4.2 自定义 Hooks 组件

```typescript
// 将逻辑提取为自定义 Hook
function useUserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  return { users, loading }
}

// 使用
function UserList() {
  const { users, loading } = useUserList()

  if (loading) return <div>加载中...</div>
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### 4.3 高阶组件（HOC）

```typescript
function withFetch(WrappedComponent, url) {
  return function EnhancedComponent(props) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false))
    }, [])

    return <WrappedComponent data={data} loading={loading} {...props} />
  }
}

const UserList = withFetch(({ data, loading }) => {
  if (loading) return <div>加载中...</div>
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}, '/api/users')
```

### 4.4 Render Props

```typescript
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [url])

  return render({ data, loading })
}

// 使用
<DataFetcher
  url="/api/users"
  render={({ data, loading }) => {
    if (loading) return <div>加载中...</div>
    return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
  }}
/>
```

---

## 五、组件库设计

### 5.1 组件库结构

```
┌─────────────────────────────────────────┐
│           组件库分层                    │
├─────────────────────────────────────────┤
│                                         │
│  基础层（Atoms）                        │
│  ├── Button、Input、Icon               │
│  └── 最小粒度组件                      │
│                                         │
│  组合层（Molecules）                    │
│  ├── Form、SearchBar                   │
│  └── 多个基础组件组合                  │
│                                         │
│  业务层（Organisms）                    │
│  ├── Header、Sidebar                   │
│  └── 特定业务场景组件                  │
│                                         │
│  模板层（Templates）                    │
│  ├── DashboardLayout                   │
│  └── 页面布局模板                      │
│                                         │
│  页面层（Pages）                        │
│  ├── HomePage、UserPage                │
│  └── 完整页面                          │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 组件 API 设计

```typescript
// 良好的 API 设计
interface ButtonProps {
  // 1. 类型明确
  variant?: 'primary' | 'secondary' | 'danger'  // 联合类型
  size?: 'small' | 'medium' | 'large'

  // 2. 默认值合理
  loading?: boolean  // 默认 false

  // 3. 可组合
  children?: React.ReactNode

  // 4. 事件回调
  onClick?: (event: React.MouseEvent) => void

  // 5. 透传原生属性
  [key: string]: any
}

// 使用
<Button variant="primary" size="large" onClick={handleClick}>
  点击
</Button>
```

---

## 六、总结

### ✅ 关键知识点

1. **组件化思想**：UI 拆分为独立、可复用的组件
2. **设计原则**：单一职责、开闭原则
3. **组件通信**：Props、回调、Context、状态管理
4. **组件类型**：展示/容器、HOC、Render Props、自定义 Hooks
5. **组件库分层**：原子 → 分子 → 组织 → 模板 → 页面

### 🔜 下一章

- 下一章：[微前端](/web/architecture/architecture-patterns/03-micro-frontends/)
- 上一章：[MVC/MVP/MVVM](/web/architecture/architecture-patterns/01-mvc-mvp-mvvm/)
- 上一级：[架构模式](/web/architecture/architecture-patterns/)
