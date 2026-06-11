---
title: "如何实现一个带并发限制的 Promise 调度器？"
---

# 如何实现一个带并发限制的 Promise 调度器？

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
