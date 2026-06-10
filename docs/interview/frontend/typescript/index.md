---
title: TypeScript面试题
---

# TypeScript面试题

## 一、基础概念

### 1.1 TypeScript 与 JavaScript 的关系

**Q1: 什么是 TypeScript？它和 JavaScript 是什么关系？**

TypeScript 是由 Microsoft 开发的一种开源编程语言，是 JavaScript 的**超集**。核心关系：

1. **超集关系**：所有合法的 JavaScript 代码都是合法的 TypeScript 代码（TS 包含 JS 的全部语法和运行时语义）
2. **编译型语言**：TS 本身不能直接在浏览器/Node.js 运行，必须编译（transpile）成 JS 后才能执行
3. **渐进式**：可以在现有 JS 项目中逐步引入，支持 `.js`/`.ts` 文件混合使用
4. **可选静态类型**：类型注解是可选的，未标注的变量会走**类型推断**（type inference），没推断出来就变成 `any`

**编译流程：**

```
.ts 文件
   ↓ tsc / ts-loader / babel @babel/preset-typescript
   ↓ 类型检查（可选）+ 语法转换
.js 文件（可在浏览器/Node 运行）
```

**TS 的核心价值：**

| 特性                   | 说明                                           |
| ---------------------- | ---------------------------------------------- |
| 静态类型检查           | 在**编译期**发现类型错误，而不是运行时         |
| 智能提示               | IDE 可根据类型信息提供精准的代码补全和重构支持 |
| 代码即文档             | 类型签名就是最准确的 API 文档                  |
| 工程化协作             | 大型项目多人协作时，类型是一种接口契约         |
| 提前使用下一代 JS 特性 | 编译阶段把 ESNext 降级到目标版本               |

**Q2: 为什么要使用 TypeScript？它解决了 JavaScript 的什么痛点？**

JavaScript 是**动态弱类型**语言，变量类型在运行时才确定，这带来了以下痛点：

1. **类型错误只能在运行时暴露**：`undefined is not a function`、`Cannot read property 'x' of undefined` 这类经典错误在 JS 中非常常见
2. **重构风险高**：修改一个函数参数类型，IDE 无法告诉你哪里调用错了
3. **API 契约不清晰**：调用别人写的函数，参数应该传什么、返回什么只能靠猜或看注释
4. **IDE 智能提示有限**：没有类型信息，编辑器很难提供精准的代码补全

TypeScript 通过**编译期静态类型检查**解决了这些问题。

**示例对比：**

```ts
// JavaScript —— 运行时才发现错误
function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.price, 0);
}
calcTotal(null); // 运行时报错：Cannot read property 'reduce' of null

// TypeScript —— 编译期就报错
function calcTotal(items: { price: number }[]) {
  return items.reduce((sum, it) => sum + it.price, 0);
}
calcTotal(null); // ❌ 编译错误：Argument of type 'null' is not assignable...
```

**常见误区**：TypeScript 只是一个开发/编译时工具，它**不会在运行时做类型检查**。如果你把 TS 代码编译为 JS，运行时传入类型错误的数据，是不会报错的。

---

### 1.2 原始类型与类型注解

**Q3: TypeScript 有哪些基础类型？**

| 类型     | 关键字              | 说明                                         |
| -------- | ------------------- | -------------------------------------------- |
| 字符串   | `string`            | 双引号、单引号、模板字符串都属于 string      |
| 数字     | `number`            | 整数、小数、NaN、Infinity 都属于 number      |
| 布尔     | `boolean`           | 只有 `true` / `false`，没有 truthy/falsy     |
| 数组     | `T[]` 或 `Array<T>` | 两种写法等价                                 |
| 元组     | `[T, U]`            | 固定长度和类型的数组                         |
| 枚举     | `enum`              | 命名常量集合                                 |
| 任意值   | `any`               | 跳过类型检查，不推荐使用                     |
| 未知值   | `unknown`           | 类型安全的 any，使用前必须类型断言或类型守卫 |
| 空值     | `void`              | 函数没有返回值                               |
| 空       | `null`              | 表示"有值但为空"                             |
| 未定义   | `undefined`         | 表示"未赋值"                                 |
| 永远不会 | `never`             | 函数永远不会返回（抛出异常或无限循环）       |
| 对象     | `object`            | 非原始类型的类型                             |

**代码示例：**

```ts
// 基本类型注解
let name: string = "Tom";
let age: number = 18;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// 数组的两种写法
let nums: number[] = [1, 2, 3];
let nums2: Array<number> = [1, 2, 3];

// 元组 tuple —— 固定长度、每个位置类型已知
let person: [string, number, boolean] = ["Tom", 18, true];
person[0] = 123; // ❌ 报错
person[3] = "a"; // ❌ 报错（长度固定）
// 注意：push/pop 等方法不受长度限制（TS 的一个历史行为）

// enum —— 会编译到 JS 中
enum Direction {
  Up = 1,
  Down, // 自动 = 2
  Left = 10,
  Right, // 自动 = 11
}
console.log(Direction.Up); // 1
console.log(Direction[10]); // "Left"

// 字符串枚举
enum Color {
  Red = "#ff0000",
  Green = "#00ff00",
  Blue = "#0000ff",
}

// const enum —— 编译后会被内联为具体值，没有运行时代码（更轻量）
const enum Status {
  Draft,
  Published,
}
let s: Status = Status.Published; // 编译后 → let s = 1;
```

**Q4: `null` 和 `undefined` 在 TS 中的行为是什么？`--strictNullChecks` 有什么影响？**

默认情况下（无 `--strictNullChecks`），`null` 和 `undefined` 是**任何类型的子类型**，可以赋值给 `string`、`number` 等：

```ts
let name: string = null; // ✅（非 strict 模式下）
let age: number = undefined; // ✅
```

开启 `strictNullChecks`（`tsconfig.json` 中 `"strict": true` 会自动开启）后，`null` 和 `undefined` 成为独立类型，**不能再赋值给其他类型**：

```ts
let name: string = null; // ❌ 编译错误
let age: number = undefined; // ❌ 编译错误

// 必须显式声明允许
let name: string | null = null; // ✅
let age: number | undefined = undefined; // ✅
```

这是一个非常关键的配置，它让你**必须处理"值可能不存在"**的情况，是避免运行时错误的最重要手段之一。

**使用场景：**

```ts
// 正确写法 —— 函数参数可能缺失
function greet(name: string | null) {
  // 使用前必须确认非空
  if (name) {
    console.log("Hello, " + name.toUpperCase());
  } else {
    console.log("Hello, guest");
  }
}

// 非空断言操作符 ! —— 告诉 TS"我确定它非空"（谨慎使用）
function getLength(str: string | null): number {
  return str!.length; // 但如果 str 确实为 null，运行时还是会报错
}

// 可选链 ?. —— 更安全的写法（ES2020 特性，TS 也支持）
function getName(user: { name?: string } | null) {
  return user?.name?.toUpperCase(); // 返回 string | undefined
}
```

**Q5: `void`、`never`、`unknown`、`any` 的区别？**

这是面试常考题目，需要清晰区分：

```ts
// ========== void ==========
// 函数没有返回值（或返回 undefined）
function log(msg: string): void {
  console.log(msg);
  // 隐式返回 undefined
}
// void 作为变量类型时，只能赋值为 undefined（strict 模式）
let v: void = undefined;

// ========== never ==========
// 函数永远不会"正常返回"
// 场景1：抛出异常
function error(msg: string): never {
  throw new Error(msg);
}
// 场景2：无限循环
function loop(): never {
  while (true) {}
}
// 场景3：穷尽性检查（exhaustive check）
type Fruit = "apple" | "banana";
function handleFruit(f: Fruit) {
  switch (f) {
    case "apple":
      /*...*/ break;
    case "banana":
      /*...*/ break;
    default:
      // 如果日后新增了 Fruit 的成员，这里会编译报错，提醒你处理
      const _exhaustiveCheck: never = f; // ❌ 若 f 未被穷尽
      throw new Error("未知类型");
  }
}

// ========== unknown ==========
// 类型安全的 any —— 必须先做类型检查才能使用
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}
const data = parseJSON('{"x":1}');
// data.x; // ❌ 报错：Object is of type 'unknown'
if (typeof data === "object" && data !== null && "x" in data) {
  console.log((data as { x: number }).x); // ✅ 必须先缩小类型
}

// ========== any ==========
// 跳过类型检查，不推荐
let anything: any = "hello";
anything = 123;
anything = { x: 1 };
anything.nonexistent.method(); // ❌ 编译不报错，运行时才炸
```

