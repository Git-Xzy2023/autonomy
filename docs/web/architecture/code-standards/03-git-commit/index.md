---
title: Git Commit 规范
---

# Git Commit 规范

> 统一的 Git Commit 规范便于团队协作、代码审查和版本管理。

---

## 一、Conventional Commits

### 1.1 规范格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 1.2 type 类型

| type       | 说明                           |
| ---------- | ------------------------------ |
| `feat`     | 新功能                         |
| `fix`      | 修复 bug                       |
| `docs`     | 文档变更                       |
| `style`    | 代码格式（不影响功能）         |
| `refactor` | 重构（既不是新功能也不是修复） |
| `perf`     | 性能优化                       |
| `test`     | 测试相关                       |
| `build`    | 构建系统或外部依赖变更         |
| `ci`       | CI 配置变更                    |
| `chore`    | 其他杂项（不修改 src 或测试）  |
| `revert`   | 回退之前的 commit              |

---

## 二、提交示例

### 2.1 基本提交

```bash
# 新功能
git commit -m "feat: 添加用户登录功能"

# 修复 bug
git commit -m "fix: 修复登录页面样式错乱"

# 文档
git commit -m "docs: 更新 README"

# 重构
git commit -m "refactor: 重构用户管理模块"
```

### 2.2 带 scope

```bash
git commit -m "feat(auth): 添加 OAuth 登录"
git commit -m "fix(api): 修复用户接口返回格式"
git commit -m "docs(readme): 更新安装说明"
```

### 2.3 完整格式

```bash
git commit -m "feat(auth): 添加 OAuth 登录

- 支持 GitHub 登录
- 支持 Google 登录
- 添加登录回调处理

Closes #123"
```

---

## 三、工具链

### 3.1 commitizen

```bash
# 安装
npm install --save-dev commitizen cz-conventional-changelog

# 配置 package.json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

```bash
# 使用交互式提交
npm run commit
# 或
npx cz
```

### 3.2 commitlint

```bash
# 安装
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# 配置
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

```bash
# 检查 commit message
echo "feat: test" | npx commitlint

# 配合 husky
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
```

### 3.3 standard-version / release-it

```bash
# standard-version 自动生成 CHANGELOG
npm install --save-dev standard-version

# package.json
{
  "scripts": {
    "release": "standard-version"
  }
}

# 发布
npm run release
```

---

## 四、分支管理

### 4.1 分支命名规范

```
main          # 主分支（生产环境）
develop       # 开发分支
feature/*     # 功能分支
fix/*         # 修复分支
hotfix/*      # 紧急修复
release/*     # 发布分支
```

### 4.2 Git Flow

```
┌─────────────────────────────────────────┐
│           Git Flow 工作流               │
├─────────────────────────────────────────┤
│                                         │
│  main ────────●──────────────●─────     │
│                ↑              ↑         │
│                │              │         │
│  release ───●──┘              │         │
│              ↑                │         │
│  develop ─●──●────●────●──●───┘         │
│            ↑         ↑                  │
│  feature ──●         │                  │
│                       ↑                 │
│  fix ────────────────●                  │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 GitHub Flow（简化版）

```
main ────●────●────●────●────
          ↑    ↑    ↑
feature ──●    │    │
fix ───────────●    │
hotfix ─────────────●
```

---

## 五、PR 规范

### 5.1 PR 标题

```
feat: 添加用户登录功能 (#123)
fix: 修复购物车计算错误 (#124)
```

### 5.2 PR 描述模板

```markdown
## 变更说明

<!-- 描述这个 PR 做了什么 -->

## 变更类型

- [ ] 新功能（feat）
- [ ] Bug 修复（fix）
- [ ] 重构（refactor）
- [ ] 性能优化（perf）
- [ ] 文档更新（docs）

## 检查清单

- [ ] 代码通过 ESLint 检查
- [ ] 代码通过单元测试
- [ ] 已添加必要的测试
- [ ] 已更新相关文档

## 关联 Issue

Closes #123
```

---

## 六、总结

### ✅ 关键知识点

1. **Conventional Commits**：`type(scope): subject`
2. **type 类型**：feat、fix、docs、style、refactor、perf、test、chore
3. **工具链**：commitizen（交互式）、commitlint（校验）、standard-version（版本）
4. **分支管理**：Git Flow、GitHub Flow
5. **PR 规范**：标题、描述模板、检查清单

### 🔜 下一章

- 下一章：[TypeScript 规范](/web/architecture/code-standards/04-typescript/)
- 上一章：[Prettier](/web/architecture/code-standards/02-prettier/)
- 上一级：[代码规范](/web/architecture/code-standards/)
