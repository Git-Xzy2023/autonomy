---
title: 测试覆盖率
---

# 测试覆盖率

> 测试覆盖率（Test Coverage）是度量测试充分性的指标，反映测试代码对被测代码的覆盖程度，是衡量代码质量的重要参考。

---

## 一、什么是测试覆盖率

### 1. 定义

测试覆盖率是指**测试代码执行过的被测代码比例**，通常以百分比表示。

```
测试覆盖率 = (被测试执行过的代码 / 总代码) × 100%
```

### 2. 覆盖率类型

| 类型             | 英文            | 说明                                   |
| ---------------- | --------------- | -------------------------------------- |
| **行覆盖率**     | Line Coverage   | 已执行的代码行占比                     |
| **语句覆盖率**   | Statement Coverage | 已执行的语句占比（与行覆盖类似）   |
| **分支覆盖率**   | Branch Coverage | 已执行的条件分支占比（if/else、&&/\|\|）|
| **函数覆盖率**   | Function Coverage | 已调用的函数占比                    |
| **路径覆盖率**   | Path Coverage   | 已执行的执行路径占比（最严格）         |

### 3. 覆盖率示例

```typescript
function grade(score: number): string {
  if (score >= 90) {        // 分支 1
    return "A";
  } else if (score >= 60) { // 分支 2
    return "B";
  } else {                  // 分支 3
    return "F";
  }
}

// 测试 1：grade(95) → "A"
// 覆盖：行 1-2，分支 1
// 行覆盖率：2/6 ≈ 33%
// 分支覆盖率：1/3 ≈ 33%

// 测试 2：grade(70) → "B"
// 覆盖：行 1-4，分支 1、2
// 行覆盖率：4/6 ≈ 67%
// 分支覆盖率：2/3 ≈ 67%

// 测试 3：grade(50) → "F"
// 覆盖：行 1-6，分支 1、2、3
// 行覆盖率：6/6 = 100%
// 分支覆盖率：3/3 = 100%
```

### 4. 覆盖率的价值与局限

**价值**：

- 发现未测试的代码，降低风险。
- 量化测试充分性，便于团队协作。
- 作为 CI 门禁，防止覆盖率下降。

**局限**：

- **高覆盖率 ≠ 高质量**：100% 覆盖不代表测试了所有场景。
- **可能误导**：只为提升覆盖率而写的测试价值低。
- **无法发现遗漏**：未实现的代码不会被统计。

```typescript
// 100% 行覆盖，但未测试边界
function divide(a: number, b: number) {
  return a / b; // 没有测试 b=0 的情况
}

// 测试：divide(10, 2) === 5
// 行覆盖率 100%，但 divide(10, 0) = Infinity 未被测试
```

---

## 二、覆盖率工具

### 1. Istanbul（nyc）

Istanbul 是 JavaScript 生态最经典的覆盖率工具，Jest 内置集成。

```bash
# 独立使用
npm install --save-dev nyc
npx nyc node test.js

# 生成报告
npx nyc report --reporter=html
```

### 2. V8 Coverage

V8 引擎原生覆盖率，速度更快，Vitest 默认使用。

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // 或 "istanbul"
    },
  },
});
```

### 3. Istanbul vs V8

| 维度     | Istanbul              | V8                  |
| -------- | --------------------- | ------------------- |
| 原理     | 代码插桩              | V8 引擎原生         |
| 速度     | 较慢（需转换代码）    | 快                  |
| 准确性   | 高                    | 高                  |
| 支持     | 所有 JS 运行时        | 仅 V8（Node/Chrome）|
| 输出     | 详细                  | 详细                |
| 推荐     | 老项目                | 现代项目（推荐）    |

---

## 三、Jest 覆盖率配置

### 1. 命令行

```bash
# 生成覆盖率报告
npx jest --coverage

# 指定收集范围
npx jest --coverage --collectCoverageFrom="src/**/*.ts"

# 指定报告格式
npx jest --coverage --coverageReporters=text --coverageReporters=html
```

### 2. 配置文件 `jest.config.ts`

```typescript
import type { Config } from "jest";

const config: Config = {
  // 覆盖率收集范围
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",          // 排除类型声明
    "!src/main.tsx",           // 排除入口
    "!src/**/index.ts",        // 排除纯导出文件
    "!src/**/*.stories.tsx",   // 排除 Storybook
    "!src/test/**",            // 排除测试目录
  ],

  // 覆盖率输出目录
  coverageDirectory: "coverage",

  // 报告格式
  coverageReporters: [
    "text",         // 终端输出
    "text-summary", // 终端摘要
    "html",         // HTML 报告
    "lcov",         // CI 集成（Coveralls、Codecov）
    "json-summary", // JSON 摘要（脚本处理）
  ],

  // 覆盖率阈值（不达标则失败）
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // 针对特定文件设置阈值
    "./src/utils/**": {
      branches: 90,
      statements: 90,
    },
  },
};

