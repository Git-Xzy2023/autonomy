---
title: Git 进阶与实战技巧
---

# Git 进阶与实战技巧

> 本章涵盖 Git 的高级功能：reflog、cherry-pick、bisect、submodule、hooks、reflog 救命技巧等，帮助你应对复杂场景。

---

## 一、cherry-pick 挑选提交

### 1.1 什么是 cherry-pick

将某个 commit 的修改应用到当前分支，常用于：
- 把 hotfix 从 master 应用到 develop
- 把误提交到错误分支的 commit 转移
- 选择性合并某个功能

### 1.2 基本用法

```bash
# 挑选单个 commit
git cherry-pick <commit-hash>

# 挑选多个
git cherry-pick <hash1> <hash2> <hash3>

# 挑选范围（不含 start）
git cherry-pick <start>..<end>

# 只应用修改，不自动提交
git cherry-pick --no-commit <hash>

# 保留原作者信息
git cherry-pick -x <hash>
```

### 1.3 冲突处理

```bash
git cherry-pick <hash>
# 冲突时
# 1. 手动解决冲突
# 2. git add .
# 3. git cherry-pick --continue

# 放弃
git cherry-pick --abort
```

---

## 二、reflog 救命指南

### 2.1 reflog 是什么

reflog 记录 HEAD 的所有变化，包括 reset、checkout、rebase 等操作。**即使 commit 被 reset 丢弃，reflog 仍能找回。**

```bash
git reflog
# 输出：
# 7a3b2c1 HEAD@{0}: reset: moving to HEAD^
# 8f9d4e2 HEAD@{1}: commit: feat: 新功能
# 9a1b3c4 HEAD@{2}: checkout: moving from main to feature
```

### 2.2 找回误删的 commit

```bash
# 误操作：git reset --hard HEAD^ 丢弃了提交

# 1. 查看 reflog
git reflog
# 找到丢失的 commit hash，如 8f9d4e2

# 2. 恢复
git reset --hard 8f9d4e2
# 或创建新分支指向它
git branch recover 8f9d4e2
```

### 2.3 reflog 的有效期

```bash
# 默认 90 天（可达） / 30 天（不可达）
git config --global gc.reflogExpire "200 days"
git config --global gc.reflogExpireUnreachable "90 days"
```

---

## 三、bisect 二分查找 bug

### 3.1 什么时候用

当发现一个 bug，但不知道是哪次提交引入的。用 bisect 二分查找，快速定位。

### 3.2 使用流程

```bash
# 1. 开始 bisect
git bisect start

# 2. 标记当前（有 bug）
git bisect bad

# 3. 标记一个已知正常的版本
git bisect good v1.0.0   # 或 commit hash

# 4. Git 自动切到中间提交，测试后标记
git bisect good   # 这个版本正常
# 或
git bisect bad    # 这个版本有 bug

# 5. 重复直到找到罪魁祸首
# Git 会告诉你哪个 commit 引入了 bug

# 6. 结束
git bisect reset
```

### 3.3 自动化 bisect

```bash
# 提供一个测试脚本，自动二分
git bisect start HEAD v1.0.0
git bisect run npm test   # 测试通过返回 0（good），失败非 0（bad）
git bisect reset
```

---

## 四、submodule 子模块

### 4.1 添加子模块

```bash
git submodule add https://github.com/user/lib.git libs/lib
git commit -m "chore: 添加 lib 子模块"
```

### 4.2 克隆含子模块的项目

```bash
# 方式 1：递归克隆
git clone --recurse-submodules https://github.com/user/repo.git

# 方式 2：先克隆再初始化
git clone https://github.com/user/repo.git
cd repo
git submodule init
git submodule update
```

### 4.3 更新子模块

```bash
# 拉取子模块的最新代码
git submodule update --remote

# 拉取并切换到特定分支
git config -f .gitmodules submodule.libs/lib.branch main
git submodule update --remote
```

### 4.4 删除子模块

```bash
git submodule deinit -f libs/lib
git rm -f libs/lib
git commit -m "chore: 移除 lib 子模块"
```

---

## 五、Git Hooks

### 5.1 常用 hooks

| Hook                | 触发时机             | 用途                 |
| ------------------- | -------------------- | -------------------- |
| `pre-commit`        | commit 前            | 代码检查、格式化     |
| `commit-msg`        | 写入 commit 信息时   | 校验提交信息格式     |
| `pre-push`          | push 前              | 运行测试             |
| `post-merge`        | merge 后             | 安装依赖             |
| `pre-rebase`        | rebase 前            | 防止 rebase 已推送   |

