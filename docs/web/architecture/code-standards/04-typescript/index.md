---
title: TypeScript 规范
---

# TypeScript 规范

> TypeScript 规范确保类型安全，提升代码质量。

---

## 一、tsconfig 配置

### 1.1 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // 开启所有严格检查
    "noImplicitAny": true,             // 禁止隐式 any
    "strictNullChecks": true,          // 严格 null 检查
    "strictFunctionTypes": true,       // 严格函数类型
    "strictBindCallApply": true,       // 严格 bind/call/apply
    "strictPropertyInitialization": true, // 严格属性初始化
    "noImplicitThis": true,            // 禁止隐式 this
    "alwaysStrict": true,              // 严格模式

    "noUnusedLocals": true,            // 检查未使用的局部变量
    "noUnusedParameters": true,        // 检查未使用的参数
    "noImplicitReturns": true,         // 检查隐式返回
    "noFallthroughCasesInSwitch": true, // switch case 穿透检查

    "forceConsistentCasingInFileNames": true, // 文件名大小写一致
    "skipLibCheck": true               // 跳过类型库检查
  }
}
```

---

## 二、类型规范

### 2.1 避免使用 any

```typescript
// ❌ 不好：使用 any
function process(data: any) {
  return data.name  // 无类型检查
}

// ✅ 好：定义具体类型
interface UserData {
  name: string
  age: number
}

function process(data: UserData) {
  return data.name  // 有类型检查
}

// ✅ 使用 unknown 替代 any
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name
  }
  throw new Error('Invalid data')
}
```

### 2.2 类型推断

```typescript
// ❌ 不好：不必要的类型注解
const name: string = '张三'
const age: number = 25
const isActive: boolean = true

// ✅ 好：让 TS 推断
const name = '张三'
const age = 25
const isActive = true

// ✅ 复杂类型需要注解
const users: User[] = await fetchUsers()
```

### 2.3 接口 vs 类型别名

```typescript
// ✅ 对象用 interface（可扩展）
interface User {
  name: string
  age: number
}

interface User {
  email: string  // 扩展
}

// ✅ 联合类型、交叉类型用 type
type Status = 'active' | 'inactive'
type UserWithProfile = User & { profile: Profile }

// ✅ 工具类型用 type
type PartialUser = Partial<User>
type ReadonlyUser = Readonly<User>
```

---

## 三、函数规范

### 3.1 函数类型

```typescript
// ✅ 函数参数和返回值类型
function add(a: number, b: number): number {
  return a + b
}

// ✅ 箭头函数
const multiply = (a: number, b: number): number => a * b

// ✅ 回调函数类型
function fetchData(callback: (data: User) => void): void {
  // ...
}

// ✅ 函数类型定义
type Handler = (event: Event) => void
```

### 3.2 可选参数和默认值

```typescript
// ✅ 可选参数放最后
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}`
}

// ✅ 默认参数
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}`
}
```

### 3.3 函数重载

```typescript
// ✅ 函数重载
function parse(input: string): string[]
function parse(input: number): number[]
function parse(input: string | number): string[] | number[] {
  if (typeof input === 'string') {
    return input.split(',')
  }
  return [input]
}
```

---

## 四、泛型规范

### 4.1 泛型命名

```typescript
// ✅ 单字母（简单场景）
function identity<T>(value: T): T {
  return value
}

// ✅ 描述性名称（复杂场景）
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// ✅ 常见泛型命名
// T - Type
// K - Key
// V - Value
// E - Element
// R - Result
```

### 4.2 泛型约束

```typescript
// ✅ 约束泛型
function getLength<T extends { length: number }>(arr: T): number {
  return arr.length
}

getLength('hello')   // 5
getLength([1, 2, 3]) // 3
// getLength(123)    // ❌ 错误
```

---

## 五、枚举规范

### 5.1 枚举使用

```typescript
// ✅ 字符串枚举（推荐）
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

// ✅ 数字枚举
enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3
}

// ✅ const enum（编译时内联）
const enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}
```

### 5.2 联合类型替代枚举

```typescript
// ✅ 联合类型（更轻量）
type Status = 'active' | 'inactive' | 'pending'

const status: Status = 'active'
```

---

## 六、React + TypeScript

### 6.1 组件类型

```typescript
// ✅ 函数组件
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

function Button({ variant = 'primary', size = 'medium', onClick, children }: ButtonProps) {
  return (
    <button className={`${variant} ${size}`} onClick={onClick}>
      {children}
    </button>
  )
}
```

### 6.2 Hook 类型

```typescript
// ✅ useState
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)

// ✅ useRef
const inputRef = useRef<HTMLInputElement>(null)

// ✅ 自定义 Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

---

## 七、总结

### ✅ 关键知识点

1. **严格模式**：开启 strict 和其他严格检查
2. **避免 any**：使用具体类型或 unknown
3. **类型推断**：简单类型让 TS 推断，复杂类型注解
4. **interface vs type**：对象用 interface，联合/交叉用 type
5. **泛型**：合理命名，添加约束
6. **枚举**：字符串枚举或联合类型

### 🔜 下一章

- 下一章：[代码审查](/web/architecture/code-standards/05-code-review/)
- 上一章：[Git Commit](/web/architecture/code-standards/03-git-commit/)
- 上一级：[代码规范](/web/architecture/code-standards/)
