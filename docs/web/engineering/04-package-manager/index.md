---
title: 包管理器
---

# 包管理器学习笔记

> 包管理器是前端工程化的基础工具，用于管理项目依赖、安装第三方包、执行脚本命令。主流的包管理器有 npm、yarn 和 pnpm。

---

## 一、包管理器概述

### 1.1 什么是包管理器

包管理器是自动化工具，用于安装、升级、配置和移除软件包。

**核心功能**：

```
┌──────────────────────────────────────────────────┐
│  📦 依赖管理                                      │
│     - 安装第三方包                                 │
│     - 版本控制与冲突解决                            │
│     - 依赖树管理                                   │
│                                                     │
│  🔧 脚本执行                                       │
│     - npm scripts（package.json scripts）          │
│     - 开发服务器、构建、测试等                        │
│                                                     │
│  📝 配置管理                                       │
│     - registry 配置                                │
│     - 镜像源管理                                   │
│     - 私有仓库支持                                  │
└──────────────────────────────────────────────────┘
```

### 1.2 三大包管理器对比

| 特性 | npm | Yarn | pnpm |
|------|-----|------|------|
| **发布时间** | 2010 | 2016 | 2017 |
| **安装速度** | 较慢 | 快 | 最快 |
| **磁盘占用** | 较高（重复） | 较高 | 最低（硬链接） |
| **默认锁定文件** | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` |
| **工作空间支持** | npm workspaces | Yarn Workspaces | pnpm Workspaces |
| **即插即用** | npx | yarn dlx | pnpm dlx |
| **离线缓存** | ✅（较慢） | ✅ | ✅（高效） |
| **严格依赖树** | ❌ | ❌ | ✅ |

**推荐使用场景**：

```
小型项目 / 简单使用  →  npm
企业项目 / 团队协作  →  pnpm（推荐）
传统项目兼容        →  yarn
```

---

## 二、npm 详解

### 2.1 npm 基础命令

```bash
# 查看 npm 版本
npm --version
npm -v

# 查看 npm 配置
npm config list
npm config get registry  # 查看镜像源

# 初始化项目
npm init          # 交互式创建 package.json
npm init -y       # 快速创建（默认配置）
```

### 2.2 安装包

```bash
# 安装到生产依赖（dependencies）
npm install lodash
npm i lodash
npm add lodash

# 安装到开发依赖（devDependencies）
npm install --save-dev typescript
npm install -D typescript

# 全局安装
npm install --global http-server
npm install -g http-server

# 安装指定版本
npm install lodash@4.17.21
npm install lodash@^4.0.0
npm install lodash@latest

# 安装本地文件/目录
npm install ../my-package
npm install ./my-package-1.0.0.tgz

# 从 Git 仓库安装
npm install github:user/repo
npm install git+https://github.com/user/repo.git
```

### 2.3 更新与卸载

```bash
# 列出已安装的包
npm list
npm list --depth=0  # 只显示顶层包
npm list -g         # 列出全局包

# 检查哪些包可以更新
npm outdated
npm outdated -g

# 更新包
npm update lodash
npm update          # 更新所有包
npm update -g       # 更新全局包

# 卸载包
npm uninstall lodash
npm remove lodash
npm rm lodash
npm uninstall -g http-server
```

### 2.4 npm scripts

`package.json` 中的 `scripts` 字段定义可执行命令：

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext .js,.vue",
    "format": "prettier --write src/",
    "clean": "rm -rf dist"
  }
}
```

**执行脚本**：

```bash
npm run dev      # 最长用的形式
npm start        # 特殊命令（start, test, stop, restart 可省略 run）
npm test
npm t

# 查看所有可用脚本
npm run

# 传递参数给脚本
npm run build -- --mode=production
```

### 2.5 npx 命令

`npx` 是 npm 5.2+ 内置的包执行工具：

