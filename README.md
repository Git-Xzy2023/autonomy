<div align="center">

# Autonomy

**TuTu Notes —— 个人技术博客与学习笔记**

基于 VitePress 构建的多模块技术文档站点，涵盖前端、后端、数据库、DevOps、面试题等方向。

[![VitePress](https://img.shields.io/badge/VitePress-1.6.3-646cff?logo=vitepress&logoColor=white)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![Deploy](https://github.com/Git-Xzy2023/autonomy/actions/workflows/deploy.yml/badge.svg)](https://github.com/Git-Xzy2023/autonomy/actions)

[在线预览](https://git-xzy2023.github.io/autonomy/) · [开始阅读](./docs/) · [反馈问题](https://github.com/Git-Xzy2023/autonomy/issues)

</div>

---

## 项目简介

Autonomy 是一个基于 VitePress 搭建的技术文档与博客站点，整理了前端、后端、数据库、DevOps、面试题等多个方向的系统化学习资料。所有内容以结构化的章节形式组织，支持侧边栏导航、本地搜索、暗黑模式、访问统计等阅读体验。

## 核心特性

- **多模块覆盖**：前端、Java、Python、Go、数据库、Nginx、Git、面试题、英语等九大方向。
- **结构化文档**：每个模块均配置层级化侧边栏菜单，章节首页含学习路线与对比表。
- **本地全文搜索**：内置 VitePress 本地搜索，无需外部服务。
- **暗黑 / 浅色模式**：支持主题切换，跟随系统或手动切换。
- **访问统计**：集成不蒜子（busuanzi）站点访问统计。
- **彩带动画**：首页点击触发的 confetti 动画效果。
- **响应式布局**：适配桌面、平板、移动端。
- **自动部署**：GitHub Actions 自动构建并发布到 GitHub Pages。
- **最后更新时间**：基于 Git 提交历史自动生成文档更新时间。

## 技术栈

| 分类 | 技术 |
| ---- | ---- |
| 文档框架 | VitePress 1.6 |
| 前端框架 | Vue 3.5 |
| 构建工具 | Vite |
| 包管理 | pnpm 10 |
| 运行环境 | Node.js 20+ |
| 部署 | GitHub Pages + GitHub Actions |
| 访问统计 | busuanzi.pure.js |
| 动画 | canvas-confetti |
| 主题增强 | 自定义 Layout / 组件 |

## 内容模块

| 模块 | 路径 | 主要内容 |
| ---- | ---- | ---- |
| 🖥️ **前端** | [`docs/web/`](./docs/web/) | JavaScript / TypeScript / ES6+ / React / React 生态 / Vue 生态 / 样式 / 浏览器 / 网络 / 架构 / 工程化 / 桌面端 / Node.js / 小程序 |
| ☕ **Java** | [`docs/java/`](./docs/java/) | Java 基础、Spring、Spring Boot、MyBatis |
| 🐍 **Python** | [`docs/python/`](./docs/python/) | Python 基础、数据科学、机器学习、自动化脚本 |
| 🦫 **Go** | [`docs/go/`](./docs/go/) | Go 基础、并发、高性能、Web |
| 🔧 **Git** | [`docs/git/`](./docs/git/) | Git 基础、工作流、进阶操作 |
| 🗄️ **数据库** | [`docs/database/`](./docs/database/) | MySQL / Redis / MongoDB |
| 🌐 **Nginx** | [`docs/nginx/`](./docs/nginx/) | 基础配置、反向代理、负载均衡、性能优化 |
| 📝 **面试题** | [`docs/interview/`](./docs/interview/) | JavaScript / CSS / ES / Engineering / Browser |
| 📚 **英语** | [`docs/english/`](./docs/english/) | 语法、听力、阅读、词汇 |

### 前端模块细分

| 子模块 | 路径 | 说明 |
| ---- | ---- | ---- |
| JavaScript | [`docs/web/JavaScript/`](./docs/web/JavaScript/) | JS 基础、TypeScript、ES6+ 新特性 |
| React | [`docs/web/react/`](./docs/web/react/) | 基础、Hooks、进阶、模式、性能、React 19、测试 |
| React 生态 | [`docs/web/react-ecosystem/`](./docs/web/react-ecosystem/) | Next.js、React Query、React Router、Redux、Zustand |
| Vue 生态 | [`docs/web/vue-ecosystem/`](./docs/web/vue-ecosystem/) | Vue 2、Vue 3、源码学习、Pinia、Vue Router |
| 样式 | [`docs/web/styles/`](./docs/web/styles/) | CSS、Less、Sass、Tailwind、现代 CSS 方案 |
| 浏览器 | [`docs/web/browser/`](./docs/web/browser/) | 原理、Web API、性能、存储 |
| 网络 | [`docs/web/network/`](./docs/web/network/) | HTTP、HTTPS、WebSocket、安全 |
| 架构 | [`docs/web/architecture/`](./docs/web/architecture/) | 设计模式、架构模式、代码规范、测试 |
| 工程化 | [`docs/web/engineering/`](./docs/web/engineering/) | Webpack、Vite、Rollup、包管理、CI/CD、代码质量 |
| 桌面端 | [`docs/web/desktop/`](./docs/web/desktop/) | Electron、Tauri、NW.js、Flutter、Wails、Qt、React Native |
| Node.js | [`docs/web/nodejs/`](./docs/web/nodejs/) | 基础、Express、Koa、NestJS、数据库、工程化 |
| 小程序 | [`docs/web/miniprogram/`](./docs/web/miniprogram/) | 创建、结构、开发、部署、跨端 |

## 目录结构

```
autonomy/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts        # VitePress 主配置
│   │   ├── nav.mts           # 顶部导航
│   │   ├── sidebar.mts       # 侧边栏菜单
│   │   └── theme/            # 自定义主题
│   │       ├── Layout.vue
│   │       ├── index.ts
│   │       ├── style.css
│   │       └── components/
│   │           ├── confetti.vue      # 彩带动画
│   │           └── VisitorPanel.vue   # 访客面板
│   ├── public/               # 静态资源
│   ├── web/                  # 前端
│   ├── java/                 # Java
│   ├── python/               # Python
│   ├── go/                   # Go
│   ├── git/                  # Git
│   ├── database/             # 数据库
│   ├── nginx/                # Nginx
│   ├── interview/            # 面试题
│   ├── english/              # 英语
│   └── index.md              # 站点首页
├── .github/workflows/deploy.yml  # CI/CD
├── package.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 10

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

启动后访问 http://localhost:5173/autonomy/ （注意 base 路径为 `/autonomy/`）。

### 构建生产版本

```bash
pnpm build
```

构建产物输出到 `docs/.vitepress/dist`。

### 本地预览构建产物

```bash
pnpm preview
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages：

1. 推送到 `main` 分支即触发 [deploy.yml](./.github/workflows/deploy.yml) 工作流。
2. 工作流执行 `pnpm install` → `pnpm build` → 上传产物 → 部署到 GitHub Pages。
3. 访问地址：<https://git-xzy2023.github.io/autonomy/>

### 自定义部署

如需部署到自己的仓库或域名，需修改以下配置：

- [`docs/.vitepress/config.mts`](./docs/.vitepress/config.mts) 中的 `base` 字段（默认 `/autonomy/`）
- [`docs/index.md`](./docs/index.md) 中首页的博客链接

## 写作约定

为保证站点结构与导航一致性，新增模块时请遵循以下约定：

1. **目录结构**：每个模块使用 `NN-name/index.md` 形式（如 `01-basics/index.md`）。
2. **首页格式**：模块入口 `index.md` 使用普通文档格式（非 `layout: home`），含标题、概述、章节导航、学习路线。
3. **侧边栏配置**：在 [`sidebar.mts`](./docs/.vitepress/sidebar.mts) 中为模块配置分组菜单，链接以 `/` 结尾。
4. **内部链接**：所有内部链接以斜杠结尾（如 `/web/desktop/`），避免 VitePress 路径解析问题。
5. **导航配置**：在 [`nav.mts`](./docs/.vitepress/nav.mts) 中添加顶部导航入口。

## 许可证

[MIT License](./LICENSE) © 2023-present China Carlos