**对比总结：**

| 类型      | 可赋值给它  | 它可赋值给                    | 可随意调用方法/属性 | 说明             |
| --------- | ----------- | ----------------------------- | ------------------- | ---------------- |
| `any`     | 任何类型    | 任何类型                      | ✅                  | 完全跳过类型检查 |
| `unknown` | 任何类型    | 只能赋值给 `unknown` 和 `any` | ❌                  | 必须先类型收窄   |
| `void`    | `undefined` | ——                            | ——                  | 函数无返回值     |
| `never`   | 无          | 任何类型                      | ——                  | 永远不会正常结束 |

**最佳实践**：能用 `unknown` 就不要用 `any`。`any` 会污染整个类型系统（any 参与运算后其他值也会变成 any）。

---

### 1.3 联合类型、交叉类型与类型收窄

**Q6: 什么是联合类型（Union Types）？**

用 `|` 连接多个类型，表示"**或**"的关系：

```ts
// 简单联合
let id: string | number;
id = "abc"; // ✅
id = 123; // ✅
id = true; // ❌

// 对象联合（判别联合）
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // shape 被收窄为 Circle
    case "square":
      return shape.side ** 2; // shape 被收窄为 Square
  }
}
```

**Q7: 什么是交叉类型（Intersection Types）？**

用 `&` 连接多个类型，表示"**与**"的关系，合并所有成员：

```ts
type Person = { name: string; age: number };
type Employee = { company: string; salary: number };

type PersonEmployee = Person & Employee;

const john: PersonEmployee = {
  name: "John",
  age: 30,
  company: "Acme",
  salary: 5000,
};
```

**注意冲突处理**：如果两个源类型有同名属性且类型不兼容：

```ts
type A = { x: string };
type B = { x: number };
type C = A & B; // x 的类型是 string & number = never
// const c: C = { x: "a" }; // ❌ 无法赋值，因为 never 没有合法值
```

**联合 vs 交叉 —— 一个重要的直觉**：

- `A | B` 表示"**是 A 或 B**"，你只能访问两者**共同**的属性
- `A & B` 表示"**同时是 A 和 B**"，你可以访问**所有**属性

```ts
interface Bird {
  fly(): void;
  layEggs(): void;
}
interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Bird | Fish;
let pet = getSmallPet();
pet.layEggs(); // ✅ 共同方法可以直接调用
// pet.swim();   // ❌ 不确定是不是 Fish，不能直接调用
// pet.fly();    // ❌ 同理
if ("swim" in pet) {
  pet.swim(); // ✅ 在这个分支，pet 被收窄为 Fish
}
```

**Q8: TypeScript 如何进行类型收窄（Type Narrowing）？**

类型收窄是 TS 类型系统最强大的特性之一。它通过**控制流分析**将一个宽泛类型（如 `string | number`）收窄为更精确的子类型。

**常见收窄手段：**

```ts
function example(x: string | number | boolean) {
  // 1. typeof 类型守卫
  if (typeof x === "string") {
    x.toUpperCase(); // x: string
  }

  // 2. instanceof 类型守卫
  if (x instanceof Date) {
    x.getTime(); // x: Date（如果 x 是 Date 类型）
  }

  // 3. in 操作符 —— 检查属性是否存在
  type Circle = { kind: "circle"; radius: number };
  type Square = { kind: "square"; side: number };
  function area(s: Circle | Square) {
    if ("radius" in s) {
      // s: Circle
      return Math.PI * s.radius ** 2;
    }
  }

  // 4. 直接比较 === !== == !=
  function foo(a: "left" | "right" | null) {
    if (a === null) return;
    // a: "left" | "right"
  }

  // 5. 真值收窄（!!x, if (x)）
  function greet(name: string | null | undefined) {
    if (name) {
      name.toUpperCase(); // name: string（注意：空字符串 "" 会走 else）
    }
  }

  // 6. 可辨识联合（Discriminated Unions）+ switch
  //    通过一个共同的"判别属性"如 kind/type 来收窄，见 Q6
}

// 7. 自定义类型守卫（Type Predicate）
function isString(v: unknown): v is string {
  return typeof v === "string";
}
const arr = [1, "a", 2, "b"];
const strs = arr.filter(isString); // strs: string[]（注意：filter 回调需要是类型谓词才能正确收窄）

// 8. 断言函数（Assertion Functions）TS 3.7+
function assertString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}
function demo(v: unknown) {
  assertString(v);
  v.toUpperCase(); // v: string
}
```

**一个非常有用的模式 —— 穷尽性检查：**

```ts
type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };
function area(s: Shape) {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.s ** 2;
    default:
      // 如果以后新增了 Shape 的变体，TS 会在这一行报错提醒你
      const _exhaustiveCheck: never = s;
      throw new Error(`未处理的形状: ${_exhaustiveCheck}`);
  }
}
```

---

### 1.4 类型别名 vs 接口

**Q9: `type` 和 `interface` 有什么区别？应该怎么选择？**

这是最高频的 TS 面试题之一。

**相同点**：两者都可以描述对象形状和函数签名。

```ts
// type 方式
type UserT = {
  id: number;
  name: string;
};
type GreetT = (name: string) => string;

// interface 方式
interface UserI {
  id: number;
  name: string;
}
interface GreetI {
  (name: string): string;
}
```

**核心区别：**

| 特性                                | `type`                                    | `interface`                |
| ----------------------------------- | ----------------------------------------- | -------------------------- |
| 定义原始类型别名                    | ✅ `type MyStr = string`                  | ❌                         |
| 定义联合/交叉类型                   | ✅ `type A = B \| C`                      | ❌                         |
| 定义元组类型                        | ✅ `type Pair = [T, U]`                   | 可以写但很别扭             |
| 计算属性（映射类型）                | ✅ `type P<T> = { [K in keyof T]: T[K] }` | ❌                         |
| **声明合并（Declaration Merging）** | ❌                                        | ✅ 同名 interface 自动合并 |
| **extends 继承**                    | 通过 `&` 交叉类型模拟                     | `interface A extends B, C` |
| 报错信息                            | 有时会显示复杂的交叉类型别名              | 通常显示接口名，更友好     |
| 性能（极端情况）                    | 交叉类型在深嵌套时可能较慢                | 一般更快                   |

**声明合并示例（interface 独有）：**

```ts
// 分两次定义同一个 interface，TS 会把它们合并
interface Window {
  myLib: { version: string };
}
interface Window {
  myLib2: { foo(): void };
}

// 合并后等价于
// interface Window {
//   myLib: { version: string };
//   myLib2: { foo(): void };
// }
window.myLib.version;
window.myLib2.foo();
```

这个特性非常适合**对第三方库或全局对象扩展类型**（如扩展 `window`、扩展 `Array.prototype` 上的自定义方法）。

**`type` 独有的能力 —— 联合和映射类型：**

```ts
// 联合类型
type Status = "idle" | "loading" | "success" | "error";

// 映射类型 —— 只能用 type
type PartialCustom<T> = {
  [K in keyof T]?: T[K];
};

// 条件类型 —— 只能用 type
type NonNullableCustom<T> = T extends null | undefined ? never : T;

// 从值提取类型
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
type Config = typeof config; // { apiUrl: string; timeout: number }
```

**如何选择 —— 经验法则：**

1. **定义对象形状（类/组件 props 等）**：优先用 `interface`
   - 报错信息更清晰（显示接口名而非一长串类型）
   - 将来需要扩展时可以用声明合并
   - `class X implements I` 写起来更自然

2. **需要联合/交叉/映射/条件类型**：用 `type`

