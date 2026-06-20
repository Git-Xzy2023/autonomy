---
title: 工程化面试题
---

# 前端工程化面试题

说明：以下题目按模块组织，每题要求"能回答到点子上"。面试时对方很可能会拿着实际配置/打包产物/性能数据追问，所以请确保对每个工具的**核心机制、典型配置项、常见问题**都能讲清楚。

## 一、构建工具通用题

- [前端为什么需要构建工具？你用过哪些？](./11-前端为什么需要构建工具.md)
- [什么是打包（Bundling）？Bundler 做了哪些事？](./12-什么是打包-bundler-做了哪些事.md)
- [Tree Shaking 的原理是什么？有什么前提？](./13-tree-shaking-的原理是什么.md)
- [Code Splitting / 代码分割怎么做？有几种策略？](./14-code-splitting-代码分割怎么做.md)
- [Source Map 有哪些类型？如何选择？](./15-source-map-有哪些类型如何选择.md)

## 二、Webpack

- [Webpack 的核心概念：Entry / Output / Loader / Plugin / Mode / Chunk](./21-webpack-的核心概念.md)
- [手写一个简单的 Loader](./22-手写一个简单的-loader.md)
- [手写一个简单的 Plugin](./23-手写一个简单的-plugin.md)
- [Webpack 5 有什么新东西？为什么要升级？](./24-webpack-5-有什么新东西.md)
- [你是怎么优化 Webpack 构建速度的？](./25-怎么优化-webpack-构建速度.md)
- [你是怎么分析 Bundle 体积的？有哪些工具？](./26-怎么分析-bundle-体积.md)

## 三、Rollup

- [Rollup 和 Webpack 有什么区别？各自适合什么场景？](./31-rollup-和-webpack-有什么区别.md)
- [Rollup 的 external / globals 是干什么的？](./32-rollup-的-external-globals-是干什么的.md)

## 四、Vite

- [Vite 的原理是什么？为什么快？](./41-vite-的原理是什么-为什么快.md)
- [你在 Vite 配置里一般会写什么？](./42-vite-配置里一般会写什么.md)
- [Vite 里 optimizeDeps 是干什么的？什么时候需要手动配置？](./43-vite-里-optimizedeps-是干什么的.md)

## 五、esbuild / SWC / Rspack / Turbopack

- [你知道 esbuild 吗？它为什么这么快？](./51-esbuild-为什么这么快.md)
- [SWC 和 Babel 有什么区别？什么时候会选 SWC？](./52-swc-和-babel-有什么区别.md)
- [Rspack 了解吗？和 Webpack 是什么关系？](./53-rspack-和-webpack-是什么关系.md)

## 六、性能优化（构建与运行时）

- [首屏性能怎么优化？从哪些维度思考？](./61-首屏性能怎么优化.md)
- [你怎么决定哪些库应该 vendor chunk，哪些应该按需加载？](./62-怎么决定哪些库应该-vendor-chunk.md)

## 七、包管理与依赖

- [npm / yarn / pnpm 的区别？pnpm 为什么更快？](./71-npm-yarn-pnpm-的区别.md)
- [dependencies / devDependencies / peerDependencies / optionalDependencies 有什么区别？](./72-package-json-里各种-dependencies-的区别.md)
- [什么是 SemVer（语义化版本）？^1.2.3、~1.2.3、1.2.3 有什么区别？](./73-什么是-semver-语义化版本.md)

## 八、Monorepo

- [你了解 Monorepo 吗？什么时候用？用过哪些工具？](./81-你了解-monorepo-吗.md)

## 九、代码质量工具链

- [ESLint / Prettier / Stylelint / Husky / lint-staged / commitlint 各自负责什么？怎么协作？](./91-eslint-prettier-等工具怎么协作.md)
- [ESLint 怎么写自定义规则？](./92-eslint-怎么写自定义规则.md)

## 十、CI/CD 与部署

