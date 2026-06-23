---
title: Mock 与 Stub
---

# Mock 与 Stub

> Mock 与 Stub 是测试中隔离依赖、控制返回值、验证交互行为的核心技术，是编写可靠单元测试与集成测试的基础。

---

## 一、测试替身（Test Double）

### 1. 概念

测试替身（Test Double）是指在测试中**替换真实依赖**的对象，类似于电影中的"替身演员"。

```
真实对象：  数据库、API、第三方服务、复杂组件
                ↓
测试替身：  Stub、Mock、Spy、Fake、Dummy
```

### 2. 分类

| 类型        | 作用                         | 是否验证交互 | 典型场景             |
| ----------- | ---------------------------- | ------------ | -------------------- |
| **Dummy**   | 占位，从不被调用             | 否           | 填充参数列表         |
| **Stub**    | 返回预设值                   | 否           | 替换数据库查询       |
| **Spy**     | 记录调用信息，不改变行为     | 是           | 验证方法是否被调用   |
| **Mock**    | 预设期望，验证交互           | 是           | 验证 API 调用次数    |
| **Fake**    | 简化但可工作的实现           | 否           | 内存数据库           |

### 3. 区别图解

```
┌─────────────────────────────────────────┐
│           测试替身分类                   │
├─────────────────────────────────────────┤
│                                         │
│  Dummy    → 仅占位，从不被调用          │
│                                         │
│  Stub     → 返回固定值                  │
│             "问它什么，它都答同一个"    │
│                                         │
│  Spy      → 真实对象 + 记录调用         │
│             "暗中观察"                  │
│                                         │
│  Mock     → 预设期望 + 验证调用         │
│             "它会检查你是否按约定调用"  │
│                                         │
│  Fake     → 简化实现                    │
│             "能跑，但不适合生产"        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、Jest/Vitest Mock API

### 1. 创建 Mock 函数

```typescript
import { vi } from "vitest"; // Jest 中用 jest

// 创建 Mock 函数
const mockFn = vi.fn();

// 设置返回值
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);

// 设置 Promise 返回值
mockFn.mockResolvedValue("success");
mockFn.mockRejectedValue(new Error("fail"));

// 设置实现
mockFn.mockImplementation((x: number) => x * 2);
mockFn.mockImplementationOnce((x: number) => x * 3);

// 调用
mockFn(1);
mockFn(2);

// 断言调用情况
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(1);
expect(mockFn).toHaveBeenLastCalledWith(2);
expect(mockFn).toHaveBeenNthCalledWith(1, 1);
expect(mockFn).toHaveReturnedWith(42);
```

### 2. Mock 模块

被测模块 `userApi.ts`：

```typescript
import { fetchUser } from "./api";

export async function getUserName(id: number): Promise<string> {
  const user = await fetchUser(id);
  return user.name;
}
```

测试：

```typescript
import { vi } from "vitest";

// Mock 整个模块
vi.mock("./api", () => ({
  fetchUser: vi.fn(),
}));

import { fetchUser } from "./api";
import { getUserName } from "./userApi";

describe("getUserName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该返回用户名", async () => {
    // 设置 Mock 返回值
    vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: "张三" });

    const name = await getUserName(1);

    expect(name).toBe("张三");
    expect(fetchUser).toHaveBeenCalledWith(1);
    expect(fetchUser).toHaveBeenCalledTimes(1);
  });

  it("API 失败时应该抛出错误", async () => {
    vi.mocked(fetchUser).mockRejectedValue(new Error("网络错误"));

    await expect(getUserName(1)).rejects.toThrow("网络错误");
  });
});
```

### 3. Mock 部分模块

```typescript
// 原模块 utils.ts
export function format() { /* ... */ }
export function parse() { /* ... */ }
export const config = { api: "/api" };

// 只 Mock 部分，保留其他
vi.mock("./utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./utils")>();
  return {
    ...actual,
    format: vi.fn(() => "mocked format"),
  };
});
```

### 4. Mock 自动生成（Auto Mock）

```typescript
// 自动 Mock 整个模块的所有导出
vi.mock("./api");
// 等价于：所有函数变成 vi.fn()，返回 undefined
```

---

## 三、Spy 监视

### 1. 监视对象方法

```typescript
import { vi } from "vitest";

const obj = {
  greet(name: string) {
    return `Hello, ${name}`;
  },
};

// spyOn：监视但不改变行为
const spy = vi.spyOn(obj, "greet");

const result = obj.greet("张三");

expect(result).toBe("Hello, 张三"); // 真实行为
expect(spy).toHaveBeenCalledWith("张三");
expect(spy).toHaveBeenCalledTimes(1);
```

### 2. Spy + Mock 实现

```typescript
const spy = vi.spyOn(obj, "greet");

