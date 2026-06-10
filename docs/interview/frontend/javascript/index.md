---
title: JavaScript面试题
---

# JavaScript 面试题

---

## 一、基础语法与数据类型

### Q1 JS 有哪些数据类型？原始类型和对象类型有什么区别？

**8 种数据类型：**

| 类型        | 含义                      | typeof 返回                |
| ----------- | ------------------------- | -------------------------- |
| `number`    | 数字（含 NaN、±Infinity） | `'number'`                 |
| `bigint`    | 任意精度整数（123n）      | `'bigint'`                 |
| `string`    | 字符串                    | `'string'`                 |
| `boolean`   | true/false                | `'boolean'`                |
| `null`      | 空值                      | `'object'`（历史遗留 bug） |
| `undefined` | 未定义                    | `'undefined'`              |
| `symbol`    | 唯一值（Symbol()）        | `'symbol'`                 |
| `object`    | 对象/数组/函数/日期/正则… | `'object'` 或 `'function'` |

**原始类型 vs 对象类型（引用类型）：**

```text
┌──────────────────────────────────────────────────────────┐
│ 原始类型（Primitive）                                     │
│ - 存放在 栈（Stack）或直接存变量中                       │
│ - 比较：按"值"比较（=== 比内容）                         │
│ - 不可变："abc" 永远是 "abc"，toUpperCase() 是返回新串   │
│ - 包括：7 种：string/number/bigint/boolean/null/undefined/symbol │
├──────────────────────────────────────────────────────────┤
│ 对象类型（Object / Reference）                            │
│ - 存放在 堆（Heap），变量里存的是"引用/内存地址"         │
│ - 比较：按"引用"比较（两个内容相同的对象 !== 同一个）    │
│ - 可变：可以自由增删属性                                  │
│ - 包括：Object / Array / Function / Date / RegExp / Map / Set …│
└──────────────────────────────────────────────────────────┘
```

**代码示例**：

```js
// ======= 原始类型：按值传递/比较 =======
let a = 10;
let b = a;
a = 20;
console.log(b); // 10（修改 a 不影响 b）

// ======= 对象类型：按引用传递/比较 =======
const obj1 = { x: 1 };
const obj2 = obj1;
obj1.x = 99;
console.log(obj2.x); // 99（指向同一块内存）

console.log({} === {}); // false（不同引用）
console.log([] === []); // false
console.log(NaN === NaN); // false（特殊！用 Number.isNaN）
```

**关于 `typeof null === 'object'`**：
这是 JS 历史上最著名的 bug。在最初的实现里，值用 32 位存储，低 3 位是"类型标签"，对象是 000，而 null 恰好也是全 0，因此被误判为 object。修复会破坏无数网站，所以保留至今。

---

### Q2 `==` 与 `===` 的区别？

| `===`（严格相等）              | `==`（宽松相等）         |
| ------------------------------ | ------------------------ |
| 先比较**类型**，不同直接 false | **强制类型转换**后再比较 |
| 推荐使用（无意外）             | 不推荐使用（规则复杂）   |

**`==` 的转换规则（抽象相等算法，`ToPrimitive`）**：

```text
1. 类型相同 → 等同于 ===
2. null == undefined → true
3. 数字 vs 字符串 → 字符串转数字再比
4. 布尔值 vs 其他 → 布尔值转数字再比（true→1, false→0）
5. 对象 vs 原始值 → 调用 toPrimitive(obj, 'default')
```

**经典坑**：

```js
// 这些都 true（但几乎都不是你想要的）
console.log([] == ![]); // true —— [] → "" → 0；![] → false → 0；0==0 ✅
console.log("" == false); // true
console.log(0 == false); // true
console.log(null == undefined); // true
console.log(1 == true); // true

// === 就不会有这些意外
console.log([] === ![]); // false
console.log(null === undefined); // false
```

**Best Practice**：永远用 `===`。除了唯一的例外——`x == null`（同时判断 null 和 undefined），在代码风格检查器里可以允许这一条。

---

### Q3 `null`、`undefined`、`''`、`0`、`NaN` 的区别？

| 值          | 含义            | `Boolean()` | `Number()` | `== null` | `=== null` |
| ----------- | --------------- | ----------- | ---------- | --------- | ---------- |
| `null`      | "故意的空值"    | false       | 0          | true      | true       |
| `undefined` | "未赋值/不存在" | false       | NaN        | true      | false      |
| `''`        | 空字符串        | false       | 0          | false     | false      |
| `0`         | 数字零          | false       | 0          | false     | false      |
| `NaN`       | 非数字          | false       | NaN        | false     | false      |

**使用习惯**：

- 业务上用 `null` 表示"有值但为空"，用 `undefined` 表示"从未赋值"。
- **判断"值是否存在"**：`x == null` 同时覆盖 null 和 undefined，推荐。
- **判断是否为空字符串**：`!x && x !== 0 && x !== false`，或用 `??`（空值合并）：`x ?? defaultVal`。

---

### Q4 什么是 NaN？如何判断一个值是不是 NaN？

**NaN = Not a Number**（"不是数字"），但它自身的类型却是 `number` 😄。

```js
typeof NaN === "number"; // ✅ true（反直觉）
NaN === NaN; // ❌ false（唯一自己不等于自己的值）

// 判断 NaN
isNaN("hello"); // ⚠️ true —— 会先转数字（'hello' → NaN）
Number.isNaN("hello"); // ✅ false —— 仅当参数本身就是 NaN 才返回 true
Number.isNaN(NaN); // ✅ true
Object.is(NaN, NaN); // ✅ true（ES6 新增，还能区分 +0 和 -0）
```

---

### Q5 JS 的隐式类型转换规则？`'5' + 3`、`'5' - 3` 结果是什么？

**加法 `+` 有二义性**：既可以"字符串拼接"，也可以"数字相加"。

**规则**：

1. **如果有一个操作数是字符串** → 另一个也转字符串，**拼接**。
2. **否则（其他运算符 `- * /`）** → 两个都转数字，**运算**。
3. **一元 `+`** → 转数字（同 `Number()`）。

```js
"5" + 3; // '53'   （拼接）
"5" - 3; // 2      （运算：5 - 3）
"5" * "2"; // 10
5 + true; // 6      （true → 1）
5 + false; // 5      （false → 0）
5 + null; // 5      （null → 0）
5 + undefined; // NaN    （undefined → NaN）
```

**对象转原始值 `ToPrimitive`**：

```js
// 对象先调 valueOf，再调 toString，都没有就报错
const obj = {
  valueOf() {
    return 10;
  },
  toString() {
    return "20";
  },
};
obj + 1; // 11（valueOf 返回数字 → 加法）
obj + "1"; // '101'（valueOf 返回数字 + 字符串 → 拼接）
String(obj); // '10'（用 valueOf 的结果？不，String() 直接用 toString → '20'）
// 注：当 hint 是 'string'（String() 或 + 两侧都是对象）时先调 toString
//    当 hint 是 'number'（Number() 或 - * /）时先调 valueOf
```

---

### Q6 变量提升（Hoisting）是什么？`var`、`let`、`const`、`function` 的提升规则？

**提升 = 变量/函数声明被"挪到"作用域顶部"的行为**。

```js
console.log(a); // undefined —— var 被"提升"但未赋值
// console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
// console.log(c); // ❌ 同上
var a = 1;
let b = 2;
const c = 3;

foo(); // ✅ 1 —— 函数声明整体被提升（包括实现）
function foo() {
  return 1;
}

bar(); // ❌ TypeError: bar is not a function —— var bar 提升为 undefined
var bar = function () {
  return 2;
};
```

**规则总览**：

| 声明方式                      | 是否提升                         | 提升后的"初始值"               | 访问时机限制                       |
| ----------------------------- | -------------------------------- | ------------------------------ | ---------------------------------- |
| `var`                         | ✅ 提升声明，不提升赋值          | `undefined`                    | 可在声明前访问（但值为 undefined） |
| `let`/`const`                 | ✅ 提升声明                      | 未初始化（Temporal Dead Zone） | 声明前访问 → ReferenceError        |
| 函数声明 `function f() {}`    | ✅ 整体提升（含实现）            | 函数体                         | 可在声明前调用                     |
| 函数表达式 `var f = () => {}` | 同 `var`（变量提升，不提升赋值） | `undefined`                    | 声明前调用 → TypeError             |

**TDZ（Temporal Dead Zone，暂时性死区）**：

```js
function demo() {
  // ← 从这里到 let/const 声明之前，是 x 的 TDZ
  console.log(x); // ❌ 哪怕 typeof 也会报错！
  let x = 5;
}
```

> **最佳实践**：不用 `var`，用 `let` + `const`。变量在使用前声明。函数用函数声明或箭头函数。

---

### Q7 作用域（Scope）有几种？什么是块级作用域？

```text
1. 全局作用域：最外层，污染全局
2. 函数作用域：每一个 function 都是一个新作用域
3. 块级作用域：{ } 里的 let/const（ES6 引入）
4. 模块作用域：ES Module 的顶层作用域（不污染全局）
5. eval / with（不推荐）
```

```js
// var 只有函数/全局作用域，没有块级作用域 —— 经典坑
for (var i = 0; i < 3; i++) {}
console.log(i); // 3（i 泄露到外层了！）

// let/const 有块级作用域
for (let j = 0; j < 3; j++) {}
// console.log(j); // ❌ j is not defined

// if 同理
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x); // 1
// console.log(y); // ❌
```

---

## 二、闭包与作用域链

### Q8 什么是闭包（Closure）？请举例说明。

**闭包 = 函数 + 它"出生"时能访问的外部变量**。一个函数在定义时"捕获"了外层作用域的变量，即使外层函数已执行完毕，内部函数仍能访问那些变量。

```js
function makeCounter() {
  let count = 0; // ← 这个变量被"关在"闭包里
  return function () {
    // ← 返回的函数引用了 count，形成闭包
    return ++count;
  };
}
const c = makeCounter();
console.log(c()); // 1
console.log(c()); // 2
console.log(c()); // 3
// count 变量在外部完全不可见，只能通过 c() 访问 —— 这就是"私有变量"
```

**经典面试题 —— 循环 + setTimeout**：

```js
// 经典陷阱：全部输出 5！（因为 var i 只有一份，循环结束 i=5，setTimeout 到时再读它）
for (var i = 1; i <= 5; i++) {
  setTimeout(() => console.log(i), 0);
}

// 方案 1：let（每次循环一个块级作用域副本）
for (let i = 1; i <= 5; i++) {
  setTimeout(() => console.log(i), 0);
}

// 方案 2：IIFE 立即执行函数（创建新作用域把 i 快照下来）
for (var i = 1; i <= 5; i++) {
  (function (n) {
    setTimeout(() => console.log(n), 0);
  })(i);
}
```

