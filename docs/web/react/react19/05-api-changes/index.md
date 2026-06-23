---
title: React 19 API 变化
---

# React 19 API 变化

> React 19 带来了大量 API 变化，包括 ref 作为 prop、Context 作为 Provider、文档元数据、资源加载等。

---

## 一、ref 作为 prop（无需 forwardRef）

### 1.1 变化说明

React 19 中，`ref` 可以直接作为 prop 传递给函数组件，不再需要 `forwardRef`。

```typescript
// ❌ React 18：需要 forwardRef
const MyInput = React.forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} {...props} />
})

// ✅ React 19：直接接收 ref 作为 prop
function MyInput({ ref, ...props }: { ref: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

### 1.2 使用示例

```typescript
// 自定义输入框组件
function TextInput({
  ref,
  label,
  ...props
}: {
  ref?: React.Ref<HTMLInputElement>
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  )
}

// 使用
function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => inputRef.current?.focus()

  return (
    <div>
      <TextInput ref={inputRef} label="姓名" />
      <button onClick={focusInput}>聚焦</button>
    </div>
  )
}
```

### 1.3 forwardRef 仍可用（废弃但不删除）

```typescript
// forwardRef 仍然可以使用，但已废弃
// 建议迁移到新的方式
const OldInput = forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} {...props} />
})
```

---

## 二、Context 作为 Provider

### 2.1 变化说明

React 19 中，`<Context>` 可以直接作为 Provider 使用，不需要 `.Provider`。

```typescript
// ❌ React 18
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Content />
    </ThemeContext.Provider>
  )
}

// ✅ React 19
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext value="dark">
      <Content />
    </ThemeContext>
  )
}
```

### 2.2 完整示例

```typescript
import { createContext, use } from 'react'

// 创建 Context
const UserContext = createContext<User | null>(null)

// Provider 组件
function App() {
  return (
    // 直接使用 <UserContext> 作为 Provider
    <UserContext value={{ name: '张三', age: 25 }}>
      <Profile />
    </UserContext>
  )
}

// 消费 Context（使用 use()）
function Profile() {
  const user = use(UserContext)

  if (!user) return <div>未登录</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.age} 岁</p>
    </div>
  )
}
```

---

## 三、文档元数据

### 3.1 变化说明

React 19 原生支持在组件中渲染 `<title>`、`<meta>`、`<link>` 标签，React 会自动将它们提升到 `<head>` 中。

```typescript
// React 19：直接在组件中写元数据标签
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <link rel="canonical" href={`https://example.com/posts/${post.id}`} />

      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### 3.2 去重处理

```typescript
function Page() {
  return (
    <div>
      {/* 多个相同 title，React 会去重，只保留最后一个 */}
      <title>页面标题</title>

      {/* 多个相同 name 的 meta，React 会去重 */}
      <meta name="description" content="页面描述" />

      <Content />
    </div>
  )
}
```

### 3.3 动态元数据

```typescript
function ProductPage({ product }) {
  return (
    <div>
      <title>{product.name} - 我的商店</title>
      <meta name="description" content={product.description} />
      <meta property="og:image" content={product.image} />
      <meta property="product:price:amount" content={product.price} />

      <ProductDetails product={product} />
    </div>
  )
}
```

---

## 四、资源加载

### 4.1 preload API

React 19 提供了 `preload`、`preinit` 等函数来优化资源加载。

```typescript
import { preload, preinit } from 'react-dom'

function App() {
  // preload：预加载资源（如图片、字体）
  preload('/images/hero.jpg', { as: 'image' })
  preload('/fonts/inter.woff2', { as: 'font' })

  // preinit：提前初始化资源（如脚本、样式）
  preinit('/styles/critical.css', { as: 'style' })
  preinit('https://cdn.example.com/analytics.js', {
    as: 'script'
  })

  return <div>...</div>
}
```

### 4.2 使用场景

```typescript
// 预加载下一页可能需要的图片
function ProductLink({ product }) {
  const handleHover = () => {
    // 鼠标悬停时预加载产品图片
    preload(product.imageUrl, { as: 'image' })
  }

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={handleHover}
    >
      {product.name}
    </Link>
  )
}
```

---

## 五、ref 清理函数

### 5.1 变化说明

React 19 中，ref 回调函数可以返回一个清理函数（类似 useEffect 的清理函数）。

```typescript
// React 19：ref 回调可以返回清理函数
<div ref={(node) => {
  // 设置 ref
  if (node) {
    observer.observe(node)
  }

  // 清理函数
  return () => {
    observer.unobserve(node)
  }
}} />
```

