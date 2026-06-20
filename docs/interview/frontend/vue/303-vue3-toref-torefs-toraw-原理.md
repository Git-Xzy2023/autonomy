---
title: "Vue3 toRef / toRefs / toRaw 原理"
---

# Vue3 toRef / toRefs / toRaw 原理

## 为什么需要这些 API

`reactive` 对象解构会失去响应式（因为解构出来的是值，不是响应式引用）。但实际开发中我们经常需要解构（比如把 `state.count` 单独拿出来用）。`toRef` / `toRefs` 解决"解构后仍保持响应式"的问题。

`toRaw` 则相反：拿到 Proxy 背后的原始对象，用于"绕过响应式"的场景（比如深比较、序列化）。

## toRef

把 reactive 对象的某个属性转成 ref，**不复制值，保持引用关联**：

```js
import { reactive, toRef } from 'vue';

const state = reactive({ count: 0 });
const count = toRef(state, 'count');

count.value++; // state.count 也变 1
state.count++; // count.value 也变 2
```

**原理：**

```js
// packages/reactivity/src/ref.ts
class ObjectRefImpl {
  constructor(object, key, defaultValue) {
    this._object = object;
    this._key = key;
    this._defaultValue = defaultValue;
    this.__v_isRef = true;
  }

  get value() {
    const val = this._object[this._key];
    return val === undefined ? this._defaultValue : val;
  }

  set value(newVal) {
    this._object[this._key] = newVal;
  }
}

export function toRef(object, key, defaultValue) {
  return new ObjectRefImpl(object, key, defaultValue);
}
```

**关键：** `ObjectRefImpl` 不存储值，只是对原对象属性的"引用"。读写 `.value` 实际是读写 `object[key]`，所以保持响应式关联。

## toRefs

把 reactive 对象的所有属性都转成 ref，返回一个普通对象（每个属性是 ref）：

```js
const state = reactive({ count: 0, name: 'Tom' });
const { count, name } = toRefs(state);

count.value++; // state.count 也变 1
```

**原理：**

```js
export function toRefs(object) {
  const ret = Array.isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
```

**就是遍历每个属性调 toRef。** 返回的对象本身不是响应式的（普通对象），但每个属性是 ref。

## 典型用法：composable 函数返回值

```js
// useUser.js
import { reactive, toRefs } from 'vue';

export function useUser() {
  const state = reactive({
    user: null,
    loading: false,
    error: null
  });

  async function fetchUser(id) {
    state.loading = true;
    try {
      state.user = await api.getUser(id);
    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
    }
  }

  return {
    ...toRefs(state), // 解构后仍响应式
    fetchUser
  };
}

// 组件
const { user, loading, error, fetchUser } = useUser();
// user/loading/error 都是 ref，响应式
```

## toRaw

拿到 Proxy 代理的原始对象：

```js
const state = reactive({ count: 0 });
const raw = toRaw(state);

raw === state; // false，state 是 Proxy
raw.count; // 0
raw.count = 5; // 不触发更新（绕过响应式）
state.count; // 5（原始对象改了，Proxy 读到的也是 5）
```

**原理：**

```js
export function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
```

Proxy 对象上有 `__v_raw` 属性指向原始对象，`toRaw` 递归拿到最原始的对象（处理嵌套 reactive 的情况）。

## toRaw 的使用场景

### 1. 性能敏感的深比较

```js
const state = reactive({ list: hugeArray });
// 直接比较会触发 Proxy 拦截，慢
const isEqual = JSON.stringify(toRaw(state.list)) === JSON.stringify(otherList);
```

### 2. 传给不兼容 Proxy 的库

```js
const state = reactive({ data: {} });
// 某些库内部用 === 比较，Proxy 会失败
thirdPartyLib(toRaw(state.data));
```

### 3. 临时绕过响应式

```js
const state = reactive({ count: 0 });
// 批量修改不触发更新
const raw = toRaw(state);
raw.count = 1;
raw.count = 2;
raw.count = 3;
// 最后触发一次更新
triggerRef(state); // 或手动触发
```

## markRaw vs toRaw

- **toRaw**：拿到原始对象，但原 Proxy 仍存在，仍可响应式。
- **markRaw**：标记对象"永远不被代理"，`reactive(markRaw(obj))` 返回原对象。

```js
import { markRaw, reactive } from 'vue';

const obj = markRaw({ x: 1 });
const state = reactive(obj);
state === obj; // true，没被代理
state.x = 2; // 不触发更新
```

**markRaw 场景：** 第三方类实例（Map/Set/复杂对象）、不需要响应式的静态数据。

## unref

辅助 API：如果是 ref 就返回 `.value`，否则原样返回。

```js
import { unref, ref } from 'vue';

const count = ref(0);
const name = 'Tom';

unref(count); // 0
unref(name);  // 'Tom'

// 等价于
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
```

**用途：** composable 函数参数既接受 ref 又接受原始值时，统一处理。

## 总结

| API      | 作用                              | 典型场景                     |
| -------- | --------------------------------- | ---------------------------- |
| toRef    | 单个属性 → ref（保持引用）        | 把 props 的某个属性转 ref    |
| toRefs   | 所有属性 → ref 对象               | composable 返回值解构        |
| toRaw    | Proxy → 原始对象                  | 性能优化、绕过响应式         |
| markRaw  | 标记对象永不代理                  | 第三方实例、静态数据         |
| unref    | ref → 值（非 ref 原样返回）       | 函数参数兼容 ref 和原始值    |
