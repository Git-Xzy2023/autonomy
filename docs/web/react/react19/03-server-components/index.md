---
title: Server Components 与 Server Actions
---

# Server Components 与 Server Actions

> React 19 中 Server Components 和 Server Actions 正式稳定，改变了 React 应用的架构方式。

---

## 一、Server Components（服务端组件）

### 1.1 什么是 Server Components

Server Components（RSC）是在服务端执行的 React 组件，它们不会被打包到客户端 JavaScript 中。

```
┌─────────────────────────────────────────┐
│        Server Components vs Client      │
├─────────────────────────────────────────┤
│                                         │
│  Server Component                       │
│  ├── ✅ 服务端执行                       │
│  ├── ✅ 直接访问数据库/文件系统          │
│  ├── ✅ 不增加客户端包体积               │
│  ├── ❌ 不能使用 useState/useEffect      │
│  ├── ❌ 不能使用浏览器 API               │
│  └── ❌ 不能添加事件处理                 │
│                                         │
│  Client Component（'use client'）       │
│  ├── ✅ 客户端执行                       │
│  ├── ✅ 可以使用 Hooks                   │
│  ├── ✅ 可以使用浏览器 API               │
│  ├── ✅ 可以添加事件处理                 │
│  ├── ❌ 不能直接访问数据库               │
│  └── ⚠️ 增加客户端包体积                 │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 默认是 Server Component

```typescript
// app/page.tsx
// 默认就是 Server Component，无需声明
import { db } from '@/lib/db'

