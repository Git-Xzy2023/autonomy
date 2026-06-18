---
title: "Transitions 过渡"
---

# Transitions 过渡

**Q1: 什么是 startTransition？**

`startTransition` 是 React 18 提供的 API，用于将状态更新标记为**低优先级**（过渡更新），让高优先级更新（如用户输入）优先处理。

```jsx
import { startTransition } from 'react';

function Search() {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;

    // 高优先级：立即更新输入框
    setInputValue(value);

    // 低优先级：搜索结果更新可以慢一点
    startTransition(() => {
      setSearchResults(heavyFilter(value));
    });
  };

  return (
    <>
      <input value={inputValue} onChange={handleChange} />
      <List items={searchResults} />
    </>
  );
}
```

**Q2: startTransition 解决了什么问题？**

没有 startTransition 时，搜索框输入会卡顿：

```jsx
// ❌ 没有 startTransition
const handleChange = (e) => {
  setInputValue(value);       // 更新输入框
  setSearchResults(filter(value)); // 更新列表（耗时）
  // 两个更新优先级相同，列表渲染会阻塞输入框更新
  // 用户输入感觉卡顿
};

// ✅ 有 startTransition
const handleChange = (e) => {
  setInputValue(value);  // 高优先级：输入框立即更新
  startTransition(() => {
    setSearchResults(filter(value)); // 低优先级：列表可以稍后更新
  });
  // 用户输入流畅，列表异步更新
};
```

**Q3: useTransition 和 startTransition 的区别？**

`useTransition` 是 `startTransition` 的 Hook 版本，额外提供 `isPending` 状态。

```jsx
import { useTransition } from 'react';

function TabSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('home');

  const switchTab = (newTab) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <button onClick={() => switchTab('home')}>首页</button>
      <button onClick={() => switchTab('analytics')}>分析</button>

      {/* isPending 为 true 时显示加载状态 */}
      {isPending && <Spinner />}

      <TabContent tab={tab} />
    </div>
  );
}
```

| 特性       | `startTransition`     | `useTransition`           |
| ---------- | --------------------- | ------------------------- |
| 返回值     | 无                    | `[isPending, startTransition]` |
| isPending  | ❌ 无法获取           | ✅ 可以获取过渡状态       |
| 使用位置   | 任何地方              | 组件内部（Hook）          |
| 场景       | 不需要加载状态        | 需要显示加载状态          |

**Q4: useDeferredValue 和 useTransition 的区别？**

```jsx
// useTransition：从"触发更新"的角度标记低优先级
function Search() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value); // 高优先级
    startTransition(() => {
      setResults(filter(e.target.value)); // 低优先级
    });
  };
}

// useDeferredValue：从"消费值"的角度延迟更新
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // query 变化时，deferredQuery 可能延迟更新

  const results = useMemo(
    () => filter(deferredQuery),
    [deferredQuery]
  );

  const isStale = query !== deferredQuery;
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {results.map(r => <li key={r.id}>{r.name}</li>)}
    </ul>
  );
}
```

| 特性       | `useTransition`           | `useDeferredValue`        |
| ---------- | ------------------------- | ------------------------- |
| 视角       | 产生更新的地方            | 消费值的地方              |
| 控制方式   | 包裹 setState            | 延迟接收 props/state      |
| isPending  | ✅ 有                     | ❌ 需要自己比较           |
| 适用场景   | 可以控制更新来源          | 只能接收值（如子组件）    |

**Q5: 什么时候用 Transition？**

适合 Transition 的场景：
- 搜索框过滤大列表
- Tab 切换
- 路由切换
- 任何"可以慢一点"的更新

不适合 Transition 的场景：
- 用户输入（输入框本身应该是高优先级）
- 动画
- 需要立即响应的交互

```jsx
// ✅ 适合：Tab 切换
function App() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const switchTab = (next) => {
    startTransition(() => setTab(next));
  };

  return (
    <>
      <nav>
        <button onClick={() => switchTab('home')}>Home</button>
        <button onClick={() => switchTab('dashboard')}>Dashboard</button>
      </nav>
      {isPending ? <Spinner /> : <TabContent tab={tab} />}
    </>
  );
}

// ❌ 不适合：输入框值本身
startTransition(() => {
  setInputValue(value); // 输入框应该立即响应
});
```

**Q6: Transition 的底层原理？**

```
用户输入 → setInputValue（SyncLane，高优先级）
                ↓
         立即渲染，更新输入框
                ↓
startTransition → setSearchResults（TransitionLane，低优先级）
                ↓
         如果渲染耗时，React 会：
         1. 开始渲染
         2. 如果有新的高优先级更新到来，中断当前渲染
         3. 先处理高优先级更新
         4. 再回来继续（或重新开始）低优先级渲染
```

---
