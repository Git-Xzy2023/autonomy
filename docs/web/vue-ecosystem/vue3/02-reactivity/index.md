---
title: Vue 3 响应式原理
---

# Vue 3 响应式原理

> Vue 3 的响应式系统基于 ES6 Proxy 重写，解决了 Vue 2 的多个局限。本章深入剖析 reactive、ref、effect、依赖收集与触发更新的核心原理。

---

## 一、为什么用 Proxy

### 1.1 Vue 2 的局限

Vue 2 基于 `Object.defineProperty`，有以下问题：

| 问题                | Vue 2 表现                       | Vue 3 解决                  |
| ------------------- | -------------------------------- | --------------------------- |
| 新增属性             | 不响应                            | Proxy 自动捕获              |
| 删除属性             | 不响应                            | deleteProperty 拦截          |
| 数组索引修改         | 不响应                            | Proxy 自动捕获              |
| 数组 length          | 不响应                            | Proxy 自动捕获              |
| Map/Set/WeakMap     | 不支持                            | 集合类型方法重写            |
| 嵌套对象             | 初始化时深度遍历                  | 懒代理（访问时再代理）       |

### 1.2 Proxy 的优势

```js
const obj = { name: 'Tom', list: [1, 2, 3] };

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('读取', key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log('设置', key, value);
    return Reflect.set(target, key, value, receiver);
  },
  deleteProperty(target, key) {
    console.log('删除', key);
    return Reflect.deleteProperty(target, key);
  },
});

proxy.age = 18;       // 设置 age 18
proxy.list.push(4);   // 设置 list 3 (内部访问)
delete proxy.name;     // 删除 name
```

Proxy 是**整个对象级别**的拦截，不需要为每个属性单独定义。

---

## 二、核心概念

### 2.1 响应式三要素

```
响应式系统
├── Reactive Effect（副作用）
│   └── 响应式数据变化时要执行的函数
│
├── 依赖收集（Track）
│   └── effect 执行时，记录它依赖了哪些属性
│
└── 触发更新（Trigger）
    └── 属性变化时，找到依赖它的 effects 重新执行
```

### 2.2 简化版响应式实现

```ts
// 全局依赖映射：target -> Map<key, Set<effect>>
const targetMap = new WeakMap();
let activeEffect = null;

function effect(fn) {
  activeEffect = fn;
  fn(); // 立即执行一次，触发依赖收集
  activeEffect = null;
}

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (!dep) return;

  dep.forEach((effect) => effect());
}

function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, key, receiver) {
      const result = Reflect.get(obj, key, receiver);
      track(obj, key);
      return result;
    },
    set(obj, key, value, receiver) {
      const result = Reflect.set(obj, key, value, receiver);
      trigger(obj, key);
      return result;
    },
  });
}
```

### 2.3 使用示例

```ts
const state = reactive({ count: 0 });

effect(() => {
  console.log('count 变化:', state.count); // 立即打印 0
});

state.count = 1;  // 触发 effect，打印 1
state.count = 2;  // 触发 effect，打印 2
```

---

## 三、reactive 的实现细节

### 3.1 集合方法重写

Map/Set 的方法（add、delete、forEach 等）内部会访问 this，需要绑定到 proxy：

```ts
// Vue 3 源码简化
const arrayInstrumentations = createArrayInstrumentations();

function createInstrumentations() {
  const instrumentations: Record<string, Function> = {};

  // map.get
  instrumentations.get = function (key) {
    const target = this[Symbol.target]; // 真实对象
    const wrapped = target.get(key);
    track(target, key);
    return typeof wrapped === 'object' && wrapped !== null
      ? reactive(wrapped)
      : wrapped;
  };

  // set.add
  instrumentations.add = function (value) {
    const target = this[Symbol.target];
    const hadKey = target.has(value);
    target.add(value);
    if (!hadKey) trigger(target, value, 'add');
    return this;
  };

  return instrumentations;
}
```

### 3.2 懒代理（性能优化）

Vue 2 初始化时递归整个对象深度代理，Vue 3 改为**访问时才代理**：

```ts
function get(target, key, receiver) {
  const result = Reflect.get(target, key, receiver);

  // 只有对象才递归代理
  if (typeof result === 'object' && result !== null) {
    return reactive(result); // 懒代理：访问到才代理
  }

  return result;
}
```

### 3.3 数组特殊处理

```ts
// 数组索引访问：触发 track
// arr[0] → track(arr, '0')

// 数组方法：
// - push/pop/shift/unshift/splice：收集 length 依赖 + 触发 length 更新
// - indexOf/includes/lastIndexOf：避免重复 track

// Vue 3 用 arrayInstrumentations 重写这些方法
```

### 3.4 避免重复代理

```ts
const reactiveMap = new WeakMap();

function reactive<T extends object>(target: T): T {
  // 已代理过则直接返回
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target);
  }
  const proxy = createReactiveObject(target);
  reactiveMap.set(target, proxy);
  return proxy;
}
```

---

## 四、ref 的实现

### 4.1 ref 的本质

```ts
class RefImpl<T> {
  private _value: T;
  public dep: Dep = new Dep();

  constructor(value: T) {
    this._value = value;
  }

  get value() {
    this.dep.depend(); // 依赖收集
    return this._value;
  }

  set value(newVal: T) {
    if (Object.is(newVal, this._value)) return;
    this._value = newVal;
    this.dep.notify(); // 触发更新
  }
}

function ref<T>(value: T): Ref<T> {
  return new RefImpl(value);
}
```

