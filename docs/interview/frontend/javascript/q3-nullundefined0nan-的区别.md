---
title: "`null`、`undefined`、`''`、`0`、`NaN` 的区别？"
---

# `null`、`undefined`、`''`、`0`、`NaN` 的区别？

| 值          | 含义            | `Boolean()` | `Number()` | `== null` | `=== null` |
| ----------- | --------------- | ----------- | ---------- | --------- | ---------- |
| `null`      | "故意的空值"    | false       | 0          | true      | true       |
| `undefined` | "未赋值/不存在" | false       | NaN        | true      | false      |
| `''`        | 空字符串        | false       | 0          | false     | false      |
| `0`         | 数字零          | false       | 0          | false     | false      |
| `NaN`       | 非数字          | false       | NaN        | false     | false      |

**使用习惯**：

- 业务上用 `null` 表示"有值但为空"，用 `undefined` 表示"从未赋值"。
- **判断"值是否存在"**：`x == null` 同时覆盖 null 和 undefined，推荐。
- **判断是否为空字符串**：`!x && x !== 0 && x !== false`，或用 `??`（空值合并）：`x ?? defaultVal`。

---
