# ES7-ES13 新特性

ES6 之后，ECMAScript 每年发布一个新版本。本章介绍 ES7 到 ES13 的重要新特性。

## 1. ES2016（ES7）

### 1.1 Array.prototype.includes

```javascript
// 判断数组是否包含某个值
const arr = [1, 2, 3, NaN];

arr.includes(2);    // true
arr.includes(4);    // false
arr.includes(NaN);  // true（比 indexOf 更好）

// 对比 indexOf
arr.indexOf(NaN);   // -1（indexOf 无法检测 NaN）
arr.indexOf(2) !== -1; // true（写法更繁琐）
```

### 1.2 指数运算符

```javascript
// ** 运算符
2 ** 3;     // 8
2 ** 10;    // 1024

// 等价于 Math.pow
Math.pow(2, 3); // 8

// 赋值运算符
let a = 2;
a **= 3; // a = 8
```

---

## 2. ES2017（ES8）

### 2.1 async/await

```javascript
// Promise 写法
function fetchUser() {
  return fetch("/api/user")
    .then(res => res.json())
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(err => console.error(err));
}

// async/await 写法
async function fetchUser() {
  try {
    const res = await fetch("/api/user");
    const user = await res.json();
    console.log(user);
    return user;
  } catch (err) {
    console.error(err);
  }
}

// 并行执行
async function fetchAll() {
  const [users, posts] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
  ]);
  return { users, posts };
}
```

### 2.2 Object.values / Object.entries

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.values(obj);  // [1, 2, 3]
Object.entries(obj); // [["a", 1], ["b", 2], ["c", 3]]

// 遍历对象
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}

// Object.entries + Map
const map = new Map(Object.entries(obj));
```

### 2.3 Object.getOwnPropertyDescriptors

```javascript
const obj = {
  name: "Alice",
  get age() { return 25; },
};

const descriptors = Object.getOwnPropertyDescriptors(obj);
// {
//   name: { value: "Alice", writable: true, enumerable: true, configurable: true },
//   age: { get: [Function], set: undefined, enumerable: true, configurable: true }
// }

// 正确复制 getter/setter
const clone = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
```

### 2.4 字符串填充

```javascript
"5".padStart(3, "0");    // "005"
"5".padEnd(3, "0");      // "500"
"hello".padStart(10);    // "     hello"

// 实际用途：格式化数字、日期
const num = "123";
num.padStart(6, "0"); // "000123"

const month = "3";
month.padStart(2, "0"); // "03"
```

### 2.5 尾逗号

```javascript
// 函数参数尾逗号
function foo(
  param1,
  param2,
) {}

// 数组/对象尾逗号
const arr = [
  1,
  2,
  3,
];

const obj = {
  a: 1,
  b: 2,
};
```

---

## 3. ES2018（ES9）

### 3.1 对象展开/剩余运算符

```javascript
// 对象展开（已在前一章介绍，ES9 正式标准化）
const { a, ...rest } = { a: 1, b: 2, c: 3 };
console.log(a);    // 1
console.log(rest); // { b: 2, c: 3 }

// 合并对象
const defaults = { theme: "light", lang: "en" };
const user = { theme: "dark" };
const config = { ...defaults, ...user };
```

### 3.2 Promise.prototype.finally

```javascript
function fetchData(showLoading) {
  showLoading();
  return fetch("/api/data")
    .then(res => res.json())
    .catch(err => {
      console.error("请求失败", err);
      throw err;
    })
    .finally(() => {
      hideLoading(); // 无论成功失败都会执行
    });
}
```

### 3.3 异步迭代

```javascript
// for await...of 遍历异步可迭代对象
async function processUrls(urls) {
  for await (const response of getResponses(urls)) {
    console.log(response);
  }
}

async function* getResponses(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    yield response.json();
  }
}
```

---

## 4. ES2019（ES10）

### 4.1 Array.prototype.flat / flatMap

```javascript
// flat - 扁平化数组
[1, [2, [3, [4]]]].flat();     // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2);    // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// flatMap - 先 map 再 flat(1)
const sentences = ["Hello World", "Good Morning"];
const words = sentences.flatMap(s => s.split(" "));
// ["Hello", "World", "Good", "Morning"]

// 实际用途：过滤并转换
const users = [
  { name: "Alice", pets: ["cat", "dog"] },
  { name: "Bob", pets: ["fish"] },
  { name: "Charlie", pets: [] },
];
const allPets = users.flatMap(u => u.pets);
// ["cat", "dog", "fish"]
```

### 4.2 Object.fromEntries

```javascript
// 将键值对数组转为对象
const entries = [["a", 1], ["b", 2], ["c", 3]];
const obj = Object.fromEntries(entries);
// { a: 1, b: 2, c: 3 }

