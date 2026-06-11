---
title: 对象与原型
---

# 对象与原型

> **对象**是 JavaScript 的核心数据结构，几乎所有事物都是对象。**原型**是 JavaScript 实现继承的机制。

---

## 一、对象创建方式

### 1. 对象字面量（最常用）

```javascript
const person = {
  name: 'Alice',
  age: 25,
  greet: function() {
    return `Hello, ${this.name}`;
  }
};

// ES6 方法简写
const person2 = {
  name: 'Bob',
  greet() {
    return `Hello, ${this.name}`;
  }
};
```

### 2. 构造函数

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function() {
    return `Hello, ${this.name}`;
  };
}

const alice = new Person('Alice', 25);
alice.greet(); // 'Hello, Alice'
```

### 3. Object.create()

```javascript
const personPrototype = {
  greet: function() {
    return `Hello, ${this.name}`;
  }
};

const person = Object.create(personPrototype);
person.name = 'Alice';
person.age = 25;

person.greet(); // 'Hello, Alice'
```

### 4. class 语法（ES6）

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

const alice = new Person('Alice', 25);
alice.greet(); // 'Hello, Alice'
```

---

## 二、对象属性操作

### 1. 属性访问

```javascript
const person = { name: 'Alice', age: 25 };

// 点语法
person.name; // 'Alice'

// 方括号语法（适用于动态属性名）
person['age']; // 25

// 动态属性名
const key = 'name';
person[key]; // 'Alice'
```

### 2. 属性添加与修改

```javascript
const person = { name: 'Alice' };

// 添加属性
person.age = 25;
person['email'] = 'alice@example.com';

// 修改属性
person.name = 'Alice Smith';

// ES6 动态属性名
const key = 'gender';
const value = 'female';
const obj = {
  [key]: value
};
```

### 3. 属性删除

```javascript
const person = { name: 'Alice', age: 25 };
delete person.age;

console.log(person); // { name: 'Alice' }
```

### 4. 属性描述符

```javascript
const person = {};

// 定义属性描述符
Object.defineProperty(person, 'name', {
  value: 'Alice',
  writable: false,       // 不可写
  enumerable: true,      // 可枚举
  configurable: false    // 不可配置
});

person.name = 'Bob'; // 无效（在严格模式下会报错）

// 定义多个属性
Object.defineProperties(person, {
  age: {
    value: 25,
    writable: true
  },
  email: {
    value: 'alice@example.com',
    enumerable: false // 不可枚举
  }
});

// 获取属性描述符
Object.getOwnPropertyDescriptor(person, 'name');
// { value: 'Alice', writable: false, enumerable: true, configurable: false }
```

### 5. 遍历对象属性

```javascript
const person = { name: 'Alice', age: 25, email: 'alice@example.com' };

// for...in（遍历可枚举属性，包括继承的）
for (const key in person) {
  console.log(key, person[key]);
}

// Object.keys（返回自身可枚举属性的数组）
Object.keys(person); // ['name', 'age', 'email']

// Object.values（返回自身可枚举属性值的数组）
Object.values(person); // ['Alice', 25, 'alice@example.com']

// Object.entries（返回键值对数组）
Object.entries(person); // [['name', 'Alice'], ['age', 25], ['email', 'alice@example.com']]

// Object.getOwnPropertyNames（返回自身所有属性，包括不可枚举的）
Object.getOwnPropertyNames(person);
```

---

## 三、原型与原型链

### 1. __proto__ 与 prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

const alice = new Person('Alice');

// __proto__ 指向构造函数的 prototype
alice.__proto__ === Person.prototype; // true

// constructor 指向构造函数
Person.prototype.constructor === Person; // true
```

### 2. 原型链

```javascript
const alice = new Person('Alice');

// alice 本身没有 toString 方法
alice.toString; // ƒ toString() { [native code] }

// 通过原型链查找：alice -> Person.prototype -> Object.prototype
alice.__proto__ === Person.prototype;           // true
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null;            // true（原型链终点）
```

### 3. instanceof 运算符

```javascript
function Person() {}
const alice = new Person();

alice instanceof Person;    // true（alice 的原型链中有 Person.prototype）
alice instanceof Object;    // true（alice 的原型链中有 Object.prototype）
```

### 4. isPrototypeOf

```javascript
function Person() {}
const alice = new Person();

