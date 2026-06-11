# 内置对象扩展

ES6+ 对 JavaScript 内置对象进行了大量扩展，新增了 Set、Map、Promise、迭代器等重要的数据结构和功能。

## 1. Set 和 Map

### 1.1 Set

```javascript
// 创建 Set
const set = new Set([1, 2, 3, 3, 4]);
console.log(set); // Set(4) {1, 2, 3, 4}（自动去重）

// 基本操作
set.add(5);          // 添加元素
set.delete(3);       // 删除元素，返回 true/false
set.has(2);          // 检查是否存在，返回 true/false
set.size;            // 元素数量
set.clear();         // 清空

// 数组去重
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// 遍历
for (const item of set) {
  console.log(item);
}

set.forEach((value, key) => {
  console.log(value); // Set 中 value === key
});

// 转换为数组
const arrFromSet = Array.from(set);
const arrFromSet2 = [...set];
```

### 1.2 WeakSet

```javascript
// WeakSet 只能存储对象引用，且是弱引用
const weakSet = new WeakSet();

let obj = { name: "Alice" };
weakSet.add(obj);
weakSet.has(obj); // true
weakSet.delete(obj); // true

// 不可遍历，没有 size 属性
// 适合存储对象引用而不阻止垃圾回收

// 实际用途：标记已处理的对象
const processed = new WeakSet();

function process(obj) {
  if (processed.has(obj)) {
    return; // 已处理过，跳过
  }
  // 处理逻辑...
  processed.add(obj);
}
```

### 1.3 Map

```javascript
// 创建 Map
const map = new Map();
map.set("name", "Alice");
map.set("age", 25);
map.set(1, "number key"); // 任意类型作为键

// 链式调用
const map2 = new Map()
  .set("a", 1)
  .set("b", 2)
  .set("c", 3);

// 基本操作
map.get("name");     // "Alice"
map.has("age");      // true
map.size;            // 3
map.delete("age");   // true
map.clear();         // 清空

// 初始化
const map3 = new Map([
  ["name", "Alice"],
  ["age", 25],
]);

// 遍历
for (const [key, value] of map3) {
  console.log(key, value);
}

map3.forEach((value, key) => {
  console.log(key, value);
});

// 对象作为键（普通对象做不到）
const user1 = { name: "Alice" };
const user2 = { name: "Bob" };
const userRoles = new Map();
userRoles.set(user1, "admin");
userRoles.set(user2, "user");
```

### 1.4 WeakMap

```javascript
// WeakMap 键必须是对象，且是弱引用
const weakMap = new WeakMap();

let element = document.getElementById("btn");
weakMap.set(element, { clickCount: 0 });

element.addEventListener("click", () => {
  const data = weakMap.get(element);
  data.clickCount++;
});

// 当 element 被移除时，关联数据也会被垃圾回收

// 实际用途：私有数据存储
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, { name, age });
  }

  getName() {
    return privateData.get(this).name;
  }
}
```

---

## 2. Promise 详解

### 2.1 Promise 基础

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("操作成功");
  } else {
    reject(new Error("操作失败"));
  }
});

// 使用 Promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("完成"));

// Promise 状态：pending → fulfilled / rejected
```

### 2.2 Promise 静态方法

```javascript
// Promise.all - 全部成功才成功
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);

// Promise.allSettled - 等待全部完成
const results = await Promise.allSettled([
  fetch("/api/a"),
  fetch("/api/b"),
  fetch("/api/c"),
]);
// [{ status: "fulfilled", value: ... }, { status: "rejected", reason: ... }, ...]

// Promise.race - 返回最先完成的
const fastest = await Promise.race([
  fetch("/api/server1"),
  fetch("/api/server2"),
]);

// Promise.any - 返回最先成功的
try {
  const first = await Promise.any([
    fetch("/api/server1"),
    fetch("/api/server2"),
  ]);
} catch (err) {
  // 所有都失败
  console.log(err.errors);
}

// Promise.resolve / Promise.reject
const p1 = Promise.resolve(42);
const p2 = Promise.reject(new Error("fail"));
```

### 2.3 Promise 链式调用

```javascript
fetch("/api/user/1")
  .then(response => response.json())
  .then(user => fetch(`/api/posts?userId=${user.id}`))
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error("请求链出错:", error);
  });

// 返回新的 Promise
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000)
  .then(() => console.log("1秒后"))
  .then(() => delay(1000))
  .then(() => console.log("2秒后"));
```

---

## 3. 迭代器与生成器

### 3.1 迭代器（Iterator）

```javascript
// 手动创建迭代器
function createCounter(start = 0, end = Infinity) {
  let count = start;
  return {
    next() {
      if (count <= end) {
        return { value: count++, done: false };
      }
      return { value: undefined, done: true };
    },
  };
}

