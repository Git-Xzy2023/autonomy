---
title: "Vue2 Observer/Dep/Watcher 三件套源码"
---

# Vue2 Observer/Dep/Watcher 三件套源码

## 为什么是这三件套

Vue2 响应式的本质是**发布-订阅模式**。数据是被观察对象，使用数据的地方是订阅者。三者分工：

- **Observer**：把对象转成响应式（递归 `defineReactive`）
- **Dep**：每个响应式属性的"依赖收集器"，存订阅者列表
- **Watcher**：订阅者，数据变化时执行回调（渲染 Watcher、computed Watcher、user Watcher）

## 源码解析

### 1. Observer —— 响应式化

```js
// src/core/observer/index.js
class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep(); // 给对象本身一个 dep（用于 $set/$delete 通知）
    def(value, '__ob__', this); // 在 value 上挂 __ob__ 引用

    if (Array.isArray(value)) {
      // 数组：替换原型方法
      protoAugment(value, arrayMethods);
      this.observeArray(value);
    } else {
      // 对象：逐个 defineReactive
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}

export function observe(value, asRootData) {
  if (!isObject(value)) return;
  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__; // 已观察过，复用
  } else if (shouldObserve) {
    ob = new Observer(value);
  }
  return ob;
}
```

### 2. defineReactive —— 定义响应式属性

```js
export function defineReactive(obj, key, val) {
  const dep = new Dep(); // 每个属性一个 Dep
  let childOb = observe(val); // 递归观察子属性

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = val;
      if (Dep.target) {
        dep.depend(); // 当前 Watcher 订阅本属性
        if (childOb) {
          childOb.dep.depend(); // 子对象的 dep 也订阅（支持 $set）
          if (Array.isArray(value)) {
            dependArray(value); // 数组元素也收集依赖
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal;
      childOb = observe(newVal); // 新值也要响应式
      dep.notify(); // 通知所有订阅者
    }
  });
}
```

### 3. Dep —— 依赖收集器

```js
// src/core/observer/dep.js
let depId = 0;
class Dep {
  constructor() {
    this.id = depId++;
    this.subs = []; // 订阅者（Watcher）数组
  }

  addSub(sub) { this.subs.push(sub); }
  removeSub(sub) { remove(this.subs, sub); }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this); // Watcher 记住 Dep，Dep 也记住 Watcher（双向）
    }
  }

  notify() {
    const subs = this.subs.slice();
    for (let i = 0; i < subs.length; i++) {
      subs[i].update(); // 调用每个 Watcher 的 update
    }
  }
}

Dep.target = null; // 全局变量，指向当前正在求值的 Watcher
const targetStack = [];
export function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}
export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
```

### 4. Watcher —— 订阅者

```js
// src/core/observer/watcher.js
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.deps = [];       // 订阅的 Dep 列表
    this.depIds = new Set();
    this.newDeps = [];
    this.newDepIds = new Set();
    this.dirty = true;    // computed Watcher 用

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn); // 'a.b.c' → 路径访问函数
    }

    this.value = this.get(); // 立即求值，触发依赖收集
  }

  get() {
    pushTarget(this);       // 把自己设为 Dep.target
    let value;
    try {
      value = this.getter.call(this.vm, this.vm); // 求值，触发 getter
    } finally {
      popTarget();
      this.cleanupDeps(); // 清理不再订阅的 Dep
    }
    return value;
  }

  addDep(dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this); // 双向订阅
      }
    }
  }

  update() {
    if (this.lazy) {
      this.dirty = true; // computed：标记脏，不立即求值
    } else if (this.sync) {
      this.run(); // 同步执行
    } else {
      queueWatcher(this); // 默认异步：入队，nextTick 批量执行
    }
  }

  run() {
    const value = this.get(); // 重新求值
    if (value !== this.value) {
      const oldValue = this.value;
      this.value = value;
      this.cb.call(this.vm, value, oldValue); // 触发回调
    }
  }

  evaluate() { // computed 专用
    this.value = this.get();
    this.dirty = false;
  }

  depend() { // 让自己的 deps 也被外层 Watcher 收集
    let i = this.deps.length;
    while (i--) this.deps[i].depend();
  }
}
```

## 三件套的协作流程

```
1. 组件 mount → 创建渲染 Watcher → watcher.get() → pushTarget(watcher)
2. 执行 render() → 访问 this.xxx → 触发 reactiveGetter
3. getter 内 dep.depend() → watcher.addDep(dep) → dep.addSub(watcher)
   （双向订阅：watcher.deps 有 dep，dep.subs 有 watcher）
4. 数据变化 → reactiveSetter → dep.notify() → 遍历 subs 调 watcher.update()
5. watcher.update() → queueWatcher → nextTick 批量 flush → watcher.run() → 重新 render
```

## 弊端

1. **初始化递归**：`new Observer` 时 `walk` 遍历所有属性，深层对象初始化慢。
2. **无法监听新增属性**：`defineReactive` 只对已有属性生效，新增属性需 `Vue.set`。
3. **数组监听不全**：只能拦截 7 个变异方法，直接 `arr[0] = x` 不触发。
4. **每个属性一个 Dep + 闭包**：内存开销大，大型对象响应式化慢。