3. **公共 API 类型定义**（如 lib、组件库的类型声明）：推荐 `interface`，便于使用者扩展

4. **React Props**：两者都可以，团队中保持一致即可（interface 略优，因为报错信息友好）

---

### 1.5 字面量类型与字符串/数字字面量联合

**Q10: 什么是字面量类型（Literal Types）？有什么用？**

TS 允许把一个具体的值当成类型：

```ts
let direction: "up" = "up";
direction = "down"; // ❌ 报错，只能是 "up"

// 数字字面量
let one: 1 = 1;

// 布尔字面量（通常不必手动写，TS 会自动推断）
let yes: true = true;
```

**最有价值的用法 —— 字面量联合**：

```ts
// 限定选项，避免拼写错误
type Direction = "up" | "down" | "left" | "right";
function move(dir: Direction) {
  /*...*/
}
move("up"); // ✅
move("UP"); // ❌ 拼写错误立即被发现

// 数字字面量也可以
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

// 字符串模板字面量类型（TS 4.1+）
type Greeting = `hello_${"en" | "zh"}`;
// => "hello_en" | "hello_zh"

type Version = `v${number}.${number}`;
const v: Version = "v1.2"; // ✅
const bad: Version = "v1"; // ❌

// 实战：为路由定义类型
type Route = "/" | "/users" | `/users/${string}`;
```

**用 `as const` 把对象/数组变成字面量类型：**

```ts
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"];
type Method = (typeof HTTP_METHODS)[number]; // string（因为数组元素推断为 string）

// 加上 as const
const HTTP_METHODS_FIXED = ["GET", "POST", "PUT", "DELETE"] as const;
type FixedMethod = (typeof HTTP_METHODS_FIXED)[number]; // "GET" | "POST" | "PUT" | "DELETE"
```

---

## 二、类型系统进阶

### 2.1 泛型（Generics）

**Q11: 什么是泛型？为什么需要它？**

泛型就是"**类型的参数化**"——允许你在定义函数/接口/类时**不预先指定具体类型**，而在使用时再指定。

**没有泛型的痛点：**

```ts
// 方案 A：用 any —— 丢失类型安全
function identity(arg: any): any {
  return arg;
}
const result = identity("hello"); // result: any，字符串方法调用无提示

// 方案 B：重载 —— 每个类型写一份，扩展性差
function identity2(arg: string): string;
function identity2(arg: number): number;
function identity2(arg: any) {
  return arg;
}
```

**用泛型：**

```ts
// <T> 声明类型参数
function identity<T>(arg: T): T {
  return arg;
}

// 用法 1：显式指定
const s = identity<string>("hello"); // s: string

// 用法 2：让 TS 自动推断（最常用）
const n = identity(42); // n: number
```

**Q12: 泛型约束（Constraints）**

默认情况下，泛型 `T` 可以是任意类型，所以你不能随意访问它的属性。通过 `extends` 加约束：

```ts
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length); // ✅ 因为约束了必须有 length 属性
  return arg;
}
logLength("hello"); // ✅ 字符串有 length
logLength([1, 2, 3]); // ✅ 数组有 length
logLength({ length: 5 }); // ✅
logLength(123); // ❌ number 没有 length
```

**约束为 keyof 某对象：**

```ts
// 限制 K 必须是 T 的键名之一
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Tom", age: 18 };
getProp(user, "name"); // ✅ 返回 string
getProp(user, "age"); // ✅ 返回 number
getProp(user, "addr"); // ❌ "addr" 不是 user 的键
```

这是一个非常经典的用法，可以用来写类型安全的属性访问器。

**Q13: 泛型接口、泛型类**

```ts
// 泛型接口
interface Container<T> {
  value: T;
  get(): T;
  set(v: T): void;
}
const box: Container<number> = {
  value: 42,
  get() {
    return this.value;
  },
  set(v) {
    this.value = v;
  },
};

// 泛型类
class Stack<T> {
  private items: T[] = [];
  push(item: T) {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
}
const numStack = new Stack<number>();
numStack.push(1);
numStack.push("a"); // ❌
```

**Q14: 泛型的默认参数**

```ts
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
// 不传 T 时 data 为 any
const resp1: ApiResponse = { code: 0, message: "ok", data: {} };
// 传 T 时 data 为指定类型
const resp2: ApiResponse<{ id: number; name: string }> = {
  code: 0,
  message: "ok",
  data: { id: 1, name: "Tom" },
};
```

**Q15: 泛型函数的类型推断 —— `infer` 的前置理解**

```ts
// 从函数参数或返回值提取类型
function process<T>(data: T[]): T {
  return data[0];
}
const str = process(["a", "b"]); // str: string
```

---

### 2.2 条件类型（Conditional Types）

**Q16: 什么是条件类型？语法是什么？**

条件类型是 TS 类型系统中的 **if-else**，语法：

```ts
T extends U ? X : Y
```

读作：**如果 T 可以赋值给 U，那么取 X，否则取 Y**。

**简单示例：**

```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<123>; // false
type C = IsString<string>; // true
```

**Q17: 条件类型 + 泛型 —— 类型"函数"**

```ts
// 从数组中提取元素类型
type Flatten<T> = T extends Array<infer U> ? U : T;
type D = Flatten<string[]>; // string
type E = Flatten<number>; // number（不是数组就返回自身）

// 从函数中提取返回值类型
type ReturnType2<T> = T extends (...args: any[]) => infer R ? R : never;
type F = ReturnType2<() => string>; // string

// 从函数中提取参数类型
type Parameters2<T> = T extends (...args: infer P) => any ? P : never;
type G = Parameters2<(a: number, b: string) => void>; // [number, string]
```

**这里的 `infer` 是什么？**

`infer` 是条件类型中"**让 TS 帮我推断出某个类型**"的关键字。在 `T extends Array<infer U>` 中，`infer U` 表示"如果 T 是一个数组，请推断出其元素类型并保存到 U 中"。

`infer` 只能出现在 `extends` 的**右侧**（即待匹配的模式中）。

**Q18: 条件类型的分布式行为（Distributive Conditional Types）**

当条件类型作用于**裸类型参数**（即 `T` 没有被包装在数组、元组、函数参数等中）时，它会**对联合类型逐项分发**：

```ts
type ToArray<T> = T extends any ? T[] : never;
type X = ToArray<string | number>;
// 等价于:
// ToArray<string> | ToArray<number>
// => string[] | number[]

// 对比：如果不是裸类型参数（用 [T] 包装），则不分发
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Y = ToArrayNonDist<string | number>;
// => (string | number)[]  （整个联合作为整体处理）
```

**分布式行为的经典应用 —— `Exclude`/`Extract`：**

```ts
// 从 T 中排除可以赋值给 U 的类型
type Exclude<T, U> = T extends U ? never : T;
type E1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type E2 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type E3 = Exclude<string | number | (() => void), Function>; // string | number

// 从 T 中提取可以赋值给 U 的类型
type Extract<T, U> = T extends U ? T : never;
type E4 = Extract<"a" | "b" | "c", "a" | "c" | "d">; // "a" | "c"
```

**注意：** 当 `T` 是 `never` 时，条件类型总是返回 `never`（因为 `never` 是"空联合"，分发后的结果也是空）。

---

### 2.3 映射类型（Mapped Types）

**Q19: 什么是映射类型？它能做什么？**

映射类型可以基于一个已有类型**按规则生成新类型**，语法基于索引签名和 `keyof`：

```ts
// 基础语法
type Mapped<T> = {
  [K in keyof T]: T[K]; // 遍历 T 的所有键，值保持不变（相当于复制）
};
```

**TS 内置的映射类型工具 —— 你需要知道它们是如何实现的：**

