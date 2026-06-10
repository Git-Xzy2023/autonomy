---
title: ES 新特性面试题
---

# ES 新特性面试题

> 这里的 "ES" 指 **ECMAScript**（JavaScript 的语言标准）。从 ES6（ES2015）开始，ES 标准委员会 TC39 采用 "每年一个版本" 的方式发布新特性。面试中常被问到的核心新增语法与 API 基本集中在 ES2015–ES2024。

---

## 一、基础语法新特性

### Q1 简述 ES2015（ES6）有哪些你常用的新特性？

| 分类 | 代表性特性 |
| --- | --- |
| 变量/常量 | `let` / `const`（块级作用域 + 不可重新赋值） |
| 函数 | 箭头函数 `=>`、默认参数、剩余参数 `...`、扩展运算符 |
| 解构 | 数组解构、对象解构、默认值、重命名 |
| 字符串 | 模板字符串 `\`hello ${name}\`` |
| 对象字面量 | 简写属性 `{ x }`、简写方法 `f(){}`、计算属性 `[k]` |
| 类与继承 | `class` / `extends` / `super` / `static` |
| 模块化 | `import` / `export` / `export default` |
| 数据结构 | `Map` / `Set` / `WeakMap` / `WeakSet` |
| 异步 | `Promise` / `async`（ES2017）/ `await`（ES2017） |
| 迭代 / 生成器 | `Symbol.iterator`、`for...of`、`function*`、`yield` |
| 新对象/方法 | `Object.assign`、`Array.from`、`Array.of`、`find` / `findIndex`、`Number.isNaN`、`Number.isInteger`、`Object.is` |

---

### Q2 `var` / `let` / `const` 的区别？为什么建议默认使用 `const`？

| 特性 | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 提升声明，值为 `undefined` | 提升声明，但在声明前访问会抛 `ReferenceError`（TDZ） | 同 `let` |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | **不允许**（声明时必须赋值） |

**为什么默认用 `const`**：

1. `const` 强制约束「变量指向不可变」，让代码更可预测，也能捕捉到错误的赋值。
2. 对于对象/数组，`const` 只保证「引用」不变，**不保证内容不可变**：
   ```js
   const obj = { a: 1 };
   obj.a = 2;         // ✅ 允许（对象内部可改）
   // obj = { b: 2 }; // ❌ 不允许（重新赋值）
   ```
3. 当你明确需要重新赋值时才使用 `let`，基本没有场景必须用 `var`。

**暂时性死区（TDZ, Temporal Dead Zone）**：从块的开始到 `let`/`const` 声明语句之前，访问该变量会触发 `ReferenceError`。

---

### Q3 箭头函数 `() => {}` 和普通函数 `function() {}` 有什么区别？

核心区别有四个：

1. **没有自己的 `this`**：箭头函数的 `this` 继承自「定义时所在的作用域」，运行时不可改变（`call`/`apply`/`bind` 都无效）。
2. **没有 `arguments`**：想用可变参数请用剩余参数 `...args`。
3. **不能作为构造函数**：没有 `[[Construct]]` 内部槽位，`new` 会抛 `TypeError`。
4. **没有 `prototype` 属性**，自然也不能作为 `class` 里的方法使用 `super`。

**高频面试代码**：

```js
const obj = {
  name: "Alice",
  greet1() {
    setTimeout(() => console.log("arrow:", this.name), 0); // ✅ "Alice"，this 继承自 greet1 作用域
  },
  greet2() {
    setTimeout(function () {
      console.log("func:", this.name); // ❌ 空或 undefined，this 变成全局
    }, 0);
  },
};
obj.greet1();
obj.greet2();
```

> **经验法则**：需要自己的 `this` 时用普通函数（比如对象方法、类方法、事件处理回调）；其他场景（尤其是作为回调的一行函数）优先箭头函数。

---

### Q4 什么是解构（Destructuring）？常用写法有哪些？

**解构 = 「把右边结构拆开，赋值给左边的变量」**，数组和对象都支持。

```js
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5]; // a=1, b=2, rest=[3,4,5]
const [x, y = 10] = [1];                 // y 默认值 10

// 对象解构
const { name, age = 18 } = { name: "Tom" }; // name="Tom", age=18
const { name: fullName } = { name: "Tom" }; // 重命名：fullName="Tom"

// 嵌套解构
const {
  address: { city },
} = { address: { city: "SH" } };

// 函数参数解构（非常常用）
function api({ url, method = "GET" } = {}) {
  console.log(url, method);
}
```

**面试小坑**：

```js
let a = 1;
{ a } = { a: 99 };      // ❌ SyntaxError：{ 开头被当成块语句
({ a } = { a: 99 });    // ✅ 用括号包起来就是一个表达式
```

---

### Q5 模板字符串（Template Literals）除了 `${}` 插值还有什么能力？

1. **多行字符串**：直接换行，不需要 `\n`。
2. **嵌套模板**：`${`inner ${x}`}` 合法。
3. **标签模板（Tagged Template）**：函数名后跟模板字符串，会被当作「函数调用」处理，常用于 i18n、SQL、styled-components 等。

```js
function tag(strings, ...values) {
  console.log(strings); // ["Hello ", " !", raw: ...]
  console.log(values);  // ["Alice"]
  return "result";
}
const name = "Alice";
tag`Hello ${name} !`;  // 等价于 tag(["Hello ", " !"], "Alice")

// 一个小应用：自动转义
function html(strings, ...values) {
  return strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? escapeHtml(values[i]) : ""),
    "",
  );
}
```