```bash
# 临时安装并执行（不污染全局）
npx create-vite
npx eslint src/

# 使用本地 node_modules 中的包
npx vite      # 等同于 ./node_modules/.bin/vite
npx webpack

# 执行指定版本
npx create-vite@latest
npx create-vite@5.0.0

# 跳过安装（如果本地已存在）
npx --no-install eslint
```

### 2.6 配置镜像源

```bash
# 查看当前镜像源
npm config get registry

# 设置为淘宝镜像（国内加速）
npm config set registry https://registry.npmmirror.com

# 设置为官方源
npm config set registry https://registry.npmjs.org

# 使用 nrm 管理多个镜像源
npm install -g nrm
nrm ls                    # 列出可用源
nrm use taobao            # 切换到淘宝源
nrm use npm               # 切换到官方源
nrm add private http://private.registry.com  # 添加私有源
```

---

## 三、yarn 详解

### 3.1 Yarn 基础命令

```bash
# 查看 yarn 版本
yarn --version
yarn -v

# 初始化项目
yarn init
yarn init -y
```

### 3.2 安装包

```bash
# 安装所有依赖
yarn
yarn install

# 安装生产依赖
yarn add lodash

# 安装开发依赖
yarn add --dev typescript
yarn add -D typescript

# 全局安装
yarn global add http-server

# 安装指定版本
yarn add lodash@4.17.21
yarn add lodash@^4.0.0
```

### 3.3 更新与卸载

```bash
# 列出已安装包
yarn list
yarn list --depth=0

# 检查可更新包
yarn outdated

# 更新包
yarn upgrade
yarn upgrade lodash
yarn upgrade-interactive

# 卸载包
yarn remove lodash
yarn global remove http-server
```

### 3.4 脚本执行

```bash
# 执行脚本
yarn dev
yarn build
yarn start
yarn test

# 与 npm 不同：yarn 不需要 run 前缀
yarn <script-name>

# 传递参数
yarn build --mode=production

# 使用 dlx 执行包（类似 npx）
yarn dlx create-vite
```

### 3.5 Yarn Workspaces（工作空间）

Yarn Workspaces 用于 monorepo（多包仓库）管理：

```json
// package.json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

```
my-monorepo/
├── packages/
│   ├── core/
│   │   └── package.json
│   ├── utils/
│   │   └── package.json
│   └── app/
│       └── package.json
├── package.json
└── yarn.lock
```

---

## 四、pnpm 详解（推荐）

### 4.1 为什么选择 pnpm

pnpm 的核心优势是**节省磁盘空间**和**提升安装速度**：

```
传统 npm/yarn 安装：
node_modules/
├── package-a/
├── package-b/
└── package-c/
（每个项目独立的完整副本）

pnpm 安装（内容寻址存储）：
~/.pnpm-store/  ← 全局缓存（所有项目共享）
      │
      ▼ 硬链接
node_modules/
├── package-a/  ← 指向全局缓存
├── package-b/  ← 指向全局缓存
└── package-c/  ← 指向全局缓存
```

**优势对比**：

- **节省磁盘空间**：相同版本的包只在磁盘上存储一次
- **更快的安装速度**：跳过重复文件的复制
- **更严格的依赖树**：避免幽灵依赖（phantom dependencies）
- **非扁平化依赖树**：更符合 Node.js 的模块解析算法

### 4.2 pnpm 基础命令

```bash
# 安装 pnpm
npm install -g pnpm
# 或使用官方脚本
curl -fsSL https://get.pnpm.io/install.sh | sh-

# 查看版本
pnpm --version
pnpm -v

# 初始化项目
pnpm init
```

### 4.3 安装包

```bash
# 安装所有依赖
pnpm install
pnpm i

# 安装生产依赖
pnpm add lodash

# 安装开发依赖
pnpm add -D typescript
pnpm add --save-dev typescript

# 安装为可选依赖
pnpm add -O optional-dep
pnpm add --save-optional optional-dep

