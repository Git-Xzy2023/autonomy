---
title: "Redux Toolkit"
---

# Redux Toolkit

**Q1: 什么是 Redux Toolkit？为什么需要它？**

Redux Toolkit（RTK）是 Redux 官方推荐的编写 Redux 逻辑的方式，解决了传统 Redux 的**样板代码多**问题。

```jsx
// 传统 Redux：大量样板代码
// 1. 定义 action types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// 2. 定义 action creators
const addTodo = (text) => ({ type: ADD_TODO, payload: text });
const toggleTodo = (id) => ({ type: TOGGLE_TODO, payload: id });

// 3. 定义 reducer
function todoReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}

// 4. 创建 store
const store = createStore(todoReducer);
```

```jsx
// Redux Toolkit：简洁
import { createSlice, configureStore } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // RTK 内置 immer，可以直接"修改" state
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload, done: false });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
  },
});

// 自动生成 action creators
export const { addTodo, toggleTodo } = todoSlice.actions;

// 创建 store
const store = configureStore({
  reducer: { todos: todoSlice.reducer },
});
```

**Q2: createSlice 做了什么？**

`createSlice` 自动生成：
1. Action types（`name/reducerName` 格式）
2. Action creators
3. Reducer 函数

```jsx
const counterSlice = createSlice({
  name: 'counter',           // 自动生成 action type 前缀：'counter/'
  initialState: { value: 0 },
  reducers: {
    // 自动生成 action type: 'counter/increment'
    increment: (state) => {
      state.value += 1; // immer 让你可以"直接修改"
    },
    // 自动生成 action type: 'counter/incrementByAmount'
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// 自动生成的 action creators
// counterSlice.actions.increment() → { type: 'counter/increment' }
// counterSlice.actions.incrementByAmount(5) → { type: 'counter/incrementByAmount', payload: 5 }

// 自动生成的 reducer
// counterSlice.reducer
```

**Q3: RTK 的 Immer 集成是什么？**

RTK 内置了 Immer，允许你在 reducer 中**直接修改 state**（看起来像可变更新），Immer 底层会生成不可变更新。

```jsx
// 传统 Redux：必须返回新对象
function reducer(state, action) {
  return {
    ...state,
    user: {
      ...state.user,
      profile: {
        ...state.user.profile,
        name: action.payload,
      },
    },
  };
}

// RTK + Immer：直接"修改"
const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.user.profile.name = action.payload; // 看起来在直接修改
      // Immer 底层会生成等价的不可变更新
    },
  },
});
```

**Q4: RTK 如何处理异步操作？**

使用 `createAsyncThunk`。

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 创建异步 thunk
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 使用
dispatch(fetchUser(1));
```

**Q5: RTK Query 是什么？**

RTK Query 是 RTK 内置的数据获取方案，类似 React Query。

```jsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 定义 API
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/users/${id}`,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = api;

// 使用
function UserProfile({ userId }) {
  const { data, isLoading } = useGetUserQuery(userId);
  const [updateUser] = useUpdateUserMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => updateUser({ id: userId, name: 'New' })}>
        更新
      </button>
    </div>
  );
}
```

RTK Query 自动处理：缓存、去重、加载状态、错误处理、乐观更新。

**Q6: RTK 相比传统 Redux 的优势？**

| 特性       | 传统 Redux          | Redux Toolkit       |
| ---------- | ------------------- | ------------------- |
| 样板代码   | 多                  | 少                  |
| 不可变更新 | 手动展开            | Immer 自动处理      |
| 异步处理   | 需装 redux-thunk    | 内置 createAsyncThunk |
| 数据获取   | 需自己实现          | RTK Query 内置      |
| TypeScript | 需大量类型定义      | 自动推断            |
| 配置       | 手动 combineReducers | configureStore 一键 |

---
