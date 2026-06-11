---
title: 函数与作用域
---

# 函数与作用域

> **函数**是 JavaScript 的核心概念，是可重复使用的代码块。**作用域**决定了变量的可访问性。

---

## 一、函数定义方式

### 1. 函数声明（Function Declaration）

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

greet('Alice'); // 'Hello, Alice!'
```

**特点**：
- **存在函数提升**：可以在声明前调用
- 适合定义需要提前使用的函数

### 2. 函数表达式（Function Expression）

```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};

greet('Bob'); // 'Hello, Bob!'
```

**特点**：
- **不存在函数提升**：必须先声明再调用
- 可以作为参数传递或赋值给变量

### 3. 箭头函数（Arrow Function）（ES6）

```javascript
const greet = (name) => `Hello, ${name}!`;

// 无参数
const sayHello = () => 'Hello!';

// 多个参数
const add = (a, b) => a + b;

// 多行函数体
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

**特点**：
- 语法简洁
- 没有自己的 `this`（继承外层的 `this`）
- 不能作为构造函数
- 没有 `arguments` 对象

### 4. 函数构造器（不推荐）

```javascript
const add = new Function('a', 'b', 'return a + b');
add(2, 3); // 5
```

**不推荐使用**：
- 代码可读性差
- 执行效率低
- 存在安全风险

---

## 二、作用域与作用域链

### 1. 全局作用域

```javascript
// 在函数外部声明的变量属于全局作用域
const globalVar = 'I am global';

function test() {
  console.log(globalVar); // 可以访问全局变量
}

test(); // 'I am global'
```

### 2. 函数作用域

```javascript
function myFunction() {
  // 函数内部声明的变量属于函数作用域
  const localVar = 'I am local';
  console.log(localVar); // 'I am local'
}

myFunction();
console.log(localVar); // ReferenceError: localVar is not defined
```

### 3. 块级作用域（ES6）

```javascript
if (true) {
  // 使用 let/const 声明的变量属于块级作用域
  let blockVar = 'I am in block';
  const blockConst = 'I am also in block';
  var varInBlock = 'I am global (var)';
}

console.log(blockVar);   // ReferenceError
console.log(blockConst); // ReferenceError
console.log(varInBlock); // 'I am global (var)'
```

### 4. 作用域链

```javascript
const global = 'global';

function outer() {
  const outerVar = 'outer';
  
  function inner() {
    const innerVar = 'inner';
    console.log(innerVar); // 'inner'
    console.log(outerVar); // 'outer'
    console.log(global);   // 'global'
  }
  
  inner();
}

outer();
```

**作用域链规则**：
1. 当前作用域 → 外层作用域 → 全局作用域
2. 内部可以访问外部，外部不能访问内部
3. 同名变量遵循"就近原则"

---

## 三、闭包（Closure）

### 1. 什么是闭包？

闭包是指函数能够访问其词法作用域中的变量，即使该函数在其词法作用域之外执行。

```javascript
function createCounter() {
  let count = 0; // 私有变量
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
counter.decrement(); // 1
```

### 2. 闭包的应用场景

#### 场景一：数据私有化

```javascript
function createPerson(name) {
  let age = 0;
  
  return {
    getName: () => name,
    getAge: () => age,
    birthday: () => {
      age++;
      return age;
    }
  };
}

const person = createPerson('Alice');
person.getName();  // 'Alice'
person.getAge();   // 0
person.birthday(); // 1
person.age;        // undefined（私有变量，外部无法访问）
```

#### 场景二：函数工厂

```javascript
function createAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = createAdder(5);
const add10 = createAdder(10);

add5(3);  // 8
add10(3); // 13
```

#### 场景三：回调函数

```javascript
function fetchData(url) {
  const apiKey = 'secret-key';
  
  fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  .then(response => response.json())
  .then(data => console.log(data));
}

// apiKey 在回调函数中仍然可访问
```

### 3. 闭包的注意事项

```javascript
// 循环中的闭包陷阱
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3（因为 var 是函数作用域）
  }, 1000);
}

// 解决方法 1：使用 let（块级作用域）
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2
  }, 1000);
}

// 解决方法 2：使用立即执行函数
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2
    }, 1000);
  })(i);
}
```

---

## 四、this 指向

### 1. this 的默认绑定

```javascript
function showThis() {
  console.log(this);
}

showThis(); // 在浏览器中指向 window，在严格模式下为 undefined
```