---

### Q6 对象字面量增强有哪些写法？

```js
const name = "Alice";
const age = 18;

// 1) 简写属性（shorthand properties）
const person = { name, age };       // { name: name, age: age }

// 2) 简写方法（shorthand methods）
const obj = {
  greet() { return "hi"; },         // 等价于 greet: function() { ... }
};

// 3) 计算属性名（computed property names）
const key = "age";
const user = {
  [key]: 18,                        // { age: 18 }
  ["get" + "Name"]() { return this.name; },
};
```

---

## 二、类（Class）与继承

### Q7 `class` 和传统构造函数有什么区别？`class` 内部是严格模式吗？

`class` 本质上是「构造函数 + 原型方法」的语法糖，但它有几个重要差异：

| 特性 | 构造函数 `function Fn(){}` | `class Fn {}` |
| --- | --- | --- |
| 调用方式 | 可以作为普通函数调用（可能出错） | 必须 `new` 调用，否则抛 `TypeError` |
| this 绑定 | 普通调用 `this` 指向全局 | 无 |
| 方法可枚举性 | `Fn.prototype.f = ...` 是可枚举的 | `class` 中的方法默认不可枚举 |
| 变量提升 | 函数声明会整体提升 | `class` 声明不会提升（类似 `let` 的 TDZ） |
| 严格模式 | 默认取决于外部环境 | **整个 class 体默认严格模式** |

> `class` 内部自动启用严格模式，这也是很多新手踩坑的原因（比如 `this` 在无上下文时不是 `window` 而是 `undefined`）。

---

### Q8 `extends` 继承如何使用？`super` 在构造器里为什么必须在 `this` 之前调用？

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 必须先 super()，因为子类的 this 是由父类构造器创建的
    super(name);
    this.breed = breed;
  }
  speak() {
    return super.speak() + ", woof!"; // 调用父类方法
  }
}
```

**为什么必须先 `super()` 才能访问 `this`**：
ES6 的 `class` 继承采用「先父后子」的构造顺序——子类自己不独立创建 `this`，而是等父类构造器（`super()`）返回一个 `this`，再用子类构造器的逻辑去初始化它。所以在 `super()` 之前，`this` 还没被初始化，访问会抛 `ReferenceError`。

---

### Q9 `static` 静态方法/属性和实例方法有什么区别？静态成员能继承吗？

```js
class A {
  static hi() { return "hi from A"; }
  hello() { return "hello from instance"; }
}

A.hi();        // ✅
A.hello();     // ❌
new A().hi();  // ❌（实例访问不到 static）

class B extends A {}
B.hi();        // ✅ 静态成员也可以继承（本质是 B.__proto__ = A）
```

**关于 `this` 在静态方法里**：它指向类本身（因为是 `ClassName.method()` 调用），所以 `static` 方法内部可以用 `this` 访问另一个 `static` 成员。

---

### Q10 私有字段 `#private` 是哪个版本引入的？和 `_private` 约定有什么区别？

**`#` 私有字段（Private Class Fields）在 ES2022 正式成为标准**。

与 `_private` 下划线约定的区别：

| 方式 | 是否真的私有 | 是否可以外部访问 | 是否影响原型链 |
| --- | --- | --- | --- |
| `_name` | 仅是约定 | 依然可以直接读写 | 无 |
| `#name` | 真正私有 | 外部访问报 `SyntaxError`，`Object.keys` 也拿不到 | 每个实例自带（非共享） |

```js
class Person {
  #age = 0;             // 私有字段必须先声明
  constructor(age) { this.#age = age; }
  get age() { return this.#age; }
}

const p = new Person(18);
p.age;          // ✅ 通过 getter 访问
// p.#age;      // ❌ SyntaxError（静态语法检查阶段就会报错）
```

> 面试中可能顺带考：`private`（TS 的修饰符） vs `#`（ES 原生）。区别是 TS 的 `private` 只是编译期检查，运行时仍然能访问到；`#` 是运行时真正的私有。

---

## 三、模块化（ES Module）

### Q11 ES Module 与 CommonJS（`require`/`module.exports`）有什么区别？

| 对比项 | CommonJS（Node.js 传统） | ES Module（浏览器 / 现代 Node） |
| --- | --- | --- |
| 语法 | `require('x')`、`module.exports = ...` | `import x from 'x'`、`export default ...` |
| 加载时机 | 运行时动态加载（`require` 是个函数，可以放在 `if` 里） | 静态分析（`import` 必须在顶层，不能放在块内） |
| 导出值语义 | **导出值的拷贝**（基本类型）或 **导出引用**（对象） | **导出的是活绑定（live binding）**——模块内部改变变量，import 端看到的也会变 |
| this | 模块内 `this === exports` | 模块内 `this === undefined` |
| 循环依赖 | 已经 `exports` 出来的部分可见，其余是 `undefined` | 需要使用「函数提升」等技巧绕过；现代打包器一般支持良好 |
| 浏览器原生支持 | ❌（需要打包工具） | ✅ `<script type="module">` |

**Live Binding 的经典面试示例**：

```js
// counter.js
export let count = 0;
export function inc() { count++; }

// main.js
import { count, inc } from "./counter.js";
console.log(count); // 0
inc();
console.log(count); // 1  —— 不是 0！
```

