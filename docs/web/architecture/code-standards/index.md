---
title: 代码规范
---

# 代码规范

> 代码规范是团队协作的基础，通过工具链自动化保证代码质量。

---

## 学习内容

| 章节 | 主题       | 链接                                                       |
| ---- | ---------- | ---------------------------------------------------------- |
| 01   | ESLint     | [ESLint](/web/architecture/code-standards/01-eslint/)      |
| 02   | Prettier   | [Prettier](/web/architecture/code-standards/02-prettier/)  |
| 03   | Git Commit | [Git Commit](/web/architecture/code-standards/03-git-commit/) |
| 04   | TypeScript | [TypeScript 规范](/web/architecture/code-standards/04-typescript/) |
| 05   | 代码审查   | [代码审查](/web/architecture/code-standards/05-code-review/) |

---

## 代码规范体系

```
┌─────────────────────────────────────────┐
│           代码规范体系                  │
├─────────────────────────────────────────┤
│                                         │
│  📝 代码风格                            │
│  ├── ESLint（代码质量）                 │
│  ├── Prettier（格式化）                 │
│  └── EditorConfig（编辑器配置）         │
│                                         │
│  📋 类型安全                            │
│  ├── TypeScript                         │
│  └── 严格模式                           │
│                                         │
│  🔄 版本控制                            │
│  ├── Git Commit 规范                    │
│  ├── 分支管理策略                       │
│  └── 代码审查                           │
│                                         │
│  🤖 自动化                              │
│  ├── Git Hooks（husky）                 │
│  ├── lint-staged                        │
│  └── CI/CD 检查                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 下一章

开始学习：[ESLint](/web/architecture/code-standards/01-eslint/)
