---
title: JSX 语法详解
---

# JSX 语法详解

> JSX 是 JavaScript 的语法扩展，让你在 JavaScript 中编写类似 HTML 的标记。它是 React 开发的基础。

---

## 一、什么是 JSX？

JSX（JavaScript XML）是一种语法扩展，它让你可以在 JavaScript 中编写声明式的 UI 代码。

```typescript
// JSX 示例
const element = (
  <h1 className="greeting">
    Hello, {name}!
  </h1>
)
```

JSX 会被编译成普通的 JavaScript 函数调用：

```typescript
// 上面的 JSX 编译后等价于
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, ',
  name,
  '!'
)
```

---

## 二、JSX 基本语法

### 2.1 表达式嵌入

使用 `{}` 在 JSX 中嵌入 JavaScript 表达式：

```typescript
const name = '张三'
const age = 25
const user = { name: '李四' }

const element = (
  <div>
    <p>姓名：{name}</p>
    <p>年龄：{age}</p>
    <p>计算：{age + 5}</p>
    <p>三元：{age >= 18 ? '成年' : '未成年'}</p>
    <p>对象属性：{user.name}</p>
    <p>函数调用：{name.toUpperCase()}</p>
  </div>
)
```

> ⚠️ `{}` 中只能放**表达式**，不能放**语句**（如 `if`、`for`、`switch`）。

### 2.2 条件渲染

```typescript
function Greeting({ isLoggedIn }) {
  // 方式一：三元表达式
  return (
    <div>{isLoggedIn ? <Welcome /> : <Login />}</div>
  )

  // 方式二：逻辑与 &&
  return (
    <div>{isLoggedIn && <Welcome />}</div>
  )

  // 方式三：提前 return
  if (isLoggedIn) {
    return <Welcome />
  }
  return <Login />
}
```

### 2.3 列表渲染

使用 `map()` 渲染列表，必须提供唯一的 `key`：

```typescript
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number.toString()}>
          {number}
        </li>
      ))}
    </ul>
  )
}

// 使用
const numbers = [1, 2, 3, 4, 5]
<NumberList numbers={numbers} />
```

### 2.4 渲染数组

```typescript
function TodoList({ todos }) {
  const items = todos.map((todo) => (
    <li key={todo.id}>
      {todo.text}
    </li>
  ))

  return <ul>{items}</ul>
}
```

---

## 三、JSX 属性

### 3.1 属性命名

JSX 属性使用驼峰命名法：

```typescript
// ✅ 正确：驼峰命名
<div className="container" tabIndex={0}>
<div onClick={handleClick} onMouseEnter={handleHover}>

// ❌ 错误：HTML 风格
<div class="container" tabindex="0">
```

### 3.2 属性值

```typescript
// 字符串属性
<div className="box">
<img src="/logo.png" alt="Logo" />

// 表达式属性
<div className={`box ${isActive ? 'active' : ''}`}>
<img src={user.avatar} alt={user.name} />

// 布尔属性
<input disabled={true} />
<input disabled />           // 等同于 disabled={true}
<input disabled={false} />   // 不禁用

// 数字属性
<input maxLength={10} />
```

### 3.3 data-* 和 aria-* 属性

```typescript
// data-* 自定义属性（保持原样）
<div data-user-id={user.id} data-role="admin">

// aria-* 无障碍属性
<button aria-label="关闭" onClick={handleClose}>×</button>
```

---

## 四、JSX 中的样式

### 4.1 className

JSX 中使用 `className` 而非 `class`：

```typescript
// ✅ 正确
<div className="container">

// ❌ 错误
<div class="container">
```

### 4.2 内联样式

内联样式使用对象，属性名驼峰命名：

```typescript
const styles = {
  color: 'red',
  fontSize: '16px',       // 驼峰命名
  backgroundColor: '#f0f0f0',
  marginTop: '20px',
  border: '1px solid #ccc'
}

const element = <div style={styles}>内容</div>

// 直接写
const element2 = (
  <div style={{ color: 'blue', padding: '10px' }}>
    内容
  </div>
)
```

> ⚠️ 内联样式的值可以是字符串或数字（数字会自动加 `px`）。

---

## 五、JSX 子元素

### 5.1 文本子元素

```typescript
const element = <h1>Hello World</h1>
```

### 5.2 嵌套子元素