> CommonJS 中 `exports.count` 会是固定的值快照，而 ESM 中 `count` 是一个「指向原模块内变量的引用」。

---

### Q12 `import` 和 `require` 能混用吗？动态 `import()` 是什么？

- **`import()` 动态导入**（ES2020）：在运行时按需加载，返回 `Promise`。
  ```js
  async function loadPlugin(name) {
    const mod = await import(`./plugins/${name}.js`);
    mod.default();
  }
  ```
- **是否能混用**：浏览器中不存在 `require`。Node.js 中：
  - `.mjs` 文件或 `package.json` 里 `"type": "module"` → 只能 `import`；
  - `.cjs` 文件 → 只能 `require`；
  - ESM 文件里可以通过 `module.createRequire` 获得一个 `require` 函数。
- 工程里一般由 Babel / Vite / Webpack 统一处理，两种语法都能写，但项目内部建议保持一致。

---

### Q13 Tree Shaking 是什么？ES Module 为什么能支持 Tree Shaking？

**Tree Shaking = 「死代码消除」——打包时丢掉没有被真正用到的 export**。前提：

1. 模块系统必须是「可静态分析」的，也就是 `import`/`export` 必须在顶层、路径必须是字符串字面量（这就是 ESM 的设计）。
2. `require` 在 CommonJS 中是动态的（可以放在 `if` 里、路径可以是字符串拼接变量），所以静态分析器难以判断某个导出是否被用到 → **CommonJS 默认不支持 Tree Shaking**。
3. 打包工具层面，Webpack / Rollup / Vite 都默认对 ESM 做 Tree Shaking。

**让你的库更好被 Shake 的建议**：

- 直接 `export function f() {}` 而不是最后 `module.exports = { f }`；
- 不要在模块顶层做副作用（比如挂全局、立即调用大函数）；
- `package.json` 里标注 `"sideEffects": false` 或列出有副作用的文件。

---

## 四、Promise 与 async/await

### Q14 Promise 有哪些状态？如何理解「状态一旦改变就不可逆」？

三种状态：

- **pending**（进行中）
- **fulfilled**（已成功，调用了 `resolve`）
- **rejected**（已失败，调用了 `reject` 或 executor 抛错）

转换规则：**只能从 `pending` → `fulfilled` 或 `pending` → `rejected`**，一旦转换完成就不会再变。

```js
const p = new Promise((res, rej) => {
  res("ok");
  rej("oops");   // 被忽略
  res("again"); // 被忽略
});
// p 永远是 fulfilled("ok")
```

---

### Q15 `Promise.all` / `allSettled` / `race` / `any` 分别什么时候用？

| 方法 | 成功条件 | 失败条件 | 返回内容 |
| --- | --- | --- | --- |
| `Promise.all([...])` | **全部**成功 | 任何一个失败 → 立刻以该失败原因 reject | 按顺序的结果数组 |
| `Promise.allSettled([...])` | 永远成功（等全部完成） | 永不失败 | `[{status:'fulfilled', value} / {status:'rejected', reason}]` |
| `Promise.race([...])` | 第一个**完成**的（无论成功失败） | 第一个失败的就 reject | 第一个完成的值/错误 |
| `Promise.any([...])` | 第一个**成功**的（ES2021） | 全部失败 → `AggregateError` | 第一个成功的值 |

**典型场景**：

```js
// 页面多个接口并行加载，全拿到后再渲染
Promise.all([fetchUser(), fetchOrders()]).then(([u, o]) => render(u, o));

// 只要知道「每个接口有没有成功」，绝不抛错
Promise.allSettled([a(), b(), c()]).then((results) =>
  results.filter((r) => r.status === "fulfilled"),
);

// 超时控制（谁先完成用谁）
Promise.race([fetchData(), delay(3000).then(() => Promise.reject("timeout"))]);

// 多 CDN 取一份资源，哪个最快且成功就用哪个
Promise.any([fetch("//cdn1/x"), fetch("//cdn2/x"), fetch("//cdn3/x")]);
```

---

### Q16 async/await 是 Promise 的语法糖吗？它背后发生了什么？

**是的**，`async/await` 本质上是「Promise + 生成器协程」的语法糖。编译器会把 `await` 前后的代码切分成多个 `.then` 回调串起来。

一个简化视角：`await` 等价于把后续代码包在 `.then(...)` 里；`try/catch` 包裹 `await` 等价于 `.catch(...)`。

```js
async function demo() {
  const a = await fetchA();
  const b = await fetchB(a);
  return { a, b };
}

// 大致等价于：
function demo() {
  return fetchA().then((a) => fetchB(a).then((b) => ({ a, b })));
}
```

**面试考点**：

- `async` 函数永远返回 Promise，哪怕你直接 `return 1` → `Promise.resolve(1)`；
- `await` 后面跟非 Promise 会被自动 `Promise.resolve(x)` 包装；
- `await` 会让当前函数「暂停」并让出线程，但**不会阻塞整个 JS 引擎**（其他代码依然可以跑）；
- 要并行多个 Promise，请先启动它们再 `await`：
  ```js
  // ❌ 串行
  const a = await slowA();
  const b = await slowB();

  // ✅ 并行
  const [pa, pb] = [slowA(), slowB()];
  const [a, b] = [await pa, await pb];
  // 或：const [a, b] = await Promise.all([slowA(), slowB()]);
  ```

---

### Q17 Top-level await 是什么？（ES2022）

