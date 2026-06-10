---
layout: home
hero:
  name: 工程化相关
  text: 前端工程化
  tagline: 构建工具、打包工具、开发工具、自动化流程 - 打造高效可靠的前端开发体系
features:
  - title: Webpack
    icon: 📦
    details: 模块打包器，功能强大，生态完善，适合复杂项目构建
    link: /web/engineering/01-webpack/
    linkText: 开始学习
  - title: Vite
    icon: ⚡
    details: 下一代前端构建工具，极速启动，基于原生 ESM
    link: /web/engineering/02-vite/
    linkText: 开始学习
  - title: Rollup
    icon: 🔄
    details: 专注于 JavaScript 库打包，Tree Shaking 强大
    link: /web/engineering/03-rollup/
    linkText: 开始学习
  - title: 包管理器
    icon: 📦
    details: npm、yarn、pnpm 使用指南与最佳实践
    link: /web/engineering/04-package-manager/
    linkText: 开始学习
  - title: CI/CD
    icon: 🚀
    details: 持续集成、持续部署，自动化构建与发布流程
    link: /web/engineering/05-ci-cd/
    linkText: 开始学习
  - title: 代码规范
    icon: 📝
    details: ESLint、Prettier、Husky、commitlint 工具链配置
    link: /web/engineering/06-code-quality/
    linkText: 开始学习
  - title: Babel
    icon: 🔧
    details: JavaScript 编译器，语法转换与 polyfill 配置
    link: /web/engineering/07-babel/
    linkText: 开始学习
  - title: TypeScript 构建
    icon: �
    details: tsc、ts-loader、@rollup/plugin-typescript 配置指南
    link: /web/engineering/08-typescript-build/
    linkText: 开始学习
  - title: Monorepo
    icon: 🏢
    details: pnpm workspace、Turborepo、Lerna 多包管理方案
    link: /web/engineering/09-monorepo/
    linkText: 开始学习
---

# 前端工程化学习指南

> 前端工程化是将软件工程的方法和实践应用到前端开发中，包括构建工具、代码规范、自动化测试、持续集成等。掌握工程化技能是成为专业前端开发者的必备条件。

---

## 为什么需要工程化？

### 传统开发的痛点

- ❌ **手动管理依赖**：手动引入 script/link 标签，版本管理混乱
- ❌ **代码无法模块化**：全局命名空间污染，依赖关系不明确
- ❌ **无法使用新语法**：浏览器兼容性限制，无法使用 ES6+ 特性
- ❌ **手动优化困难**：压缩、合并、缓存策略需要手动处理
- ❌ **代码质量难保证**：缺乏统一的规范和检查工具
- ❌ **部署流程繁琐**：手动构建、上传、部署，容易出错

### 工程化的优势

- ✅ **模块化开发**：清晰的依赖管理，代码可复用
- ✅ **语法兼容**：使用最新语法，自动转换为浏览器兼容代码
- ✅ **自动优化**：压缩、合并、Tree Shaking、代码分割
- ✅ **开发体验**：热更新、模块热替换、错误提示
- ✅ **质量保障**：代码规范检查、自动化测试、类型检查
- ✅ **自动化部署**：CI/CD 流程，一键发布

---

## 工程化技术栈

```
前端工程化
├── 包管理
│   ├── npm
│   ├── yarn
│   └── pnpm
│
├── 构建工具
│   ├── Webpack
│   ├── Vite
│   ├── Rollup
│   ├── esbuild
│   └── Parcel
│
├── 编译工具
│   ├── Babel
│   ├── TypeScript (tsc)
│   └── SWC
│
├── 代码规范
│   ├── ESLint
│   ├── Prettier
│   ├── Stylelint
│   └── commitlint
│
├── 测试工具
│   ├── Jest / Vitest
│   ├── Mocha + Chai
│   ├── Cypress / Playwright (E2E)
│   └── Testing Library
│
├── 自动化
│   ├── Git Hooks (Husky)
│   ├── lint-staged
│   └── CI/CD (GitHub Actions, GitLab CI)
│
└── 项目架构
    ├── Monorepo
    ├── Micro Frontend
    └── 脚手架 (CLI)
```

---

## 模块介绍