```ts
// 1. Partial<T> —— 所有属性变可选
type Partial<T> = {
  [K in keyof T]?: T[K];
};
interface User {
  id: number;
  name: string;
}
type UserPartial = Partial<User>; // { id?: number; name?: string }

// 2. Required<T> —— 所有属性变必填
type Required<T> = {
  [K in keyof T]-?: T[K]; // -? 表示"移除可选"
};
type UserRequired = Required<{ id?: number; name?: string }>; // { id: number; name: string }

// 3. Readonly<T> —— 所有属性变只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// 4. Pick<T, K> —— 从 T 中挑出部分属性
type Pick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};
type UserNameOnly = Pick<User, "name">; // { name: string }

// 5. Record<K, T> —— 生成一个键为 K、值为 T 的对象
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
type Dict = Record<string, number>; // { [x: string]: number }
type StatusMap = Record<"success" | "error", { code: number; msg: string }>;
```

**修改映射行为的修饰符：**

| 修饰符                           | 含义               |
| -------------------------------- | ------------------ |
| `+?`（或直接 `?`）               | 添加可选           |
| `-?`                             | 移除可选（变必填） |
| `+readonly`（或直接 `readonly`） | 添加只读           |
| `-readonly`                      | 移除只读           |

**Q20: 高级映射 —— `as` 子句重新映射键（TS 4.1+）**

通过 `as` 可以在映射时**转换键**：

```ts
// 把所有键变成 getter 方法
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
interface User {
  name: string;
  age: number;
}
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// 过滤掉某些键
type ExcludeTypeFields<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};
interface Data {
  id: number;
  name: string;
  onUpdate: () => void;
}
type DataNoFn = ExcludeTypeFields<Data, Function>;
// { id: number; name: string }（onUpdate 被过滤掉了）
```

---

### 2.4 模板字面量类型（Template Literal Types）

**Q21: 什么是模板字面量类型？** (TS 4.1+)

基于字符串字面量类型，通过模板字符串语法组合出更复杂的字符串类型：

```ts
type Greeting = `Hello, ${string}`;
const g1: Greeting = "Hello, World"; // ✅
const g2: Greeting = "Hi, World"; // ❌

// 与联合类型结合会产生笛卡尔积
type Direction = "top" | "bottom";
type Alignment = "left" | "right";
type Pos = `${Direction}-${Alignment}`;
// => "top-left" | "top-right" | "bottom-left" | "bottom-right"

// TS 内置的字符串操作类型
type S = "hello";
type U = Uppercase<S>; // "HELLO"
type L = Lowercase<"HELLO">; // "hello"
type C = Capitalize<"hello">; // "Hello"
type Uc = Uncapitalize<"Hello">; // "hello"
```

**实战：类型安全的事件名**

```ts
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"

// 为对象生成事件处理器
type EventHandlers<T extends string[]> = {
  [K in T[number] as `on${Capitalize<K>}`]?: () => void;
};
type Handlers = EventHandlers<["click", "hover", "focus"]>;
// { onClick?: () => void; onHover?: () => void; onFocus?: () => void }
```

---

### 2.5 索引类型与 `keyof`

**Q22: `keyof` 是什么？`keyof` + `T[K]` 的索引访问有什么价值？**

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// keyof 产生一个由该类型所有键名组成的联合
type UserKeys = keyof User; // "id" | "name" | "email"

// 索引访问 —— 拿到某个键对应的类型
type NameType = User["name"]; // string
type IdOrEmail = User["id" | "email"]; // number | string
type AllValues = User[keyof User]; // number | string
```

**经典案例 —— 类型安全的 pluck：**

```ts
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map((k) => obj[k]);
}
const user = { id: 1, name: "Tom", age: 18 };
const values = pluck(user, ["id", "name"]); // values: (number | string)[]
pluck(user, ["id", "wrongKey"]); // ❌ "wrongKey" 不在对象键中
```

---

### 2.6 类型守卫与断言

**Q23: `typeof`、`instanceof`、自定义类型守卫、`as` 断言、非空断言 `!` 的区别？**

| 方式            | 语法                    | 说明                                                                                  |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| typeof 守卫     | `typeof x === "string"` | 只能用于判断原始类型（string/number/boolean/symbol/bigint/undefined/function/object） |
| instanceof 守卫 | `x instanceof Date`     | 判断构造函数的原型链                                                                  |
| in 操作符       | `"name" in x`           | 判断对象是否有某个属性                                                                |
| 自定义守卫      | `x is T`                | 返回布尔的谓词函数，用户自定义判断逻辑                                                |
| 类型断言        | `x as T` 或 `<T>x`      | 告诉 TS"我知道 x 更精确的类型是 T"，不做运行时检查                                    |
| 非空断言        | `x!.prop`               | 告诉 TS"我确定 x 不是 null/undefined"                                                 |
| 断言函数        | `asserts x is T`        | TS 3.7+，函数内部如果不抛出异常就认为 x 是 T                                          |

**自定义类型守卫示例：**

```ts
interface Dog {
  bark(): void;
}
interface Cat {
  meow(): void;
}

function isDog(pet: Dog | Cat): pet is Dog {
  return (pet as Dog).bark !== undefined;
}
function play(pet: Dog | Cat) {
  if (isDog(pet)) {
    pet.bark(); // pet 被收窄为 Dog
  } else {
    pet.meow(); // pet 被收窄为 Cat
  }
}
```

**断言 vs 守卫的区别：**

- **类型断言**：`value as T` —— 只在编译期生效，运行时不会做任何检查。你对类型做一个承诺，如果承诺与事实不符，运行时照样会崩。
- **类型守卫**：`value is T` —— 编译期根据你的判断函数收窄类型，运行时实际会执行判断逻辑。

**何时用断言：**

1. TS 推断不够精确，你有额外信息：`document.getElementById("root") as HTMLInputElement`
2. 与第三方 JS 库交互，对方类型不完整
3. 复杂表达式中临时收窄类型（但优先考虑类型守卫）

**断言的双重断言技巧（应尽量避免）：**

```ts
let x: number = 123;
// x as string; // ❌ 直接断言会报错（TS 认为两者毫无关系）
x as unknown as string; // ✅ 通过中间类型绕过（只在你确定正确时使用）
```

---

### 2.7 `this` 参数与函数重载

**Q24: 如何在函数中正确标注 `this` 类型？**

TS 允许在函数参数列表的**第一个位置**声明 `this` 参数，它只在**编译期用于类型检查**，不会出现在运行时的参数列表中：

```ts
interface HTMLElement {
  id: string;
  addEventListener(
    type: string,
    handler: (this: HTMLElement, e: Event) => void,
  ): void;
}

const el: HTMLElement = { id: "myBtn", addEventListener() {} };
el.addEventListener("click", function (e) {
  // 这里 this 被标注为 HTMLElement
  console.log(this.id); // ✅
  this.foo(); // ❌ HTMLElement 没有 foo 方法
});

// 箭头函数不能声明 this（因为箭头函数没有自己的 this）
```

**Q25: 函数重载（Function Overloads）**

TS 支持为同一个函数声明多个签名（重载签名），然后写一个实现签名：

```ts
// 重载签名 —— 对外可见
function parse(input: string): number;
function parse(input: number): string;
function parse(input: boolean): boolean;

// 实现签名 —— 对外不可见，必须兼容所有重载
function parse(input: string | number | boolean) {
  if (typeof input === "string") return Number(input);
  if (typeof input === "number") return String(input);
  return input;
}

const n = parse("42"); // n: number（TS 根据参数类型确定返回类型）
const s = parse(42); // s: string
const b = parse(true); // b: boolean
```

**注意事项：**

- 实现签名必须比所有重载签名都**更宽泛**（参数和返回值类型都是重载的联合）
- 调用者只能看到重载签名，看不到实现签名
- 实现内部必须自己处理类型收窄（TS 不会自动帮你）

---

### 2.8 枚举（Enum）与 `as const`

**Q26: `const enum` 与普通 `enum` 有什么区别？与 `as const` 对象又有什么区别？**

```ts
// 普通 enum —— 会编译为 JS 代码（一个对象 + 反向映射）
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
// 编译后（字符串枚举没有反向映射）：
// var Direction;
// (function (Direction) {
//     Direction["Up"] = "UP";
//     Direction["Down"] = "DOWN";
// })(Direction || (Direction = {}));

