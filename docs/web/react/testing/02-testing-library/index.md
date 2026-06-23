---
title: Testing Library
---

# Testing Library

> Testing Library 是测试 React 组件的推荐库，关注用户行为而非实现细节。

---

## 一、Testing Library 简介

### 1.1 核心理念

```
┌─────────────────────────────────────────┐
│         Testing Library 核心理念        │
├─────────────────────────────────────────┤
│                                         │
│  "The more your tests resemble the     │
│   way your software is used, the more  │
│   confidence they can give you."       │
│                                         │
│  测试越接近用户使用方式，越有信心       │
│                                         │
│  原则：                                  │
│  ├── 测试行为，不测试实现               │
│  ├── 从用户角度查询元素                 │
│  └── 不依赖组件内部细节                 │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 安装

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## 二、查询元素

### 2.1 查询方法分类

| 类型         | 抛出错误 | 返回 null | 返回数组 |
| ------------ | -------- | --------- | -------- |
| **getBy***   | ✅       | ❌        | ❌       |
| **queryBy*** | ❌       | ✅        | ❌       |
| **findBy***  | ✅(异步) | ❌        | ❌       |
| **getAllBy*** | ✅      | ❌        | ✅       |
| **queryAllBy*** | ❌    | ❌        | ✅       |
| **findAllBy*** | ✅(异步) | ❌      | ✅       |

### 2.2 查询优先级

```
┌─────────────────────────────────────────┐
│              查询优先级                 │
├─────────────────────────────────────────┤
│                                         │
│  1. getByRole          （推荐）         │
│  2. getByLabelText     （表单）         │
│  3. getByPlaceholderText                │
│  4. getByText                           │
│  5. getByDisplayValue                   │
│  6. getByAltText                        │
│  7. getByTitle                          │
│  8. getByTestId         （最后选择）    │
│                                         │
└─────────────────────────────────────────┘
```

### 2.3 查询示例

```typescript
import { render, screen } from '@testing-library/react'

function LoginForm() {
  return (
    <form>
      <label htmlFor="email">邮箱</label>
      <input id="email" type="email" placeholder="请输入邮箱" />

      <label htmlFor="password">密码</label>
      <input id="password" type="password" placeholder="请输入密码" />

      <button type="submit">登录</button>
    </form>
  )
}

test('查询表单元素', () => {
  render(<LoginForm />)

  // 通过 role 查询（推荐）
  expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()

  // 通过 label 查询
  expect(screen.getByLabelText('邮箱')).toBeInTheDocument()
  expect(screen.getByLabelText('密码')).toBeInTheDocument()

  // 通过 placeholder 查询
  expect(screen.getByPlaceholderText('请输入邮箱')).toBeInTheDocument()

  // 通过 text 查询
  expect(screen.getByText('登录')).toBeInTheDocument()
})
```

---

## 三、用户交互

### 3.1 fireEvent

```typescript
import { render, screen, fireEvent } from '@testing-library/react'

test('点击按钮', () => {
  const handleClick = jest.fn()
  render(<button onClick={handleClick}>点击</button>)

  fireEvent.click(screen.getByText('点击'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

test('输入文本', () => {
  render(<input placeholder="输入" />)

  const input = screen.getByPlaceholderText('输入')
  fireEvent.change(input, { target: { value: 'hello' } })
  expect(input).toHaveValue('hello')
})
```

### 3.2 userEvent（推荐）

```typescript
import userEvent from '@testing-library/user-event'

test('用户交互', async () => {
  const user = userEvent.setup()
  render(<input placeholder="输入" />)

  const input = screen.getByPlaceholderText('输入')
  await user.type(input, 'hello')
  expect(input).toHaveValue('hello')

  await user.clear(input)
  expect(input).toHaveValue('')
})
```

### 3.3 常用事件

```typescript
// 点击
await user.click(element)

// 输入
await user.type(element, 'hello')

// 清空
await user.clear(element)

// 选择选项
await user.selectOptions(selectElement, 'option1')

// 上传文件
await user.upload(inputElement, file)

// 键盘
await user.keyboard('{Shift}+{ArrowRight}')

// 悬停
await user.hover(element)
await user.unhover(element)
```

---

## 四、测试组件

### 4.1 表单测试

```typescript
function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form onSubmit={e => {
      e.preventDefault()
      onSubmit({ email, password })
    }}>
      <label htmlFor="email">邮箱</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label htmlFor="password">密码</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">登录</button>
    </form>
  )
}

test('提交表单', async () => {
  const user = userEvent.setup()
  const handleSubmit = jest.fn()

  render(<LoginForm onSubmit={handleSubmit} />)

  await user.type(screen.getByLabelText('邮箱'), 'test@test.com')
  await user.type(screen.getByLabelText('密码'), 'password')
  await user.click(screen.getByRole('button', { name: '登录' }))

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@test.com',
    password: 'password'
  })
})
```

### 4.2 异步组件测试

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <div>加载中...</div>

  return <div>{user.name}</div>
}

test('异步加载用户', async () => {
  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ name: '张三' })
    })
  )

  render(<UserProfile userId={1} />)

  // 等待加载完成
  expect(screen.getByText('加载中...')).toBeInTheDocument()

  // 等待用户名出现
  expect(await screen.findByText('张三')).toBeInTheDocument()
  expect(screen.queryByText('加载中...')).not.toBeInTheDocument()
})
```

