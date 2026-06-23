---
title: 代码规范
---

# 代码规范

> 统一的代码规范提升团队协作效率和代码质量。

---

## 一、ESLint 配置

### 1.1 安装

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-jsx-a11y
```

### 1.2 .eslintrc.js

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    // React
    'react/react-in-jsx-scope': 'off',  // React 17+ 不需要
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // 通用
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  settings: {
    react: { version: 'detect' }
  }
}
```

---

## 二、Prettier 配置

### 2.1 安装

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

### 2.2 .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "bracketSameLine": false
}
```

### 2.3 .prettierignore

```
node_modules
dist
build
coverage
*.min.js
*.min.css
```

### 2.4 ESLint 集成

```javascript
// .eslintrc.js
extends: [
  // ...其他配置
  'plugin:prettier/recommended'
]
```

---

## 三、组件规范

### 3.1 组件定义

```typescript
// ✅ 函数组件 + TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
```

### 3.2 组件组织顺序

```typescript
function MyComponent(props: MyComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()
  const { user } = useAuth()
  useEffect(() => {}, [])

  // 2. 派生状态
  const computedValue = useMemo(() => {}, [])

  // 3. 事件处理
  const handleClick = useCallback(() => {}, [])

  // 4. 渲染
  return <div>...</div>
}
```

### 3.3 条件渲染

```typescript
// ✅ 短路 &&（适合单一条件）
{isLoading && <Spinner />}

// ✅ 三元（适合二选一）
{isLoading ? <Spinner /> : <Content />}

// ✅ IIFE 或提前 return（适合复杂条件）
const renderContent = () => {
  if (isLoading) return <Spinner />
  if (error) return <Error />
  return <Content />
}

return <div>{renderContent()}</div>
```

### 3.4 列表渲染

```typescript
// ✅ 使用 key
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// ❌ 不要用 index 作为 key（除非列表静态）
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}
```

---

## 四、Props 规范

### 4.1 Props 命名

```typescript
// ✅ 使用 is/has 前缀表示布尔
interface ButtonProps {
  isLoading: boolean
  hasError: boolean
  isVisible: boolean
  disabled: boolean  // HTML 原生属性保持
}

// ✅ 事件处理以 on 开头
interface ButtonProps {
  onClick: () => void
  onChange: (value: string) => void
  onSubmit: (data: FormData) => void
}
```

### 4.2 Props 默认值

```typescript
// ✅ 解构默认值
function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false
}: ButtonProps) {}

// ✅ 或使用 defaultProps（不推荐，未来可能废弃）
Button.defaultProps = {
  variant: 'primary'
}
```

### 4.3 Props 透传

```typescript
// ✅ 使用 ...rest 透传
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant, ...rest }: ButtonProps) {
  return <button {...rest} className={`btn btn-${variant}`} />
}
```

---

## 五、状态规范

### 5.1 状态类型选择

```typescript
// ✅ useState：简单状态
const [count, setCount] = useState(0)
const [name, setName] = useState('')

// ✅ useReducer：复杂状态逻辑
const [state, dispatch] = useReducer(reducer, initialState)

// ✅ 状态管理库：全局状态
const user = useStore(state => state.user)
```

### 5.2 状态更新

```typescript
// ✅ 函数式更新（依赖前值）
setCount(prev => prev + 1)

// ❌ 直接使用当前值（可能过期）
setCount(count + 1)

// ✅ 批量更新
const handleClick = () => {
  setCount(c => c + 1)
  setName('张三')
}
```

### 5.3 状态提升

```typescript
// 当两个子组件需要共享状态时，提升到父组件
function Parent() {
  const [value, setValue] = useState('')

  return (
    <>
      <ChildA value={value} onChange={setValue} />
      <ChildB value={value} />
    </>
  )
}
```

---

## 六、Hooks 规范

### 6.1 Hooks 调用规则

```typescript
// ✅ 只在顶层调用
function MyComponent() {
  const [state, setState] = useState()  // ✅ 顶层

  if (condition) {
    // const [x, setX] = useState()  // ❌ 不能在条件中
  }

  // ✅ 可以在自定义 Hook 中调用
  const data = useMyHook()
}

// ❌ 不能在普通函数中调用
function helper() {
  // const [state, setState] = useState()  // 错误
}
```

### 6.2 依赖数组

```typescript
// ✅ 完整依赖
useEffect(() => {
  fetchData(id)
}, [id])

// ✅ 使用 useCallback 避免依赖变化
const fetchData = useCallback((id) => {
  // ...
}, [])

useEffect(() => {
  fetchData(id)
}, [fetchData, id])
```

### 6.3 自定义 Hook 返回值

```typescript
// ✅ 两个值：返回数组
function useToggle() {
  const [value, setValue] = useState(false)
  const toggle = () => setValue(v => !v)
  return [value, toggle] as const
}

// ✅ 多个值：返回对象
function useFetch(url) {
  return { data, loading, error, refetch }
}
```

---

## 七、性能规范

### 7.1 避免内联函数

```typescript
// ❌ 每次渲染创建新函数
function MyComponent() {
  return <button onClick={() => handleClick(id)}>点击</button>
}

// ✅ 使用 useCallback
function MyComponent() {
  const handleClick = useCallback(() => {
    // ...
  }, [id])

  return <button onClick={handleClick}>点击</button>
}
```

### 7.2 避免内联对象

```typescript
// ❌ 每次渲染创建新对象
function MyComponent() {
  return <Child style={{ color: 'red' }} />
}

// ✅ 使用 useMemo 或常量
const style = { color: 'red' }

function MyComponent() {
  return <Child style={style} />
}
```

### 7.3 合理使用 memo

```typescript
// ✅ 纯展示组件使用 memo
const UserCard = memo(function UserCard({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
})

// ❌ 不需要 memo 的情况
function App() {
  // 简单组件，不需要 memo
  return <div>Hello</div>
}
```

---

## 八、Git 规范

### 8.1 Commit Message

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 8.2 Type

```
feat:     新功能
fix:      修复 bug
docs:     文档变更
style:    代码格式（不影响功能）
refactor: 重构（既不是新功能也不是修 bug）
test:     增加测试
chore:    构建工具或辅助工具变更
```

### 8.3 示例

```
feat(auth): 添加用户登录功能

- 添加 LoginForm 组件
- 集成 JWT 认证
- 添加路由守卫

Closes #123
```

---

## 九、总结

### ✅ 关键知识点

1. **ESLint**：代码质量检查
2. **Prettier**：代码格式化
3. **组件规范**：函数组件、Props 类型、组织顺序
4. **Props 规范**：命名、默认值、透传
5. **状态规范**：选择合适的状态类型、函数式更新
6. **Hooks 规范**：调用规则、依赖数组、返回值
7. **性能规范**：避免内联、合理使用 memo
8. **Git 规范**：Commit Message 格式

### 🔜 下一章

- 下一章：[TypeScript](/web/react/best-practices/03-typescript/)
- 上一章：[项目结构](/web/react/best-practices/01-project-structure/)
- 上一级：[React 最佳实践](/web/react/best-practices/)
