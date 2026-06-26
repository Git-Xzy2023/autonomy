---
title: Vue 响应式源码剖析
---

# Vue 响应式源码剖析

> 本章深入剖析 Vue 2 与 Vue 3 响应式系统的源码实现：从 Object.defineProperty 到 Proxy，从 Dep/Watcher 到 effect/track/trigger。

---

## 一、Vue 2 响应式源码

### 1.1 入口：observe()

```js
// src/core/observer/index.js
function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) return;

  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value)
  ) {
    ob = new Observer(value);
  }

  if (asRootData && ob) ob.vmCount++;
  return ob;
}
```

`observe()` 是响应式入口，给对象附加 `__ob__`（Observer 实例）。

### 1.2 Observer 类

```js
class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();     // 每个对象一个 dep（用于 $set/$delete 通知）
    this.vmCount = 0;

    def(value, '__ob__', this); // 不可枚举

    if (Array.isArray(value)) {
      // 数组：替换原型方法
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value); // 逐项 observe
    } else {
      this.walk(value);         // 对象：逐属性 defineReactive
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
```

### 1.3 defineReactive

```js
function defineReactive(obj, key, val, shallow) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) return;

  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val); // 递归子对象
  const dep = new Dep();                   // 每个属性一个 dep

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();          // 收集当前 Watcher
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value); // 数组递归依赖收集
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) return;

      if (process.env.NODE_ENV !== 'production' && !setter) {
        warn(`Avoid mutating prop directly`);
        return;
      }
      if (setter) setter.call(obj, newVal);
      else val = newVal;

      childOb = !shallow && observe(newVal); // 新值也要响应式
      dep.notify();  // 通知 Watcher 们更新
    },
  });
}
```

### 1.4 Dep 类

```js
class Dep {
  static target;       // 全局当前 Watcher
  id;
  subs;                 // Watcher 列表

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub) { this.subs.push(sub); }
  removeSub(sub) { remove(this.subs, sub); }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    const subs = this.subs.slice();
    for (let i = 0; i < subs.length; i++) {
      subs[i].update();
    }
  }
}

// targetStack：支持嵌套
function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
```

### 1.5 Watcher 类

```js
class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    this.cb = cb;
    this.id = ++uid;
    this.deps = [];
    this.depIds = new Set();

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
    }

    this.value = this.get(); // 立即执行一次
  }

  get() {
    pushTarget(this);
    let value;
    try {
      value = this.getter.call(vm, vm); // 触发属性 get → dep.depend()
    } finally {
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }

  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  update() {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this); // 异步队列
    }
  }

  run() {
    const value = this.get();
    if (value !== this.value || isObject(value)) {
      const oldValue = this.value;
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  }

  // 清理旧依赖（避免分支切换残留）
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    // ...
  }
}
```

### 1.6 调度器：nextTick

```js
const callbacks = [];
let pending = false;
let timerFunc;

// 选择合适的延迟机制
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
} else if (
  typeof MutationObserver !== 'undefined' &&
  isNative(MutationObserver)
) {
  // MutationObserver fallback
} else {
  timerFunc = () => setTimeout(flushCallbacks, 0);
}

function nextTick(cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) cb.call(ctx);
    else if (_resolve) _resolve(ctx);
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise((resolve) => (_resolve = resolve));
  }
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) copies[i]();
}
```

### 1.7 Watcher 队列合并

```js
const queue = [];
const queueIds = new Set();
let waiting = false;

function queueWatcher(watcher) {
  if (queueIds.has(watcher.id)) return; // 去重

  queueIds.add(watcher.id);
  queue.push(watcher);

  if (!waiting) {
    waiting = true;
    nextTick(flushSchedulerQueue);
  }
}

function flushSchedulerQueue() {
  // 排序：父 → 子，user watcher → render watcher
  queue.sort((a, b) => a.id - b.id);

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    watcher.run();
  }

  // 清理
  queue.length = 0;
  queueIds.clear();
  waiting = false;
}
```

---

## 二、Vue 2 数组响应式

### 2.1 数组方法重写

```js
// src/core/observer/array.js
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push', 'pop', 'shift', 'unshift',
  'splice', 'sort', 'reverse'
];

methodsToPatch.forEach(function (method) {
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted); // 新元素响应式
    ob.dep.notify();  // 触发更新
    return result;
  });
});
```

### 2.2 dependArray

```js
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    if (e && e.__ob__) {
      e.__ob__.dep.depend();
    }
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
```

数组的索引修改不响应，必须用 `Vue.set(arr, i, v)` 或 `splice`。

---

## 三、Vue 3 响应式源码

### 3.1 reactive.ts

```ts
// packages/reactivity/src/reactive.ts
const rawToReactive = new WeakMap();
const reactiveToRaw = new WeakMap();

export function reactive<T extends object>(target: T): T {
  // readonly 不代理
  if (readonlyToRaw.has(target)) return target;

  // 优化：只对可代理对象处理
  if (!isExtensible(target)) return target;

  // 已代理则返回缓存
  const existingProxy = rawToReactive.get(target);
  if (existingProxy !== void 0) return existingProxy;

  // 只对特定类型代理
  if (Object.getPrototypeOf(target) === Object.prototype ||
      Array.isArray(target) ||
      isMap(target) || isSet(target)) {
    const proxy = new Proxy(
      target,
      targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
    );
    rawToReactive.set(target, proxy);
    reactiveToRaw.set(proxy, target);
    return proxy;
  }

  return target;
}
```

### 3.2 baseHandlers

