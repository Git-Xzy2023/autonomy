---
title: "useLayoutEffect 与 useEffect 的区别"
---

# useLayoutEffect 与 useEffect 的区别

**Q1: useLayoutEffect 和 useEffect 有什么区别？**

| 特性         | `useEffect`                    | `useLayoutEffect`              |
| ------------ | ------------------------------ | ------------------------------ |
| 执行时机     | 浏览器绘制**之后**（异步）     | DOM 更新后、绘制**之前**（同步）|
| 是否阻塞绘制 | ❌ 不阻塞                      | ✅ 阻塞                        |
| 适用场景     | 大多数副作用                   | 读取/修改 DOM 布局             |
| 性能影响     | 小                             | 大（慎用）                     |

```
React 更新 DOM
  ↓
useLayoutEffect 执行 ← 同步，阻塞
  ↓
浏览器绘制屏幕
  ↓
useEffect 执行 ← 异步，不阻塞
```

**Q2: 什么时候用 useLayoutEffect？**

当需要**在用户看到画面之前**读取 DOM 布局并同步修改样式时，避免画面闪烁。

```jsx
// 场景：tooltip 定位，需要先测量元素位置
function Tooltip({ targetRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return;

    // 读取目标元素位置
    const rect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // 同步设置位置，用户不会看到闪烁
    setPosition({
      top: rect.bottom + 8,
      left: rect.left + (rect.width - tooltipRect.width) / 2,
    });
  }, [targetRef]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        visibility: position.top === 0 ? 'hidden' : 'visible',
      }}
    >
      {children}
    </div>
  );
}
```

**Q3: 如果用 useEffect 会怎样？**

```jsx
// 用 useEffect 的问题：画面闪烁
function Tooltip({ targetRef }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom, left: rect.left });
  }, []);

  // 用户会看到：
  // 1. tooltip 出现在 (0, 0) 位置
  // 2. 闪一下后跳到正确位置

  return <div style={{ position: 'fixed', ...position }}>Tooltip</div>;
}
```

**Q4: useLayoutEffect 在 SSR 中有什么问题？**

在服务端渲染时，`useLayoutEffect` 会报警告，因为服务端没有 DOM。

```jsx
// SSR 中会警告：
// Warning: useLayoutEffect does nothing on the server

// 解决方案：SSR 时用 useEffect 替代
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function MyComponent() {
  useIsomorphicLayoutEffect(() => {
    // ...
  }, []);
}
```

**Q5: useInsertionEffect 又是什么？**

React 18 新增的 Hook，在 DOM 变更**之前**执行，主要用于 CSS-in-JS 库注入样式。

```
React 准备更新 DOM
  ↓
useInsertionEffect 执行 ← 注入样式
  ↓
React 更新 DOM
  ↓
useLayoutEffect 执行
  ↓
浏览器绘制
  ↓
useEffect 执行
```

```jsx
// 主要给 styled-components / emotion 等库使用
// 普通业务代码不需要用
useInsertionEffect(() => {
  const styleTag = document.createElement('style');
  styleTag.textContent = `.my-class { color: red; }`;
  document.head.appendChild(styleTag);
  return () => styleTag.remove();
}, []);
```

---
