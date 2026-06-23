---
title: Next.js 基础
---

# Next.js 基础

> 学习 Next.js 的基本概念和使用方法。

---

## 一、创建项目

### 1.1 使用 create-next-app

```bash
# 创建项目
npx create-next-app@latest my-app

# 选择配置
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - src/ directory: Yes
# - App Router: Yes
# - Import alias: @/*
```

### 1.2 项目结构

```
my-app/
├── app/                    # App Router 目录
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── globals.css         # 全局样式
│   └── about/
│       └── page.tsx        # 关于页面
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件
│   ├── lib/                # 工具库
│   └── types/              # 类型定义
├── next.config.js          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
└── package.json
```

---

## 二、渲染模式

### 2.1 渲染模式对比

```
┌─────────────────────────────────────────┐
│              渲染模式                   │
├─────────────────────────────────────────┤
│                                         │
│  CSR（客户端渲染）                      │
│  ├── React SPA                          │
│  ├── 首屏慢                             │
│  └── SEO 差                             │
│                                         │
│  SSR（服务端渲染）                      │
│  ├── 每次请求都渲染                     │
│  ├── 首屏快                             │
│  └── SEO 好                             │
│                                         │
│  SSG（静态生成）                        │
│  ├── 构建时生成                         │
│  ├── 最快                               │
│  └── 适合不变内容                       │
│                                         │
│  ISR（增量静态再生）                    │
│  ├── 静态 + 定期更新                    │
│  ├── 兼顾性能和实时性                   │
│  └── 适合频繁更新                       │
│                                         │
└─────────────────────────────────────────┘
```

### 2.2 App Router 默认 SSR

```typescript
// app/page.tsx
// App Router 默认是服务端组件（SSR）
export default function Home() {
  return <div>Hello World</div>
}
```

### 2.3 客户端组件

```typescript
'use client'  // 声明为客户端组件

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

---

## 三、布局

### 3.1 根布局

```typescript
// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My Next.js App'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <header>导航栏</header>
        <main>{children}</main>
        <footer>页脚</footer>
      </body>
    </html>
  )
}
```

### 3.2 嵌套布局

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <aside>侧边栏</aside>
      <div>{children}</div>
    </div>
  )
}

// app/dashboard/page.tsx
export default function Dashboard() {
  return <h1>仪表盘</h1>
}
```

---

## 四、元数据

### 4.1 静态元数据

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'My App',
  description: '这是我的应用',
  keywords: ['Next.js', 'React'],
  authors: [{ name: '张三' }],
  openGraph: {
    title: 'My App',
    description: '这是我的应用',
    images: ['/og-image.png']
  }
}
```

### 4.2 动态元数据

```typescript
// app/posts/[id]/page.tsx
export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const post = await fetchPost(params.id)

  return {
    title: post.title,
    description: post.excerpt
  }
}
```

---

## 五、图片优化

### 5.1 next/image

```typescript
import Image from 'next/image'

function MyComponent() {
  return (
    <Image
      src="/profile.jpg"
      alt="头像"
      width={200}
      height={200}
      priority  // 优先加载
    />
  )
}

// 响应式图片
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ objectFit: 'cover' }}
/>

// 远程图片
<Image
  src="https://example.com/image.jpg"
  alt="远程图片"
  width={500}
  height={300}
/>
```

### 5.2 配置远程图片

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**'
      }
    ]
  }
}
```

---

## 六、字体优化

### 6.1 next/font

```typescript
// app/layout.tsx
import { Inter, Noto_Sans_SC } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.className} ${notoSansSC.className}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 七、CSS 支持

### 7.1 CSS Modules

```typescript
// components/Button/Button.module.css
.button {
  background: blue;
  color: white;
  padding: 8px 16px;
}

// components/Button/Button.tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.button}>点击</button>
}
```

### 7.2 Tailwind CSS

```typescript
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}

// 组件中使用
function Button() {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      点击
    </button>
  )
}
```

---

## 八、TypeScript

### 8.1 类型安全

```typescript
// app/posts/[id]/page.tsx
interface Post {
  id: number
  title: string
  content: string
}

interface PageProps {
  params: { id: string }
}

export default async function PostPage({ params }: PageProps) {
  const post: Post = await fetchPost(params.id)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

---

## 九、总结

### ✅ 关键知识点

1. **创建项目**：create-next-app
2. **渲染模式**：CSR、SSR、SSG、ISR
3. **服务端组件**：默认，性能好
4. **客户端组件**：'use client'，交互性
5. **布局**：根布局、嵌套布局
6. **元数据**：静态、动态
7. **图片优化**：next/image
8. **字体优化**：next/font
9. **CSS**：CSS Modules、Tailwind

### 🔜 下一章

- 下一章：[路由](/web/react-ecosystem/nextjs/02-routing/)
- 上一级：[Next.js](/web/react-ecosystem/nextjs/)
