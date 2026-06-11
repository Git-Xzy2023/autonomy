---
title: CI/CD
---

# CI/CD 学习笔记

> CI/CD（持续集成/持续部署）是现代软件开发流程的核心，通过自动化构建、测试和部署流程，提高开发效率和代码质量。

---

## 一、CI/CD 概述

### 1.1 什么是 CI/CD

```
CI（Continuous Integration） 持续集成
├── 开发者频繁地将代码集成到主干
├── 自动构建和测试
└── 及早发现问题

CD（Continuous Delivery/Deployment） 持续交付/部署
├── 持续交付：自动部署到预发布环境
└── 持续部署：自动部署到生产环境
```

**CI/CD 流水线**：

```
开发者提交代码
      │
      ▼
┌──────────────┐
│  自动构建   │  ← 编译、打包
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  自动测试   │  ← 单元测试、集成测试
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  代码审查   │  ← Lint、安全扫描
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  自动部署   │  ← 部署到服务器
└──────────────┘
```

### 1.2 为什么需要 CI/CD

| 优势             | 说明                             |
| ---------------- | -------------------------------- |
| **提高代码质量** | 自动测试和代码检查，减少错误     |
| **加速开发效率** | 自动化流程，减少手动操作         |
| **快速反馈**     | 每次提交都能获得即时反馈         |
| **降低风险**     | 小步快跑，频繁部署，降低失败风险 |
| **可靠部署**     | 标准化流程，部署更可靠           |
| **节省时间**     | 自动化代替重复工作               |

### 1.3 主流 CI/CD 平台

| 平台                    | 说明                  | 适用场景             |
| ----------------------- | --------------------- | -------------------- |
| **GitHub Actions**      | GitHub 原生支持，免费 | GitHub 项目          |
| **GitLab CI/CD**        | GitLab 原生，功能全面 | GitLab 项目          |
| **Jenkins**             | 开源，自托管，灵活    | 企业项目，需要定制化 |
| **CircleCI**            | 云服务，速度快        | 各类项目             |
| **Travis CI**           | 老牌云 CI             | 开源项目             |
| **Bitbucket Pipelines** | Bitbucket 原生        | Bitbucket 项目       |

---

## 二、GitHub Actions 详解

### 2.1 基本概念

**Workflow（工作流）**：自动化流程的定义文件，存储在 `.github/workflows/` 目录中。

**核心组件**：

```
┌──────────────────────────────────────────────────┐
│  Workflow（工作流）                               │
│  ├── 由一个或多个 Job 组成                        │
│  ├── 由事件（Event）触发                          │
│  └── 存储在 .github/workflows/*.yml             │
│                                                    │
│  Job（作业）                                        │
│  ├── 在 Runner（运行器）上执行                       │
│  ├── 由多个 Step（步骤）组成                         │
│  └── 可以依赖其他 Job                                │
│                                                    │
│  Step（步骤）                                       │
│  └── 单个任务（命令或 Action）                    │
│                                                    │
│  Action（动作）                                      │
│  └── 可复用的单元（如官方或自定义）              │
└──────────────────────────────────────────────────┘
```

### 2.2 第一个工作流

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

# 触发条件
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

# 作业
jobs:
  build-and-test:
    # 运行环境
    runs-on: ubuntu-latest

    # 步骤
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
```

### 2.3 触发器（Events）

常用触发事件

```yaml
on:
  # 代码推送
  push:
    branches: [main, develop]
    tags: ["v*"] # 匹配 tag

  # Pull Request
  pull_request:
    branches: [main]

  # 手动触发
  workflow_dispatch:
    inputs:
      version:
        description: "Version to deploy"
        required: true
        default: "latest"

  # 定时任务
  schedule:
    - cron: "0 0 * * *" # 每天 UTC 00:00

  # 其他工作流完成后
  workflow_run:
    workflows: ["Build"]
    types: [completed]

  # 创建 Release
  release:
    types: [published]
```

**Cron 表达式**：

```
┌───────────── 分钟 (0-59)
│ ┌───────────── 小时 (0-23)
│ │ ┌───────────── 日 (1-31)
│ │ │ ┌───────────── 月 (1-12)
│ │ │ │ ┌───────────── 周 (0-6) (0=星期日)
│ │ │ │ │
* * * * *

