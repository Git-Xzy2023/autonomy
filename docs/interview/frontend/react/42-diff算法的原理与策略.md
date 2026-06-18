---
title: "Diff 算法的原理与策略"
---

# Diff 算法的原理与策略

**Q1: 什么是 Diff 算法？**

Diff 算法是 React 用来**对比新旧虚拟 DOM 树**，找出最小变更集的算法。

树的最小 diff 复杂度是 O(n³)，React 通过三个假设将其降到 **O(n)**：

1. **不同类型的元素产生不同的树**（类型不同直接替换）
2. **同层节点比较**（不跨层比较）
3. **列表元素通过 key 标识**（同层列表通过 key 复用）

**Q2: Diff 的三种策略详解**

**策略 1：不同类型直接替换**

```jsx
// 旧：<div>
// 新：<span>
// → 销毁 div 及其子树，新建 span
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
// Counter 组件会被销毁重建，state 丢失
```

**策略 2：同层比较**

```jsx
// 旧：
<div>
  <Header />
  <Content />
  <Footer />
</div>

// 新：
<div>
  <Header />
  <Content />
  <Sidebar />  {/* Footer 变成 Sidebar */}
</div>

// Diff 只在同一层级比较：
// - div === div → 保留
// - Header === Header → 保留
// - Content === Content → 保留
// - Footer → Sidebar → 销毁 Footer，新建 Sidebar
// 不会跨层移动节点
```

**策略 3：列表用 key 标识**

```jsx
// 旧列表：
<li key="A">A</li>
<li key="B">B</li>
<li key="C">C</li>

// 新列表（B 删除）：
<li key="A">A</li>
<li key="C">C</li>

// 有 key：React 知道 B 被删除，A 和 C 保留
// 无 key：React 按位置比较，认为 C 的内容变成了 B 的内容，最后一个被删除
```

**Q3: tree diff（树级比较）的过程？**

React 以**深度优先**遍历虚拟 DOM 树，逐层比较。

```
       旧树                    新树
        div                     div        ← 同类型，继续比较子节点
       / | \                   / | \
     h1  p  ul               h1  p  ul     ← 同类型，继续比较
     |   |   |               |   |   |
    ... ... li              ... ... li     ← 逐个比较属性和子节点

遍历顺序：div → h1 → p → ul → li → ...
```

**Q4: component diff（组件级比较）的过程？**

1. 同类型组件：继续比较渲染出的元素
2. 不同类型组件：直接替换（销毁旧的，创建新的）
3. 同类型组件可通过 `shouldComponentUpdate` 跳过渲染

```jsx
// 同类型组件：比较 render 结果
<Counter value={1} />  →  <Counter value={2} />
// Counter 类型相同，继续比较 render 输出

// 不同类型组件：直接替换
<Counter />  →  <Timer />
// Counter 被销毁（触发 componentWillUnmount）
// Timer 被创建（触发 constructor → componentDidMount）
```

**Q5: element diff（元素级比较）的过程？**

同层级的子元素比较，有三种操作：**插入、删除、移动**。

```jsx
// 无 key 的情况（按位置比较）：
旧：A B C D
新：B A D E
// React 认为：
// 位置 0：A → B（更新）
// 位置 1：B → A（更新）
// 位置 2：C → D（更新）
// 位置 3：D → E（更新）
// 所有元素都"更新"了，性能差

// 有 key 的情况：
旧：A(key=1) B(key=2) C(key=3) D(key=4)
新：B(key=2) A(key=1) D(key=4) E(key=5)
// React 通过 key 知道：
// A、B 位置交换（移动）
// C 删除
// D 位置变化（移动）
// E 新增
// 只做必要的移动和增删，性能好
```

**Q6: React 的 Diff 算法有什么局限？**

1. **不能跨层级移动**：如果元素从一层移到另一层，会被当作删除+创建，而不是移动。

```jsx
// 旧：
<div>
  <p>Hello</p>  {/* p 在 div 下 */}
</div>

// 新：
<div>
  <span>
    <p>Hello</p>  {/* p 移到了 span 下 */}
  </span>
</div>

// React 不会认为 p 是"移动"了
// 而是认为旧的 p 被删除，新的 p 被创建
```

2. **列表 key 必须稳定**：key 变化会导致组件重建。

**Q7: Fiber 架构对 Diff 有什么影响？**

React 16 的 Fiber 架构将 Diff 过程变为**可中断、可恢复**的：

```
旧架构（Stack Reconciler）：
  Diff 过程同步执行，不能中断
  大型应用可能卡顿（掉帧）

新架构（Fiber Reconciler）：
  Diff 过程拆分为多个小任务
  每个 Fiber 节点是一个工作单元
  可以被优先级更高的任务打断
  打断后可以恢复继续
```

---