Person.prototype.isPrototypeOf(alice); // true
Object.prototype.isPrototypeOf(alice); // true
```

---

## 四、继承模式

### 1. 原型链继承

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
}

// 设置原型链
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog; // 修复 constructor

Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`);
};

const dog = new Dog('Buddy', 'Golden Retriever');
dog.eat();  // 'Buddy is eating'
dog.bark(); // 'Buddy is barking'
```

### 2. 构造函数继承（借用构造函数）

```javascript
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  Animal.call(this, name); // 借用父类构造函数
  this.breed = breed;
}

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name);  // 'Buddy'
console.log(dog.breed); // 'Golden Retriever'
```

### 3. 组合继承（最常用）

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name); // 构造函数继承
  this.breed = breed;
}

// 原型链继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`);
};

const dog = new Dog('Buddy', 'Golden Retriever');
```

### 4. ES6 class 继承

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} is barking`);
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
dog.eat();  // 'Buddy is eating'
dog.bark(); // 'Buddy is barking'
```

---

## 五、class 语法详解（ES6）

### 1. 基本语法

```javascript
class Person {
  // 静态属性（ES2022）
  static species = 'Homo sapiens';
  
  // 实例属性
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // 实例方法
  greet() {
    return `Hello, ${this.name}`;
  }
  
  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }
  
  // getter
  get info() {
    return `${this.name} is ${this.age} years old`;
  }
  
  // setter
  set info(value) {
    const [name, age] = value.split(',');
    this.name = name.trim();
    this.age = parseInt(age);
  }
}

const alice = Person.create('Alice', 25);
console.log(alice.info); // 'Alice is 25 years old'
alice.info = 'Bob, 30';
console.log(alice.name); // 'Bob'
```

### 2. 私有字段（ES2022）

```javascript
class Person {
  #privateField = 'secret'; // 私有字段
  
  getSecret() {
    return this.#privateField;
  }
}

const person = new Person();
person.getSecret(); // 'secret'
person.#privateField; // SyntaxError: Private field '#privateField' must be declared in an enclosing class
```

### 3. 静态块（ES2022）

```javascript
class Config {
  static settings;
  
  static {
    // 静态初始化块
    const env = process.env.NODE_ENV || 'development';
    Config.settings = { env };
  }
}
```

---

## 六、常用对象方法

### 1. Object.assign()

```javascript
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const result = Object.assign(target, source);
console.log(result); // { a: 1, b: 4, c: 5 }
console.log(target); // { a: 1, b: 4, c: 5 }（目标对象被修改）

// 浅拷贝
const copy = Object.assign({}, target);
```

### 2. Object.keys() / Object.values() / Object.entries()

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);    // ['a', 'b', 'c']
Object.values(obj);  // [1, 2, 3]
Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]
```

### 3. Object.freeze() / Object.seal()

```javascript
const obj = { a: 1 };

// Object.freeze：冻结对象，无法添加、删除、修改属性
Object.freeze(obj);
obj.a = 2; // 无效（严格模式报错）
obj.b = 3; // 无效

// Object.seal：密封对象，无法添加、删除属性，但可以修改
const obj2 = { a: 1 };
Object.seal(obj2);
obj2.a = 2; // 有效
obj2.b = 3; // 无效
delete obj2.a; // 无效
```

### 4. Object.is()

```javascript
Object.is(NaN, NaN);       // true（区别于 ===）
Object.is(+0, -0);         // false（区别于 ===）
Object.is('hello', 'hello'); // true
Object.is({}, {});         // false
```

---

## 七、本章小结与最佳实践

✅ **推荐做法**：

1. **使用对象字面量创建简单对象**；
2. **使用 class 语法实现面向对象**（ES6+）；
3. **理解原型链**，知道属性查找的机制；
4. **使用组合继承**（或 ES6 class extends）实现继承；
5. **使用 Object.assign() 进行浅拷贝**；
6. **使用 Object.keys/values/entries 遍历对象**。

❌ **避免做法**：

1. 直接修改 `__proto__` 属性；
2. 在 for...in 循环中不检查 hasOwnProperty；
3. 过度使用原型链继承；
4. 混淆实例方法和静态方法。

下一章我们将深入学习**异步编程**，掌握 Promise、async/await 等核心技术。