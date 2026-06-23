---
title: Jest 基础
---

# Jest 基础

> Jest 是 JavaScript 测试框架，提供完整的测试解决方案。

---

## 一、Jest 简介

### 1.1 特点

```
┌─────────────────────────────────────────┐
│              Jest 特点                  │
├─────────────────────────────────────────┤
│                                         │
│  ├── 零配置                             │
│  ├── 速度快                             │
│  ├── 内置断言库                         │
│  ├── 内置 Mock 功能                     │
│  ├── 代码覆盖率                         │
│  ├── 快照测试                           │
│  └── 并行测试                           │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 安装

```bash
# 使用 Vite
npm install --save-dev jest @types/jest ts-jest

# 初始化配置
npx jest --init

# 或使用 Vite 的 vitest（推荐）
npm install --save-dev vitest
```

---

## 二、基本测试

### 2.1 第一个测试

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

// math.test.ts
import { add, subtract } from './math'

describe('数学函数', () => {
  test('加法', () => {
    expect(add(1, 2)).toBe(3)
    expect(add(-1, 1)).toBe(0)
  })

  test('减法', () => {
    expect(subtract(2, 1)).toBe(1)
    expect(subtract(1, 2)).toBe(-1)
  })
})
```

### 2.2 测试结构

```typescript
describe('分组', () => {
  beforeAll(() => {
    // 所有测试前执行一次
  })

  afterAll(() => {
    // 所有测试后执行一次
  })

  beforeEach(() => {
    // 每个测试前执行
  })

  afterEach(() => {
    // 每个测试后执行
  })

  test('测试用例', () => {
    // 测试逻辑
  })
})
```

---

## 三、断言

### 3.1 基本断言

```typescript
test('基本断言', () => {
  // 相等
  expect(1 + 1).toBe(2)
  expect({ a: 1 }).toEqual({ a: 1 })

  // 布尔
  expect(true).toBeTruthy()
  expect(false).toBeFalsy()
  expect(null).toBeNull()
  expect(undefined).toBeUndefined()
  expect(1).toBeDefined()

  // 数字
  expect(2).toBeGreaterThan(1)
  expect(1).toBeLessThan(2)
  expect(2).toBeGreaterThanOrEqual(2)
  expect(1).toBeLessThanOrEqual(1)

  // 字符串
  expect('hello world').toMatch(/world/)
  expect('hello').toContain('ell')

  // 数组
  expect([1, 2, 3]).toContain(2)
  expect([1, 2, 3]).toHaveLength(3)

  // 异常
  expect(() => throw new Error('错误')).toThrow('错误')
})
```

### 3.2 异步测试

```typescript
// 方式 1：回调
test('回调测试', (done) => {
  fetchData((data) => {
    expect(data).toBe('hello')
    done()
  })
})

// 方式 2：Promise
test('Promise 测试', () => {
  return fetchData().then(data => {
    expect(data).toBe('hello')
  })
})

// 方式 3：async/await
test('async/await 测试', async () => {
  const data = await fetchData()
  expect(data).toBe('hello')
})

// 方式 4：resolves/rejects
test('resolves 测试', () => {
  return expect(fetchData()).resolves.toBe('hello')
})

test('rejects 测试', () => {
  return expect(fetchError()).rejects.toThrow('错误')
})
```

---

## 四、Mock

### 4.1 Mock 函数

```typescript
test('Mock 函数', () => {
  const mockFn = jest.fn()

  // 调用
  mockFn('arg1', 'arg2')

  // 断言调用
  expect(mockFn).toHaveBeenCalled()
  expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  expect(mockFn).toHaveBeenCalledTimes(1)

  // 模拟返回值
  mockFn.mockReturnValue('hello')
  expect(mockFn()).toBe('hello')

  // 模拟一次性返回值
  mockFn.mockReturnValueOnce('first').mockReturnValueOnce('second')

  // 模拟实现
  mockFn.mockImplementation((a, b) => a + b)
  expect(mockFn(1, 2)).toBe(3)

  // 模拟 Promise
  mockFn.mockResolvedValue('hello')
  await expect(mockFn()).resolves.toBe('hello')
})
```

