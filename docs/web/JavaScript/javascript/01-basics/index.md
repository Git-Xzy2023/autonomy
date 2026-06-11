---
title: JavaScript 基础
---

# JavaScript 基础

> **JavaScript** 是一种轻量级的脚本语言，是 Web 开发的三大核心技术之一：
>
> - **HTML** 负责"是什么"（结构/内容）
> - **CSS** 负责"长什么样"（样式/布局）
> - **JavaScript** 负责"能做什么"（行为/交互）

---

## 一、JavaScript 引入方式

JavaScript 有**四种主要引入方式**。

### 1. 内联脚本（Inline Script）

直接通过元素的事件属性书写脚本。不推荐使用，不利于维护。

```html
<button onclick="alert('Hello')">点击我</button>
```

**缺点**：
- 逻辑与结构混在一起，无法复用
- 不利于代码组织和调试

### 2. 内部脚本（Internal Script）

通过 HTML 中的 `<script>` 标签写在 `<body>` 末尾或 `<head>` 里。

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>内部脚本示例</title>
  </head>
  <body>
    <h1>你好，JavaScript</h1>
    <script>
      const heading = document.querySelector('h1');
      console.log(heading.textContent);
    </script>
  </body>
</html>
```

**使用场景**：单个页面的独立逻辑、临时 demo。

### 3. 外部脚本（External Script）

将 JS 写在独立的 `.js` 文件中，通过 `<script src>` 引入。**这是推荐且最常用的方式**。

```html
<!-- 普通引入 -->
<script src="main.js"></script>

<!-- 异步加载（不阻塞 HTML 解析） -->
<script async src="analytics.js"></script>

<!-- 延迟加载（HTML 解析完后执行） -->
<script defer src="app.js"></script>
```

**`async` vs `defer`**：

| 属性 | 加载时机 | 执行时机 | 执行顺序 |
|------|----------|----------|----------|
| 无   | 同步加载 | 加载完立即执行 | 按顺序执行 |
| `async` | 异步加载 | 加载完立即执行 | 不保证顺序 |
| `defer` | 异步加载 | HTML 解析完后执行 | 按顺序执行 |

### 4. ES Modules 引入

现代前端工程中常用的模块化引入方式。

```html
<script type="module" src="main.js"></script>
```

---

## 二、变量声明

JavaScript 有三种变量声明方式：`var`、`let`、`const`。

### 1. `var`（ES5）

```javascript
var name = 'Alice';
var age = 25;
```

**特点**：
- **函数作用域**：在函数内声明的 `var` 变量只在函数内有效
- **存在变量提升**：可以在声明前使用
- **可重复声明**：同一作用域内可以重复声明同一变量

### 2. `let`（ES6）

```javascript
let name = 'Alice';
let age = 25;
```

**特点**：
- **块级作用域**：在 `{}` 内声明的 `let` 变量只在块内有效
- **不存在变量提升**：暂时性死区（TDZ）
- **不可重复声明**：同一作用域内不能重复声明

### 3. `const`（ES6）

```javascript
const PI = 3.14159;
const person = { name: 'Alice' };
```

**特点**：
- **块级作用域**
- **声明时必须赋值**
- **不可重新赋值**（但对象/数组的内容可以修改）

### 变量声明对比

| 特性 | `var` | `let` | `const` |
|------|-------|-------|---------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 是 | 否（TDZ） | 否（TDZ） |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | 不允许 |

**最佳实践**：
- 默认使用 `const`，当需要重新赋值时使用 `let`
- 尽量避免使用 `var`

---

## 三、数据类型

JavaScript 有 **7 种基本类型** 和 **1 种引用类型**。

### 基本类型（Primitive Types）

```javascript
// 1. 字符串
const str = 'Hello World';

// 2. 数字
const num = 42;
const pi = 3.14;
const infinity = Infinity;
const nan = NaN;

// 3. 布尔值
const isTrue = true;
const isFalse = false;

// 4. 空值
const empty = null;

// 5. 未定义
let undefinedVar; // undefined

// 6. 符号（ES6）
const sym = Symbol('unique');

// 7. BigInt（ES2020）
const bigNum = 123456789012345678901234567890n;
```

### 引用类型（Reference Types）

```javascript
// 对象
const obj = { name: 'Alice', age: 25 };

// 数组
const arr = [1, 2, 3, 4, 5];

// 函数
const fn = function() { return 42; };

// 日期
const date = new Date();

// 正则表达式
const regex = /pattern/g;
```

### 类型判断

```javascript
typeof 42;          // 'number'
typeof 'hello';     // 'string'
typeof true;        // 'boolean'
typeof undefined;   // 'undefined'
typeof null;        // 'object' （这是一个历史遗留的 bug）
typeof {};          // 'object'
typeof [];          // 'object'
typeof function(){}; // 'function'

// 更准确的类型判断
Object.prototype.toString.call(null);       // '[object Null]'
Object.prototype.toString.call([]);         // '[object Array]'
Object.prototype.toString.call({});         // '[object Object]'
Object.prototype.toString.call(new Date()); // '[object Date]'
```

---

## 四、运算符

JavaScript 支持多种运算符。

### 1. 算术运算符

```javascript
const a = 10;
const b = 3;

