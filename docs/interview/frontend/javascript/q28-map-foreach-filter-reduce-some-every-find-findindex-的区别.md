---
title: "`map / forEach / filter / reduce / some / every / find / findIndex` 的区别？"
---

# `map / forEach / filter / reduce / some / every / find / findIndex` 的区别？

| 方法                   | 返回值                       | 是否短路                      | 常见用法                 |
| ---------------------- | ---------------------------- | ----------------------------- | ------------------------ |
| `arr.map(fn)`          | **新数组**（长度相同）       | 否                            | 变换每个元素             |
| `arr.forEach(fn)`      | `undefined`                  | 否（return 只是跳出当前回调） | 纯副作用                 |
| `arr.filter(fn)`       | **新数组**（只保留 true 的） | 否                            | 筛选                     |
| `arr.reduce(fn, init)` | **任意值**                   | 否                            | 累积、求和、转对象、分组 |
| `arr.some(fn)`         | `boolean`                    | ✅ 第一个 true 就返回         | "至少一个满足？"         |
| `arr.every(fn)`        | `boolean`                    | ✅ 第一个 false 就返回        | "全部满足？"             |
| `arr.find(fn)`         | 找到的元素 或 `undefined`    | ✅                            | 找第一个满足的元素       |
| `arr.findIndex(fn)`    | index 或 `-1`                | ✅                            | 找第一个满足的索引       |

**`reduce` 万能用法**：

```js
const nums = [1, 2, 3, 4];

// 1. 求和
nums.reduce((sum, n) => sum + n, 0); // 10

// 2. 数组 → 对象
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];
users.reduce((acc, u) => {
  acc[u.id] = u.name;
  return acc;
}, {});
// { '1': 'A', '2': 'B' }

// 3. 数组去重
[1, 2, 2, 3, 3, 3].reduce(
  (acc, n) => (acc.includes(n) ? acc : [...acc, n]),
  [],
);
// （当然，用 [...new Set(arr)] 更简单）

// 4. 合并多个 Promise（按顺序等待）
[() => f1(), () => f2(), () => f3()].reduce(
  (chain, fn) => chain.then(fn),
  Promise.resolve(),
);
```

---
