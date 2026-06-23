---
title: 集成测试
---

# 集成测试

> 集成测试验证多个模块协作时的行为，是单元测试与 E2E 测试之间的过渡层，用于发现模块间接口与交互问题。

---

## 一、什么是集成测试

### 1. 定义

集成测试（Integration Test）是指将**多个单元组合**在一起进行测试，验证它们协作时的行为是否正确。

```
单元测试：  [模块 A]          [模块 B]          [模块 C]
              ↓                  ↓                  ↓
集成测试：  [模块 A] ──→ [模块 B] ──→ [模块 C]
                                              ↓
E2E 测试：  [用户] ──→ [完整应用] ──→ [数据库]
```

### 2. 与单元测试的区别

| 维度     | 单元测试               | 集成测试                 |
| -------- | ---------------------- | ------------------------ |
| 范围     | 单个函数/组件          | 多个模块协作             |
| 速度     | 极快（毫秒级）         | 较快（秒级）             |
| Mock     | 大量 Mock 依赖         | 尽量使用真实依赖         |
| 数量     | 多                     | 适中                     |
| 发现问题 | 单元内部逻辑错误       | 模块间接口、交互问题     |

### 3. 集成测试的价值

- **发现接口问题**：参数类型不匹配、返回值结构错误。
- **验证数据流**：多个模块串联时的数据传递是否正确。
- **降低 E2E 成本**：把部分流程验证下沉到集成层，减少昂贵的 E2E 测试。

---

## 二、集成测试策略

### 1. 集成方式

```
┌─────────────────────────────────────────┐
│           集成测试策略                   │
├─────────────────────────────────────────┤
│                                         │
│  1. 自顶向下（Top-Down）                │
│     主模块 → 子模块                     │
│     子模块用 Stub 替代                  │
│                                         │
│  2. 自底向上（Bottom-Up）               │
│     子模块 → 主模块                     │
│     主模块用 Driver 替代                │
│                                         │
│  3. 三明治集成（Sandwich）              │
│     顶层 + 底层同时集成                 │
│     中间层用 Stub/Driver                │
│                                         │
│  4. 大爆炸（Big Bang）                  │
│     所有模块一次性集成                  │
│     ❌ 不推荐：定位问题困难             │
│                                         │
└─────────────────────────────────────────┘
```

### 2. 测试范围

- **组件 + Store**：组件与状态管理协作。
- **组件 + API**：组件与接口请求协作。
- **组件 + 路由**：多页面跳转与参数传递。
- **组件 + 组件**：父子组件、兄弟组件通信。
- **Service + Repository**：业务层与数据层协作。

---

## 三、组件集成测试

### 1. 父子组件协作

被测组件 `TodoList.tsx`：

```tsx
import { useState } from "react";
import { TodoItem } from "./TodoItem";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div>
      <input
        data-testid="todo-input"
        placeholder="输入待办"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value) {
            addTodo(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
```

`TodoItem.tsx`：

```tsx
interface Props {
  todo: { id: number; text: string; done: boolean };
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li data-testid={`todo-${todo.id}`}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </li>
  );
}
```

集成测试 `TodoList.test.tsx`：

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "./TodoList";

describe("TodoList 集成测试", () => {
  it("添加待办后应该显示在列表中", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId("todo-input");
    await user.type(input, "学习集成测试{Enter}");

    expect(screen.getByText("学习集成测试")).toBeInTheDocument();
  });

  it("点击复选框应该切换完成状态", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // 添加待办
    await user.type(screen.getByTestId("todo-input"), "买牛奶{Enter}");

    // 勾选完成
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // 验证样式变化
    expect(screen.getByText("买牛奶")).toHaveStyle(
      "text-decoration: line-through"
    );

    // 再次点击取消
    await user.click(checkbox);
    expect(screen.getByText("买牛奶")).not.toHaveStyle(
      "text-decoration: line-through"
    );
  });

  it("点击删除按钮应该移除待办", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByTestId("todo-input"), "临时任务{Enter}");
    expect(screen.getByText("临时任务")).toBeInTheDocument();

    await user.click(screen.getByText("删除"));
    expect(screen.queryByText("临时任务")).not.toBeInTheDocument();
  });

  it("应该支持添加多个待办", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByTestId("todo-input"), "任务一{Enter}");
    await user.type(screen.getByTestId("todo-input"), "任务二{Enter}");
    await user.type(screen.getByTestId("todo-input"), "任务三{Enter}");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });
});
```

### 2. 组件 + 状态管理（Zustand）

Store `store/userStore.ts`：

```typescript
import { create } from "zustand";

