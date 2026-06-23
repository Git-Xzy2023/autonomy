---
title: 组件与 Props
---

# 组件与 Props

> 组件是 React 的核心概念，Props 是组件间通信的基础。本章介绍如何定义和使用组件。

---

## 一、什么是组件？

组件是将 UI 拆分为独立、可复用部分的单元，类似 JavaScript 函数。

```typescript
// 一个简单的组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// 使用组件
const element = <Welcome name="张三" />
```

### 组件的分类

```
┌─────────────────────────────────────────┐
│              React 组件                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  函数组件    │  │   类组件         │  │
│  │  (推荐)     │  │  (旧代码)        │  │
│  └─────────────┘  └─────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、函数组件

现代 React 推荐使用函数组件（配合 Hooks）。

### 2.1 定义函数组件

```typescript
// 方式一：函数声明
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// 方式二：箭头函数
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>
}

// 方式三：解构 props
const Welcome = ({ name }) => {
  return <h1>Hello, {name}</h1>
}
```

### 2.2 组件命名规范

- 组件名必须以**大写字母**开头
- React 会将以小写字母开头的标签视为 HTML 标签

```typescript
// ✅ 正确：大写开头
function MyComponent() {
  return <div>组件</div>
}

// ❌ 错误：小写开头（会被当作 HTML 标签）
function myComponent() {
  return <div>组件</div>
}
```

### 2.3 组件返回值

组件必须返回一个 React 元素（或 null、数组、Fragment）：

```typescript
// 返回单个元素
function App() {
  return <div>Hello</div>
}

// 返回 Fragment
function App() {
  return (
    <>
      <h1>标题</h1>
      <p>段落</p>
    </>
  )
}

// 返回数组（需提供 key）
function App() {
  return [
    <li key="1">第一项</li>,
    <li key="2">第二项</li>
  ]
}

// 返回 null
function App({ show }) {
  if (!show) return null
  return <div>内容</div>
}
```

---

## 三、类组件

类组件是 React 的传统写法，了解即可（新项目使用函数组件）。

```typescript
import { Component } from 'react'

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

### 类组件 vs 函数组件

| 特性         | 函数组件       | 类组件              |
| ------------ | -------------- | ------------------- |
| **语法**     | 函数           | ES6 class           |
| **状态**     | useState Hook  | this.state          |
| **生命周期** | useEffect Hook | 生命周期方法        |
| **this**     | 无             | 需要绑定 this       |
| **性能**     | 略好           | 略差                |
| **推荐**     | ✅ 推荐        | ❌ 仅旧项目          |

---

## 四、Props 详解

Props 是组件的输入，从父组件传递给子组件，**只读不可修改**。

### 4.1 传递 Props

```typescript
function App() {
  return (
    <UserCard
      name="张三"
      age={25}
      isActive={true}
      hobbies={['阅读', '编程']}
      address={{ city: '北京', street: '朝阳路' }}
      onEdit={() => console.log('编辑')}
    />
  )
}
```

### 4.2 接收 Props

```typescript
// 方式一：直接使用 props
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>年龄：{props.age}</p>
    </div>
  )
}

// 方式二：解构（推荐）
function UserCard({ name, age, isActive, hobbies }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄：{age}</p>
      <p>状态：{isActive ? '活跃' : '非活跃'}</p>
      <ul>
        {hobbies.map(hobby => <li key={hobby}>{hobby}</li>)}
      </ul>
    </div>
  )
}
```

### 4.3 默认 Props

```typescript
// 方式一：解构默认值（推荐）
function Button({ text = '按钮', color = 'blue', size = 'medium' }) {
  return (
    <button className={`btn btn-${color} btn-${size}`}>
      {text}
    </button>
  )
}

// 方式二：defaultProps（已不推荐）
Button.defaultProps = {
  text: '按钮',
  color: 'blue'
}
```

### 4.4 Props 传递函数

