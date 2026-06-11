---
title: "JS 有哪些数据类型？原始类型和对象类型有什么区别？"
---

# JS 有哪些数据类型？原始类型和对象类型有什么区别？

**8 种数据类型：**

| 类型        | 含义                      | typeof 返回                |
| ----------- | ------------------------- | -------------------------- |
| `number`    | 数字（含 NaN、±Infinity） | `'number'`                 |
| `bigint`    | 任意精度整数（123n）      | `'bigint'`                 |
| `string`    | 字符串                    | `'string'`                 |
| `boolean`   | true/false                | `'boolean'`                |
| `null`      | 空值                      | `'object'`（历史遗留 bug） |
| `undefined` | 未定义                    | `'undefined'`              |
| `symbol`    | 唯一值（Symbol()）        | `'symbol'`                 |
| `object`    | 对象/数组/函数/日期/正则… | `'object'` 或 `'function'` |

**原始类型 vs 对象类型（引用类型）：**

```text
┌──────────────────────────────────────────────────────────┐
│ 原始类型（Primitive）                                     │
│ - 存放在 栈（Stack）或直接存变量中                       │
│ - 比较：按"值"比较（=== 比内容）                         │
│ - 不可变："abc" 永远是 "abc"，toUpperCase() 是返回新串   │
│ - 包括：7 种：string/number/bigint/boolean/null/undefined/symbol │
├──────────────────────────────────────────────────────────┤
│ 对象类型（Object / Reference）                            │
│ - 存放在 堆（Heap），变量里存的是"引用/内存地址"         │
│ - 比较：按"引用"比较（两个内容相同的对象 !== 同一个）    │
│ - 可变：可以自由增删属性                                  │
│ - 包括：Object / Array / Function / Date / RegExp / Map / Set …│
└──────────────────────────────────────────────────────────┘
```

**代码示例**：

```js
// ======= 原始类型：按值传递/比较 =======
let a = 10;
let b = a;
a = 20;
console.log(b); // 10（修改 a 不影响 b）

// ======= 对象类型：按引用传递/比较 =======
const obj1 = { x: 1 };
const obj2 = obj1;
obj1.x = 99;
console.log(obj2.x); // 99（指向同一块内存）

console.log({} === {}); // false（不同引用）
console.log([] === []); // false
console.log(NaN === NaN); // false（特殊！用 Number.isNaN）
```

**关于 `typeof null === 'object'`**：
这是 JS 历史上最著名的 bug。在最初的实现里，值用 32 位存储，低 3 位是"类型标签"，对象是 000，而 null 恰好也是全 0，因此被误判为 object。修复会破坏无数网站，所以保留至今。

---
