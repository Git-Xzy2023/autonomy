---
title: 虚拟 DOM 与 Diff
---

# 虚拟 DOM 与 Diff

> 理解 React 的虚拟 DOM 机制和 Diff 算法，是性能优化的基础。

---

## 一、虚拟 DOM

### 1.1 什么是虚拟 DOM？

```
┌─────────────────────────────────────────┐
│              虚拟 DOM                   │
├─────────────────────────────────────────┤
│                                         │
│  虚拟 DOM = JavaScript 对象             │
│                                         │
│  真实 DOM：                             │
│  <div class="box">Hello</div>           │
│                                         │
│  虚拟 DOM：                             │
│  {                                      │
│    type: 'div',                         │
│    props: {                             │
│      className: 'box',                  │
│      children: 'Hello'                  │
│    }                                    │
│  }                                      │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 为什么需要虚拟 DOM？

```
┌─────────────────────────────────────────┐
│           传统 DOM 操作                 │
├─────────────────────────────────────────┤
│                                         │
│  数据变化 → 直接操作 DOM → 重排重绘     │
│                                         │
│  问题：                                 │
│  ├── DOM 操作昂贵                       │
│  ├── 频繁操作导致性能问题               │
│  └── 手动管理状态复杂                   │
│                                         │
│  虚拟 DOM 解决：                        │
│  数据变化 → 生成新虚拟 DOM              │
│           → Diff 比较                   │
│           → 最小化 DOM 操作             │
│                                         │
└─────────────────────────────────────────┘
```

### 1.3 虚拟 DOM 结构

```typescript
// JSX
const element = (
  <div className="container">
    <h1>Hello</h1>
    <p>World</p>
  </div>
)

// 虚拟 DOM 对象
const virtualDOM = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello'
        }
      },
      {
        type: 'p',
        props: {
          children: 'World'
        }
      }
    ]
  }
}
```

---

## 二、Diff 算法

### 2.1 Diff 的问题

```
┌─────────────────────────────────────────┐
│              Diff 问题                  │
├─────────────────────────────────────────┤
│                                         │
│  两棵树完全比较：O(n³)                  │
│                                         │
│  React 优化：O(n)                       │
│  基于三个假设：                         │
│                                         │
│  1. 不同类型元素产生不同树              │
│  2. 通过 key 识别子元素                 │
│  3. 同层比较                            │
│                                         │
└─────────────────────────────────────────┘
```

### 2.2 Diff 策略

#### 策略 1：不同类型元素

```typescript
// 类型变化：销毁旧树，创建新树
<div>
  <Header />  // 类型变化前
</div>

<div>
  <Footer />  // 类型变化后，Header 被销毁，Footer 被创建
</div>
```

#### 策略 2：同类型元素

```typescript
// 同类型：保留 DOM 节点，只更新属性
<div className="old" title="hello" />
<div className="new" title="hello" />
// 只更新 className，保留 title
```

#### 策略 3：子节点 Diff

```typescript
// 列表更新：通过 key 识别
<ul>
  <li key="1">苹果</li>
  <li key="2">香蕉</li>
  <li key="3">橙子</li>
</ul>

// 在头部插入新元素
<ul>
  <li key="0">葡萄</li>  {/* 新增 */}
  <li key="1">苹果</li>  {/* 通过 key 识别，不重新创建 */}
  <li key="2">香蕉</li>
  <li key="3">橙子</li>
</ul>
```

### 2.3 key 的作用

```typescript
// ❌ 没有使用 key：性能差
function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li>{item.text}</li>  // 使用 index 作为 key
      ))}
    </ul>
  )
}

// ✅ 使用唯一 key：性能好
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  )
}
```

### 2.4 key 的注意事项

```typescript
// ❌ 不要使用 index 作为 key
{items.map((item, index) => (
  <li key={index}>{item.text}</li>
))}

// 问题：当列表顺序变化时，React 无法正确识别元素
// 导致：
// 1. 性能下降（不必要的 DOM 操作）
// 2. 状态错乱（如输入框内容错位）

// ✅ 使用稳定的唯一 ID
{items.map(item => (
  <li key={item.id}>{item.text}</li>
))}

