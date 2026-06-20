---
title: "Vue3 shallow 系列 API 原理"
---

# Vue3 shallow 系列 API 原理

## 为什么需要 shallow

`reactive` 和 `ref` 默认**深层响应式**：嵌套对象也会被 Proxy 代理。深层响应式有两个代价：

1. **初始化开销**：虽然 Vue3 是惰性代理（访问时才代理），但大型对象仍要逐层创建 Proxy。
2. **性能开销**：每次访问嵌套属性都要走 Proxy 拦截，深层结构访问慢。

有些场景**只需要第一层响应式**：

- 大型静态数据（如表格数据），只关心数组本身变化，不关心元素内部。
- 第三方对象（如 Date、Map、类实例），不希望被 Proxy 代理破坏内部逻辑。
- 性能敏感场景，避免深层代理开销。

`shallow` 系列只代理第一层，深层保持原样。

## shallowRef

```js
import { shallowRef, triggerRef } from 'vue';

const state = shallowRef({ count: 0, nested: { value: 1 } });

state.value.count = 5; // ❌ 不触发更新（深层修改不响应）
state.value = { count: 5 }; // ✅ 触发更新（替换 .value）

// 手动触发更新（修改深层后通知）
state.value.count = 5;
triggerRef(state); // ✅ 强制触发依赖
```

**原理：**

```js
// packages/reactivity/src/ref.ts
class ShallowRefImpl {
  constructor(value) {
    this._value = value; // 不调用 reactive，直接存原值
    this.dep = new Dep();
  }

  get value() {
    this.dep.depend();
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._value)) {
      this._value = newVal; // 不调用 reactive
      this.dep.notify();
    }
  }
}

export function shallowRef(value) {
  return new ShallowRefImpl(value);
}
```

**对比 ref：** `ref` 在构造和赋值时调 `reactive(value)`，`shallowRef` 不调，所以深层对象不被代理。

## shallowReactive

```js
import { shallowReactive } from 'vue';

const state = shallowReactive({
  count: 0,
  nested: { value: 1 }
});

state.count = 5; // ✅ 触发更新（第一层）
state.nested.value = 2; // ❌ 不触发更新（深层不被代理）
state.nested = { value: 3 }; // ✅ 触发更新（第一层属性替换）
```

**原理：**

```js
// packages/reactivity/src/reactive.ts
export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

// baseHandlers.ts
const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
  // ...
};

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) track(target, 'get', key);
    if (shallow) return res; // shallow：直接返回，不调 reactive
    if (isObject(res)) return reactive(res); // 非 shallow：递归代理
    return res;
  };
}
```

**关键：** `shallowGet` 在拿到嵌套对象时**不调 `reactive`**，直接返回原对象，所以深层不被代理。

## shallowReadonly

```js
import { shallowReadonly } from 'vue';

const config = shallowReadonly({
  api: 'https://...',
  options: { timeout: 5000 }
});

config.api = 'xxx'; // ❌ 警告：readonly
config.options.timeout = 1000; // ✅ 可以改（深层不是 readonly）
```

**用途：** 组件 props 传给子组件时，希望子组件不能改 props 本身，但能改 props 里的对象内容（避免深层 readonly 的性能开销）。

## readonly（对比）

`readonly` 是深层只读，所有嵌套属性都不能改：

```js
const state = readonly({ nested: { value: 1 } });
state.nested.value = 2; // ❌ 警告
```

## 性能对比

```js
// 10000 个对象的大型列表
const data = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `item${i}`,
  nested: { value: i }
}));

// reactive：每个对象的 nested 都会被代理（访问时）
const state1 = reactive(data);

// shallowReactive：只有数组本身响应式，元素不被代理
const state2 = shallowReactive(data);

// 访问 state2[0].nested.value 比 state1[0].nested.value 快
// 因为 state2 的 nested 是原对象，没有 Proxy 拦截
```

## 使用场景

### 1. 大型列表数据

```js
const list = shallowRef([]);
list.value = await fetchHugeList(); // 替换整个数组触发更新
// 不需要修改单个元素
```

### 2. 第三方对象

```js
import { markRaw, shallowRef } from 'vue';
import mapboxgl from 'mapbox-gl';

const map = shallowRef(null);
onMounted(() => {
  map.value = new mapboxgl.Map({ /* config */ }); // 不希望被代理
});
```

### 3. 性能敏感的组件状态

```js
const state = shallowReactive({
  visible: false,
  data: hugeObject // 不希望 deep reactive
});
```

## 与 markRaw 的区别

- **shallowRef/shallowReactive**：第一层响应式，深层不响应。
- **markRaw**：标记单个对象"永不响应"，即使被 ref/reactive 包裹也不代理。

```js
const obj = markRaw({ x: 1 });
const state = reactive({ obj }); // obj 不被代理

const obj2 = { x: 1 };
const state2 = shallowReactive({ obj2 }); // obj2 不被代理（shallow）
const state3 = reactive({ obj2 }); // obj2 被代理（deep）
```

## 总结

| API              | 第一层响应式 | 深层响应式 | 第一层只读 | 深层只读 |
| ---------------- | ------------ | ---------- | ---------- | -------- |
| ref              | ✓            | ✓          | ✗          | ✗        |
| reactive         | ✓            | ✓          | ✗          | ✗        |
| shallowRef       | ✓            | ✗          | ✗          | ✗        |
| shallowReactive  | ✓            | ✗          | ✗          | ✗        |
| readonly         | ✓            | ✓          | ✓          | ✓        |
| shallowReadonly  | ✓            | ✗          | ✓          | ✗        |

**选择原则：** 只需要第一层响应式、或想避免深层代理开销时，用 shallow 系列。
