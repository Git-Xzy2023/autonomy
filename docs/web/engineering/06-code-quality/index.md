---
title: 代码规范与工具链
---

# 代码规范与工具链

> 统一的代码规范和工具链是团队协作的基础，能提高代码质量、减少错误、提升开发效率。

---

## 一、为什么需要代码规范

### 1.1 代码规范的重要性

```
┌──────────────────────────────────────────────────┐
│  ✅ 提高代码可读性                                │
│     - 所有开发者编写风格一致                         │
│     - 减少理解他人代码的成本                         │
│                                                     │
│  ✅ 降低维护成本                                    │
│     - 统一的格式避免无谓的 git diff                 │
│     - 自动化工具替代人工检查                         │
│                                                     │
│  ✅ 提高代码质量                                    │
│     - 静态检查发现潜在 bug                           │
│     - 强制使用最佳实践                               │
│                                                     │
│  ✅ 提升团队协作                                    │
│     - 减少代码风格争议                               │
│     - Code Review 关注逻辑而非格式                    │
└──────────────────────────────────────────────────┘
```

### 1.2 工具链组成

```
前端代码规范工具链
├── ESLint          ← JavaScript/TypeScript 代码检查
├── Prettier        ← 代码格式化
├── Stylelint       ← CSS/SCSS/Less 样式检查
├── EditorConfig    ← 编辑器统一配置
├── Husky           ← Git Hooks 管理
├── lint-staged     ← 仅对暂存文件执行 lint
├── commitlint      ← Git 提交信息规范
└── TypeScript      ← 类型检查（如果使用 TS）
```

---

## 二、ESLint 详解

### 2.1 ESLint 基础

ESLint 是目前最流行的 JavaScript/TypeScript 代码检查工具。

**安装**：

```bash
npm install eslint --save-dev
# 或
pnpm add -D eslint
```

**初始化配置**：

```bash
# 使用向导创建配置
npx eslint --init

# 或者手动创建
```

### 2.2 配置文件详解

**`.eslintrc.js`（推荐）**：

```javascript
module.exports = {
  // 环境配置
  env: {
    browser: true,      // 浏览器环境
    es2022: true,       // ES2022 语法
    node: true,         // Node.js 环境
  },

  // 扩展规则集
  extends: [
    'eslint:recommended',  // ESLint 推荐规则
    'plugin:vue/vue3-recommended',  // Vue 3 推荐规则
    'plugin:@typescript-eslint/recommended',  // TS 推荐
    'prettier',  // 与 Prettier 集成
  ],

  // 解析器
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',  // 最新 ECMAScript 版本
    sourceType: 'module',  // 使用 ES Modules
    parser: '@typescript-eslint/parser',  // TS 解析器
  },

  // 插件
  plugins: ['vue', '@typescript-eslint'],

  // 自定义规则
  rules: {
    // 错误级别：0=off, 1=warn, 2=error
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],

    // Vue 规则
    'vue/multi-word-component-names': 'off',

    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },

  // 忽略文件
  ignorePatterns: ['dist', 'node_modules', '*.config.js'],
};
```

**其他格式**：

- `.eslintrc.yaml` / `.eslintrc.yml`
- `.eslintrc.json`
- `.eslintrc`（JSON 格式）

### 2.3 常用命令

```bash
# 检查文件
npx eslint src/

# 检查并自动修复
npx eslint src/ --fix

# 检查特定文件
npx eslint src/main.js src/App.vue

# 忽略警告，只显示错误
npx eslint src/ --quiet

# 输出 JSON 格式
npx eslint src/ --format json
```

**package.json 脚本**：

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.vue,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.vue,.ts,.tsx --fix"
  }
}
```

### 2.4 配合 VS Code

安装扩展：`dbaeumer.vscode-eslint`

**`.vscode/settings.json`**：

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "eslint.workingDirectories": ["./"]
}
```

### 2.5 常见规则集

| 规则集 | 适用场景 | 说明 |
|--------|---------|------|
| `eslint:recommended` | 通用 | ESLint 官方推荐 |
| `standard` | 通用 | JavaScript Standard Style |
| `airbnb-base` | 通用 | Airbnb 基础规则 |
| `plugin:vue/vue3-recommended` | Vue 3 | Vue 3 推荐 |
| `plugin:vue/vue3-essential` | Vue 3 | Vue 3 基础 |
| `plugin:react/recommended` | React | React 推荐 |
| `plugin:@typescript-eslint/recommended` | TypeScript | TS 推荐 |

---

## 三、Prettier 详解

### 3.1 Prettier 基础

Prettier 是一个有主见的代码格式化工具，支持多种语言。

**安装**：

```bash
npm install prettier --save-dev
# 与 ESLint 配合
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

**使用**：

```bash
# 格式化文件
npx prettier src/ --write

# 检查哪些文件需要格式化
npx prettier src/ --check

# 格式化特定文件
npx prettier src/main.js --write
```

### 3.2 配置文件

**`.prettierrc`**（推荐 JSON 格式）：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": true,
  "htmlWhitespaceSensitivity": "ignore"
}
```

**`.prettierrc.js`**（JavaScript 格式，支持注释）：

```javascript
module.exports = {
  semi: true,                    // 使用分号
  singleQuote: true,             // 使用单引号
  tabWidth: 2,                   // 缩进宽度
  useTabs: false,                // 使用空格缩进
  trailingComma: 'es5',          // 尾逗号（ES5 支持的地方）
  printWidth: 100,               // 单行最大宽度
  bracketSpacing: true,          // 对象括号内的空格
  arrowParens: 'always',         // 箭头函数参数总是有括号
  endOfLine: 'lf',               // 行尾符
  vueIndentScriptAndStyle: true, // Vue 文件的 script/style 缩进
};
```

