---
title: "React 中的 key 有什么作用"
---

# React 中的 key 有什么作用

**Q1: React 中的 key 有什么作用？**

`key` 是 React 用来识别列表中哪些元素发生了变化、添加或删除的**特殊属性**。它帮助 React 的 Diff 算法高效地更新列表。

```jsx
// 列表渲染必须加 key
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**Q2: 为什么不能用 index 作为 key？**

当列表顺序会变化（插入、删除、排序）时，用 `index` 作为 key 会导致：

1. **性能下降**：React 无法正确识别哪些元素变化，导致不必要的 DOM 操作。
2. **状态错乱**：如果列表项是组件且有自己的 state，key 变化会导致组件被销毁重建，state 丢失。

```jsx
// ❌ 危险：用 index 作为 key
function List({ items }) {
  return items.map((item, index) => (
    <InputRow key={index} /> // 如果在头部插入新项，所有 index 都变了
  ));
}

// 场景：在列表头部插入新元素
// 之前：[A(0), B(1), C(2)]
// 之后：[D(0), A(1), B(2), C(3)]
// React 会认为 key=0 的从 A 变成 D，key=1 的从 B 变成 A...
// 导致所有组件都"更新"而不是只新增一个

// ✅ 正确：用唯一且稳定的 id
function List({ items }) {
  return items.map(item => (
    <InputRow key={item.id} />
  ));
}
```

**Q3: 什么时候可以用 index 作为 key？**

满足以下**所有条件**时，用 index 是安全的：

1. 列表项不会重新排序
2. 列表项不会被删除
3. 列表项没有自己的 state（或 state 不依赖于位置）
4. 列表不会在中间插入新项

```jsx
// ✅ 静态展示列表，用 index 没问题
function StaticList() {
  const items = ['首页', '关于', '联系'];
  return items.map((item, index) => (
    <li key={index}>{item}</li>
  ));
}
```

**Q4: key 相同会怎样？**

如果列表中有相同的 key，React 会报警告，并且可能导致：

- 状态错乱（React 认为是同一个组件，复用 state）
- 渲染异常

```jsx
// ❌ key 重复
function BadList() {
  return [1, 2, 2, 3].map(n => <div key={n}>{n}</div>);
  // Warning: Encountered two children with the same key "2".
}
```

**Q5: key 是不是必须全局唯一？**

不是。`key` 只需要在**兄弟节点**中唯一即可，不同列表之间可以有相同的 key。

```jsx
function App() {
  return (
    <div>
      {/* 这两个列表的 key 可以重复 */}
      <ul>
        {todos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
      <ul>
        {doneTodos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
    </div>
  );
}
```

---
