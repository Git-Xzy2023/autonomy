---
title: 单元测试
---

# 单元测试

> 单元测试是对软件中最小可测试单元（函数、类、组件）进行验证的测试方法，是测试金字塔的基础。

---

## 一、什么是单元测试

### 1. 定义

单元测试（Unit Test）是指对软件中的**最小可测试单元**进行隔离验证：

- 函数 / 方法
- 类 / 对象
- 独立组件

### 2. 特点

| 特点     | 说明                                       |
| -------- | ------------------------------------------ |
| 快速     | 单个测试通常在毫秒级完成                   |
| 独立     | 测试之间互不依赖，可任意顺序执行           |
| 可重复   | 多次运行结果一致                           |
| 自验证   | 通过断言自动判断成功/失败，无需人工检查    |
| 及时     | 代码变更后立即运行，提供快速反馈           |

### 3. 价值

- **保障质量**：尽早发现 Bug，降低修复成本。
- **辅助设计**：编写测试时反向驱动 API 设计更合理。
- **文档作用**：测试用例即活文档，说明函数的预期行为。
- **安全重构**：有测试保护，敢于优化代码结构。

---

## 二、Jest 基础

### 1. 安装

```bash
# 安装 Jest
npm install --save-dev jest

# 安装 TypeScript 支持
npm install --save-dev ts-jest @types/jest

# 生成配置文件
npx jest --init
```

### 2. 配置文件 `jest.config.ts`

```typescript
import type { Config } from "jest";

const config: Config = {
  // 测试环境
  testEnvironment: "jsdom", // 浏览器环境，Node 环境用 "node"

  // 测试文件匹配
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],

  // TypeScript 转换
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // 模块名映射（路径别名）
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },

  // 覆盖率配置
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
  ],

  // 覆盖率输出目录
  coverageDirectory: "coverage",

  // Setup 文件
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
```

### 3. 第一个测试

被测函数 `src/utils/math.ts`：

```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("除数不能为 0");
  }
  return a / b;
}
```

测试文件 `src/utils/math.test.ts`：

```typescript
import { add, divide } from "./math";

describe("math 工具函数", () => {
  describe("add", () => {
    it("应该正确相加两个正数", () => {
      expect(add(1, 2)).toBe(3);
    });

    it("应该正确处理负数", () => {
      expect(add(-1, -2)).toBe(-3);
      expect(add(-1, 1)).toBe(0);
    });
  });

  describe("divide", () => {
    it("应该正确相除", () => {
      expect(divide(10, 2)).toBe(5);
    });

    it("除数为 0 时应该抛出错误", () => {
      expect(() => divide(10, 0)).toThrow("除数不能为 0");
    });
  });
});
```

运行测试：

```bash
npx jest
npx jest --watch     # 监听模式
npx jest --coverage  # 生成覆盖率报告
```

---

## 三、核心 API

### 1. 测试组织

```typescript
// describe：测试套件，用于分组
describe("用户服务", () => {
  // beforeAll / afterAll：所有测试前/后执行一次
  beforeAll(async () => {
    await initDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // beforeEach / afterEach：每个测试前/后执行
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it / test：测试用例（等价）
  it("应该创建用户", () => {
    // ...
  });

  // 跳过测试
  it.skip("暂时跳过", () => {});

  // 仅运行该测试
  it.only("只跑这个", () => {});
});
```

### 2. 断言（Matchers）

```typescript
// 相等性
expect(1 + 1).toBe(2);              // ===
expect({ a: 1 }).toEqual({ a: 1 }); // 深度相等

// 真假值
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(true).toBeTruthy();
expect(false).toBeFalsy();

// 数字
expect(5).toBeGreaterThan(3);
expect(5).toBeGreaterThanOrEqual(5);
expect(5).toBeLessThan(10);
expect(0.1 + 0.2).toBeCloseTo(0.3); // 浮点数

// 字符串
expect("hello world").toMatch(/world/);
expect("hello").toContain("ell");

// 数组
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);

// 异常
expect(() => throwFn()).toThrow();
expect(() => throwFn()).toThrow("错误信息");
expect(() => throwFn()).toThrow(Error);

// 对象属性
expect(user).toHaveProperty("name");
expect(user).toHaveProperty("age", 18);

// 取反
expect(1 + 1).not.toBe(3);
```