**ES2022 允许在模块顶层直接使用 `await`**，不再必须包在 `async function` 里。

```js
// config.js（ES Module 文件）
const config = await fetch("/api/config").then((r) => r.json());
export default config;
```

**注意**：在同步依赖它的模块中，该模块会被「挂起」等待，所以使用不当可能拖慢整个应用启动。一般用于加载配置、懒加载插件等。

---

## 五、迭代器与生成器

### Q18 什么是迭代器（Iterator）？什么是可迭代对象（Iterable）？

- **可迭代对象**：实现了 `[Symbol.iterator]` 方法（返回一个迭代器）的对象。
- **迭代器**：实现了 `next()` 方法，返回 `{ value, done }` 的对象。

```js
const arr = [1, 2, 3];
const it = arr[Symbol.iterator]();
it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: false }
it.next(); // { value: 3, done: false }
it.next(); // { value: undefined, done: true }
```

**能被 `for...of` 遍历的都满足「可迭代协议」**，包括数组、字符串、Map、Set、NodeList、arguments、`arguments` 对象等。

**手写一个可迭代对象**：

```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let value = this.from;
    return {
      next: () =>
        value <= this.to
          ? { value: value++, done: false }
          : { value: undefined, done: true },
    };
  },
};
for (const n of range) console.log(n); // 1 2 3 4 5
```

---

### Q19 生成器函数 `function*` 有什么用？`yield` 和 `yield*` 有什么区别？

**生成器 = 可暂停 / 可恢复的函数**，执行它会返回一个「生成器对象」（同时是迭代器也是可迭代对象）。

```js
function* count(n) {
  for (let i = 0; i < n; i++) {
    yield i;               // 暂停并把 i 作为 next().value 抛出
  }
}
for (const n of count(3)) console.log(n); // 0 1 2
```

**`yield*` = 委托给另一个可迭代对象**：

```js
function* foo() {
  yield* [1, 2, 3];        // 等价于 for (const x of [1,2,3]) yield x;
  yield* "ab";             // 可以委托字符串、Map、其他生成器
}
[...foo()]; // [1, 2, 3, 'a', 'b']
```

**面试场景**：

- 用生成器实现「无限序列」（不会爆内存）：
  ```js
  function* fib() {
    let [a, b] = [0, 1];
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }
  const g = fib();
  g.next().value; // 0
  g.next().value; // 1
  g.next().value; // 1
  g.next().value; // 2
  ```
- 基于生成器做「异步流程控制」（早期的 co 库，现在已被 async/await 取代）。

---

### Q20 `for...in` 和 `for...of` 有什么区别？

| 维度 | `for (const k in obj)` | `for (const v of iter)` |
| --- | --- | --- |
| 遍历什么 | **键名**（包括原型链上可枚举的） | **值**（来自迭代器 `next().value`） |
| 适用对象 | 普通对象（数组也能用，但不推荐） | 实现了 `Symbol.iterator` 的对象：数组/字符串/Map/Set… |
| 数组索引 | 得到字符串 "0"、"1"…… | 得到数组元素的值 |
| 能否遍历原型 | 会（除非过滤 `hasOwnProperty`） | 不会（由迭代器决定产出什么） |

```js
const arr = ["a", "b", "c"];
for (const i in arr) console.log(i);        // "0" "1" "2"（字符串索引）
for (const v of arr) console.log(v);        // "a" "b" "c"

const obj = { a: 1, b: 2 };
for (const k in obj) console.log(k);        // "a" "b"
// for (const v of obj) console.log(v);     // ❌ obj 不是可迭代对象
```

---

## 六、Map / Set / WeakMap / WeakSet

### Q21 `Map` 和普通对象 `Object` 有什么区别？什么时候用 `Map`？

| 对比项 | 普通对象 `{}` | `new Map()` |
| --- | --- | --- |
| 键的类型 | 只能是字符串/Symbol（其他会被 `toString`） | **任意类型**（包括对象、函数、数字） |
| 键的顺序 | ES2015 之前不保证；之后整数键会被排序插入 | **保持插入顺序** |
| 大小 | 需要 `Object.keys(obj).length` 手动算 | `.size` |
| 迭代 | 需要 `Object.keys/values/entries` 先转换 | 天生可迭代：`for...of`、`.forEach` |
| 性能 | 键数量小时很灵活；频繁增删 + 字符串键稍慢 | 频繁增删场景更快 |
| 原型链污染 | `obj.__proto__` 等存在风险（可用 `Object.create(null)` 规避） | 完全安全 |

**经典场景**：

- 「用对象作为 key」的映射关系（比如缓存每个 DOM 节点的元数据）：
  ```js
  const cache = new Map();
  cache.set(domNode, { lastClickAt: Date.now() });
  ```
- 需要按插入顺序遍历的字典。
- 键可能不是字符串的场景。

---

### Q22 `WeakMap` / `WeakSet` 与 `Map` / `Set` 有什么区别？为什么它们不能被遍历？

核心区别：**键（WeakMap）或值（WeakSet）必须是对象，且对它们保持「弱引用」**。

| 类型 | 内容 | 键/值是否弱引用 | 可否迭代 | 可用方法 |
| --- | --- | --- | --- | --- |
| `Map` | 键值对 | 强引用 | ✅ | `get/set/has/delete/clear/size/keys/values/entries/forEach` |
| `WeakMap` | 键值对，键必须是对象 | **键是弱引用** | ❌ | `get/set/has/delete` |
| `Set` | 唯一值集合 | 强引用 | ✅ | `add/has/delete/clear/size/...` |
| `WeakSet` | 唯一对象集合 | **值是弱引用** | ❌ | `add/has/delete` |

