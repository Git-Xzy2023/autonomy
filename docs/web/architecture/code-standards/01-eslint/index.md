---
title: ESLint
---

# ESLint

> ESLint 是 JavaScript/TypeScript 的静态代码分析工具，用于识别和修复代码问题。

---

## 一、安装与配置

### 1.1 安装

```bash
# 安装 ESLint
npm install --save-dev eslint

# 初始化配置
npx eslint --init
```

### 1.2 配置文件

```javascript
// eslint.config.js（ESLint 9+ Flat Config）
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'semi': ['error', 'never'],
      'quotes': ['error', 'single']
    }
  }
]
```

```javascript
// .eslintrc.js（旧版配置格式）
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  settings: {
    react: { version: 'detect' }
  }
}
```

---

## 二、规则配置

### 2.1 规则级别

```javascript
rules: {
  'rule-name': 'off',        // 关闭
  'rule-name': 'warn',       // 警告
  'rule-name': 'error',      // 错误

  // 带选项的规则
  'quotes': ['error', 'single', { avoidEscape: true }],
  'indent': ['error', 2, { SwitchCase: 1 }]
}
```

### 2.2 常用规则

```javascript
rules: {
  // 代码质量
  'no-unused-vars': 'error',           // 禁止未使用变量
  'no-undef': 'error',                 // 禁止未定义变量
  'no-console': 'warn',                // 警告 console
  'no-debugger': 'error',              // 禁止 debugger
  'no-duplicate-case': 'error',        // 禁止重复 case
  'no-empty': 'error',                 // 禁止空块
  'no-extra-semi': 'error',            // 禁止多余分号

  // 最佳实践
  'eqeqeq': 'error',                   // 必须使用 ===
  'no-eval': 'error',                  // 禁止 eval
  'no-implied-eval': 'error',          // 禁止隐式 eval
  'no-var': 'error',                   // 禁止 var
  'prefer-const': 'error',             // 优先 const
  'prefer-arrow-callback': 'error',    // 优先箭头函数

  // 风格
  'indent': ['error', 2],              // 缩进 2 空格
  'quotes': ['error', 'single'],       // 单引号
  'semi': ['error', 'never'],          // 无分号
  'comma-dangle': ['error', 'never'],  // 无尾逗号
  'no-trailing-spaces': 'error',       // 无尾空格

  // React
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn'
}
```

---

## 三、常用插件

### 3.1 TypeScript

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
extends: [
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking'
],
plugins: ['@typescript-eslint'],
rules: {
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/explicit-function-return-type': 'off'
}
```

### 3.2 React

```bash
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

```javascript
extends: [
  'plugin:react/recommended',
  'plugin:react/jsx-runtime',          // React 17+ 不需 import React
  'plugin:react-hooks/recommended',
  'plugin:jsx-a11y/recommended'
],
settings: {
  react: { version: 'detect' }
}
```

### 3.3 Vue

```bash
npm install --save-dev eslint-plugin-vue
```

```javascript
extends: [
  'plugin:vue/vue3-recommended'
]
```

---

## 四、忽略文件

### 4.1 .eslintignore

```
# .eslintignore
node_modules/
dist/
build/
*.min.js
coverage/
```

### 4.2 在配置中忽略

```javascript
// eslint.config.js
export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '*.min.js']
  },
  // 其他配置
]
```

---

## 五、命令行使用

```bash
# 检查文件
npx eslint src/

# 检查并自动修复
npx eslint src/ --fix

# 检查特定文件
npx eslint src/App.tsx

# 指定配置文件
npx eslint -c .eslintrc.custom.js src/

# 输出格式
npx eslint src/ --format json
npx eslint src/ --format stylish
```

---

## 六、编辑器集成

### 6.1 VS Code

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
    "vue"
  ],
  "eslint.run": "onType"
}
```

---

## 七、与 Prettier 配合

```bash
npm install --save-dev eslint-config-prettier
```

```javascript
// .eslintrc.js
extends: [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:react/recommended',
  'prettier'  // 必须放在最后，关闭与 Prettier 冲突的规则
]
```

---

## 八、husky + lint-staged

```bash
npm install --save-dev husky lint-staged

# 初始化 husky
npx husky init
```

```json
// package.json
{
  "scripts": {
    "lint": "eslint src/ --fix"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"]
  }
}
```

```bash
# 创建 pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

---

## 九、总结

### ✅ 关键知识点

1. **ESLint**：静态代码分析工具
2. **配置**：Flat Config（新）或 .eslintrc（旧）
3. **规则**：off / warn / error
4. **插件**：TypeScript、React、Vue
5. **编辑器集成**：保存时自动修复
6. **Prettier 配合**：eslint-config-prettier
7. **Git Hooks**：husky + lint-staged

### 🔜 下一章

- 下一章：[Prettier](/web/architecture/code-standards/02-prettier/)
- 上一级：[代码规范](/web/architecture/code-standards/)