```typescript
function Parent() {
  const handleClick = (data) => {
    console.log('子组件触发', data)
  }

  return <Child onClick={handleClick} />
}

function Child({ onClick }) {
  return <button onClick={() => onClick('子组件数据')}>点击</button>
}
```

### 4.5 传递 JSX 作为 Props

```typescript
function Layout({ header, sidebar, children }) {
  return (
    <div>
      <header>{header}</header>
      <div className="main">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

// 使用
function App() {
  return (
    <Layout
      header={<h1>网站标题</h1>}
      sidebar={<nav>导航菜单</nav>}
    >
      <p>主内容</p>
    </Layout>
  )
}
```

---

## 五、Props 验证（PropTypes）

使用 PropTypes 进行运行时类型检查（TypeScript 项目可跳过）。

```bash
npm install prop-types
```

```typescript
import PropTypes from 'prop-types'

function UserCard({ name, age, hobbies }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄：{age}</p>
    </div>
  )
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  hobbies: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.shape({
    city: PropTypes.string,
    street: PropTypes.string
  }),
  onEdit: PropTypes.func
}
```

---

## 六、TypeScript 与 Props

### 6.1 定义 Props 类型

```typescript
// 基本类型
interface UserCardProps {
  name: string
  age: number
  isActive?: boolean          // 可选属性
  hobbies?: string[]
  onEdit?: (id: number) => void
}

function UserCard({ name, age, isActive = false }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄：{age}</p>
      <p>状态：{isActive ? '活跃' : '非活跃'}</p>
    </div>
  )
}
```

### 6.2 children 类型

```typescript
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
}

function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}
```

### 6.3 组件 Props 类型

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

---

## 七、组件组合

### 7.1 包含关系

使用 `children` 实现包含关系：

```typescript
function Dialog({ children }) {
  return (
    <div className="dialog">
      <div className="dialog-content">
        {children}
      </div>
    </div>
  )
}

// 使用
function App() {
  return (
    <Dialog>
      <h1>欢迎</h1>
      <p>这是一个对话框</p>
      <button>确定</button>
    </Dialog>
  )
}
```

### 7.2 特例关系

通过 props 配置实现特例：

```typescript
function Dialog({ title, message, children }) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      <p>{message}</p>
      {children}
    </div>
  )
}

function AlertDialog({ title, message }) {
  return (
    <Dialog title={title} message={message}>
      <button>确定</button>
    </Dialog>
  )
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <Dialog title={title} message={message}>
      <button onClick={onConfirm}>确定</button>
      <button onClick={onCancel}>取消</button>
    </Dialog>
  )
}
```

---

## 八、Props 的单向数据流

```
┌──────────┐   props   ┌──────────┐   props   ┌──────────┐
│ 父组件    │ ────────▶ │ 子组件    │ ────────▶ │ 孙组件    │
└──────────┘           └──────────┘           └──────────┘
     ▲                      │
     │   事件回调            │
     └──────────────────────┘
```

- **数据流向**：父 → 子（通过 props）
- **事件流向**：子 → 父（通过回调函数）
- **Props 只读**：子组件不能修改 props

```typescript
// 父组件
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Display count={count} />
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}

// 子组件（只读 props）
function Display({ count }) {
  return <p>当前计数：{count}</p>
}
```

---

## 九、总结

### ✅ 关键知识点

1. **组件命名**：必须大写字母开头
2. **函数组件**：现代 React 推荐，配合 Hooks
3. **Props**：父传子的数据，只读不可修改
4. **默认值**：使用解构默认值 `({ name = '默认' })`
5. **children**：用于组件组合
6. **单向数据流**：数据向下，事件向上
7. **TypeScript**：使用 interface 定义 Props 类型

### 🔜 下一章

- 下一章：[State 与事件处理](/web/react/basics/04-state-events/)
- 上一章：[JSX 语法详解](/web/react/basics/02-jsx/)
- 上一级：[React 基础](/web/react/basics/)
