---
title: 端到端测试（E2E）
---

# 端到端测试（E2E）

> 端到端测试（End-to-End Testing）模拟真实用户在浏览器中的操作，验证完整业务流程，是测试金字塔的顶层。

---

## 一、什么是 E2E 测试

### 1. 定义

E2E 测试是指**从用户视角出发**，在真实浏览器环境中模拟用户操作（点击、输入、导航），验证应用的整体行为是否符合预期。

```
用户视角：  打开浏览器 → 输入网址 → 登录 → 下单 → 支付 → 查看订单
                ↓
E2E 测试：  启动浏览器 → 访问页面 → 填表单 → 点击按钮 → 断言结果
```

### 2. 与单元/集成测试对比

| 维度       | 单元测试       | 集成测试       | E2E 测试             |
| ---------- | -------------- | -------------- | -------------------- |
| 测试对象   | 单个函数/组件  | 多模块协作     | 完整用户流程         |
| 运行环境   | Node/jsdom     | Node/jsdom     | 真实浏览器           |
| 速度       | 极快（毫秒）   | 较快（秒）     | 慢（秒~分钟）        |
| 成本       | 低             | 中             | 高                   |
| 数量       | 多             | 适中           | 少                   |
| Mock       | 大量 Mock      | 仅 Mock 边界   | 尽量不 Mock          |
| 稳定性     | 高             | 较高           | 较低（易 Flaky）     |
| 发现问题   | 内部逻辑错误   | 接口/交互问题  | 真实用户体验问题     |

### 3. E2E 测试的价值

- **保障核心流程**：登录、下单、支付等关键链路不被破坏。
- **验证真实环境**：浏览器兼容性、真实网络、真实后端。
- **提升信心**：上线前运行 E2E，确保整体功能可用。

### 4. E2E 测试的代价

- **编写成本高**：需要搭建测试环境、准备测试数据。
- **运行慢**：单个用例可能需要数秒。
- **维护成本高**：UI 变化频繁时，选择器容易失效。
- **容易 Flaky**：网络波动、动画、异步加载导致不稳定。

---

## 二、E2E 测试框架对比

| 框架           | 特点                                   | 适用场景              |
| -------------- | -------------------------------------- | --------------------- |
| **Playwright** | 微软出品，跨浏览器，自动等待，多 Tab   | 现代 Web 应用（推荐） |
| **Cypress**    | 浏览器内运行，可视化调试，实时重载     | 中小型项目、开发调试  |
| **Selenium**   | 老牌框架，支持多语言，生态成熟         | 传统项目、多语言团队  |
| **Puppeteer**  | Google 出品，仅 Chrome，Headless 优先  | 爬虫、性能测试        |
| **TestCafe**   | 无需 WebDriver，跨浏览器               | 简单 E2E 需求         |

### Playwright vs Cypress

| 维度       | Playwright                  | Cypress                     |
| ---------- | --------------------------- | --------------------------- |
| 浏览器支持 | Chrome/Firefox/Safari/Edge  | Chrome/Firefox/Edge（实验） |
| 多 Tab     | 支持                        | 不支持                      |
| 多域名     | 支持                        | 受限                        |
| 语言支持   | JS/TS/Python/Java/.NET      | JS/TS                       |
| 并行执行   | 内置支持                    | 需付费（Dashboard）         |
| 自动等待   | 内置                        | 内置                        |
| 调试体验   | Trace Viewer、UI Mode       | 时间旅行、可视化            |
| 速度       | 较快                        | 较慢                        |

---

## 三、Playwright 基础

### 1. 安装

```bash
# 初始化
npm init playwright@latest

# 或手动安装
npm install --save-dev @playwright/test
npx playwright install  # 安装浏览器
```