**为什么不能遍历 / 没有 size**：
因为键是弱引用，GC 可能在任意时刻回收掉其中的对象。如果允许「遍历」或「读取 size」，结果会在遍历过程中随 GC 而变化，语义上不可靠，所以规范直接禁止。

**典型应用**：

- **WeakMap：给对象「打标签」而不影响它被 GC**（如 DOM 节点元数据、私有数据、Vue3 的响应式系统里用来存依赖映射）。
  ```js
  const metadata = new WeakMap();
  function tagElement(el, meta) {
    metadata.set(el, meta); // el 被移除 DOM → 自动可 GC，metadata 里也会自动消失
  }
  ```
- **WeakSet：记录「某些对象是否曾经出现过」而不阻止它们被回收**（例如检测循环引用的工具、防止重复绑定事件的白名单）。

---

### Q23 数组去重有几种方法？`[...new Set(arr)]` 为什么好用？

```js
const arr = [1, 2, 2, 3, 3, 3];

// 1) Set（最简洁，ES6+）
const r1 = [...new Set(arr)];   // [1, 2, 3]

// 2) filter + indexOf
const r2 = arr.filter((v, i) => arr.indexOf(v) === i);

// 3) reduce
const r3 = arr.reduce(
  (acc, v) => (acc.includes(v) ? acc : [...acc, v]),
  [],
);

// 4) Map 或对象做存在性表
const r4 = Array.from(new Map(arr.map((v) => [v, v])).values());
```

**为什么推荐 `[...new Set(arr)]`**：语义清晰、复杂度 O(n)、支持各种可迭代类型（字符串、Map、NodeList 都可以）。

> 注意 `Set` 判断相等使用「SameValueZero」——`NaN` 与 `NaN` 视为相等（能正确去重 `NaN`），但 `+0 === -0`，所以 `+0` 和 `-0` 会被当成同一个。

---

## 七、字符串/数组/对象的新增 API

### Q24 `Array.from` 和 `Array.of` 有什么用？与 `Array()` 有什么区别？

```js
// Array.from: 把「类数组 / 可迭代对象」变成数组
Array.from("hello");                  // ['h','e','l','l','o']
Array.from(new Set([1, 2, 2]));       // [1, 2]
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]  —— 第二个参数是 mapFn

function foo() {
  return Array.from(arguments);       // 把 arguments 真转为数组
}

// Array.of: 用给定元素构造数组（解决 Array(3) 是"长度为3的空槽数组"这个历史坑）
Array.of(1, 2, 3);                    // [1,2,3]
Array.of(3);                          // [3]        而不是 [empty × 3]
Array(3);                             // [empty × 3]
```

---

### Q25 数组实例上的 `find` / `findIndex` / `findLast` / `findLastIndex`？（ES2023 新增后两个）

```js
const arr = [1, 2, 3, 4, 5, 2];
arr.find((n) => n > 2);        // 3（第一个满足的元素）
arr.findIndex((n) => n > 2);   // 2（第一个满足的索引）
arr.findLast((n) => n === 2);  // 2（从后往前找第一个）
arr.findLastIndex((n) => n === 2); // 5

// 找不到时：
arr.find((n) => n > 100);      // undefined
arr.findIndex((n) => n > 100); // -1
```

---

### Q26 字符串新增了哪些好用的方法？

```js
const s = "Hello world";

// ES6
s.includes("world"); // true
s.startsWith("Hello");
s.endsWith("ld");
s.repeat(3);         // "Hello worldHello worldHello world"

// ES2017
s.padStart(20, "*"); // "*********Hello world"
s.padEnd(20, "*");   // "Hello world*********"

// ES2019
"  abc  ".trimStart(); // "abc  "   (旧名 trimLeft)
"  abc  ".trimEnd();   // "  abc"   (旧名 trimRight)

// ES2021
"aabbcc".replaceAll("b", "_"); // "aa__cc"
```

> `replaceAll` 的小坑：第一个参数如果是正则，必须带 `g` 标志，否则抛错。

---

### Q27 对象新增的方法？`Object.assign` 和展开运算符 `{...a, ...b}` 有区别吗？

| 方法 | 作用 |
| --- | --- |
| `Object.assign(target, ...sources)` | 把 sources 上**可枚举自有属性**浅复制到 target |
| `Object.is(a, b)` | 比 `===` 更「数学上严格」的相等：`Object.is(NaN, NaN) === true`；`Object.is(+0, -0) === false` |
| `Object.getOwnPropertyDescriptors` | 获取所有自有属性的描述符（用于拷贝 getter/setter） |
| `Object.fromEntries(iter)` | ES2019，把 `[key, value]` 对转成对象（`Object.entries` 的反操作） |
| `Object.hasOwn(obj, key)` | ES2022，推荐替代 `obj.hasOwnProperty(key)` 的写法（更安全，防止对象覆盖了 hasOwnProperty） |

**`Object.assign` 与展开**：两者几乎等价（都做浅拷贝）。展开运算符更推荐用于「创建新对象」：

```js
const merged = { ...a, ...b };       // 纯表达式，不修改任何对象
Object.assign(a, b);                  // 会修改 a
```

---

### Q28 `Object.entries` / `Object.fromEntries` 有什么用？

