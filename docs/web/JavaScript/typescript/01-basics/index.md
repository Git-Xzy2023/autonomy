# TypeScript 基础

TypeScript 是 JavaScript 的超集，添加了可选的静态类型检查。本章介绍 TypeScript 的核心基础概念。

## 1. 安装与配置

### 1.1 安装 TypeScript

```bash
# 全局安装
npm install -g typescript

# 查看版本
tsc --version

# 项目本地安装
npm install typescript --save-dev
```

### 1.2 初始化配置

```bash
# 生成 tsconfig.json
tsc --init
```

`tsconfig.json` 常用配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.3 运行 TypeScript

```bash
# 编译单个文件
tsc index.ts

# 编译整个项目
tsc

# 使用 ts-node 直接运行
npx ts-node index.ts
```

---

## 2. 基本类型

### 2.1 原始类型

```typescript
// 布尔值
let isDone: boolean = false;

// 数字
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// 字符串
let color: string = "blue";
let fullName: string = `Bob`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}. I'll be ${age + 1} years old next month.`;

// null 和 undefined
let u: undefined = undefined;
let n: null = null;

// void - 表示没有返回值
function warnUser(): void {
  console.log("This is my warning message");
}

// never - 表示永远不会到达
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### 2.2 类型注解与类型推断

```typescript
// 类型注解 - 显式指定类型
let myName: string = "Alice";
let myAge: number = 25;

// 类型推断 - TypeScript 自动推断类型
let myCity = "Beijing"; // 推断为 string
let myNumber = 42; // 推断为 number

// 最好让 TypeScript 自动推断，除非必要时才添加类型注解
```

---

## 3. 接口（Interface）

### 3.1 基本接口

```typescript
interface Person {
  name: string;
  age: number;
}

function printPerson(person: Person): void {
  console.log(`Name: ${person.name}, Age: ${person.age}`);
}

printPerson({ name: "Alice", age: 25 });
```

### 3.2 可选属性

```typescript
interface Config {
  host: string;
  port: number;
  username?: string; // 可选属性
  password?: string; // 可选属性
}

const config: Config = {
  host: "localhost",
  port: 3306,
};
```

### 3.3 只读属性

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const p1: Point = { x: 10, y: 20 };
// p1.x = 5; // 错误！只读属性不可修改

// ReadonlyArray
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; // 错误！
// ro.push(5); // 错误！
```

### 3.4 索引签名

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];
let myStr: string = myArray[0];

// 字典模式
interface Dictionary {
  [key: string]: string | number;
}

const dict: Dictionary = {
  name: "Alice",
  age: 25,
};
```

---

## 4. 类（Class）

### 4.1 基本类

```typescript
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet(): string {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

### 4.2 访问修饰符

```typescript
class Animal {
  public name: string; // 公共，默认值
  private age: number; // 私有，仅类内部可访问
  protected species: string; // 受保护，类内部和子类可访问

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }

  public getAge(): number {
    return this.age; // 类内部可访问 private 属性
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, "Canis");
  }

  public getSpecies(): string {
    return this.species; // 子类可访问 protected 属性
  }
}

const dog = new Dog("Buddy", 3);
console.log(dog.name); // OK - public
// console.log(dog.age);     // 错误 - private
// console.log(dog.species); // 错误 - protected
```

### 4.3 参数属性（简写）

```typescript
class Animal {
  constructor(
    public name: string,
    private age: number,
    protected species: string,
  ) {}
}
```

### 4.4 抽象类

```typescript
abstract class Shape {
  abstract getArea(): number;

  describe(): string {
    return `面积是 ${this.getArea()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number,
  ) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }
}
```

---

## 5. 函数

### 5.1 函数类型

```typescript
// 命名函数
function add(x: number, y: number): number {
  return x + y;
}

// 匿名函数
let multiply: (x: number, y: number) => number = function (x, y) {
  return x * y;
};

// 箭头函数
const subtract = (x: number, y: number): number => x - y;
```

### 5.2 可选参数与默认参数

```typescript
// 可选参数必须放在最后
function buildName(firstName: string, lastName?: string): string {
  if (lastName) return firstName + " " + lastName;
  return firstName;
}

// 默认参数
function buildName2(firstName: string, lastName: string = "Smith"): string {
  return firstName + " " + lastName;
}
```

### 5.3 剩余参数

```typescript
function add(...numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

add(1, 2); // 3
add(1, 2, 3); // 6
add(1, 2, 3, 4); // 10
```

### 5.4 函数重载

```typescript
function padLeft(value: string, padding: number): string;
function padLeft(value: string, padding: string): string;
function padLeft(value: string, padding: number | string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  return padding + value;
}

padLeft("Hello world", 4); // 返回 "    Hello world"
padLeft("Hello world", ">>"); // 返回 ">>Hello world"
```

---

## 6. 枚举（Enum）

```typescript
// 数字枚举
enum Direction {
  Up = 1,
  Down, // 2
  Left, // 3
  Right, // 4
}

// 字符串枚举
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

// 常量枚举（编译时内联，更高效）
const enum Color {
  Red,
  Green,
  Blue,
}

let c = Color.Red; // 编译后直接变成 0
```

---

## 小结

| 概念     | 说明             | 示例                                |
| -------- | ---------------- | ----------------------------------- |
| 类型注解 | 显式指定变量类型 | `let name: string`                  |
| 类型推断 | TS 自动推断类型  | `let name = "Alice"`                |
| 接口     | 定义对象的形状   | `interface Person { name: string }` |
| 类       | 面向对象编程     | `class Animal { ... }`              |
| 枚举     | 定义命名常量集合 | `enum Direction { Up, Down }`       |

下一步：[类型系统 →](/web/JavaScript/typescript/02-types/)