- [你们前端项目的 CI 流程大概是怎样的？](./101-前端项目的-ci-流程.md)
- [你是怎么部署前端项目的？Nginx 里有哪些关键配置？](./102-怎么部署前端项目-nginx-配置.md)
- [什么是 BFF？前端为什么需要它？](./103-什么是-bff-前端为什么需要它.md)

## 十一、环境与规范

- [你怎么管理多个 Node 版本？团队怎么统一 Node 版本？](./111-怎么管理多个-node-版本.md)
- [你怎么设计"新项目脚手架"？](./112-怎么设计新项目脚手架.md)

## 十二、TypeScript 工程化

- [tsconfig.json 里哪些字段最重要？](./121-tsconfig-json-里哪些字段最重要.md)
- [你怎么发布一个 TypeScript 库到 npm？](./122-怎么发布一个-typescript-库到-npm.md)

## 十三、监控与错误上报

- [你是怎么做前端错误监控和性能监控的？](./131-怎么做前端错误监控和性能监控.md)

## 十四、安全

- [前端能做哪些安全措施？](./141-前端能做哪些安全措施.md)

## 十五、微前端

- [微前端是什么？用过哪些方案？](./151-微前端是什么-用过哪些方案.md)

## 十六、Server-Side 相关

- [SSR / SSG / ISR / CSR 的区别？](./161-ssr-ssg-isr-csr-的区别.md)

## 十七、实战场景题（面试官最爱问）

- [接手老项目，Webpack 构建要 5 分钟，首屏加载 10MB，你从哪里下手优化？](./171-接手老项目如何优化.md)
- [团队决定从 Webpack 迁移到 Vite，你会做哪些验证与风险评估？](./172-从-webpack-迁移到-vite-的验证与风险评估.md)

## 十八、一些"刁钻"的深挖题（高级面试可能出现）

- [Webpack 的 Module、Chunk、Bundle、Asset 四者是什么关系？](./181-webpack-的-module-chunk-bundle-asset-关系.md)
- [为什么 Webpack 5 不再自动 polyfill Node 模块？这对老项目有什么影响？](./182-webpack-5-不再自动-polyfill-node-模块.md)
- [Rollup 的 Treeshaking 和 Webpack 的 Treeshaking 实现上有什么差异？](./183-rollup-和-webpack-的-treeshaking-差异.md)
- [如果没有构建工具，你能手写一个简单的模块加载器吗？](./184-手写一个简单的模块加载器.md)
- [怎么设计一个"组件库的按需加载"方案？](./185-怎么设计组件库的按需加载方案.md)
- [HTTP/2 有什么变化？对前端构建策略有什么影响？](./186-http2-对前端构建策略的影响.md)
- [什么是 Module Federation？适用场景？](./187-什么是-module-federation.md)

## 十九、学习与选型建议（最后一问）

- [面对这么多前端工具，你是怎么学习和选型的？](./191-怎么学习和选型前端工具.md)

## 附：面试时可以主动说的"加分项"

如果你在真实项目里做过以下任何一件事，可以在面试官问"你做过哪些工程化优化"时主动讲：

- **搭建过团队脚手架**（发布 npm、有模板、可升级）。
- **把项目从 Webpack 4 升级到 5**，并用 `cache.filesystem` 把 CI 时间从 X 降到 Y。
- **引入 pnpm**，解决幽灵依赖，CI 时间节省多少。
- **用 Bundle Analyzer 发现并移除了某个大库**（如把 moment 换 dayjs，体积减 X KB）。
- **设计过 Monorepo**（用 pnpm workspaces + Turborepo，讲清楚包划分策略、构建顺序）。
- **写过 ESLint 自定义规则**，用于团队规范（禁止直接用某个 API、强制某个写法）。
- **在 CI 上做 bundle budget**：PR 导致产物超过阈值就自动 comment/reject。
- **写过 Webpack / Vite 插件**并在团队里使用。
- **设计过 SSR / SSG 的方案**，并上线。
- **设计过错误监控 + Sourcemap 上传的闭环流程**。

> 讲的时候一定用"问题 → 方案 → 效果/数据"三段式："我们项目之前 XXX，我用了 YYY，结果 ZZZ（具体数字）。"
