---
title: "Vue2 响应式原理（Object.defineProperty）"
---

# Vue2 响应式原理（Object.defineProperty）

**核心机制：**

Vue2 通过 `Object.defineProperty` 劫持对象属性的 getter 和 setter，配合发布-订阅模式实现响应式。

- **Observer**：遍历对象所有属性，使用 `defineProperty` 将每个属性转换成 getter/setter，负责数据监听
- **Dep**：每个属性对应一个依赖收集器，内部维护一个 `subs` 数组，存放所有订阅该属性变化的 Watcher
- **Watcher**：订阅者，当数据变化时收到通知并执行更新回调（模板编译、computed、watch 各有不同类型的 Watcher）

**核心源码（src/core/observer/index.js）：**

```js
function defineReactive(obj, key, val) {
  const dep = new Dep();
  let childOb = observe(val); // 递归监听子属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // Dep.target 指向当前正在求值的 Watcher
      if (Dep.target) {
        dep.depend(); // 当前 Watcher 订阅该 dep
        if (childOb) childOb.dep.depend();
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal;
      childOb = observe(newVal);
      dep.notify(); // 通知所有订阅者更新
    },
  });
}
```

**数组的特殊处理：**

Vue2 不使用 `defineProperty` 劫持数组索引（性能问题），而是通过**重写数组 7 个变异方法**（`push/pop/shift/unshift/splice/sort/reverse`）来实现响应式。

```js
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
  (method) => {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      if (inserted) ob.observeArray(inserted); // 新增元素也需要响应式
      ob.dep.notify();
      return result;
    });
  },
);
```

**Vue2 响应式的局限性：**

1. **无法监听对象新增/删除的属性**：需使用 `Vue.set(obj, key, val)` 或 `this.$set`
2. **无法监听通过索引直接修改数组项**：需用 `Vue.set(arr, index, val)` 或 `arr.splice(index, 1, val)`
3. **无法监听修改数组 length**
4. **初始化时必须递归遍历所有属性**，对象嵌套很深时有性能开销
5. **无法监听 Map/Set 等 ES6 数据结构**