# 安装为 peer dependency
pnpm add --save-peer react

# 全局安装
pnpm add -g http-server

# 安装指定版本
pnpm add lodash@4.17.21
pnpm add lodash@^4.0.0
pnpm add lodash@latest
```

### 4.4 更新与卸载

```bash
# 列出依赖
pnpm list
pnpm list --depth=0

# 检查过时的依赖
pnpm outdated

# 更新依赖
pnpm update
pnpm update lodash
pnpm update --interactive

# 卸载依赖
pnpm remove lodash
pnpm remove -g http-server
```

### 4.5 脚本执行

```bash
# 执行脚本
pnpm dev
pnpm build
pnpm start
pnpm test

# 传递参数
pnpm build --mode=production

# 使用 dlx 执行包（类似 npx）
pnpm dlx create-vite
pnpm dlx eslint src/
```

### 4.6 pnpm Workspaces

pnpm Workspaces 是 monorepo 的理想选择：

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

```
my-monorepo/
├── packages/
│   ├── core/
│   ├── utils/
│   └── components/
├── apps/
│   ├── web/
│   └── admin/
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

**Workspaces 命令**：

```bash
# 在所有包中执行命令
pnpm -r build       # 递归执行 build
pnpm -r test        # 递归执行 test

# 在指定包中执行命令
pnpm --filter @project/core build
pnpm -F @project/core build

# 安装依赖到指定包
pnpm add lodash --filter @project/core

# 同时运行多个包的脚本
pnpm -r --parallel dev
```

### 4.7 配置镜像源

```bash
# 查看配置
pnpm config get registry

# 设置镜像源
pnpm config set registry https://registry.npmmirror.com

# 恢复官方源
pnpm config set registry https://registry.npmjs.org
```

---

## 五、package.json 详解

### 5.1 完整示例

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample project",
  "type": "module",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.50.0"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ],
  "author": "Your Name",
  "license": "MIT",
  "homepage": "https://github.com/user/project#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/project.git"
  },
  "keywords": ["vue", "vite", "typescript"]
}
```

### 5.2 字段详解

| 字段 | 说明 |
|------|------|
| `name` | 包名，发布时必须唯一 |
| `version` | 语义化版本号 |
| `description` | 项目描述 |
| `type` | 模块系统（`module` 表示 ESM） |
| `main` | CommonJS 入口文件 |
| `module` | ES Module 入口文件 |
| `types` | TypeScript 类型声明 |
| `files` | 发布时包含的文件 |
| `exports` | 现代的模块导出配置 |
| `scripts` | 可执行命令脚本 |
| `dependencies` | 生产依赖 |
| `devDependencies` | 开发依赖 |
| `peerDependencies` | 对等依赖（需要使用者安装） |
| `engines` | 引擎版本限制 |
| `browserslist` | 支持的浏览器范围 |

### 5.3 语义化版本（SemVer）

版本号格式：`主版本号.次版本号.修订号`（`MAJOR.MINOR.PATCH`）

```
1.2.3
│ │ │
│ │ └── 修订号（修复 bug，不改变 API）
│ └──── 次版本号（新增功能，向后兼容）
└────── 主版本号（重大变更，可能不向后兼容）
```

**版本范围**：

| 格式 | 说明 | 示例 | 匹配版本 |
|------|------|------|---------|
| `1.0.0` | 精确匹配 | `1.0.0` | 仅 1.0.0 |
| `^1.0.0` | 兼容更新（不改变最左侧非零） | `^1.2.3` | `>=1.2.3` & `<2.0.0` |
| `~1.0.0` | 次版本内更新 | `~1.2.3` | `>=1.2.3` & `<1.3.0` |
| `>1.0.0` | 大于指定版本 | `>1.0.0` | `1.0.1`, `1.1.0`, ... |
| `>=1.0.0` | 大于等于 | `>=1.0.0` | `1.0.0`, `1.0.1`, ... |
| `<2.0.0` | 小于指定版本 | `<2.0.0` | `1.9.9`, ... |
| `1.x` | 次版本任意 | `1.x` | `1.0.0`, `1.1.0`, ... |
| `*` | 任意版本 | `*` | 所有版本 |

**常见用法**：

```json
{
  "dependencies": {
    "lodash": "^4.17.21",    // 推荐：兼容更新
    "react": "~18.2.0",      // 只允许修订号更新
    "vue": "3.3.4",          // 固定版本
    "typescript": "*"        // 任意版本（不推荐）
  }
}
```

---

## 六、最佳实践

### 6.1 选择合适的包管理器

```bash
# 推荐使用 pnpm（2024 年推荐）
npm install -g pnpm