// Map 转对象
const map = new Map([["name", "Alice"], ["age", 25]]);
const obj2 = Object.fromEntries(map);

// 过滤对象属性
const original = { a: 1, b: 2, c: 3, d: 4 };
const filtered = Object.fromEntries(
  Object.entries(original).filter(([key, value]) => value > 2)
);
// { c: 3, d: 4 }
```

### 4.3 String.prototype.trimStart / trimEnd

```javascript
"  hello  ".trimStart(); // "hello  "
"  hello  ".trimEnd();   // "  hello"
"  hello  ".trim();      // "hello"
```

---

## 5. ES2020（ES11）

### 5.1 可选链（Optional Chaining）

```javascript
const user = {
  name: "Alice",
  address: {
    city: "Beijing",
  },
};

// 传统写法
const zip = user && user.address && user.address.zip;

// 可选链
const zip2 = user?.address?.zip; // undefined（不会报错）

// 函数调用
user.getName?.(); // 如果 getName 存在则调用，否则 undefined

// 数组索引
const first = arr?.[0];

// 与 nullish 合并搭配
const city = user?.address?.city ?? "Unknown";
```

### 5.2 空值合并运算符（Nullish Coalescing）

```javascript
// ?? - 只有 null 和 undefined 才使用默认值
const name = null ?? "default";    // "default"
const name2 = undefined ?? "default"; // "default"
const name3 = "" ?? "default";     // ""（空字符串不是 null/undefined）
const name4 = 0 ?? "default";      // 0

// 对比 ||（或运算符）
const count = 0 || 10;    // 10（0 是 falsy，使用了默认值）
const count2 = 0 ?? 10;   // 0（0 不是 null/undefined，保留原值）

// 实际用途
function getConfig(options) {
  return {
    timeout: options.timeout ?? 3000,
    retries: options.retries ?? 3,
    debug: options.debug ?? false,
  };
}
```

### 5.3 BigInt

```javascript
// 创建 BigInt
const big1 = 9007199254740991n;
const big2 = BigInt(9007199254740991);
const big3 = BigInt("9007199254740991");

// 运算
const sum = 1n + 2n; // 3n

// 比较
1n === 1; // false（类型不同）
1n == 1;  // true（宽松比较）
1n < 2;   // true

// 注意：BigInt 不能与 Number 混合运算
// 1n + 1; // TypeError
Number(1n) + 1; // 2（需要显式转换）
```

### 5.4 globalThis

```javascript
// 统一获取全局对象
// 浏览器：window
// Node.js：global
// Web Worker：self

// 之前需要判断环境
const globalObj =
  typeof window !== "undefined" ? window :
  typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self : {};

// 现在直接使用
globalThis.setTimeout(() => {}, 1000);
```

### 5.5 Promise.allSettled

```javascript
// 等待所有 Promise 完成（无论成功失败）
const promises = [
  fetch("/api/users"),
  fetch("/api/posts"),
  fetch("/api/comments"),
];

const results = await Promise.allSettled(promises);

results.forEach(result => {
  if (result.status === "fulfilled") {
    console.log("成功:", result.value);
  } else {
    console.log("失败:", result.reason);
  }
});
```

---

## 6. ES2021（ES12）

### 6.1 逻辑赋值运算符

```javascript
// ||= - 或赋值
let a = false;
a ||= "default"; // a = "default"

// &&= - 与赋值
let b = "value";
b &&= "new value"; // b = "new value"

// ??= - 空值赋值
let c = null;
c ??= "default"; // c = "default"

// 实际用途
const config = { timeout: 0, retries: undefined };
config.timeout ??= 3000;  // 不变（0 不是 null/undefined）
config.retries ??= 3;     // 变为 3
```

### 6.2 String.prototype.replaceAll

```javascript
// replace 只替换第一个匹配
"hello world hello".replace("hello", "hi");
// "hi world hello"

// replaceAll 替换所有匹配
"hello world hello".replaceAll("hello", "hi");
// "hi world hi"

// 正则表达式需要 g 标志
"hello world hello".replaceAll(/hello/g, "hi");
```

### 6.3 Promise.any

```javascript
// 返回第一个成功的 Promise
const promises = [
  fetch("/api/server1"),  // 可能失败
  fetch("/api/server2"),  // 可能失败
  fetch("/api/server3"),  // 可能成功
];

