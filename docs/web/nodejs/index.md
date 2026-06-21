---
title: Node.js 技术栈学习指南
---

# Node.js 技术栈学习指南

本章节涵盖 Node.js 服务端开发的完整技术栈，按照 **Node.js 基础 → Web 框架（Express/Koa/NestJS）→ 数据库 → 工程化与部署** 的路线系统化整理。

---

## 一、为什么学习 Node.js？

Node.js 是基于 V8 引擎的 JavaScript 运行时，它让 JavaScript 走出了浏览器，能够构建高性能的服务端应用。

- 🚀 **高并发**：事件驱动、非阻塞 I/O，适合 I/O 密集型场景
- 🔄 **全栈统一**：前后端使用同一种语言，降低切换成本
- 📦 **生态丰富**：npm 拥有超过 200 万个包
- 🏢 **企业级**：Netflix、PayPal、LinkedIn 等大厂在生产环境使用

---

## 二、技术栈总览

| 技术        | 定位              | 适用场景                     |
| ----------- | ----------------- | ---------------------------- |
| **Node.js** | JavaScript 运行时 | 所有服务端应用的基础         |
| **Express** | 轻量 Web 框架     | API 服务、小型项目、快速原型 |
| **Koa**     | 现代 Web 框架     | 基于 async/await 的中间件    |
| **NestJS**  | 企业级框架        | 大型项目、微服务、TypeScript |
| **MySQL**   | 关系型数据库      | 结构化数据、事务场景         |
| **MongoDB** | 文档型数据库      | 灵活 schema、快速迭代        |
| **Redis**   | 内存数据库        | 缓存、会话、排行榜           |
| **PM2**     | 进程管理          | 生产部署、负载均衡           |
| **Docker**  | 容器化            | 环境一致性、微服务部署       |

---

## 三、推荐学习路线

```
Node.js 基础 → 模块系统 → npm 包管理 → 核心模块 → 事件循环 → Stream → Buffer → 进程
   ↓
Web 框架（三选一深入）
├── Express（入门推荐，生态成熟）
├── Koa（现代 async/await，源码精简）
└── NestJS（企业级，TypeScript 优先）
   ↓
数据库（按需学习）
├── MySQL（关系型）
├── MongoDB（文档型）
├── Redis（缓存）
└── ORM（Prisma / TypeORM / Sequelize）
   ↓
工程化与部署
├── PM2 进程管理
├── Docker 容器化
├── 测试（Jest / Mocha）
├── 安全（helmet / 限流 / 加密）
└── 性能优化（CPU / 内存 / I/O）
```

---

## 四、各模块入口

### 🟢 Node.js 基础

Node.js 是所有服务端开发的基础。从安装、模块系统、核心模块，到事件循环、Stream、进程管理，构建扎实的底层能力。

| 章节 | 主题                       | 链接                                            |
| ---- | -------------------------- | ----------------------------------------------- |
| 01   | 入门与安装                 | [Node.js 入门](/web/nodejs/basics/01-intro/)    |
| 02   | 模块系统（CommonJS / ESM） | [模块系统](/web/nodejs/basics/02-modules/)      |
| 03   | npm 与包管理               | [npm](/web/nodejs/basics/03-npm/)               |
| 04   | 核心模块（fs/path/os/url） | [核心模块](/web/nodejs/basics/04-core-modules/) |
| 05   | 事件循环与异步编程         | [事件循环](/web/nodejs/basics/05-event-loop/)   |
| 06   | Stream 流                  | [Stream](/web/nodejs/basics/06-stream/)         |
| 07   | Buffer 与字符编码          | [Buffer](/web/nodejs/basics/07-buffer/)         |
| 08   | 进程与子进程               | [进程](/web/nodejs/basics/08-process/)          |

### 🚂 Express

Express 是最流行的 Node.js Web 框架，轻量、灵活、生态丰富，适合入门和中小型项目。

| 章节 | 主题           | 链接                                                 |
| ---- | -------------- | ---------------------------------------------------- |
| 01   | 入门与路由     | [Express 入门](/web/nodejs/express/01-intro/)        |
| 02   | 中间件机制     | [中间件](/web/nodejs/express/02-middleware/)         |
| 03   | 请求与响应处理 | [请求响应](/web/nodejs/express/03-request-response/) |
| 04   | 错误处理       | [错误处理](/web/nodejs/express/04-error-handling/)   |
| 05   | 最佳实践       | [最佳实践](/web/nodejs/express/05-best-practices/)   |

