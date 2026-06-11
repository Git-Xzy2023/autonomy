---
title: "手写一个带并发限制的 Promise 调度器（ES2017）"
---

# 手写一个带并发限制的 Promise 调度器（ES2017）

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
