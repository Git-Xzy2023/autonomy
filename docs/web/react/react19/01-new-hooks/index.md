---
title: React 19 新 Hooks
---

# React 19 新 Hooks

> React 19 引入了 use、useActionState、useOptimistic、useFormStatus 四个新 Hooks。

---

## 一、use() — 读取 Promise 和 Context

### 1.1 基本介绍

`use()` 是 React 19 中最重要的新 Hook 之一，它可以读取 Promise 或 Context。与其他 Hooks 不同，`use()` 可以在条件语句中调用。

```typescript
import { use } from 'react'

// 读取 Promise
const data = use(promise)

// 读取 Context
const theme = use(ThemeContext)
```

### 1.2 读取 Promise

```typescript
import { use } from 'react'

// 异步获取数据
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // use() 会暂停组件渲染，直到 Promise resolve
  const user = use(userPromise)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

// 父组件传递 Promise
function Page() {
  const userPromise = fetchUser('123')
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}
```

### 1.3 读取 Context

```typescript
import { use, createContext } from 'react'

const ThemeContext = createContext<'light' | 'dark'>('light')

function Button() {
  // 使用 use() 替代 useContext()
  const theme = use(ThemeContext)

  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      按钮
    </button>
  )
}
```

### 1.4 use() 的特殊性 — 可在条件语句中调用

```typescript
function Component({ condition, promise }) {
  if (condition) {
    // ✅ 合法！use() 可以在条件语句中调用
    const data = use(promise)
    return <div>{data}</div>
  }
  // 其他 Hooks 不能这样做
  // const [state, setState] = useState(0)  // ❌ 不能在条件语句中
  return <div>无数据</div>
}
```

### 1.5 use() 与 Suspense 配合

```typescript
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

function Component() {
  // 如果 Promise 还在 pending，会抛出 Promise
  // Suspense 会捕获并显示 fallback
  const data = use(fetchData())
  return <div>{data}</div>
}
```

---

## 二、useActionState — 表单动作状态

### 2.1 基本介绍

`useActionState`（原 `useFormState`）用于管理表单动作的状态，包括提交数据、错误信息等。

```typescript
import { useActionState } from 'react'

const [state, formAction, isPending] = useActionState(
  actionFunction,
  initialState
)
```

### 2.2 基本用法

```typescript
import { useActionState } from 'react'

// action 函数接收 (prevState, formData)
async function submitTodo(prevState: any, formData: FormData) {
  const title = formData.get('title') as string

  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title })
    })
    const todo = await res.json()
    return { success: true, todo }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

function AddTodo() {
  const [state, formAction, isPending] = useActionState(submitTodo, null)

  return (
    <form action={formAction}>
      <input name="title" type="text" />
      <button type="submit" disabled={isPending}>
        {isPending ? '添加中...' : '添加'}
      </button>

      {state?.success && <p>添加成功！</p>}
      {state?.error && <p>错误：{state.error}</p>}
    </form>
  )
}
```

### 2.3 与 Server Actions 配合

```typescript
// Server Action
'use server'

async function createUser(prevState: any, formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')

  // 服务端验证
  if (!name) {
    return { error: '姓名不能为空' }
  }

  await db.user.create({ name, email })
  return { success: true }
}

// 客户端组件
'use client'

function SignupForm() {
  const [state, formAction, isPending] = useActionState(createUser, null)

  return (
    <form action={formAction}>
      <input name="name" />
      <input name="email" type="email" />
      <button disabled={isPending}>注册</button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}
```

---

## 三、useOptimistic — 乐观更新

### 3.1 基本介绍

`useOptimistic` 用于实现乐观更新（Optimistic Update），在异步操作完成前先显示预期结果，提升用户体验。

```typescript
import { useOptimistic } from 'react'

const [optimisticState, addOptimistic] = useOptimistic(
  state,           // 当前真实状态
  updateFn         // 乐观更新函数
)
```

### 3.2 基本用法 — 点赞功能

