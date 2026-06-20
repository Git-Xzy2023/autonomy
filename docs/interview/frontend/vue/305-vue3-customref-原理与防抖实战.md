---
title: "Vue3 customRef 原理与防抖实战"
---

# Vue3 customRef 原理与防抖实战

## 为什么需要 customRef

`ref` 的依赖收集和触发更新是自动的：访问 `.value` 收集，修改 `.value` 触发。但有些场景需要**手动控制**：

- **防抖**：输入框频繁修改，希望延迟触发更新。
- **节流**：滚动事件频繁，限制更新频率。
- **异步验证**：修改后异步校验，校验通过才触发更新。
- **条件更新**：只有满足条件才触发更新。

`customRef` 让你自定义 track 和 trigger 的时机。

## 用法

```js
import { customRef } from 'vue';

function myRef(value) {
  return customRef((track, trigger) => {
    return {
      get() {
        track(); // 手动收集依赖
        return value;
      },
      set(newVal) {
        value = newVal;
        trigger(); // 手动触发更新
      }
    };
  });
}

const count = myRef(0);
count.value++; // 触发更新
```

## 原理

```js
// packages/reactivity/src/ref.ts
class CustomRefImpl<T> {
  public dep: Dep = new Dep();
  public readonly __v_isRef = true;
  public [ReactiveFlags.SKIP]: boolean = false;

  constructor(public factory: CustomRefFactory<T>) {
    // factory 返回 { get, set }
  }

  get value() {
    const res = this.factory(this.dep.depend.bind(this.dep), () => this.dep.notify()).get();
    return res;
  }

  set value(newVal) {
    this.factory(() => {}, () => {})(/* get */).set(newVal);
    // 实际实现：factory 返回的对象有 set，调用 set
  }
}

export function customRef(factory) {
  return new CustomRefImpl(factory);
}
```

**核心：** `customRef` 接收一个 factory 函数，factory 接收 `track` 和 `trigger` 两个函数，返回带 `get`/`set` 的对象。`track` 和 `trigger` 由 Vue 提供，分别在 get 和 set 里调用。

## 实战：防抖 ref

```js
import { customRef } from 'vue';

function debouncedRef(value, delay = 200) {
  let timer;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newVal) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newVal;
          trigger(); // 延迟触发更新
        }, delay);
      }
    };
  });
}

// 使用
const keyword = debouncedRef('', 300);
// 模板：<input v-model="keyword" />
// 用户连续输入时，300ms 内只触发一次更新
```

## 实战：异步验证 ref

```js
function asyncValidatedRef(initialValue, validator) {
  let value = initialValue;
  let isValidating = false;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      async set(newVal) {
        isValidating = true;
        trigger(); // 通知正在校验
        const isValid = await validator(newVal);
        if (isValid) {
          value = newVal;
        }
        isValidating = false;
        trigger(); // 校验完成，触发更新
      }
    };
  });
}

const email = asyncValidatedRef('', async (val) => {
  return await api.validateEmail(val);
});
```

## 实战：本地存储同步 ref

```js
function localStorageRef(key, defaultValue) {
  let value = JSON.parse(localStorage.getItem(key)) ?? defaultValue;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newVal) {
        value = newVal;
        localStorage.setItem(key, JSON.stringify(newVal));
        trigger();
      }
    };
  });
}

const settings = localStorageRef('settings', { theme: 'light' });
// 修改 settings.value 会自动同步到 localStorage
```

## 实战：条件更新 ref

```js
function positiveRef(initial) {
  let value = initial;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newVal) {
        if (newVal < 0) return; // 负数不更新
        value = newVal;
        trigger();
      }
    };
  });
}

const count = positiveRef(0);
count.value = -1; // 不触发更新，value 仍是 0
count.value = 5;  // 触发更新，value 变 5
```

## 与 computed 的区别

| 维度       | customRef                  | computed                   |
| ---------- | -------------------------- | -------------------------- |
| 数据来源   | 自定义（可外部状态）       | 依赖其他响应式数据         |
| 缓存       | 无（每次 get 都 track）    | 有（依赖未变不重新计算）   |
| 可写性     | 可读可写                   | 默认只读，可写但需 setter  |
| 控制粒度   | 完全控制 track/trigger 时机 | 自动追踪依赖              |
| 适用场景   | 防抖/节流/异步/条件        | 派生状态                   |

## 注意事项

1. **get 里必须 track**：否则依赖不会被收集，更新不触发渲染。
2. **set 里按需 trigger**：不调 trigger 就不更新视图。
3. **不能在 get 里做副作用**：get 会被频繁调用（每次渲染），副作用会导致死循环。
4. **闭包变量**：factory 里的局部变量（如 timer）在 ref 生命周期内保持，多次 set 共享。

## 总结

`customRef` 是 Vue3 响应式系统的"逃生舱"，让你能精细控制依赖收集和触发更新的时机。适合防抖、节流、异步、条件更新等"非标准响应式"场景。普通场景用 `ref`/`computed` 即可，不要滥用 customRef。
