---
title: 数据获取
---

# 数据获取

> Next.js App Router 的数据获取方式。

---

## 一、服务端数据获取

### 1.1 基本获取

```typescript
// app/posts/page.tsx
interface Post {
  id: number
  title: string
  content: string
}

// 默认是服务端组件，可以直接 async
export default async function PostsPage() {
  // 直接在服务端获取数据
  const response = await fetch('https://api.example.com/posts')
  const posts: Post[] = await response.json()

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 1.2 请求缓存

```typescript
// 默认缓存（force-cache）
fetch('https://api.example.com/data')

// 不缓存（no-store）
fetch('https://api.example.com/data', { cache: 'no-store' })

// 重新验证（ISR）
fetch('https://api.example.com/data', {
  next: { revalidate: 60 }  // 60 秒后重新验证
})
```

---

## 二、并行和串行

### 2.1 并行获取

```typescript
export default async function Dashboard() {
  // 并行获取
  const [users, posts, comments] = await Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
  ])

  return (
    <div>
      <h2>用户：{users.length}</h2>
      <h2>文章：{posts.length}</h2>
      <h2>评论：{comments.length}</h2>
    </div>
  )
}
```

### 2.2 串行获取

```typescript
export default async function UserPosts({ userId }) {
  // 先获取用户
  const user = await fetch(`https://api.example.com/users/${userId}`).then(r => r.json())

  // 再获取用户的文章
  const posts = await fetch(`https://api.example.com/users/${userId}/posts`).then(r => r.json())

  return (
    <div>
      <h1>{user.name} 的文章</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 三、动态路由数据

### 3.1 获取路由参数

```typescript
// app/posts/[id]/page.tsx
interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`).then(r => r.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {searchParams.comment && <p>评论 ID: {searchParams.comment}</p>}
    </article>
  )
}
```

### 3.2 generateStaticParams

```typescript
// app/posts/[id]/page.tsx
// 静态生成动态路由
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  return posts.map(post => ({
    id: String(post.id)
  }))
}

export default async function PostPage({ params }: PageProps) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`).then(r => r.json())
  return <h1>{post.title}</h1>
}
```

---

## 四、缓存策略

### 4.1 请求记忆化

```typescript
// 同一请求中多次调用会被缓存
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`)
  return res.json()
}

export default async function Page({ params }: { params: { id: string } }) {
  // 两次调用，只发起一次请求
  const user1 = await getUser(params.id)
  const user2 = await getUser(params.id)

  // user1 === user2
  return <div>{user1.name}</div>
}
```

### 4.2 revalidate

```typescript
// 时间-based 重新验证
fetch('https://api.example.com/data', {
  next: { revalidate: 60 }  // 60 秒
})

// 标签-based 重新验证
fetch('https://api.example.com/data', {
  next: { tags: ['users'] }
})

// 在其他地方触发重新验证
import { revalidateTag } from 'next/cache'

async function updateUser() {
  await updateUserAPI()
  revalidateTag('users')  // 重新验证所有标记为 'users' 的请求
}
```

### 4.3 动态渲染

```typescript
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
  noStore()  // 禁用缓存，每次请求都重新获取
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

---

## 五、Server Actions

### 5.1 定义 Server Action

```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content })
  })

  // 重新验证页面
  revalidatePath('/posts')
}
```

### 5.2 使用 Server Action

```typescript
// app/posts/new/page.tsx
import { createPost } from '../../actions'

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="标题" />
      <textarea name="content" placeholder="内容" />
      <button type="submit">发布</button>
    </form>
  )
}
```

### 5.3 useActionState

```typescript
'use client'

import { useActionState } from 'react'
import { createPost } from './actions'

export default function NewPostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null)

  return (
    <form action={formAction}>
      <input name="title" />
      <textarea name="content" />
      <button disabled={isPending}>
        {isPending ? '发布中...' : '发布'}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

---

## 六、客户端数据获取

### 6.1 使用 React Query

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export default function ClientPosts() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json())
  })

  if (isLoading) return <div>加载中...</div>

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 6.2 使用 SWR

```typescript
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ClientPosts() {
  const { data, error, isLoading } = useSWR('/api/posts', fetcher)

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误</div>

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

## 七、流式渲染

### 7.1 Streaming with Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

async function Users() {
  const users = await fetch('https://api.example.com/users').then(r => r.json())
  return <div>用户：{users.length}</div>
}

async function Posts() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <div>文章：{posts.length}</div>
}

export default function Dashboard() {
  return (
    <div>
      <h1>仪表盘</h1>

      {/* 每个组件独立加载 */}
      <Suspense fallback={<div>加载用户...</div>}>
        <Users />
      </Suspense>

      <Suspense fallback={<div>加载文章...</div>}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

---

## 八、总结

### ✅ 关键知识点

1. **服务端获取**：async 组件直接 fetch
2. **缓存策略**：force-cache、no-store、revalidate
3. **并行/串行**：Promise.all 并行获取
4. **动态路由**：params、searchParams
5. **generateStaticParams**：静态生成动态路由
6. **请求记忆化**：同一请求自动缓存
7. **revalidate**：时间或标签触发重新验证
8. **Server Actions**：服务端表单处理
9. **客户端获取**：React Query、SWR
10. **流式渲染**：Suspense 逐步加载

### 🔜 下一章

- 下一章：[部署](/web/react-ecosystem/nextjs/04-deployment/)
- 上一章：[路由](/web/react-ecosystem/nextjs/02-routing/)
- 上一级：[Next.js](/web/react-ecosystem/nextjs/)
