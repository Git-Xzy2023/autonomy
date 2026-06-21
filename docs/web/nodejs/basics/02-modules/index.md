---
title: 模块系统
---

# 模块系统（CommonJS / ESM）

Node.js 支持两种模块系统：**CommonJS**（传统）和 **ES Modules**（现代）。

---

## 一、CommonJS

CommonJS 是 Node.js 默认的模块系统。

### 1. 导出

```javascript
// math.js

// 方式一：module.exports
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

// 方式二：exports（注意不能覆盖 exports 引用）
exports.multiply = (a, b) => a * b;
```

### 2. 导入

```javascript
const { add, subtract, multiply } = require('./math');

console.log(add(1, 2));      // 3
console.log(subtract(3, 1)); // 2
```

### 3. `module.exports` vs `exports`

```javascript
// ❌ 错误：覆盖了 exports 引用
exports = { add: ... };
// 此时 exports 不再指向 module.exports

// ✅ 正确
module.exports = { add: ... };

// ✅ 正确：给 exports 添加属性
exports.add = ...;
```

> 💡 `exports` 是 `module.exports` 的引用，给 `exports` 赋值新对象会断开引用。

---

## 二、ES Modules

### 1. 启用 ESM

在 `package.json` 中添加：

```json
{
  "type": "module"
}
```

或使用 `.mjs` 扩展名。

### 2. 导出

```javascript
// math.mjs

// 命名导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 默认导出（每个模块只能有一个）
export default {
  add,
  subtract,
};
```

### 3. 导入

```javascript
// 命名导入
import { add, subtract } from './math.mjs';

// 默认导入
import math from './math.mjs';

// 混合导入
import math, { add } from './math.mjs';

// 全部导入
import * as math from './math.mjs';

// 动态导入
const math = await import('./math.mjs');
```

---

## 三、CommonJS vs ESM 对比

| 特性 | CommonJS | ESM |
|------|----------|-----|
| **语法** | `require` / `module.exports` | `import` / `export` |
| **加载时机** | 运行时（动态） | 编译时（静态） |
| **是否支持 Tree-shaking** | ❌ | ✅ |
| **顶层 `await`** | ❌ | ✅ |
| **`this` 值** | `module.exports` | `undefined` |
| **`__dirname` / `__filename`** | ✅ 内置 | ❌ 需自行实现 |
| **循环依赖** | 可能得到未完成对象 | 通过引用支持 |
| **文件扩展名** | `.js` / `.cjs` | `.mjs` 或 `"type": "module"` |

---

## 四、ESM 中的 `__dirname` 替代

ESM 中没有 `__dirname` 和 `__filename`，需要用 `import.meta.url` 实现：

```javascript
// ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);
console.log(__filename);
```

---

## 五、模块加载机制

### CommonJS 加载过程

1. **解析路径**：相对路径、绝对路径、`node_modules`
2. **检查缓存**：`require.cache` 中是否已加载
3. **编译执行**：包装成函数 `(function(exports, require, module, __filename, __dirname) { ... })`
4. **缓存结果**：缓存 `module.exports`

```javascript
// 查看缓存
console.log(require.cache);

// 删除缓存（用于热重载）
delete require.cache[require.resolve('./math')];
```

### 模块查找规则

```javascript
require('./math');
// 查找顺序：
// 1. ./math（无扩展名）
// 2. ./math.js
// 3. ./math.json
// 4. ./math.node
// 5. ./math/index.js（如果是目录）
// 6. ./math/package.json 的 main 字段
```

### `node_modules` 查找

```javascript
require('express');
// 查找顺序：
// 1. ./node_modules/express
// 2. ../node_modules/express
// 3. ../../node_modules/express
// 4. 直到根目录
```

---

## 六、循环依赖

### CommonJS 循环依赖

```javascript
// a.js
console.log('a 开始');
exports.aVar = 'a';
const b = require('./b');
console.log('a 中 b =', b.bVar);

// b.js
console.log('b 开始');
exports.bVar = 'b';
const a = require('./a');  // 此时 a 只执行了一半
console.log('b 中 a =', a);  // { aVar: 'a' }
```

输出：
```
a 开始
b 开始
b 中 a = { aVar: 'a' }
a 中 b = b
```

> ⚠️ CommonJS 循环依赖可能得到**未完成**的对象。

### ESM 循环依赖

ESM 通过**引用**支持循环依赖，但也不能在模块完全加载前使用对方的值。

---

## 七、package.json 的 `exports` 字段

`exports` 定义了包的入口和导出规则：

```json
{
  "name": "my-package",
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js",
    "./package.json": "./package.json"
  }
}
```

使用：

```javascript
import myPackage from 'my-package';           // ./dist/index.js
import { utils } from 'my-package/utils';     // ./dist/utils.js
```

### 条件导出

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

---

## 八、`require` 的动态加载

```javascript
// 动态加载
const moduleName = './modules/' + name;
const module = require(moduleName);

// 条件加载
if (process.env.NODE_ENV === 'production') {
  const prodConfig = require('./config/prod');
} else {
  const devConfig = require('./config/dev');
}
```

---

## 九、最佳实践

1. **新项目优先使用 ESM**：未来趋势，支持 Tree-shaking
2. **库开发同时支持两种**：通过 `exports` 字段
3. **避免循环依赖**：重构代码结构
4. **使用 `package.json` 的 `exports`**：控制公开 API

---

## 十、下一步

- 上一章：[入门与安装](/web/nodejs/basics/01-intro/)
- 下一章：[npm 与包管理](/web/nodejs/basics/03-npm/)