const counter = createCounter(1, 3);
counter.next(); // { value: 1, done: false }
counter.next(); // { value: 2, done: false }
counter.next(); // { value: 3, done: false }
counter.next(); // { value: undefined, done: true }
```

### 3.2 可迭代对象（Iterable）

```javascript
// 实现 Symbol.iterator 使对象可迭代
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      },
    };
  },
};

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

const arr = [...range]; // [1, 2, 3, 4, 5]
```

### 3.3 生成器（Generator）

```javascript
// function* 创建生成器
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }

// 有限生成器
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34

// yield* 委托给另一个生成器
function* concat(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

const combined = concat([1, 2], [3, 4], [5, 6]);
console.log([...combined]); // [1, 2, 3, 4, 5, 6]
```

### 3.4 异步生成器

```javascript
// async function* 创建异步生成器
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    if (data.length === 0) break;
    yield data;
    page++;
  }
}

// 使用 for await...of 遍历
async function processAllPages() {
  for await (const page of fetchPages("/api/items")) {
    console.log(page);
  }
}
```

---

## 4. Proxy 和 Reflect

### 4.1 Proxy

```javascript
// 基本用法
const target = { name: "Alice", age: 25 };
const proxy = new Proxy(target, {
  get(obj, prop) {
    console.log(`读取属性: ${prop}`);
    return Reflect.get(obj, prop);
  },
  set(obj, prop, value) {
    console.log(`设置属性: ${prop} = ${value}`);
    return Reflect.set(obj, prop, value);
  },
});

proxy.name;       // 读取属性: name → "Alice"
proxy.age = 26;   // 设置属性: age = 26

// 数据验证
const validator = {
  set(obj, prop, value) {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("age 必须是数字");
    }
    if (prop === "age" && (value < 0 || value > 200)) {
      throw new RangeError("age 范围 0-200");
    }
    return Reflect.set(obj, prop, value);
  },
};

const person = new Proxy({}, validator);
person.age = 25;     // OK
// person.age = -1;  // RangeError
// person.age = "25"; // TypeError
```

### 4.2 Reflect

```javascript
// Reflect 与 Proxy 的 handler 方法一一对应
const obj = { name: "Alice", age: 25 };

// 代替 Object 方法
Reflect.get(obj, "name");           // "Alice"
Reflect.set(obj, "age", 26);        // true
Reflect.has(obj, "name");           // true
Reflect.deleteProperty(obj, "age"); // true
Reflect.ownKeys(obj);               // ["name"]

// Reflect.apply 代替 Function.prototype.apply
Reflect.apply(Math.max, null, [1, 2, 3]); // 3

// Reflect.construct 代替 new
const date = Reflect.construct(Date, [2024, 0, 1]);
```

---

## 5. 正则表达式扩展

```javascript
// u 标志 - Unicode 模式
const emoji = /\u{1F600}/u; // 匹配 😀
/^.$/.test("😀");   // false（JS 将 emoji 视为2个字符）
/^.$/u.test("😀");  // true（u 标志正确处理）

// y 标志 - 粘连模式
const str = "aaa_aa_a";
const regex1 = /a+/g;
const regex2 = /a+/y;

regex1.exec(str); // ["aaa"]（从位置0找到aaa）
regex1.exec(str); // ["aa"]（从位置4找到aa）

regex2.exec(str); // ["aaa"]（从位置0找到aaa）
regex2.exec(str); // null（从位置3开始，不是a，粘连模式要求连续匹配）

// 命名捕获组
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = dateRegex.exec("2024-01-15");
match.groups.year;  // "2024"
match.groups.month; // "01"
match.groups.day;   // "15"

// 后行断言
const str2 = "hello world";
/(?<=hello )world/.test(str2); // true（world 前面是 hello）
/(?<!hello )world/.test(str2); // false（否定后行断言）

// dotAll 模式
/./.test("\n");    // false（. 不匹配换行）
/./s.test("\n");   // true（s 标志使 . 匹配所有字符）
```

---

## 小结

| 特性 | 说明 | 示例 |
|------|------|------|
| Set | 唯一值集合 | `new Set([1, 2, 3])` |
| Map | 键值对集合 | `new Map([["a", 1]])` |
| WeakSet/WeakMap | 弱引用集合 | 垃圾回收友好 |
| Promise | 异步编程核心 | `new Promise((resolve, reject) => {})` |
| 迭代器 | 统一遍历接口 | `[Symbol.iterator]()` |
| 生成器 | 惰性求值 | `function* gen() { yield 1; }` |
| Proxy/Reflect | 元编程 | `new Proxy(target, handler)` |

下一步：[实战应用 →](/web/JavaScript/es6/04-practice/)
