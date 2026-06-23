---
title: Monorepo
---

# Monorepo

> Monorepo 是将多个项目（包）放在一个代码仓库中管理的策略。

---

## 一、什么是 Monorepo

### 1.1 概念

```
┌─────────────────────────────────────────┐
│     Polyrepo（多仓库）vs Monorepo      │
├─────────────────────────────────────────┤
│                                         │
│  Polyrepo（传统多仓库）                 │
│  ├── repo-1/  (项目1)                  │
│  ├── repo-2/  (项目2)                  │
│  └── repo-3/  (项目3)                  │
│  每个仓库独立管理                       │
│                                         │
│  Monorepo（单体仓库）                   │
│  └── monorepo/                         │
│      ├── packages/                     │
│      │   ├── ui/       (UI 组件库)     │
│      │   ├── utils/    (工具库)        │
│      │   └── api/      (API 层)        │
│      ├── apps/                         │
│      │   ├── web/      (Web 应用)      │
│      │   └── admin/    (管理后台)      │
│      └── package.json                  │
│  所有项目在一个仓库管理                 │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 优缺点

| 优点                       | 缺点                         |
| -------------------------- | ---------------------------- |
| 代码共享方便               | 仓库体积大                   |
| 统一配置（ESLint/TS）      | 权限管理粗粒度               |
| 原子化提交（跨包修改）     | 构建配置复杂                 |
| 依赖版本统一               | CI/CD 需要优化               |
| 便于重构                   | 需要工具支持                 |

---

## 二、Monorepo 工具

### 2.1 工具对比

| 工具       | 特点                           | 适用场景           |
| ---------- | ------------------------------ | ------------------ |
| **pnpm**   | 原生 workspace，硬链接节省空间 | 通用               |
| **Lerna**  | 老牌工具，版本发布管理         | npm 包发布         |
| **Turborepo** | 构建缓存，并行构建          | 大型项目           |
| **Nx**     | 智能构建，依赖图分析           | 企业级             |
| **Yarn Workspace** | 原生 workspace        | 简单项目           |

---

## 三、pnpm Workspace

### 3.1 目录结构

```
my-monorepo/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   └── src/
│   ├── utils/
│   │   ├── package.json
│   │   └── src/
│   └── api/
│       ├── package.json
│       └── src/
└── apps/
    ├── web/
    │   ├── package.json
    │   └── src/
    └── admin/
        ├── package.json
        └── src/
```

### 3.2 配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// 根 package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### 3.3 包间依赖

```json
// apps/web/package.json
{
  "name": "@my-app/web",
  "dependencies": {
    "@my-app/ui": "workspace:*",    // 引用本地包
    "@my-app/utils": "workspace:*",
    "react": "^18.0.0"
  }
}
```

### 3.4 常用命令

```bash
# 安装所有依赖
pnpm install

# 给所有包安装依赖
pnpm add -r lodash

# 给特定包安装依赖
pnpm add axios --filter @my-app/web

# 给所有包安装开发依赖
pnpm add -D -r eslint

# 运行所有包的 build
pnpm -r build

# 运行特定包的命令
pnpm --filter @my-app/web dev
```

---

## 四、Turborepo

### 4.1 安装与配置

```bash
# 安装
pnpm add -D -w turbo
```

```json
// 根 package.json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // 先构建依赖的包
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

### 4.2 构建缓存

```bash
# 第一次构建
pnpm build
# → 构建所有包

# 再次构建（无变化）
pnpm build
# → 命中缓存，跳过构建

# 修改某个包后构建
pnpm build
# → 只构建修改的包及其依赖
```

---

## 五、Lerna

### 5.1 配置

```json
// lerna.json
{
  "version": "1.0.0",
  "npmClient": "pnpm",
  "packages": ["packages/*"],
  "useWorkspaces": true
}
```

### 5.2 版本管理

```bash
# 查看变更
lerna changed

# 版本升级
lerna version patch  # 1.0.0 → 1.0.1
lerna version minor  # 1.0.0 → 1.1.0
lerna version major  # 1.0.0 → 2.0.0

# 发布到 npm
lerna publish
```

---

## 六、实际项目结构

### 6.1 组件库 Monorepo

```
ui-library/
├── packages/
│   ├── components/          # 组件库
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── theme/               # 主题
│   │   ├── src/
│   │   └── package.json
│   ├── icons/               # 图标
│   │   ├── src/
│   │   └── package.json
│   └── utils/               # 工具
│       ├── src/
│       └── package.json
├── apps/
│   ├── docs/                # 文档站点
│   └── playground/          # 调试
└── package.json
```

### 6.2 包的导出配置

```json
// packages/components/package.json
{
  "name": "@my-ui/components",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./Button": {
      "import": "./dist/Button.mjs",
      "require": "./dist/Button.js"
    }
  },
  "dependencies": {
    "@my-ui/utils": "workspace:*"
  }
}
```

---

## 七、CI/CD 配置

### 7.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint

      - run: pnpm test

      - run: pnpm build

      # 缓存 turbo
      - uses: actions/cache@v3
        with:
          path: .turbo
          key: turbo-${{ runner.os }}-${{ github.sha }}
```

---

## 八、总结

### ✅ 关键知识点

1. **Monorepo 价值**：代码共享、统一配置、原子提交
2. **工具选择**：pnpm（基础）、Turborepo（构建）、Lerna（发布）
3. **pnpm workspace**：`workspace:*` 引用本地包
4. **Turborepo**：构建缓存、依赖图、并行构建
5. **Lerna**：版本管理、npm 发布
6. **CI/CD**：缓存优化、并行构建

### 🔜 下一章

- 下一章：[Islands 架构](/web/architecture/architecture-patterns/05-islands/)
- 上一章：[微前端](/web/architecture/architecture-patterns/03-micro-frontends/)
- 上一级：[架构模式](/web/architecture/architecture-patterns/)