```typescript
import { useOptimistic } from 'react'

function LikeButton({ likes, onLike }) {
  // optimisticLikes 是乐观值
  // addOptimisticLike 用于添加乐观更新
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes, _) => currentLikes + 1
  )

  const handleClick = async () => {
    // 立即显示 +1（乐观更新）
    addOptimisticLike(null)
    // 实际发送请求
    await onLike()
  }

  return (
    <button onClick={handleClick}>
      👍 {optimisticLikes}
    </button>
  )
}
```

### 3.3 消息列表 — 添加消息

```typescript
function MessageList({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        id: 'temp-' + Date.now(),
        text: newMessage,
        sending: true  // 标记为发送中
      }
    ]
  )

  const formAction = async (formData) => {
    const text = formData.get('message')
    // 立即显示消息（乐观）
    addOptimisticMessage(text)
    // 发送到服务器
    await sendMessage(text)
  }

  return (
    <div>
      <ul>
        {optimisticMessages.map(msg => (
          <li key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>
            {msg.text}
            {msg.sending && ' (发送中...)'}
          </li>
        ))}
      </ul>

      <form action={formAction}>
        <input name="message" />
        <button type="submit">发送</button>
      </form>
    </div>
  )
}
```

### 3.4 乐观更新的工作流程

```
┌─────────────────────────────────────────┐
│         乐观更新工作流程                │
├─────────────────────────────────────────┤
│                                         │
│  1. 用户操作（如点击发送）              │
│     ↓                                   │
│  2. addOptimistic() 立即更新 UI         │
│     ↓                                   │
│  3. 发送异步请求                        │
│     ↓                                   │
│  4a. 请求成功 → 更新真实数据            │
│      （乐观值被替换为真实值）           │
│                                         │
│  4b. 请求失败 → 回滚到真实数据          │
│      （乐观值自动消失）                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 四、useFormStatus — 表单提交状态

### 4.1 基本介绍

`useFormStatus` 用于获取父级 `<form>` 的提交状态，常用于提交按钮组件。

```typescript
import { useFormStatus } from 'react-dom'

const { pending, data, method, action } = useFormStatus()
```

### 4.2 基本用法

```typescript
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}

// 使用
function MyForm() {
  return (
    <form action={submitAction}>
      <input name="email" />
      <SubmitButton />  {/* 自动获取 form 的状态 */}
    </form>
  )
}
```

### 4.3 高级用法 — 显示表单数据

```typescript
function SubmitButton() {
  const { pending, data } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending
        ? `提交中（${data?.get('name') || ''}）...`
        : '提交'}
    </button>
  )
}
```

### 4.4 注意事项

```typescript
// ⚠️ useFormStatus 必须在 <form> 内部的子组件中使用
// 不能在定义 <form> 的同一个组件中使用

// ❌ 错误：在 form 同级组件使用
function MyForm() {
  const { pending } = useFormStatus()  // ❌ 无法获取状态
  return (
    <form action={action}>
      <button disabled={pending}>提交</button>
    </form>
  )
}

// ✅ 正确：在 form 子组件使用
function MyForm() {
  return (
    <form action={action}>
      <SubmitButton />  {/* ✅ 子组件中获取 */}
    </form>
  )
}
```

---

## 五、新 Hooks 对比总结

| Hook               | 作用                  | 返回值                          | 使用场景           |
| ------------------ | --------------------- | ------------------------------- | ------------------ |
| `use()`            | 读取 Promise/Context  | Promise 的值或 Context 的值     | 异步数据、Context  |
| `useActionState()` | 表单动作状态管理      | `[state, action, isPending]`    | 表单提交           |
| `useOptimistic()`  | 乐观更新              | `[optimisticValue, addOptimistic]` | 即时反馈           |
| `useFormStatus()`  | 表单提交状态          | `{ pending, data, method, action }` | 提交按钮           |

---

## 六、总结

### ✅ 关键知识点

1. **use()**：读取 Promise 和 Context，可在条件语句中调用
2. **useActionState()**：管理表单动作状态，配合 Server Actions
3. **useOptimistic()**：乐观更新，提升用户体验
4. **useFormStatus()**：获取表单提交状态，用于提交按钮

### 🔜 下一章

- 下一章：[Actions 与表单](/web/react/react19/02-actions/)
- 上一级：[React 19 新特性](/web/react/react19/)
