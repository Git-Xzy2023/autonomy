---
title: React Compiler
---

# React Compiler

> React Compiler 是 React 19 最重要的特性之一，自动优化组件渲染，无需手动使用 useMemo/useCallback。

---

## 一、什么是 React Compiler

### 1.1 背景

在 React 19 之前，开发者需要手动使用 `useMemo`、`useCallback`、`React.memo` 来优化性能，避免不必要的重渲染。这带来了以下问题：

- **心智负担重**：需要判断哪些值需要记忆化
- **容易遗漏**：忘记 memo 导致性能问题
- **过度优化**：不必要的 memo 反而降低性能
- **代码冗余**：大量 memo/useCallback 样板代码

### 1.2 React Compiler 解决方案

React Compiler 是一个编译时优化工具，**自动**分析组件并进行记忆化优化。

```
┌─────────────────────────────────────────┐
│         React Compiler 工作方式         │
├─────────────────────────────────────────┤
│                                         │
│  源代码（无需手动 memo）                │
│     ↓                                   │
│  React Compiler 编译                    │
│     ↓                                   │
│  自动生成优化后的代码（等效于手动 memo）│
│                                         │
│  ✅ 自动记忆化                           │
│  ✅ 自动依赖追踪                         │
│  ✅ 自动跳过不必要渲染                   │
│  ✅ 零代码侵入                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、启用 React Compiler

### 2.1 安装

```bash
npm install babel-plugin-react-compiler
```

### 2.2 Vite 配置

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler']
        ]
      }
    })
  ]
})
```

### 2.3 Next.js 配置

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: true
  }
}

module.exports = nextConfig
```

### 2.4 Webpack 配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['babel-plugin-react-compiler']
            ]
          }
        }
      }
    ]
  }
}
```

---

## 三、编译前后对比

### 3.1 无需手动 useMemo

```typescript
// ❌ React 18：需要手动 useMemo
function ProductList({ products, filter }) {
  const filtered = useMemo(
    () => products.filter(p => p.name.includes(filter)),
    [products, filter]
  )

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.price - b.price),
    [filtered]
  )

  return <List items={sorted} />
}

// ✅ React 19 + Compiler：无需 useMemo
function ProductList({ products, filter }) {
  // Compiler 自动记忆化
  const filtered = products.filter(p => p.name.includes(filter))
  const sorted = [...filtered].sort((a, b) => a.price - b.price)

  return <List items={sorted} />
}
```

### 3.2 无需手动 useCallback

```typescript
// ❌ React 18：需要手动 useCallback
function App() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <Button onClick={handleClick} />
}

// ✅ React 19 + Compiler：无需 useCallback
function App() {
  const [count, setCount] = useState(0)

  // Compiler 自动记忆化
  const handleClick = () => {
    setCount(c => c + 1)
  }

  return <Button onClick={handleClick} />
}
```

### 3.3 无需 React.memo

```typescript
// ❌ React 18：需要 React.memo
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return <div>{/* 渲染逻辑 */}</div>
})

// ✅ React 19 + Compiler：无需 React.memo
function ExpensiveComponent({ data }) {
  return <div>{/* 渲染逻辑 */}</div>
}
```

---

## 四、Compiler 的优化原理

### 4.1 自动依赖分析

```typescript
function Component({ a, b }) {
  // Compiler 分析出 x 依赖 a
  const x = a * 2

  // Compiler 分析出 y 依赖 b
  const y = b * 3

  // Compiler 分析出 z 依赖 x 和 y
  const z = x + y

  // 只有当 a 变化时，x 和 z 才重新计算
  // 只有当 b 变化时，y 和 z 才重新计算
  return <div>{z}</div>
}
```

### 4.2 编译后的等效代码

