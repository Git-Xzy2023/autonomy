---
title: "CSS 工程化工具"
---

# CSS 工程化工具

#### 1. PostCSS

**PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。**

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"), // 自动添加前缀
    require("postcss-preset-env"), // 使用未来 CSS 特性
    require("cssnano"), // 压缩 CSS
  ],
};
```

#### 2. Browserslist

**指定项目需要支持的浏览器范围。**

```json
// package.json 或 .browserslistrc
{
  "browserslist": ["> 1%", "last 2 versions", "not dead", "not ie 11"]
}
```

#### 3. CSS Modules

**使 CSS 类名自动生成唯一标识，避免全局污染。**

```css
/* Button.module.css */
.button {
  background: blue;
  color: white;
}
```

```jsx
// Button.jsx
import styles from "./Button.module.css";

function Button() {
  return <button className={styles.button}>Click me</button>;
  // 渲染为: <button class="Button_button_1x2y3">Click me</button>
}
```

#### 4. CSS-in-JS

**在 JavaScript 中编写 CSS。**

```jsx
// styled-components 示例
import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => (props.primary ? "blue" : "white")};
  color: ${(props) => (props.primary ? "white" : "blue")};
  padding: 10px 20px;
  border-radius: 4px;
`;

function App() {
  return (
    <>
      <Button primary>Primary</Button>
      <Button>Default</Button>
    </>
  );
}
```

---