示例：
0 0 * * *    每天 00:00
0 */2 * * *  每 2 小时
0 9 * * 1-5  周一至周五 09:00
```

### 2.4 运行环境（Runners）

```yaml
jobs:
  ubuntu-job:
    runs-on: ubuntu-latest # Ubuntu 最新版本

  windows-job:
    runs-on: windows-latest # Windows

  macos-job:
    runs-on: macos-latest # macOS

  # 指定版本
  specific-version:
    runs-on: ubuntu-22.04 # 特定版本
```

**可用的运行环境**：

| 环境             | 说明                   |
| ---------------- | ---------------------- |
| `ubuntu-latest`  | 最新 Ubuntu            |
| `ubuntu-22.04`   | Ubuntu 22.04           |
| `windows-latest` | 最新 Windows Server    |
| `windows-2022`   | Windows Server 2022    |
| `macos-latest`   | 最新 macOS             |
| `macos-14`       | macOS 14 (M1/M2 芯片） |

### 2.5 常用 Actions（Actions）是可复用的单元

| Action                      | 说明                |
| --------------------------- | ------------------- |
| `actions/checkout`          | 检出代码            |
| `actions/setup-node`        | 设置 Node.js        |
| `actions/setup-python`      | 设置 Python         |
| `actions/cache`             | 缓存依赖            |
| `actions/upload-artifact`   | 上传构建产物        |
| `actions/download-artifact` | 下载构建产物        |
| `actions/deploy-pages`      | 部署到 GitHub Pages |
| `actions/github-script`     | 运行 JavaScript     |

**Checkout 示例**：

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0 # 获取完整历史
```

**Setup Node.js 示例**：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm" # 或 'pnpm', 'yarn'
```

**缓存依赖**：

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 2.6 变量和 Secrets

**环境变量**：

```yaml
jobs:
  example:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
      API_URL: https://api.example.com
    steps:
      - name: Use variables
        run: echo "Node environment is $NODE_ENV"
        env:
          CUSTOM_VAR: hello

      - name: Use in another step
        run: echo "Custom var is $CUSTOM_VAR"
```

**Secrets（机密信息）**：

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/app
            git pull
            npm install
            npm run build
```

**使用 Secrets 的步骤**：

1. GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret
2. 添加密钥名称（如 `SSH_HOST`、`API_KEY`）
3. 在工作流中使用 <code v-pre>${{ secrets.NAME }}</code>

### 2.7 完整示例：前端项目 CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2.8 pnpm 项目示例

```yaml
name: CI with pnpm

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
```

---

## 三、GitLab CI/CD

### 3.1 基本配置文件

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache rsync openssh
    - rsync -avz --delete dist/ user@server:/var/www/app/
  only:
    - main
```

---

## 四、自动化部署方案

### 4.1 部署到静态网站托管

**Vercel**：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: "--prod"
```

**Netlify**：

```yaml
name: Deploy to Netlify

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: ./dist
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**GitHub Pages**：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 4.2 部署到自己的服务器

**SSH 部署**：

```yaml
name: Deploy to server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT }}
          script: |
            cd /var/www/app
            git pull origin main
            npm ci
            npm run build
            pm2 restart app
```

---

## 五、最佳实践

### 5.1 构建优化

**缓存依赖**：

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
    key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}
```

**并行执行**：

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  test:
    runs-on: ubuntu-latest
    steps: [...]
  build:
    runs-on: ubuntu-latest
    steps: [...]
```

**矩阵测试**：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 21.x]
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

### 5.2 质量保证

```yaml
jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm test -- --coverage

      - name: Security audit
        run: npm audit --audit-level=high
```

---

## 六、总结

CI/CD 是现代前端工程化的重要组成部分：

- **自动化构建**：减少重复劳动
- **自动化测试**：保证代码质量
- **自动化部署**：快速发布流程

**学习建议**：

1. 从 GitHub Actions 开始，它是最简单的入门
2. 学习 YAML 语法和基本概念
3. 实现基础工作流
4. 学习缓存和多环境部署
5. 学习高级特性（矩阵、缓存、矩阵测试）

---

> **参考资源**：
>
> - GitHub Actions 文档：https://docs.github.com/actions
> - GitLab CI/CD 文档：https://docs.gitlab.com/ee/ci/
> - 精选 Actions：https://github.com/marketplace?type=actions
