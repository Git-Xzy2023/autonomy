---
title: "Vue3 响应式嵌套 effect 与依赖清理"
---

# Vue3 响应式嵌套 effect 与依赖清理

## 嵌套 effect 的问题

```js
effect(() => {           // 外层 effect
  effect(() => {         // 内层 effect
    console.log(state.a);
  });
  console.log(state.b);
});
```

**问题：** 如果只有一个全局 `activeEffect`，内层 effect 执行完后，`activeEffect` 变成 null，外层的 `state.b` 无法收集依赖。

## 解决方案：effectStack

Vue3 用**栈**保存嵌套的 effect：

```js
// packages/reactivity/src/effect.ts
let activeEffect = null;
const effectStack = [];

class ReactiveEffect {
  run() {
    if (!this.active) {
      return this.fn();
    }

    try {
      effectStack.push(this);     // 入栈
      activeEffect = this;        // 设为当前
      return this.fn();           // 执行（触发 track）
    } finally {
      effectStack.pop();          // 出栈
      activeEffect = effectStack[effectStack.length - 1]; // 恢复外层
    }
  }
}
```

**执行流程：**

```
1. 外层 effect 入栈，activeEffect = 外层
2. 执行外层 fn，访问 state.a（内层 effect 还没执行）
3. 遇到内层 effect，内层 effect 入栈，activeEffect = 内层
4. 执行内层 fn，访问 state.a，track(state, 'a') 收集到内层 effect
5. 内层 effect 出栈，activeEffect = 外层（恢复）
6. 继续执行外层 fn，访问 state.b，track(state, 'b') 收集到外层 effect
7. 外层 effect 出栈，activeEffect = null
```

**结果：** state.a 的 dep 里有内层 effect，state.b 的 dep 里有外层 effect。各自独立，互不干扰。

## 依赖清理（cleanup）

### 为什么需要清理

```js
const state = reactive({ flag: true, a: 1, b: 2 });

effect(() => {
  if (state.flag) {
    console.log(state.a); // flag=true 时依赖 a
  } else {
    console.log(state.b); // flag=false 时依赖 b
  }
});
```

**问题：**

1. 首次执行：flag=true，依赖 flag 和 a。
2. flag 改为 false：触发 effect 重新执行。
3. 重新执行：flag=false，依赖 flag 和 b。
4. **但 a 的 dep 里仍有这个 effect**（没清理），a 变化仍会触发 effect（浪费）。

### 解决方案：每次重新执行前清理旧依赖

```js
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = []; // 订阅的 dep 列表
  }

  run() {
    try {
      effectStack.push(this);
      activeEffect = this;
      cleanupEffect(this); // 清理旧依赖
      return this.fn();    // 重新收集依赖
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach(dep => dep.delete(effect)); // 从每个 dep 移除自己
  effect.deps.length = 0; // 清空 deps
}
```

### 双向引用

track 时建立双向引用：

```js
export function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));

  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);              // dep → effect
    activeEffect.deps.push(dep);        // effect → dep
  }
}
```

**双向引用的目的：** cleanup 时，effect 能从自己的 `deps` 找到所有订阅的 dep，把自己从 dep 里移除。

### cleanup 的陷阱：遍历时修改

```js
export function trigger(target, key) {
  const dep = depsMap.get(key);
  if (!dep) return;

  const effects = [...dep]; // 拷贝！避免遍历时修改
  effects.forEach(effect => {
    if (effect === activeEffect) return; // 避免无限递归
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run(); // run 内部会 cleanup，修改 dep
    }
  });
}
```

**如果不拷贝：** `forEach` 遍历时，`effect.run()` 内部 `cleanupEffect` 会从 dep 删除 effect，然后重新 track 又 add 回去，导致 Set 在遍历时被修改，行为未定义（可能死循环或漏执行）。

**拷贝后：** 遍历的是快照，修改原 dep 不影响遍历。

## 嵌套 effect 与 cleanup 的协作

```js
const state = reactive({ flag: true, a: 1, b: 2 });

effect(() => {           // 外层
  if (state.flag) {
    console.log(state.a);
  } else {
    console.log(state.b);
  }
});

// 首次执行：
// 1. 外层 effect 入栈，cleanup（无旧依赖）
// 2. flag=true，访问 state.a，track(a) → 外层 effect
// 3. 外层 effect.deps = [dep_flag, dep_a]

state.flag = false;
// trigger(flag) → 外层 effect.run()
// 1. cleanup：从 dep_flag 和 dep_a 移除外层 effect
// 2. 重新执行：flag=false，访问 state.b，track(b) → 外层 effect
// 3. 外层 effect.deps = [dep_flag, dep_b]

state.a = 100;
// trigger(a) → dep_a 为空（已清理），不触发外层 effect ✓

state.b = 200;
// trigger(b) → dep_b 有外层 effect，触发 ✓
```

## computed 的嵌套 effect

computed 内部用 effect，且会被其他 effect 订阅：

```js
const state = reactive({ count: 0 });
const double = computed(() => state.count * 2);

effect(() => {
  console.log(double.value); // 外层 effect 订阅 computed
});

// 执行流程：
// 1. 外层 effect 执行，访问 double.value
// 2. double.value 的 getter 触发 computed 内部 effect.run()
// 3. computed effect 执行，访问 state.count，track(count) → computed effect
// 4. computed effect 完成，返回值
// 5. double.value 的 getter 继续：track(computed, 'value') → 外层 effect
// 6. 外层 effect 完成

state.count = 1;
// trigger(count) → computed effect 的 scheduler（标记 dirty）
// computed effect 不立即 run（惰性）
// trigger(computed, 'value') → 外层 effect 重新执行
// 外层 effect 访问 double.value，发现 dirty，重新计算
```

**关键：** computed 的 effect 用 scheduler（只标记 dirty，不立即 run），实现惰性求值。外层 effect 订阅的是 computed 的 dep，不是原始数据的 dep。

## effect 的 stop

```js
const runner = effect(() => {
  console.log(state.count);
});

runner.effect.stop(); // 停止
state.count = 1;      // 不再触发
```

```js
function stop(effect) {
  if (effect.active) {
    cleanupEffect(effect); // 清理所有依赖
    effect.active = false;
  }
}
```

**停止后：** effect 从所有 dep 移除，数据变化不再触发。但 effect.fn 仍可调用（直接执行，不收集依赖）。

## 总结

- **effectStack**：处理嵌套 effect，保证内外层依赖独立收集。
- **cleanup**：每次重新执行前清理旧依赖，避免过期依赖导致无效触发。
- **双向引用**：effect.deps 和 dep.subs 互相引用，便于 cleanup。
- **trigger 拷贝**：遍历 dep 时拷贝，避免 cleanup 修改导致遍历异常。
- **computed 嵌套**：computed 的 effect 用 scheduler 实现惰性求值，外层 effect 订阅 computed 的 dep。

Vue3 的响应式系统通过 effectStack + cleanup + 双向引用，正确处理了嵌套、条件分支、computed 等复杂场景，是响应式正确性的基础。
