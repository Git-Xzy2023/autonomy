# TypeScript 最佳实践

本章介绍 TypeScript 开发中的代码规范、性能优化和与 JavaScript 互操作的最佳实践。

## 1. 代码规范

### 1.1 类型注解策略

```typescript
// ❌ 不好的做法 - 过度注解
let name: string = "Alice";
let age: number = 25;
let items: string[] = ["a", "b", "c"];

// ✅ 好的做法 - 让 TypeScript 推断简单类型
let name = "Alice";
let age = 25;
let items = ["a", "b", "c"];

// ✅ 需要注解的场景
// 1. 函数参数和返回值
function greet(name: string): string {
  return `Hello, ${name}`;
}

// 2. 变量类型不明确时
let value: string | number = getValue();

// 3. 对象字面量
const config: AppConfig = {
  host: "localhost",
  port: 3000,
};
```

### 1.2 使用 interface 还是 type？

```typescript
// ✅ interface - 用于定义对象形状、可扩展
interface User {
  name: string;
  age: number;
}

interface Employee extends User {
  company: string;
}

// ✅ type - 用于联合类型、交叉类型、映射类型
type Status = "active" | "inactive";
type ID = string | number;
type Nullable<T> = T | null;
```

### 1.3 避免使用 any

```typescript
// ❌ 不好的做法
function process(data: any) {
  return data.value; // 没有类型检查
}

// ✅ 好的做法 - 使用泛型
function process<T extends { value: unknown }>(data: T) {
  return data.value;
}

// ✅ 如果真的不确定类型，使用 unknown
function processUnknown(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  return String(data);
}
```

---

## 2. 严格模式配置

```json
// tsconfig.json 推荐配置
{
  "compilerOptions": {
    "strict": true,                    // 启用所有严格检查
    "noImplicitAny": true,             // 禁止隐式 any
    "strictNullChecks": true,          // 严格空值检查
    "strictFunctionTypes": true,       // 严格函数类型
    "strictBindCallApply": true,       // 严格 bind/call/apply
    "strictPropertyInitialization": true, // 严格属性初始化
    "noImplicitThis": true,            // 禁止隐式 this
    "alwaysStrict": true,              // 始终使用严格模式
    "noUnusedLocals": true,            // 检查未使用的局部变量
    "noUnusedParameters": true,        // 检查未使用的参数
    "noImplicitReturns": true,         // 检查隐式返回
    "noFallthroughCasesInSwitch": true // 检查 switch 穿透
  }
}
```

---

## 3. 与 JavaScript 互操作

### 3.1 渐进式迁移

```typescript
// 1. 允许 JS 文件 - tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,          // 允许编译 JS 文件
    "checkJs": false,         // 不检查 JS 文件类型
    "noImplicitAny": false    // 初期允许隐式 any
  }
}

// 2. JSDoc 注释为 JS 提供类型
/**
 * @param {string} name - 用户名
 * @param {number} age - 年龄
 * @returns {string} 问候语
 */
function greet(name, age) {
  return `Hello, ${name}! You are ${age} years old.`;
}
```

### 3.2 类型断言

```typescript
// 使用 as 进行类型断言（推荐）
const myCanvas = document.getElementById("main") as HTMLCanvasElement;

// 非空断言
const input = document.querySelector("input")!; // 断言不为 null

// 双重断言（不推荐，除非确实需要）
const value = someValue as unknown as MyType;
```

### 3.3 类型守卫模式

```typescript
// 使用 is 谓词
function isNonNull<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const items = [1, null, 2, undefined, 3];
const filtered = items.filter(isNonNull); // 类型为 number[]
```

---

## 4. 常见设计模式

### 4.1 Builder 模式

```typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  private orderField?: string;
  private limitCount?: number;

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field: string): this {
    this.orderField = field;
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  build(): string {
    let query = "SELECT * FROM table";
    if (this.conditions.length) {
      query += " WHERE " + this.conditions.join(" AND ");
    }
    if (this.orderField) {
      query += ` ORDER BY ${this.orderField}`;
    }
    if (this.limitCount) {
      query += ` LIMIT ${this.limitCount}`;
    }
    return query;
  }
}

const query = new QueryBuilder()
  .where("age > 18")
  .where("status = 'active'")
  .orderBy("name")
  .limit(10)
  .build();
```

### 4.2 判别联合模式

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

// 穷尽检查
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function getAreaExhaustive(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape); // 如果遗漏 case，编译时报错
  }
}
```

---

## 5. 性能优化

### 5.1 项目配置优化

```json
{
  "compilerOptions": {
    "incremental": true,           // 增量编译
    "skipLibCheck": true,          // 跳过 .d.ts 检查
    "isolatedModules": true        // 确保每个文件可独立转译
  }
}
```

### 5.2 类型优化

```typescript
// ❌ 避免复杂的递归类型（编译慢）
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

// ✅ 限制递归深度
type DeepReadonly<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      readonly [P in keyof T]: T[P] extends object
        ? DeepReadonly<T[P], DepthMinusOne<Depth>>
        : T[P];
    };

// ❌ 避免过大的联合类型
type HugeUnion = A | B | C | D | E | F | G | H; // 编译慢

// ✅ 使用接口继承代替联合类型
interface BaseAction { type: string; }
interface ActionA extends BaseAction { type: "A"; payload: string; }
```

---

## 小结

| 实践 | 说明 |
|------|------|
| 适度注解 | 让 TS 推断简单类型，注解复杂类型 |
| 避免 any | 使用 unknown 或泛型替代 |
| 严格模式 | 启用 strict 获得最大类型安全 |
| 渐进迁移 | allowJs + JSDoc 逐步迁移 |
| 判别联合 | 使用 kind 字段区分联合类型 |
| 穷尽检查 | assertNever 确保覆盖所有分支 |

返回：[TypeScript 入门 →](/web/JavaScript/typescript/)