// 替换实现
spy.mockImplementation(() => "Hi");
expect(obj.greet("张三")).toBe("Hi");

// 恢复原始实现
spy.mockRestore();
expect(obj.greet("张三")).toBe("Hello, 张三");
```

### 3. 监视 console

```typescript
test("错误时应该打印日志", () => {
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  doSomethingWrong();

  expect(consoleSpy).toHaveBeenCalledWith("发生错误");
  expect(consoleSpy).toHaveBeenCalledTimes(1);

  consoleSpy.mockRestore();
});
```

---

## 四、Stub 实战

### 1. Stub 数据库

被测代码 `userService.ts`：

```typescript
import { db } from "./db";

export class UserService {
  async getUser(id: number) {
    return db.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  async createUser(name: string) {
    return db.query("INSERT INTO users (name) VALUES (?)", [name]);
  }
}
```

测试：

```typescript
import { vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: vi.fn(),
  },
}));

import { db } from "./db";
import { UserService } from "./userService";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    vi.clearAllMocks();
  });

  it("getUser 应该查询用户", async () => {
    // Stub 返回值
    vi.mocked(db.query).mockResolvedValue({ id: 1, name: "张三" });

    const user = await service.getUser(1);

    expect(user).toEqual({ id: 1, name: "张三" });
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1]
    );
  });

  it("createUser 应该插入用户", async () => {
    vi.mocked(db.query).mockResolvedValue({ insertId: 100 });

    const result = await service.createUser("李四");

    expect(result).toEqual({ insertId: 100 });
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO users (name) VALUES (?)",
      ["李四"]
    );
  });
});
```

### 2. Stub 定时器

```typescript
test("定时器测试", () => {
  vi.useFakeTimers();

  const callback = vi.fn();

  // 设置定时器
  setTimeout(callback, 1000);

  // 快进时间
  vi.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalled();

  vi.useRealTimers();
});

test("setInterval 测试", () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const interval = setInterval(callback, 100);

  // 快进 500ms
  vi.advanceTimersByTime(500);

  expect(callback).toHaveBeenCalledTimes(5);

  clearInterval(interval);
  vi.useRealTimers();
});
```

### 3. Stub 日期

```typescript
test("日期 Stub", () => {
  vi.setSystemTime(new Date("2024-01-01"));

  expect(new Date()).toEqual(new Date("2024-01-01"));
  expect(Date.now()).toBe(new Date("2024-01-01").getTime());

  vi.useRealTimers();
});
```

### 4. Stub localStorage

```typescript
// vitest.setup.ts
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string) {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});
```

---

## 五、Fake 实现

### 1. Fake 数据库

```typescript
// Fake 实现：内存数据库
class FakeUserRepository {
  private users: Map<number, { id: number; name: string }> = new Map();
  private nextId = 1;

  async create(name: string) {
    const user = { id: this.nextId++, name };
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: number) {
    return this.users.get(id) ?? null;
  }

  async findAll() {
    return Array.from(this.users.values());
  }

  async delete(id: number) {
    return this.users.delete(id);
  }
}

// 测试中使用 Fake
describe("UserService with Fake", () => {
  let repo: FakeUserRepository;
  let service: UserService;

  beforeEach(() => {
    repo = new FakeUserRepository();
    service = new UserService(repo);
  });

  it("创建并查询用户", async () => {
    const created = await service.create("张三");
    const found = await service.findById(created.id);

    expect(found).toEqual(created);
  });
});
```

### 2. Fake HTTP 客户端

```typescript
class FakeHttpClient {
  private handlers: Map<string, (body?: any) => any> = new Map();

  onPost(url: string, handler: (body: any) => any) {
    this.handlers.set(`POST:${url}`, handler);
  }

  onGet(url: string, handler: () => any) {
    this.handlers.set(`GET:${url}`, handler);
  }

  async post(url: string, body: any) {
    const handler = this.handlers.get(`POST:${url}`);
    if (!handler) throw new Error(`No handler for POST ${url}`);
    return handler(body);
  }

