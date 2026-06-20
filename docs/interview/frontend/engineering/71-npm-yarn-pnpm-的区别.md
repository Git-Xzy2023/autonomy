---
title: "npm / yarn / pnpm 的区别？pnpm 为什么更快？"
---

# npm / yarn / pnpm 的区别？pnpm 为什么更快？

**核心考察点**：是否对 Node 生态有深入理解。

**回答要点**：

| 维度           | npm (v3+)                                              | yarn (v1)         | pnpm                                                                          |
| -------------- | ------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------- |
| 安装方式       | 扁平 node_modules                                      | 扁平 node_modules | **内容寻址存储（content-addressable）+ 硬链接 + 符号链接**                    |
| 多项目磁盘占用 | 每个项目一份完整副本                                   | 同上              | **全局只存一份**，每个项目通过硬链接引用                                      |
| 安装速度       | 最慢                                                   | 比 npm 快         | 最快（磁盘 + 网络都省）                                                       |
| 幽灵依赖       | 严重（依赖的依赖可能被扁平到顶层，你可以直接 require） | 同样问题          | **杜绝幽灵依赖**（默认 .pnpm 目录结构，只有 package.json 声明的依赖才能访问） |
| 锁文件         | `package-lock.json`                                    | `yarn.lock`       | `pnpm-lock.yaml`                                                              |
| 工作区支持     | npm workspaces (v7+)                                   | yarn workspaces   | `pnpm-workspace.yaml`，原生支持很好                                           |

**pnpm 的核心是 "node_modules/.pnpm/`<pkg>@<version>`/node_modules/..." 的结构**：

- 磁盘上只有一份真实文件，全局放在 `~/.local/share/pnpm/store/v3`。
- 项目里通过硬链接引用。
- 依赖之间用符号链接串起来形成嵌套 node_modules。
- 结果：**同一版本的包在一台机器上只下载一次、只占一份磁盘**。

**常见问题**：

- "我用 require('lodash') 但没在 package.json 里声明，为什么之前能跑？" → 幽灵依赖。pnpm 会让它报错，强制你声明。
- monorepo 场景下 pnpm 体验显著优于 npm/yarn。