**闭包的用途**：

| 用途               | 示例                                                                |
| ------------------ | ------------------------------------------------------------------- |
| 模块私有化         | `const module = (() => { let _private; return { /* API */ }; })();` |
| 函数工厂           | `makeAdder(5)(3) = 8`                                               |
| 柯里化             | `const add = a => b => a + b`                                       |
| 缓存 / Memoization | 把结果存在闭包变量里避免重算                                        |
| 回调保持上下文     | 事件处理函数、Promise.then 里使用外层变量                           |

**闭包的风险 —— 内存泄漏**：

```js
function bigData() {
  const huge = new Array(10_000_000).fill("*"); // 占用大量内存
  return function () {
    return huge.length;
  }; // 闭包引用 huge
}
const leak = bigData();
// bigData 已返回，但 huge 无法被 GC —— 因为 leak 还引用着它
// 解决：leak = null; 让闭包对象失去引用
```

---

### Q9 什么是作用域链（Scope Chain）？什么是词法作用域？

**词法作用域（Lexical Scoping）= 静态作用域**：函数的"能访问哪些变量"由它**定义的位置**决定，而不是**调用位置**。JS 就是词法作用域（除 `with`/`eval` 例外）。

```js
const x = 1;
function f() {
  console.log(x);
} // f 定义处引用 x → 指向外层 x=1
function g() {
  const x = 2;
  f(); // 输出 1，不是 2！因为 f 的作用域链在"定义时"已锁定
}
g(); // 1
```

**作用域链查找规则**：当前作用域找不到 → 往上一层（定义它的父作用域）→ 全局 → `ReferenceError`。

---

### Q10 什么是 IIFE？为什么要用它？

**IIFE = Immediately Invoked Function Expression = 立即执行函数表达式**。

```js
// 形式 1
(function () {
  const x = 42; // 局部变量，不污染全局
  console.log(x);
})();

// 形式 2（箭头函数）
(() => {
  /* ... */
})();

// 用括号、!、+、~、void 都可以把 function 变成"表达式"
!(function () {
  /* ... */
})();
```

**为什么需要它**（ES6 之前）：

1. **创建私有作用域**，避免变量泄露到全局。
2. **模块化**——经典的"模块模式"：

```js
const Module = (function () {
  let _count = 0; // 私有（外部永远访问不到）
  return {
    inc() {
      return ++_count;
    },
    get() {
      return _count;
    },
  };
})();
Module.inc(); // 1
Module._count; // undefined
```

> **ES6 时代的替代**：用 **ES Module**（`import/export`）或者 **块级作用域 + let/const**，IIFE 越来越少用。

---

## 三、原型与继承

### Q11 什么是原型（Prototype）？每个对象都有 `__proto__` 吗？

**原型 = 对象的"模板/父亲"**。几乎所有 JS 对象在创建时都关联另一个对象——它的"原型"，当访问对象上不存在的属性时，JS 会**沿着原型链向上找**。

```js
const obj = { name: "Alice" };
obj.__proto__ === Object.prototype; // true（非标准但浏览器都支持的属性）
Object.getPrototypeOf(obj) === Object.prototype; // ✅ 标准 API（推荐）

// 原型链：obj → Object.prototype → null
console.log(obj.toString()); // '[object Object]' —— 从 Object.prototype 继承
```

**构造函数 + `prototype` 属性**：

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(this.name + " makes a sound.");
};

const dog = new Animal("Rex");
dog.speak(); // 'Rex makes a sound.'

// ===== 三者关系（一定要记住这张图）=====
//   dog.__proto__         === Animal.prototype
//   Animal.prototype.constructor === Animal
//   Animal.__proto__      === Function.prototype
//   Animal.prototype.__proto__ === Object.prototype
```

**关于 `__proto__`**：它不是 ES 标准（但所有浏览器都实现过），**推荐用 `Object.getPrototypeOf / Object.setPrototypeOf / Object.create`**。

---

### Q12 `new` 关键字到底做了什么？

**四步走**：

```js
function Person(name) {
  this.name = name;
}

// 写一个简化版的 myNew
function myNew(constructor, ...args) {
  // 1) 新建空对象，把它的 __proto__ 指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);

  // 2) 调用构造函数，this 绑定到新对象
  const result = constructor.apply(obj, args);

  // 3) 如果构造函数返回了"对象"，则返回该对象；否则返回 obj
  return result instanceof Object ? result : obj;
}

const p = myNew(Person, "Alice");
p.name; // 'Alice'
p instanceof Person; // true
```

> **关键**：`new` 的本质是"给你一个继承了 `Constructor.prototype` 的空对象，然后用 Constructor 初始化它"。

---

### Q13 原型链（Prototype Chain）是怎样的？`instanceof` 的原理？

```text
dog ---> Animal.prototype ---> Object.prototype ---> null
                        speak()              toString()
```

**属性查找**：`dog.speak` → dog 本身没有 → 到 `Animal.prototype` 找到 → 返回。
**属性设置**：直接赋值给对象本身，不动原型（除非原型上有 setter）。

**`instanceof` 的原理**：沿着 `__proto__` 链一路向上找，如果某个 `__proto__ === Constructor.prototype` 即返回 true。

```js
// 手写 instanceof
function myInstanceOf(obj, Ctor) {
  if (obj === null || typeof obj !== "object") return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

myInstanceOf([], Array); // true
myInstanceOf([], Object); // true
myInstanceOf(/abc/, RegExp); // true
```

---

### Q14 如何实现继承？ES5 的组合寄生继承 vs ES6 的 `class` 继承

**方法 1：ES6 class 继承（推荐）**

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 必须在 this 之前调用
    this.breed = breed;
  }
  bark() {
    console.log("Woof!");
  }
}

// 静态方法也能继承（JS 中其实是 Dog.__proto__ = Animal）
class Animal {
  static create(name) {
    return new Animal(name);
  }
}
Dog.create("Rex"); // ✅ 能调用父类静态方法
```

**方法 2：ES5 组合寄生继承（class 的大致实现）**

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(this.name);
};

function Dog(name, breed) {
  Animal.call(this, name); // 1) 借用父类构造器（构造函数继承）
  this.breed = breed;
}

// 2) 原型继承（不直接 new Animal，避免父类构造函数被执行两次）
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () {
  console.log("Woof!");
};
```

**为什么不用 `Dog.prototype = new Animal()`**？—— 因为父类构造函数可能有副作用（比如设默认属性），不希望在"定义继承关系"的时候就执行。`Object.create` 是更干净的方式。

---

### Q15 `Object.create`、`Object.setPrototypeOf`、`Object.assign` 的区别？

```js
// 1. Object.create(proto) —— 创建一个以 proto 为原型的"空"对象
const animal = {
  breath() {
    console.log("breathing");
  },
};
const dog = Object.create(animal);
dog.name = "Rex";
dog.breath(); // 'breathing'（从原型继承）

// 2. Object.setPrototypeOf(obj, proto) —— 动态修改原型（性能差，尽量避免）
const cat = { name: "Kitty" };
Object.setPrototypeOf(cat, animal);
cat.breath();

// 3. Object.assign(target, ...sources) —— 浅拷贝属性到 target
const obj = Object.assign({}, animal, { color: "brown" });
// 等价于 { ...animal, color: 'brown' }
// 注意：只拷贝"可枚举自有属性"，不拷贝原型、不拷贝 getter/setter（而是取值后赋值）
```

---

### Q16 `hasOwnProperty` / `in` / `for...in` 的区别？

```js
const obj = { name: "Alice" };
Object.prototype.sayHi = () => {}; // 在原型上加一个方法

"name" in obj; // ✅ true（包括继承的属性）
"sayHi" in obj; // ✅ true（原型上的）
obj.hasOwnProperty("name"); // ✅ true
obj.hasOwnProperty("sayHi"); // ❌ false

// for...in 会枚举"所有可枚举属性（包括原型链上的）"
for (const k in obj) {
  // name, sayHi
  if (obj.hasOwnProperty(k)) {
    /* 过滤出自身属性 */
  }
}

// 想要只拿自身键 —— 用 Object.keys / Object.values / Object.entries
Object.keys(obj); // ['name']（不包含原型）
```

---

## 四、执行上下文与 this

### Q17 什么是执行上下文（Execution Context）？什么是调用栈（Call Stack）？

**执行上下文 = "执行一段代码时 JS 引擎需要知道的所有信息"**，包括：

- 变量环境（`var`/函数声明）
- 词法环境（`let/const`、块级作用域）
- `this` 绑定

**三种类型**：

| 类型            | 创建时机                               |
| --------------- | -------------------------------------- |
| 全局执行上下文  | 程序启动时创建，有且仅有一个           |
| 函数执行上下文  | 函数被调用时创建（每次调用都新建一个） |
| eval 执行上下文 | （忽略）                               |

**调用栈（Call Stack / Execution Stack）**：JS 是单线程的，所以只有一个栈。函数调用时压栈，返回时出栈。

```js
function a() {
  console.trace();
  b();
}
function b() {
  console.trace();
  c();
}
function c() {
  console.trace();
}
a();
// 栈：
//  [global]
//  [global, a]
//  [global, a, b]
//  [global, a, b, c]
//  c 返回 → 弹出 → b 返回 → 弹出 → a 返回 → 弹出 → 回到 global
```

**栈溢出（Stack Overflow）**：无限递归导致调用栈超过引擎限制（Chrome 约 1 万层）。

```js
function blowUp() {
  blowUp();
}
blowUp(); // RangeError: Maximum call stack size exceeded
```

---

### Q18 `this` 的绑定规则？箭头函数的 `this`？

**5 条规则（优先级从低到高）**：

```text
1. 默认绑定（独立调用）：this = 全局对象（非严格模式）或 undefined（严格模式）
2. 隐式绑定（obj.fn()）：  this = 点前面的那个对象
3. 显式绑定（call/apply/bind）：this = 第一个参数
4. new 绑定：              this = 新创建的对象
5. 箭头函数：              this = 定义箭头函数时"外层作用域的 this"
```

**逐一示例**：

```js
// 1) 默认绑定
function show() {
  console.log(this);
}
show(); // 浏览器：window；严格模式：undefined

// 2) 隐式绑定
const obj = {
  x: 1,
  f() {
    console.log(this.x);
  },
};
obj.f(); // 1（this = obj）
const g = obj.f;
g(); // undefined（"丢失了 this"，退化为默认绑定）