### 4.2 对象 ref 的自动展开

```ts
class RefImpl {
  constructor(value) {
    this._rawValue = value;
    this._value = isObject(value) ? reactive(value) : value; // 对象转 reactive
  }
}
```

### 4.3 模板中的自动解包

Vue 3 在模板编译时对 ref 做了特殊处理，自动访问 `.value`：

```vue
<!-- 编译后 -->
<template>
  <div>{{ count }}</div>
</template>

<!-- 等价于：count.value -->
```

---

## 五、effect 与调度器

### 5.1 effect 的结构

```ts
class ReactiveEffect {
  private fn: () => T;
  public scheduler: ((job: () => void) => void) | null = null;
  public deps: Dep[] = [];
  public active = true;

  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    // 收集依赖
    let lastShouldTrack = shouldTrack;
    shouldTrack = true;
    activeEffect = this;
    try {
      return this.fn();
    } finally {
      activeEffect = null;
      shouldTrack = lastShouldTrack;
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}
```

### 5.2 调度器与异步更新

```ts
const queue: Array<() => void> = [];
const resolvedPromise = Promise.resolve() as Promise<any>;
let isFlushing = false;

function queueJob(job: () => void) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  if (!isFlushing) {
    isFlushing = true;
    resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  try {
    for (let i = 0; i < queue.length; i++) {
      queue[i]();
    }
  } finally {
    queue.length = 0;
    isFlushing = false;
  }
}
```

**为什么用微任务？**

一次事件循环中可能多次修改响应式数据：

```ts
state.count = 1;
state.count = 2;
state.count = 3;
// 同步触发 3 次更新 → Vue 3 合并为 1 次重渲染（异步）
```

### 5.3 computed 的实现

```ts
class ComputedRefImpl {
  public _value: any;
  public _dirty = true;
  public dep = new Dep();
  public effect: ReactiveEffect;

  constructor(getter, setter) {
    this.effect = new ReactiveEffect(getter, () => {
      // 调度器：不立即更新，只标记脏
      if (!this._dirty) {
        this._dirty = true;
        this.dep.notify(); // 通知依赖本 computed 的 effect
      }
    });
  }

  get value() {
    this.dep.depend();
    if (this._dirty) {
      this._value = this.effect.run();
      this._dirty = false;
    }
    return this._value;
  }

  set value(newVal) {
    this.setter?.(newVal);
  }
}
```

**脏值标记**：computed 只在依赖变化时才重新计算，避免不必要的执行。

---

## 六、依赖收集与清理

### 6.1 cleanupEffect

```ts
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }
  deps.length = 0;
}
```

### 6.2 为什么要清理

```ts
const state = reactive({ show: true, count: 0 });

effect(() => {
  if (state.show) {
    console.log(state.count); // 同时依赖 show 和 count
  } else {
    console.log('hidden'); // 只依赖 show
  }
});

state.show = false;
// 清理：移除对 count 的依赖
// 否则下次 count 变化会触发无效更新
```

### 6.3 避免无限循环

```ts
// 无限循环陷阱
effect(() => {
  state.count++; // 读 + 写，会触发 effect 重启
});

// Vue 3 源码中用 shouldTrack 和 trackOpBit 避免在 effect 执行中重入
```

---

## 七、嵌套 effect 与作用域

### 7.1 嵌套 effect

```ts
effect(() => {
  console.log('外层', state.a);
  effect(() => {
    console.log('内层', state.b);
  });
});
// 外层独立于内层
```

### 7.2 effectScope

```ts
const scope = effectScope();

scope.run(() => {
  effect(() => console.log(state.a));
  effect(() => console.log(state.b));
});

// 一次性停止所有 effect
scope.stop();
```

---

## 八、响应式 API 对比

| API              | 说明                          | 何时使用                          |
| ---------------- | ----------------------------- | --------------------------------- |
| `ref`            | 任意类型的响应式               | 基础类型、需要替换整体           |
| `reactive`       | 对象响应式                    | 对象/数组                        |
| `shallowRef`     | 浅 ref（不代理 value 内部）    | 大对象、避免深代理                |
| `shallowReactive` | 浅 reactive（只代理根层）    | 大对象、只关心顶层变化           |
| `readonly`       | 只读响应式                    | 配置、props、状态保护            |
| `shallowReadonly` | 浅只读                        | 只读根层                          |
| `markRaw`        | 标记永不代理                  | 第三方实例、性能敏感数据         |
| `customRef`      | 自定义依赖追踪                | 防抖 ref                          |
| `toRaw`          | 取原始对象                    | 跳过代理直接操作                  |
| `markRaw`        | 永不代理                      | 第三方类实例                      |

---

## 九、学习建议

1. **Proxy 基础**：先理解 ES6 Proxy 的 13 种拦截器
2. **三大核心**：track 收集 / trigger 触发 / effect 执行
3. **懒代理**：Vue 3 的关键优化，访问到才代理
4. **异步更新**：理解为什么用微任务合并更新

---

## 参考

- [Vue 3 响应式源码](https://github.com/vuejs/core/tree/main/packages/reactivity)
- [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