### 4.2 Mock 模块

```typescript
// mock api.ts
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1, name: '张三' })),
  fetchPosts: jest.fn(() => Promise.resolve([]))
}))

import { fetchUser } from './api'

test('Mock 模块', async () => {
  const user = await fetchUser(1)
  expect(user.name).toBe('张三')
  expect(fetchUser).toHaveBeenCalledWith(1)
})
```

### 4.3 Mock 实现

```typescript
// 部分模拟
jest.mock('./api', () => ({
  ...jest.requireActual('./api'),  // 保留真实实现
  fetchUser: jest.fn()  // 只模拟 fetchUser
}))
```

---

## 五、快照测试

### 5.1 基本快照

```typescript
import { render } from '@testing-library/react'
import Button from './Button'

test('Button 快照', () => {
  const { container } = render(<Button>点击</Button>)
  expect(container.firstChild).toMatchSnapshot()
})
```

### 5.2 更新快照

```bash
# 更新快照
npx jest -u

# 或
npx jest --updateSnapshot
```

### 5.3 行内快照

```typescript
test('行内快照', () => {
  const { container } = render(<Button>点击</Button>)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <button class="btn">
      点击
    </button>
  `)
})
```

---

## 六、测试 React 组件

### 6.1 简单组件测试

```typescript
// Button.tsx
function Button({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

test('渲染按钮', () => {
  render(<Button>点击</Button>)
  expect(screen.getByText('点击')).toBeInTheDocument()
})

test('点击事件', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>点击</Button>)

  fireEvent.click(screen.getByText('点击'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

test('禁用状态', () => {
  render(<Button disabled>点击</Button>)
  expect(screen.getByText('点击')).toBeDisabled()
})
```

### 6.2 Hook 测试

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

test('useCounter', () => {
  const { result } = renderHook(() => useCounter(0))

  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)

  act(() => {
    result.current.decrement()
  })

  expect(result.current.count).toBe(0)
})
```

---

## 七、配置

### 7.1 jest.config.js

```javascript
module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',

  // 测试文件匹配
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],

  // 转换
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest'
  },

  // 模块名映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },

  // setup 文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 覆盖率
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx'
  ],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### 7.2 Vite + Vitest 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

---

## 八、测试最佳实践

### 8.1 测试命名

```typescript
// ✅ 描述性命名
test('当用户点击提交按钮时，应该调用 onSubmit', () => {})

test('当输入为空时，应该显示错误提示', () => {})

// ❌ 模糊命名
test('测试1', () => {})
test('按钮', () => {})
```

### 8.2 AAA 模式

```typescript
test('加法', () => {
  // Arrange（准备）
  const a = 1
  const b = 2

  // Act（执行）
  const result = add(a, b)

  // Assert（断言）
  expect(result).toBe(3)
})
```

### 8.3 每个测试独立

```typescript
// ✅ 每个测试独立
beforeEach(() => {
  // 重置 Mock
  jest.clearAllMocks()
  // 重置状态
  localStorage.clear()
})
```

---

## 九、总结

### ✅ 关键知识点

1. **Jest 基础**：describe、test、expect
2. **断言**：toBe、toEqual、toBeTruthy 等
3. **异步测试**：async/await、resolves/rejects
4. **Mock**：Mock 函数、Mock 模块
5. **快照测试**：toMatchSnapshot
6. **React 测试**：render、fireEvent
7. **Hook 测试**：renderHook、act
8. **配置**：jest.config.js 或 vitest

### 🔜 下一章

- 下一章：[Testing Library](/web/react/testing/02-testing-library/)
- 上一章：[React 设计模式](/web/react/patterns/)
- 上一级：[React 测试](/web/react/testing/)