export default config;
```

### 3. 输出示例

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   85.71 |    75.00 |   83.33 |   85.71 |
 math.ts  |   100.0 |   100.00 |   100.0 |   100.0 |
 user.ts  |    80.0 |    66.66 |   75.00 |    80.0 | 12,18-20
----------|---------|----------|---------|---------|-------------------
```

---

## 四、Vitest 覆盖率配置

### 1. 配置 `vite.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      // 覆盖率工具
      provider: "v8", // 或 "istanbul"

      // 收集范围
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/main.tsx",
        "src/**/index.ts",
        "src/test/**",
      ],

      // 报告格式
      reporter: [
        "text",
        "text-summary",
        "html",
        "lcov",
        "json-summary",
      ],

      // 输出目录
      reportsDirectory: "coverage",

      // 阈值
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },

      // 忽略覆盖（注释标记）
      ignoreEmptyLines: true,
      skipFull: false, // 是否跳过 100% 文件
    },
  },
});
```

### 2. 运行

```bash
npx vitest run --coverage
```

---

## 五、覆盖率报告解读

### 1. HTML 报告

```bash
# 生成后打开
open coverage/index.html
```

- **绿色**：已覆盖
- **红色**：未覆盖
- **黄色**：部分覆盖（分支未完全覆盖）
- **数字**：执行次数

### 2. 关键指标

| 指标       | 含义                       | 建议值 |
| ---------- | -------------------------- | ------ |
| Statements | 语句覆盖率                 | ≥ 80%  |
| Branches   | 分支覆盖率（if/else 等）   | ≥ 75%  |
| Functions  | 函数覆盖率                 | ≥ 80%  |
| Lines      | 行覆盖率                   | ≥ 80%  |

### 3. 分支覆盖率详解

```typescript
function check(age: number, hasLicense: boolean) {
  if (age >= 18 && hasLicense) {  // 2 个分支条件
    return "可以驾驶";
  }
  return "不可驾驶";
}

// 测试 1：check(20, true) → "可以驾驶"
// 分支覆盖：age>=18 ✓，hasLicense ✓，整体 true ✓
// 但 age<18、hasLicense=false、age>=18&&hasLicense=false 未测试

