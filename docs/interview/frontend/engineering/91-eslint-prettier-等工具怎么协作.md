---
title: "ESLint / Prettier / Stylelint / Husky / lint-staged / commitlint 各自负责什么？怎么协作？"
---

# ESLint / Prettier / Stylelint / Husky / lint-staged / commitlint 各自负责什么？怎么协作？

**核心考察点**：是否搭建过工程化规范体系。

**典型组合**：

```
package.json
├── devDependencies
│   ├── eslint              // JS/TS 代码质量检查
│   ├── prettier            // 代码格式化（风格）
│   ├── eslint-config-prettier  // 关闭 ESLint 里与 Prettier 冲突的规则
│   ├── eslint-plugin-prettier  // 让 Prettier 以 ESLint 规则形式运行
│   ├── stylelint           // CSS/SCSS 检查
│   ├── husky               // git hooks 管理
│   ├── lint-staged         // 只对 git staged 文件跑 lint，速度快
│   ├── commitlint          // 校验 commit message
│   └── @commitlint/config-conventional
└── scripts: {
      "lint": "eslint src --ext .ts,.tsx --cache",
      "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
      "prepare": "husky install",  // 安装 husky（npm v7+ prepare 脚本）
    }
```

**`.husky/pre-commit`**：

```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

**`.husky/commit-msg`**：

```sh
npx --no -- commitlint --edit "$1"
```

**`package.json` 的 `lint-staged`**：

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

**Commit 规范（Conventional Commits）**：
`type(scope): subject`

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具链