**忽略文件**（`.prettierignore`）：

```
node_modules
dist
build
coverage
*.min.js
```

### 3.3 配合 VS Code

安装扩展：`esbenp.prettier-vscode`

**`.vscode/settings.json`**：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.semi": true,
  "prettier.singleQuote": true
}
```

### 3.4 Prettier 与 ESLint 集成

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',  // 关闭与 Prettier 冲突的规则
    'plugin:prettier/recommended',  // 将 Prettier 规则作为 ESLint 错误
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',  // Prettier 格式错误作为 ESLint 错误
  },
};
```

---

## 四、Stylelint（样式检查）

### 4.1 Stylelint 基础

Stylelint 用于检查 CSS/SCSS/Less 代码。

**安装**：

```bash
npm install stylelint stylelint-config-standard --save-dev

# 或使用更严格的配置
npm install stylelint stylelint-config-recommended --save-dev

# Vue 项目
npm install stylelint-config-recommended-vue postcss-html --save-dev
```

**配置文件**（`.stylelintrc.json`）：

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue"
  ],
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "no-duplicate-selectors": true,
    "color-hex-case": "lower",
    "color-hex-length": "short"
  },
  "ignoreFiles": ["dist/**", "node_modules/**"]
}
```

**使用**：

```bash
# 检查样式
npx stylelint "**/*.{css,scss,vue}"

# 自动修复
npx stylelint "**/*.{css,scss,vue}" --fix
```

---

## 五、EditorConfig

EditorConfig 帮助跨编辑器和 IDE 维护一致的编码风格。

**`.editorconfig`**：

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab

[*.{js,ts,vue,jsx,tsx}]
indent_size = 2

[*.{css,scss,less}]
indent_size = 2

[*.json]
indent_size = 2
```

**VS Code 扩展**：`EditorConfig.EditorConfig`

---

## 六、Git Hooks 与 Husky

### 6.1 Husky 基础

Husky 让 Git Hooks 的使用变得简单。

**安装**：

```bash
npm install husky --save-dev
# 或
pnpm add -D husky
```

**初始化**：

```bash
# 启用 Git Hooks
npx husky install

# 添加 pre-commit hook
npx husky add .husky/pre-commit "npm run lint-staged"

# 添加 commit-msg hook（配合 commitlint）
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

**package.json 配置**：

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### 6.2 lint-staged

只对 Git 暂存区的文件执行检查，速度更快。

**安装**：

```bash
npm install lint-staged --save-dev
```

**配置**（`package.json` 中）：

```json
{
  "lint-staged": {
    "*.{js,ts,vue,jsx,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,less}": [
      "stylelint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**使用**：

```bash
# 对暂存文件执行 lint
npx lint-staged
```

---

## 七、Commitlint（提交规范）

### 7.1 安装与配置

Commitlint 规范 Git 提交信息格式。

**安装**：

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev
```

**配置文件**（`commitlint.config.js`）：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',      // 新功能
        'fix',       // Bug 修复
        'docs',      // 文档更新
        'style',     // 代码格式调整
        'refactor',  // 代码重构
        'perf',      // 性能优化
        'test',      // 测试相关
        'build',     // 构建系统
        'ci',        // CI/CD 配置
        'chore',     // 其他杂项
        'revert',    // 回滚提交
      ],
    ],
    'subject-case': [0],
  },
};
```

### 7.2 Conventional Commits 格式

提交信息格式：

```
<type>(<scope>): <subject>
// 空行
<body>
// 空行
<footer>
```

**Type 类型说明**：

| Type | 说明 |
|------|------|
| `feat` | 新功能（feature） |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响代码运行） |
| `refactor` | 代码重构（非新增功能也非修复 bug） |
| `perf` | 性能优化 |
| `test` | 增加或修改测试 |
| `build` | 构建系统或外部依赖变动 |
| `ci` | CI/CD 配置文件变动 |
| `chore` | 其他杂项 |
| `revert` | 回滚之前的提交 |

**示例**：

```
feat(user): 添加用户登录功能

实现 JWT 认证，支持邮箱和手机号登录

Closes #123
```

```
fix(button): 修复按钮在移动端无法点击的问题

更新样式，提高 touch 目标大小
```

```
docs(readme): 更新安装说明

添加 pnpm 安装命令
```

---

## 八、完整项目配置示例

### 8.1 Vue 3 + Vite + TypeScript 项目

**依赖安装**：

```bash
# ESLint 相关
npm install -D eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Prettier 相关
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Git Hooks
npm install -D husky lint-staged

# Commitlint
npm install -D @commitlint/cli @commitlint/config-conventional
```

**`.eslintrc.js`**：

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.js'],
};
```

**`.prettierrc`**：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": true
}
```

**`commitlint.config.js`**：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

**package.json**：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "lint": "eslint src --ext .js,.ts,.vue",
    "lint:fix": "eslint src --ext .js,.ts,.vue --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "prepare": "husky install",
    "commit": "git-cz"
  },
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Husky hooks**：

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

---

## 九、总结

代码规范工具链是前端工程化的基础：

- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Stylelint**：样式检查
- **EditorConfig**：编辑器配置
- **Husky** + **lint-staged**：Git 提交前检查
- **commitlint**：Git 提交信息规范

**学习建议**：
1. 逐个工具学习，先从 Prettier 和 ESLint 入手
2. 在新项目中使用脚手架初始化配置
3. 在团队中推广统一规范
4. 逐步完善，不需要一步到位

---

> **参考资源**：
> - ESLint 官方：https://eslint.org/
> - Prettier 官方：https://prettier.io/
> - Stylelint 官方：https://stylelint.io/
> - Husky 官方：https://typicode.github.io/husky/
> - Conventional Commits：https://www.conventionalcommits.org/
