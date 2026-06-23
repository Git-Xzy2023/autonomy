---
title: Actions 与表单
---

# Actions 与表单

> Actions 是 React 19 的核心概念，统一处理异步操作，自动管理加载、错误和乐观更新状态。

---

## 一、什么是 Actions

### 1.1 Actions 概念

Actions 是 React 19 引入的一个概念，用于处理异步操作（如表单提交、数据修改）。它将异步操作的状态管理（loading、error、optimistic）整合在一起。

```
┌─────────────────────────────────────────┐
│           Actions 工作流程              │
├─────────────────────────────────────────┤
│                                         │
│  传统方式：                             │
│  ├── 手动管理 loading 状态              │
│  ├── 手动管理 error 状态                │
│  ├── 手动管理 optimistic 更新           │
│  └── 大量样板代码                       │
│                                         │
│  Actions 方式：                         │
│  ├── 自动管理 loading（isPending）      │
│  ├── 自动管理 error                     │
│  ├── 配合 useOptimistic 自动乐观更新    │
│  └── 极少样板代码                       │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 Actions 的特征

一个 Action 是一个异步函数，满足以下条件：
- 接收 `formData` 作为参数（表单 Action）
- 返回值用于更新状态
- 可以是客户端函数或 Server Action

---

## 二、表单 Actions

### 2.1 基本表单 Action

```typescript
// React 19：直接在 <form> 上使用 action
function App() {
  async function handleSubmit(formData: FormData) {
    const name = formData.get('name')
    const email = formData.get('email')

    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email })
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">提交</button>
    </form>
  )
}
```

### 2.2 配合 useActionState

```typescript
import { useActionState } from 'react'

async function createUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // 验证
  if (!name) return { error: '姓名不能为空' }
  if (!email) return { error: '邮箱不能为空' }

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email })
    })

    if (!res.ok) {
      const err = await res.json()
      return { error: err.message }
    }

    const user = await res.json()
    return { success: true, user }
  } catch (e) {
    return { error: '网络错误' }
  }
}

function SignupForm() {
  const [state, formAction, isPending] = useActionState(createUser, null)

  return (
    <form action={formAction}>
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit" disabled={isPending}>
        {isPending ? '提交中...' : '注册'}
      </button>

      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">注册成功！</p>}
    </form>
  )
}
```

### 2.3 配合 useFormStatus

```typescript
import { useFormStatus } from 'react-dom'

// 提交按钮组件
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}

// 表单组件
function ContactForm() {
  const [state, formAction] = useActionState(submitContact, null)

  return (
    <form action={formAction}>
      <input name="name" placeholder="姓名" />
      <input name="message" placeholder="留言" />
      <SubmitButton />
    </form>
  )
}
```

---

## 三、乐观更新表单

### 3.1 完整的乐观更新示例

```typescript
import { useActionState, useOptimistic } from 'react'

// 评论列表组件
function CommentList({ comments, addComment }) {
  // 乐观更新
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment) => [
      ...state,
      {
        id: 'temp-' + Date.now(),
        text: newComment,
        pending: true
      }
    ]
  )

  // Action
  async function submitComment(prevState: any, formData: FormData) {
    const text = formData.get('comment') as string

    // 乐观更新：立即显示
    addOptimisticComment(text)

    // 实际提交
    try {
      await addComment(text)
      return { success: true }
    } catch (e) {
      return { error: e.message }
    }
  }

  const [state, formAction, isPending] = useActionState(submitComment, null)

  return (
    <div>
      <ul>
        {optimisticComments.map(comment => (
          <li
            key={comment.id}
            style={{ opacity: comment.pending ? 0.5 : 1 }}
          >
            {comment.text}
            {comment.pending && ' ⏳'}
          </li>
        ))}
      </ul>

      <form action={formAction}>
        <input name="comment" placeholder="发表评论..." />
        <button type="submit" disabled={isPending}>
          发表
        </button>
      </form>

      {state?.error && <p className="error">{state.error}</p>}
    </div>
  )
}
```

---

## 四、非表单 Actions

### 4.1 useTransition 配合 Actions

```typescript
import { useTransition } from 'react'

