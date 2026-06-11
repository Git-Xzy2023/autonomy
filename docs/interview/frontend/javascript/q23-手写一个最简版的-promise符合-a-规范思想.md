---
title: "手写一个最简版的 Promise（符合 A+ 规范思想）"
---

# 手写一个最简版的 Promise（符合 A+ 规范思想）

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = []; // 存 .then 的 { onFulfilled, onRejected, resolve, reject }

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((cb) => this._runCallback(cb));
    };
    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.callbacks.forEach((cb) => this._runCallback(cb));
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  _runCallback(cb) {
    queueMicrotask(() => {
      // 模拟微任务
      try {
        const result =
          this.state === "fulfilled"
            ? cb.onFulfilled(this.value)
            : cb.onRejected(this.value);
        // 处理返回值：如果是 Promise 则要等待
        if (result && typeof result.then === "function") {
          result.then(cb.resolve, cb.reject);
        } else {
          cb.resolve(result);
        }
      } catch (e) {
        cb.reject(e);
      }
    });
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const cb = {
        onFulfilled: typeof onFulfilled === "function" ? onFulfilled : (v) => v,
        onRejected:
          typeof onRejected === "function"
            ? onRejected
            : (e) => {
                throw e;
              },
        resolve,
        reject,
      };
      if (this.state === "pending") this.callbacks.push(cb);
      else this._runCallback(cb);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(v) {
    return new MyPromise((r) => r(v));
  }
  static reject(e) {
    return new MyPromise((_, r) => r(e));
  }
}
```

> 完整 A+ 规范还需要处理"thenable"、循环引用、值穿透等，但面试里写出上述骨架 + 解释思路就足够。

---
