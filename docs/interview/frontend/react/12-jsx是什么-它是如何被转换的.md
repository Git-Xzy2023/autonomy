---
title: "JSX 是什么？它是如何被转换的？"
---

# JSX 是什么？它是如何被转换的？

**Q1: 什么是 JSX？**

JSX（JavaScript XML）是 JavaScript 的语法扩展，允许在 JS 代码中编写类似 HTML 的标记。它不是模板语言，而是 `React.createElement` 的语法糖。

```jsx
// JSX 语法
const element = <h1 className="title">Hello, {name}!</h1>;

// 等价的 React.createElement 调用
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello, ',
  name,
  '!'
);
```

**Q2: JSX 是如何被转换的？**

JSX 需要经过编译工具（Babel 或 TypeScript）转换为浏览器可识别的 JavaScript：

```
JSX 代码
  ↓ Babel (@babel/preset-react) 或 TypeScript
  ↓ React.createElement(...) 调用
  ↓ 返回 React Element 对象（虚拟 DOM 节点）
React Element 树
  ↓ ReactDOM.render / createRoot().render()
真实 DOM
```

**转换示例：**

```jsx
// 输入 JSX
function App() {
  return (
    <div className="container">
      <Header title="Hello" />
      <p>World</p>
    </div>
  );
}

// 转换后（旧版转换）
function App() {
  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(Header, { title: 'Hello' }),
    React.createElement('p', null, 'World')
  );
}

// React 17+ 的新版转换（无需引入 React）
import { jsx as _jsx } from 'react/jsx-runtime';
function App() {
  return _jsx('div', {
    className: 'container',
    children: [
      _jsx(Header, { title: 'Hello' }),
      _jsx('p', { children: 'World' })
    ]
  });
}
```

**Q3: JSX 中的表达式嵌入 `{}` 有什么规则？**

`{}` 内可以放任何合法的 JavaScript 表达式，但不能放语句（如 `if`、`for`）。

```jsx
function Example({ user, items }) {
  return (
    <div>
      {/* ✅ 变量 */}
      <h1>{user.name}</h1>

      {/* ✅ 表达式 */}
      <p>{user.age + 1}</p>

      {/* ✅ 三元运算 */}
      <span>{user.isAdmin ? '管理员' : '普通用户'span>

      {/* ✅ 函数调用 */}
      <time>{formatDate(user.createdAt)}</time>

      {/* ✅ 数组 map（返回元素列表） */}
      <ul>{items.map(it => <li key={it.id}>{it.name}</li>)}ul>

      {/* ❌ 语句不能直接放进来 */}
      {/* {if (user) { return <User /> }} */}

      {/* ✅ 用三元代替 if */}
      {user ? <User data={user} /> : <Empty />}
    </div>
  );
}
```

**Q4: JSX 与 HTML 的主要区别？**

::: v-pre
| 特性         | HTML                         | JSX                              |
| ------------ | ---------------------------- | -------------------------------- |
| `class` 属性 | `<div class="foo">`          | `<div className="foo">`          |
| `for` 属性   | `<label for="id">`           | `<label htmlFor="id">`           |
| style 属性   | `style="color: red;"` 字符串 | `style={{ color: 'red' }}` 对象  |
| 事件         | `onclick="fn()"` 字符串      | `onClick={fn}` 函数              |
| 自闭合标签   | `<br>` 可不闭合              | `<br />` 必须闭合                |
| 布尔属性     | `<input disabled>`           | `<input disabled={true} />`      |
| 注释         | `<!-- -->`                   | `{/* */}`                         |
:::

---