### 4.3 Context 测试

```typescript
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <span>当前主题：{theme}</span>
      <button onClick={toggleTheme}>切换</button>
    </div>
  )
}

test('主题切换', () => {
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )

  expect(screen.getByText('当前主题：light')).toBeInTheDocument()

  fireEvent.click(screen.getByText('切换'))

  expect(screen.getByText('当前主题：dark')).toBeInTheDocument()
})
```

---

## 五、异步测试

### 5.1 waitFor

```typescript
import { waitFor } from '@testing-library/react'

test('等待异步操作', async () => {
  render(<AsyncComponent />)

  await waitFor(() => {
    expect(screen.getByText('加载完成')).toBeInTheDocument()
  })
})
```

### 5.2 waitForElementToBeRemoved

```typescript
import { waitForElementToBeRemoved } from '@testing-library/react'

test('等待元素消失', async () => {
  render(<AsyncComponent />)

  // 等待加载中消失
  await waitForElementToBeRemoved(() => screen.getByText('加载中...'))

  expect(screen.getByText('内容')).toBeInTheDocument()
})
```

### 5.3 findBy（推荐）

```typescript
test('findBy 等待元素出现', async () => {
  render(<AsyncComponent />)

  // findBy 会自动等待
  const element = await screen.findByText('加载完成', {}, { timeout: 3000 })
  expect(element).toBeInTheDocument()
})
```

---

## 六、Mock

### 6.1 Mock API

```typescript
// Mock fetch
global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})

test('获取数据', async () => {
  fetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ name: '张三' })
  })

  render(<UserProfile userId={1} />)

  expect(await screen.findByText('张三')).toBeInTheDocument()
  expect(fetch).toHaveBeenCalledWith('/api/users/1')
})
```

### 6.2 Mock 模块

```typescript
jest.mock('./api', () => ({
  fetchUser: jest.fn(),
  fetchPosts: jest.fn()
}))

import { fetchUser } from './api'

test('Mock 模块', async () => {
  fetchUser.mockResolvedValue({ name: '张三' })

  render(<UserProfile userId={1} />)

  expect(await screen.findByText('张三')).toBeInTheDocument()
})
```

---

## 七、测试最佳实践

### 7.1 测试行为而非实现

```typescript
// ❌ 测试实现细节
test('state 更新', () => {
  // 测试内部 state
})

// ✅ 测试行为
test('点击按钮显示内容', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: '显示' }))

  expect(screen.getByText('内容')).toBeInTheDocument()
})
```

### 7.2 使用语义查询

```typescript
// ❌ 使用 testid
<div data-testid="user-name">张三</div>
screen.getByTestId('user-name')

// ✅ 使用语义查询
<h1>张三</h1>
screen.getByRole('heading', { name: '张三' })
```

### 7.3 避免快照测试

```typescript
// ❌ 快照测试难以维护
expect(container).toMatchSnapshot()

// ✅ 显式断言
expect(screen.getByText('张三')).toBeInTheDocument()
expect(screen.getByRole('button')).toBeDisabled()
```

---

## 八、总结

### ✅ 关键知识点

1. **核心理念**：测试行为，不测试实现
2. **查询优先级**：getByRole > getByLabelText > getByText > getByTestId
3. **查询类型**：getBy（找不到报错）、queryBy（找不到返回 null）、findBy（异步等待）
4. **用户交互**：userEvent 优于 fireEvent
5. **异步测试**：waitFor、findBy
6. **Mock**：Mock fetch、Mock 模块
7. **最佳实践**：测试行为、语义查询、避免快照

### 🔜 下一章

- 下一章：[项目结构](/web/react/best-practices/01-project-structure/)
- 上一章：[Jest 基础](/web/react/testing/01-jest/)
- 上一级：[React 测试](/web/react/testing/)