### 2. 配置 `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // 测试目录
  testDir: "./e2e",

  // 并行执行
  fullyParallel: true,

  // 失败重试
  retries: process.env.CI ? 2 : 0,

  // 并发 worker 数
  workers: process.env.CI ? 1 : undefined,

  // 报告器
  reporter: [
    ["html"],
    ["list"],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  // 全局配置
  use: {
    // 基础 URL
    baseURL: "http://localhost:3000",

    // 截图：仅失败时
    screenshot: "only-on-failure",

    // 录屏：失败时保留
    video: "retain-on-failure",

    // 跟踪：首次重试时
    trace: "on-first-retry",

    // 超时
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // 项目配置（多浏览器）
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
  ],

  // 启动 Web Server
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### 3. 第一个测试

```typescript
import { test, expect } from "@playwright/test";

test("首页应该正确加载", async ({ page }) => {
  await page.goto("/");

  // 断言标题
  await expect(page).toHaveTitle(/我的应用/);

  // 断言元素存在
  await expect(page.getByRole("heading", { name: "欢迎" })).toBeVisible();
});
```

运行测试：

```bash
npx playwright test              # 运行所有
npx playwright test --ui         # UI 模式（推荐调试）
npx playwright test login.spec.ts # 运行指定文件
npx playwright test --project=chromium  # 指定浏览器
npx playwright test --headed     # 显示浏览器窗口
npx playwright test --debug      # 调试模式
npx playwright show-report       # 查看报告
```

---

## 四、核心 API

### 1. 导航

```typescript
test("导航示例", async ({ page }) => {
  // 访问 URL
  await page.goto("/");
  await page.goto("/login", { waitUntil: "networkidle" });

  // 前进/后退
  await page.goBack();
  await page.goForward();

  // 刷新
  await page.reload();
});
```

### 2. 定位元素（Locator）

Playwright 推荐使用语义化定位器：

```typescript
// 推荐顺序：getByRole > getByLabel > getByPlaceholder > getByText > getByTestId

// 1. getByRole（推荐）
page.getByRole("button", { name: "提交" });
page.getByRole("link", { name: "登录" });
page.getByRole("textbox", { name: "用户名" });
page.getByRole("checkbox", { name: "记住我" });
page.getByRole("heading", { name: "欢迎" });

// 2. getByLabel（表单字段）
page.getByLabel("邮箱");

// 3. getByPlaceholder
page.getByPlaceholder("请输入密码");

// 4. getByText
page.getByText("登录成功");

// 5. getByAltText（图片）
page.getByAltText("logo");

// 6. getByTestId（最后手段）
page.getByTestId("submit-button");

// CSS / XPath（不推荐）
page.locator(".btn-primary");
page.locator("//button[@type='submit']");
```

### 3. 交互操作

```typescript
test("交互示例", async ({ page }) => {
  // 点击
  await page.getByRole("button", { name: "提交" }).click();

  // 双击
  await page.getByText("编辑").dblclick();

  // 右键
  await page.getByText("菜单").click({ button: "right" });

  // 填写输入框
  await page.getByLabel("用户名").fill("admin");
  await page.getByLabel("密码").fill("123456");

  // 逐字符输入（触发键盘事件）
  await page.getByLabel("搜索").pressSequentially("hello");

  // 清空输入框
  await page.getByLabel("用户名").clear();

  // 勾选/取消勾选
  await page.getByLabel("记住我").check();
  await page.getByLabel("记住我").uncheck();

  // 选择下拉框
  await page.getByLabel("城市").selectOption("shanghai");
  await page.getByLabel("城市").selectOption({ label: "上海" });

  // 上传文件
  await page.setInputFiles("input[type=file]", "path/to/file.pdf");

  // 键盘按键
  await page.keyboard.press("Enter");
  await page.keyboard.press("Control+S");

  // 悬停
  await page.getByText("菜单").hover();

  // 拖拽
  await page.locator("#source").dragTo(page.locator("#target"));
});
```

### 4. 断言

```typescript
test("断言示例", async ({ page }) => {
  // 可见性
  await expect(page.getByText("欢迎")).toBeVisible();
  await expect(page.getByText("错误")).toBeHidden();

  // 存在性（DOM 中存在，不一定可见）
  await expect(page.getByTestId("hidden")).toBeInTheDocument();

  // 文本内容
  await expect(page.getByRole("heading")).toHaveText("标题");
  await expect(page.getByRole("heading")).toContainText("标");

  // 属性
  await expect(page.getByRole("button")).toBeEnabled();
  await expect(page.getByRole("button")).toBeDisabled();
  await expect(page.getByRole("checkbox")).toBeChecked();

  // 值
  await expect(page.getByLabel("用户名")).toHaveValue("admin");
  await expect(page.getByLabel("用户名")).toHaveValue(/admin/);

  // 数量
  await expect(page.getByRole("listitem")).toHaveCount(3);

  // URL
  await expect(page).toHaveURL("/dashboard");
  await expect(page).toHaveURL(/.*dashboard/);

  // 标题
  await expect(page).toHaveTitle(/应用名/);

  // 截图对比
  await expect(page).toHaveScreenshot("homepage.png");

  // 颜色/样式
  await expect(page.getByRole("button")).toHaveCSS("color", "rgb(255, 0, 0)");
});
```

### 5. 自动等待

Playwright 在执行操作前会自动等待元素满足条件：

```typescript
// 自动等待：元素可操作（可见、稳定、启用）后才执行点击
await page.getByRole("button").click();

// 等待特定条件
await page.getByText("加载完成").waitFor();
await page.waitForURL("/dashboard");
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1000); // ❌ 不推荐硬等待
```

---

## 五、完整 E2E 测试示例

### 1. 登录流程测试

```typescript
import { test, expect } from "@playwright/test";

test.describe("登录流程", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("正确凭据应该登录成功", async ({ page }) => {
    // 填写表单
    await page.getByLabel("用户名").fill("admin");
    await page.getByLabel("密码").fill("123456");

    // 提交
    await page.getByRole("button", { name: "登录" }).click();

    // 验证跳转
    await expect(page).toHaveURL("/dashboard");

    // 验证用户信息显示
    await expect(page.getByText("欢迎，admin")).toBeVisible();
  });

  test("错误密码应该显示提示", async ({ page }) => {
    await page.getByLabel("用户名").fill("admin");
    await page.getByLabel("密码").fill("wrong");
    await page.getByRole("button", { name: "登录" }).click();

    await expect(page.getByText("用户名或密码错误")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("空表单应该显示验证错误", async ({ page }) => {
    await page.getByRole("button", { name: "登录" }).click();

    await expect(page.getByText("请输入用户名")).toBeVisible();
    await expect(page.getByText("请输入密码")).toBeVisible();
  });
});
```

### 2. 购物流程测试

```typescript
import { test, expect } from "@playwright/test";

test.describe("购物流程", () => {
  test("完整下单流程", async ({ page }) => {
    // 1. 登录
    await page.goto("/login");
    await page.getByLabel("用户名").fill("admin");
    await page.getByLabel("密码").fill("123456");
    await page.getByRole("button", { name: "登录" }).click();

    // 2. 浏览商品
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: "商品列表" })).toBeVisible();

    // 3. 添加商品到购物车
    await page.getByText("iPhone 15").click();
    await page.getByRole("button", { name: "加入购物车" }).click();

    // 4. 验证购物车
    await page.getByRole("link", { name: "购物车" }).click();
    await expect(page).toHaveURL("/cart");
    await expect(page.getByText("iPhone 15")).toBeVisible();

    // 5. 结算
    await page.getByRole("button", { name: "去结算" }).click();
    await expect(page).toHaveURL("/checkout");

    // 6. 填写收货地址
    await page.getByLabel("收货人").fill("张三");
    await page.getByLabel("手机号").fill("13800138000");
    await page.getByLabel("地址").fill("北京市朝阳区");

    // 7. 提交订单
    await page.getByRole("button", { name: "提交订单" }).click();

    // 8. 验证订单创建成功
    await expect(page).toHaveURL(/\/orders\/\d+/);
    await expect(page.getByText("订单创建成功")).toBeVisible();
  });
});
```

### 3. 表格分页与筛选测试

```typescript
test("表格分页与筛选", async ({ page }) => {
  await page.goto("/users");

  // 验证初始数据
  await expect(page.getByRole("row")).toHaveCount(11); // 表头 + 10 行

  // 翻到下一页
  await page.getByRole("button", { name: "下一页" }).click();
  await expect(page.getByText("第 2 页")).toBeVisible();

  // 筛选
  await page.getByPlaceholder("搜索用户").fill("张");
  await page.getByRole("button", { name: "搜索" }).click();

  // 验证筛选结果
  const rows = page.getByRole("row").filter({ hasText: "张" });
  await expect(rows).toHaveCount(await rows.count());
});
```

---

## 六、测试夹具（Fixtures）

### 1. 内置夹具

```typescript
test("内置夹具", async ({ page, browser, context, request }) => {
  // page：独立页面（每个测试自动创建）
  // browser：浏览器实例
  // context：浏览器上下文（隔离的 Cookie/Session）
  // request：API 请求上下文（用于接口测试）
});

// 自定义夹具
test("自定义夹具", async ({ page, loggedInPage }) => {
  // loggedInPage 已登录
  await loggedInPage.goto("/dashboard");
});
```

### 2. 自定义夹具

```typescript
import { test as base, expect } from "@playwright/test";

// 扩展夹具
type Fixtures = {
  loggedInPage: Page;
  testData: { username: string; password: string };
};

export const test = base.extend<Fixtures>({
  testData: async ({}, use) => {
    const data = { username: "admin", password: "123456" };
    await use(data);
  },
  loggedInPage: async ({ page, testData }, use) => {
    await page.goto("/login");
    await page.getByLabel("用户名").fill(testData.username);
    await page.getByLabel("密码").fill(testData.password);
    await page.getByRole("button", { name: "登录" }).click();
    await expect(page).toHaveURL("/dashboard");
    await use(page);
  },
});

export { expect };

// 使用
test("已登录用户可以访问个人中心", async ({ loggedInPage }) => {
  await loggedInPage.getByRole("link", { name: "个人中心" }).click();
  await expect(loggedInPage).toHaveURL("/profile");
});
```

---

## 七、网络拦截与 Mock

### 1. 拦截请求

```typescript
test("拦截请求", async ({ page }) => {
  // 拦截并 Mock 响应
  await page.route("/api/users", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 1, name: "张三" }]),
    });
  });

  await page.goto("/users");
  await expect(page.getByText("张三")).toBeVisible();
});
```

### 2. 修改请求

```typescript
test("修改请求", async ({ page }) => {
  await page.route("/api/users", async (route) => {
    // 继续请求但修改响应
    const response = await route.fetch();
    const body = await response.json();
    body.push({ id: 999, name: "Mock 用户" });
    await route.fulfill({
      response,
      body: JSON.stringify(body),
    });
  });

  await page.goto("/users");
  await expect(page.getByText("Mock 用户")).toBeVisible();
});
```

### 3. 模拟网络错误

```typescript
test("网络错误处理", async ({ page }) => {
  await page.route("/api/users", (route) =>
    route.abort("failed")
  );

  await page.goto("/users");
  await expect(page.getByText("加载失败，请重试")).toBeVisible();
});
```

### 4. 验证请求

```typescript
test("验证请求参数", async ({ page }) => {
  const requestPromise = page.waitForRequest((req) =>
    req.url().includes("/api/users") && req.method() === "POST"
  );

  await page.getByRole("button", { name: "创建用户" }).click();

  const request = await requestPromise;
  const postData = request.postDataJSON();
  expect(postData).toEqual({ name: "张三", age: 25 });
});
```

---

## 八、多 Tab 与多上下文

### 1. 多 Tab 测试

```typescript
test("新窗口打开链接", async ({ page }) => {
  await page.goto("/");

  // 等待新页面
  const newPagePromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "帮助文档" }).click();
  const newPage = await newPagePromise;

  await expect(newPage).toHaveURL("/help");
  await expect(newPage.getByRole("heading", { name: "帮助" })).toBeVisible();
});
```

### 2. 多上下文（多用户）

```typescript
test("多用户协作", async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // 用户 A 登录
  await page1.goto("/login");
  await page1.getByLabel("用户名").fill("userA");
  await page1.getByLabel("密码").fill("123456");
  await page1.getByRole("button", { name: "登录" }).click();

  // 用户 B 登录
  await page2.goto("/login");
  await page2.getByLabel("用户名").fill("userB");
  await page2.getByLabel("密码").fill("123456");
  await page2.getByRole("button", { name: "登录" }).click();

  // 验证两个用户独立会话
  await expect(page1.getByText("欢迎，userA")).toBeVisible();
  await expect(page2.getByText("欢迎，userB")).toBeVisible();
});
```

---

## 九、Cypress 基础

### 1. 安装

```bash
npm install --save-dev cypress
npx cypress open  # 打开可视化界面
```

### 2. 配置 `cypress.config.ts`

```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10_000,
    video: true,
    screenshotOnRunFailure: true,
  },
});
```

### 3. 测试示例

```typescript
describe("登录流程", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("正确凭据登录成功", () => {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
    cy.contains("欢迎，admin").should("be.visible");
  });
});
```

---

## 十、最佳实践

### 1. 测试核心流程

- 优先覆盖核心业务流程：登录、注册、下单、支付。
- 避免测试每个细节，留给单元/集成测试。
- E2E 测试数量应控制在几十个以内。

### 2. 使用语义化选择器

```typescript
// ✅ 推荐：语义化，不易因样式变化而失效
page.getByRole("button", { name: "提交" });
page.getByLabel("用户名");

// ❌ 不推荐：脆弱
page.locator(".btn.btn-primary");
page.locator("#submit-btn");
```

### 3. 避免硬等待

```typescript
// ❌ 不推荐：硬等待
await page.waitForTimeout(3000);

// ✅ 推荐：等待条件
await expect(page.getByText("加载完成")).toBeVisible();
await page.waitForLoadState("networkidle");
```

### 4. 测试数据管理

```typescript
// 使用 API 准备测试数据（比 UI 操作快）
test.beforeAll(async ({ request }) => {
  await request.post("/api/test/setup", {
    data: { users: [{ name: "测试用户" }] },
  });
});

test.afterAll(async ({ request }) => {
  await request.post("/api/test/teardown");
});
```

### 5. 并行执行

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,  // 文件级并行
  workers: 4,           // worker 数
});
```

### 6. 处理 Flaky 测试

- 使用 `test.describe.configure({ retries: 2 })` 重试。
- 使用 `expect.toPass({ timeout: 10_000 })` 重试断言。
- 分析失败原因，避免盲目重试。

---

## 十一、CI/CD 集成

### GitHub Actions 示例

```yaml
name: E2E Tests
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

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 参考资源

- [Playwright 官方文档](https://playwright.dev/docs/intro)
- [Cypress 官方文档](https://docs.cypress.io/)
- [Testing Trophy（测试奖杯模型）](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