// 3) 显式绑定
function greet(greeting) {
  console.log(greeting, this.name);
}
greet.call({ name: "A" }, "Hi"); // Hi A
greet.apply({ name: "B" }, ["Hi"]);
const greetC = greet.bind({ name: "C" }); // 返回新函数，this 被永久固定
greetC("Hi"); // Hi C

// 4) new 绑定
function User(name) {
  this.name = name;
}
const u = new User("D"); // this = u

// 5) 箭头函数（最特殊）
const arrowDemo = {
  name: "E",
  method() {
    // 普通函数的 this = arrowDemo（因为是 obj.method() 调用）
    setTimeout(() => {
      console.log(this.name); // 'E' —— 箭头函数"捕获外层 this"
    }, 0);

    // 对比：普通函数作为 setTimeout 的回调，this 变成 window/undefined
    setTimeout(function () {
      console.log(this.name); // 空 / undefined
    }, 0);
  },
};
arrowDemo.method();
```

**箭头函数的 3 个要点**：

```text
① 没有自己的 this / arguments / super
② 不能 new（没有 [[Construct]] 槽位），不能 yield
③ this 一旦绑定就再也改变不了（call/apply/bind 都无效）
```

**面试高频陷阱**：

```js
const obj = {
  x: 10,
  f: () => console.log(this.x), // 箭头函数的 this 是"定义时的外层 this"——此处是全局/模块作用域
};
obj.f(); // undefined（不是 10！）
```

---

### Q19 `call` / `apply` / `bind` 的区别？手写一个 `bind`？

| 方法                           | 参数形式             | 是否立刻执行  |
| ------------------------------ | -------------------- | ------------- |
| `fn.call(thisArg, a, b, c)`    | 参数挨个传           | ✅ 立即执行   |
| `fn.apply(thisArg, [a, b, c])` | 参数以"数组"形式传入 | ✅ 立即执行   |
| `fn.bind(thisArg, a, b)`       | 可部分应用参数       | ❌ 返回新函数 |

```js
function add(a, b) {
  return a + b;
}
add.call(null, 1, 2); // 3
add.apply(null, [1, 2]); // 3
const add1 = add.bind(null, 1);
add1(5); // 6

// 经典应用：把类数组转数组（ES6 前的写法，现在用 Array.from 更清晰）
function demoArgs() {
  const arr = Array.prototype.slice.call(arguments); // [1,2,3]
  return arr;
}
demoArgs(1, 2, 3);
```

**手写 bind（常考）**：

```js
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const originalFn = this; // 被绑定的原函数

  function boundFn(...callArgs) {
    // 关键：如果是 new 调用，忽略绑定的 this（new 优先级更高）
    const isNewCall = new.target !== undefined;
    return originalFn.apply(isNewCall ? this : thisArg, [
      ...boundArgs,
      ...callArgs,
    ]);
  }

  // 保持原型链（让 myBind 返回的函数在 instanceof 时表现正确）
  boundFn.prototype = Object.create(originalFn.prototype);
  return boundFn;
};
```

---

### Q20 严格模式（`"use strict"`）有什么影响？

```js
"use strict"; // 可以写在文件顶部（全局严格），或函数第一行（函数严格）

// 1. 变量必须声明
// x = 42;  // ❌ ReferenceError

// 2. 普通函数调用的 this = undefined（不再是全局对象）
function f() {
  return this;
}
f(); // undefined（非严格模式下是 window）

// 3. 不允许重复参数名
// function g(a, a) {} // ❌

// 4. arguments 与形参不再"同步"（非严格模式下会双向同步）
function h(a) {
  a = 99;
  return arguments[0];
}
h(1); // 1（严格模式下 arguments[0] 不再跟着 a 变）

// 5. 禁止 with / eval 引入变量
// with (Math) { console.log(PI); } // ❌

// 6. 禁止删除不可配置属性；禁止给不可扩展对象加属性
// delete Object.prototype; // ❌ TypeError

// 7. 保留字限制：implements、interface、let、package、private... 不可作变量名
```

---

## 五、异步编程

### Q21 JS 的事件循环（Event Loop）是什么？宏任务 / 微任务有哪些？

**JS 是单线程的，但浏览器/Node 通过事件循环实现了"并发"**。核心原理：

```text
             ┌──────────────────────────────┐
             │     调用栈（Call Stack）      │  同步代码在这里执行
             └───────────────┬──────────────┘
                             │ 栈空了
             ┌───────────────▼──────────────┐
             │  微任务队列（Microtasks）     │  ← 先把微任务清空！
             │  Promise.then / queueMicrotask │
             │  MutationObserver            │
             └───────────────┬──────────────┘
                             │ 微任务空了
             ┌───────────────▼──────────────┐
             │  宏任务队列（Macrotasks）     │ ← 取 1 个宏任务执行
             │  setTimeout / setInterval    │
             │  setImmediate（Node）         │
             │  I/O / UI rendering          │
             └──────────────────────────────┘
                               循环 ←
```

**经典代码（背下来+能解释）**：

```js
console.log("1 脚本开始");