// 完全分支覆盖需要：
// check(20, true)   → true 分支
// check(16, true)   → false（age 不满足）
// check(20, false)  → false（license 不满足）
// check(16, false)  → false（都不满足）
```

---

## 六、覆盖率实践

### 1. 设置合理阈值

```typescript
// jest.config.ts / vitest.config.ts
coverageThreshold: {
  global: {
    branches: 70,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  // 核心模块要求更高
  "./src/services/**": {
    branches: 90,
    lines: 90,
  },
  // 工具函数要求最高
  "./src/utils/**": {
    branches: 95,
    lines: 95,
  },
}
```

### 2. CI 中强制覆盖率

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test -- --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}
```

### 3. 覆盖率徽章

```markdown
<!-- README.md -->
[![Coverage Status](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/user/repo)
```

### 4. 差异覆盖率（Diff Coverage）

只检查新增/修改代码的覆盖率，避免历史包袱：

```bash
# 安装
npm install --save-dev diff-cover

# 生成 lcov 后
npx diff-cover coverage/lcov.info --html-report diff-coverage.html
npx diff-cover coverage/lcov.info --fail-under=80
```

---

## 七、提升覆盖率的策略

### 1. 优先覆盖核心逻辑

```
覆盖率优先级：
1. 核心业务逻辑（services、utils）→ 90%+
2. 公共组件 → 80%+
3. 页面组件 → 70%+
4. 配置文件、入口文件 → 可不测
```

### 2. 覆盖边界条件

```typescript
describe("divide", () => {
  // 正常情况
  it("正常除法", () => {
    expect(divide(10, 2)).toBe(5);
  });

  // 边界
  it("除数为 0", () => {
    expect(() => divide(10, 0)).toThrow();
  });

  it("被除数为 0", () => {
    expect(divide(0, 5)).toBe(0);
  });

  // 负数
  it("负数除法", () => {
    expect(divide(-10, 2)).toBe(-5);
    expect(divide(10, -2)).toBe(-5);
  });

  // 浮点数
  it("浮点数除法", () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 2);
  });
});
```

### 3. 覆盖错误处理

```typescript
describe("fetchUser", () => {
  it("成功响应", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, name: "张三" }),
    } as Response);

    const user = await fetchUser(1);
    expect(user.name).toBe("张三");
  });

  it("404 错误", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchUser(999)).rejects.toThrow("用户不存在");
  });

  it("网络错误", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchUser(1)).rejects.toThrow("网络错误");
  });
});
```

### 4. 使用参数化测试

```typescript
// Vitest 的 each
describe.each([
  [95, "A"],
  [90, "A"],
  [85, "B"],
  [60, "B"],
  [59, "F"],
  [0, "F"],
])("grade(%i) 应该返回 %s", (score, expected) => {
  it(`grade(${score}) === "${expected}"`, () => {
    expect(grade(score)).toBe(expected);
  });
});

// Jest 的 each
it.each([
  [95, "A"],
  [85, "B"],
  [59, "F"],
])("grade(%i) 应该返回 %s", (score, expected) => {
  expect(grade(score)).toBe(expected);
});
```

---

## 八、覆盖率的误区

### 1. 100% 覆盖率不是目标

```typescript
// 100% 覆盖，但测试无价值
test("add", () => {
  expect(add(1, 2)).toBe(3); // 只测了一个 case
});

// 80% 覆盖，但测试有价值
test("add 各种情况", () => {
  expect(add(1, 2)).toBe(3);
  expect(add(-1, 1)).toBe(0);
  expect(add(0, 0)).toBe(0);
  expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  expect(() => add(NaN, 1)).toThrow();
});
```

### 2. 覆盖率不能衡量测试质量

```typescript
// ❌ 坏测试：无断言
test("fetchUser", async () => {
  await fetchUser(1); // 没有断言，但覆盖率 100%
});

// ✅ 好测试：有断言
test("fetchUser", async () => {
  const user = await fetchUser(1);
  expect(user).toEqual({ id: 1, name: "张三" });
});
```

### 3. 不要为覆盖率而写测试

- 测试应该验证**行为**，而非覆盖**代码**。
- 覆盖率是**副产品**，不是**目标**。
- 关注测试的**有效性**，而非数字。

---

## 九、高级技巧

### 1. 忽略特定代码

```typescript
// 使用注释跳过覆盖率检查

/* istanbul ignore next */ // 跳过下一行
function unused() {}

/* istanbul ignore if */ // 跳过 if 分支
if (process.env.NODE_ENV === "test") {
  // ...
}

/* istanbul ignore else */ // 跳过 else 分支
if (condition) {
  return value;
} else {
  return defaultValue;
}

/* istanbul ignore file */ // 跳过整个文件（放在文件顶部）
```

### 2. 覆盖率报告脚本

```typescript
// scripts/coverage-check.ts
import { readFileSync } from "fs";

interface CoverageSummary {
  total: {
    lines: { total: number; covered: number; pct: number };
    branches: { total: number; covered: number; pct: number };
    functions: { total: number; covered: number; pct: number };
    statements: { total: number; covered: number; pct: number };
  };
}

const summary: CoverageSummary = JSON.parse(
  readFileSync("coverage/coverage-summary.json", "utf-8")
);

const { lines, branches, functions, statements } = summary.total;

console.log("覆盖率报告：");
console.log(`  行：${lines.pct}%`);
console.log(`  分支：${branches.pct}%`);
console.log(`  函数：${functions.pct}%`);
console.log(`  语句：${statements.pct}%`);

const threshold = 80;
const allPass =
  lines.pct >= threshold &&
  branches.pct >= threshold &&
  functions.pct >= threshold &&
  statements.pct >= threshold;

if (!allPass) {
  console.error(`❌ 覆盖率低于阈值 ${threshold}%`);
  process.exit(1);
} else {
  console.log(`✅ 覆盖率达标`);
}
```

### 3. 与 Codecov / Coveralls 集成

```yaml
# .github/workflows/test.yml
- name: Upload to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
    token: ${{ secrets.CODECOV_TOKEN }}
    fail_ci_if_error: true

- name: Upload to Coveralls
  uses: coverallsapp/github-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    path-to-lcov: ./coverage/lcov.info
```

---

## 十、最佳实践总结

### 1. 覆盖率目标

| 模块类型     | 建议覆盖率 |
| ------------ | ---------- |
| 工具函数     | 90%+       |
| 核心业务逻辑 | 85%+       |
| 公共组件     | 80%+       |
| 页面组件     | 70%+       |
| 整体项目     | 80%        |

### 2. 实践原则

1. **覆盖率是参考，不是目标**：关注测试有效性。
2. **分支覆盖率比行覆盖率更重要**：发现遗漏的条件。
3. **设置 CI 门禁**：防止覆盖率下降。
4. **关注新增代码覆盖率**：使用差异覆盖率。
5. **定期审查未覆盖代码**：评估是否需要补充测试。

### 3. 团队协作

- 在 PR 中显示覆盖率变化（Codecov 集成）。
- 新代码要求 80%+ 覆盖率。
- 定期清理无效测试。

---

## 参考资源

- [Istanbul 官方文档](https://istanbul.js.org/)
- [Jest 覆盖率文档](https://jestjs.io/zh-Hans/docs/configuration#collectcoverage-boolean)
- [Vitest 覆盖率文档](https://cn.vitest.dev/guide/coverage.html)
- [Codecov 文档](https://docs.codecov.com/)
- [Martin Fowler - TestCoverage](https://martinfowler.com/bliki/TestCoverage.html)
