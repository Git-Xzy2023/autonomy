---
title: "Vue3 effect 调度器与响应式原理"
---

# Vue3 effect 调度器与响应式原理

## Vue3 响应式的核心

Vue3 响应式由三个核心组成：

1. **reactive/ref**：数据代理（Proxy / getter-setter）
2. **effect**：副作用函数，执行时自动收集依赖
3. **scheduler**：调度器，控制 effect 何时重新执行

## effect 的基础实现

```js
// packages/reactivity/src/effect.ts
let activeEffect = null;
const effectStack = [];

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  if (!options.lazy) {
    _effect.run(); // 立即执行一次
  }
  return _effect;
}

class ReactiveEffect {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler; // 调度器
    this.deps = []; // 订阅的 dep 列表
    this.active = true;
  }

  run() {
    if (!this.active) return this.fn();

    try {
      effectStack.push(this);
      activeEffect = this;
      return this.fn(); // 执行时触发 getter → track
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this); // 从所有 dep 中移除自己
      this.active = false;
    }
  }
}
```

## track 与 trigger

```js
// 依赖收集：targetMap → depsMap → dep
const targetMap = new WeakMap();

export function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));

  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep); // 双向引用
  }
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (!dep) return;

  const effects = [...dep]; // 拷贝，避免遍历时修改
  effects.forEach(effect => {
    if (effect === activeEffect) return; // 避免无限递归
    if (effect.scheduler) {
      effect.scheduler(); // 有调度器：调调度器
    } else {
      effect.run(); // 无调度器：直接执行
    }
  });
}
```

## 调度器的作用

**调度器决定 effect 何时重新执行。** 不同场景用不同调度器：

### 1. 默认 effect（无调度器）

```js
const state = reactive({ count: 0 });
effect(() => {
  console.log(state.count); // 数据变化立即重新执行
});
state.count = 1; // 立即打印 1
```

### 2. watchEffect 的调度器（异步批量）

```js
function watchEffect(fn) {
  const scheduler = () => {
    queueJob(job); // 入队，nextTick 批量执行
  };
  const job = new ReactiveEffect(fn, scheduler);
  job.run(); // 首次立即执行
}

// queueJob：去重 + nextTick flush
const queue = new Set();
let isFlushing = false;
function queueJob(job) {
  queue.add(job); // Set 自动去重
  if (!isFlushing) {
    isFlushing = true;
    Promise.resolve().then(flushJobs); // 微任务批量执行
  }
}
function flushJobs() {
  queue.forEach(job => job.run());
  queue.clear();
  isFlushing = false;
}
```

**效果：** 多次数据变化只触发一次 effect 重新执行（类似 Vue2 的异步更新队列）。

### 3. computed 的调度器（lazy + dirty）

```js
function computed(getter) {
  let value;
  let dirty = true;

  const _effect = new ReactiveEffect(getter, () => {
    if (!dirty) {
      dirty = true; // 依赖变化：标记脏，不立即求值
      trigger(computedRef, 'value'); // 通知依赖 computed 的 effect
    }
  });

  const computedRef = {
    get value() {
      if (dirty) {
        value = _effect.run(); // 脏时才求值
        dirty = false;
      }
      track(computedRef, 'value'); // 收集依赖 computed 的 effect
      return value;
    }
  };
  return computedRef;
}
```

**关键：** computed 的 scheduler 只标记 dirty，不立即求值。只有访问 `.value` 且 dirty 时才重新计算（惰性求值）。

### 4. watch 的调度器（带新旧值）

```js
function watch(source, cb, options) {
  let oldValue;
  const getter = () => traverse(source());

  const scheduler = () => {
    const newValue = _effect.run();
    if (hasChanged(newValue, oldValue) || options.deep) {
      cb(newValue, oldValue);
      oldValue = newValue;
    }
  };

  const _effect = new ReactiveEffect(getter, scheduler);
  oldValue = _effect.run(); // 首次执行，收集依赖
  if (options.immediate) scheduler();
}
```

## 嵌套 effect 与 effectStack

```js
effect(() => {        // 外层 effect
  effect(() => {      // 内层 effect
    state.a;
  });
  state.b;
});
```

**问题：** 如果只用一个 `activeEffect`，内层 effect 执行完后，`activeEffect` 变成 null，外层的 `state.b` 无法收集依赖。

**解决：** 用 `effectStack` 栈保存：

```js
run() {
  effectStack.push(this);
  activeEffect = this;
  try {
    return this.fn();
  } finally {
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1]; // 恢复外层
  }
}
```

内层 effect 执行完出栈，`activeEffect` 恢复为外层 effect，外层的依赖收集正常。

## 避免无限递归

```js
const state = reactive({ count: 0 });
effect(() => {
  state.count = state.count + 1; // 读 + 写
});
```

**问题：** effect 执行时读 `state.count`（收集依赖），然后写 `state.count`（触发更新），又会执行 effect，无限循环。

**解决：** trigger 时跳过当前 activeEffect：

```js
export function trigger(target, key) {
  // ...
  effects.forEach(effect => {
    if (effect === activeEffect) return; // 跳过自己
    // ...
  });
}
```

## cleanupEffect（依赖清理）

```js
function cleanupEffect(effect) {
  effect.deps.forEach(dep => dep.delete(effect));
  effect.deps.length = 0;
}
```

**为什么需要：** effect 重新执行时，可能不再访问之前的依赖（条件分支）。如果不清理，旧的 dep 仍引用 effect，数据变化时仍会触发 effect（浪费）。

```js
const state = reactive({ flag: true, a: 1, b: 2 });
effect(() => {
  state.flag ? state.a : state.b; // flag=true 时只依赖 a
});

state.flag = false; // 触发 effect 重新执行
// 重新执行前 cleanup：从 a 的 dep 移除 effect
// 重新执行：访问 b，加入 b 的 dep
// 现在 effect 只依赖 flag 和 b，不依赖 a

state.a = 100; // 不再触发 effect（已清理）
```

## 总结

- **effect**：响应式副作用，执行时自动收集依赖。
- **scheduler**：调度器，控制 effect 重新执行时机（同步/异步批量/惰性）。
- **track/trigger**：依赖收集和触发，通过 targetMap 三层结构。
- **effectStack**：处理嵌套 effect。
- **避免递归**：trigger 跳过 activeEffect。
- **cleanup**：每次重新执行前清理旧依赖，避免过期依赖。

Vue3 的响应式比 Vue2 更强大：支持 Map/Set/数组索引/新增属性，且惰性代理性能更好。effect + scheduler 的设计让 watch/watchEffect/computed/渲染都能复用同一套机制。