// const enum —— 编译时被内联为具体值，不生成任何 JS 代码
const enum Status {
  Draft,
  Published,
}
let s = Status.Published; // 编译后 → let s = 1;

// as const 对象 —— 完全使用 JS 的运行时能力，配合 typeof 提取类型
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
} as const;
type Method = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
// => "GET" | "POST"
```

**三者对比：**

| 方案            | 有运行时代码       | 可反向映射   | Tree-shaking               | 类型精度           |
| --------------- | ------------------ | ------------ | -------------------------- | ------------------ |
| `enum`          | ✅                 | 数字枚举支持 | 较差（打包工具要特殊处理） | 成员为字面量类型   |
| `const enum`    | ❌                 | ❌           | 好（无代码）               | 成员为字面量类型   |
| `as const` 对象 | ✅（就是普通对象） | ❌           | 好                         | 通过 `typeof` 提取 |

**推荐**：在现代 TS 项目中，除非有特定需求（如需要反向映射或使用枚举的某些反射能力），否则**`as const` 对象**更简单、更接近原生 JS，且行为可预测，是越来越受欢迎的方案。

---

## 三、高级类型工具

### 3.1 常用内置类型工具速查

TS 内置了很多类型工具，掌握它们的**定义方式**比掌握用法更重要（因为它们揭示了 TS 类型系统的能力）。

```ts
// 1. Partial<T> —— T 的所有属性变可选
type Partial<T> = { [K in keyof T]?: T[K] };

// 2. Required<T> —— T 的所有属性变必填
type Required<T> = { [K in keyof T]-?: T[K] };

// 3. Readonly<T> —— T 的所有属性变只读
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// 4. Pick<T, K> —— 从 T 中挑出 K 指定的属性
type Pick<T, K extends keyof T> = { [P in K]: T[P] };

// 5. Omit<T, K> —— 从 T 中删除 K 指定的属性（TS 3.5+）
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
interface Todo {
  id: number;
  title: string;
  done: boolean;
}
type TodoPreview = Omit<Todo, "done">; // { id: number; title: string }

// 6. Record<K, T> —— 键为 K、值为 T 的对象类型
type Record<K extends keyof any, T> = { [P in K]: T };

// 7. Exclude<T, U> —— 从 T 的联合中排除可以赋值给 U 的
type Exclude<T, U> = T extends U ? never : T;

// 8. Extract<T, U> —— 从 T 的联合中提取可以赋值给 U 的
type Extract<T, U> = T extends U ? T : never;

// 9. NonNullable<T> —— 从 T 中排除 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T;
type NN = NonNullable<string | number | null | undefined>; // string | number

// 10. ReturnType<T> —— 获取函数返回类型
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
type R = ReturnType<() => { a: number }>; // { a: number }

// 11. Parameters<T> —— 获取函数参数类型元组
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
type P = Parameters<(a: string, b: number) => void>; // [string, number]

// 12. ConstructorParameters<T> —— 获取构造函数参数类型
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
class Foo {
  constructor(a: number, b: string) {}
}
type CP = ConstructorParameters<typeof Foo>; // [number, string]

// 13. InstanceType<T> —— 获取构造函数的实例类型
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;
type FI = InstanceType<typeof Foo>; // Foo

// 14. ThisParameterType<T> —— 提取函数的 this 类型
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any
  ? U
  : unknown;

// 15. OmitThisParameter<T> —— 移除函数的 this 参数
type OmitThisParameter<T> =
  unknown extends ThisParameterType<T>
    ? T
    : T extends (...args: infer A) => infer R
      ? (...args: A) => R
      : T;

// 16. Awaited<T> —— 递归解开 Promise（TS 4.5+）
type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
    ? F extends (value: infer V, ...args: infer _) => any
      ? Awaited<V>
      : never
    : T;
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
type C = Awaited<string | Promise<boolean>>; // string | boolean
```

### 3.2 字符串操作类型（TS 4.1+）

```ts
// 以下是 TS 内置的 4 个字符串操作类型
// 它们是"魔法"类型 —— 定义在 lib.es5.d.ts 中但没有 TS 源代码实现（编译器内置）

type U1 = Uppercase<"hello">; // "HELLO"
type L1 = Lowercase<"HELLO">; // "hello"
type C1 = Capitalize<"hello">; // "Hello"
type UC1 = Uncapitalize<"Hello">; // "hello"

// 配合模板字面量实现高级类型编程
type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S;
type CC = CamelCase<"user_profile_name">; // "userProfileName"

type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? `_${Lowercase<Head>}${SnakeCase<Tail>}`
    : `${Head}${SnakeCase<Tail>}`
  : S;
type SC = SnakeCase<"userProfileName">; // "user_profile_name"（注意首字母不会加下划线，实际实现需更精细）
```

### 3.3 实战：自己实现常见类型工具

**Q27: 手写 `DeepReadonly<T>` —— 递归地将所有属性设为只读**

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function // 函数不需要递归
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K];
};

interface Nested {
  a: { b: { c: number } };
}
type ReadonlyNested = DeepReadonly<Nested>;
// { readonly a: { readonly b: { readonly c: number } } }
```

**Q28: 手写 `DeepPartial<T>` —— 递归地将所有属性设为可选**

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};
```

**Q29: 手写 `First<T>` —— 获取元组的第一个元素**

```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type F1 = First<[string, number, boolean]>; // string
type F2 = First<[]>; // never
```

**Q30: 手写 `Length<T>` —— 获取元组长度**

```ts
type Length<T extends any[]> = T["length"];
type L = Length<[1, 2, 3]>; // 3
```

**Q31: 手写 `Concat<A, B>` —— 连接两个元组**

```ts
type Concat<A extends any[], B extends any[]> = [...A, ...B];
type C = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]
```

**Q32: 手写 `If<Condition, True, False>` —— 类型级别的 if**

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
type A = If<true, string, number>; // string
type B = If<false, string, number>; // number
```

---

## 四、类型体操实战

### 4.1 递归条件类型

**Q33: 实现 `Get<O, P>` —— 按字符串路径访问对象类型**

```ts
type Get<O, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof O
    ? Get<O[K], Rest>
    : never
  : P extends keyof O
    ? O[P]
    : never;

interface User {
  address: { city: { name: string } };
}
type CityName = Get<User, "address.city.name">; // string
```

**Q34: 实现 `PathOf<T>` —— 生成对象所有可能的路径字符串**

```ts
type PathOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: `${Prefix}${K}` | PathOf<T[K], `${Prefix}${K}.`>;
    }[keyof T & string]
  : never;

interface User {
  id: number;
  address: { city: string; zip: string };
}
type P = PathOf<User>; // "id" | "address" | "address.city" | "address.zip"
```

### 4.2 元组操作

**Q35: `Pop<T>` —— 移除元组最后一个元素**

```ts
type Pop<T extends any[]> = T extends [...infer R, any] ? R : [];
type P = Pop<[1, 2, 3]>; // [1, 2]
```

**Q36: `Shift<T>` —— 移除元组第一个元素**

```ts
type Shift<T extends any[]> = T extends [any, ...infer R] ? R : [];
type S = Shift<[1, 2, 3]>; // [2, 3]
```

**Q37: `Repeat<T, N>` —— 创建长度为 N、元素为 T 的元组**

```ts
type Repeat<T, N extends number, R extends any[] = []> = R["length"] extends N
  ? R
  : Repeat<T, N, [T, ...R]>;
type FiveStrings = Repeat<string, 5>; // [string, string, string, string, string]
```

**Q38: `Add<A, B>` —— 类型级别的数字加法（借助元组长度）**

```ts
type BuildArr<N extends number, R extends any[] = []> = R["length"] extends N
  ? R
  : BuildArr<N, [...R, any]>;

type Add<A extends number, B extends number> = [
  ...BuildArr<A>,
  ...BuildArr<B>,
]["length"];
type S = Add<3, 5>; // 8

type Sub<A extends number, B extends number> =
  BuildArr<A> extends [...BuildArr<B>, ...infer R] ? R["length"] : never;
type D = Sub<10, 3>; // 7
```

### 4.3 联合类型操作

