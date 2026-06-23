---
title: Next.js 路由
---

# Next.js 路由

> Next.js App Router 的路由系统。

---

## 一、文件系统路由

### 1.1 路由对应关系

```
┌─────────────────────────────────────────┐
│           文件系统路由                   │
├─────────────────────────────────────────┤
│                                         │
│  app/                                   │
│  ├── page.tsx              → /          │
│  ├── about/                              │
│  │   └── page.tsx          → /about     │
│  ├── blog/                               │
│  │   ├── page.tsx          → /blog      │
│  │   └── [slug]/                        │
│  │       └── page.tsx      → /blog/:slug│
│  └── dashboard/                          │
│      ├── page.tsx          → /dashboard │
│      └── settings/                       │
│          └── page.tsx      → /dashboard/settings │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 特殊文件

| 文件          | 作用           |
| ------------- | -------------- |
| `page.tsx`    | 页面组件       |
| `layout.tsx`  | 布局组件       |
| `loading.tsx` | 加载 UI        |
| `error.tsx`   | 错误 UI        |
| `not-found.tsx` | 404 页面     |
| `route.ts`    | API 路由       |
| `template.tsx` | 模板组件      |

---

## 二、动态路由

### 2.1 基本动态路由

```typescript
// app/posts/[id]/page.tsx
interface PageProps {
  params: { id: string }
}

export default function PostPage({ params }: PageProps) {
  return <div>文章 ID: {params.id}</div>
}
```

### 2.2 多个参数

```typescript
// app/shop/[category]/[product]/page.tsx
interface PageProps {
  params: {
    category: string
    product: string
  }
}

export default function ProductPage({ params }: PageProps) {
  return (
    <div>
      <h1>{params.category}</h1>
      <p>{params.product}</p>
    </div>
  )
}
```

### 2.3 Catch-all 路由

```typescript
// app/docs/[...slug]/page.tsx
interface PageProps {
  params: { slug: string[] }
}

export default function DocsPage({ params }: PageProps) {
  // /docs/a/b/c → slug: ['a', 'b', 'c']
  return <div>路径: {params.slug.join('/')}</div>
}

// Optional catch-all
// app/docs/[[...slug]]/page.tsx
// /docs → slug: []
// /docs/a/b → slug: ['a', 'b']
```

---

## 三、路由组

### 3.1 分组路由

```
app/
├── (marketing)/        # 路由组，不影响 URL
│   ├── about/
│   │   └── page.tsx    → /about
│   └── contact/
│       └── page.tsx    → /contact
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx    → /dashboard
│   └── settings/
│       └── page.tsx    → /settings
```

### 3.2 不同布局

```typescript
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <div>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  )
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardSidebar />
      {children}
    </div>
  )
}
```

---

## 四、Link 组件

### 4.1 基本用法

```typescript
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/">首页</Link>
      <Link href="/about">关于</Link>
      <Link href="/blog/first-post">第一篇文章</Link>
    </nav>
  )
}
```

### 4.2 动态链接

```typescript
function PostList({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

### 4.3 预加载

```typescript
<Link href="/about" prefetch>
  关于
</Link>
```

---

## 五、导航

### 5.1 useRouter

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/dashboard')
    // router.replace('/login')
    // router.back()
    // router.forward()
    // router.refresh()
  }

  return <button onClick={handleClick}>跳转</button>
}
```

### 5.2 usePathname

```typescript
'use client'

import { usePathname } from 'next/navigation'

function Navigation() {
  const pathname = usePathname()

  return (
    <nav>
      <Link
        href="/"
        className={pathname === '/' ? 'active' : ''}
      >
        首页
      </Link>
      <Link
        href="/about"
        className={pathname === '/about' ? 'active' : ''}
      >
        关于
      </Link>
    </nav>
  )
}
```

---

## 六、加载状态

### 6.1 loading.tsx

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return <div>加载中...</div>
}

// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetchPosts()  // 模拟慢请求
  return <PostList posts={posts} />
}
```

### 6.2 Suspense

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>文章列表</h1>
      <Suspense fallback={<div>加载文章...</div>}>
        <Posts />
      </Suspense>
      <Suspense fallback={<div>加载评论...</div>}>
        <Comments />
      </Suspense>
    </div>
  )
}
```

---

## 七、错误处理

### 7.1 error.tsx

```typescript
// app/error.tsx
'use client'  // 错误组件必须是客户端组件

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>出错了</h2>
      <p>{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )
}
```

### 7.2 not-found.tsx

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>页面不存在</p>
      <Link href="/">返回首页</Link>
    </div>
  )
}
```

---

## 八、API 路由

### 8.1 Route Handler

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

// GET /api/users
export async function GET(request: NextRequest) {
  const users = await fetchUsers()
  return NextResponse.json(users)
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await createUser(body)
  return NextResponse.json(user, { status: 201 })
}
```

### 8.2 动态 API 路由

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await fetchUser(params.id)

  if (!user) {
    return NextResponse.json(
      { error: '用户不存在' },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id)
  return new NextResponse(null, { status: 204 })
}
```

---

## 九、中间件

### 9.1 middleware.ts

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // 检查认证
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

---

## 十、总结

### ✅ 关键知识点

1. **文件系统路由**：文件路径即路由
2. **特殊文件**：page、layout、loading、error
3. **动态路由**：[id]、[...slug]
4. **路由组**：(group) 不影响 URL
5. **Link**：客户端导航
6. **useRouter**：编程式导航
7. **加载状态**：loading.tsx、Suspense
8. **错误处理**：error.tsx、not-found.tsx
9. **API 路由**：route.ts
10. **中间件**：middleware.ts

### 🔜 下一章

- 下一章：[数据获取](/web/react-ecosystem/nextjs/03-data-fetching/)
- 上一章：[基础](/web/react-ecosystem/nextjs/01-basics/)
- 上一级：[Next.js](/web/react-ecosystem/nextjs/)