export default async function PostsPage() {
  // 直接访问数据库
  const posts = await db.post.findMany()

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 1.3 Client Component

```typescript
'use client'  // 必须在文件顶部声明

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  )
}
```

### 1.4 组件组合

```typescript
// app/page.tsx（Server Component）
import { db } from '@/lib/db'
import LikeButton from './LikeButton'  // Client Component

export default async function PostPage({ params }) {
  const post = await db.post.findUnique({
    where: { id: params.id }
  })

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {/* Server Component 可以渲染 Client Component */}
      <LikeButton postId={post.id} initialLikes={post.likes} />
    </article>
  )
}

// app/LikeButton.tsx（Client Component）
'use client'

import { useState } from 'react'

export default function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <button onClick={() => setLikes(l => l + 1)}>
      👍 {likes}
    </button>
  )
}
```

### 1.5 Server Component 的限制

```typescript
// ❌ Server Component 不能使用 Hooks
export default function ServerComponent() {
  const [state, setState] = useState(0)  // ❌ 错误
  useEffect(() => {}, [])  // ❌ 错误

  return <div>...</div>
}

// ❌ Server Component 不能添加事件处理
export default function ServerComponent() {
  return <button onClick={() => {}}>点击</button>  // ❌ 错误
}

// ✅ 正确：将交互部分提取为 Client Component
```

---

## 二、Server Actions（服务端动作）

### 2.1 定义 Server Action

```typescript
// 'use server' 标记为 Server Action
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// 可以在单独的文件中定义
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await db.post.create({
    data: { title, content }
  })

  revalidatePath('/posts')
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
}
```

### 2.2 在组件内定义 Server Action

```typescript
// app/posts/page.tsx
import { revalidatePath } from 'next/cache'

export default function PostsPage() {
  // 在 Server Component 中定义 Server Action
  async function createPost(formData: FormData) {
    'use server'  // 标记为 Server Action

    const title = formData.get('title') as string
    await db.post.create({ data: { title } })
    revalidatePath('/posts')
  }

  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">添加</button>
    </form>
  )
}
```

### 2.3 Server Action 的调用方式

```typescript
// 1. 表单 action（自动传递 FormData）
<form action={createPost}>
  <input name="title" />
  <button type="submit">提交</button>
</form>

// 2. 按钮点击（需要 useTransition）
'use client'
import { useTransition } from 'react'

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deletePost(id))}
    >
      {isPending ? '删除中...' : '删除'}
    </button>
  )
}

// 3. 配合 useActionState
const [state, formAction, isPending] = useActionState(serverAction, null)
```

---

## 三、数据流

### 3.1 Server → Client 传递数据

```typescript
// Server Component 获取数据，传递给 Client Component
// app/page.tsx
import { db } from '@/lib/db'
import ClientList from './ClientList'

export default async function Page() {
  // 服务端获取数据
  const posts = await db.post.findMany()

  // 传递给客户端组件（必须是可序列化的数据）
  return <ClientList posts={posts} />
}

// app/ClientList.tsx
'use client'

import { useState } from 'react'

export default function ClientList({ posts }) {
  const [filter, setFilter] = useState('')

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul>
        {posts
          .filter(p => p.title.includes(filter))
          .map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
      </ul>
    </div>
  )
}
```

### 3.2 Client → Server 传递数据

```typescript
// 通过 Server Action 从客户端发送数据到服务端
'use client'

import { updateProfile } from './actions'

function ProfileEditor({ user }) {
  const [name, setName] = useState(user.name)

  const handleSave = () => {
    // 调用 Server Action
    updateProfile({ name })
  }

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleSave}>保存</button>
    </div>
  )
}
```

---

## 四、缓存与重新验证

### 4.1 缓存策略

```typescript
// app/page.tsx
import { unstable_cache } from 'next/cache'

// 缓存函数结果
const getCachedPosts = unstable_cache(
  async () => {
    return await db.post.findMany()
  },
  ['posts'],
  { revalidate: 60 }  // 60 秒后重新验证
)

export default async function Page() {
  const posts = await getCachedPosts()
  return <PostList posts={posts} />
}
```

### 4.2 主动重新验证

```typescript
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({
    data: { title: formData.get('title') }
  })

  // 重新验证整个路径
  revalidatePath('/posts')

  // 重新验证特定标签
  revalidateTag('posts')
}
```

---

## 五、Server Components 最佳实践

### 5.1 组件拆分原则

```
┌─────────────────────────────────────────┐
│        组件拆分原则                      │
├─────────────────────────────────────────┤
│                                         │
│  1. 默认使用 Server Component            │
│                                         │
│  2. 只在需要时才用 Client Component：    │
│     ├── useState / useReducer           │
│     ├── useEffect / useLayoutEffect     │
│     ├── 事件处理（onClick 等）          │
│     ├── 浏览器 API（window、document）  │
│     └── 第三方客户端库                  │
│                                         │
│  3. 将交互部分提取为独立 Client Component│
│                                         │
│  4. Server Component 作为容器           │
│     Client Component 作为交互单元       │
│                                         │
│  5. 数据获取在 Server Component 中      │
│     交互逻辑在 Client Component 中      │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 实际示例

```typescript
// app/products/page.tsx（Server Component）
import { db } from '@/lib/db'
import ProductList from './ProductList'
import SearchBar from './SearchBar'

export default async function ProductsPage() {
  // 服务端获取数据
  const products = await db.product.findMany()
  const categories = await db.category.findMany()

  return (
    <div>
      <h1>商品列表</h1>

      {/* 搜索栏（Client Component） */}
      <SearchBar categories={categories} />

      {/* 商品列表（Client Component，接收服务端数据） */}
      <ProductList initialProducts={products} />
    </div>
  )
}

// app/products/SearchBar.tsx（Client Component）
'use client'

import { useState } from 'react'

export default function SearchBar({ categories }) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')

  return (
    <div>
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="搜索..."
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">全部分类</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
```

---

## 六、总结

### ✅ 关键知识点

1. **Server Components**：服务端执行，直接访问后端资源
2. **Client Components**：`'use client'` 声明，可使用 Hooks 和事件
3. **Server Actions**：`'use server'` 声明，服务端执行的函数
4. **数据流**：Server → Client 通过 props，Client → Server 通过 Actions
5. **默认 Server**：React 19 默认组件为 Server Component
6. **组件拆分**：数据获取在 Server，交互在 Client
7. **重新验证**：revalidatePath、revalidateTag

### 🔜 下一章

- 下一章：[React Compiler](/web/react/react19/04-react-compiler/)
- 上一章：[Actions 与表单](/web/react/react19/02-actions/)
- 上一级：[React 19 新特性](/web/react/react19/)