**Q39: `UnionToIntersection<U>` —— 联合变交叉**

```ts
// 利用"函数参数位置的逆变"特性
type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (
  x: infer I,
) => any
  ? I
  : never;

type U = { a: number } | { b: string };
type I = UnionToIntersection<U>; // { a: number } & { b: string }
```

**关键原理 —— 逆变与协变（Contravariance & Covariance）：**

- **协变（Covariant）**：`A extends B` → `F<A> extends F<B>`（如函数返回值、readonly 数组）
- **逆变（Contravariant）**：`A extends B` → `F<B> extends F<A>`（如函数参数）
- **不变（Invariant）**：两者都不成立（如 `Array<T>` 是不变的，因为既读又写）

函数参数是逆变位置。当 TS 要从 `(x: A) => any | (x: B) => any` 推断出一个统一的函数类型 `(x: infer I) => any` 时，**I 必须同时满足 A 和 B**，也就是 `A & B`。这是联合变交叉的核心机制。

**Q40: `IsUnion<T>` —— 判断是不是联合类型**

```ts
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never;
type IU1 = IsUnion<string | number>; // true
type IU2 = IsUnion<string>; // false
```

**Q41: `Permutation<T>` —— 生成联合类型的全排列**

```ts
type Permutation<T, U = T> = [T] extends [never]
  ? []
  : T extends any
    ? [T, ...Permutation<Exclude<U, T>>]
    : never;
type P = Permutation<"A" | "B" | "C">;
// ["A","B","C"] | ["A","C","B"] | ["B","A","C"] | ["B","C","A"] | ["C","A","B"] | ["C","B","A"]
```

---

## 五、配置与工程化

### 5.1 `tsconfig.json` 关键配置

**Q42: `strict` 开启了哪些检查？**

`"strict": true` 会同时开启以下严格检查（推荐所有新项目开启）：

| 选项                           | 说明                                       |
| ------------------------------ | ------------------------------------------ |
| `noImplicitAny`                | 禁止隐式 `any`，无法推断类型时必须显式标注 |
| `strictNullChecks`             | `null`/`undefined` 不能赋值给其他类型      |
| `strictFunctionTypes`          | 函数参数采用逆变检查（更严格）             |
| `strictBindCallApply`          | `bind`/`call`/`apply` 检查参数类型         |
| `strictPropertyInitialization` | 类属性必须在声明或构造函数中初始化         |
| `noImplicitThis`               | `this` 不能隐式为 `any`                    |
| `alwaysStrict`                 | 每个文件都用严格模式解析                   |

**Q43: `target`、`module`、`lib` 分别是什么？**

- **`target`**：编译后 JS 的**语言版本**（如 ES5、ES2020、ESNext）。决定了 `let`/`const` 是否转成 `var`、箭头函数是否转成普通函数等。
- **`module`**：编译后使用的**模块系统**（CommonJS、ES2020、AMD、System、UMD、NodeNext 等）。决定了 `import/export` 如何转写。
- **`lib`**：编译时包含哪些**内置类型声明**（如 `ES2020`、`DOM`、`DOM.Iterable`、`ScriptHost` 等）。不影响编译产物，只影响"你能使用哪些 API 而不报错"。

**典型配置：**

```jsonc
{
  "compilerOptions": {
    "target": "ES2020", // 输出为 ES2020（现代浏览器/Node 14+ 原生支持）
    "module": "ESNext", // 使用 ES Modules
    "lib": ["ES2020", "DOM"], // 可以使用 ES2020 的 API 和 DOM API
    "strict": true,
    "moduleResolution": "bundler", // TS 5+，配合 Vite/Rollup/webpack 使用
    "jsx": "react-jsx", // React 17+ 的新 JSX 转换
    "esModuleInterop": true, // 让 CommonJS 模块像 ES Module 一样 import
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true, // 输出 .d.ts 声明文件
    "outDir": "./dist",
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
}
```

**Q44: `moduleResolution` 的不同策略？**

| 策略                  | 说明                                           | 适用场景                    |
| --------------------- | ---------------------------------------------- | --------------------------- |
| `classic`             | 旧策略，TypeScript 原生，不处理 node_modules   | 老项目                      |
| `node`（Node10）      | CommonJS 风格的解析                            | Node.js CommonJS 项目       |
| `node16` / `nodenext` | 根据 `package.json` 的 `type` 字段切换解析方式 | Node.js 16+ 现代化 ESM 项目 |
| `bundler`（TS 5+）    | 类似 Vite/Rollup/webpack 的解析逻辑            | 使用打包工具的项目（推荐）  |

**Q45: `esModuleInterop` 解决了什么问题？**

```ts
// 没有 esModuleInterop 时：
// import React from "react" 会报错（因为 React 是 CommonJS 模块，没有 default export）
// 必须写成 import * as React from "react"

// 开启 esModuleInterop 后：
import React from "react"; // ✅ 可以正常写
// TS 编译时会自动生成兼容代码（通过 __importDefault 辅助函数处理 default export）
```

### 5.2 声明文件（`.d.ts`）与模块声明

**Q46: 什么是 `.d.ts` 文件？它和 `.ts` 文件有什么区别？**

`.d.ts` 是 TypeScript 的**声明文件**（Declaration File），只包含类型声明，**不包含任何可执行代码**，编译后不会产生 JS。

```ts
// math.d.ts —— 声明文件
export function add(a: number, b: number): number;
export const PI: number;

// math.js —— 实际实现（运行时使用）
// module.exports = { add: (a, b) => a + b, PI: 3.14 };
```

**何时需要自己写声明文件：**

1. **为纯 JS 库提供类型**（如旧版 jQuery、lodash-es 之前的 lodash）
2. **为项目中的非 TS 文件声明类型**（如图片、CSS Modules）
3. **扩展全局对象**（如给 `window` 增加属性）

**Q47: `declare global`、`declare module`、`declare namespace` 的区别？**

```ts
// 1. declare global —— 扩展全局作用域（必须在模块中使用，即文件有 import/export）
declare global {
  interface Window {
    myGlobal: { version: string };
  }
}
window.myGlobal.version; // ✅

// 2. declare module —— 声明一个模块的类型
declare module "*.svg" {
  const content: string;
  export default content;
}
// 现在 import logo from "./logo.svg" 不会报错

// 3. declare namespace —— 声明命名空间（历史遗留，现代 TS 用 ES Module 代替）
declare namespace MyLib {
  function doSomething(): void;
  const version: string;
}
MyLib.doSomething();
```

**Q48: `/// <reference path="..." />` 三斜线指令是什么？**

三斜线指令是 TS 早期用来"引用"其他声明文件的方式，**在现代项目中几乎不再使用**（被 ES Module 的 `import` 代替）。你可能在一些老的 `.d.ts` 文件和手动配置的场景中看到：

```ts
/// <reference types="node" />        // 引用 node 的类型声明
/// <reference lib="es2020" />        // 相当于在 tsconfig 的 lib 中添加 es2020
/// <reference path="other.d.ts" />   // 引用另一个声明文件
```

---

## 六、类与面向对象

### 6.1 类的成员修饰符

**Q49: TS 类的修饰符 `public`、`private`、`protected`、`readonly` 有什么区别？**

| 修饰符                    | 类内部 | 子类 | 外部实例 | 可被重新赋值                    |
| ------------------------- | ------ | ---- | -------- | ------------------------------- |
| `public`（默认）          | ✅     | ✅   | ✅       | ✅                              |
| `protected`               | ✅     | ✅   | ❌       | ✅                              |
| `private`                 | ✅     | ❌   | ❌       | ✅                              |
| `#private`（JS 原生私有） | ✅     | ❌   | ❌       | ✅                              |
| `readonly`                | ✅     | ✅   | ✅       | ❌（只能在声明/构造函数中赋值） |

**代码示例：**