```js
const obj = { a: 1, b: 2 };
const entries = Object.entries(obj); // [['a',1], ['b',2]]

// 对对象做 map/filter 很方便
Object.fromEntries(
  Object.entries(obj)
    .filter(([, v]) => v > 1)
    .map(([k, v]) => [k.toUpperCase(), v * 2]),
);
// { B: 4 }
```

---

### Q29 数组方法 `at()` 是什么？为什么要引入它？（ES2022）

**`arr.at(i)` 支持负索引**，和 Python 的 `arr[-1]` 一样：

```js
const arr = [10, 20, 30, 40];
arr.at(-1); // 40        （等价于 arr[arr.length - 1]，但更直观）
arr.at(-2); // 30
arr.at(0);  // 10
arr.at(99); // undefined
```

字符串同样有 `"hello".at(-1)`。之前要写 `arr[arr.length - 1]` 很啰嗦，`arr[-1]` 在 JS 里又被当作属性名而不是索引。

---

### Q30 ES2023 新增的「不修改原数组」的方法有哪些？为什么要加？

| 会修改原数组的老方法 | ES2023 新增的不修改原数组版本 |
| --- | --- |
| `arr.reverse()` | `arr.toReversed()` |
| `arr.sort(fn)` | `arr.toSorted(fn)` |
| `arr.splice(start, del, ...ins)` | `arr.toSpliced(start, del, ...ins)` |
| — | `arr.with(i, v)`（把第 i 个元素替换为 v，返回新数组） |

**为什么要加**：配合 `const` 数组、React 的不可变更新（immutable update）、纯函数风格编码。

```js
const arr = [1, 2, 3];
const reversed = arr.toReversed(); // [3,2,1]，arr 依然是 [1,2,3]
const sorted = arr.toSorted((a, b) => b - a);
const replaced = arr.with(1, 99); // [1, 99, 3]
```

---

## 八、数值 / 数学 / BigInt

### Q31 `BigInt` 解决了什么问题？如何使用？

JS 的 `Number` 是 64 位浮点数，**能精确表示的整数范围只有 ±2⁵³ − 1**（约 9e15），超过就会丢精度：

```js
Number.MAX_SAFE_INTEGER; // 2^53 - 1 = 9007199254740991
9007199254740993 === 9007199254740992; // true（精度丢失！）
```

**BigInt**（ES2020）用于精确表示任意大整数：

```js
const a = 9007199254740993n;          // 尾部加 n
const b = BigInt("9007199254740993"); // 或用 BigInt() 构造
a + b;                                 // 18014398509481986n
// a + 1;                              // ❌ 不能与 Number 混用
a + 1n;                                // ✅
```

> 面试考点：BigInt 不能做 `Math` 函数运算；做除法会截断整数（`7n / 2n === 3n`）。

---

### Q32 ES6 新增的 `Number` 静态方法有哪些？

```js
Number.isFinite(1 / 0);    // false（比全局 isFinite 更严格，不做类型转换）
Number.isInteger(3.0);     // true
Number.isNaN(NaN);         // true（不会把字符串 "NaN" 误判成 NaN）
Number.parseFloat("3.14"); // 等于全局 parseFloat，语义更清晰
Number.parseInt("10", 2);  // 把二进制字符串转整数

// 数学上有用的常量
Number.EPSILON;            // 2^-52，表示 1 和"最接近 1 的浮点数"的差
Number.MAX_SAFE_INTEGER;   // 2^53 - 1
Number.MIN_SAFE_INTEGER;   // -(2^53 - 1)
```

---

### Q33 如何比较两个浮点数「几乎相等」？

用 `Number.EPSILON`：

```js
function nearlyEqual(a, b, eps = Number.EPSILON) {
  return Math.abs(a - b) < eps;
}
0.1 + 0.2 === 0.3;         // false（经典面试题）
nearlyEqual(0.1 + 0.2, 0.3); // true
```

---

## 九、Proxy、Reflect 与元编程

### Q34 `Proxy` 能做什么？与 `Object.defineProperty` 有什么区别？

**Proxy（ES6）= 在目标对象外面套一层「拦截器」**，可以拦截对对象的各种操作：

```js
const obj = { name: "Alice" };
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("get", key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("set", key, value);
    return Reflect.set(target, key, value, receiver);
  },
  has(target, key) { return key in target; },
  deleteProperty(target, key) { /* ... */ },
  apply(target, thisArg, args) { /* 如果 target 是函数 */ },
  construct(target, args) { /* 如果 target 是构造函数 */ },
  // 还有 defineProperty, getOwnPropertyDescriptor, getPrototypeOf, setPrototypeOf,
  // ownKeys, preventExtensions, isExtensible …共 13 种拦截
});

proxy.name; // 触发 get；返回 "Alice"
proxy.age = 18; // 触发 set
```

**与 `Object.defineProperty` 对比**：

| 维度 | `Object.defineProperty` | `new Proxy(target, handler)` |
| --- | --- | --- |
| 作用时机 | 修改单个属性的描述符（对属性生效） | 对**整个对象**做拦截（对象层级生效） |
| 对新增属性生效？ | 不会，只影响已经 defineProperty 的属性 | 会，任何 key 都走 handler |
| 对数组下标/length 生效？ | 需要单独处理 | 自动生效 |
| 是否改变原对象 | 是 | 不改变；返回一个新代理对象 |
| 可拦截操作种类 | get/set 等 6 种（configurable/writable/enumerable/value/get/set） | 13 种（包括 `in`、`delete`、`for...in`、函数调用、`new` 等） |