setTimeout(() => console.log("2 setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("3 Promise 1"))
  .then(() => console.log("4 Promise 2"));

console.log("5 脚本结束");

// 输出顺序：
// 1 脚本开始
// 5 脚本结束
// 3 Promise 1        ← 先处理微任务（整批处理）
// 4 Promise 2
// 2 setTimeout       ← 再处理一个宏任务
```

**记住口诀**：

- **先同步 → 再微任务 → 再下一个宏任务**
- **微任务 = Promise.then**（一次事件循环会把**所有**微任务都跑完）
- **宏任务 = setTimeout 等**（一次事件循环只跑**一个**宏任务，然后又去清空微任务）

---

### Q22 Promise 的三种状态？状态转换规则？

```text
         (executor 执行)
Pending  ── resolve(value) ──► Fulfilled（已完成）
         └─ reject(reason) ──► Rejected（已拒绝）

规则：① 状态只能从 Pending → Fulfilled 或 Pending → Rejected；
     ② 一旦改变就不可逆；
     ③ .then / .catch / .finally 都基于这个状态变化。
```

```js
const p = new Promise((resolve, reject) => {
  console.log("同步执行"); // ✅ 立刻执行
  setTimeout(() => resolve("ok"), 100);
});

p.then((v) => console.log(v)) // 'ok'
  .catch((err) => console.error(err))
  .finally(() => console.log("都会执行")); // 无论成功失败都执行
```

---

### Q23 手写一个最简版的 Promise（符合 A+ 规范思想）

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = []; // 存 .then 的 { onFulfilled, onRejected, resolve, reject }

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((cb) => this._runCallback(cb));
    };
    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.callbacks.forEach((cb) => this._runCallback(cb));
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  _runCallback(cb) {
    queueMicrotask(() => {
      // 模拟微任务
      try {
        const result =
          this.state === "fulfilled"
            ? cb.onFulfilled(this.value)
            : cb.onRejected(this.value);
        // 处理返回值：如果是 Promise 则要等待
        if (result && typeof result.then === "function") {
          result.then(cb.resolve, cb.reject);
        } else {
          cb.resolve(result);
        }
      } catch (e) {
        cb.reject(e);
      }
    });
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const cb = {
        onFulfilled: typeof onFulfilled === "function" ? onFulfilled : (v) => v,
        onRejected:
          typeof onRejected === "function"
            ? onRejected
            : (e) => {
                throw e;
              },
        resolve,
        reject,
      };
      if (this.state === "pending") this.callbacks.push(cb);
      else this._runCallback(cb);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(v) {
    return new MyPromise((r) => r(v));
  }
  static reject(e) {
    return new MyPromise((_, r) => r(e));
  }
}
```

> 完整 A+ 规范还需要处理"thenable"、循环引用、值穿透等，但面试里写出上述骨架 + 解释思路就足够。

---

### Q24 `Promise.all` / `allSettled` / `race` / `any` 的区别？

| 方法                    | 成功条件                         | 失败条件                              | 返回内容                                                      |
| ----------------------- | -------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `Promise.all([...])`    | **全部**成功                     | **任何一个**失败 → 立刻返回这个失败   | 成功时：按顺序的结果数组                                      |
| `Promise.allSettled`    | 永远成功（等全部完成）           | 永不失败                              | `[{status:'fulfilled', value} / {status:'rejected', reason}]` |
| `Promise.race`          | 第一个**完成**的（无论成功失败） | 第一个失败的                          | 第一个完成的值/错误                                           |
| `Promise.any`（ES2021） | 第一个**成功**的                 | 全部失败才失败（返回 AggregateError） | 第一个成功的值                                                |

**经典场景**：

```js
// 并行请求多个 API，全部完成后一起处理
Promise.all([fetch("/users"), fetch("/orders"), fetch("/products")]).then(
  ([users, orders, products]) => console.log(users, orders, products),
);

// 超时控制（race：谁先到用谁）
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms)),
  ]);
}

// 从多台 CDN 取资源，哪个快用哪个（any：只要一个成功就行）
Promise.any([
  fetch("//cdn1/x.jpg"),
  fetch("//cdn2/x.jpg"),
  fetch("//cdn3/x.jpg"),
]);
```

**手写 Promise.all**：

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;
        if (++completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

---

### Q25 `async/await` 是什么？它只是 Promise 的语法糖吗？

**`async` 函数 = 返回 Promise 的函数**。
**`await` = 暂停当前 async 函数，等待 Promise 解决后再继续**。

```js
async function fetchUser(id) {
  const res = await fetch(`/user/${id}`); // 暂停，让出线程
  const user = await res.json(); // 继续
  return user; // 返回值会被包成 Promise
}

fetchUser(1).then((u) => console.log(u));
```

**要点**：

```text
① async 函数永远返回 Promise（哪怕你 return 1 → Promise<1>）
② await 只能用在 async 函数里（除了 ES2022 的 Top-level await）
③ await 后面跟非 Promise → 自动转成 Promise.resolve(x)
④ try/catch 能捕获 await 抛出的错误 —— 这是比 .then 链式更直观的地方
⑤ await 是"按顺序等待"，要并行必须先把 Promise 启动：
```

```js
// ❌ 串行（1s + 1s = 2s）
const a = await slowFetch("/a");
const b = await slowFetch("/b");

// ✅ 并行（只要 1s）
const [pa, pb] = [slowFetch("/a"), slowFetch("/b")];
const [a, b] = [await pa, await pb];
// 或：
const [a, b] = await Promise.all([slowFetch("/a"), slowFetch("/b")]);
```

**它只是语法糖吗？**——是的。`async/await` 背后本质是 Promise + 协程（JS 引擎把 await 前后的代码"切成"多个 `.then` 回调）。但它让异步代码"看上去像同步"，极大降低心智负担。

---

### Q26 如何实现一个带并发限制的 Promise 调度器？

```js
/**
 * 限制同一时刻最多 n 个任务在跑
 * usage:
 *   const s = new Scheduler(2);
 *   s.add(() => delay(1000).then(() => console.log(1)));
 *   s.add(() => delay(500).then(() => console.log(2)));
 *   s.add(() => delay(300).then(() => console.log(3)));
 *   // 输出 2、3、1（因为最多同时 2 个：1 & 2 先跑，2 跑完后 3 开始）
 */
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._tryRun();
    });
  }
  _tryRun() {
    if (this.running >= this.limit || this.queue.length === 0) return;
    const { task, resolve, reject } = this.queue.shift();
    this.running++;
    Promise.resolve(task())
      .then(resolve, reject)
      .finally(() => {
        this.running--;
        this._tryRun();
      });
  }
}
```

---

### Q27 什么是宏任务 / 微任务？`process.nextTick` / `setImmediate` / `setTimeout(0)` 的顺序？（Node 特有）

| 队列                   | 内容                   | 执行时机                                     |
| ---------------------- | ---------------------- | -------------------------------------------- |
| `process.nextTick`     | nextTickQueue          | **当前栈清空后立刻执行**，优先级比微任务还高 |
| 微任务（Promise.then） | microtaskQueue         | nextTick 之后，宏任务之前                    |
| 宏任务（timer）        | setTimeout/setInterval | 到期的 timer 先处理                          |
| 宏任务（poll）         | I/O                    | poll 阶段                                    |
| `setImmediate`         | check 阶段             | poll 之后                                    |

```js
// Node 环境中的经典对比
setImmediate(() => console.log("immediate"));
setTimeout(() => console.log("timeout 0"), 0);
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
// 输出：
// nextTick → promise → timeout 0 → immediate（常见顺序，但 timer 可能在不同机器上变化）
// 官方说法：setTimeout(0) 和 setImmediate 的相对顺序是不保证的
// 但在 I/O 循环内（如 fs.readFile 的回调里），setImmediate 一定先于 setTimeout
```

---

## 六、数组与对象操作

### Q28 `map / forEach / filter / reduce / some / every / find / findIndex` 的区别？

| 方法                   | 返回值                       | 是否短路                      | 常见用法                 |
| ---------------------- | ---------------------------- | ----------------------------- | ------------------------ |
| `arr.map(fn)`          | **新数组**（长度相同）       | 否                            | 变换每个元素             |
| `arr.forEach(fn)`      | `undefined`                  | 否（return 只是跳出当前回调） | 纯副作用                 |
| `arr.filter(fn)`       | **新数组**（只保留 true 的） | 否                            | 筛选                     |
| `arr.reduce(fn, init)` | **任意值**                   | 否                            | 累积、求和、转对象、分组 |
| `arr.some(fn)`         | `boolean`                    | ✅ 第一个 true 就返回         | "至少一个满足？"         |
| `arr.every(fn)`        | `boolean`                    | ✅ 第一个 false 就返回        | "全部满足？"             |
| `arr.find(fn)`         | 找到的元素 或 `undefined`    | ✅                            | 找第一个满足的元素       |
| `arr.findIndex(fn)`    | index 或 `-1`                | ✅                            | 找第一个满足的索引       |

**`reduce` 万能用法**：

```js
const nums = [1, 2, 3, 4];

// 1. 求和
nums.reduce((sum, n) => sum + n, 0); // 10

// 2. 数组 → 对象
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];
users.reduce((acc, u) => {
  acc[u.id] = u.name;
  return acc;
}, {});
// { '1': 'A', '2': 'B' }

// 3. 数组去重
[1, 2, 2, 3, 3, 3].reduce(
  (acc, n) => (acc.includes(n) ? acc : [...acc, n]),
  [],
);
// （当然，用 [...new Set(arr)] 更简单）

// 4. 合并多个 Promise（按顺序等待）
[() => f1(), () => f2(), () => f3()].reduce(
  (chain, fn) => chain.then(fn),
  Promise.resolve(),
);
```

---

### Q29 浅拷贝 / 深拷贝？如何实现深拷贝？

**浅拷贝 = 只拷贝第一层引用，深层对象仍共享**
**深拷贝 = 递归拷贝所有层级，完全脱离原对象**

```js
const a = { x: 1, y: { z: 2 } };

// 浅拷贝方法（常用 3 种）
const b1 = { ...a };
const b2 = Object.assign({}, a);
const b3 = JSON.parse(JSON.stringify(a)); // ← 这其实是"深拷贝"（但有坑）

b1.y.z = 99;
console.log(a.y.z); // 99（被改了！浅拷贝的 y 还是同一个对象）

// ===== 深拷贝方案 =====
// 方案 1：JSON 序列化 —— 最简单，但是：
// ✗ 丢函数/undefined/Symbol/Date(变成字符串)/RegExp
// ✗ 丢循环引用（会抛错）
// ✗ 原型链信息（instanceof 会错）
const c = JSON.parse(JSON.stringify(a));

// 方案 2：structuredClone（浏览器/Node 17+ 原生 API，推荐！）
const d = structuredClone(a);
// 支持：循环引用、Date、RegExp、Map、Set、Blob…
// 不支持：函数、Symbol、DOM 节点

// 方案 3：手写递归（面试常考）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj; // 原始值直接返回
  if (map.has(obj)) return map.get(obj); // 循环引用处理
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map)
    return new Map([...obj].map(([k, v]) => [k, deepClone(v, map)]));
  if (obj instanceof Set)
    return new Set([...obj].map((v) => deepClone(v, map)));

  const clone = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  map.set(obj, clone);
  for (const k of Object.keys(obj)) {
    clone[k] = deepClone(obj[k], map);
  }
  return clone;
}

// 方案 4：lodash.cloneDeep —— 生产环境最常用
import _ from "lodash";
const e = _.cloneDeep(a);
```

---

### Q30 `Array.prototype.sort()` 的默认排序规则？它是稳定的吗？

```js
// 默认：把元素转成字符串后按 Unicode 码点排！
[10, 2, 100].sort(); // [10, 100, 2] —— 因为 '10' < '100' < '2'（字符串比较）

// 正确写法：传比较函数
[10, 2, 100].sort((a, b) => a - b); // [2, 10, 100]  升序
["z", "A", "b"].sort((a, b) => a.localeCompare(b)); // 正确按字母序

// 对象排序
const users = [
  { name: "B", age: 20 },
  { name: "A", age: 30 },
];
users.sort((a, b) => a.age - b.age);
```

**稳定性**：ES2019 起，规范要求 `Array.prototype.sort` 必须是**稳定排序**（相同键的元素相对顺序不变）。现代浏览器都用 TimSort 或类似算法实现。

---

### Q31 数组去重的 N 种方式？

```js
const arr = [1, 2, 2, 3, 4, 4, 5];

// 1. Set（最简）
[...new Set(arr)];

// 2. filter + indexOf
arr.filter((v, i, a) => a.indexOf(v) === i);

// 3. reduce
arr.reduce((acc, v) => (acc.includes(v) ? acc : [...acc, v]), []);

// 4. 保留后面出现的（反向取最后一次）
arr.reduceRight((acc, v) => (acc.includes(v) ? acc : [v, ...acc]), []);

// 5. 对象按某字段去重
const people = [{ id: 1 }, { id: 2 }, { id: 1 }];
const seen = new Set();
people.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
// 或 Map：
[...new Map(people.map((p) => [p.id, p])).values()];
```

---

### Q32 展开运算符 `...` 与 `Object.assign`、`Array.concat` 的关系？

```js
// 数组展开 —— 等价于 concat / apply
const arr = [1, 2, ...[3, 4], 5]; // [1,2,3,4,5]
Math.max(...[1, 5, 3]); // 5（之前要写 Math.max.apply(null, [...])）

// 对象展开 —— 浅拷贝 + 合并（后面的键覆盖前面的）
const user = { name: "Alice" };
const withAge = { ...user, age: 30 };
const override = { ...user, name: "Alicia" }; // { name: 'Alicia' }

// 等价写法：
Object.assign({}, user, { age: 30 });
// ❗ 注意：第一个参数是"被修改的目标对象"——传 {} 才能得到新对象
// 常见错误：Object.assign(user, {age: 30}) —— user 被修改了！
```

> **陷阱**：展开运算符是**浅拷贝**，嵌套对象仍是共享引用。

---

## 七、ES6+ 新特性

### Q33 `let` / `const` 和 `var` 的区别？

| 特性           | `var`                          | `let`                   | `const`                                    |
| -------------- | ------------------------------ | ----------------------- | ------------------------------------------ |
| 作用域         | 函数作用域                     | 块级作用域              | 块级作用域                                 |
| 提升 + TDZ     | 提升 → `undefined`             | 提升 + TDZ              | 提升 + TDZ                                 |
| 能否重新声明   | ✅                             | ❌ 同作用域不能重复声明 | ❌                                         |
| 能否重新赋值   | ✅                             | ✅                      | ❌（变量本身不可重新赋值，但对象属性可变） |
| 挂在全局对象上 | ✅（`var x = 1` → `window.x`） | ❌                      | ❌                                         |

**`const` 声明的对象属性可以改吗？**——可以！`const` 只保证"变量不被重新赋值"，不保证"对象不可变"。

```js
const user = { name: "Alice" };
user.name = "Bob"; // ✅ 合法（只是改了对象内部属性）
// user = { name: 'Carol' }; // ❌ 不能重新赋值
```

要真正冻结：`Object.freeze(user)`。

---

### Q34 箭头函数和普通函数有哪些区别？

| 区别                          | 普通函数 `function(){}` | 箭头函数 `() => {}`              |
| ----------------------------- | ----------------------- | -------------------------------- |
| `this`                        | 动态（调用方式决定）    | **继承外层的 this**（词法 this） |
| `arguments`                   | ✅ 有                   | ❌ 没有（用 `...rest` 代替）     |
| `new.target`                  | ✅ 有                   | ❌ 没有                          |
| 能否 `new`                    | ✅ 有 [[Construct]]     | ❌ 没有                          |
| `prototype` 属性              | ✅ 有                   | ❌ 没有                          |
| 能否作为 Generator            | ✅ `function*(){}`      | ❌                               |
| `call/apply/bind` 能改变 this | ✅                      | ❌ this 是外层的，改不了         |

```js
const obj = {
  x: 10,
  getThis1() {
    return this;
  }, // this = obj（因为 obj.getThis1() 调用）
  getThis2: () => this, // this = 外层（模块作用域的 this / undefined）
};
obj.getThis1(); // obj
obj.getThis2(); // window（浏览器）或 undefined（模块）
```

---

### Q35 解构赋值（Destructuring）的常见用法？

```js
// 1) 对象解构 + 默认值 + 重命名
const user = { name: "Alice", age: 30, address: { city: "Beijing" } };
const {
  name,
  age: years, // 重命名为 years
  gender = "unknown", // 默认值（值为 undefined 时生效）
  address: { city }, // 深度解构
} = user;
console.log(name, years, gender, city); // 'Alice', 30, 'unknown', 'Beijing'

// 2) 数组解构 + 交换变量
const [first, , third] = [1, 2, 3];
let a = 1,
  b = 2;
[a, b] = [b, a]; // a=2, b=1（无需中间变量！）

// 3) 函数参数解构（最常用）
function createUser({ name, age = 18, role = "user" } = {}) {
  // ={} 防止传 undefined 时报错
  return { name, age, role };
}
createUser({ name: "Alice" });

// 4) 解构 + 剩余参数
const [head, ...rest] = [1, 2, 3, 4];
const { x, ...others } = { x: 1, y: 2, z: 3 };
```

---

### Q36 模板字符串（Template Literals）能做什么？标签模板（Tagged Template）？

```js
const name = "Alice";
const msg = `Hello, ${name.toUpperCase()}! 1+1=${1 + 1}`; // 表达式可以是任意 JS

// 多行字符串
const html = `
  <div>
    <p>${name}</p>
  </div>
`;

// 标签模板：自定义如何把模板"拼起来"
function highlight(strings, ...values) {
  // strings = ['Hi ', ', you are ', ' years old']
  // values  = ['Alice', 30]
  return strings.reduce(
    (acc, s, i) => acc + s + (values[i] ? `<b>${values[i]}</b>` : ""),
    "",
  );
}
highlight`Hi ${"Alice"}, you are ${30} years old`;
// 'Hi <b>Alice</b>, you are <b>30</b> years old'

// 实战应用：styled-components、SQL 模板、i18n、安全 HTML 转义
```

---

### Q37 `Map` / `Set` / `WeakMap` / `WeakSet` 的区别？

**Set = 不重复的元素集合**
**Map = 键值对集合（键可以是任意类型，不仅是字符串）**

```js
// Set：常用于去重、判断元素存在
const s = new Set([1, 2, 2, 3]);
s.add(4).has(2);
[...s]; // [1, 2, 3, 4]

// Map：常用于需要"对象作键"或"保持插入顺序"的场景
const m = new Map();
const key = { id: 1 };
m.set(key, "value");
m.get(key); // 'value'
for (const [k, v] of m) {
  /* ... */
}
```

**Weak 版（弱引用）**：

- 键必须是**对象**
- 对键是"弱引用"——当对象只被 WeakMap/WeakSet 引用时，可以被 GC 回收
- **不可迭代**（没有 `size`、没有 `keys/values/entries`）
- 应用场景：**给第三方对象"挂私有数据"**、**缓存但不阻止 GC**

```js
// 典型场景：保存 DOM 节点的元数据，节点被移除时自动释放
const metadata = new WeakMap();
function process(el) {
  metadata.set(el, { processedAt: Date.now() });
}
// 当 el 被 DOM 移除后，它在 WeakMap 里的条目也会被 GC 回收 —— 不会泄漏
```

| 特性            | Map          | WeakMap                | Set | WeakSet    |
| --------------- | ------------ | ---------------------- | --- | ---------- |
| 键类型          | 任意         | 只能是对象             | ——  | 只能是对象 |
| 可迭代          | ✅           | ❌                     | ✅  | ❌         |
| 有 `size`       | ✅           | ❌                     | ✅  | ❌         |
| GC 影响键的存在 | ❌（强引用） | ✅（弱引用，会自动删） | ❌  | ✅         |

---

### Q38 `Symbol` 是什么？有什么用？

**Symbol = 唯一且不可变的值**，主要用于"不冲突的属性键"。

```js
const s1 = Symbol("desc"); // 'desc' 只是描述（用于调试），不影响唯一性
const s2 = Symbol("desc");
s1 === s2; // false

// 1) 避免属性名冲突（最大的用途）
const SIZE = Symbol("size");
const obj = { name: "Alice", [SIZE]: 42 };
obj[SIZE]; // 42 —— 外部不知道键名时无法访问（非完美私有，但很常见）

// 2) 内部不会被 for...in / Object.keys 枚举（但会被 Object.getOwnPropertySymbols 看到）
Object.keys(obj); // ['name']
Object.getOwnPropertySymbols(obj); // [Symbol(size)]

// 3) 有名（共享）Symbol
Symbol.for("key"); // 相同 key 返回同一个 Symbol（全局注册表）
Symbol.keyFor(s); // 取出 key
```

**内置 Well-known Symbols**（JS 内部使用的"魔法"）：

| Symbol                 | 作用                                        |
| ---------------------- | ------------------------------------------- |
| `Symbol.iterator`      | 让对象可被 `for...of` 迭代                  |
| `Symbol.asyncIterator` | 异步迭代（`for await...of`）                |
| `Symbol.toStringTag`   | `Object.prototype.toString.call()` 返回时用 |
| `Symbol.toPrimitive`   | 对象转原始值时调用                          |
| `Symbol.species`       | 控制派生数组/Map 时使用的构造函数           |

---

### Q39 迭代器（Iterator）与生成器（Generator）？

**迭代器协议**：对象有 `next()` 方法，返回 `{ value, done }`。

**可迭代协议**：对象有 `[Symbol.iterator]()` 方法，返回一个迭代器 → 可被 `for...of`、`...` 展开、解构。

```js
// 让一个自定义对象可迭代
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let cur = this.from;
    return {
      // 返回迭代器
      next: () => ({
        value: cur,
        done: cur++ > this.to,
      }),
    };
  },
};
[...range]; // [1,2,3,4,5]
for (const v of range) console.log(v);
```

**生成器（Generator） = 函数体内可以"暂停 + 恢复"的函数**：

```js
function* gen() {
  console.log("start");
  yield 1; // 暂停 + 产出 1
  yield 2; // 暂停 + 产出 2
  return 3; // 结束
}
const g = gen();
g.next(); // {value: 1, done: false}  同时打印 'start'
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: true}
g.next(); // {value: undefined, done: true}

// 让上面的 range 写法大幅简化
const range2 = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
```

**生成器的高级玩法**：

```js
// 1) 双向通信：next(arg) 能把值"注入"到 yield 表达式的位置
function* echo() {
  const msg = yield "ready";
  yield "got: " + msg;
}
const e = echo();
e.next(); // {value: 'ready'}
e.next("hello"); // {value: 'got: hello'}

// 2) yield* 委托给另一个生成器
function* foo() {
  yield* [1, 2, 3];
}
[...foo()]; // [1,2,3]

// 3) return / throw：调用者终止/让生成器抛错
function* bar() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("cleanup");
  }
}
const b = bar();
b.next(); // {1, false}
b.return("end"); // {value: 'end', done: true}，同时触发 finally
```

---

### Q40 `Proxy` / `Reflect` 能做什么？

**Proxy = 在目标对象前加一层"拦截器"**，能拦截 13 种基本操作（读、写、枚举、`in`、函数调用……）。

```js
const user = { name: "Alice", age: 30 };
const proxy = new Proxy(user, {
  get(target, key, receiver) {
    console.log(`读取 ${String(key)}`);
    return Reflect.get(target, key, receiver); // 用 Reflect 调默认行为
  },
  set(target, key, value, receiver) {
    if (key === "age" && (typeof value !== "number" || value < 0)) {
      throw new TypeError("age 必须是正整数");
    }
    return Reflect.set(target, key, value, receiver);
  },
  has(target, key) {
    return key === "name" ? false : key in target;
  }, // 隐藏 name
  deleteProperty(target, key) {
    console.log("删除", key);
    return Reflect.deleteProperty(target, key);
  },
});

proxy.name; // 'Alice'，同时打印日志
proxy.age = -1; // 抛错
"name" in proxy; // false（被 has 拦截了）
```

**典型应用**：Vue 3 的响应式系统、默认值、只读包装、数据校验、观察者模式、API 请求自动重试/缓存。

**Reflect = 把原来"挂在 Object/Function 上的内部操作"统一成一个命名空间**，所有 Proxy trap 都有对应的 Reflect 方法。

---

### Q41 可选链 `?.` / 空值合并 `??` / 逻辑赋值 `&&=` / `||=` / `??=`？

```js
const user = { address: { city: "Beijing" } };

// 1) 可选链：安全读取深层属性（只要中间任一为 null/undefined，整体即 undefined）
user?.address?.city; // 'Beijing'
user?.contacts?.phone; // undefined（不再报错！）
user?.toUpperCase?.(); // 方法也可以链
arr?.[5]; // 索引访问也能用
fn?.(); // 函数调用也能用

// 2) 空值合并：只有左侧是 null/undefined 时才取右侧（区别于 || 的"任何 falsy 都取"）
const cfg = { count: 0 };
const a = cfg.count ?? 10; // 0 （保留 0）
const b = cfg.count || 10; // 10（错误地把 0 当作缺省）

// 3) 逻辑赋值（ES2021）
let x = 0;
x ||= 42; // x = x || 42 → x = 42
let y = 0;
y ??= 42; // y = y ?? 42 → y = 0
let z = { n: 1 };
z &&= z.n * 10; // z = {n: 10}
```

---

### Q42 Promise.finally / ES2020 到 ES2023 的重要特性？

**一个快速速览**（挑你实际用过的讲）：

- **ES2020**：`Promise.allSettled`、`??`、`?.`、`BigInt`、`globalThis`、动态 `import()`
- **ES2021**：`Promise.any`、`String.prototype.replaceAll`、`||=` `&&=` `??=`、`WeakRef/FinalizationRegistry`、数字分隔符 `1_000_000`
- **ES2022**：类字段 `class { x = 1; #priv = 2; static y = 3; }`、`obj.at(-1)`（数组/字符串的负索引）、`Object.hasOwn(obj, 'k')`（比 `hasOwnProperty` 更安全）、顶层 `await`
- **ES2023**：`Array.prototype.findLast / findLastIndex`、数组的不可变方法 `toReversed / toSorted / toSpliced / with`

```js
// 实用示例
const arr = [1, 2, 3, 4];
arr.at(-1); // 4（负索引！）
arr.findLast((v) => v % 2); // 3（从后往前找第一个满足）
arr.toReversed(); // [4,3,2,1]（不修改原数组，返回新数组）

// 顶层 await（ES Module）
const config = await fetch("/cfg.json").then((r) => r.json());
export { config };

// 私有字段（真·私有，外部完全不可访问）
class Counter {
  #count = 0;
  inc() {
    return ++this.#count;
  }
}
new Counter().#count; // ❌ SyntaxError
```

---

## 八、DOM / BOM / 事件

### Q43 DOM 事件流是怎样的？捕获 / 目标 / 冒泡三阶段？

```text
   window
     │  ↓  捕获阶段（从外到内，addEventListener 第三个参数为 true 时触发）
   document
     │
    html
     │
    body
     │
    div  ── 目标阶段（target）
     │
    body  ← 冒泡阶段（从内到外，默认行为）
     │
   html
     │
   document
     │
   window
```

**三阶段**：

1. **捕获阶段（Capture）**：事件从 window 一层层向下传递到目标元素
2. **目标阶段（Target）**：事件到达实际触发的元素
3. **冒泡阶段（Bubbling）**：事件再从目标元素一层层向上冒泡回 window

```js
// 第三个参数：true = 捕获阶段触发，false/省略 = 冒泡阶段触发
div.addEventListener("click", () => console.log("捕获-div"), true);
div.addEventListener("click", () => console.log("冒泡-div"), false);

// 点击 div 时，捕获会先于冒泡触发
// 事件流顺序：window 捕获 → document 捕获 → ... → div 目标 → ... → document 冒泡 → window 冒泡
```

**阻止冒泡**：`event.stopPropagation()` 或 `event.stopImmediatePropagation()`（后者还会阻止同元素上后续的监听器）。
**阻止默认行为**：`event.preventDefault()`（如 a 标签跳转、form 提交）。

---

### Q44 事件委托（Event Delegation）是什么？为什么要用它？

**事件委托 = 把事件绑在父元素上，利用"冒泡"机制统一处理子元素的事件**。

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```js
// ❌ 不好：每个 li 单独绑定（新增的 li 还得重绑）
document.querySelectorAll("#list li").forEach((li) => {
  li.addEventListener("click", () => console.log(li.textContent));
});

// ✅ 好：委托给父元素 ul
document.getElementById("list").addEventListener("click", (e) => {
  const target = e.target.closest("li"); // 点到 li 内部的子元素也能正确匹配
  if (target) console.log(target.textContent);
});
```

**优点**：

- 内存占用少（只绑 1 个 instead of N 个）
- 动态新增的元素自动生效（不需要重新绑定）
- 代码更简洁

---

### Q45 `e.target` vs `e.currentTarget` vs `this`？

| 变量              | 含义                                       | 何时变化            |
| ----------------- | ------------------------------------------ | ------------------- |
| `e.target`        | **实际触发事件**的元素（最内层）           | 不变                |
| `e.currentTarget` | **当前正在处理事件**的元素（绑事件的那个） | 冒泡/捕获路径上变化 |
| `this`            | 同 `currentTarget`（箭头函数除外）         | 同上                |

```html
<div id="outer">
  <button id="inner">点我</button>
</div>
```

```js
document.getElementById("outer").addEventListener("click", function (e) {
  console.log(e.target.id); // 'inner'（实际被点击的）
  console.log(e.currentTarget.id); // 'outer'（绑事件的元素）
  console.log(this.id); // 'outer'（同 currentTarget）
});
```

---

### Q46 DOM 的查询 / 创建 / 插入 / 删除 API？

```js
// ===== 查询 =====
document.getElementById("id");
document.querySelector(".cls"); // 第一个匹配
document.querySelectorAll(".cls"); // 全部（静态 NodeList）
document.getElementsByTagName("div"); // 动态 HTMLCollection
document.getElementsByClassName("cls"); // 动态

// ===== 创建 =====
const div = document.createElement("div");
div.textContent = "hello";
div.innerHTML = "<b>bold</b>"; // ⚠️ XSS 风险！用户输入不要用 innerHTML
div.setAttribute("data-id", "123");
div.dataset.id = "123"; // 同上（data-* 属性）

// ===== 插入 =====
parent.appendChild(child); // 末尾追加
parent.insertBefore(newNode, referenceNode);
parent.prepend(child); // 开头插入
parent.append(child1, child2); // 末尾（支持多个 + 字符串）
element.after(newEl); // 同级后面
element.before(newEl); // 同级前面

// ===== 删除 / 替换 =====
parent.removeChild(child);
child.remove(); // 更简单（现代 API）
parent.replaceChild(newNode, oldNode);

// ===== 克隆 =====
const clone = element.cloneNode(true); // true = 深克隆（含子节点）
```

**NodeList vs HTMLCollection**：

- `querySelectorAll` 返回**静态** NodeList（DOM 变化不会自动更新）
- `getElementsBy*` 返回**动态** HTMLCollection（实时反映 DOM 变化）
- 都能用 `for...of` 遍历，但只有 Array 才有 `map/filter`，需要 `[...list]` 转数组

---

### Q47 `innerHTML`、`textContent`、`innerText` 的区别？

| API           | 内容                  | 性能                     | 安全性      |
| ------------- | --------------------- | ------------------------ | ----------- |
| `innerHTML`   | 解析 HTML             | 慢（触发重排+解析）      | ⚠️ XSS 风险 |
| `textContent` | 纯文本                | 快                       | 安全        |
| `innerText`   | 受 CSS 影响的可见文本 | 最慢（触发回流计算样式） | 安全        |

```html
<p id="demo">Hello <b style="display:none">hidden</b> world</p>
```

```js
demo.textContent; // 'Hello hidden world'（包括 display:none 的）
demo.innerText; // 'Hello  world'（受 CSS 影响，不含隐藏文本）
demo.innerHTML; // 'Hello <b style="display:none">hidden</b> world'
```

> ✅ **最佳实践**：纯文本一律用 `textContent`；需要 HTML 结构时确保内容可信，或用 `DOMPurify` 过滤。

---

### Q48 回流（Reflow / Layout）与重绘（Repaint）？如何优化？

**回流 = 布局重新计算**（元素尺寸/位置变化 → 整个渲染树要重算）
**重绘 = 像素重新绘制**（如颜色变化，不影响布局 → 只需要重绘）

> 回流一定触发重绘，重绘不一定触发回流。

```js
// ❌ 差：每次读+写交替，浏览器被迫在每一行都回流
const el = document.getElementById("box");
el.style.width = "100px";
console.log(el.offsetWidth); // 强制同步布局
el.style.height = "200px";
console.log(el.offsetHeight); // 又一次回流

// ✅ 好：先读后写（批量写入 DOM）
const w = el.offsetWidth;
const h = el.offsetHeight;
el.style.width = w * 2 + "px";
el.style.height = h * 2 + "px";

// ✅ 更好：用 CSS class 批量修改
el.classList.add("active");

// ✅ 或：离屏操作（DocumentFragment）
const frag = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  frag.appendChild(document.createElement("div"));
}
container.appendChild(frag); // 只触发 1 次回流

// ✅ 或：先 display:none，操作后再恢复（对大改动有用）
container.style.display = "none";
// ...大量 DOM 操作...
container.style.display = "";
```

**其他优化手段**：

- 用 `transform / opacity` 做动画（只触发合成层，不回流不重绘）
- `will-change: transform` 提前提升为合成层
- 避免频繁读取 `offsetWidth / getBoundingClientRect` 等布局属性
- 图片设宽高，避免加载后挤压导致回流
- 用 `requestAnimationFrame` 把 DOM 操作合并到同一帧

---

### Q49 BOM 有哪些常用 API？

```js
// ===== window =====
window.innerWidth / innerHeight; // 视口尺寸（不含工具栏）
window.outerWidth / outerHeight; // 浏览器窗口整体尺寸
window.scrollX / scrollY; // 当前滚动距离
window.pageXOffset / pageYOffset; // 同上（别名）

window.scrollTo(0, 100); // 绝对位置
window.scrollBy(0, 100); // 相对滚动
element.scrollIntoView({ behavior: "smooth" }); // 滚动到元素可见

window.open(url, "_blank"); // 打开新窗口
window.close();

// ===== location =====
location.href; // 完整 URL
location.protocol; // 'https:'
location.host; // 'example.com:8080'
location.hostname; // 'example.com'
location.pathname; // '/foo/bar'
location.search; // '?a=1&b=2'
location.hash; // '#section'
location.origin; // 'https://example.com:8080'
location.assign(url); // 跳转（有历史记录）
location.replace(url); // 跳转（替换当前历史，不能后退）
location.reload(); // 刷新

// ===== history =====
history.length;
history.back();
history.forward();
history.go(-1); // 后退一页
history.pushState({ id: 1 }, "", "/new-url"); // SPA 路由核心（不刷新页面）
history.replaceState({ id: 2 }, "", "/new-url");

// ===== navigator =====
navigator.userAgent; // UA 字符串（不推荐做浏览器判断，用特性检测）
navigator.language; // 'zh-CN'
navigator.geolocation.getCurrentPosition((p) => console.log(p.coords));
navigator.onLine; // 是否在线
navigator.clipboard.writeText("xxx"); // 剪贴板 API（需 HTTPS）

// ===== localStorage / sessionStorage =====
localStorage.setItem("key", "value");
localStorage.getItem("key");
localStorage.removeItem("key");
localStorage.clear();
// sessionStorage 同 API，但关闭标签页即清空；localStorage 永久（除非手动清理）
```

---

### Q50 Cookie / localStorage / sessionStorage / IndexedDB 的区别？

| 特性         | Cookie                  | localStorage | sessionStorage   | IndexedDB              |
| ------------ | ----------------------- | ------------ | ---------------- | ---------------------- |
| 容量         | ~4KB                    | 5~10MB       | 5~10MB           | 无限制（用户磁盘空间） |
| 生命周期     | 可设置过期时间          | 永久         | 标签页关闭即清除 | 永久                   |
| 与服务器通信 | ✅ 每次请求自动携带     | ❌ 不自动    | ❌ 不自动        | ❌ 不自动              |
| 存储类型     | 字符串                  | 字符串       | 字符串           | 任意对象               |
| API 同步     | 同步                    | 同步         | 同步             | 异步                   |
| 跨域         | 同源 + domain/path 限制 | 严格同源     | 严格同源         | 严格同源               |

```js
// Cookie 操作（原生 API 比较繁琐）
document.cookie = "name=Alice; path=/; max-age=3600; HttpOnly=false";
// 注意：HttpOnly 的 Cookie JS 读不到（安全措施，防 XSS 偷 token）

// localStorage 存对象
localStorage.setItem("user", JSON.stringify({ name: "A" }));
const user = JSON.parse(localStorage.getItem("user") || "{}");

// IndexedDB：用第三方库（如 localForage、Dexie.js）更简单
```

---

### Q51 `XMLHttpRequest` vs `fetch` vs `axios`？

```js
// ===== XHR（老式） =====
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/user");
xhr.onload = () => console.log(JSON.parse(xhr.responseText));
xhr.onerror = () => console.error("error");
xhr.send();

// ===== fetch（现代原生，Promise 风格） =====
fetch("/api/user", { credentials: "include" }) // 默认不带 Cookie！
  .then((r) => {
    if (!r.ok) throw new Error("HTTP " + r.status); // ⚠️ 404/500 不会自动 reject！
    return r.json();
  })
  .then((data) => console.log(data));

// ===== async/await + fetch =====
async function getUser() {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("请求失败");
  return res.json();
}

// ===== axios（第三方库） =====
// axios.get('/api/user').then(r => r.data);
// 优势：自动 JSON 解析、请求/响应拦截器、超时、取消请求、自动携带 Cookie
```

**fetch 常见坑**：

- 404/500 等 HTTP 错误状态码**不会**让 Promise reject（只有网络错误才会）
- 默认**不携带 Cookie**，需要 `credentials: 'include'`
- 默认不设超时（需要自己用 `AbortController` 实现）
- 不能直接监听上传进度（XHR 可以）

---

### Q52 `JSONP` 的原理？CORS 与 `withCredentials`？

**JSONP**（老技术，现在用 CORS）：利用 `<script>` 标签不受同源策略限制的特点，请求一段 JS 代码并执行。

```js
// 浏览器端
function jsonp(url, cbName) {
  return new Promise((resolve) => {
    window[cbName] = resolve; // 暴露回调给服务器返回的 JS 调用
    const script = document.createElement("script");
    script.src = `${url}?callback=${cbName}`;
    document.body.appendChild(script);
    script.onload = () => script.remove();
  });
}
// jsonp('//other-domain.com/api', 'cb1').then(data => ...)
// 服务器返回：cb1({name: 'Alice'})
// 缺点：只能 GET；有安全风险（XSS）；依赖服务器支持
```

**CORS（跨域资源共享）**：现代标准方案。

```text
简单请求（GET/HEAD/POST + 特定 Content-Type）：
  浏览器发请求 → 服务器返回 Access-Control-Allow-Origin: *
                    或 Access-Control-Allow-Origin: https://foo.com
                → 浏览器放行

预检请求（OPTIONS 预检 + 实际请求）：
  PUT/DELETE/Content-Type: application/json/自定义 Header 等
  → 先发 OPTIONS 询问服务器
  → 服务器返回 Access-Control-Allow-Methods/Headers/Origin
  → 再发真正的请求

withCredentials: true 时：
  → 带 Cookie
  → 服务器 Access-Control-Allow-Origin 不能是 *，必须是具体域名
  → 同时需要 Access-Control-Allow-Credentials: true
```

---

### Q53 `requestAnimationFrame` 是什么？和 `setTimeout(0)` 的区别？

**rAF = 在下一次浏览器重绘前执行你的回调**（通常 60fps，即约 16.67ms 一次）。

```js
function animate() {
  box.style.transform = `translateX(${Date.now() % 500}px)`;
  requestAnimationFrame(animate); // 持续动
}
requestAnimationFrame(animate);

// 区别：
// setTimeout(fn, 0) → 最快 4~5ms 一次（HTML5 spec 规定嵌套 >=4ms），不与屏幕刷新同步 → 可能掉帧
// requestAnimationFrame → 跟随屏幕刷新率，后台标签页自动暂停，省 CPU/电量
```

---

## 九、模块化与模块机制

### Q54 CommonJS vs ES Module？

| 特性     | CommonJS (`require`)                            | ES Module (`import/export`)              |
| -------- | ----------------------------------------------- | ---------------------------------------- |
| 语法     | `const x = require('x')` `module.exports = ...` | `import x from 'x'` `export default ...` |
| 加载方式 | 运行时动态加载（同步）                          | 静态分析（编译时解析，可 Tree Shaking）  |
| 导出值   | 值的**拷贝**（导出后再改不影响）                | 值的**引用**（绑定）                     |
| 环境     | Node.js（旧）/Browserify/Webpack 打包           | Node.js 14+、现代浏览器、打包工具        |
| `this`   | 模块本身                                        | `undefined`                              |
| 动态导入 | `require(x)` 支持变量                           | `import(x)` 返回 Promise                 |

```js
// ===== CommonJS =====
// a.js
let count = 0;
module.exports = {
  count,
  inc: () => count++,
};
// b.js
const a = require("./a");
console.log(a.count); // 0
a.inc();
console.log(a.count); // 0（值拷贝！count 是原始值，导出时 snapshot 了）

// ===== ES Module =====
// a.mjs
export let count = 0;
export const inc = () => count++;
// b.mjs
import { count, inc } from "./a.mjs";
console.log(count); // 0
inc();
console.log(count); // 1（活绑定！）
```

---

### Q55 什么是 Tree Shaking？需要满足什么条件？

**Tree Shaking = 静态分析代码，移除未使用的 `export`（死代码）**。

**必要条件**：

1. 使用 **ES Module**（`import/export`）语法 —— CommonJS 动态，无法静态分析
2. `package.json` 中 `"sideEffects": false`（或列出有副作用的文件）
3. 打包工具支持（Webpack 4+、Rollup、Vite/esbuild）
4. 生产模式 + 压缩（Terser）才会真正删除代码

```js
// math.js
export function add(a, b) {
  return a + b;
}
export function sub(a, b) {
  return a - b;
} // 没被 import → 被 shake 掉

// app.js
import { add } from "./math.js"; // 只用到 add
console.log(add(1, 2));
```

> 副作用（Side Effects）= 模块在被 import 时除了导出还做了其他事（如修改全局、注入样式、给原型加方法）。有副作用的模块不能被 Tree Shaking。

---

### Q56 `import()` 动态导入与懒加载？

```js
// 静态导入（顶层，不能写在函数里，不能用变量）
import foo from "./foo.js";

// 动态导入（返回 Promise，可以在任何地方调用，支持变量路径）
async function loadChart() {
  const { default: Chart } = await import("./chart.js");
  new Chart("#canvas");
}
button.addEventListener("click", loadChart); // 点击后才加载

// 结合 React.lazy / Vue defineAsyncComponent：
// const LazyPage = React.lazy(() => import('./pages/Dashboard'));
// <Suspense fallback={<Loading/>}><LazyPage/></Suspense>
```

**常见场景**：路由级代码分割、大依赖按需加载、多语言包按需加载。

---

## 十、错误处理与调试

### Q57 JS 中的错误类型？如何捕获错误？

```js
// 内置错误类型
new Error("普通错误");
new SyntaxError("语法错"); // 解析代码时
new ReferenceError("未定义变量"); // 访问不存在的变量
new TypeError("类型错"); // 调用非函数、访问 null 的属性
new RangeError("超出范围"); // 数组长度负数等
new URIError("URI 编码错");

// ===== try/catch/finally =====
try {
  JSON.parse("not json");
} catch (err) {
  console.error(err.name, err.message, err.stack);
} finally {
  console.log("无论成功失败都会执行");
}

// ===== 异步错误 =====
// ❌ try/catch 抓不到 setTimeout 里的错误
try {
  setTimeout(() => {
    throw new Error("boom");
  }, 0);
} catch (e) {
  /* 抓不到！ */
}

// ✅ 用 window.onerror（全局同步错误）
window.onerror = (msg, src, line, col, err) => {
  console.error(msg, err?.stack);
  return true; // 阻止浏览器默认显示
};

// ✅ 用 window.addEventListener('unhandledrejection') 抓未处理的 Promise
window.addEventListener("unhandledrejection", (e) => {
  console.error("未捕获的 Promise 错误:", e.reason);
  e.preventDefault();
});

// ✅ async 函数里用 try/catch
async function demo() {
  try {
    await fetch("/api");
  } catch (e) {
    console.error(e);
  }
}
```

---

### Q58 如何自定义错误类？

```js
class AppError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    // 保留调用栈（V8 引擎支持）
    if (Error.captureStackTrace) Error.captureStackTrace(this, AppError);
  }
}

throw new AppError("参数无效", 400);
```

---

## 十一、正则表达式

### Q59 JS 中正则的常用 API？

```js
const re = /^[a-z]+(\d+)$/gi;
// 修饰符：g=全局 i=忽略大小写 m=多行 s=.匹配换行 u=Unicode y=粘性

// ===== 字符串方法 =====
"hello123".match(re); // 匹配结果数组（g 模式返回所有匹配，无 g 返回含 groups 的对象）
"hello123".matchAll(re); // 返回迭代器（推荐 g 模式下用）
"hello123".search(re); // 第一次匹配的 index，没匹配 -1
"hello123".replace(re, "X"); // 替换（$1、$&、函数替换都支持）
"a,b;c".split(/[,;]/); // ['a','b','c']

// ===== 正则方法 =====
re.test("hello123"); // true/false
re.exec("hello123"); // { 0:'hello123', 1:'123', index:0, input:'...', groups:{}} }
// ⚠️ 注意：带 g 的正则多次 exec 会从 lastIndex 继续，可能出现"偶现"问题
```

**经典场景**：

```js
// 邮箱（简单版，实际完整邮箱规则很复杂）
/^[\w.+-]+@[\w-]+\.[\w.-]+$/

// 手机号（中国大陆）
/^1[3-9]\d{9}$/

// 替换 $name$ 占位符
"Hello, $name$".replace(/\$(\w+)\$/g, (m, k) => ({ name: "Alice" }[k] || m));

// 具名捕获组（ES2018）
const m = "2024-01-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
// m.groups = { year: '2024', month: '01', day: '15' }
```

---

## 十二、性能优化相关

### Q60 JS 性能优化的常见手段？

```text
【加载层面】
1. 代码分割（Code Splitting）：路由级、组件级懒加载
2. Tree Shaking：移除死代码
3. 压缩 + 混淆：Terser / esbuild
4. Gzip/Brotli：服务端开启
5. 预加载：<link rel="preload/prefetch/modulepreload">
6. CDN + 长缓存：hash 文件名，Cache-Control: max-age=31536000

【运行层面】
7. 避免频繁操作 DOM：DocumentFragment / 虚拟列表
8. 防抖 + 节流：滚动/输入/resize 场景
9. 长任务拆分：rAF / setTimeout(0) 让出主线程（避免超过 50ms）
10. Web Worker：把密集计算放到后台线程（不阻塞 UI）
11. 避免不必要的重渲染：React.memo / useMemo / PureComponent
12. 图片优化：懒加载 + 现代格式（WebP/AVIF）+ 响应式尺寸
13. 事件委托：减少监听器数量
14. 虚拟列表：长列表只渲染可见区域

【监控层面】
15. Lighthouse / WebPageTest 跑分
16. Performance API：performance.mark/measure + User Timing
17. Core Web Vitals：LCP / INP / CLS
```

```js
// ===== 防抖 debounce（n 秒内只执行最后一次）=====
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===== 节流 throttle（n 秒内最多执行一次）=====
function throttle(fn, delay = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ===== Web Worker 示例 =====
// main.js
const worker = new Worker("./heavy.js");
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => console.log("结果:", e.data);
// heavy.js（独立上下文，无 window/document）
self.onmessage = (e) => {
  const result = heavyCompute(e.data);
  self.postMessage(result);
};
```

---

## 十三、手写代码题综合（高频考点）

### Q61 手写 `new`

```js
function myNew(Ctor, ...args) {
  if (typeof Ctor !== "function") throw new TypeError("must be a function");
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  return result !== null && typeof result === "object" ? result : obj;
}
```

### Q62 手写 `instanceof`

```js
function myInstanceof(obj, Ctor) {
  if (obj === null || typeof obj !== "object") return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

### Q63 手写 `call` / `apply` / `bind`

```js
// call
Function.prototype.myCall = function (ctx = globalThis, ...args) {
  const key = Symbol("fn");
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

// apply
Function.prototype.myApply = function (ctx = globalThis, args = []) {
  return this.myCall(ctx, ...args);
};

// bind
Function.prototype.myBind = function (ctx = globalThis, ...boundArgs) {
  const originalFn = this;
  return function boundFn(...callArgs) {
    // 支持 new 调用：new 优先级高于绑定的 this
    if (this instanceof boundFn) {
      return new originalFn(...boundArgs, ...callArgs);
    }
    return originalFn.apply(ctx, [...boundArgs, ...callArgs]);
  };
};
```

### Q64 手写 `debounce` 支持 `immediate`

```js
function debounce(fn, delay, immediate = false) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    if (immediate && !timer) {
      fn.apply(this, args); // 第一次立即执行
      timer = setTimeout(() => (timer = null), delay);
    } else {
      timer = setTimeout(() => fn.apply(this, args), delay);
    }
  };
}
```

### Q65 手写 `throttle`（时间戳 + 定时器双版本）

```js
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

### Q66 手写 `deepClone`（含循环引用）

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (map.has(obj)) return map.get(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map)
    return new Map([...obj].map(([k, v]) => [k, deepClone(v, map)]));
  if (obj instanceof Set)
    return new Set([...obj].map((v) => deepClone(v, map)));
  const clone = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  map.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}
```

### Q67 手写 `Promise`（最简版）

```js
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.state = MyPromise.PENDING;
    this.value = undefined;
    this.callbacks = [];
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  resolve = (value) => {
    if (this.state !== MyPromise.PENDING) return;
    this.state = MyPromise.FULFILLED;
    this.value = value;
    this.callbacks.forEach(this.run);
  };

  reject = (reason) => {
    if (this.state !== MyPromise.PENDING) return;
    this.state = MyPromise.REJECTED;
    this.value = reason;
    this.callbacks.forEach(this.run);
  };

  run = (cb) => {
    queueMicrotask(() => {
      const { onFulfilled, onRejected, resolve, reject } = cb;
      try {
        const fn =
          this.state === MyPromise.FULFILLED ? onFulfilled : onRejected;
        const result = typeof fn === "function" ? fn(this.value) : this.value;
        if (result && typeof result.then === "function") {
          result.then(resolve, reject);
        } else {
          this.state === MyPromise.FULFILLED ? resolve(result) : reject(result);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const cb = { onFulfilled, onRejected, resolve, reject };
      if (this.state === MyPromise.PENDING) this.callbacks.push(cb);
      else this.run(cb);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(cb) {
    return this.then(
      (v) => MyPromise.resolve(cb()).then(() => v),
      (e) =>
        MyPromise.resolve(cb()).then(() => {
          throw e;
        }),
    );
  }

  static resolve(v) {
    return new MyPromise((r) => r(v));
  }
  static reject(e) {
    return new MyPromise((_, r) => r(e));
  }
}
```

### Q68 手写 `Promise.all` / `allSettled` / `race` / `any`

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;
        if (++completed === promises.length) resolve(results);
      }, reject);
    });
  });
}

function promiseAllSettled(promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason }),
      ),
    ),
  );
}

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => Promise.resolve(p).then(resolve, reject));
  });
}
```

### Q69 手写 `并发限制的 Promise 调度器`

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }
  run() {
    if (this.running >= this.limit || this.queue.length === 0) return;
    const { task, resolve, reject } = this.queue.shift();
    this.running++;
    Promise.resolve(task())
      .then(resolve, reject)
      .finally(() => {
        this.running--;
        this.run();
      });
  }
}

// 测试：最多同时 2 个
const s = new Scheduler(2);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
s.add(() => delay(1000).then(() => console.log(1)));
s.add(() => delay(500).then(() => console.log(2)));
s.add(() => delay(300).then(() => console.log(3)));
s.add(() => delay(400).then(() => console.log(4)));
// 输出：2 → 3 → 1 → 4（2&3 一起，1&4 一起）
```

### Q70 手写 `ajax` / 简易 `fetch` 封装

```js
function ajax({ url, method = "GET", data = null, headers = {} }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => reject(new Error("网络错误"));
    xhr.send(data ? JSON.stringify(data) : null);
  });
}
```

### Q71 手写 `flat`（数组扁平化）

```js
function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flat(item, depth - 1) : item);
  }, []);
}
// flat([1, [2, [3, [4]]]], 2) → [1, 2, 3, [4]]

