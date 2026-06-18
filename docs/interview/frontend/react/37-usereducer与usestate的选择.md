---
title: "useReducer 与 useState 的选择"
---

# useReducer 与 useState 的选择

**Q1: useReducer 和 useState 有什么区别？**

```jsx
// useState：直接设置值
const [count, setCount] = useState(0);
setCount(1);
setCount(prev => prev + 1);

// useReducer：通过 dispatch action 更新
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'increment' });
dispatch({ type: 'set', value: 10 });
```

| 特性         | `useState`                  | `useReducer`                  |
| ------------ | --------------------------- | ----------------------------- |
| 状态类型     | 简单值（数字、字符串等）    | 复杂对象、多字段关联          |
| 更新方式     | 直接设置新值                | 通过 action 描述变更          |
| 逻辑位置     | 分散在各处                  | 集中在 reducer 函数           |
| 可测试性     | 较弱                        | 强（reducer 是纯函数）        |
| 调试         | 难追踪多次更新              | 可通过 action 追踪            |
| 适用场景     | 简单状态                    | 复杂状态机、多状态联动        |

**Q2: 什么时候用 useReducer？**

1. **状态结构复杂**，多个字段关联变化
2. **下一个状态依赖前一个状态**的复杂逻辑
3. **状态更新逻辑复杂**，需要集中管理
4. **需要更清晰的变更追踪**

```jsx
// 场景：购物车
const initialState = {
  items: [],
  total: 0,
  count: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      let items;
      if (existing) {
        items = state.items.map(i =>
          i.id === action.item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        items = [...state.items, { ...action.item, quantity: 1 }];
      }
      return {
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        count: items.reduce((sum, i) => sum + i.quantity, 0),
      };
    }
    case 'REMOVE_ITEM':
      const items = state.items.filter(i => i.id !== action.id);
      return {
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        count: items.reduce((sum, i) => sum + i.quantity, 0),
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });

  return (
    <div>
      <p>总数：{cart.count}，总价：{cart.total}</p>
      {cart.items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
          <button onClick={() => removeItem(item.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}
```

**Q3: useReducer 如何实现组件间共享状态？**

结合 `useContext` 使用，实现类似 Redux 的全局状态管理。

```jsx
// 1. 创建 Context
const StoreContext = createContext();

// 2. Provider 组件
function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// 3. 自定义 Hook
function useStore() {
  const { state, dispatch } = useContext(StoreContext);
  return [state, dispatch];
}

// 4. 使用
function App() {
  return (
    <StoreProvider>
      <Header />
      <Content />
    </StoreProvider>
  );
}

function Header() {
  const [state] = useStore();
  return <h1>{state.title}</h1>;
}

function Content() {
  const [state, dispatch] = useStore();
  return (
    <button onClick={() => dispatch({ type: 'UPDATE' })}>
      {state.value}
    </button>
  );
}
```

**Q4: useReducer 的第三参数（init 函数）有什么用？**

用于惰性初始化，类似 useState 的函数式初始值。

```jsx
function init(initialCount) {
  return {
    count: initialCount,
    history: [initialCount],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    default:
      return state;
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // init(initialCount) 只在首次渲染时调用
  return <div>{state.count}</div>;
}
```

**Q5: reducer 中如何处理异步操作？**

reducer 必须是纯函数，不能在 reducer 中执行异步操作。异步逻辑应该放在组件或自定义 Hook 中。

```jsx
function useAsyncDispatch(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const asyncDispatch = useCallback(async (action) => {
    if (typeof action === 'function') {
      // 如果 action 是函数，执行它（类似 redux-thunk）
      action(asyncDispatch, () => state);
    } else {
      dispatch(action);
    }
  }, [state]);

  return [state, asyncDispatch];
}

// 使用
function fetchData = () => async (dispatch) => {
  dispatch({ type: 'FETCH_START' });
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    dispatch({ type: 'FETCH_SUCCESS', data });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', error });
  }
};

function App() {
  const [state, dispatch] = useAsyncDispatch(reducer, initialState);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  // ...
}
```

---