**典型应用**：

- Vue3 用 `Proxy` 替代 Vue2 的 `Object.defineProperty`，实现了对数组下标、新增属性的原生响应式支持。
- 数据校验（set 前校验类型）、默认值、不可变对象代理、日志/埋点。

---

### Q35 `Reflect` 是什么？为什么要和 Proxy 一起用？

`Reflect` 是一个包含「对应每个 Proxy 陷阱的标准操作」的对象，它有两个好处：

1. **统一返回 boolean**：`Reflect.set(obj, 'k', v)` 返回是否成功，而 `obj.k = v` 在严格模式下会抛错。
2. **让 Proxy 的行为保持与默认行为一致**：在 handler 里，你需要「做了额外的事之后，把默认语义交还给 JS 引擎」，这时就用 `Reflect`。

```js
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("访问了", key);
    return Reflect.get(target, key, receiver); // receiver 用来处理 getter 的 this
  },
});
```

> 面试小知识：`Reflect.has(obj, 'x')` 等价于 `'x' in obj`；`Reflect.deleteProperty(obj, 'x')` 等价于 `delete obj.x`。

---

### Q36 `Symbol` 是什么？有哪些用途？

`Symbol`（ES6）是一种「**唯一且不可变**」的原始类型，主要用于：

1. **作为对象 key 避免命名冲突**（比如给第三方库对象加私有数据）：
   ```js
   const MY_KEY = Symbol("my");
   const obj = { [MY_KEY]: 42 };
   obj[MY_KEY]; // 42
   ```
2. **控制对象的「元行为」（Well-known Symbols）**，比如：
   - `Symbol.iterator`：让对象可被 `for...of` 迭代
   - `Symbol.toPrimitive`：自定义对象如何被转成原始值
   - `Symbol.toStringTag`：自定义 `Object.prototype.toString.call(x)` 的结果
   - `Symbol.species`：派生类实例化时使用哪个构造器
   - `Symbol.asyncIterator`：定义异步迭代（`for await...of`）

```js
const obj = {
  [Symbol.toPrimitive](hint) {
    return hint === "number" ? 42 : "hello";
  },
};
Number(obj); // 42
String(obj); // "hello"
```

**注意**：Symbol 不会被 `for...in`、`Object.keys` 枚举到，也不会被 `JSON.stringify` 序列化；想要拿到 Symbol 键用 `Object.getOwnPropertySymbols(obj)`。

---

## 十、装饰器 / 可选链 / 空值合并 / 顶层 await 等

### Q37 可选链 `?.` 和空值合并 `??` 是什么？（ES2020）

**可选链 `?.` = 安全地访问深层属性**，中间任何一层为 `null`/`undefined` 整个表达式就返回 `undefined`：

```js
const user = {};
user?.address?.city;            // undefined（不会报错）
user?.getName?.();              // 函数也能安全调用
arr?.[0];                       // 数组下标也能
```

**空值合并 `??` = 仅当左侧是 `null` 或 `undefined` 时取右边**：

```js
const x = 0;
x ?? 42;     // 0      （0 不是 null/undefined，保留原值）
x || 42;     // 42     （0 被 || 当作 falsy）
```

> **和 `||` 的区别是面试常考**：`||` 会把 `0`、`''`、`false`、`NaN` 都当 falsy 替换掉；`??` 只替换 `null`/`undefined`。

`??=`（ES2021）是它的赋值形式：`x ??= defaultVal`。

---

### Q38 逻辑赋值运算符 `&&=` / `||=` / `??=`（ES2021）

```js
let a = 1, b = 0, c = null;

a ||= 100; // 1    (a 已经 truthy，不变)
b &&= 200; // 0    (b 是 falsy，不变)
c ??= 300; // 300  (c 是 null，赋值)

// 等价于：
// a = a || 100;
// b = b && 200;
// c = c ?? 300;
```

---

### Q39 类的字段声明（Class Fields）有哪些新写法？

ES2022 正式支持「类实例字段」、「私有字段」、「静态字段」、「静态块」的声明式写法：

```js
class Counter {
  // 实例公有字段（实例自身属性，不是原型属性）
  count = 0;

  // 实例私有字段
  #step = 1;

  // 静态公有字段（类自身属性）
  static MAX = 999;

  // 静态私有字段
  static #MIN = 0;

  // 静态初始化块（可以访问静态私有成员）
  static {
    // this === Counter
    this.initialized = true;
  }

  inc() { this.count += this.#step; }
}
```

**实例字段 vs 原型方法**：实例字段会出现在每个实例上（`new Counter().count`），而普通方法 `inc()` 仍然在 `Counter.prototype` 上（共享）。如果把函数写在实例字段里，那每个实例都有一份，可能消耗更多内存。

---

### Q40 命名捕获组（Named Capture Groups，ES2018）是什么？

```js
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = re.exec("2024-05-20");
match.groups; // { year: "2024", month: "05", day: "20" }

// 结合解构更优雅
const { groups: { year, month } } = re.exec("2024-05-20");
```

同时期还加了：

- **Lookbehind**（后行断言）：`(?<=...)` 肯定后行、`(?<!...)` 否定后行；
- **Unicode 属性转义**：`\p{...}`，比如匹配任何中文：`/\p{Script=Han}+/u`；
- **`s` 标志（dotAll）**：让 `.` 也能匹配换行符。

