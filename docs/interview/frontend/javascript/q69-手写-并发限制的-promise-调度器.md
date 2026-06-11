---
title: "手写 `并发限制的 Promise 调度器`"
---

# 手写 `并发限制的 Promise 调度器`

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
