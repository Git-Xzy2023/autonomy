---
title: Git 工作流与分支策略
---

# Git 工作流与分支策略

> 工作流是团队协作的分支管理规范。本章对比 Git Flow、GitHub Flow、GitLab Flow 三种主流工作流，帮助团队选择合适的分支策略。

---

## 一、为什么需要工作流

### 1.1 没有规范的问题

- 分支命名混乱：`feature1`、`test`、`tmp`、`zhangsan`
- 不知从哪个分支切出，合并到哪个分支
- 上线时找不到对应代码
- 多人协作冲突频繁

### 1.2 工作流的目标

- 🎯 **明确分支职责**：每个分支用途清晰
- 🔄 **规范流转**：从开发到上线的路径明确
- 🚀 **支持并行**：多功能并行开发互不干扰
- 🛡️ **保证质量**：代码评审、测试、预发布

---

## 二、Git Flow

### 2.1 分支模型

```
master:    ─────●─────────────────●─────（生产环境）
                \               /
develop:   ──────●───●───●───●─●─────────（开发主干）
                  \       /
feature/x:    ─────●───●──（功能开发）
                                \
release/x:    ───────────────────●────（预发布）
hotfix/x:                ●───────（紧急修复）
```

### 2.2 分支说明

| 分支          | 来源     | 合并到           | 生命周期   | 用途           |
| ------------- | -------- | ---------------- | ---------- | -------------- |
| `master`      | -        | -                | 永久       | 生产环境代码   |
| `develop`     | master   | -                | 永久       | 开发集成主干   |
| `feature/*`   | develop  | develop          | 临时       | 新功能开发     |
| `release/*`   | develop  | master + develop | 临时       | 预发布/测试    |
| `hotfix/*`    | master   | master + develop | 临时       | 紧急修复       |

### 2.3 操作示例

```bash
# 开始新功能
git checkout develop
git checkout -b feature/login

# 开发完成，合并回 develop
git checkout develop
git merge --no-ff feature/login
git branch -d feature/login

# 准备发布
git checkout develop
git checkout -b release/1.0.0
# 修复 bug、更新版本号
git checkout master
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "发布 1.0.0"
git checkout develop
git merge --no-ff release/1.0.0

# 紧急修复
git checkout master
git checkout -b hotfix/1.0.1
# 修复
git checkout master
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1
git checkout develop
git merge --no-ff hotfix/1.0.1
```

### 2.4 适用场景

- ✅ 有明确发布周期（按周/月）
- ✅ 需要维护多个线上版本
- ✅ 团队较大，分支角色清晰
- ❌ 持续部署不适用（分支太多太重）

---

## 三、GitHub Flow

### 3.1 分支模型

```
main:    ──●──●──●──●──●──●──●──（始终可部署）
          \      \      \
feature:   ●──●    ●──●    ●──●（功能分支 + PR）
```

### 3.2 流程

1. 从 `main` 切出 feature 分支
2. 在分支上提交修改
3. 创建 Pull Request 到 `main`
4. 代码评审 + CI 测试
5. 合并后自动部署
6. 删除 feature 分支

```bash
# 切分支
git checkout main
git pull
git checkout -b feature/user-profile

# 开发提交
git add .
git commit -m "feat: 新增用户资料页"

# 推送
git push -u origin feature/user-profile

# 在 GitHub 创建 PR，评审通过后合并
# 合并后删除分支
git checkout main
git pull
git branch -d feature/user-profile
```

### 3.3 适用场景

- ✅ 持续部署（合并即上线）
- ✅ 小团队 / 开源项目
- ✅ 快速迭代
- ❌ 需要预发布环境的项目不适用

---

## 四、GitLab Flow

### 4.1 分支模型

```
main:       ──●──●──●──●──●──（开发主干）
              \      \
pre:          ─●──────●──────（预发布）
                \      \
production:      ●──────●────（生产）
```