### � 01. Webpack

Webpack 是最流行的模块打包器，拥有庞大的生态系统。

**核心概念**：Entry（入口）、Output（输出）、Loader（转换器）、Plugin（插件）、Mode（模式）

**学习内容**：

- 基础配置与项目搭建
- Loader 配置与常用资源处理
- Plugin 系统与常用插件
- 开发服务器与 HMR
- 代码分割与懒加载
- 性能优化策略
- 高级配置与自定义插件

### ⚡ 02. Vite

Vite 是新一代前端构建工具，基于原生 ES 模块提供极速的开发体验。

**核心特性**：极速冷启动、即时热更新、基于原生 ESM、预构建优化

**学习内容**：

- Vite 工作原理与优势
- 项目创建与配置文件
- 插件开发与使用
- 构建优化与产物分析
- 与传统构建工具对比
- 生产环境最佳实践

### 🔄 03. Rollup

Rollup 是专注于 JavaScript 库打包的工具，Tree Shaking 功能强大。

**适用场景**：库/组件打包、类库发布、小型应用构建

**学习内容**：

- Rollup 配置文件详解
- 插件生态与使用
- 输出格式对比（ES/CJS/UMD/IIFE）
- Tree Shaking 原理
- 与 Webpack/Vite 的差异

### 📦 04. 包管理器

掌握 npm、yarn、pnpm 的使用与最佳实践。

**学习内容**：

- npm 基础命令与语义化版本
- package.json 详解
- 依赖管理与锁定文件
- npm/yarn/pnpm 对比
- 私有 npm 仓库搭建
- npx 与全局命令

### 🚀 05. CI/CD

持续集成与持续部署，自动化构建、测试、发布流程。

**学习内容**：

- CI/CD 概念与流程
- GitHub Actions 实战
- GitLab CI/CD 配置
- 自动化测试集成
- 自动化部署方案
- 版本发布管理

### 📝 06. 代码规范与工具链

建立统一的代码规范，保障代码质量。

**学习内容**：

- ESLint 配置与规则详解
- Prettier 代码格式化
- Stylelint 样式检查
- Git Hooks 与 Husky
- lint-staged 增量检查
- commitlint 提交规范
- EditorConfig 编辑器配置

### 🔧 07. Babel

JavaScript 编译器，转换新语法为浏览器兼容代码。

**学习内容**：

- Babel 工作原理
- preset-env 智能预设
- polyfill 策略配置
- TypeScript 与 Babel
- 自定义插件开发

### 📘 08. TypeScript 构建

TypeScript 编译与构建配置。

**学习内容**：

- tsconfig.json 详解
- tsc 命令与编译选项
- 与 Webpack/Vite/Rollup 集成
- 声明文件生成
- 构建性能优化

### 🏢 09. Monorepo

大型项目的多包管理方案。

**学习内容**：

- Monorepo 概念与优势
- pnpm workspace 配置
- Turborepo 缓存构建
- Lerna 使用指南
- 代码共享与版本管理

---

## 学习路径

### 初学者路线

```
1. 包管理器 (npm/pnpm)
   ↓
2. 构建工具基础 (Vite 入门)
   ↓
3. 代码规范 (ESLint + Prettier)
   ↓
4. 项目实战 (搭建一个完整项目)
```

### 进阶路线

```
1. 深入 Webpack (Loader/Plugin 开发)
   ↓
2. Babel 原理与配置
   ↓
3. CI/CD 自动化流程
   ↓
4. Monorepo 架构
   ↓
5. 脚手架开发 (自定义 CLI)
```

---

## 推荐资源

### 官方文档

- **Webpack**：https://webpack.js.org/
- **Vite**：https://vitejs.dev/
- **Rollup**：https://rollupjs.org/
- **npm Docs**：https://docs.npmjs.com/
- **Babel**：https://babeljs.io/
- **TypeScript**：https://www.typescriptlang.org/docs/

### 工具推荐

- **Bundle Analyzer**：分析打包产物大小
- **Volar**：Vue/TypeScript IDE 支持
- **ESLint**：代码检查
- **Prettier**：代码格式化

---

## 开始学习

选择你感兴趣的模块，开始深入学习前端工程化！
