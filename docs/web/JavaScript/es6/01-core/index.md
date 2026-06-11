# ES6 核心特性

ES6（ECMAScript 2015）是 JavaScript 语言的重大更新，引入了许多新语法特性。本章介绍最核心的 ES6 特性。

## 1. let 和 const

### 1.1 块级作用域

```javascript
// var - 函数作用域，存在变量提升
console.log(a); // undefined（变量提升）
var a = 1;

// let - 块级作用域，不存在变量提升
// console.log(b); // ReferenceError
let b = 2;

// const - 块级作用域，声明时必须赋值，不可重新赋值
const c = 3;
// c = 4; // TypeError

// 块级作用域示例
{
  let x = 1;
  const y = 2;
  var z = 3;
}
// console.log(x); // ReferenceError
// console.log(y); // ReferenceError
console.log(z); // 3 - var 泄露到外部
```

### 1.2 暂时性死区（TDZ）

```javascript
// let/const 在声明前不可访问（暂时性死区）
{
  // console.log(x); // ReferenceError
  let x = "hello";
}

// const 引用类型可以修改内部属性
const arr = [1, 2, 3];
arr.push(4); // OK - 修改数组内容
// arr = [5, 6]; // TypeError - 不能重新赋值

const obj = { name: "Alice" };
obj.name = "Bob"; // OK - 修改对象属性
// obj = {}; // TypeError - 不能重新赋值
```

---

## 2. 箭头函数

### 2.1 基本语法

```javascript
// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add2 = (a, b) => a + b;

// 多行函数体
const add3 = (a, b) => {
  const sum = a + b;
  return sum;
};

// 单个参数可省略括号
const double = x => x * 2;

// 无参数
const getRandom = () => Math.random();

// 返回对象字面量需要加括号
const createUser = (name, age) => ({ name, age });
```

### 2.2 this 绑定

```javascript
// 传统函数 - this 取决于调用方式
const obj1 = {
  name: "Alice",
  greet: function () {
    console.log(this.name); // this 指向 obj1
  },
  greetLater: function () {
    setTimeout(function () {
      // console.log(this.name); // undefined - this 指向 window
    }, 1000);
  },
};

// 箭头函数 - this 继承外层作用域
const obj2 = {
  name: "Alice",
  greet: function () {
    setTimeout(() => {
      console.log(this.name); // "Alice" - this 继承 greet 的 this
    }, 1000);
  },
};
```

:::warning
箭头函数没有自己的 `this`、`arguments`、`super` 和 `new.target`，不能用作构造函数。
:::

---

## 3. 解构赋值

### 3.1 数组解构

```javascript
// 基本解构
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 跳过元素
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// 默认值
const [x, y, z = 10] = [1, 2];
console.log(x, y, z); // 1 2 10

// 剩余元素
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// 交换变量
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1
```

### 3.2 对象解构

```javascript
// 基本解构
const { name, age } = { name: "Alice", age: 25 };
console.log(name, age); // Alice 25

// 重命名
const { name: userName, age: userAge } = { name: "Alice", age: 25 };
console.log(userName, userAge); // Alice 25

// 默认值
const { x = 10, y = 20 } = { x: 5 };
console.log(x, y); // 5 20

// 嵌套解构
const { data: { list, total } } = {
  data: { list: [1, 2, 3], total: 3 }
};
console.log(list, total); // [1, 2, 3] 3

// 函数参数解构
function greet({ name, age = 0 }) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}
greet({ name: "Alice", age: 25 });
```

---

## 4. 模板字符串

```javascript
// 基本用法
const name = "Alice";
const greeting = `Hello, ${name}!`;

// 多行字符串
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Welcome!</p>
  </div>
`;

// 表达式
const a = 5, b = 10;
console.log(`Sum: ${a + b}`);      // "Sum: 15"
console.log(`${a > b ? 'a' : 'b'}`); // "b"

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : "";
    return result + str + value;
  }, "");
}

const keyword = "JavaScript";
const message = highlight`Learn ${keyword} today!`;
// "Learn <mark>JavaScript</mark> today!"
```

---

## 5. 展开运算符

```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 数组复制
const copy = [...arr1]; // [1, 2, 3]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const mergedObj = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// 对象覆盖
const defaults = { theme: "light", lang: "en", fontSize: 14 };
const userConfig = { theme: "dark", fontSize: 16 };
const config = { ...defaults, ...userConfig };
// { theme: "dark", lang: "en", fontSize: 16 }

// 函数参数展开
const nums = [1, 2, 3];
Math.max(...nums); // 3

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
```

---

## 6. Symbol

```javascript
// 创建唯一的 Symbol
const s1 = Symbol("description");
const s2 = Symbol("description");
console.log(s1 === s2); // false - 每个 Symbol 都是唯一的

// 用作对象属性键
const id = Symbol("id");
const user = {
  name: "Alice",
  [id]: 12345,
};

// Symbol 属性不出现在 for...in 中
for (const key in user) {
  console.log(key); // 只输出 "name"
}

// 获取 Symbol 属性
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]

// 全局 Symbol 注册表
const globalId = Symbol.for("app.id");
const sameId = Symbol.for("app.id");
console.log(globalId === sameId); // true

// 获取 Symbol 的 key
console.log(Symbol.keyFor(globalId)); // "app.id"
```

---

## 7. for...of 循环

```javascript
// 遍历数组
const arr = ["a", "b", "c"];
for (const item of arr) {
  console.log(item); // a, b, c
}

// 遍历字符串
for (const char of "hello") {
  console.log(char); // h, e, l, l, o
}

// 遍历 Map
const map = new Map([["a", 1], ["b", 2]]);
for (const [key, value] of map) {
  console.log(key, value);
}

// 遍历 Set
const set = new Set([1, 2, 3]);
for (const item of set) {
  console.log(item);
}

// 对比 for...in（遍历键名）
for (const index in arr) {
  console.log(index); // 0, 1, 2（字符串键名）
}
```

---

## 小结

| 特性 | 说明 | 示例 |
|------|------|------|
| let/const | 块级作用域变量声明 | `let x = 1; const y = 2;` |
| 箭头函数 | 简洁函数语法，词法 this | `(a, b) => a + b` |
| 解构赋值 | 从数组/对象提取值 | `const { name, age } = obj` |
| 模板字符串 | 字符串插值和多行 | `` `Hello, ${name}` `` |
| 展开运算符 | 展开/收集元素 | `...args` |
| Symbol | 唯一标识符 | `Symbol("id")` |
| for...of | 遍历可迭代对象 | `for (const x of arr)` |

下一步：[ES7-ES13 新特性 →](/web/JavaScript/es6/02-modern/)
