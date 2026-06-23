---
title: 项目结构
---

# 项目结构

> 良好的项目结构是可维护代码的基础。

---

## 一、目录结构

### 1.1 按类型组织

```
src/
├── components/        # 通用组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   └── Input/
├── pages/             # 页面组件
│   ├── Home/
│   └── About/
├── hooks/             # 自定义 Hook
│   ├── useAuth.ts
│   └── useFetch.ts
├── utils/             # 工具函数
│   ├── format.ts
│   └── validate.ts
├── services/          # API 服务
│   ├── api.ts
│   └── auth.ts
├── store/             # 状态管理
│   └── index.ts
├── types/             # 类型定义
│   └── index.ts
├── styles/            # 全局样式
│   └── global.css
└── App.tsx
```

### 1.2 按功能组织（推荐）

```
src/
├── features/          # 按功能模块组织
│   ├── auth/          # 认证模块
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authApi.ts
│   │   ├── store/
│   │   │   └── authSlice.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── user/          # 用户模块
│   │   ├── components/
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserList.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   └── post/          # 文章模块
├── components/        # 通用组件
│   ├── Button/
│   └── Input/
├── hooks/             # 通用 Hook
├── utils/             # 通用工具
├── types/             # 通用类型
└── App.tsx
```

---

## 二、组件文件组织

### 2.1 单文件组件

```
Button/
├── Button.tsx          # 组件实现
├── Button.test.tsx     # 测试
├── Button.module.css   # 样式
├── Button.stories.tsx  # Storybook
└── index.ts            # 导出
```

### 2.2 index.ts 导出

```typescript
// Button/index.ts
export { default as Button } from './Button'
export type { ButtonProps } from './Button'
```

### 2.3 使用

```typescript
// 其他文件
import { Button } from '@/components/Button'
```

---

## 三、路径别名

### 3.1 配置 tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### 3.2 配置 Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks')
    }
  }
})
```

### 3.3 使用

```typescript
// ❌ 相对路径
import Button from '../../../components/Button'
import { useAuth } from '../../../hooks/useAuth'

// ✅ 别名
import Button from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
```

---

## 四、组件分类

### 4.1 组件类型

```
┌─────────────────────────────────────────┐
│              组件类型                   │
├─────────────────────────────────────────┤
│                                         │
│  1. 页面组件（Pages）                   │
│     ├── 路由对应                        │
│     ├── 组合业务组件                    │
│     └── 获取数据                        │
│                                         │
│  2. 业务组件（Features）                │
│     ├── 特定业务逻辑                    │
│     ├── 可复用                          │
│     └── 包含状态                        │
│                                         │
│  3. 通用组件（Common）                  │
│     ├── 无业务逻辑                      │
│     ├── 高度可复用                      │
│     └── 通过 props 配置                 │
│                                         │
│  4. UI 组件（UI）                       │
│     ├── 纯展示                          │
│     ├── 无状态                          │
│     └── 基础元素                        │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 目录建议

```
src/
├── pages/              # 页面组件
│   ├── Home/
│   └── User/
├── features/           # 业务组件
│   ├── auth/
│   └── user/
├── components/         # 通用组件
│   ├── Button/
│   └── Input/
└── ui/                 # UI 组件
    ├── Icon/
    └── Typography/
```

---

## 五、命名规范

### 5.1 文件命名

```
# 组件文件：PascalCase
Button.tsx
UserProfile.tsx

# Hook 文件：camelCase
useAuth.ts
useFetch.ts

# 工具文件：camelCase
formatDate.ts
validateInput.ts

# 类型文件：camelCase 或 kebab-case
types.ts
user-types.ts

# 样式文件：kebab-case 或同组件名
button.module.css
Button.module.css

# 测试文件：同组件名 + .test
Button.test.tsx
```

### 5.2 组件命名

```typescript
// ✅ PascalCase
function UserProfile() {}
function LoginForm() {}

// ✅ 有意义的前缀
function UserCard() {}      // 用户卡片
function UserList() {}      // 用户列表
function UserDetail() {}    // 用户详情

// ❌ 默认导出
export default function() {}

// ✅ 命名导出
export function UserProfile() {}
```

### 5.3 Hook 命名

```typescript
// ✅ 以 use 开头
function useAuth() {}
function useFetch() {}
function useLocalStorage() {}

// ✅ 描述功能
function useWindowSize() {}      // 窗口大小
function useClickOutside() {}    // 点击外部
```

---

## 六、导入顺序

### 6.1 推荐顺序

```typescript
// 1. React 相关
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 2. 第三方库
import axios from 'axios'
import { format } from 'date-fns'

// 3. 绝对路径（@/）
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'

// 4. 相对路径
import { UserCard } from './UserCard'
import { formatDate } from './utils'

// 5. 样式
import './styles.css'
```

### 6.2 ESLint 配置

```json
{
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          }
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc"
        }
      }
    ]
  }
}
```

---

## 七、配置文件

### 7.1 .env 文件

```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=My App

# .env.production
VITE_API_URL=https://api.example.com
```

### 7.2 使用环境变量

```typescript
const apiUrl = import.meta.env.VITE_API_URL
const appTitle = import.meta.env.VITE_APP_TITLE
```

### 7.3 类型声明

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 八、总结

### ✅ 关键知识点

1. **目录结构**：按功能组织优于按类型组织
2. **组件文件**：组件 + 测试 + 样式 + index.ts
3. **路径别名**：使用 @/ 等别名避免相对路径
4. **组件分类**：Pages、Features、Common、UI
5. **命名规范**：PascalCase 组件、camelCase Hook
6. **导入顺序**：React → 第三方 → 别名 → 相对
7. **环境变量**：使用 .env 文件管理配置

### 🔜 下一章

- 下一章：[代码规范](/web/react/best-practices/02-code-style/)
- 上一章：[React 测试](/web/react/testing/)
- 上一级：[React 最佳实践](/web/react/best-practices/)
