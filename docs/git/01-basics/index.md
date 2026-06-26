---
title: Git 基础与核心命令
---

# Git 基础与核心命令

> 本章介绍 Git 的核心概念、三大区域、常用命令、分支管理与合并策略，是上手 Git 的必读内容。

---

## 一、Git 核心概念

### 1.1 三大区域

```
工作区 (Working Directory)
  你在文件管理器看到的目录，直接修改的文件

       ↓ git add

暂存区 (Staging Area / Index)
  已修改但未提交的文件集合（.git/index）

       ↓ git commit

本地仓库 (Local Repository)
  已提交的版本快照（.git/objects）

       ↓ git push

远程仓库 (Remote Repository)
  GitHub / GitLab 等远程服务器
```

### 1.2 文件状态

```
Untracked（未跟踪）
   ↓ git add
Staged（已暂存）
   ↓ git commit
Committed（已提交）
   ↓ 修改文件
Modified（已修改）
   ↓ git add
Staged
```

### 1.3 Git vs SVN

| 对比项     | Git（分布式）           | SVN（集中式）        |
| ---------- | ----------------------- | -------------------- |
| **仓库**   | 每人本地完整仓库         | 仅中央服务器有完整仓库 |
| **离线**   | 支持离线提交             | 必须联网             |
| **分支**   | 轻量，秒级切换           | 重量级，目录级       |
| **速度**   | 快                       | 较慢                 |
| **完整性** | SHA-1 校验，防篡改       | 较弱                 |

---

## 二、安装与配置

### 2.1 安装

```bash
# macOS
brew install git

# Ubuntu
sudo apt install git

# Windows：下载 https://git-scm.com
```

### 2.2 全局配置

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置默认分支名
git config --global init.defaultBranch main

# 查看配置
git config --list
```

### 2.3 SSH 密钥

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "you@example.com"

# 查看公钥（添加到 GitHub）
cat ~/.ssh/id_ed25519.pub

# 测试连接
ssh -T git@github.com
```

---

## 三、基础命令

### 3.1 仓库初始化

```bash
# 新建本地仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git   # SSH
git clone --depth 1 https://github.com/user/repo.git  # 浅克隆（只取最新一次提交）
```

### 3.2 提交修改

```bash
# 查看状态
git status

# 添加到暂存区
git add file.txt
git add .          # 添加所有变更
git add -A          # 添加所有（含删除）
git add -p          # 交互式添加（分块选择）

# 提交
git commit -m "feat: 新增登录功能"
git commit -am "fix: 修复登录 bug"   # 跳过 add（仅对已跟踪文件）

# 修改最后一次提交
git commit --amend -m "新的提交信息"
```

### 3.3 查看历史

```bash
# 提交历史
git log
git log --oneline              # 单行显示
git log --oneline --graph      # 图形化
git log --author="zhangsan"    # 按作者
git log --since="2 weeks ago"  # 按时间
git log -p file.txt           # 查看文件的修改历史
git log --stat                # 显示统计

# 查看具体修改
git show <commit-hash>
git diff                      # 工作区 vs 暂存区
git diff --staged             # 暂存区 vs 最新提交
git diff HEAD                 # 工作区 vs 最新提交
git diff branch1..branch2     # 分支差异
```

### 3.4 撤销操作

```bash
# 撤销工作区修改（未 add）
git checkout -- file.txt
git restore file.txt           # 新命令

# 撤销暂存（已 add 未 commit）
git reset HEAD file.txt
git restore --staged file.txt

# 撤销提交
git reset --soft HEAD^        # 撤销 commit，保留暂存区
git reset --mixed HEAD^       # 撤销 commit，保留工作区（默认）
git reset --hard HEAD^        # 撤销 commit，丢弃所有修改（危险）

# 通过新提交撤销
git revert <commit-hash>      # 生成一个反向提交（安全，不改历史）
```

### 3.5 reset 三种模式对比

| 模式        | HEAD  | 暂存区 | 工作区 |
| ----------- | ----- | ------ | ------ |
| `--soft`    | 回退  | 保留   | 保留   |
| `--mixed`   | 回退  | 回退   | 保留   |
| `--hard`    | 回退  | 回退   | 回退   |

---

## 四、远程仓库

### 4.1 远程操作

```bash
# 查看远程
git remote -v
git remote show origin

# 添加远程
git remote add origin git@github.com:user/repo.git

# 修改远程地址
git remote set-url origin git@github.com:user/new.git

# 拉取与推送
git fetch origin              # 获取但不合并
git pull origin main          # 拉取并合并（= fetch + merge）
git push origin main          # 推送
git push -u origin main      # 首次推送并建立跟踪
git push --force-with-lease   # 安全的强制推送（推荐）

# 删除远程分支
git push origin --delete feature
```

### 4.2 fetch vs pull

```bash
# fetch：只下载，不合并
git fetch origin
git log origin/main          # 查看远程变化
git merge origin/main        # 手动合并

# pull：fetch + merge
git pull origin main
```