// 无限层级
const deepFlat = (arr) =>
  arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? deepFlat(v) : v), []);
```

### Q72 手写 `柯里化 (curry)`

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried(...args, ...more);
  };
}
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
```

### Q73 手写 `compose`（函数组合，从右到左）

```js
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
const add1 = (x) => x + 1;
const double = (x) => x * 2;
const add1ThenDouble = compose(double, add1);
add1ThenDouble(5); // (5+1)*2 = 12

// pipe（从左到右）
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
```

### Q74 手写 `去重` 多种方式

```js
// 1. Set
[...new Set(arr)];

// 2. filter + indexOf
arr.filter((v, i, a) => a.indexOf(v) === i);

// 3. 对象属性去重（针对对象数组按某字段）
const uniqueByKey = (arr, key) => {
  const seen = new Set();
  return arr.filter((o) =>
    seen.has(o[key]) ? false : (seen.add(o[key]), true),
  );
};
```

### Q75 手写 `发布-订阅模式`

```js
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(event, handler) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(handler);
    return () => this.off(event, handler);
  }
  off(event, handler) {
    this.events.get(event)?.delete(handler);
  }
  once(event, handler) {
    const off = this.on(event, (...args) => {
      off();
      handler(...args);
    });
  }
  emit(event, ...args) {
    this.events.get(event)?.forEach((h) => h(...args));
  }
}
```

