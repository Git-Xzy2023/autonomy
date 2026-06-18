---
title: "React 性能优化的常见手段"
---

# React 性能优化的常见手段

**Q1: React 性能优化的常见手段有哪些？**

从不同层面优化：

```
组件层面：
  - React.memo 避免不必要的重渲染
  - useMemo/useCallback 缓存值和函数
  - 虚拟列表（react-window）
  - 懒加载（React.lazy）

状态层面：
  - 状态下放（state colocation）
  - 拆分 Context
  - 使用 selector 精细订阅

构建层面：
  - 代码分割
  - Tree Shaking
  - 压缩打包

网络层面：
  - 按需加载
  - 预加载/预获取
  - CDN
```

**Q2: 什么是"状态下放"（State Colocation）？**

把状态放到离使用它最近的组件中，避免不必要的重渲染。

```jsx
// ❌ 状态放太高：输入时整个列表都重渲染
function App() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);

  return (
    <div>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <ExpensiveList items={items} /> {/* keyword 变化时也重渲染 */}
    </div>
  );
}

// ✅ 状态下放：输入框单独成组件
function App() {
  const [items, setItems] = useState([]);
  return (
    <div>
      <SearchInput />
      <ExpensiveList items={items} />
    </div>
  );
}

function SearchInput() {
  const [keyword, setKeyword] = useState(''); // 状态在子组件
  return <input value={keyword} onChange={e => setKeyword(e.target.value)} />;
}
```

**Q3: 如何避免子组件不必要的重渲染？**

```jsx
// 1. React.memo：浅比较 props
const Child = React.memo(({ data, onClick }) => {
  console.log('Child render');
  return <div onClick={onClick}>{data.value}</div>;
});

// 2. useMemo：缓存对象/数组 props
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ 每次渲染创建新对象，Child 每次都重渲染
  const data = { value: 'hello' };

  // ✅ 引用稳定
  const data = useMemo(() => ({ value: 'hello' }), []);

  // 3. useCallback：缓存函数 props
  // ❌ 每次渲染创建新函数
  const handleClick = () => console.log('click');

  // ✅ 引用稳定
  const handleClick = useCallback(() => console.log('click'), []);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child data={data} onClick={handleClick} />
    </div>
  );
}
```

**Q4: 虚拟列表是什么？如何使用？**

当列表有大量数据（1000+）时，只渲染可视区域内的元素。

```jsx
import { FixedSizeList } from 'react-window';

// 只渲染可见区域的 10 条，而不是全部 10000 条
function BigList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}        // 容器高度
      width="100%"        // 容器宽度
      itemCount={items.length}  // 总条数
      itemSize={50}       // 每行高度
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Q5: 如何分析 React 应用的性能？**

```jsx
// 1. React DevTools Profiler
// 浏览器扩展 → Profiler 标签 → 录制 → 分析渲染时间

// 2. React.Profiler 组件
<Profiler id="App" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} 耗时 ${actualDuration}ms`);
}}>
  <App />
</Profiler>

// 3. Chrome Performance 面板
// 录制 → 查看 Flame Chart → 找到长任务

// 4. useRenderCount（调试用）
function useRenderCount() {
  const count = useRef(0);
  count.current++;
  console.log(`渲染次数：${count.current}`);
}
```

**Q6: React 18 的并发特性如何帮助性能优化？**

```jsx
import { startTransition, useDeferredValue } from 'react';

// 1. startTransition：标记低优先级更新
function Search() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value); // 高优先级：立即更新输入框

    startTransition(() => {
      setResults(filter(input)); // 低优先级：搜索结果可以慢一点
    });
  };
}

// 2. useDeferredValue：延迟某个值
function FilteredList({ filter }) {
  const deferredFilter = useDeferredValue(filter);
  // filter 变化时，deferredFilter 可能延迟更新
  // 用户输入流畅，列表更新可以稍慢

  const items = useMemo(
    () => heavyFilter(allItems, deferredFilter),
    [deferredFilter]
  );

  return <List items={items} />;
}
```

**Q7: 常见的性能优化误区？**

1. **过度使用 useMemo/useCallback**：简单计算不需要缓存，缓存本身有开销。

2. **过早优化**：先写正确的代码，出现性能问题再优化。

3. **只优化子组件**：如果父组件渲染慢，子组件 memo 也没用。

4. **忽视打包优化**：代码分割、Tree Shaking 往往比组件优化效果更明显。

---
