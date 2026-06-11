---
title: "如何实现继承？ES5 的组合寄生继承 vs ES6 的 `class` 继承"
---

# 如何实现继承？ES5 的组合寄生继承 vs ES6 的 `class` 继承

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
