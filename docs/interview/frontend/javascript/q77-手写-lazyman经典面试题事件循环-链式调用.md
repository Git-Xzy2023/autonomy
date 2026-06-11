---
title: "手写 `LazyMan`（经典面试题，事件循环 + 链式调用）"
---

# 手写 `LazyMan`（经典面试题，事件循环 + 链式调用）

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