### 3. 异步测试

```typescript
// 方式 1：async/await（推荐）
it("应该获取用户数据", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("张三");
});

// 方式 2：Promise
it("应该获取用户数据", () => {
  return fetchUser(1).then((user) => {
    expect(user.name).toBe("张三");
  });
});

// 方式 3：done 回调
it("应该触发回调", (done) => {
  callbackFn((result) => {
    expect(result).toBe("ok");
    done();
  });
});

// 方式 4：resolves / rejects
it("应该成功", () => {
  return expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "张三" });
});

it("应该失败", () => {
  return expect(fetchUser(-1)).rejects.toThrow("用户不存在");
});
```

---

## 四、Vitest 基础

### 1. 为什么选择 Vitest

| 特性       | Jest          | Vitest             |
| ---------- | ------------- | ------------------ |
| 构建工具   | 自带          | Vite               |
| ESM 支持   | 实验性        | 原生支持           |
| TypeScript | 需 ts-jest    | 原生支持           |
| 启动速度   | 较慢          | 快（依赖 Vite HMR）|
| API 兼容   | -             | 与 Jest 基本兼容   |
| Watch 模式 | 文件变更重跑  | 智能过滤，仅跑相关 |

### 2. 安装

```bash
npm install --save-dev vitest
```

### 3. 配置 `vite.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // 环境
    environment: "jsdom",

    // 全局 API（无需 import）
    globals: true,

    // 覆盖率
    coverage: {
      provider: "v8", // 或 "istanbul"
      reporter: ["text", "json", "html"],
    },

    // Setup
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

### 4. 测试示例

```typescript
import { describe, it, expect, vi } from "vitest";
import { add } from "./math";

describe("add", () => {
  it("应该正确相加", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### 5. 与 Jest 的差异

```typescript
// Jest
const fn = jest.fn();
jest.spyOn(obj, "method");
jest.mock("./module");

// Vitest（API 一致，仅替换 jest 为 vi）
import { vi } from "vitest";
const fn = vi.fn();
vi.spyOn(obj, "method");
vi.mock("./module");

// Vitest 独有：源码内联测试
// math.ts
export function add(a: number, b: number) {
  return a + b;
}

// 内联测试（与源码同文件）
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("add", () => {
    expect(add(1, 2)).toBe(3);
  });
}
```

---

## 五、组件单元测试

### 1. React Testing Library

安装：

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Setup `jest.setup.ts`：

```typescript
import "@testing-library/jest-dom";
```

### 2. 测试组件渲染

组件 `src/components/Counter.tsx`：

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={() => setCount((c) => c - 1)}>-1</button>
    </div>
  );
}
```