### 2. 隐式绑定

```javascript
const obj = {
  name: 'Alice',
  greet: function() {
    console.log(`Hello, ${this.name}`);
  }
};

obj.greet(); // 'Hello, Alice'（this 指向 obj）
```

### 3. 显式绑定

```javascript
const person = { name: 'Bob' };
const greet = function() {
  console.log(`Hello, ${this.name}`);
};

// call
greet.call(person); // 'Hello, Bob'

// apply（参数以数组形式传递）
greet.apply(person, []); // 'Hello, Bob'

// bind（返回一个新函数）
const greetBob = greet.bind(person);
greetBob(); // 'Hello, Bob'
```

### 4. new 绑定

```javascript
function Person(name) {
  this.name = name; // this 指向新创建的实例
}

const alice = new Person('Alice');
console.log(alice.name); // 'Alice'
```

### 5. 箭头函数中的 this

```javascript
const obj = {
  name: 'Alice',
  greet: () => {
    console.log(`Hello, ${this.name}`); // this 继承外层，指向 window
  },
  greet2: function() {
    const arrowGreet = () => {
      console.log(`Hello, ${this.name}`); // this 继承外层，指向 obj
    };
    arrowGreet();
  }
};

obj.greet();  // 'Hello, undefined'
obj.greet2(); // 'Hello, Alice'
```

### 6. this 绑定优先级

从高到低：
1. **new 绑定**：`new Foo()` → `this` 指向新创建的实例
2. **显式绑定**：`call`/`apply`/`bind` → `this` 指向指定对象
3. **隐式绑定**：`obj.foo()` → `this` 指向 `obj`
4. **默认绑定**：`foo()` → `this` 指向 `window`（非严格模式）或 `undefined`（严格模式）

---

## 五、参数处理

### 1. 参数默认值（ES6）

```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

greet();        // 'Hello, Guest!'
greet('Alice'); // 'Hello, Alice!'

// 默认值可以是表达式
function calculateTotal(price, tax = price * 0.1) {
  return price + tax;
}

calculateTotal(100); // 110
```

### 2. 剩余参数（ES6）

```javascript
function sum(first, ...numbers) {
  console.log(first);  // 1
  console.log(numbers); // [2, 3, 4]
  return numbers.reduce((acc, curr) => acc + curr, first);
}

sum(1, 2, 3, 4); // 10
```

### 3. arguments 对象

```javascript
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

sum(1, 2, 3); // 6
```

> 💡 **注意**：箭头函数没有 `arguments` 对象，需要使用剩余参数代替。

### 4. 解构参数（ES6）

```javascript
function greet({ name, age }) {
  return `Hello, ${name}, you are ${age} years old`;
}

greet({ name: 'Alice', age: 25 }); // 'Hello, Alice, you are 25 years old'

// 带默认值的解构
function greet2({ name = 'Guest', age = 18 } = {}) {
  return `Hello, ${name}, you are ${age} years old`;
}

greet2(); // 'Hello, Guest, you are 18 years old'
```

---

## 六、立即执行函数表达式（IIFE）

```javascript
// 传统 IIFE
(function() {
  console.log('IIFE executed');
})();

// 带参数的 IIFE
(function(name) {
  console.log(`Hello, ${name}`);
})('Alice');

// 返回值
const result = (function(a, b) {
  return a + b;
})(2, 3);

console.log(result); // 5
```

**作用**：
- 创建独立的作用域，避免污染全局命名空间
- 在 ES6 模块出现前常用的模块化方式

---

## 七、本章小结与最佳实践

✅ **推荐做法**：

1. **优先使用函数表达式或箭头函数**，避免函数提升带来的意外行为；
2. **使用闭包实现数据私有化**，保护内部状态；
3. **在循环中使用 let 避免闭包陷阱**；
4. **理解 this 的绑定规则**，必要时使用 `bind`/`call`/`apply`；
5. **使用剩余参数代替 arguments**，代码更清晰；
6. **为参数设置默认值**，提高函数健壮性。

❌ **避免做法**：

1. 在循环中使用 `var` 声明变量；
2. 滥用 `arguments` 对象；
3. 不理解 this 指向就随意使用；
4. 过度使用 IIFE（ES6 模块已取代其大部分用途）。

下一章我们将深入学习**对象与原型**，掌握 JavaScript 的面向对象编程。