```ts
// packages/reactivity/src/baseHandlers.ts
const get = createGetter();

function createGetter() {
  return function get(target, key, receiver) {
    // IS_REACTIVE 标志位
    if (key === ReactiveFlags.IS_REACTIVE) return !raw;
    if (key === ReactiveFlags.RAW) return target;

    const targetIsArray = isArray(target);

    // 数组方法重写
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }

    const res = Reflect.get(target, key, receiver);

    // 内置 symbol 不追踪
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }

    // 依赖收集
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key);
    }

    // ref 自动解包
    if (isRef(res)) {
      return res.value;
    }

    // 懒代理：对象才递归
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}
```

### 3.3 effect.ts 核心

```ts
// packages/reactivity/src/effect.ts
let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect<T = any> {
  active = true;
  deps: Dep[] = [];
  parent: ReactiveEffect | undefined;

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

  run() {
    if (!this.active) return this.fn();

    // 处理嵌套
    let parent: ReactiveEffect | undefined = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent && !parent.allowRecurse) {
      if (parent === this) return; // 避免无限递归
      parent = parent.parent;
    }

    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      return this.fn();
    } finally {
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = undefined;
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}

export function effect<T>(fn: () => T): ReactiveEffect<T> {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
```

### 3.4 track 与 trigger

```ts
const targetMap = new WeakMap();

export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (!shouldTrack || activeEffect === undefined) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  trackEffects(dep);
}

export function trackEffects(dep: Dep) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown
) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const deps: Dep[] = [];

  // SET：旧值依赖 + 新值依赖（若为 ref）
  if (type === TriggerOpTypes.SET) {
    deps.push(depsMap.get(key));
  } else if (type === TriggerOpTypes.ADD) {
    deps.push(depsMap.get(key));
    if (Array.isArray(target)) {
      deps.push(depsMap.get('length')); // 数组 length 变化
    }
  } else if (type === TriggerOpTypes.DELETE) {
    deps.push(depsMap.get(key));
  }

  for (const dep of deps) {
    if (dep) {
      for (const effect of [...dep]) {
        if (effect !== activeEffect) {
          if (effect.scheduler) {
            effect.scheduler();
          } else {
            effect.run();
          }
        }
      }
    }
  }
}
```

### 3.5 computed 实现

```ts
export class ComputedRefImpl<T> {
  public dep: Dep = new Dep();
  private _value!: T;
  public readonly effect: ReactiveEffect<T>;
  public readonly __v_isRef = true;
  public _dirty = true;

  constructor(
    getter: () => T,
    private readonly _setter: (v: T) => void
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      // 调度器：标记脏值并通知
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
  }

  get value() {
    trackRefValue(this);
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }

  set value(newValue: T) {
    this._setter(newValue);
  }
}
```

### 3.6 ref 实现

```ts
class RefImpl<T> {
  private _value: T;
  private _rawValue: T;
  public dep: Dep = new Dep();
  public readonly __v_isRef = true;

  constructor(value: T, isShallow: boolean) {
    this._rawValue = isShallow ? value : toRaw(value);
    this._value = isShallow ? value : toReactive(value);
  }

  get value() {
    this.dep.depend();
    return this._value;
  }

  set value(newVal) {
    const useDirectValue = isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      this.dep.notify();
    }
  }
}

// 对象自动转 reactive
export function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}
```

---

## 四、Vue 2 vs Vue 3 响应式对比

| 维度        | Vue 2                          | Vue 3                          |
| ----------- | ------------------------------ | ------------------------------ |
| **机制**    | Object.defineProperty         | Proxy + Reflect                |
| **新增**    | 需要 `Vue.set`                  | 自动                            |
| **删除**    | 需要 `Vue.delete`              | 自动                            |
| **数组**    | 重写方法 + 不支持索引            | Proxy 全支持                    |
| **Map/Set** | 不支持                         | 集合方法重写                    |
| **嵌套**    | 初始化时全量代理                | 懒代理（访问时）                |
| **依赖**    | Dep + Watcher                  | Dep（Set）+ effect              |
| **调度**    | nextTick + 队列                | 微任务 + 调度器                 |
| **computed**| dirty 标志                     | dirty 标志（类似）              |
| **类型**    | Flow                           | TypeScript                      |

---

## 五、调试技巧

### 5.1 Vue 2 调试

```js
// 在组件中
this._data.__ob__.dep.subs  // 当前 data 关联的 Watcher
this._watcher                // 渲染 Watcher
this.$data.__ob__.value     // 原始对象
```

### 5.2 Vue 3 调试

```ts
import { toRaw, isReactive, isRef, toRef } from 'vue';

const state = reactive({ count: 0 });
console.log(toRaw(state));     // 原始对象
console.log(isReactive(state)); // true

import { effectScope } from 'vue';
const scope = effectScope();
scope.run(() => { /* ... */ });
scope.stop();
```

### 5.3 Vue 3 onRenderTriggered

```ts
import { onRenderTriggered } from 'vue';

onRenderTriggered((e) => {
  console.log('触发更新:', e.target, e.key, e.type, e.newValue);
});
```

---

## 六、学习建议

1. **先理解发布订阅模式**：Dep + Watcher 是核心
2. **对比 Vue 2 与 Vue 3**：Proxy 的优势与设计哲学差异
3. **动手实现简版**：参考源码写一个 mini reactive
4. **调试**：用 onRenderTriggered 观察真实更新流程

---

## 参考

- [Vue 2 响应式源码](https://github.com/vuejs/vue/tree/v2.6.14/src/core/observer)
- [Vue 3 reactivity 包](https://github.com/vuejs/core/tree/main/packages/reactivity/src)
- [Vue 3.4 响应式重构 PR](https://github.com/vuejs/core/pull/5912)
