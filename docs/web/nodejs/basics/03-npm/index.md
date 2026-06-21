---
title: npm 与包管理
---

# npm 与包管理

## 一、npm 基础

### 1. 初始化项目

```bash
# 交互式创建 package.json
npm init

# 快速创建（使用默认值）
npm init -y
```

### 2. 安装依赖

```bash
# 安装 package.json 中所有依赖
npm install
# 简写
npm i

# 安装生产依赖
npm install express
npm install express@4.18.2  # 指定版本

# 安装开发依赖
npm install --save-dev jest
# 简写
npm i -D jest

# 全局安装
npm install -g pm2

# 安装指定版本
npm install express@latest
npm install express@^4.0.0
```

### 3. 卸载与更新

```bash
# 卸载
npm uninstall express
npm un express

# 更新
npm update express

# 检查过期的包
npm outdated

# 更新所有包
npm update
```

---

## 二、package.json 详解

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "项目描述",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^3.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["node", "express"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 关键字段

| 字段 | 说明 |
|------|------|
| `name` | 包名（小写，无空格） |
| `version` | 语义化版本 |
| `main` | CJS 入口 |
| `module` | ESM 入口 |
| `type` | `"module"` 启用 ESM |
| `scripts` | 自定义脚本命令 |
| `dependencies` | 生产依赖 |
| `devDependencies` | 开发依赖 |
| `peerDependencies` | 同伴依赖（插件常用） |
| `engines` | 指定 Node 版本 |
| `bin` | CLI 命令映射 |

---

## 三、语义化版本（SemVer）

版本格式：`主版本.次版本.修订版本`（`MAJOR.MINOR.PATCH`）

| 变更类型 | 说明 | 示例 |
|----------|------|------|
| **MAJOR** | 不兼容的 API 修改 | `1.0.0` → `2.0.0` |
| **MINOR** | 向下兼容的功能新增 | `1.0.0` → `1.1.0` |
| **PATCH** | 向下兼容的缺陷修复 | `1.0.0` → `1.0.1` |

### 版本范围符号

| 符号 | 说明 | 示例 |
|------|------|------|
| `^` | 兼容主版本 | `^4.18.2` → `>=4.18.2 <5.0.0` |
| `~` | 兼容次版本 | `~4.18.2` → `>=4.18.2 <4.19.0` |
| `>` / `<` | 大于 / 小于 | `>4.0.0` |
| `>=` / `<=` | 大于等于 / 小于等于 | `>=4.18.0` |
| `=` | 精确匹配 | `=4.18.2` |
| `*` | 任意版本 | `*` |
| `||` | 或 | `^4.0.0 \|\| ^5.0.0` |

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "~4.17.21",
    "react": ">=18.0.0",
    "vue": "3.4.0"
  }
}
```

---

## 四、npm scripts

### 1. 基本用法

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "lint": "eslint .",
    "build": "webpack --mode production"
  }
}
```

```bash
npm run dev
npm test  # test、start 可省略 run
```

### 2. 钩子

```json
{
  "scripts": {
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "echo '测试完成'",
    "preinstall": "echo '安装前'",
    "postinstall": "echo '安装后'"
  }
}
```

### 3. 组合命令

```json
{
  "scripts": {
    "build": "npm run clean && npm run compile",
    "clean": "rm -rf dist",
    "compile": "tsc"
  }
}
```

### 4. 并行执行

```bash
# 使用 npm-run-all
npm install -D npm-run-all
```

```json
{
  "scripts": {
    "dev": "run-p server watch",
    "server": "node server.js",
    "watch": "webpack --watch"
  }
}
```

---

## 五、npx

`npx` 用于执行本地安装的命令或临时安装并执行：

```bash
# 执行本地安装的命令
npx jest

# 临时安装并执行（不污染项目）
npx create-react-app my-app

# 指定版本
npx cowsay@1.5.0 "hello"

# 执行 GitHub Gist
npx https://gist.github.com/user/gist-id
```

---

## 六、package-lock.json

`package-lock.json` 锁定依赖的**确切版本**，确保不同环境安装结果一致。

### 作用

- 🔒 锁定版本：避免 `^` `~` 导致不同环境版本不一致
- 📦 记录依赖树：包括嵌套依赖
- ⚡ 加速安装：跳过版本解析

### 最佳实践

- **提交到 Git**：确保团队和 CI 环境一致
- **不要手动编辑**：通过 `npm install` 自动更新
- **CI 使用 `npm ci`**：基于 lock 文件安装，更快更可靠

```bash
# CI 环境（推荐）
npm ci

# 普通安装
npm install
```

---

## 七、npm vs yarn vs pnpm

| 特性 | npm | yarn | pnpm |
|------|-----|------|------|
| **安装速度** | 中 | 快 | 最快 |
| **磁盘空间** | 大 | 大 | 最小（硬链接） |
| **幽灵依赖** | 有 | 有 | 无 |
| **Monorepo** | workspaces | workspaces | workspace（最强） |
| **离线安装** | ❌ | ✅ | ✅ |
| **lock 文件** | package-lock.json | yarn.lock | pnpm-lock.yaml |

### pnpm 优势

```bash
# 安装 pnpm
npm install -g pnpm

# 使用（命令与 npm 类似）
pnpm install
pnpm add express
pnpm run dev
```

**pnpm 的核心优势**：

1. **节省磁盘**：通过硬链接复用全局存储
2. **严格依赖**：避免幽灵依赖（未声明但能使用的包）
3. **Monorepo 友好**：原生 workspace 支持

---

## 八、发布 npm 包

### 1. 准备

```bash
# 登录
npm login

# 检查包名是否可用
npm view my-package-name
```

### 2. 配置 package.json

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. 发布

```bash
# 发布
npm publish

# 发布 scoped 包（@scope/name）
npm publish --access public

# 版本更新
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### 4. `.npmignore` / `files` 字段

```json
{
  "files": ["dist", "README.md"]
}
```

或创建 `.npmignore`：

```
src/
test/
*.md
```

---

## 九、常见问题

### 1. 权限错误（EACCES）

```bash
# ❌ 不要用 sudo
# sudo npm install -g xxx

# ✅ 修改 npm 默认目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 2. 清除缓存

```bash
npm cache clean --force
```

### 3. 重新安装依赖

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 十、下一步

- 上一章：[模块系统](/web/nodejs/basics/02-modules/)
- 下一章：[核心模块](/web/nodejs/basics/04-core-modules/)