function TodoApp() {
  const [isPending, startTransition] = useTransition()
  const [todos, setTodos] = useState([])

  const handleAdd = () => {
    startTransition(async () => {
      const newTodo = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title: '新任务' })
      }).then(r => r.json())

      setTodos(prev => [...prev, newTodo])
    })
  }

  return (
    <div>
      <button onClick={handleAdd} disabled={isPending}>
        {isPending ? '添加中...' : '添加任务'}
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 4.2 自定义 Action Hook

```typescript
// 自定义 Action Hook
function useAction<T>(
  action: (data: T) => Promise<void>
) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const execute = (data: T) => {
    setError(null)
    startTransition(async () => {
      try {
        await action(data)
      } catch (e) {
        setError(e.message)
      }
    })
  }

  return { execute, isPending, error }
}

// 使用
function DeleteButton({ id }) {
  const { execute, isPending, error } = useAction(
    async (id: string) => {
      await fetch(`/api/items/${id}`, { method: 'DELETE' })
    }
  )

  return (
    <>
      <button onClick={() => execute(id)} disabled={isPending}>
        {isPending ? '删除中...' : '删除'}
      </button>
      {error && <p>错误：{error}</p>}
    </>
  )
}
```

---

## 五、Server Actions（服务端动作）

### 5.1 定义 Server Action

```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from './db'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await db.post.create({
    data: { title, content }
  })

  // 重新验证页面
  revalidatePath('/posts')
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string

  await db.post.delete({ where: { id } })

  revalidatePath('/posts')
}
```

### 5.2 在表单中使用 Server Action

```typescript
// app/posts/new/page.tsx
import { createPost } from '@/app/actions'

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="标题" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit">发布</button>
    </form>
  )
}
```

### 5.3 配合 useActionState 使用 Server Action

```typescript
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string

  if (!title) {
    return { error: '标题不能为空' }
  }

  try {
    await db.post.create({ data: { title } })
    return { success: true }
  } catch (e) {
    return { error: '创建失败' }
  }
}
```

```typescript
'use client'

import { useActionState } from 'react'
import { createPost } from './actions'

export default function NewPostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null)

  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? '发布中...' : '发布'}
      </button>
      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>发布成功！</p>}
    </form>
  )
}
```

---

## 六、表单重置与清空

### 6.1 提交后清空表单

```typescript
function CommentForm() {
  const [state, formAction, isPending] = useActionState(submitComment, null)

  return (
    <form action={formAction}>
      <input name="comment" />
      <button type="submit" disabled={isPending}>发表</button>

      {state?.success && (
        <p>发表成功！</p>
      )}
    </form>
  )
  // React 19 中，表单提交成功后会自动清空（如果 action 成功）
}
```

### 6.2 手动控制表单

```typescript
function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    await uploadFile(formData.get('file'))
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <input name="file" type="file" />
      <button type="submit">上传</button>
    </form>
  )
}
```

---

## 七、总结

### ✅ 关键知识点

1. **Actions**：异步操作的统一处理方案
2. **`<form action={fn}>`**：原生表单支持异步 action
3. **useActionState**：管理 action 的状态和返回值
4. **useFormStatus**：获取表单提交状态（用于子组件）
5. **useOptimistic**：配合 action 实现乐观更新
6. **Server Actions**：服务端动作，直接操作数据库
7. **自动重置**：表单提交成功后自动清空

### 🔜 下一章

- 下一章：[Server Components](/web/react/react19/03-server-components/)
- 上一章：[新 Hooks](/web/react/react19/01-new-hooks/)
- 上一级：[React 19 新特性](/web/react/react19/)
