---
title: "模板字符串（Template Literals）能做什么？标签模板（Tagged Template）？"
---

# 模板字符串（Template Literals）能做什么？标签模板（Tagged Template）？

```js
const name = "Alice";
const msg = `Hello, ${name.toUpperCase()}! 1+1=${1 + 1}`; // 表达式可以是任意 JS

// 多行字符串
const html = `
  <div>
    <p>${name}</p>
  </div>
`;

// 标签模板：自定义如何把模板"拼起来"
function highlight(strings, ...values) {
  // strings = ['Hi ', ', you are ', ' years old']
  // values  = ['Alice', 30]
  return strings.reduce(
    (acc, s, i) => acc + s + (values[i] ? `<b>${values[i]}</b>` : ""),
    "",
  );
}
highlight`Hi ${"Alice"}, you are ${30} years old`;
// 'Hi <b>Alice</b>, you are <b>30</b> years old'

// 实战应用：styled-components、SQL 模板、i18n、安全 HTML 转义
```

---
