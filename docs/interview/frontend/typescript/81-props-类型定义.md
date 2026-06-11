---
title: "Props 类型定义"
---

# Props 类型定义

**Q54: 如何给 React 组件的 Props 标注类型？**

```tsx
// 函数组件 —— 最推荐的方式（不使用 React.FC，避免隐式 children 和 defaultProps 问题）
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

// children 的类型
interface ContainerProps {
  children: React.ReactNode; // ✅ 最通用的 children 类型
}
interface ListProps {
  items: string[];
  renderItem: (item: string, index: number) => React.ReactElement; // 函数作为 children
}

// 事件处理函数
interface InputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
```

**React 中常用的工具类型：**

```ts
// 原生 HTML 属性 —— 复用已有属性类型
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  special: string; // 自定义属性
};

// 复用某个组件的 Props
import { Button } from "antd";
type MyButtonProps = React.ComponentProps<typeof Button>; // 拿到 Button 的所有 Props 类型

// 获取 ref 的类型
const inputRef = useRef<HTMLInputElement>(null);
```
