---
title: "JS 中正则的常用 API？"
---

# JS 中正则的常用 API？

```js
const re = /^[a-z]+(\d+)$/gi;
// 修饰符：g=全局 i=忽略大小写 m=多行 s=.匹配换行 u=Unicode y=粘性

// ===== 字符串方法 =====
"hello123".match(re); // 匹配结果数组（g 模式返回所有匹配，无 g 返回含 groups 的对象）
"hello123".matchAll(re); // 返回迭代器（推荐 g 模式下用）
"hello123".search(re); // 第一次匹配的 index，没匹配 -1
"hello123".replace(re, "X"); // 替换（$1、$&、函数替换都支持）
"a,b;c".split(/[,;]/); // ['a','b','c']

// ===== 正则方法 =====
re.test("hello123"); // true/false
re.exec("hello123"); // { 0:'hello123', 1:'123', index:0, input:'...', groups:{}} }
// ⚠️ 注意：带 g 的正则多次 exec 会从 lastIndex 继续，可能出现"偶现"问题
```

**经典场景**：

```js
// 邮箱（简单版，实际完整邮箱规则很复杂）
/^[\w.+-]+@[\w-]+\.[\w.-]+$/

// 手机号（中国大陆）
/^1[3-9]\d{9}$/

// 替换 $name$ 占位符
"Hello, $name$".replace(/\$(\w+)\$/g, (m, k) => ({ name: "Alice" }[k] || m));

// 具名捕获组（ES2018）
const m = "2024-01-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
// m.groups = { year: '2024', month: '01', day: '15' }
```

---