a + b;  // 13 加法
a - b;  // 7  减法
a * b;  // 30 乘法
a / b;  // 3.333... 除法
a % b;  // 1  取模
a ** b; // 1000 幂运算（ES2016）

// 自增自减
let x = 5;
x++;  // 后置自增（先返回值再+1）
++x;  // 前置自增（先+1再返回值）
```

### 2. 赋值运算符

```javascript
let x = 10;
x += 5;   // 等价于 x = x + 5
x -= 3;   // 等价于 x = x - 3
x *= 2;   // 等价于 x = x * 2
x /= 4;   // 等价于 x = x / 4
x %= 3;   // 等价于 x = x % 3
```

### 3. 比较运算符

```javascript
// 相等比较（会进行类型转换）
1 == '1';   // true
0 == false; // true
null == undefined; // true

// 严格相等（不进行类型转换）
1 === '1';  // false
0 === false; // false
null === undefined; // false

// 其他比较
5 > 3;   // true
5 >= 3;  // true
5 < 3;   // false
5 <= 3;  // false
```

**最佳实践**：优先使用 `===` 和 `!==` 避免隐式类型转换带来的问题。

### 4. 逻辑运算符

```javascript
// 逻辑与（&&）：两边都为真才为真
true && false; // false
true && true;  // true

// 逻辑或（||）：有一边为真就为真
true || false; // true
false || false; // false

// 逻辑非（!）：取反
!true;  // false
!false; // true

// 短路求值
const name = undefined || 'Default'; // 'Default'
const user = { name: 'Alice' } && user.name; // 'Alice'

// 空值合并运算符（ES2020）
const value = null ?? 'Default'; // 'Default'
const value2 = 0 ?? 'Default';   // 0（只有 null/undefined 才用默认值）
```

### 5. 位运算符

```javascript
// 按位与 &
5 & 3;  // 1  (101 & 011 = 001)

// 按位或 |
5 | 3;  // 7  (101 | 011 = 111)

// 按位异或 ^
5 ^ 3;  // 6  (101 ^ 011 = 110)

// 按位非 ~
~5;     // -6

// 左移 <<
5 << 1; // 10 (101 << 1 = 1010)

// 右移 >>
5 >> 1; // 2  (101 >> 1 = 10)
```

---

## 五、流程控制

### 1. 条件语句

```javascript
// if-else
const age = 18;
if (age >= 18) {
  console.log('成年人');
} else if (age >= 13) {
  console.log('青少年');
} else {
  console.log('儿童');
}

// switch
const day = 'Monday';
switch (day) {
  case 'Monday':
    console.log('周一');
    break;
  case 'Friday':
    console.log('周五');
    break;
  default:
    console.log('其他');
}

// 三元运算符
const result = score >= 60 ? '及格' : '不及格';
```

### 2. 循环语句

```javascript
// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// while 循环
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do-while 循环（至少执行一次）
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// for...in（遍历对象属性）
const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key, obj[key]);
}

// for...of（遍历可迭代对象）
const arr = [1, 2, 3];
for (const value of arr) {
  console.log(value);
}
```

### 3. 跳转语句

```javascript
// break：跳出循环
for (let i = 0; i < 5; i++) {
  if (i === 3) break;
  console.log(i); // 0, 1, 2
}

// continue：跳过当前迭代
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i); // 0, 1, 3, 4
}
```

---

## 六、类型转换

JavaScript 是弱类型语言，会自动进行类型转换。

### 1. 隐式转换

```javascript
// 字符串 + 任何类型 = 字符串
'10' + 5;  // '105'
'hello' + true; // 'hellotrue'

// 数字运算
'10' - 5;  // 5（字符串转数字）
'10' * 2;  // 20
'10' / 2;  // 5

// 布尔转换
if (0) {}       // false
if (1) {}       // true
if ('') {}      // false
if ('hello') {} // true
if (null) {}    // false
if (undefined) {} // false
if ({}) {}      // true（空对象为真）
```

### 2. 显式转换

```javascript
// 转字符串
String(42);      // '42'
(42).toString(); // '42'

// 转数字
Number('42');    // 42
parseInt('42px'); // 42
parseFloat('3.14'); // 3.14
+'42';           // 42

// 转布尔值
Boolean(0);      // false
Boolean('');     // false
Boolean(null);   // false
Boolean(undefined); // false
Boolean({});     // true
!!42;           // true
```

---

## 七、本章小结与最佳实践

✅ **推荐做法**：

1. **使用 `const` 和 `let`**，避免使用 `var`；
2. **优先使用 `===` 和 `!==`**，避免隐式类型转换；
3. **外部脚本放在 `<body>` 末尾**，或使用 `async`/`defer`；
4. **用 `let` 声明循环变量**，避免闭包陷阱；
5. **对象/数组用 `const` 声明**，只在需要重新赋值时用 `let`。

❌ **避免做法**：

1. 在同一作用域内重复声明变量；
2. 依赖隐式类型转换进行判断；
3. 使用 `var` 声明变量；
4. 在 `for` 循环中使用 `var`（会导致闭包问题）。

下一章我们将深入学习**函数与作用域**，掌握 JavaScript 的核心编程范式。