---
title: "exports 和 module.exports 的区别"
---

# exports 和 module.exports 的区别

```js
// Node 源码中（lib/internal/modules/cjs/loader.js）简化版：
const module = { exports: {} };
let exports = module.exports; // exports 只是 module.exports 的引用

// 你的代码
exports.foo = "bar"; // ✓ 向共享对象加属性，没问题
module.exports.baz = "qux"; // ✓ 同上
exports = { foo: "bar" }; // ✗ exports 变量被重新赋值，与 module.exports 断联
module.exports = { foo: "bar" }; // ✓ module.exports 整个被替换，正确

// return module.exports;  // 最终返回的是 module.exports
```

核心区别一句话：**`exports` 只是 `module.exports` 的一个引用**，`require` 真正拿到的永远是 `module.exports`。