# pnpm 支持 Node.js 16+，建议使用 Node.js 18+
```

### 6.2 合理使用依赖类型

```json
{
  "dependencies": {
    // ✅ 生产环境需要的包
    "vue": "^3.3.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    // ✅ 仅开发/构建时需要的包
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.50.0"
  },
  "peerDependencies": {
    // ✅ 需要使用者安装的依赖（通常是插件/库）
    "vue": "^3.0.0"
  }
}
```

### 6.3 提交锁定文件

```
✅ 应该提交：
   ├── package-lock.json  (npm)
   ├── yarn.lock          (yarn)
   └── pnpm-lock.yaml     (pnpm)

原因：确保所有开发者使用完全相同的依赖版本
```

### 6.4 清理与更新

```bash
# 清理缓存
npm cache clean --force
yarn cache clean
pnpm store prune        # pnpm 清理未使用的包

# 更新所有依赖（谨慎使用）
pnpm update

# 交互式更新
pnpm update --interactive
pnpm update -i -L       # 交互式更新到最新版本
```

### 6.5 使用国内镜像源

```bash
# 永久设置淘宝镜像（推荐）
pnpm config set registry https://registry.npmmirror.com

# 临时使用镜像源
pnpm install --registry=https://registry.npmmirror.com
```

---

## 七、常见问题

### 7.1 如何切换包管理器

```bash
# 从 npm 切换到 pnpm
rm -rf node_modules package-lock.json
pnpm install

# 从 yarn 切换到 pnpm
rm -rf node_modules yarn.lock
pnpm install

# pnpm 兼容 npm scripts，无需修改 package.json
```

### 7.2 node_modules 太大怎么办

```bash
# 使用 pnpm（最佳解决方案）
npm install -g pnpm
pnpm install    # 多个项目共享缓存，节省 50%+ 空间

# 清理未使用的缓存
pnpm store prune
```

### 7.3 安装速度慢

```bash
# 1. 使用国内镜像源
pnpm config set registry https://registry.npmmirror.com

# 2. 使用 pnpm（天生更快）

# 3. 清理缓存后重新安装
pnpm store prune
rm -rf node_modules
pnpm install
```

### 7.4 版本冲突问题

```bash
# 查看依赖树
pnpm list

# 查看指定包的依赖关系
pnpm why lodash

# 强制更新依赖
pnpm update lodash

# 使用 overrides 强制指定版本（package.json）
{
  "pnpm": {
    "overrides": {
      "lodash": "4.17.21"
    }
  }
}
```

---

## 八、总结

包管理器是前端开发的基础工具：

- **npm**：最基础、最广泛使用
- **yarn**：稳定、兼容，适合老项目
- **pnpm**：推荐使用，节省空间、速度快

**学习建议**：
1. 熟练掌握常用命令（install, add, remove, update）
2. 理解 package.json 各字段含义
3. 掌握语义化版本号规则
4. 推荐使用 pnpm 作为日常开发工具
5. 学习使用 workspaces 管理多包项目

---

> **参考资源**：
> - npm 官方文档：https://docs.npmjs.com/
> - Yarn 官方文档：https://yarnpkg.com/
> - pnpm 官方文档：https://pnpm.io/
