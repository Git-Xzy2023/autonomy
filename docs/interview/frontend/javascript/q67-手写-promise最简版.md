---
title: "手写 `Promise`（最简版）"
---

# 手写 `Promise`（最简版）

```js
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.state = MyPromise.PENDING;
    this.value = undefined;
    this.callbacks = [];
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  resolve = (value) => {
    if (this.state !== MyPromise.PENDING) return;
    this.state = MyPromise.FULFILLED;
    this.value = value;
    this.callbacks.forEach(this.run);
  };

  reject = (reason) => {
    if (this.state !== MyPromise.PENDING) return;
    this.state = MyPromise.REJECTED;
    this.value = reason;
    this.callbacks.forEach(this.run);
  };

  run = (cb) => {
    queueMicrotask(() => {
      const { onFulfilled, onRejected, resolve, reject } = cb;
      try {
        const fn =
          this.state === MyPromise.FULFILLED ? onFulfilled : onRejected;
        const result = typeof fn === "function" ? fn(this.value) : this.value;
        if (result && typeof result.then === "function") {
          result.then(resolve, reject);
        } else {
          this.state === MyPromise.FULFILLED ? resolve(result) : reject(result);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const cb = { onFulfilled, onRejected, resolve, reject };
      if (this.state === MyPromise.PENDING) this.callbacks.push(cb);
      else this.run(cb);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(cb) {
    return this.then(
      (v) => MyPromise.resolve(cb()).then(() => v),
      (e) =>
        MyPromise.resolve(cb()).then(() => {
          throw e;
        }),
    );
  }

  static resolve(v) {
    return new MyPromise((r) => r(v));
  }
  static reject(e) {
    return new MyPromise((_, r) => r(e));
  }
}
```