  async get(url: string) {
    const handler = this.handlers.get(`GET:${url}`);
    if (!handler) throw new Error(`No handler for GET ${url}`);
    return handler();
  }
}
```

---

## 六、MSW（Mock Service Worker）

### 1. 为什么用 MSW

- 在**网络层**拦截请求，更接近真实行为。
- 同一份 Mock 代码可在**单元测试、集成测试、开发环境**复用。
- 支持 REST 与 GraphQL。

### 2. 安装

```bash
npm install --save-dev msw
```

### 3. 定义 Handlers

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // GET 请求
  http.get("/api/users/:id", ({ params }) => {
    const id = Number(params.id);
    if (id === 1) {
      return HttpResponse.json({ id: 1, name: "张三", age: 25 });
    }
    return HttpResponse.json(
      { message: "用户不存在" },
      { status: 404 }
    );
  }),

  // POST 请求
  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: 100, ...body },
      { status: 201 }
    );
  }),

  // PUT 请求
  http.put("/api/users/:id", async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: Number(params.id), ...body });
  }),

  // DELETE 请求
  http.delete("/api/users/:id", ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  }),

  // 模拟延迟
  http.get("/api/slow", async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return HttpResponse.json({ data: "slow response" });
  }),

  // 模拟错误
  http.get("/api/error", () => {
    return HttpResponse.json(
      { message: "服务器内部错误" },
      { status: 500 }
    );
  }),
];
```

### 4. Node 端使用（单元/集成测试）

```typescript
// src/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

```typescript
// vitest.setup.ts
import { server } from "./src/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 5. 测试中覆盖 Handler

```typescript
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";

test("服务器错误时应该显示错误提示", async () => {
  // 临时覆盖某个接口的响应
  server.use(
    http.get("/api/users/:id", () =>
      HttpResponse.json({ message: "服务器错误" }, { status: 500 })
    )
  );

  render(<UserCard userId={1} />);

  await waitFor(() => {
    expect(screen.getByText("加载失败")).toBeInTheDocument();
  });
});
```

### 6. 浏览器端使用（开发环境）

```bash
npx msw init public/ --save  # 生成 sw.js
```

```typescript
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

```typescript
// src/main.tsx
async function main() {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
}

main();
```

---

## 七、Mock 最佳实践

### 1. Mock 边界，不 Mock 内部

```typescript
// ✅ 推荐：Mock 外部依赖（API、数据库）
vi.mock("./api");
vi.mock("./db");

// ❌ 不推荐：Mock 被测模块自身
vi.mock("./userUtils"); // 被测模块依赖它，但不应 Mock 其内部函数
```

### 2. 在 beforeEach 中清理

```typescript
beforeEach(() => {
  vi.clearAllMocks();   // 清除调用记录
  vi.resetAllMocks();   // 清除调用记录 + 实现
  vi.restoreAllMocks(); // 恢复 spyOn 的原始实现
});
```

### 3. 避免过度 Mock

```typescript
// ❌ 不推荐：Mock 一切，测试失去意义
vi.mock("./utils");
vi.mock("./api");
vi.mock("./db");
vi.mock("./auth");

// ✅ 推荐：使用真实实现 + Fake 边界
const fakeRepo = new FakeUserRepository();
const service = new UserService(fakeRepo);
```

### 4. Mock 返回值要真实

```typescript
// ❌ 不推荐：返回不真实的数据
vi.mocked(fetchUser).mockReturnValue({} as any);

// ✅ 推荐：返回符合类型的数据
vi.mocked(fetchUser).mockResolvedValue({
  id: 1,
  name: "张三",
  age: 25,
  email: "zhangsan@example.com",
});
```

### 5. 验证关键交互

```typescript
// ✅ 推荐：验证关键调用
expect(api.createUser).toHaveBeenCalledWith({
  name: "张三",
  age: 25,
});
expect(api.createUser).toHaveBeenCalledTimes(1);

// ❌ 不推荐：过度验证无关细节
expect(api.createUser).toHaveBeenCalledWith(expect.anything());
expect(console.log).toHaveBeenCalled(); // 无关紧要
```

---

## 八、常见问题

### 1. Mock 不生效

- 确认 `vi.mock` 在文件顶部（会被提升）。
- 确认路径正确（相对路径、模块名）。
- 确认 Mock 的导出名与原模块一致。

### 2. Mock 污染其他测试

- 在 `beforeEach` 中调用 `vi.clearAllMocks()`。
- 使用 `vi.resetAllMocks()` 重置实现。
- 使用 `vi.restoreAllMocks()` 恢复 spyOn。

### 3. ESM 模块 Mock

- Vitest 原生支持 ESM Mock。
- Jest 需要配置 `transform` 或使用实验性 ESM。

---

## 参考资源

- [Vitest Mock 文档](https://cn.vitest.dev/guide/mocking.html)
- [Jest Mock 文档](https://jestjs.io/zh-Hans/docs/mock-functions)
- [MSW 官方文档](https://mswjs.io/docs/)
- [Martin Fowler - TestDouble](https://martinfowler.com/bliki/TestDouble.html)