建议：先用 `git fetch` 查看变化，再决定是否合并，避免意外冲突。

---

## 五、分支管理

### 5.1 分支基础

```bash
# 查看分支
git branch                   # 本地分支
git branch -r               # 远程分支
git branch -a               # 所有分支

# 创建分支
git branch feature          # 创建
git checkout -b feature     # 创建并切换
git switch -c feature       # 新命令（推荐）

# 切换分支
git checkout main
git switch main             # 新命令（推荐）

# 删除分支
git branch -d feature        # 安全删除（已合并）
git branch -D feature        # 强制删除

# 重命名分支
git branch -m old new
```

### 5.2 合并分支

```bash
# merge：保留分支历史
git checkout main
git merge feature

# rebase：线性历史
git checkout feature
git rebase main
git checkout main
git merge feature           # fast-forward 合并
```

### 5.3 merge vs rebase

```
场景：feature 分支从 main 分出，main 又有新提交

main:     A---B---C
           \
feature:   D---E

方案 1：merge
main:     A---B---C-------M
           \         /
feature:   D---E---/

方案 2：rebase（feature 变基到 main）
main:     A---B---C
                   \
feature:            D'---E'
然后 fast-forward 合并 main：
main:     A---B---C---D'---E'
```

| 对比项       | merge                   | rebase                  |
| ------------ | ----------------------- | ------------------------ |
| **历史**     | 保留分支记录             | 线性历史                 |
| **冲突**     | 一次解决                 | 每个提交都可能冲突       |
| **提交**     | 生成 merge commit       | 重新生成 commit hash     |
| **何时用**   | 合并公共分支             | 整理本地分支             |

> **黄金法则**：不要在公共分支（main/develop）上 rebase，会改写历史影响他人。

### 5.4 解决冲突

```bash
git merge feature
# 冲突时，打开冲突文件：
# <<<<<<< HEAD
# 当前分支的代码
# =======
# feature 分支的代码
# >>>>>>> feature

# 手动修改后：
git add file.txt
git commit -m "merge: 解决冲突"

# 中止合并
git merge --abort
```

### 5.5 stash 暂存

```bash
# 暂存当前修改
git stash
git stash -u                # 包含未跟踪文件
git stash save "wip: 登录功能"

# 查看
git stash list

# 恢复（保留 stash）
git stash apply
git stash apply stash@{1}

# 恢复并删除
git stash pop

# 删除
git stash drop stash@{0}
git stash clear
```

---

## 六、标签管理

### 6.1 创建标签

```bash
# 轻量标签
git tag v1.0.0

# 附注标签（推荐，包含信息）
git tag -a v1.0.0 -m "发布版本 1.0.0"

# 给历史提交打标签
git tag -a v0.9.0 <commit-hash> -m "历史版本"
```

### 6.2 查看与推送

```bash
git tag                     # 查看所有标签
git show v1.0.0             # 查看标签信息
git push origin v1.0.0      # 推送单个
git push origin --tags       # 推送所有

# 删除
git tag -d v1.0.0           # 删除本地
git push origin --delete v1.0.0  # 删除远程
```

---

## 七、.gitignore

### 7.1 基础语法

```gitignore
# 忽略所有 .log 文件
*.log

# 但保留 error.log
!error.log

# 忽略 node_modules 目录
node_modules/

# 忽略 build 下的所有文件
build/

# 只忽略根目录的 config
/config.json
```

### 7.2 常用模板

```gitignore
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
dist/

# 环境变量
.env
.env.local

# 编辑器
.vscode/
.idea/
*.swp
.DS_Store

# 构建产物
build/
*.tsbuildinfo
```

### 7.3 已跟踪文件被忽略

```bash
# 如果文件已被跟踪，gitignore 不生效
# 需要先移除跟踪（不删除本地文件）
git rm --cached file.txt
git commit -m "chore: 移除 file.txt 跟踪"
```

---

## 八、提交规范

### 8.1 Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

| type     | 说明           |
| -------- | -------------- |
| feat     | 新功能         |
| fix      | 修复 bug       |
| docs     | 文档           |
| style    | 格式（不影响逻辑）|
| refactor | 重构           |
| test     | 测试           |
| chore    | 构建/工具      |
| perf     | 性能优化       |
| ci       | CI 配置        |

### 8.2 示例

```
feat(auth): 新增微信扫码登录

支持微信开放平台 OAuth2.0 扫码登录，
绑定已有账号或创建新账号。

Closes #123
```

---

## 九、学习建议

1. **三大区域**：理解工作区/暂存区/仓库是 Git 核心
2. **分支**：branch/merge/rebase 是日常高频操作
3. **冲突解决**：理解冲突标记，手动解决
4. **提交规范**：团队统一 Conventional Commits

---

## 参考

- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Learn Git Branching（交互式教程）](https://learngitbranching.js.org/?locale=zh_CN)
