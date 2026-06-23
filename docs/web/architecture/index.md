---
title: 前端架构
---

# 前端架构

> 本章节系统化整理前端架构相关知识，涵盖 **设计模式 → 架构模式 → 代码规范 → 测试** 四大核心主题，帮助你构建可维护、可扩展的前端应用。

---

## 一、为什么学习前端架构

随着前端应用规模的增长，良好的架构设计变得至关重要：

- 🏗️ **可维护性**：清晰的架构让代码易于理解和修改
- 🔄 **可扩展性**：支持业务快速迭代和团队协作
- 🧪 **可测试性**：良好的架构让测试更容易编写
- 👥 **团队协作**：统一的规范降低沟通成本
- ⚡ **性能优化**：合理的架构从源头避免性能问题

---

## 二、学习内容

### 🎨 设计模式

23 种经典设计模式及其在前端中的应用。

| 章节 | 主题       | 链接                                                                   |
| ---- | ---------- | ---------------------------------------------------------------------- |
| 01   | 创建型模式 | [创建型模式](/web/architecture/design-patterns/01-creational/)         |
| 02   | 结构型模式 | [结构型模式](/web/architecture/design-patterns/02-structural/)         |
| 03   | 行为型模式 | [行为型模式](/web/architecture/design-patterns/03-behavioral/)         |
| 04   | 前端应用   | [前端应用](/web/architecture/design-patterns/04-frontend-application/) |

### 🏛️ 架构模式

前端应用的架构模式与组织方式。

| 章节 | 主题         | 链接                                                                      |
| ---- | ------------ | ------------------------------------------------------------------------- |
| 01   | MVC/MVP/MVVM | [MVC/MVP/MVVM](/web/architecture/architecture-patterns/01-mvc-mvp-mvvm/)  |
| 02   | 组件化架构   | [组件化架构](/web/architecture/architecture-patterns/02-component-based/) |
| 03   | 微前端       | [微前端](/web/architecture/architecture-patterns/03-micro-frontends/)     |
| 04   | Monorepo     | [Monorepo](/web/architecture/architecture-patterns/04-monorepo/)          |
| 05   | Islands 架构 | [Islands 架构](/web/architecture/architecture-patterns/05-islands/)       |

### 📝 代码规范

团队协作的代码规范与工具链。

| 章节 | 主题       | 链接                                                               |
| ---- | ---------- | ------------------------------------------------------------------ |
| 01   | ESLint     | [ESLint](/web/architecture/code-standards/01-eslint/)              |
| 02   | Prettier   | [Prettier](/web/architecture/code-standards/02-prettier/)          |
| 03   | Git Commit | [Git Commit](/web/architecture/code-standards/03-git-commit/)      |
| 04   | TypeScript | [TypeScript 规范](/web/architecture/code-standards/04-typescript/) |
| 05   | 代码审查   | [代码审查](/web/architecture/code-standards/05-code-review/)       |

### 🧪 测试

前端测试体系与实践。

| 章节 | 主题       | 链接                                                          |
| ---- | ---------- | ------------------------------------------------------------- |
| 01   | 单元测试   | [单元测试](/web/architecture/testing/01-unit-testing/)        |
| 02   | 集成测试   | [集成测试](/web/architecture/testing/02-integration-testing/) |
| 03   | E2E 测试   | [E2E 测试](/web/architecture/testing/03-e2e-testing/)         |
| 04   | Mock       | [Mock 与 Stub](/web/architecture/testing/04-mock-stub/)       |
| 05   | 测试覆盖率 | [覆盖率](/web/architecture/testing/05-coverage/)              |

---

## 三、推荐学习路线

```
设计模式 → 架构模式 → 代码规范 → 测试
   ↓          ↓          ↓         ↓
创建型      MVC/MVVM   ESLint    单元测试
结构型      组件化     Prettier  集成测试
行为型      微前端     Git规范   E2E测试
前端应用    Monorepo   TS规范    Mock
            Islands    代码审查  覆盖率
```

---

## 四、学习建议

1. **设计模式**：理解每种模式的意图和应用场景，避免过度设计
2. **架构模式**：根据项目规模选择合适的架构，没有银弹
3. **代码规范**：工具链自动化，减少人为错误
4. **测试**：测试金字塔，单元测试为基座，E2E 为顶端

---

## 下一章

开始学习：[设计模式](/web/architecture/design-patterns/)