---

## 十一、其他高频新特性速览

### Q41 数组的 `flat` / `flatMap`（ES2019）

```js
const arr = [1, [2, [3, [4]]]];
arr.flat();      // [1, 2, [3, [4]]]      默认展开 1 层
arr.flat(2);     // [1, 2, 3, [4]]
arr.flat(Infinity); // [1, 2, 3, 4]

// flatMap = map + flat(1)
["hello world", "foo bar"].flatMap((s) => s.split(" "));
// ['hello','world','foo','bar']
```

---

### Q42 `Object.fromEntries` 与 `Array.prototype.entries`（ES2019 / ES6）

```js
// entries 把数组转成 [index, value] 迭代器
for (const [i, v] of ["a", "b", "c"].entries()) {
  console.log(i, v);
}

// fromEntries 把 [key, val] 对的集合（Map、二维数组、entries）转回对象
const m = new Map([["a", 1], ["b", 2]]);
Object.fromEntries(m); // { a: 1, b: 2 }
```

---

### Q43 `globalThis`（ES2020）解决了什么问题？

在浏览器里全局对象是 `window` / `self`；在 Web Worker 里是 `self`；在 Node 里是 `global`；在严格模式下裸 `this` 又不是全局……**`globalThis` 统一了这个访问入口**，任何环境下都指向「全局对象」。

---

### Q44 `Promise.withResolvers()`（ES2024）

一个简化手写 Promise 控制流的 API，把 `resolve` / `reject` 直接解构出来：

```js
const { promise, resolve, reject } = Promise.withResolvers();
// 等价于：
// let resolve, reject;
// const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

setTimeout(() => resolve("ok"), 1000);
promise.then(console.log);
```

> 面试中如果被追问「还知道哪些更新的 Promise API」，可以顺便提：
> - `Promise.try`（Stage 3），
> - 以及早期 `Promise.prototype.finally`（ES2018）。

---

### Q45 装饰器（Decorators）目前在 TC39 处于什么阶段？怎么使用？

**装饰器（Decorators）在 ES2023 之后的 TC39 流程中进入 Stage 4，已成为标准**。Babel 早有 legacy 版实现（`@decorator`），但与标准语法不同，请注意区分。

标准用法示例（给类的方法加装饰）：

```ts
function logged(target, context) {
  return function (...args) {
    console.log("calling", context.name);
    return target.apply(this, args);
  };
}

class Greeter {
  @logged
  hello(name) { return "hi " + name; }
}
new Greeter().hello("Alice"); // 打印 "calling hello"
```

> 面试提示：如果你用的是 TypeScript / Babel 老版装饰器，会看到 `@decorator class C {}`、`descriptor`、`(target, key, descriptor)` 形式。这与标准装饰器签名不一样，注意区分「标准」与「Babel legacy / TS experimental」。

---

## 十二、综合应用题

### Q46 用 ES6+ 语法重构下面这段老代码：

```js
// 老代码
function greet(user) {
  user = user || {};
  var name = user.name || "Guest";
  var age = user.age || 18;
  return "Hello " + name + ", you are " + age + " years old.";
}
```

**重构后**：

```js
function greet({ name = "Guest", age = 18 } = {}) {
  return `Hello ${name}, you are ${age} years old.`;
}
```

> 要点：对象解构 + 默认值 + 整体参数默认 `{}` 防止传 `undefined` 时抛错 + 模板字符串。

---

### Q47 写一个 `sleep(ms)`，要求能用 `await`。

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function demo() {
  console.log("start");
  await sleep(1000);
  console.log("end");
}
```

---

### Q48 用 `Object.fromEntries` + `Object.entries` 对对象做 filter：

```js
function pick(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k)),
  );
}
pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
```

---

### Q49 手写一个带并发限制的 Promise 调度器（ES2017）

```js
class Scheduler {
  constructor(limit = 2) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.#run();
    });
  }
  #run() {
    while (this.running < this.limit && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;
      Promise.resolve(task())
        .then(resolve, reject)
        .finally(() => {
          this.running--;
          this.#run();
        });
    }
  }
}
```

---

### Q50 你怎么看「ES 每年更新一次」的节奏？

开放性问题，可以从几个角度谈：

1. **小步快跑**：从 ES2015 的一次大跃进（语法翻天覆地），改成每年渐进式更新，开发者学习成本更低，规范完成度也更高。
2. **Stage 制度**：提案从 Stage 0（设想）→ Stage 1（正式提案）→ Stage 2（草案）→ Stage 3（候选）→ Stage 4（已完成），每个阶段都有可运行的实现和真实使用反馈，避免"拍脑袋"。
3. **语言层 + 引擎层 + 工具层三方协作**：V8、Babel、polyfill、TypeScript 让新特性被用起来比以前快得多；polyfill 提供兼容，Babel 提供语法转换。
4. **向后兼容**：所有新语法都不破坏旧代码（`var` 依然存在；旧的构造函数仍然能跑），JS 的「最大向后兼容」原则从未打破。
5. **开发者责任**：团队里要有统一的语法规范（ESLint `no-var`、`prefer-const`），不要同时混用 5 种不同风格。

---

> 本章节主要梳理 ES2015–ES2024 的新语法与 API，配合 JavaScript 章节的基础部分一起准备效果更好。重点记清楚：**哪个特性在哪一年加入**（考官常常追问「这是哪个版本的语法？」）。
