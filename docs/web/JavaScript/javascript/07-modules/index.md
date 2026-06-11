---
title: 模块化
---

# 模块化

> **模块化**是将代码拆分成独立、可复用的模块，提高代码的可维护性和可扩展性。

---

## 一、模块化发展历程

### 1. 全局变量时代（ES5 之前）

```javascript
// moduleA.js
var moduleA = {
  name: 'Module A',
  greet: function() {
    console.log('Hello from ' + this.name);
  }
};

// moduleB.js
var moduleB = {
  name: 'Module B',
  sayGoodbye: function() {
    console.log('Goodbye from ' + this.name);
  }
};

// 问题：全局命名空间污染
```

### 2. IIFE（立即执行函数表达式）

```javascript
// moduleA.js
var moduleA = (function() {
  var privateVar = 'I am private';
  
  return {
    name: 'Module A',
    greet: function() {
      console.log('Hello from ' + this.name);
      console.log(privateVar);
    }
  };
})();

// 优点：创建独立作用域，避免全局污染
// 缺点：手动管理依赖关系
```

### 3. CommonJS（Node.js）

```javascript
// moduleA.js
var privateVar = 'I am private';

module.exports = {
  name: 'Module A',
  greet: function() {
    console.log('Hello from ' + this.name);
  }
};

// moduleB.js
var moduleA = require('./moduleA');
moduleA.greet();

// 特点：同步加载，适用于服务端
```

### 4. AMD（异步模块定义）

```javascript
// 使用 RequireJS
define(['moduleA'], function(moduleA) {
  return {
    name: 'Module B',
    greet: function() {
      moduleA.greet();
      console.log('Hello from Module B');
    }
  };
});

// 特点：异步加载，适用于浏览器
```

### 5. ES Modules（ES6+）

```javascript
// moduleA.js
export const name = 'Module A';
export function greet() {
  console.log('Hello from ' + name);
}

// moduleB.js
import { name, greet } from './moduleA.js';
greet();

// 特点：静态导入，支持 tree-shaking
```

---

## 二、ES Modules 详解

### 1. 导出（Export）

```javascript
// 命名导出
export const name = 'Alice';
export const age = 25;

export function greet() {
  return 'Hello!';
}

export class Person {
  constructor(name) {
    this.name = name;
  }
}

// 默认导出
export default function() {
  return 'Default export';
}

// 导出重命名
function myFunction() {}
export { myFunction as exportedFunction };
```

### 2. 导入（Import）

```javascript
// 导入默认导出
import myDefault from './module.js';

// 导入命名导出
import { name, age, greet } from './module.js';

// 导入并重命名
import { name as userName } from './module.js';

// 导入所有（命名空间导入）
import * as module from './module.js';
console.log(module.name);

// 仅导入模块（不使用导出）
import './module.js';
```

### 3. 动态导入（ES2020）

```javascript
// 异步动态导入
async function loadModule() {
  const module = await import('./module.js');
  console.log(module.name);
}

// 条件导入
if (condition) {
  const module = await import('./module.js');
}

// 在非模块脚本中使用
import('./module.js')
  .then(module => console.log(module.name))
  .catch(error => console.error(error));
```

### 4. 模块的特点

```javascript
// 1. 严格模式（自动启用）
// 'use strict' 不需要手动添加

// 2. 模块级作用域
// 模块内的变量不会污染全局命名空间

// 3. 静态分析（支持 tree-shaking）
// 导入语句必须在顶层
// 导入路径必须是字符串字面量

// 4. this 指向 undefined
console.log(this); // undefined（在模块中）
```

---

## 三、模块模式对比

| 特性 | CommonJS | AMD | ES Modules |
|------|----------|-----|------------|
| **加载方式** | 同步 | 异步 | 静态（编译时） |
| **适用环境** | Node.js | 浏览器 | 两者皆可 |
| **依赖处理** | 运行时解析 | 依赖前置 | 编译时解析 |
| **Tree-shaking** | 不支持 | 不支持 | 支持 |
| **动态导入** | require() | require([], callback) | import() |

---

## 四、实际应用

### 1. 创建工具模块

```javascript
// utils/math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;
```

### 2. 创建数据模块

```javascript
// data/users.js
export const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
];

export function getUserById(id) {
  return users.find(user => user.id === id);
}
```

### 3. 创建组件模块

```javascript
// components/Button.js
export class Button {
  constructor(text) {
    this.text = text;
  }
  
  render() {
    const button = document.createElement('button');
    button.textContent = this.text;
    return button;
  }
}
```

### 4. 主入口文件

```javascript
// main.js
import { add, PI } from './utils/math.js';
import { users, getUserById } from './data/users.js';
import { Button } from './components/Button.js';

console.log(add(2, 3)); // 5
console.log(PI); // 3.14159
console.log(getUserById(1)); // { id: 1, name: 'Alice', age: 25 }

const button = new Button('Click me');
document.body.appendChild(button.render());
```

---

## 五、打包工具

### 1. Webpack

```javascript
// webpack.config.js
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: './dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
```

### 2. Rollup

```javascript
// rollup.config.js
export default {
  input: './src/main.js',
  output: {
    file: './dist/bundle.js',
    format: 'es'
  }
};
```

### 3. Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist'
  }
});
```

---

## 六、Node.js 中的模块

### 1. CommonJS 模块

```javascript
// 导出
module.exports = {
  name: 'Module',
  greet: function() {
    console.log('Hello');
  }
};

// 导入
const module = require('./module');
```

### 2. ES Modules 在 Node.js

```javascript
// package.json
{
  "type": "module"
}

// 现在可以使用 ES Modules
import { name } from './module.js';
```

---

## 七、本章小结与最佳实践

✅ **推荐做法**：

1. **使用 ES Modules**（`import`/`export`）进行模块化开发；
2. **将代码按功能拆分**为独立模块；
3. **使用默认导出**导出主要功能，命名导出导出辅助功能；
4. **使用动态导入**实现按需加载；
5. **配合打包工具**（Webpack/Rollup/Vite）进行构建；
6. **保持模块职责单一**，每个模块只做一件事。

❌ **避免做法**：

1. 创建过大的模块（超过 200 行）；
2. 在模块中使用全局变量；
3. 循环依赖（A 依赖 B，B 依赖 A）；
4. 在非模块脚本中使用 `import`（需要设置 `type="module"`）；
5. 混合使用 CommonJS 和 ES Modules。

下一章我们将学习 **JavaScript 最佳实践**，掌握编写高质量代码的技巧。