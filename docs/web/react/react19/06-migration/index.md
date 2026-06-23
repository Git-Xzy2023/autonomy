---
title: 从 React 18 迁移到 React 19
---

# 从 React 18 迁移到 React 19

> 本指南帮助你将现有的 React 18 应用迁移到 React 19。

---

## 一、升级步骤

### 1.1 安装 React 19

```bash
# npm
npm install react@19 react-dom@19

# yarn
yarn add react@19 react-dom@19

# pnpm
pnpm add react@19 react-dom@19
```

### 1.2 升级相关依赖

```bash
# 升级 TypeScript 类型
npm install @types/react@19 @types/react-dom@19

# 升级第三方库到兼容 React 19 的版本
npm install react-router-dom@latest
npm install @tanstack/react-query@latest
npm install zustand@latest
npm install @reduxjs/toolkit@latest
```

### 1.3 代码迁移工具

```bash
# 使用 React 官方 codemod 工具自动迁移
npx @react/codemod@latest react-19
```

---

## 二、主要迁移项

### 2.1 移除 forwardRef

```typescript
// ❌ React 18：需要 forwardRef
const MyInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)

// ✅ React 19：直接接收 ref 作为 prop
function MyInput({
  ref,
  ...props
}: Props & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

### 2.2 更新 Context Provider

```typescript
// ❌ React 18
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// ✅ React 19
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

### 2.3 移除函数组件的 defaultProps

```typescript
// ❌ React 18
function Button({ size, color }) {
  return <button className={`${size} ${color}`} />
}
Button.defaultProps = {
  size: 'medium',
  color: 'blue'
}

// ✅ React 19：使用参数默认值
function Button({
  size = 'medium',
  color = 'blue'
}: {
  size?: string
  color?: string
}) {
  return <button className={`${size} ${color}`} />
}
```

### 2.4 更新 useFormState → useActionState

```typescript
// ❌ React 18（从 react-dom 导入）
import { useFormState } from 'react-dom'
const [state, formAction] = useFormState(action, initialState)

// ✅ React 19（从 react 导入，新增 isPending）
import { useActionState } from 'react'
const [state, formAction, isPending] = useActionState(action, initialState)
```

---

## 三、TypeScript 类型变化

### 3.1 ref 类型

```typescript
// React 19 中 ref 是普通 prop
interface InputProps {
  ref?: React.Ref<HTMLInputElement>
  value: string
  onChange: (value: string) => void
}

// 直接在组件 props 中声明 ref
function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />
}
```

### 3.2 use() 类型

```typescript
import { use } from 'react'

// use() 读取 Promise
const data: T = use<T>(promise)

// use() 读取 Context
const value: T = use<T>(context)
```

---

## 四、启用 React Compiler（可选）

### 4.1 安装与配置

```bash
npm install babel-plugin-react-compiler
```

```javascript
// vite.config.ts
import react from '@vitejs/plugin-react'

export default {
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler']
      }
    })
  ]
}
```

### 4.2 逐步移除手动 memo

```typescript
// 启用 Compiler 后，可以逐步移除 useMemo/useCallback

// 第一步：保留现有代码，确保 Compiler 正常工作
function Component({ data }) {
  const processed = useMemo(() => process(data), [data])
  return <div>{processed}</div>
}

// 第二步：测试通过后移除
function Component({ data }) {
  const processed = process(data)
  return <div>{processed}</div>
}
```

---

## 五、常见问题

### 5.1 第三方库兼容性

```
常见已兼容 React 19 的库：
- react-router-dom v7+
- @tanstack/react-query v5+
- zustand v5+
- @reduxjs/toolkit v2+
- antd v5+
- @mui/material v6+
```

### 5.2 水合（Hydration）错误

```typescript
// React 19 对水合错误更严格
// 确保服务端和客户端渲染一致

// ❌ 服务端和客户端不一致
function Component() {
  return <div>{Date.now()}</div>
}

// ✅ 使用 useEffect 设置客户端专属内容
function Component() {
  const [time, setTime] = useState<number | null>(null)

  useEffect(() => {
    setTime(Date.now())
  }, [])

  return <div>{time ?? '加载中...'}</div>
}
```

---

## 六、迁移检查清单

```
┌─────────────────────────────────────────┐
│         React 19 迁移检查清单           │
├─────────────────────────────────────────┤
│                                         │
│  📦 升级                                │
│  □ 安装 react@19 react-dom@19           │
│  □ 升级 @types/react@19                 │
│  □ 升级第三方库到兼容版本               │
│                                         │
│  🔧 代码迁移                            │
│  □ 移除 forwardRef（改用 ref prop）     │
│  □ 更新 Context.Provider → Context      │
│  □ 移除函数组件 defaultProps            │
│  □ 移除 string refs                     │
│  □ useFormState → useActionState        │
│  □ 更新 TypeScript 类型                 │
│                                         │
│  🚀 新特性采用（可选）                  │
│  □ 使用 use() 替代 useContext           │
│  □ 使用 Actions 处理表单                │
│  □ 使用 useOptimistic 乐观更新          │
│  □ 使用文档元数据（title/meta）         │
│  □ 启用 React Compiler                  │
│                                         │
│  ✅ 测试                                │
│  □ 运行单元测试                         │
│  □ 测试所有页面                         │
│  □ 检查控制台错误                       │
│  □ 验证水合（SSR）                      │
│  □ 性能测试                             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 七、总结

### ✅ 迁移要点

1. **升级依赖**：react@19、react-dom@19、类型库、第三方库
2. **移除废弃 API**：forwardRef、defaultProps、string refs
3. **更新 API**：Context Provider、useFormState → useActionState
4. **TypeScript**：更新 ref 类型和组件类型
5. **可选新特性**：use()、Actions、React Compiler
6. **测试验证**：单元测试、水合、性能

### 🔚 结束

- 上一章：[API 变化](/web/react/react19/05-api-changes/)
- 上一级：[React 19 新特性](/web/react/react19/)
- 返回：[React 学习指南](/web/react/)
