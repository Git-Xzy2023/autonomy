---
title: "命名捕获组（Named Capture Groups，ES2018）是什么？"
---

# 命名捕获组（Named Capture Groups，ES2018）是什么？

```js
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = re.exec("2024-05-20");
match.groups; // { year: "2024", month: "05", day: "20" }

// 结合解构更优雅
const { groups: { year, month } } = re.exec("2024-05-20");
```

同时期还加了：

- **Lookbehind**（后行断言）：`(?<=...)` 肯定后行、`(?<!...)` 否定后行；
- **Unicode 属性转义**：`\p{...}`，比如匹配任何中文：`/\p{Script=Han}+/u`；
- **`s` 标志（dotAll）**：让 `.` 也能匹配换行符。

---
