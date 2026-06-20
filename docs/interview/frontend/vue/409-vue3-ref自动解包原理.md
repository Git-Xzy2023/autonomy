---
title: "Vue3 ref 自动解包原理"
---

# Vue3 ref 自动解包原理

## 为什么需要自动解包

`ref` 要求用 `.value` 访问，但在模板里写 `count.value` 很繁琐。Vue3 的编译器自动解包 ref，让模板里直接用 `count` 即可。此外，reactive 对象里的 ref 也会自动解包，避免 `state.count.value` 的嵌套访问。

## 三种自动解包场景

### 1. 模板里的自动解包

```vue
<template>
  <div>{{ count }}</div> <!-- 不用 count.value -->
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
```

### 2. reactive 对象里的自动解包

```js
const count = ref(0);
const state = reactive({ count });

state.count;      // 0，不用 state.count.value
state.count = 5;  // 等价于 count.value = 5
```

### 3. 数组/Map 里的不自动解包

```js
const arr = reactive([ref(0)]);
arr[0]; // ref(0)，不是 0（不解包）
arr[0].value; // 0

const map = reactive(new Map([['count', ref(0)]]));
map.get('count'); // ref(0)，不是 0
```

## 原理

### 1. 模板自动解包：setup 返回值的代理

`<script setup>` 编译后，setup 返回的对象被 `proxyRefs` 包裹：

```js
// 编译后
setup(__props, { expose }) {
  const count = ref(0);
  return { count };
}

// 实际运行时
setup(__props, { expose }) {
  const count = ref(0);
  return proxyRefs({ count }); // 包裹一层
}
```

`proxyRefs` 创建一个 Proxy，访问时自动解包 ref：

```js
// packages/reactivity/src/proxyRefs.ts
export function proxyRefs(objectWithRefs) {
  return isShallow(objectWithRefs)
    ? shallowProxyRefs(objectWithRefs)
    : new Proxy(objectWithRefs, {
        get(target, key, receiver) {
          return unref(Reflect.get(target, key, receiver));
        },
        set(target, key, value, receiver) {
          const oldValue = target[key];
          if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value; // 设置时自动赋给 .value
            return true;
          } else {
            return Reflect.set(target, key, value, receiver);
          }
        }
      });
}

export function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
```

**流程：**

1. 模板访问 `_ctx.count` → Proxy.get → `unref(target.count)` → `count.value`。
2. 模板设置 `_ctx.count = 5` → Proxy.set → `count.value = 5`。

**所以模板里 `count` 等价于 `count.value`，是编译时 + 运行时协作实现的。**

### 2. reactive 自动解包：get handler 的特殊处理

```js
// packages/reactivity/src/baseHandlers.ts
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      track(target, 'get', key);
    }

    if (shallow) {
      return res; // shallow：不解包
    }

    if (isRef(res)) {
      // ref 自动解包（但数组/Map 的元素不解包）
      return res.value;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}
```

**关键：** reactive 的 get handler 检测到属性值是 ref 时，返回 `res.value`（解包）。

### 3. 数组/Map 不解包的原因

**数组：**

```js
const arr = reactive([ref(0)]);

// get(arr, '0') → Reflect.get(arr, '0') → ref(0)
// 但数组有特殊处理：
if (isRef(res)) {
  // 数组整数索引不解包
  if (isIntegerKey(key)) {
    return res; // 返回 ref 本身
  }
  return res.value; // 非索引属性解包
}
```

**为什么不解包：** 数组的 `arr[0]` 可能用于 map/filter 等操作，如果自动解包，`arr.map(fn)` 的 fn 收到的是值而不是 ref，无法区分"原始值"和"ref 解包后的值"。保持 ref 不解包，让开发者显式处理。

**Map/Set：** reactive 的 Map/Set 用 `collectionHandlers`，get 方法返回原值，不解包：

```js
// packages/reactivity/src/collectionHandlers.ts
const get = createInstrumentations();
function createInstrumentations() {
  return {
    get(key) {
      const target = toRaw(this);
      const rawKey = toRaw(key);
      track(target, 'get', rawKey);
      const has = target.has(rawKey);
      if (has) {
        return target.get(rawKey); // 不解包
      }
    }
  };
}
```

## 自动解包的边界

### 1. 解构会失去自动解包

```js
const state = reactive({ count: ref(0) });
const { count } = state; // count 是 ref（解构拿到原始值）
count.value; // 0（需要 .value）
```

**原因：** 解构是 `const count = state.count`，触发 reactive 的 get handler，返回 `ref.value`（解包后的值）。但这里 state.count 是 ref，解构拿到的是 ref 本身（因为 reactive 的 get 对 ref 属性返回 `res.value`，但解构是 `state.count`，触发 get，返回 `ref.value`）。

**实际：** `state.count` 触发 get，返回 `ref.value`（0）。所以 `const { count } = state` 的 count 是 0，不是 ref，失去响应式。

**解决：** 用 `toRefs`：

```js
const { count } = toRefs(state); // count 是 ref
```

### 2. 嵌套 reactive 不解包

```js
const state = reactive({
  nested: reactive({ count: ref(0) })
});
state.nested.count; // 0（reactive 嵌套，触发 get，解包）
```

**实际：** `state.nested` 触发 get，返回 `reactive(nested)`（已代理）。`.count` 触发 nested 的 get，返回 `ref.value`（0）。所以嵌套 reactive 仍解包。

### 3. shallowReactive 不解包

```js
const state = shallowReactive({ count: ref(0) });
state.count; // ref(0)（shallow 不解包）
state.count.value; // 0
```

**原因：** shallowReactive 的 get handler 不调 `isRef(res)` 检查，直接返回原值。

## 模板自动解包的编译时优化

`<script setup>` 编译时，编译器知道哪些变量是 ref，能生成更优的代码：

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
const name = 'Tom';
</script>

<template>
  <div>{{ count }} - {{ name }}</div>
</template>
```

编译后：

```js
function render(_ctx, _cache) {
  return createElementVNode('div', null,
    toDisplayString(_ctx.count) + ' - ' + toDisplayString(_ctx.name),
    1 /* TEXT */
  );
}
```

`_ctx` 是 `proxyRefs` 包裹后的对象，`_ctx.count` 自动解包为 `count.value`，`_ctx.name` 是普通字符串。

## 总结

- **模板自动解包**：setup 返回值用 `proxyRefs` 包裹，Proxy.get 时 `unref`。
- **reactive 自动解包**：get handler 检测 ref，返回 `res.value`。
- **数组/Map 不解包**：避免 map/filter 等操作的歧义。
- **shallow 不解包**：shallowReactive/shallowRef 不做 ref 检测。
- **解构失去解包**：需要 `toRefs` 保持响应式。

自动解包是 Vue3 为了简化模板写法的设计，让 ref 在模板里像普通变量一样使用，是开发体验的重要优化。
