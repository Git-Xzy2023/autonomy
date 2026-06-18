---
title: "Suspense 与流式 SSR"
---

# Suspense 与流式 SSR

**Q1: Suspense 是什么？**

Suspense 让组件"等待"某个异步操作完成后再渲染，期间显示 fallback（占位 UI）。

```jsx
import { Suspense, lazy } from 'react';

// 1. 懒加载组件
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// 2. 嵌套使用
function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Header />
      <Suspense fallback={<MainSkeleton />}>
        <MainContent />
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </Suspense>
  );
  // Header 立即显示
  // MainContent 加载时显示 MainSkeleton
  // Sidebar 加载时显示 SidebarSkeleton
  // 各自独立加载，互不阻塞
}
```

**Q2: Suspense 数据获取是什么？**

React 18 允许组件在数据未就绪时"挂起"，Suspense 负责显示 loading。

```jsx
// 使用 React Query 的 Suspense 模式
import { useSuspenseQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  // 数据未就绪时自动挂起，Suspense 显示 fallback
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  });

  return <div>{data.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile userId={1} />
    </Suspense>
  );
}
```

**Q3: 什么是流式 SSR？**

React 18 的 `renderToPipeableStream` 允许服务端**逐步发送 HTML**，而不是等待所有数据加载完才发送。

```
传统 SSR：
  1. 服务器获取所有数据（等待 2s）
  2. 渲染完整 HTML
  3. 一次性发送给浏览器
  4. 用户白屏 2s

流式 SSR：
  1. 服务器立即发送 HTML 骨架（0ms）
  2. 数据就绪的部分逐步发送
  3. 用户立即看到骨架屏
  4. 数据加载完后自动填充
```

```jsx
// 服务端代码
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(
    <App />,
    {
      bootstrapScripts: ['/main.js'],
      onShellReady() {
        // 外壳就绪，立即开始发送
        res.setHeader('content-type', 'text/html');
        pipe(res);
      },
    }
  );
});
```

**Q4: Suspense + 流式 SSR 如何配合？**

```jsx
// 组件
function App() {
  return (
    <html>
      <body>
        <div id="root">
          <Header />
          <Suspense fallback={<ProductSkeleton />}>
            <ProductDetail /> {/* 需要异步获取数据 */}
          </Suspense>
          <Suspense fallback={<ReviewsSkeleton />}>
            <Reviews /> {/* 需要异步获取数据 */}
          </Suspense>
        </div>
      </body>
    </html>
  );
}

// 服务端流式渲染过程：
// 1. 立即发送：Header + ProductSkeleton + ReviewsSkeleton
// 2. ProductDetail 数据就绪 → 发送 ProductDetail HTML（替换骨架屏）
// 3. Reviews 数据就绪 → 发送 Reviews HTML（替换骨架屏）
// 4. 发送 <script> 标签，激活（hydrate）页面
```

**Q5: 什么是 Selective Hydration（选择性水合）？**

React 18 的 SSR 中，各个部分可以**独立水合**，不需要等整个页面加载完。

```
传统 hydration：
  1. 等待所有 JS 加载完
  2. 整个页面一次性水合
  3. 水合期间页面不可交互

选择性水合：
  1. 各部分 JS 独立加载
  2. 每部分加载完就独立水合
  3. 用户可以与已水合的部分交互
  4. 如果用户点击未水合的部分，React 会优先水合该部分
```

```jsx
// 各部分独立水合
<Layout>
  <Suspense fallback={<Spinner />}>
    <Comments /> {/* Comments 的 JS 加载完就水合 */}
  </Suspense>
  <Suspense fallback={<Spinner />}>
    <Sidebar /> {/* Sidebar 的 JS 加载完就水合 */}
  </Suspense>
</Layout>
```

**Q6: Suspense 的使用注意事项？**

1. **Suspense 边界的位置**：放在合适层级，太细会导致太多 loading，太粗会阻塞太多内容。

```jsx
// ❌ 太细：每个小组件都有 loading
<div>
  <Suspense fallback={<S />}><Avatar /></Suspense>
  <Suspense fallback={<S />}><Name /></Suspense>
  <Suspense fallback={<S />}><Bio /></Suspense>
</div>

// ✅ 合适：相关内容共享一个 Suspense
<Suspense fallback={<ProfileSkeleton />}>
  <Avatar />
  <Name />
  <Bio />
</Suspense>
```

2. **避免在水合时改变内容**：服务端和客户端渲染内容应一致。

3. **错误处理**：配合 Error Boundary 使用。

```jsx
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

**Q7: React Server Components 和 Suspense 的关系？**

React Server Components（RSC）是 React 18 的实验特性，服务端组件可以直接获取数据，配合 Suspense 实现流式渲染。

```jsx
// Server Component（服务端执行，不打包到客户端）
async function ProductList() {
  const products = await db.query('SELECT * FROM products');
  // 直接 await，不需要 useEffect
  return products.map(p => <ProductCard key={p.id} product={p} />);
}

// 页面
function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ProductList />
    </Suspense>
  );
}
```

---
