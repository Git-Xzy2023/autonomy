---
title: "Promise.finally / ES2020 到 ES2023 的重要特性？"
---

# Promise.finally / ES2020 到 ES2023 的重要特性？

**一个快速速览**（挑你实际用过的讲）：

- **ES2020**：`Promise.allSettled`、`??`、`?.`、`BigInt`、`globalThis`、动态 `import()`
- **ES2021**：`Promise.any`、`String.prototype.replaceAll`、`||=` `&&=` `??=`、`WeakRef/FinalizationRegistry`、数字分隔符 `1_000_000`
- **ES2022**：类字段 `class { x = 1; #priv = 2; static y = 3; }`、`obj.at(-1)`（数组/字符串的负索引）、`Object.hasOwn(obj, 'k')`（比 `hasOwnProperty` 更安全）、顶层 `await`
- **ES2023**：`Array.prototype.findLast / findLastIndex`、数组的不可变方法 `toReversed / toSorted / toSpliced / with`

```js
// 实用示例
const arr = [1, 2, 3, 4];
arr.at(-1); // 4（负索引！）
arr.findLast((v) => v % 2); // 3（从后往前找第一个满足）
arr.toReversed(); // [4,3,2,1]（不修改原数组，返回新数组）

// 顶层 await（ES Module）
const config = await fetch("/cfg.json").then((r) => r.json());
export { config };

// 私有字段（真·私有，外部完全不可访问）
class Counter {
  #count = 0;
  inc() {
    return ++this.#count;
  }
}
new Counter().#count; // ❌ SyntaxError
```

---
