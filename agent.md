# Agent 指南 - 文档站点约定

> 本文件供 AI Agent 阅读，记录该文档站点的结构与用户的偏好约定，避免每次重复沟通。

## 项目概述

这是一个基于 **VitePress** 的前端技术学习文档站点，位于 `/Users/qijie/Desktop/徐志远/autonomy/docs/`。

- 启动命令：`pnpm dev`
- 核心配置目录：`docs/.vitepress/`
  - `config.mts`：主配置
  - `nav.mts`：顶部导航
  - `sidebar.mts`：侧边栏菜单（**最常修改的文件**）

## 文档模块结构约定（重要）

用户对每个文档模块（如 react、architecture、engineering、browser 等）有以下统一要求：

### 1. 进入模块后必须是「左侧菜单 + 文档内容」

- **禁止**使用 `layout: home`（VitePress 首页卡片布局）
- 每个模块的 `index.md` 必须是普通文档页面，frontmatter 只写 `title`
- 正确示例：
  ```markdown
  ---
  title: 模块名称学习指南
  ---
  # 模块名称学习指南
  ```
- 错误示例（会导致进入后是卡片列表页，左侧无菜单）：
  ```markdown
  ---
  layout: home
  hero:
    name: xxx
  features:
    - title: xxx
  ---
  ```

### 2. Sidebar 菜单结构（参考 react 模块）

每个模块**必须**在 `sidebar.mts` 中配置对应的 `"/web/<module>/"` 条目，结构参考 `/web/react/`：

```typescript
"/web/<module>/": [
  {
    text: "模块名称",
    items: [{ text: "总览与学习路线", link: "/web/<module>/" }],
  },
  {
    text: "子分类名称",
    collapsed: false,  // 第一个子分类展开，其余 collapsed: true
    items: [
      { text: "01 xxx", link: "/web/<module>/xxx/" },
    ],
  },
  {
    text: "另一个子分类",
    collapsed: true,
    items: [
      { text: "02 xxx", link: "/web/<module>/xxx/" },
    ],
  },
],
```

### 3. index.md 内容结构（参考 react/index.md）

每个模块的 `index.md` 应包含：
- 模块简介
- 各模块入口（用表格列出章节、主题、链接）
- 技术栈总览（用代码块画树状图）
- 推荐学习路线
- 学习建议

## 已完成模块清单

| 模块路径 | sidebar 配置 | index.md 格式 |
| -------- | ------------ | ------------- |
| `/web/react/` | ✅ 已配置（标准参考） | ✅ 普通文档 |
| `/web/react-ecosystem/` | ✅ 已配置 | ✅ 普通文档 |
| `/web/architecture/` | ✅ 已配置 | ✅ 普通文档 |
| `/web/engineering/` | ✅ 已配置 | ✅ 普通文档 |
| `/web/browser/` | ✅ 已配置 | ✅ 普通文档 |
| `/web/network/` | ✅ 已配置 | ✅ 普通文档 |
| `/web/vue-ecosystem/` | ✅ 已配置 | ✅ 普通文档（Vue2/Vue3/源码/生态库） |
| `/web/git/` | ✅ 已配置 | ✅ 普通文档（基础/工作流/进阶） |
| `/web/database/` | ✅ 已配置 | ✅ 普通文档（MySQL/Redis/MongoDB） |
| `/web/nginx/` | ✅ 已配置 | ✅ 普通文档（基础/反向代理/优化） |
| `/web/JavaScript/` | ✅ 已配置 | ✅ 普通文档（JS/TS/ES6+） |
| `/web/desktop/` | ✅ 已配置 | ✅ 普通文档（Electron/Tauri/NW.js/Flutter/Wails/Qt/React Native） |
| `/web/styles/` | ⚠️ 待检查 | ⚠️ 待检查 |
| `/web/nodejs/` | ✅ 已配置 | ⚠️ 待检查 |
| `/web/miniprogram/` | ✅ 已配置 | ⚠️ 待检查 |

> 标记 ⚠️ 的模块可能仍使用 `layout: home` 或缺少 sidebar 配置，遇到时按上述约定修复。

## 用户偏好

- **语言**：中文沟通，代码注释用中文
- **修改前先读文件**：不要凭记忆修改，先 Read 确认现状
- **结构一致性优先**：新增/修改文档时，优先参考已有的标准模块（react 为标准）
- **不过度设计**：只做用户明确要求的修改，不要顺手重构无关代码
- **不主动创建文档**：除用户明确要求外，不创建 README.md 等文档文件
