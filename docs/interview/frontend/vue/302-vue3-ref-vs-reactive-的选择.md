---
title: "Vue3 ref vs reactive 的选择"
---

# Vue3 ref vs reactive 的选择

## 为什么有两个 API

Vue3 的响应式基于 Proxy，但 Proxy 只能代理对象，无法代理原始值（string/number/boolean）。所以需要两种 API：

- **reactive**：代理对象，返回 Proxy。
- **ref**：用 `{ value: T }` 包装原始值，让原始值也能响应式。

## 用法

```js
import { ref, reactive } from 'vue';

// ref：原始值
const count = ref(0);
count.value++; // 必须用 .value

// ref：也能包装对象（内部会自动 reactive）
const user = ref({ name: 'Tom' });
user.value.name = 'Jerry'; // .value 访问对象

// reactive：对象
const state = reactive({ count: 0, list: [] });
state.count++; // 直接访问，无需 .value
```

## 原理差异

### ref 的实现

```js
// packages/reactivity/src/ref.ts
class RefImpl<T> {
  private _value: T;
  public dep: Dep = new Dep();
  public readonly __v_isRef = true;

  constructor(value) {
    this._value = isObject(value) ? reactive(value) : value; // 对象自动 reactive
  }

  get value() {
    this.dep.depend(); // 依赖收集
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._value)) {
      this._value = isObject(newVal) ? reactive(newVal) : newVal;
      this.dep.notify(); // 触发更新
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}
```

**ref 是一个带 getter/setter 的对象**，访问 `.value` 时收集依赖，修改 `.value` 时触发更新。

### reactive 的实现

```js
// packages/reactivity/src/reactive.ts
export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

function createReactiveObject(target, isReadonly, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers);
  return proxy;
}

// baseHandlers.ts
const get = createGetter();
const set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    track(target, 'get', key); // 依赖收集
    if (isObject(res)) return reactive(res); // 惰性代理嵌套对象
    return res;
  };
}
```

**reactive 是 Proxy 代理**，访问任意属性都触发 track，修改任意属性都触发 trigger。

## 核心区别

| 维度       | ref                        | reactive                  |
| ---------- | -------------------------- | ------------------------- |
| 适用类型   | 原始值 + 对象              | 只能对象                  |
| 访问方式   | `.value`                   | 直接访问                  |
| 模板里     | 自动解包，无需 `.value`    | 直接访问                  |
| 响应式来源 | getter/setter + dep        | Proxy + track/trigger     |
| 解构       | 解构 ref 仍响应式          | 解构失去响应式（要 toRefs）|
| 重新赋值   | `ref.value = newObj` ✓     | `reactive = newObj` ✗     |
| 整体替换   | 支持                       | 不支持                    |

## 选择建议

### 用 ref 的场景

1. **原始值**：`const count = ref(0)`
2. **需要整体替换的对象**：`const user = ref(null); user.value = await fetchUser();`
3. **不确定类型的场景**：ref 更通用，不会踩 reactive 的坑。
4. **组合式函数返回值**：`return { data: ref([]) }`，调用方解构后仍响应式。

### 用 reactive 的场景

1. **一组相关状态**：`const state = reactive({ user, posts, comments })`
2. **不想写 `.value`**：reactive 访问更简洁。
3. **表单数据**：`const form = reactive({ name: '', age: 0 })`

### 混合使用（推荐）

```js
const state = reactive({
  user: { name: 'Tom' },
  list: []
});
const loading = ref(false); // 单独的状态用 ref
const error = ref(null);
```

## reactive 的陷阱

### 1. 解构失去响应式

```js
const state = reactive({ count: 0 });
const { count } = state; // ❌ count 不再响应式
count++; // 不触发更新

// 解决：用 toRefs
const { count } = toRefs(state); // ✅ count 是 ref，响应式
```

### 2. 不能整体替换

```js
let state = reactive({ count: 0 });
state = reactive({ count: 1 }); // ❌ 模板里用的还是旧 state

// 解决：用 ref
const state = ref({ count: 0 });
state.value = { count: 1 }; // ✅
```

### 3. 传入函数会失去代理

```js
const state = reactive({ count: 0 });
function useCount(c) { watch(() => c, () => {}); }
useCount(state.count); // ❌ 传的是值，不是响应式引用

// 解决：传 getter 函数
useCount(() => state.count); // ✅
```

## ref 的自动解包

**模板里 ref 自动解包：**

```html
<template>
  <div>{{ count }}</div> <!-- 不用 count.value -->
</template>
```

**reactive 里的 ref 自动解包：**

```js
const count = ref(0);
const state = reactive({ count });
state.count; // 0，不用 state.count.value
state.count = 5; // 等价于 count.value = 5
```

**数组里的 ref 不解包：**

```js
const arr = reactive([ref(0)]);
arr[0].value; // 必须用 .value
```

## 总结

- **简单原则**：原始值用 ref，对象用 reactive。
- **安全原则**：不确定就用 ref，避免 reactive 的解构、替换陷阱。
- **组合原则**：一组相关状态用 reactive，独立状态用 ref，混合使用最灵活。

社区共识：**优先 ref**，因为 ref 更简单、更安全、TS 支持更好。reactive 适合"状态对象"场景。