```typescript
const element = (
  <div>
    <h1>标题</h1>
    <p>段落</p>
  </div>
)
```

### 5.3 表达式作为子元素

```typescript
const items = ['苹果', '香蕉', '橙子']
const element = (
  <ul>
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>
)
```

### 5.4 children prop

```typescript
function Card({ children }) {
  return <div className="card">{children}</div>
}

// 使用
const app = (
  <Card>
    <h2>卡片标题</h2>
    <p>卡片内容</p>
  </Card>
)
```

### 5.5 条件渲染子元素

```typescript
function Layout({ showHeader, showFooter, children }) {
  return (
    <div>
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
```

---

## 六、JSX 防注入攻击

JSX 默认会转义嵌入的值，防止 XSS 攻击：

```typescript
const userInput = '<script>alert("xss")</script>'

// 安全：内容会被转义，显示为纯文本
const element = <div>{userInput}</div>
```

如果确实需要渲染 HTML，使用 `dangerouslySetInnerHTML`：

```typescript
const htmlContent = '<strong>加粗文字</strong>'

// ⚠️ 危险：确保内容可信
const element = (
  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
)
```

> ⚠️ **警告**：`dangerouslySetInnerHTML` 会执行其中的 HTML，可能导致 XSS 攻击。仅在内容完全可信时使用。

---

## 七、Fragment

使用 Fragment 包裹多个元素，不会产生额外的 DOM 节点：

```typescript
import { Fragment } from 'react'

function App() {
  return (
    <Fragment>
      <h1>标题</h1>
      <p>段落</p>
    </Fragment>
  )
}

// 简写语法
function App() {
  return (
    <>
      <h1>标题</h1>
      <p>段落</p>
    </>
  )
}
```

> 💡 Fragment 简写 `<>` 不支持属性，需要 key 时使用 `<Fragment key={...}>`。

---

## 八、JSX 编译

### 8.1 编译过程

```
JSX 代码
    │
    ▼
Babel / SWC 编译
    │
    ▼
React.createElement() 调用
    │
    ▼
React 元素对象
```

### 8.2 React 元素结构

```typescript
// JSX
const element = <h1 className="title">Hello</h1>

// 编译后的对象
const element = {
  type: 'h1',
  props: {
    className: 'title',
    children: 'Hello'
  },
  key: null,
  ref: null
}
```

### 8.3 新版 JSX 转换

React 17+ 引入了新的 JSX 转换，无需导入 React：

```typescript
// 旧版：需要导入 React
import React from 'react'
const element = <div>Hello</div>

// 新版：无需导入 React（Vite/Next.js 默认启用）
const element = <div>Hello</div>
```

---

## 九、JSX 最佳实践

### 9.1 多行 JSX 使用括号包裹

```typescript
// ✅ 推荐
const element = (
  <div>
    <h1>标题</h1>
    <p>段落</p>
  </div>
)

// ❌ 不推荐（自动分号插入问题）
const element =
  <div>
    <h1>标题</h1>
  </div>
```

### 9.2 条件渲染提取为变量

```typescript
// ✅ 推荐：提取变量
function Button({ isLoading, text }) {
  const content = isLoading ? '加载中...' : text
  return <button>{content}</button>
}

// ❌ 不推荐：嵌套三元
function Button({ isLoading, text, isDisabled }) {
  return (
    <button>
      {isLoading ? '加载中...' : isDisabled ? '禁用' : text}
    </button>
  )
}
```

### 9.3 列表渲染提取为组件

```typescript
// ✅ 推荐：提取列表项组件
function TodoItem({ todo }) {
  return <li>{todo.text}</li>
}

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  )
}
```

---

## 十、总结

### ✅ 关键知识点

1. **JSX 是 JS 语法扩展**：编译后是 `React.createElement` 调用
2. **表达式嵌入**：使用 `{}` 嵌入任意 JS 表达式
3. **属性命名**：使用驼峰命名（`className`、`onClick`）
4. **列表渲染**：使用 `map()`，必须提供 `key`
5. **Fragment**：`<>...</>` 包裹多元素不产生额外 DOM
6. **安全**：JSX 默认转义，防止 XSS

### 🔜 下一章

- 下一章：[组件与 Props](/web/react/basics/03-components/)
- 上一章：[入门与安装](/web/react/basics/01-intro/)
- 上一级：[React 基础](/web/react/basics/)
