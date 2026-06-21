---
title: CSS-in-JS（styled-components）
---

# CSS-in-JS（styled-components）

## 一、什么是 CSS-in-JS？

**CSS-in-JS** 是一种将 CSS 写在 JavaScript 中的模式。它利用 JS 的能力实现：

- 组件级样式隔离
- 动态样式（根据 props/state 生成）
- 主题切换
- 自动添加前缀

主流库：

| 库 | 特点 |
|----|------|
| **styled-components** | 最流行，使用模板字符串 |
| **emotion** | 性能好，API 灵活 |
| **stitches** | 接近 Tailwind 的开发体验 |
| **linaria** | 零运行时，编译时提取 |

---

## 二、styled-components 基础

### 1. 安装

```bash
npm install styled-components
```

### 2. 基本用法

```jsx
import styled from 'styled-components';

// 创建样式化组件
const Button = styled.button`
  background: blue;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: darkblue;
  }
`;

// 使用
function App() {
  return <Button>点击我</Button>;
}
```

### 3. 基于 props 动态样式

```jsx
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  padding: 8px 16px;

  &:hover {
    background: ${props => props.primary ? 'darkblue' : 'darkgray'};
  }
`;

<Button primary>主按钮</Button>
<Button>普通按钮</Button>
```

### 4. 继承样式

```jsx
const Button = styled.button`
  padding: 8px 16px;
  border: none;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: blue;
  color: white;
`;

const DangerButton = styled(Button)`
  background: red;
  color: white;
`;
```

### 5. 样式化已有组件

```jsx
const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
);

const StyledLink = styled(Link)`
  color: blue;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
```

---

## 三、主题（Theme）

### 1.ThemeProvider

```jsx
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#3498db',
    success: '#2ecc71',
    danger: '#e74c3c',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>主题按钮</Button>
    </ThemeProvider>
  );
}
```

### 2. 使用主题

```jsx
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md};
`;
```

### 3. 动态切换主题

```jsx
const lightTheme = {
  colors: { bg: '#ffffff', text: '#333333' },
};

const darkTheme = {
  colors: { bg: '#1a1a1a', text: '#f0f0f0' },
};

function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Container>
        <button onClick={() => setIsDark(!isDark)}>
          切换主题
        </button>
      </Container>
    </ThemeProvider>
  );
}
```

---

## 四、高级用法

### 1. `css` 助手函数

```jsx
import styled, { css } from 'styled-components';

const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  ${flexCenter}
  height: 100vh;
`;
```

### 2. `keyframes` 动画

```jsx
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Modal = styled.div`
  animation: ${fadeIn} 0.3s, ${slideUp} 0.4s;
`;
```

### 3. `attrs` 设置属性

```jsx
const Input = styled.input.attrs(props => ({
  type: props.type || 'text',
  size: props.size || '1em',
}))`
  padding: ${props => props.size};
  border: 1px solid #ccc;
  border-radius: 4px;
`;

<Input type="email" placeholder="邮箱" />
<Input type="password" placeholder="密码" size="1.5em" />
```

### 4. 嵌套

```jsx
const Card = styled.div`
  background: white;
  padding: 16px;

  h2 {
    color: #333;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    line-height: 1.6;
  }

  > a {
    color: blue;
    text-decoration: none;
  }
`;
```

---

## 五、性能优化

### 1. 避免在 render 中创建样式组件

```jsx
// ❌ 反模式：每次 render 都创建新组件
function App() {
  const StyledDiv = styled.div`color: red;`;  // 每次都新建
  return <StyledDiv />;
}

// ✅ 推荐：在组件外部定义
const StyledDiv = styled.div`color: red;`;

function App() {
  return <StyledDiv />;
}
```

### 2. 使用 `shouldForwardProp`

```jsx
const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop),
})`
  background: ${props => props.variant === 'primary' ? 'blue' : 'gray'};
  padding: ${props => props.size === 'lg' ? '12px 24px' : '8px 16px'};
`;

// variant 和 size 不会传递到 DOM
<StyledButton variant="primary" size="lg">按钮</StyledButton>
```

### 3. 服务端渲染

```jsx
import { ServerStyleSheet } from 'styled-components';

// 在 SSR 中提取样式
const sheet = new ServerStyleSheet();
const html = renderToString(sheet.collectStyles(<App />));
const styleTags = sheet.getStyleTags();
```

---

## 六、emotion 库对比

emotion 是另一个流行的 CSS-in-JS 库，API 类似但性能更好：

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css`
  background: blue;
  color: white;
  padding: 8px 16px;
`;

<button css={buttonStyle}>按钮</button>
```

### styled API

```jsx
import styled from '@emotion/styled';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
`;
```

---

## 七、零运行时方案：linaria

linaria 在**编译时**将 CSS 提取到单独文件，无运行时开销：

```jsx
import { styled } from '@linaria/react';

const Button = styled.button`
  background: ${props => props.$primary ? 'blue' : 'gray'};
  color: white;
  padding: 8px 16px;
`;
```

编译后生成纯 CSS 文件，性能与原生 CSS 相当。

---

## 八、优缺点

### 优点

- ✅ **组件级隔离**：天然作用域隔离
- ✅ **动态样式**：根据 props/state 生成样式
- ✅ **主题支持**：通过 ThemeProvider 实现
- ✅ **自动前缀**：无需配置 Autoprefixer
- ✅ **代码组织**：样式与组件在一起，便于维护

### 缺点

- ❌ **运行时开销**：动态生成样式有性能损耗
- ❌ **包体积**：库本身有一定体积
- ❌ **学习成本**：需要理解新的 API
- ❌ **SSR 复杂**：需要额外配置服务端渲染
- ❌ **React 生态专属**：不适用于 Vue 等框架

---

## 九、下一步

- 上一章：[CSS Modules](/web/styles/modern/01-css-modules/)
- 下一章：[CSS 新特性](/web/styles/modern/03-new-features/)