测试 `src/components/Counter.test.tsx`：

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("初始值为 0", () => {
    render(<Counter />);
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("点击 +1 按钮增加计数", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByText("+1"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByText("+1"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("点击 -1 按钮减少计数", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByText("-1"));
    expect(screen.getByTestId("count")).toHaveTextContent("-1");
  });
});
```

### 3. 测试 Props 与事件

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Button({ label, onClick, disabled }: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

describe("Button", () => {
  it("渲染 label", () => {
    render(<Button label="提交" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "提交" })).toBeInTheDocument();
  });

  it("点击时触发 onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button label="提交" onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 时不可点击", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button label="提交" onClick={onClick} disabled />);

    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

### 4. 测试异步组件

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
  it("加载完成后显示用户名", async () => {
    render(<UserProfile userId={1} />);

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByText("张三")).toBeInTheDocument();
    });

    // loading 消失
    expect(screen.queryByText("加载中...")).not.toBeInTheDocument();
  });
});
```

### 5. Testing Library 查询方式

| 类型          | 方法                     | 说明                       |
| ------------- | ------------------------ | -------------------------- |
| getBy         | `getByText`, `getByRole` | 找不到报错，找到多个报错   |
| queryBy       | `queryByText`            | 找不到返回 null（用于断言不存在）|
| findBy        | `findByText`             | 返回 Promise，用于异步元素 |
| getAllBy      | `getAllByText`           | 返回数组，找不到报错       |
| queryAllBy    | `queryAllByText`         | 返回数组，找不到返回空数组 |

**查询优先级**（推荐顺序）：

1. `getByRole` —— 语义化，最佳实践
2. `getByLabelText` —— 表单字段
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId` —— 最后手段

---

## 六、Vue 组件测试

### 1. Vue Test Utils

```bash
npm install --save-dev @vue/test-utils @vitest/coverage-v8 jsdom
```

### 2. 测试示例

组件 `Counter.vue`：

```vue
<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <div>
    <span data-testid="count">{{ count }}</span>
    <button @click="count++">+1</button>
  </div>
</template>
```

测试 `Counter.test.ts`：

```typescript
import { mount } from "@vue/test-utils";
import Counter from "./Counter.vue";

describe("Counter", () => {
  it("初始值为 0", () => {
    const wrapper = mount(Counter);
    expect(wrapper.get('[data-testid="count"]').text()).toBe("0");
  });

  it("点击按钮增加计数", async () => {
    const wrapper = mount(Counter);
    await wrapper.get("button").trigger("click");
    expect(wrapper.get('[data-testid="count"]').text()).toBe("1");
  });
});
```

---

## 七、最佳实践

### 1. AAA 模式

```typescript
it("应该正确计算总价", () => {
  // Arrange（准备）
  const cart = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];

  // Act（执行）
  const total = calculateTotal(cart);

  // Assert（断言）
  expect(total).toBe(35);
});
```

### 2. 一个测试只验证一个行为

```typescript
// ❌ 不推荐：一个测试验证多个行为
it("用户操作", () => {
  expect(login("admin", "123")).toBe(true);
  expect(login("admin", "wrong")).toBe(false);
  expect(login("", "")).toBe(false);
});

// ✅ 推荐：拆分为多个测试
it("正确密码应该登录成功", () => {
  expect(login("admin", "123")).toBe(true);
});

it("错误密码应该登录失败", () => {
  expect(login("admin", "wrong")).toBe(false);
});

it("空凭据应该登录失败", () => {
  expect(login("", "")).toBe(false);
});
```

### 3. 测试命名清晰

```typescript
// ❌ 不推荐
it("test1", () => {});
it("测试 add 函数", () => {});

// ✅ 推荐：描述预期行为
it("两个正数相加应该返回正确和", () => {});
it("除数为 0 时应该抛出错误", () => {});
it("用户名为空时应该显示错误提示", () => {});
```

### 4. 避免测试实现细节

```tsx
// ❌ 不推荐：测试内部状态
expect(wrapper.instance().state.count).toBe(1);

// ✅ 推荐：测试用户可见行为
expect(screen.getByTestId("count")).toHaveTextContent("1");
```

### 5. 边界条件

```typescript
describe("divide", () => {
  it("正常除法", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("除数为 0", () => {
    expect(() => divide(10, 0)).toThrow();
  });

  it("被除数为 0", () => {
    expect(divide(0, 5)).toBe(0);
  });

  it("负数除法", () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it("浮点数除法", () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 2);
  });
});
```

---

## 八、常见问题

### 1. 测试覆盖率低怎么办

- 优先覆盖核心业务逻辑。
- 使用覆盖率报告定位未覆盖的分支。
- 在 Code Review 中要求新代码必须附带测试。

### 2. 测试运行慢

- 单元测试避免真实网络请求，使用 Mock。
- 避免在单元测试中渲染大型组件树。
- 使用 `--onlyChanged` 只跑变更相关的测试。

### 3. 测试不稳定（Flaky）

- 避免依赖执行顺序。
- 避免依赖时间（使用 `vi.useFakeTimers()`）。
- 避免依赖随机数（Mock 随机函数）。

---

## 参考资源

- [Jest 官方文档](https://jestjs.io/zh-Hans/docs/getting-started)
- [Vitest 官方文档](https://cn.vitest.dev/)
- [Testing Library 官方文档](https://testing-library.com/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
