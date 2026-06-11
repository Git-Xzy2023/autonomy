# TypeScript 高级特性

本章介绍 TypeScript 的高级特性，包括装饰器、声明文件、模块和类型推断。

## 1. 装饰器（Decorators）

:::info
装饰器目前是 Stage 3 提案，需要在 `tsconfig.json` 中启用 `experimentalDecorators`。
:::

### 1.1 类装饰器

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 1.2 方法装饰器

```typescript
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.name;
  }
}
```

### 1.3 属性装饰器

```typescript
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    // 存储元数据
    Reflect.defineMetadata("format", formatString, target, propertyKey);
  };
}

class Employee {
  @format("Hello, %s")
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

### 1.4 参数装饰器

```typescript
function logParameter(target: any, key: string, index: number) {
  const metadataKey = `log_${key}_parameters`;
  if (!Array.isArray(target[metadataKey])) {
    target[metadataKey] = [];
  }
  target[metadataKey].push(index);
}

class Demo {
  greet(@logParameter message: string): string {
    return message;
  }
}
```

---

## 2. 声明文件（.d.ts）

### 2.1 全局声明

```typescript
// global.d.ts
declare var MY_GLOBAL: string;

declare interface User {
  name: string;
  age: number;
}

declare function greet(name: string): string;

declare class Animal {
  name: string;
  constructor(name: string);
  speak(): string;
}
```

### 2.2 模块声明

```typescript
// modules.d.ts
declare module "my-library" {
  export function doSomething(value: string): number;
  export interface Config {
    host: string;
    port: number;
  }
  export default class MyModule {
    constructor(config: Config);
    start(): void;
  }
}
```

### 2.3 为第三方库添加类型

```bash
# 安装 DefinitelyTyped 类型定义
npm install @types/lodash
npm install @types/node
npm install @types/express

# 如果没有 @types，可以创建自定义声明文件
```

```typescript
// custom-types.d.ts
declare module "untyped-library" {
  const untyped: any;
  export default untyped;
}
```

### 2.4 扩展已有类型

```typescript
// 扩展 Window 接口
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

// 扩展 Module 类型
declare module "express" {
  interface Request {
    userId?: string;
  }
}
```

---

## 3. 类型推断

### 3.1 基础推断

```typescript
// 变量推断
let x = 3;           // 推断为 number
let y = "hello";     // 推断为 string
let z = [0, 1, null]; // 推断为 (number | null)[]

// 函数返回值推断
function add(a: number, b: number) {
  return a + b; // 推断返回 number
}
```

### 3.2 最佳通用类型

```typescript
// 当需要从多个类型中推断时，使用最通用的类型
let zoo = [new Rhino(), new Elephant(), new Snake()];
// 推断为 (Rhino | Elephant | Snake)[]

// 如果想指定更具体的类型，需要显式注解
let zoo2: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

### 3.3 上下文类型

```typescript
// TypeScript 根据上下文推断类型
window.onmousedown = function (mouseEvent) {
  // mouseEvent 推断为 MouseEvent
  console.log(mouseEvent.button);
};

// 类型推断也会影响回调函数
const numbers = [1, 2, 3];
numbers.forEach((num) => {
  // num 推断为 number
  console.log(num.toFixed(2));
});
```

---

## 4. 命名空间与模块

### 4.1 命名空间

```typescript
// 适用于旧项目或全局脚本
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isValid(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isValid(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// 使用
let validators: Validation.StringValidator[] = [
  new Validation.LettersOnlyValidator(),
  new Validation.ZipCodeValidator(),
];
```

### 4.2 模块（推荐）

```typescript
// validators.ts
export interface StringValidator {
  isValid(s: string): boolean;
}

// letters-validator.ts
import { StringValidator } from "./validators";

export class LettersOnlyValidator implements StringValidator {
  isValid(s: string): boolean {
    return /^[A-Za-z]+$/.test(s);
  }
}
```

---

## 5. 类型兼容性

### 5.1 结构化类型系统

```typescript
// TypeScript 使用结构化类型（鸭子类型）
interface Named {
  name: string;
}

class Person {
  name: string;
  age: number;
}

let p: Named;
p = new Person(); // OK - Person 有 name 属性

// 只要结构匹配就兼容
function greet(n: Named) {
  console.log("Hello, " + n.name);
}

greet({ name: "Alice" }); // OK
greet({ name: "Bob", age: 25 }); // OK
```

### 5.2 函数兼容性

```typescript
// 参数少的函数可以赋值给参数多的函数类型
type Handler = (a: number, b: number) => void;

function add(a: number): void {
  console.log(a);
}

let handler: Handler = add; // OK - 参数少可以赋值给参数多
```

---

## 6. 类型体操实用技巧

### 6.1 递归类型

```typescript
// 深度 Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// 深度 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};
```

### 6.2 提取嵌套类型

```typescript
// 提取 Promise 链中的最终类型
type Awaited<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? Awaited<U>
    : U
  : T;

type T1 = Awaited<Promise<string>>;           // string
type T2 = Awaited<Promise<Promise<number>>>;  // number
```

---

## 小结

| 特性 | 说明 | 使用场景 |
|------|------|---------|
| 装饰器 | 声明式修改类/方法/属性 | 框架开发、AOP |
| 声明文件 | 为 JS 库提供类型 | 第三方库集成 |
| 类型推断 | 自动推导类型 | 减少冗余注解 |
| 命名空间 | 组织代码结构 | 旧项目迁移 |
| 类型兼容性 | 结构化类型系统 | 接口赋值与继承 |

下一步：[最佳实践 →](/web/JavaScript/typescript/04-best-practices/)
