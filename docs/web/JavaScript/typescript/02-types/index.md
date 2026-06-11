# TypeScript 类型系统

TypeScript 的核心在于其强大的类型系统。本章深入介绍泛型、高级类型和类型守卫。

## 1. 联合类型与交叉类型

### 1.1 联合类型（Union）

```typescript
// 联合类型 - 值可以是多种类型之一
let value: string | number;
value = "hello";  // OK
value = 42;       // OK
// value = true;  // 错误

// 常见用法：函数参数
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.trim();
  }
  return value.toFixed(2);
}
```

### 1.2 交叉类型（Intersection）

```typescript
// 交叉类型 - 将多个类型合并为一个
interface BusinessPartner {
  name: string;
  credit: number;
}

interface Identity {
  id: number;
  name: string;
}

interface Contact {
  email: string;
  phone: string;
}

type Employee = Identity & Contact;
type Customer = BusinessPartner & Contact;

const employee: Employee = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  phone: "123-456",
};
```

---

## 2. 泛型（Generics）

### 2.1 泛型函数

```typescript
// 不使用泛型 - 类型丢失
function identity1(arg: any): any {
  return arg;
}

// 使用泛型 - 保留类型信息
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity("myString"); // 类型推断为 string
let output2 = identity<number>(42); // 显式指定类型
```

### 2.2 泛型接口

```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 2.3 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

let numberUtils = new GenericNumber<number>(0, (x, y) => x + y);
let stringUtils = new GenericNumber<string>("", (x, y) => x + y);
```

### 2.4 泛型约束

```typescript
// 使用 extends 约束泛型
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 现在可以访问 .length
  return arg;
}

logLength("hello");     // OK - string 有 length
logLength([1, 2, 3]);   // OK - array 有 length
// logLength(123);      // 错误 - number 没有 length

// 在泛型约束中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let person = { name: "Alice", age: 25 };
getProperty(person, "name"); // OK
// getProperty(person, "gender"); // 错误
```

### 2.5 常用工具泛型

```typescript
// Partial<T> - 将所有属性变为可选
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type PartialTodo = Partial<Todo>;
// { title?: string; description?: string; completed?: boolean; }

function updateTodo(todo: Todo, fields: Partial<Todo>): Todo {
  return { ...todo, ...fields };
}

// Required<T> - 将所有属性变为必选
type RequiredTodo = Required<PartialTodo>;

// Readonly<T> - 将所有属性变为只读
type ReadonlyTodo = Readonly<Todo>;

// Pick<T, K> - 从 T 中选取部分属性
type TodoPreview = Pick<Todo, "title" | "completed">;
// { title: string; completed: boolean; }

// Omit<T, K> - 从 T 中排除部分属性
type TodoInfo = Omit<Todo, "completed">;
// { title: string; description: string; }

// Record<K, T> - 构造键为 K、值为 T 的类型
type PageInfo = Record<string, { title: string; url: string }>;

// Exclude<T, U> - 从 T 中排除 U
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract<T, U> - 从 T 中提取 U
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable<T> - 排除 null 和 undefined
type T2 = NonNullable<string | null | undefined>; // string

// ReturnType<T> - 获取函数返回值类型
function getUser() { return { name: "Alice", age: 25 }; }
type User = ReturnType<typeof getUser>; // { name: string; age: number; }

// Parameters<T> - 获取函数参数类型
type UserParams = Parameters<typeof getUser>; // []

// InstanceType<T> - 获取构造函数实例类型
class Person { name: string; }
type PersonInstance = InstanceType<typeof Person>;
```

---

## 3. 类型守卫（Type Guards）

### 3.1 typeof 守卫

```typescript
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // TypeScript 知道这里是 string
  } else {
    console.log(value.toFixed(2)); // TypeScript 知道这里是 number
  }
}
```

### 3.2 instanceof 守卫

```typescript
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

### 3.3 in 守卫

```typescript
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

### 3.4 自定义类型守卫

```typescript
interface Square {
  kind: "square";
  size: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Circle;

// 使用类型谓词
function isSquare(shape: Shape): shape is Square {
  return shape.kind === "square";
}

function getArea(shape: Shape): number {
  if (isSquare(shape)) {
    return shape.size ** 2; // TypeScript 知道 shape 是 Square
  }
  return Math.PI * shape.radius ** 2;
}
```

---

## 4. 条件类型

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 条件类型与联合类型
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]

// infer 关键字 - 在条件类型中推断类型
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() { return { name: "Alice", age: 25 }; }
type UserReturn = ReturnTypeOf<typeof getUser>; // { name: string; age: number; }

// 提取 Promise 内部类型
type Unpacked<T> = T extends Promise<infer U> ? U : T;
type T1 = Unpacked<Promise<string>>;  // string
type T2 = Unpacked<string>;           // string
```

---

## 5. 映射类型

```typescript
// 基本映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 自定义映射类型
type Stringify<T> = {
  [P in keyof T]: string;
};

interface Person {
  name: string;
  age: number;
}

type StringPerson = Stringify<Person>;
// { name: string; age: string; }

// 移除 readonly 修饰符
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 移除可选修饰符
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 键的重映射（TS 4.1+）
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
```

---

## 6. 模板字面量类型

```typescript
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSRule = `${CSSProperty}-${CSSDirection}`;
// "margin-top" | "margin-right" | ... | "padding-left"
```

---

## 小结

| 类型特性 | 说明 | 示例 |
|---------|------|------|
| 联合类型 | 多种类型之一 | `string \| number` |
| 交叉类型 | 合并多种类型 | `A & B` |
| 泛型 | 可复用的类型参数 | `function fn<T>(arg: T): T` |
| 类型守卫 | 运行时类型检查 | `typeof`, `instanceof`, `in` |
| 条件类型 | 类型层面的条件判断 | `T extends U ? X : Y` |
| 映射类型 | 基于旧类型创建新类型 | `{ [P in keyof T]: T[P] }` |

下一步：[高级特性 →](/web/JavaScript/typescript/03-advanced/)