### 5.2 完整示例

```typescript
function useIntersectionObserver(callback: () => void) {
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) callback()
      })
    })

    observer.observe(node)

    // 清理函数：组件卸载或 ref 变化时调用
    return () => {
      observer.disconnect()
    }
  }, [callback])

  return ref
}

// 使用
function LazyImage({ src }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useIntersectionObserver(() => setLoaded(true))

  return (
    <div ref={ref}>
      {loaded ? <img src={src} /> : <div>加载中...</div>}
    </div>
  )
}
```

---

## 六、useDeferredValue 初始值

### 6.1 变化说明

React 19 中，`useDeferredValue` 支持第三个参数 `initialValue`。

```typescript
// React 19：支持初始值
const deferredValue = useDeferredValue(value, initialValue?)
```

### 6.2 使用示例

```typescript
function SearchResults({ query }) {
  // 第一次渲染时，deferredQuery 立即使用初始值 ''
  // 后续更新才会延迟
  const deferredQuery = useDeferredValue(query, '')

  return (
    <div>
      <input value={query} readOnly />
      <Results query={deferredQuery} />
    </div>
  )
}
```

---

## 七、改进的错误处理

### 7.1 createRoot 选项

```typescript
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!, {
  // 捕获未捕获的错误
  onUncaughtError: (error, errorInfo) => {
    console.error('未捕获的错误：', error)
    // 上报到错误监控
    reportError(error)
  },
  // 捕获错误边界捕获的错误
  onCaughtError: (error, errorInfo) => {
    console.error('错误边界捕获：', error)
  }
})
```

### 7.2 hydrateRoot 选项

```typescript
import { hydrateRoot } from 'react-dom/client'

const root = hydrateRoot(document.getElementById('root')!, {
  onUncaughtError: (error, errorInfo) => {
    reportError(error)
  },
  onCaughtError: (error, errorInfo) => {
    console.error('错误边界捕获：', error)
  }
})
```

---

## 八、自定义元素支持

### 8.1 变化说明

React 19 改进了对 Web Components（自定义元素）的支持，属性会正确传递。

```typescript
// React 19：自定义元素属性正确传递
function App() {
  return (
    <my-custom-element
      foo="bar"           // 属性
      data-value={123}    // 数据属性
      onCustomEvent={handleEvent}  // 事件
    >
      <child-slot-content />
    </my-custom-element>
  )
}
```

### 8.2 定义自定义元素

```typescript
// 定义 Web Component
class MyElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<p>自定义元素</p>'
  }
}

customElements.define('my-element', MyElement)

// 在 React 中使用
function App() {
  return <my-element />
}
```

---

## 九、废弃的 API

### 9.1 废弃列表

```typescript
// ⚠️ React 19 中废弃的 API

// 1. 函数组件的 defaultProps（废弃）
function Component({ name = '默认' }) {
  // ✅ 使用参数默认值
  return <div>{name}</div>
}

// ❌ 不再支持 defaultProps
// Component.defaultProps = { name: '默认' }

// 2. string refs（废弃）
// ❌ 不再支持
// <div ref="myRef" />

// ✅ 使用 callback ref 或 useRef
const myRef = useRef(null)
// <div ref={myRef} />

// 3. propTypes（废弃，建议用 TypeScript）
// ❌ 不再推荐
// Component.propTypes = { name: PropTypes.string }

// ✅ 使用 TypeScript
function Component({ name }: { name: string }) {
  return <div>{name}</div>
}

// 4. React.createFactory（移除）
// ❌ 已移除
// const factory = React.createFactory(Component)

// ✅ 直接调用
// <Component />
```

---

## 十、总结

### ✅ 关键知识点

1. **ref as prop**：无需 forwardRef，直接传递 ref
2. **Context as Provider**：`<Context>` 替代 `<Context.Provider>`
3. **文档元数据**：原生支持 title/meta/link
4. **资源加载**：preload、preinit 函数
5. **ref 清理函数**：ref 回调可返回清理函数
6. **useDeferredValue**：支持初始值
7. **错误处理**：onUncaughtError、onCaughtError
8. **自定义元素**：改进 Web Components 支持
9. **废弃 API**：defaultProps、string refs、propTypes

### 🔜 下一章

- 下一章：[迁移指南](/web/react/react19/06-migration/)
- 上一章：[React Compiler](/web/react/react19/04-react-compiler/)
- 上一级：[React 19 新特性](/web/react/react19/)