### 5.2 示例：pre-commit 代码检查

```bash
# .git/hooks/pre-commit
#!/bin/sh
echo "运行 ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint 检查未通过，请修复后重试"
  exit 1
fi
echo "✅ 代码检查通过"
```

```bash
chmod +x .git/hooks/pre-commit
```

### 5.3 commit-msg 规范校验

```bash
#!/bin/sh
# .git/hooks/commit-msg
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .{1,100}$'
error_msg="提交信息不符合规范！格式：type(scope): subject"

if ! grep -qE "$commit_regex" "$1"; then
  echo "$error_msg"
  exit 1
fi
```

### 5.4 husky（共享 hooks）

`.git/hooks` 不会被提交，团队共享需用 husky：

```bash
npm install -D husky
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

---

## 六、rebase 进阶

### 6.1 交互式 rebase

```bash
# 合并最近 3 个提交
git rebase -i HEAD~3
```

编辑器打开：

```
pick e3a1b35 feat: 功能 A
pick 7ac9a02 feat: 功能 B
pick 4b2f199 fix: 修复 A

# 可选操作：
# pick    = 保留
# squash  = 合并到上一个
# reword  = 修改提交信息
# edit    = 暂停修改
# drop    = 删除
```

### 6.2 合并提交示例

```
pick e3a1b35 feat: 功能 A
squash 7ac9a02 feat: 功能 B
squash 4b2f199 fix: 修复 A
```

保存后输入新的提交信息，3 个提交合并为 1 个。

### 6.3 rebase 冲突

```bash
git rebase main
# 冲突时
# 1. 解决冲突
# 2. git add .
# 3. git rebase --continue

# 跳过当前
git rebase --skip

# 放弃 rebase
git rebase --abort
```

---

## 七、git worktree 多工作树

### 7.1 场景

需要同时在不同分支工作，又不想频繁切换或克隆多份代码。

```bash
# 在 ../feature-login 目录创建 feature 分支的工作树
git worktree add ../feature-login feature/login

# 在 ../hotfix 目录基于 main 创建新分支
git worktree add -b hotfix/bug ../hotfix main

# 查看
git worktree list

# 删除
git worktree remove ../feature-login
```

### 7.2 优势

- 一份仓库，多个工作目录
- 不同分支并行开发，无需 stash
- 共享 .git，节省空间

---

## 八、bisect + 自动化实战

```bash
# 发现 bug，不知道哪次引入
git bisect start
git bisect bad HEAD
git bisect good v2.0.0

# 自动化测试脚本 test.sh
cat > test.sh << 'EOF'
#!/bin/bash
npm run build && npm run test:e2e
EOF
chmod +x test.sh

git bisect run ./test.sh
# 自动定位到有问题的 commit
git bisect reset
```

---

## 九、Git LFS 大文件

### 9.1 安装与使用

```bash
# 安装
brew install git-lfs

# 初始化
git lfs install

# 跟踪大文件类型
git lfs track "*.psd"
git lfs track "*.zip"

# 提交
git add .gitattributes
git add design.psd
git commit -m "chore: 添加设计稿"
```

### 9.2 适用场景

- 设计稿（PSD/Sketch）
- 视频音频
- 数据集
- 二进制依赖

---

## 十、常用技巧

### 10.1 查找某个字符串的修改历史

```bash
# 查找哪个 commit 删除/添加了某行
git log -S "functionName" --oneline

# 查看某行的修改历史
git log -L 10,20:file.txt
```

### 10.2 清理未跟踪文件

```bash
# 查看将被删除的文件
git clean -n

# 删除未跟踪文件
git clean -f

# 删除未跟踪目录
git clean -fd

# 删除被忽略的文件
git clean -x
```

### 10.3 统计代码行数

```bash
# 按作者统计
git shortlog -s -n

# 统计提交数
git rev-list --count HEAD

# 查看某文件每行最后修改人
git blame file.txt
```

### 10.4 修改历史提交

```bash
# 修改倒数第 2 个提交
git rebase -i HEAD~2
# 把要修改的提交改为 edit
# 修改文件后
git add .
git commit --amend
git rebase --continue
```

---

## 十一、学习建议

1. **reflog 是救命稻草**：误操作先看 reflog
2. **cherry-pick**：跨分支转移 commit 的利器
3. **bisect**：定位回归 bug 的高效工具
4. **hooks + husky**：自动化代码质量保证
5. **worktree**：多分支并行的利器

---

## 参考

- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Git 工具](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7)