### 🦋 Koa

Koa 由 Express 原班团队打造，基于 async/await，中间件机制更优雅，源码精简。

| 章节 | 主题               | 链接                                           |
| ---- | ------------------ | ---------------------------------------------- |
| 01   | 入门与 Context     | [Koa 入门](/web/nodejs/koa/01-intro/)          |
| 02   | 中间件（洋葱模型） | [中间件](/web/nodejs/koa/02-middleware/)       |
| 03   | 路由与常用中间件   | [路由](/web/nodejs/koa/03-routing/)            |
| 04   | 最佳实践           | [最佳实践](/web/nodejs/koa/04-best-practices/) |

### 🏆 NestJS

NestJS 是基于 TypeScript 的企业级框架，融合了 OOP、FP、FRP 思想，类似 Angular 的架构。

| 章节 | 主题                   | 链接                                              |
| ---- | ---------------------- | ------------------------------------------------- |
| 01   | 入门与 CLI             | [NestJS 入门](/web/nodejs/nestjs/01-intro/)       |
| 02   | 模块与依赖注入         | [模块](/web/nodejs/nestjs/02-modules/)            |
| 03   | Controller / Provider  | [控制器](/web/nodejs/nestjs/03-providers/)        |
| 04   | 中间件 / 守卫 / 拦截器 | [中间件](/web/nodejs/nestjs/04-middleware/)       |
| 05   | 最佳实践               | [最佳实践](/web/nodejs/nestjs/05-best-practices/) |

### 💾 数据库

| 章节 | 主题                    | 链接                                        |
| ---- | ----------------------- | ------------------------------------------- |
| 01   | MySQL                   | [MySQL](/web/nodejs/database/01-mysql/)     |
| 02   | MongoDB                 | [MongoDB](/web/nodejs/database/02-mongodb/) |
| 03   | Redis                   | [Redis](/web/nodejs/database/03-redis/)     |
| 04   | ORM（Prisma / TypeORM） | [ORM](/web/nodejs/database/04-orm/)         |

### 🛠️ 工程化与部署

| 章节 | 主题          | 链接                                                |
| ---- | ------------- | --------------------------------------------------- |
| 01   | PM2 进程管理  | [PM2](/web/nodejs/engineering/01-pm2/)              |
| 02   | Docker 容器化 | [Docker](/web/nodejs/engineering/02-docker/)        |
| 03   | 测试（Jest）  | [测试](/web/nodejs/engineering/03-testing/)         |
| 04   | 安全          | [安全](/web/nodejs/engineering/04-security/)        |
| 05   | 性能优化      | [性能优化](/web/nodejs/engineering/05-performance/) |

---

## 五、框架对比速查表

| 特性           | Express    | Koa             | NestJS          |
| -------------- | ---------- | --------------- | --------------- |
| **语言**       | JS / TS    | JS / TS         | TS 优先         |
| **异步模型**   | 回调       | async/await     | async/await     |
| **中间件**     | 线性       | 洋葱模型        | 洋葱 + 依赖注入 |
| **学习成本**   | 低         | 低              | 中              |
| **适合项目**   | 小型 / API | 中型 / 现代 API | 大型 / 企业级   |
| **TypeScript** | 需配置     | 需配置          | 原生支持        |
| **依赖注入**   | 无         | 无              | 内置            |
| **微服务**     | 需扩展     | 需扩展          | 内置支持        |

---

## 六、学习建议

1. **新手入门**：先学习 [Node.js 基础](/web/nodejs/basics/01-intro/)，理解事件循环和异步编程。
2. **框架选择**：学完基础后，从 [Express](/web/nodejs/express/01-intro/) 入手，再根据项目需求选择 Koa 或 NestJS。
3. **数据库**：根据业务选择，结构化数据用 MySQL，灵活 schema 用 MongoDB，缓存用 Redis。
4. **生产部署**：掌握 [PM2](/web/nodejs/engineering/01-pm2/) 和 [Docker](/web/nodejs/engineering/02-docker/)，确保应用稳定运行。

接下来，从你感兴趣的模块开始学习吧！