interface UserState {
  name: string;
  age: number;
  setName: (name: string) => void;
  setAge: (age: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "",
  age: 0,
  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
}));
```

组件 `UserProfile.tsx`：

```tsx
import { useUserStore } from "../store/userStore";

export function UserProfile() {
  const { name, age, setName, setAge } = useUserStore();

  return (
    <div>
      <input
        data-testid="name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="姓名"
      />
      <input
        data-testid="age-input"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="年龄"
      />
      <div data-testid="display">
        {name ? `${name}, ${age} 岁` : "请输入信息"}
      </div>
    </div>
  );
}
```

集成测试：

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./UserProfile";
import { useUserStore } from "../store/userStore";

describe("UserProfile + Zustand 集成测试", () => {
  beforeEach(() => {
    // 每个测试前重置 store
    useUserStore.setState({ name: "", age: 0 });
  });

  it("输入信息后应该同步到 store 与显示", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);

    await user.type(screen.getByTestId("name-input"), "张三");
    await user.type(screen.getByTestId("age-input"), "25");

    expect(screen.getByTestId("display")).toHaveTextContent("张三, 25 岁");

    // 验证 store 状态
    expect(useUserStore.getState()).toEqual({ name: "张三", age: 25 });
  });

  it("store 状态变化应该反映到组件", () => {
    useUserStore.setState({ name: "李四", age: 30 });
    render(<UserProfile />);

    expect(screen.getByTestId("display")).toHaveTextContent("李四, 30 岁");
  });
});
```

---

## 四、组件 + API 集成测试

### 1. 使用 MSW 模拟接口

安装：

```bash
npm install --save-dev msw
```

Setup `src/test/server.ts`：

```typescript
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  // GET /api/users/1
  http.get("/api/users/:id", ({ params }) => {
    const id = Number(params.id);
    if (id === 1) {
      return HttpResponse.json({ id: 1, name: "张三", age: 25 });
    }
    return HttpResponse.json({ message: "用户不存在" }, { status: 404 });
  }),

  // POST /api/users
  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 100, ...body }, { status: 201 });
  })
);
```

`jest.setup.ts`：

```typescript
import { server } from "./src/test/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. 测试数据获取组件

组件 `UserCard.tsx`：

```tsx
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  age: number;
}

export function UserCard({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("请求失败");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div data-testid="loading">加载中...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div data-testid="user-card">
      <h3>{user?.name}</h3>
      <p>年龄：{user?.age}</p>
    </div>
  );
}
```

集成测试：

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { UserCard } from "./UserCard";

describe("UserCard + API 集成测试", () => {
  it("应该正确加载并显示用户信息", async () => {
    render(<UserCard userId={1} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("user-card")).toBeInTheDocument();
    });

    expect(screen.getByText("张三")).toBeInTheDocument();
    expect(screen.getByText("年龄：25")).toBeInTheDocument();
  });

  it("用户不存在时应该显示错误", async () => {
    render(<UserCard userId={999} />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });
});
```

### 3. 测试表单提交流程

组件 `UserForm.tsx`：

```tsx
import { useState } from "react";

export function UserForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: Number(age) }),
    });
    if (res.ok) {
      onSuccess();
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="姓名"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="年龄"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
```

集成测试：

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserForm } from "./UserForm";

