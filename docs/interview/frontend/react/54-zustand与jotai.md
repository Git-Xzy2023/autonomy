---
title: "Zustand 与 Jotai"
---

# Zustand 与 Jotai

**Q1: Zustand 是什么？**

Zustand 是一个轻量级状态管理库，API 简洁，无样板代码，无 Provider。

```jsx
import { create } from 'zustand';

// 创建 store
const useCounter = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 使用（无需 Provider）
function Counter() {
  const { count, increment, decrement } = useCounter();
  return (
    <div>
      <button onClick={decrement}>-</button>
      {count}
      <button onClick={increment}>+</button>
    </div>
  );
}
```

**Q2: Zustand 相比 Redux 有什么优势？**

| 特性       | Redux                | Zustand              |
| ---------- | -------------------- | -------------------- |
| 样板代码   | 多                   | 极少                 |
| Provider   | 需要                 | 不需要               |
| 学习成本   | 高                   | 低                   |
| 精细订阅   | 需要 selector        | 内置支持             |
| 异步处理   | 需要 middleware      | 直接写 async 函数    |
| 包体积     | 较大                 | 小（~1KB）           |
| TypeScript | 需要额外配置         | 原生友好             |

**Q3: Zustand 如何实现精细订阅？**

```jsx
const useStore = create((set) => ({
  name: 'Alice',
  age: 25,
  email: 'a@b.com',
}));

// 1. 选择器：只订阅 name，age 变化不触发重渲染
function UserName() {
  const name = useStore((state) => state.name);
  return <div>{name}</div>;
}

// 2. 多个字段
function UserInfo() {
  const { name, age } = useStore((state) => ({
    name: state.name,
    age: state.age,
  }));
  // ⚠️ 注意：返回新对象每次引用不同，需要 shallow 比较
}

// 3. 使用 shallow 避免不必要的重渲染
import { shallow } from 'zustand/shallow';

function UserInfo() {
  const { name, age } = useStore(
    (state) => ({ name: state.name, age: state.age }),
    shallow
  );
}

// 4. 直接订阅单个值（最佳）
function UserName() {
  const name = useStore((state) => state.name); // 基本类型，无需 shallow
}
```

**Q4: Zustand 如何处理异步操作？**

```jsx
const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // 直接写 async 函数，不需要 middleware
  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/users/${userId}`);
      const user = await res.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

// 使用
function UserProfile({ userId }) {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

**Q5: Jotai 是什么？和 Zustand 有什么区别？**

Jotai 是一个**原子化**状态管理库，采用自底向上的方法。

```jsx
import { atom, useAtom } from 'jotai';

// 创建原子状态
const countAtom = atom(0);

// 使用
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <button onClick={() => setCount(count + 1)}>{count}</button>
  );
}
```

| 特性       | Zustand              | Jotai                  |
| ---------- | -------------------- | ---------------------- |
| 模型       | Store（集中式）      | Atom（分散式）         |
| 类比       | 类似 Redux           | 类似 Recoil            |
| 适合场景   | 全局状态             | 细粒度状态、派生状态   |
| 派生状态   | 手动                 | 内置（derived atom）   |
| 学习成本   | 低                   | 中                     |

**Q6: Jotai 的派生原子是什么？**

```jsx
import { atom, useAtom } from 'jotai';

// 基础原子
const priceAtom = atom(100);
const quantityAtom = atom(2);

// 派生原子（只读）：自动计算
const totalAtom = atom((get) => get(priceAtom) * get(quantityAtom));

// 派生原子（可写）
const discountAtom = atom(0.9);
const finalPriceAtom = atom(
  (get) => get(priceAtom) * get(discountAtom), // 读
  (get, set, newPrice) => {
    set(priceAtom, newPrice / get(discountAtom)); // 写
  }
);

// 使用
function Cart() {
  const [total] = useAtom(totalAtom);
  return <div>总价：{total}</div>;
  // price 或 quantity 变化时，total 自动更新
}
```

**Q7: 如何选择状态管理方案？**

```
应用规模：
  小型 → useState + useContext
  中型 → Zustand
  大型 → Redux Toolkit

状态类型：
  服务端缓存 → React Query / SWR
  表单状态 → React Hook Form
  URL 状态 → useSearchParams
  临时 UI → useState
  全局共享 → Zustand / Jotai / Redux

团队偏好：
  喜欢简洁 → Zustand
  喜欢原子化 → Jotai
  需要严格规范 → Redux Toolkit
```

---