### Q76 手写 `千分位格式化`

```js
function formatNumber(num) {
  // 1. 正则：每 3 位加逗号
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
formatNumber(1234567.89); // '1,234,567.89'

// 或用 Intl（推荐，国际化友好）
new Intl.NumberFormat("en-US").format(1234567.89);
new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(
  1234.56,
);
// '¥1,234.56'
```

### Q77 手写 `LazyMan`（经典面试题，事件循环 + 链式调用）

```js
// LazyMan('Tom').sleep(3).eat('dinner').sleepFirst(2).eat('supper')
// 输出:
//   (等 2 秒) Wake up after 2
//   Hi I'm Tom
//   (等 3 秒) Wake up after 3
//   Eat dinner
//   Eat supper
class LazyMan {
  constructor(name) {
    this.tasks = [];
    this.tasks.push(() => console.log(`Hi I'm ${name}`));
    // 用微任务启动，让所有链式调用都注册完再执行
    queueMicrotask(() => this.run());
  }
  run() {
    const next = () => {
      const task = this.tasks.shift();
      if (task) task(next);
    };
    next();
  }
  sleep(sec) {
    this.tasks.push((next) =>
      setTimeout(() => {
        console.log(`Wake up after ${sec}`);
        next();
      }, sec * 1000),
    );
    return this;
  }
  sleepFirst(sec) {
    this.tasks.unshift((next) =>
      setTimeout(() => {
        console.log(`Wake up after ${sec}`);
        next();
      }, sec * 1000),
    );
    return this;
  }
  eat(food) {
    this.tasks.push((next) => {
      console.log(`Eat ${food}`);
      next();
    });
    return this;
  }
}
```

### Q78 手写 `版本号比较`

```js
function compareVersion(v1, v2) {
  const a = v1.split(".").map(Number);
  const b = v2.split(".").map(Number);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}