try {
  const first = await Promise.any(promises);
  console.log("最快响应:", first);
} catch (aggregateError) {
  console.log("所有请求都失败了");
  aggregateError.errors.forEach(err => console.error(err));
}
```

### 6.4 WeakRef 和 FinalizationRegistry

```javascript
// WeakRef - 弱引用
let target = { name: "Alice" };
const weakRef = new WeakRef(target);

console.log(weakRef.deref()); // { name: "Alice" }

target = null; // 原对象可被垃圾回收
// weakRef.deref() 可能返回 undefined

// FinalizationRegistry - 对象被回收时的回调
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`对象 ${heldValue} 已被回收`);
});

let obj = { data: "important" };
registry.register(obj, "my-object");

obj = null; // 当对象被回收时，回调会被调用
```

---

## 7. ES2022（ES13）

### 7.1 类的公共和私有字段

```javascript
class Person {
  // 公共字段
  name = "Unknown";
  age = 0;

  // 私有字段（# 前缀）
  #id;
  #secret = "hidden";

  constructor(name, age, id) {
    this.name = name;
    this.age = age;
    this.#id = id;
  }

  // 私有方法
  #generateId() {
    return Math.random().toString(36).slice(2);
  }

  getId() {
    return this.#id;
  }
}

const person = new Person("Alice", 25, "001");
// person.#id;       // 语法错误 - 私有字段不可外部访问
// person.#secret;   // 语法错误
// person.#generateId(); // 语法错误
```

### 7.2 静态类字段和方法

```javascript
class Config {
  static version = "1.0.0";
  static #instances = 0;

  constructor() {
    Config.#instances++;
  }

  static getInstances() {
    return Config.#instances;
  }

  // 静态初始化块
  static {
    console.log("Config 类已加载");
    this.version = "2.0.0";
  }
}
```

### 7.3 Array.prototype.at

```javascript
const arr = [10, 20, 30, 40, 50];

arr.at(0);   // 10（正数索引）
arr.at(-1);  // 50（负数索引，从末尾开始）
arr.at(-2);  // 40

// 对比传统写法
arr[arr.length - 1]; // 50
arr.at(-1);           // 50（更简洁）
```

### 7.4 Object.hasOwn

```javascript
const obj = { name: "Alice" };

// 旧写法
Object.prototype.hasOwnProperty.call(obj, "name"); // true

// 新写法
Object.hasOwn(obj, "name"); // true
Object.hasOwn(obj, "toString"); // false（继承属性不算）

// 更安全的检查
const obj2 = Object.create(null); // 没有 hasOwnProperty 方法
// obj2.hasOwnProperty("name"); // TypeError
Object.hasOwn(obj2, "name"); // false（安全）
```

---

## 8. ES2023（ES14）

### 8.1 数组从后查找

```javascript
const arr = [1, 2, 3, 4, 3, 2, 1];

// findLast - 从后往前查找
arr.findLast(x => x > 2); // 3（最后一个大于 2 的元素）

// findLastIndex - 从后往前查找索引
arr.findLastIndex(x => x > 2); // 4

// 对比
arr.find(x => x > 2);       // 3（第一个大于 2 的元素）
arr.findIndex(x => x > 2);  // 2
```

### 8.2 不可变数组方法

```javascript
// toSorted - 不修改原数组的排序
const arr = [3, 1, 4, 1, 5];
const sorted = arr.toSorted(); // [1, 1, 3, 4, 5]
console.log(arr); // [3, 1, 4, 1, 5]（原数组不变）

// toReversed - 不修改原数组的反转
const reversed = arr.toReversed(); // [5, 1, 4, 1, 3]

// toSpliced - 不修改原数组的 splice
const spliced = arr.toSpliced(1, 2, 10, 20); // [3, 10, 20, 1, 5]

// with - 不修改原数组的索引赋值
const updated = arr.with(2, 99); // [3, 1, 99, 1, 5]
```

---

## 小结

| 版本 | 特性 | 说明 |
|------|------|------|
| ES7 | `includes`, `**` | 数组包含检查、指数运算 |
| ES8 | `async/await`, `Object.values` | 异步编程、对象遍历 |
| ES9 | 对象展开, `finally` | 对象解构、Promise 完成 |
| ES10 | `flat/flatMap`, `fromEntries` | 数组扁平化、对象转换 |
| ES11 | `?.`, `??`, `BigInt` | 可选链、空值合并、大数 |
| ES12 | `??=`, `replaceAll`, `any` | 逻辑赋值、替换、Promise |
| ES13 | `#private`, `at`, `hasOwn` | 私有字段、负索引 |
| ES14 | `findLast`, `toSorted` | 从后查找、不可变方法 |

下一步：[内置对象扩展 →](/web/JavaScript/es6/03-builtins/)