### 4.2 环境分支

GitLab Flow 用分支对应环境：

| 分支           | 环境       |
| -------------- | ---------- |
| `main`         | 开发环境   |
| `pre-production` | 预发布环境 |
| `production`   | 生产环境   |

代码从 `main` → `pre-production` → `production` 单向流动。

```bash
# 从 main 合并到 pre-production
git checkout pre-production
git merge main
git push origin pre-production
# 自动部署到预发布

# 验证通过后，合并到 production
git checkout production
git merge pre-production
git push origin production
# 自动部署到生产
```

### 4.3 适用场景

- ✅ 多环境部署（dev/staging/prod）
- ✅ 需要环境隔离
- ✅ 中大型团队

---

## 五、Pull Request 规范

### 5.1 PR 模板

```markdown
## 变更说明

<!-- 描述这个 PR 做了什么 -->

## 变更类型

- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档

## 自检清单

- [ ] 代码已自测
- [ ] 已添加测试
- [ ] 已更新文档
- [ ] 不破坏向后兼容

## 关联 Issue

Closes #123
```

### 5.2 代码评审要点

- 🔍 **功能**：是否实现需求
- 🐛 **逻辑**：边界条件、异常处理
- 📐 **设计**：是否过度设计、是否可维护
- 🎨 **风格**：是否符合团队规范
- 📝 **命名**：变量/函数命名是否清晰
- 🧪 **测试**：是否有单元测试

---

## 六、分支保护

### 6.1 保护主分支

GitHub / GitLab 设置：

- 禁止直接 push 到 `main`
- 必须通过 PR 合并
- 至少 N 人评审通过
- CI 必须通过
- 分支必须是最新的（merge 前需 rebase）

### 6.2 强制代码评审

```
开发者 → feature 分支 → PR → 评审 → CI → 合并 main
```

---

## 七、版本号管理

### 7.1 语义化版本

```
MAJOR.MINOR.PATCH
   1     2     3

MAJOR：不兼容的 API 修改
MINOR：向下兼容的功能新增
PATCH：向下兼容的 bug 修复
```

### 7.2 自动化版本

```bash
# standard-version
npm install -D standard-version
npm run release        # 自动生成 CHANGELOG + tag
npm run release -- --release-as major  # 指定类型
```

---

## 八、选择工作流

| 工作流        | 团队规模 | 发布频率 | 复杂度 | 适用场景               |
| ------------- | -------- | -------- | ------ | ---------------------- |
| Git Flow      | 大       | 低       | 高     | 传统软件，多版本维护   |
| GitHub Flow   | 小       | 高       | 低     | 互联网产品，持续部署   |
| GitLab Flow   | 中       | 中       | 中     | 多环境部署            |

### 建议

- **初创/小团队**：GitHub Flow，简单高效
- **中大型团队**：GitLab Flow，环境隔离
- **传统企业**：Git Flow，规范严格
- **开源项目**：GitHub Flow + Fork 模式

---

## 九、Fork 工作流（开源协作）

```bash
# 1. Fork 仓库（在 GitHub 上点 Fork）

# 2. 克隆自己的 fork
git clone git@github.com:you/repo.git
cd repo

# 3. 添加上游
git remote add upstream git@github.com:original/repo.git

# 4. 保持同步
git fetch upstream
git checkout main
git merge upstream/main

# 5. 开发功能
git checkout -b feature/my-feature
# ... 开发 ...

# 6. 推送到自己的 fork
git push origin feature/my-feature

# 7. 在 GitHub 创建 PR（从 your/repo 到 original/repo）
```

---

## 十、学习建议

1. **选一个工作流**：团队统一一种即可
2. **PR 评审**：代码评审是质量保证的关键
3. **分支保护**：主分支必须保护
4. **自动化**：CI/CD 配合工作流，自动测试部署

---

## 参考

- [Git Flow 原文](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/zh/get-started/quickstart/github-flow)
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
