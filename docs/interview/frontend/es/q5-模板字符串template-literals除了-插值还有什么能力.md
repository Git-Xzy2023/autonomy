---
title: "模板字符串（Template Literals）除了 `${}` 插值还有什么能力？"
---

# 模板字符串（Template Literals）除了 `${}` 插值还有什么能力？

1. **多行字符串**：直接换行，不需要 `\n`。
2. **嵌套模板**：`${`inner ${x}`}` 合法。
3. **标签模板（Tagged Template）**：函数名后跟模板字符串，会被当作「函数调用」处理，常用于 i18n、SQL、styled-components 等。

```js
function tag(strings, ...values) {
  console.log(strings); // ["Hello ", " !", raw: ...]
  console.log(values);  // ["Alice"]
  return "result";
}
const name = "Alice";
tag`Hello ${name} !`;  // 等价于 tag(["Hello ", " !"], "Alice")

// 一个小应用：自动转义
function html(strings, ...values) {
  return strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? escapeHtml(values[i]) : ""),
    "",
  );
}
```

---
