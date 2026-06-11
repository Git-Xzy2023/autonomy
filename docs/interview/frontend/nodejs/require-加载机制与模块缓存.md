---
title: "require 加载机制与模块缓存"
---

# require 加载机制与模块缓存

```
require('./a.js') 第一次调用流程：
1. Module._resolveFilename('./a.js') → '/project/a.js'
2. Module._cache['/project/a.js'] 不存在
3. new Module(id, parent)
4. module.load() → 读取文件 → 编译执行 → module.exports = {...}
5. Module._cache['/project/a.js'] = module
6. return module.exports

第二次 require('./a.js')：
→ 直接命中 Module._cache，返回 module.exports（同一个对象）
```

**模块缓存带来的单例特性：**

```js
// counter.js
let n = 0;
module.exports = {
  inc: () => ++n,
  get: () => n,
};

// a.js
const c = require("./counter");
c.inc();

// b.js
const c = require("./counter");
console.log(c.get()); // 1（同一实例）
```

**清除缓存（测试场景用）：**

```js
delete require.cache[require.resolve("./counter")];
```

**循环依赖（Circular Dependency）：**

```js
// a.js
exports.name = "A";
const b = require("./b");
console.log("a.js", b); // { name: 'B' }
exports.other = "X";

// b.js
exports.name = "B";
const a = require("./a");
console.log("b.js", a); // { name: 'A' }  只拿到 a.js 执行到一半时的 exports
```

Node.js 的循环依赖不会报错，但由于代码执行顺序，被引用的模块可能只暴露了「已经执行到的那一部分」`exports`，后续属性拿不到。ESM 的循环依赖策略不同，由于绑定是 live 的，后面补上的属性在运行时可以访问到。