```typescript
// React Compiler 编译后（简化示意）
function Component({ a, b }) {
  const $ = useMemoCache(3)  // 缓存槽

  // x = a * 2
  let x
  if ($[0] !== a) {
    x = a * 2
    $[0] = a
    $[1] = x
  } else {
    x = $[1]
  }

  // y = b * 3
  let y
  if ($[2] !== b) {
    y = b * 3
    $[2] = b
    $[3] = y
  } else {
    y = $[3]
  }

  // z = x + y
  let z
  if ($[4] !== x || $[5] !== y) {
    z = x + y
    $[4] = x
    $[5] = y
    $[6] = z
  } else {
    z = $[6]
  }

  return <div>{z}</div>
}
```

---

## 五、Compiler 的规则

### 5.1 组件/ Hook 必须是纯函数

```typescript
// ❌ 违反规则：修改外部变量
let counter = 0
function BadComponent() {
  counter++  // 副作用！
  return <div>{counter}</div>
}

// ❌ 违反规则：修改 props
function BadComponent({ items }) {
  items.push('new')  // 修改 props！
  return <div>...</div>
}

// ✅ 正确：纯函数
function GoodComponent({ items }) {
  const newItems = [...items, 'new']  // 不修改原数组
  return <div>...</div>
}
```

### 5.2 不要在渲染中修改 refs

```typescript
// ❌ 违反规则：渲染中修改 ref
function BadComponent() {
  const ref = useRef(0)
  ref.current++  // 渲染中修改 ref！
  return <div>{ref.current}</div>
}

// ✅ 正确：在 effect 中修改 ref
function GoodComponent() {
  const ref = useRef(0)

  useEffect(() => {
    ref.current++
  }, [])

  return <div>...</div>
}
```

### 5.3 使用 "use no memo" 退出优化

```typescript
// 对特定组件禁用 Compiler 优化
'use no memo'

function UnoptimizedComponent({ data }) {
  // 这个组件不会被 Compiler 优化
  return <div>{data}</div>
}
```

---

## 六、渐进式采用

### 6.1 部分启用

```javascript
// babel.config.js
// 只对特定目录启用
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      sources: (filename) => {
        // 只编译 src 目录下的文件
        return filename.includes('src/')
      }
    }]
  ]
}
```

### 6.2 ESLint 检查

```bash
npm install eslint-plugin-react-compiler
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler'
  ],
  rules: {
    'react-compiler/react-compiler': 'error'
  }
}
```

### 6.3 Compiler 与手动 memo 共存

```typescript
// React Compiler 启用后，已有的 useMemo/useCallback 仍然有效
// Compiler 会在其基础上进一步优化
function Component({ data }) {
  // 手动 memo 仍然有效
  const processed = useMemo(() => heavyProcess(data), [data])

  // Compiler 也会自动优化这行
  const result = processed.filter(x => x.active)

  return <div>{result.length}</div>
}
```

---

## 七、性能对比

### 7.1 何时使用 Compiler

```
┌─────────────────────────────────────────┐
│        React Compiler 适用场景          │
├─────────────────────────────────────────┤
│                                         │
│  ✅ 推荐：                              │
│  ├── 中大型应用                         │
│  ├── 组件层级深                         │
│  ├── 频繁渲染的组件                     │
│  ├── 列表渲染                           │
│  └── 不想手动写 memo 的项目             │
│                                         │
│  ⚠️ 注意：                              │
│  ├── 小项目可能无明显提升                │
│  ├── 编译时间会增加                     │
│  └── 需要确保代码符合规则               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 八、总结

### ✅ 关键知识点

1. **React Compiler**：编译时自动记忆化
2. **零侵入**：无需修改代码，自动优化
3. **替代手动 memo**：useMemo、useCallback、React.memo 可移除
4. **启用方式**：babel-plugin-react-compiler
5. **规则**：组件必须是纯函数，不修改 refs/props
6. **渐进式**：可部分启用，与手动 memo 共存
7. **ESLint**：eslint-plugin-react-compiler 检查规则

### 🔜 下一章

- 下一章：[API 变化](/web/react/react19/05-api-changes/)
- 上一章：[Server Components](/web/react/react19/03-server-components/)
- 上一级：[React 19 新特性](/web/react/react19/)
