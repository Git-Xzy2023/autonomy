---
title: TypeScript
---

# TypeScript

> TypeScript 让 React 开发更安全、更高效。

---

## 一、TypeScript 配置

### 1.1 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

---

## 二、组件类型

### 2.1 函数组件

```typescript
// 方式 1：React.FC（不推荐，隐含 children 类型）
const Button: React.FC<ButtonProps> = (props) => {
  return <button>{props.children}</button>
}

// 方式 2：直接标注 props（推荐）
function Button(props: ButtonProps) {
  return <button>{props.children}</button>
}

// 方式 3：箭头函数
const Button = (props: ButtonProps) => {
  return <button>{props.children}</button>
}
```

### 2.2 Props 类型定义

```typescript
// 基础 Props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

// 继承 HTML 元素属性
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

function Input({ label, error, ...rest }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...rest} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}
```

### 2.3 泛型组件

```typescript
// 泛型列表组件
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// 使用
interface User {
  id: string
  name: string
}

const users: User[] = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' }
]

function UserList() {
  return (
    <List
      items={users}
      renderItem={user => <div>{user.name}</div>}
      keyExtractor={user => user.id}
    />
  )
}
```

---

## 三、Hooks 类型

### 3.1 useState

```typescript
// 简单类型
const [count, setCount] = useState(0)
const [name, setName] = useState('')

// 联合类型
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

// 对象类型
interface User {
  name: string
  age: number
}
const [user, setUser] = useState<User | null>(null)

// 初始值类型推断
const [state, setState] = useState({ count: 0, name: '' })
// state 类型：{ count: number; name: string }
```

### 3.2 useReducer

```typescript
interface State {
  count: number
  loading: boolean
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setLoading'; payload: boolean }

const initialState: State = { count: 0, loading: false }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'setLoading':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  )
}
```

### 3.3 useRef

```typescript
// DOM 引用
const inputRef = useRef<HTMLInputElement>(null)

// 可变值引用
const timerRef = useRef<number | null>(null)

// 使用
useEffect(() => {
  inputRef.current?.focus()
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }
}, [])
```

### 3.4 useContext

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme 必须在 ThemeProvider 内使用')
  }
  return context
}
```

### 3.5 自定义 Hook 类型

```typescript
interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
  // ...
  return { data, loading, error, refetch }
}
```

---

## 四、事件类型

### 4.1 常用事件类型

```typescript
// 鼠标事件
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  console.log(e.currentTarget)
}

// 键盘事件
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    // ...
  }
}

// 表单事件
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

// 拖拽事件
const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
  e.dataTransfer.setData('text', 'hello')
}
```

### 4.2 事件类型继承

```typescript
interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

// 或继承 React 提供的类型
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}
```

---

## 五、工具类型

### 5.1 常用工具类型

```typescript
// Partial：所有属性可选
type PartialUser = Partial<User>

// Required：所有属性必填
type RequiredUser = Required<User>

// Pick：选取部分属性
type UserBasic = Pick<User, 'id' | 'name'>

// Omit：排除部分属性
type UserWithoutId = Omit<User, 'id'>

// Record：键值对
type UserMap = Record<string, User>

// ReturnType：函数返回值类型
type FetchUserReturn = ReturnType<typeof fetchUser>
```

### 5.2 自定义工具类型

```typescript
// 获取组件 Props 类型
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never

// 使用
type ButtonProps = ComponentProps<typeof Button>

// 获取 Promise 返回值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// 深度 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```

---

## 六、类型守卫

### 6.1 类型断言

```typescript
// as 断言
const element = document.getElementById('root') as HTMLDivElement

// 非空断言
const value = maybeNull!  // 断言不为 null/undefined

// 类型谓词
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === 'string'
}

if (isUser(data)) {
  console.log(data.name)  // 类型为 User
}
```

### 6.2 in 操作符

```typescript
interface Admin {
  role: 'admin'
  permissions: string[]
}

interface User {
  role: 'user'
  name: string
}

function checkUser(user: Admin | User) {
  if ('permissions' in user) {
    console.log(user.permissions)  // 类型为 Admin
  } else {
    console.log(user.name)  // 类型为 User
  }
}
```

### 6.3 typeof 与 instanceof

```typescript
// typeof
function process(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())  // string
  } else {
    console.log(value.toFixed(2))  // number
  }
}

// instanceof
class Dog { bark() {} }
class Cat { meow() {} }

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}
```

---

## 七、类型声明文件

### 7.1 全局类型声明

```typescript
// global.d.ts
declare global {
  interface Window {
    myCustomFunction: () => void
  }
}

export {}
```

### 7.2 模块声明

```typescript
// module.d.ts
declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  import React from 'react'
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVG
}
```

### 7.3 环境变量声明

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 八、TypeScript 最佳实践

### 8.1 避免使用 any

```typescript
// ❌ 使用 any
function process(data: any) {
  return data.name
}

// ✅ 使用具体类型
function process(data: { name: string }) {
  return data.name
}

// ✅ 或使用泛型
function process<T>(data: T): T {
  return data
}

// ✅ 必须用时使用 unknown
function process(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
}
```

### 8.2 类型推断

```typescript
// ✅ 让 TypeScript 推断
const count = 0  // 类型推断为 number
const name = '张三'  // 类型推断为 string

// ❌ 不必要的类型标注
const count: number = 0

// ✅ 需要时显式标注
const user: User = { name: '张三', age: 25 }
```

### 8.3 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // 开启所有严格检查
    "noUnusedLocals": true,            // 检查未使用的局部变量
    "noUnusedParameters": true,        // 检查未使用的参数
    "noImplicitReturns": true,         // 检查函数所有路径都有返回
    "noFallthroughCasesInSwitch": true // 检查 switch case 穿透
  }
}
```

---

## 九、总结

### ✅ 关键知识点

1. **组件类型**：函数组件、Props 类型、泛型组件
2. **Hooks 类型**：useState、useReducer、useRef、useContext
3. **事件类型**：MouseEvent、KeyboardEvent、ChangeEvent
4. **工具类型**：Partial、Pick、Omit、Record
5. **类型守卫**：as、in、typeof、instanceof
6. **类型声明**：全局类型、模块声明、环境变量
7. **最佳实践**：避免 any、利用类型推断、开启严格模式

### 🔜 下一章

- 下一章：[React Router 基础](/web/react-ecosystem/react-router/01-basics/)
- 上一章：[代码规范](/web/react/best-practices/02-code-style/)
- 上一级：[React 最佳实践](/web/react/best-practices/)