compareVersion("1.2.3", "1.2.10"); // -1
compareVersion("1.20.0", "1.3.0"); // 1
```

### Q79 手写 `模板渲染引擎`（简易版）

```js
function render(tpl, data) {
  // 把 {{ name }} 替换成 data.name
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => data[k] ?? "");
}
render("Hello, {{ name }}! You are {{ age }}.", { name: "Alice", age: 30 });
// 'Hello, Alice! You are 30.'
```

### Q80 `typeof` 能正确判断所有类型吗？如何准确判断类型？

```js
// typeof 的坑
typeof null; // 'object'（历史 bug）
typeof []; // 'object'
typeof new Date(); // 'object'
typeof /abc/; // 'object'（ES2015+ 修正为 'object'，但之前是 'function'）
typeof new Function(); // 'function'
typeof Symbol(); // 'symbol'
typeof 123n; // 'bigint'

// ✅ 精准判断：Object.prototype.toString.call()
function getType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}
getType(null); // 'null'
getType([]); // 'array'
getType(new Date()); // 'date'
getType(/abc/); // 'regexp'
getType(new Map()); // 'map'
getType(Promise.resolve()); // 'promise'
```

---

**结语**：JavaScript 知识点庞大，建议复习路径 —— 基础语法 → 闭包/原型/this → 异步/Promise/事件循环 → 浏览器/DOM → 模块化 → 工程化 → 性能优化。配合大量手写练习，面试时才能思路清晰、代码流畅。