describe("UserForm 提交流程", () => {
  it("提交表单后应该调用 onSuccess", async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<UserForm onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText("姓名"), "王五");
    await user.type(screen.getByPlaceholderText("年龄"), "28");
    await user.click(screen.getByRole("button", { name: "提交" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("提交过程中按钮应该禁用", async () => {
    const user = userEvent.setup();
    render(<UserForm onSuccess={() => {}} />);

    await user.type(screen.getByPlaceholderText("姓名"), "王五");
    await user.type(screen.getByPlaceholderText("年龄"), "28");
    await user.click(screen.getByRole("button", { name: "提交" }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("提交中...");
  });
});
```

---

## 五、路由集成测试

### 1. React Router 集成

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

function Home() {
  return <div>首页</div>;
}

function About() {
  return <div>关于我们</div>;
}

function User({ id }: { id: string }) {
  return <div>用户 ID：{id}</div>;
}

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <nav>
        <a href="/">首页</a>
        <a href="/about">关于</a>
        <a href="/user/123">用户 123</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User id="123" />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("路由集成测试", () => {
  it("初始路径显示首页", () => {
    render(<App />);
    expect(screen.getByText("首页")).toBeInTheDocument();
  });

  it("点击链接应该跳转到对应页面", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("关于"));
    expect(screen.getByText("关于我们")).toBeInTheDocument();
  });

  it("应该正确解析路由参数", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("用户 123"));
    expect(screen.getByText("用户 ID：123")).toBeInTheDocument();
  });
});
```

---

## 六、Context 集成测试

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeContext.Provider
      value={{ theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeButton() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button onClick={toggle} data-testid="theme">
      当前主题：{theme}
    </button>
  );
}

describe("Context 集成测试", () => {
  it("点击按钮应该切换主题", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeButton />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    await user.click(screen.getByTestId("theme"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });
});
```

---

## 七、最佳实践

### 1. 测试边界

- **单元测试**：测试单个组件的内部逻辑，所有依赖 Mock。
- **集成测试**：测试多个真实组件协作，仅 Mock 外部边界（API、浏览器 API）。
- **E2E 测试**：测试完整用户流程，不 Mock 内部模块。

### 2. 使用真实依赖

```tsx
// ❌ 不推荐：集成测试中 Mock 子组件
vi.mock("./TodoItem", () => ({
  TodoItem: () => <div>mocked</div>,
}));

// ✅ 推荐：使用真实的子组件
render(<TodoList />);
```

### 3. 仅 Mock 外部边界

```tsx
// ✅ 推荐：仅 Mock 网络请求
import { server } from "../test/server";
import { http, HttpResponse } from "msw";

it("网络错误时应该显示错误提示", async () => {
  server.use(
    http.get("/api/users/:id", () =>
      HttpResponse.json({ message: "服务器错误" }, { status: 500 })
    )
  );

  render(<UserCard userId={1} />);
  await waitFor(() => {
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });
});
```

### 4. 测试用户行为而非实现

```tsx
// ❌ 不推荐：测试内部状态
expect(wrapper.instance().state.todos).toHaveLength(1);

// ✅ 推荐：测试用户可见结果
expect(screen.getAllByRole("listitem")).toHaveLength(1);
```

### 5. 合理使用 `data-testid`

- 优先使用语义化查询（`getByRole`、`getByText`）。
- 当文本不稳定或难以查询时，使用 `data-testid`。
- `data-testid` 应描述内容，而非样式。

---

## 八、常见问题

### 1. 集成测试与 E2E 的边界

- **集成测试**：在 jsdom 环境运行，Mock 外部 API，验证模块协作。
- **E2E 测试**：在真实浏览器运行，使用真实后端，验证完整流程。

### 2. 集成测试太慢

- 避免渲染整个应用，只渲染相关子树。
- 使用 `MemoryRouter` 替代真实路由。
- 使用 MSW 替代真实网络请求。

### 3. 测试依赖执行顺序

- 每个测试前重置状态（Store、localStorage）。
- 避免测试间共享数据。

---

## 参考资源

- [Testing Library 集成测试指南](https://testing-library.com/docs/react-testing-library/example-intro)
- [MSW 官方文档](https://mswjs.io/docs/)
- [React Router 测试](https://reactrouter.com/en/main/start/tutorial)