```ts
class Animal {
  public name: string;
  protected age: number;
  private secret: string;
  readonly id: string;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
    this.secret = "hidden";
    this.id = "animal-" + Math.random();
  }
}

class Dog extends Animal {
  greet() {
    console.log(this.name); // ✅ public
    console.log(this.age); // ✅ protected —— 子类可见
    // console.log(this.secret); // ❌ private —— 子类不可见
  }
}

const dog = new Dog("Buddy", 3);
console.log(dog.name); // ✅
// console.log(dog.age);  // ❌
// console.log(dog.secret); // ❌
// dog.id = "new-id";      // ❌ readonly
```

**`private` vs `#` 原生私有字段**：

- `private` 是 **TS 的编译时检查**，编译后和普通属性没有区别（外部 JS 代码仍能访问）
- `#field` 是 **ES2022 原生私有字段**，运行时也不可访问（真正的私有）

### 6.2 抽象类与接口

**Q50: 抽象类（abstract class）和接口（interface）有什么区别？**

```ts
// 抽象类 —— 可以有实现代码
abstract class Animal {
  abstract makeSound(): void; // 抽象方法：子类必须实现
  move(): void {
    // 普通方法：有默认实现
    console.log("Moving...");
  }
}

// 接口 —— 只有声明，没有实现
interface Flyable {
  fly(): void;
}

class Bird extends Animal implements Flyable {
  makeSound() {
    console.log("Chirp");
  }
  fly() {
    console.log("Flying");
  }
}
```

| 特性                | 抽象类                         | 接口                       |
| ------------------- | ------------------------------ | -------------------------- |
| 有实现代码          | ✅                             | ❌                         |
| 有构造函数          | ✅                             | ❌                         |
| 有成员字段/状态     | ✅                             | ❌                         |
| 多继承              | ❌（一个类只能继承一个抽象类） | ✅（`implements A, B, C`） |
| 编译到 JS           | ✅（会生成 class 代码）        | ❌（完全消失）             |
| 可使用 `instanceof` | ✅                             | ❌                         |

---

## 七、实战模式

### 7.1 可辨识联合（Discriminated Unions）

**Q51: 什么是可辨识联合？它有什么价值？**

可辨识联合是处理复杂状态的最佳 TS 模式。它要求联合中的每个类型都有**一个共同的、可以用来做区分的属性**（叫做"tag"或"discriminator"）：

```ts
// 场景：异步请求的三种状态
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T };
type ErrorState = { status: "error"; error: string };
type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function render<T>(state: AsyncState<T>) {
  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "success":
      return <Display data={state.data} />; // state.data 类型安全
    case "error":
      return <Alert message={state.error} />;
  }
}
```

**为什么好**：

- **穷尽性检查**：`switch` 遗漏某个分支时 TS 会报错（配合 `never` 检查）
- **类型安全**：在每个分支内 TS 知道当前是哪个子类型，可以直接访问对应的属性
- **无非法状态**：`success` 状态必有 `data`、`error` 状态必有 `error`，杜绝了"success 但 data 为空"的无效状态

**在 Redux/Vuex/useReducer 中极为常见**：每个 action 都有一个 `type` 字段作为辨识符。

### 7.2 类型提取模式

**Q52: 如何从现有值"提取"出类型？**

```ts
// 1. typeof —— 从值得到类型
const user = { name: "Tom", age: 18 };
type User = typeof user; // { name: string; age: number }

// 2. as const + typeof —— 得到最精确的字面量类型
const routes = { home: "/", about: "/about" } as const;
type Routes = typeof routes; // { readonly home: "/"; readonly about: "/about" }
type RoutePaths = Routes[keyof Routes]; // "/" | "/about"

// 3. ReturnType/Parameters —— 从函数提取
function createUser(name: string, age: number) {
  return { id: 1, name, age };
}
type CreateUserParams = Parameters<typeof createUser>; // [string, number]
type CreatedUser = ReturnType<typeof createUser>; // { id: number; name: string; age: number }

// 4. Awaited —— 从 Promise 提取
async function fetchUser(): Promise<{ id: number }> {
  return { id: 1 };
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>; // { id: number }
```

**"值优先"的风格**：在很多场景下，先写运行时的值，再用 `typeof` 提取类型，比"先写类型再写值"更简洁。TS 的类型系统很大一部分就是围绕"从值推导类型"设计的。

### 7.3 受控类型 vs 类型标注

**Q53: 何时需要显式标注类型，何时应该让 TS 推断？**

**让 TS 推断（优先）：**

```ts
// ✅ 让 TS 推断，代码更简洁
const name = "Tom"; // string
const user = { name: "Tom", age: 18 };
const add = (a: number, b: number) => a + b; // 返回 number 会被自动推断
```

**必须显式标注：**

```ts
// 1. 函数参数（除非有默认值或上下文能推断）
function greet(name: string) {
  /* ... */
}

// 2. 你想要一个更宽泛的类型（而不是字面量类型）
let direction: "up" | "down" = "up"; // 如果不标注，后续赋值为 "down" 会报错
direction = "down";

// 3. 空数组（否则推断为 never[]）
const items: string[] = [];
items.push("a");

// 4. 依赖注入、接口实现
interface Repository {
  /* ... */
}
class UserRepository implements Repository {
  /* ... */
}
const repo: Repository = new UserRepository(); // 使用 Repository 抽象
```

**需要显式标注返回类型的场景：**

- 复杂函数的返回类型（确保和你预期一致）
- 递归函数
- 需要确保返回类型精确（如确保返回的是 `never` 而非 `undefined`）

---

## 八、React + TypeScript 实战问题

### 8.1 Props 类型定义

**Q54: 如何给 React 组件的 Props 标注类型？**

```tsx
// 函数组件 —— 最推荐的方式（不使用 React.FC，避免隐式 children 和 defaultProps 问题）
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

// children 的类型
interface ContainerProps {
  children: React.ReactNode; // ✅ 最通用的 children 类型
}
interface ListProps {
  items: string[];
  renderItem: (item: string, index: number) => React.ReactElement; // 函数作为 children
}

// 事件处理函数
interface InputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
```

**React 中常用的工具类型：**

```ts
// 原生 HTML 属性 —— 复用已有属性类型
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  special: string; // 自定义属性
};

// 复用某个组件的 Props
import { Button } from "antd";
type MyButtonProps = React.ComponentProps<typeof Button>; // 拿到 Button 的所有 Props 类型

// 获取 ref 的类型
const inputRef = useRef<HTMLInputElement>(null);
```

### 8.2 useState 与泛型

```tsx
// 简单情况 —— TS 能推断
const [count, setCount] = useState(0); // count: number

// 初始值为 null 或 undefined —— 必须标注
const [user, setUser] = useState<User | null>(null);
const [list, setList] = useState<string[]>([]);

// 使用回调函数的返回值推断（TS 4.7+）
const [value, setValue] = useState(() => loadValue()); // 从 loadValue() 返回类型推断
```

---

## 九、常见陷阱

### 9.1 常见错误与误解

**Q55: TS 类型系统有哪些常见陷阱？**

**陷阱 1：`any` 污染**

```ts
let x: any = 123;
let y = x + "hello"; // y 的类型是 any（被污染）
y.nonexistent.method(); // 编译不报错，运行时崩
```

**陷阱 2：`as` 断言跳过了实际检查**

```ts
const data = JSON.parse('{"name":"Tom"}') as { id: number; name: string };
console.log(data.id.toFixed(2)); // 编译通过，但 data.id 实际是 undefined！运行时崩溃
// 解决方案：用类型守卫 + unknown，而不是直接 as
```

**陷阱 3：结构类型的宽松匹配**

```ts
interface User {
  name: string;
}
function greet(u: User) {
  console.log(u.name);
}
const admin = { name: "Admin", level: 99 };
greet(admin); // ✅ 可以传入（结构匹配）

// 但对象字面量直接传入时会有" excess property check "（多余属性检查）
greet({ name: "Admin", level: 99 }); // ❌ 报错！对象字面量有多余属性
// 解释：TS 认为你用字面量时很可能写错了属性名，所以额外做一次严格检查
// 解决：先赋值给变量或用类型断言
```

**陷阱 4：数组类型的不变性**

