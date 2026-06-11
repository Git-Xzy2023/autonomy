---
title: "`this` 的绑定规则？箭头函数的 `this`？"
---

# `this` 的绑定规则？箭头函数的 `this`？

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
