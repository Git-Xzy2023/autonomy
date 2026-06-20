---
title: "Vue3 watch vs watchEffect 原理与选择"
---

# Vue3 watch vs watchEffect 原理与选择

## 为什么有两个 API

- **watch**：明确指定监听的数据源，数据变化时执行回调。类似 Vue2 的 `watch`，但更灵活。
- **watchEffect**：自动收集回调里的响应式依赖，依赖变化时重新执行。类似 React 的 `useEffect`，但无需手写依赖数组。

两者解决不同场景：watch 适合"精确监听"，watchEffect 适合"副作用自动追踪"。

## 用法对比

### watch

```js
import { ref, watch } from 'vue';

const count = ref(0);

// 监听 ref
watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`);
});

// 监听 getter
watch(
  () => state.user.name,
  (newVal, oldVal) => { /* ... */ }
);

// 监听多个源
watch([count, () => state.name], ([newCount, newName], [oldCount, oldName]) => {
  // ...
});

// 配置项
watch(count, callback, {
  immediate: true,  // 立即执行一次
  deep: true,       // 深度监听（对象内部变化也触发）
  flush: 'post'     // 'pre'（默认，DOM 更新前）/ 'post'（DOM 更新后）/ 'sync'（同步）
});
```

### watchEffect

```js
import { ref, watchEffect } from 'vue';

const count = ref(0);
const name = ref('Tom');

// 自动收集依赖
watchEffect(() => {
  console.log(count.value, name.value); // 访问了 count 和 name，自动监听
});

// 配置项
watchEffect(callback, {
  flush: 'post', // 默认 'pre'
  onTrack(e) { /* 依赖收集时触发 */ },
  onTrigger(e) { /* 依赖变化触发时调用 */ }
});

// 返回值：停止监听
const stop = watchEffect(() => { /* ... */ });
stop(); // 停止
```

## 原理差异

### watch 的实现

```js
// packages/runtime-core/src/apiWatch.ts
export function watch(source, cb, options) {
  return doWatch(source, cb, options);
}

function doWatch(source, cb, { immediate, deep, flush }) {
  // 1. 把 source 转成 getter 函数
  let getter;
  if (isRef(source)) {
    getter = () => source.value;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true; // reactive 默认 deep
  } else if (isFunction(source)) {
    getter = source;
  } else if (isArray(source)) {
    getter = () => source.map(s => {
      if (isRef(s)) return s.value;
      if (isReactive(s)) return traverse(s);
      if (isFunction(s)) return s();
    });
  }

  // 2. deep 处理：遍历对象所有属性，触发依赖收集
  if (deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  // 3. 创建 effect
  let cleanup;
  const onCleanup = (fn) => { cleanup = fn; };

  const job = () => {
    if (cb) {
      // watch：有回调
      const newValue = effect.run();
      if (deep || hasChanged(newValue, oldValue)) {
        if (cleanup) cleanup();
        cb(newValue, oldValue, onCleanup);
        oldValue = newValue;
      }
    } else {
      // watchEffect：无回调，直接 run
      effect.run();
    }
  };

  const effect = new ReactiveEffect(getter, job); // scheduler 是 job
  effect.run(); // 首次执行（watchEffect 立即执行，watch 不立即）

  if (immediate) {
    job();
  }

  return () => effect.stop(); // 返回停止函数
}
```

### watchEffect 的实现

```js
export function watchEffect(effect, options) {
  return doWatch(effect, null, options); // cb 为 null
}
```

**watchEffect 就是 `watch` 的 `cb` 为 null 的特例**：首次立即执行 effect，后续依赖变化时重新执行 effect（不传新旧值）。

## 核心区别

| 维度       | watch                          | watchEffect                  |
| ---------- | ------------------------------ | ---------------------------- |
| 依赖收集   | 手动指定（source）             | 自动（执行回调时收集）       |
| 首次执行   | 默认不执行（immediate: true）  | 立即执行                     |
| 回调参数   | (newVal, oldVal, onCleanup)    | (onCleanup)                  |
| 旧值       | 有                             | 无                           |
| 配置项     | deep / immediate / flush       | flush / onTrack / onTrigger  |
| 适用场景   | 精确监听、需要旧值             | 副作用、自动追踪             |

## 选择建议

### 用 watch 的场景

1. **需要旧值**：比较前后差异。
2. **精确控制触发**：只监听特定数据源，不监听回调里访问的其他响应式数据。
3. **不希望首次执行**：只在变化时执行。
4. **监听多个数据源**：`watch([a, b], ...)`。

```js
// 需要旧值
watch(
  () => state.list,
  (newList, oldList) => {
    const added = newList.filter(x => !oldList.includes(x));
    console.log('新增：', added);
  }
);
```

### 用 watchEffect 的场景

1. **副作用**：操作 DOM、发请求、订阅事件。
2. **依赖多个响应式数据**：不想手动列依赖。
3. **希望首次执行**：初始化时也要执行。

```js
// 副作用：根据状态操作 DOM
watchEffect(() => {
  document.title = `${count.value} - ${name.value}`;
});

// 副作用：发请求
watchEffect(async () => {
  const data = await fetch(`/api?keyword=${keyword.value}&page=${page.value}`);
  // keyword 或 page 变化都重新请求
});
```

## onCleanup：处理副作用清理

```js
watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    console.log(count.value);
  }, 1000);

  onCleanup(() => {
    clearInterval(timer); // 下次执行前清理上次的 timer
  });
});
```

**原理：** effect 重新执行前，先调用上次的 cleanup 函数。避免内存泄漏（如未清理的定时器、未取消的请求）。

## flush 选项

```js
watch(count, cb, { flush: 'pre' });  // 默认：DOM 更新前
watch(count, cb, { flush: 'post' }); // DOM 更新后
watch(count, cb, { flush: 'sync' }); // 同步执行（不推荐，可能死循环）
```

- **pre**：在组件更新前执行，回调里拿到的是旧 DOM。
- **post**：在组件更新后执行，回调里能访问新 DOM。
- **sync**：数据变化立即执行，不进队列。慎用，容易死循环。

## Vue2 watch 的局限（为什么 Vue3 改进）

Vue2 的 watch 是字符串路径：

```js
watch: {
  'user.profile.name'(newVal, oldVal) { /* ... */ }
}
```

**问题：**

1. 字符串路径无类型提示，拼写错误不报错。
2. 无法监听多个数据源。
3. 无法监听"返回值的计算"（要靠 computed 中转）。
4. 无法停止监听。

Vue3 的 watch 用函数，类型安全、灵活、可停止，是质的提升。

## 总结

- **watch**：精确监听，需要旧值，控制触发时机。
- **watchEffect**：副作用，自动追踪依赖，首次执行。
- **onCleanup**：清理上次副作用，避免泄漏。
- **flush**：控制执行时机（pre/post/sync）。

**原则：** 副作用用 watchEffect，精确监听用 watch。不要滥用，能用 computed 就用 computed（computed 是派生状态，无副作用）。