```ts
function append(nums: number[]) {
  nums.push(42);
}
const nums: (number | string)[] = [1, 2, "a"];
// append(nums); // ❌ 报错！虽然 number 是 (number | string) 的子类型
// 但数组是不变的（可写可读），如果允许传，append 内部可以 push 一个纯 number，
// 导致外部的 (number | string)[] 数组中出现纯 number —— 这是不安全的
```

**陷阱 5：`never` 类型出现在条件类型中**

```ts
type Test<T> = T extends string ? "yes" : "no";
type R = Test<never>; // never（而不是 "no"！）
// 解释：never 是空联合，条件类型分发到空联合时结果永远是 never
```

**陷阱 6：函数重载与实现签名**

```ts
function foo(x: string): number;
function foo(x: number): string;
function foo(x: string | number) {
  // 内部 TS 不会帮你做收窄 —— 实现签名的参数是联合类型
  // 你需要自己用 typeof 等方式收窄
  return typeof x === "string" ? x.length : String(x);
}
```

**陷阱 7：枚举的数字扩展**

```ts
enum E {
  A = 1,
  B = 2,
}
let e: E = 100; // ✅ 数字枚举可以接受任意 number（TS 的历史行为）
// 解决：用字符串枚举或 as const 对象
```

---

## 十、类型系统核心理论

### 10.1 结构化类型 vs 名义类型

**Q56: TypeScript 的类型系统是结构化的（Structural）还是名义的（Nominal）？**

TS 是**结构化类型系统**（也叫鸭子类型系统）—— 两个类型的**结构相同就被认为是相同的**，不需要同名。

```ts
interface User {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
}
let u: User = { id: 1, name: "Tom" };
let p: Product = u; // ✅ 编译通过（结构相同）
```

对比 Java/C# 的**名义类型系统**：即使两个类字段完全一样，类名不同就是不同类型。

**如何在 TS 中模拟名义类型？**

```ts
// 品牌类型（Branded Types）—— 通过一个私有字段区分
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, "UserId">;
type OrderId = Brand<number, "OrderId">;

function fetchUser(id: UserId) {}
function createUserId(id: number): UserId {
  return id as UserId;
}

fetchUser(createUserId(1)); // ✅
fetchUser(123 as OrderId); // ❌ OrderId 不能当 UserId 用
```

### 10.2 协变、逆变、不变

**Q57: 什么是协变/逆变/不变？TS 中如何体现？**

```ts
// 定义：F 是类型构造器（如 Array<T>、(x: T) => void）
// 协变（Covariant）：A extends B → F<A> extends F<B>
// 逆变（Contravariant）：A extends B → F<B> extends F<A>
// 不变（Invariant）：两者都不成立

// 1. 函数返回值 —— 协变
type Producer<T> = () => T;
// 如果 string extends unknown，那么 (() => string) extends (() => unknown) ✅

// 2. 函数参数 —— 逆变（strictFunctionTypes 开启后）
type Consumer<T> = (x: T) => void;
// 如果 string extends unknown，那么 ((x: unknown) => void) extends ((x: string) => void) ✅
// （直觉：能消费任意值的函数当然能消费字符串）

// 3. 只读数组 —— 协变
type ReadonlyArr<T> = readonly T[];

// 4. 普通可写数组 —— 不变
// 原因：array 既要读又要写。如果 number[] extends (number | string)[] 成立，
// 那么就能把 number 数组传给接受 (number | string)[] 的函数，
// 该函数内部可能 push("hello")，结果外部的 number[] 数组里出现了 string —— 不安全。
```

**记忆口诀**：函数返回值位置是**协变**，参数位置是**逆变**，可读可写的容器是**不变**。

---

## 十一、面试高频题精选

### 基础题

1. **`interface` 和 `type` 的区别？如何选择？** → 见 1.4
2. **`any`、`unknown`、`never`、`void` 的区别？** → 见 1.2
3. **`null` 和 `undefined` 有什么区别？`strictNullChecks` 的影响？** → 见 1.2
4. **什么是泛型？有什么用？`extends` 在泛型中是什么意思？** → 见 2.1
5. **什么是联合类型、交叉类型？** → 见 1.3
6. **TS 如何做类型收窄？有哪些手段？** → 见 1.3

### 进阶题

7. **什么是条件类型？`infer` 是什么？** → 见 2.2
8. **什么是映射类型？`Partial`/`Required`/`Pick`/`Omit` 是如何实现的？** → 见 2.3 & 3.1
9. **`keyof` 是什么？`T[K]` 索引访问有什么价值？** → 见 2.5
10. **`const enum` 和普通 `enum` 的区别？和 `as const` 对象比呢？** → 见 2.8
11. **`ReturnType`、`Parameters`、`Awaited` 是做什么的？如何实现？** → 见 3.1
12. **TS 的类型系统是结构化还是名义的？如何模拟名义类型？** → 见 10.1
13. **什么是协变、逆变、不变？在 TS 中如何体现？** → 见 10.2
14. **什么是可辨识联合（Discriminated Union）？** → 见 7.1
15. **什么是声明合并（Declaration Merging）？** → 见 1.4

### 类型体操题

16. **手写 `DeepReadonly<T>`** → 见 3.3
17. **手写 `Get<O, P>` 按路径访问** → 见 4.1
18. **手写 `UnionToIntersection<U>` —— 原理是什么？** → 见 4.3
19. **什么是分布式条件类型？`Exclude` 为什么能实现？** → 见 2.2
20. **手写 `Permutation<T>` 全排列** → 见 4.3

### 工程化题

21. **`tsconfig.json` 的 `strict` 开启了什么？** → 见 5.1
22. **`target`、`module`、`lib` 的区别？** → 见 5.1
23. **什么是 `.d.ts` 文件？`declare module`/`declare global`/`declare namespace` 有什么用？** → 见 5.2
24. **`moduleResolution` 的 `node`/`bundler`/`nodenext` 有什么区别？** → 见 5.1
25. **`esModuleInterop` 解决了什么问题？** → 见 5.1

---

## 十二、学习路径总结

### 从入门到精通的 TypeScript 学习路线

```
阶段 1：基础类型
├── 原始类型（string/number/boolean/null/undefined）
├── 数组/元组/对象
├── 联合/交叉类型
├── 类型收窄（typeof/in/===）
└── type vs interface

阶段 2：面向对象
├── 类的修饰符（public/private/protected/readonly）
├── 抽象类 vs 接口
├── 类与泛型
└── implements/extends

阶段 3：泛型与类型工具
├── 泛型函数/接口/类
├── 泛型约束（extends）
├── 内置工具类型（Partial/Pick/Record/...）
├── 理解工具类型的实现原理
└── keyof / typeof

阶段 4：高级类型
├── 条件类型（T extends U ? X : Y）
├── infer 关键字
├── 映射类型（{ [K in keyof T]: ... }）
├── 模板字面量类型
└── 递归类型

阶段 5：类型体操
├── 元组操作
├── 联合类型变换（UnionToIntersection 等）
├── 逆变/协变原理
├── 路径访问/路径生成
└── 类型级编程（类型级别数字运算等）

阶段 6：工程化实战
├── tsconfig.json 深入
├── 声明文件与 declare
├── 与 React/Vue 结合
├── 类型声明库（@types/*）
├── TS 版本迁移
└── 性能优化（类型复杂度）
```

**学习资源推荐：**

- 官方 Handbook：[typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- type-challenges：[github.com/type-challenges/type-challenges](https://github.com/type-challenges/type-challenges) —— 从 easy 到 extreme 的类型练习
- TS 每周更新（TS Blog）：了解新特性
- 阅读真实项目的类型声明：Redux、React Query、Zod 等库的类型定义质量非常高

**实战建议：**

1. 新项目默认开启 `"strict": true`
2. 尽量避免 `any`，能用 `unknown` 就用 `unknown`
3. 优先用类型推断，仅在必要时标注类型
4. 用可辨识联合（Discriminated Union）处理复杂状态
5. 复杂类型拆分成多个命名类型，可读性比"一行写完"更重要
6. 学习 `type-challenges` 时，不要死磕最 extreme 的题，理解原理比能写出答案更重要
