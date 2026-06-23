---
title: Prettier
---

# Prettier

> Prettier 是一个代码格式化工具，统一团队代码风格。

---

## 一、安装与使用

### 1.1 安装

```bash
npm install --save-dev prettier
```

### 1.2 命令行使用

```bash
# 格式化文件
npx prettier --write src/

# 检查是否格式化
npx prettier --check src/

# 格式化特定文件
npx prettier --write src/App.tsx

# 忽略文件
npx prettier --write --ignore-path .prettierignore src/
```

---

## 二、配置

### 2.1 配置文件

```json
// .prettierrc
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 2.2 配置选项说明

| 选项             | 说明                 | 默认值      |
| ---------------- | -------------------- | ----------- |
| `printWidth`     | 每行最大长度         | 80          |
| `tabWidth`       | 缩进空格数           | 2           |
| `useTabs`        | 使用 tab 缩进        | false       |
| `semi`           | 语句末尾分号         | true        |
| `singleQuote`    | 使用单引号           | false       |
| `trailingComma`  | 尾逗号               | "es5"       |
| `bracketSpacing` | 对象大括号空格       | true        |
| `arrowParens`    | 箭头函数参数括号     | "always"    |
| `endOfLine`      | 换行符               | "lf"        |

### 2.3 忽略文件

```
# .prettierignore
node_modules/
dist/
build/
package-lock.json
*.min.js
```

---

## 三、编辑器集成

### 3.1 VS Code

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 四、与 ESLint 配合

### 4.1 安装

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

### 4.2 方式一：eslint-config-prettier（推荐）

```javascript
// .eslintrc.js
extends: [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'prettier'  // 放在最后，关闭冲突规则
]
```

### 4.3 方式二：eslint-plugin-prettier

```javascript
// .eslintrc.js
extends: [
  'plugin:prettier/recommended'  // 包含 config 和 plugin
]
```

---

## 五、格式化示例

### 5.1 格式化前

```javascript
const obj={name:"张三",age:25,address:{city:"北京",street:"朝阳路"}};
function add(a,b){return a+b}
const arr=[1,2,3,4,5].map(x=>x*2).filter(x=>x>5)
```

### 5.2 格式化后

```javascript
const obj = {
  name: '张三',
  age: 25,
  address: { city: '北京', street: '朝阳路' }
}

function add(a, b) {
  return a + b
}

const arr = [1, 2, 3, 4, 5]
  .map(x => x * 2)
  .filter(x => x > 5)
```

---

## 六、总结

### ✅ 关键知识点

1. **Prettier**：代码格式化工具
2. **配置**：.prettierrc 文件
3. **常用选项**：printWidth、tabWidth、semi、singleQuote
4. **编辑器集成**：保存时自动格式化
5. **ESLint 配合**：eslint-config-prettier

### 🔜 下一章

- 下一章：[Git Commit 规范](/web/architecture/code-standards/03-git-commit/)
- 上一章：[ESLint](/web/architecture/code-standards/01-eslint/)
- 上一级：[代码规范](/web/architecture/code-standards/)