// ✅ 如果列表不会重排序，可以使用 index
// 但建议始终使用唯一 ID
```

---

## 三、渲染流程

### 3.1 React 渲染阶段

```
┌─────────────────────────────────────────┐
│           React 渲染流程                │
├─────────────────────────────────────────┤
│                                         │
│  1. Trigger（触发）                     │
│     ├── setState                       │
│     ├── 父组件重渲染                    │
│     └── Context 变化                    │
│                                         │
│  2. Render（渲染）                      │
│     ├── 计算新虚拟 DOM                  │
│     └── Diff 比较                       │
│                                         │
│  3. Commit（提交）                      │
│     ├── 应用 DOM 变化                   │
│     ├── 执行生命周期/useEffect          │
│     └── 浏览器绘制                      │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Render 阶段

```typescript
function App() {
  const [count, setCount] = useState(0)

  // Render 阶段执行
  console.log('渲染')

  return <div>{count}</div>
}
```

### 3.3 Commit 阶段

```typescript
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Commit 阶段执行（DOM 更新后）
    console.log('DOM 已更新')
  })

  return <div>{count}</div>
}
```

---

## 四、Reconciliation 协调

### 4.1 协调过程

```
┌─────────────────────────────────────────┐
│              协调过程                   │
├─────────────────────────────────────────┤
│                                         │
│  新虚拟 DOM                             │
│       │                                 │
│       ▼                                 │
│  Diff 算法                              │
│       │                                 │
│       ▼                                 │
│  变更列表（updates、inserts、deletes）  │
│       │                                 │
│       ▼                                 │
│  应用到真实 DOM                         │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 协调的优化

```typescript
// 1. 类型相同：复用 DOM 节点
<div className="a" />  →  <div className="b" />
// 只更新 className

// 2. 类型不同：销毁重建
<div />  →  <span />
// 销毁 div，创建 span

// 3. 列表：使用 key 优化
{items.map(item => <Item key={item.id} item={item} />)}
```

---

## 五、Fiber 架构

### 5.1 什么是 Fiber？

```
┌─────────────────────────────────────────┐
│              Fiber 架构                 │
├─────────────────────────────────────────┤
│                                         │
│  React 16+ 引入的新架构                 │
│                                         │
│  特点：                                  │
│  ├── 可中断的渲染                       │
│  ├── 优先级调度                         │
│  ├── 并发模式                           │
│  └── 增量渲染                           │
│                                         │
│  Fiber 节点：                           │
│  ├── type：元素类型                     │
│  ├── props：属性                        │
│  ├── stateNode：真实 DOM                │
│  ├── child：第一个子节点                │
│  ├── sibling：兄弟节点                  │
│  └── return：父节点                     │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Fiber 树

```typescript
// Fiber 节点结构（简化）
{
  type: 'div',
  props: { className: 'container' },
  stateNode: HTMLDivElement,
  child: FiberNode,      // 第一个子节点
  sibling: FiberNode,    // 下一个兄弟节点
  return: FiberNode,     // 父节点
  alternate: FiberNode,  // 旧版本（用于 Diff）
  effectTag: 'UPDATE',   // 副作用标记
  pendingProps: {},
  memoizedProps: {},
  memoizedState: {}
}
```

### 5.3 双缓冲技术

```
┌─────────────────────────────────────────┐
│              双缓冲技术                 │
├─────────────────────────────────────────┤
│                                         │
│  current Fiber 树（当前显示）           │
│       │                                 │
│       │  更新                           │
│       ▼                                 │
│  workInProgress Fiber 树（构建中）      │
│       │                                 │
│       │  完成后替换                     │
│       ▼                                 │
│  current Fiber 树（新显示）             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 六、性能影响

### 6.1 不必要的渲染

```typescript
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveComponent />  {/* count 变化时也会重渲染 */}
    </div>
  )
}
```

### 6.2 优化方案

```typescript
// 1. React.memo
const ExpensiveComponent = memo(function ExpensiveComponent() {
  return <div>...</div>
})

// 2. useMemo 缓存计算结果
const data = useMemo(() => expensiveCalc(), [dep])

// 3. useCallback 缓存函数
const handler = useCallback(() => {}, [dep])

// 4. 虚拟化长列表
import { FixedSizeList } from 'react-window'
```

---

## 七、总结

### ✅ 关键知识点

1. **虚拟 DOM**：JavaScript 对象表示 DOM 结构
2. **Diff 算法**：O(n) 复杂度，基于三个假设
3. **key 的作用**：识别子元素，优化列表渲染
4. **渲染流程**：Trigger → Render → Commit
5. **Fiber 架构**：可中断、优先级调度
6. **双缓冲**：current 和 workInProgress 树

### 🔜 下一章

- 下一章：[memo 与性能优化](/web/react/performance/02-memo/)
- 上一章：[React 进阶特性](/web/react/advanced/)
- 上一级：[React 性能优化](/web/react/performance/)
