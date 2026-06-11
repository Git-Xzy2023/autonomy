---
title: "Vue3 响应式原理（Proxy）"
---

# Vue3 响应式原理（Proxy）

**核心机制：**

Vue3 使用 ES6 `Proxy` 对整个对象做代理拦截，结合 `WeakMap` 做依赖收集，相比 Vue2 更强大且性能更好。

- **reactive**：将对象转化为 Proxy 代理，深层递归代理嵌套对象（惰性代理，访问时才代理）
- **ref**：对原始值（primitive）的封装，内部通过 `.value` 访问，使用 class getter/setter 实现
- **effect**：响应式副作用函数，类似 Vue2 的 Watcher，执行时会自动收集依赖
- **track / trigger**：依赖收集和触发更新的核心函数，通过 `targetMap (WeakMap) → depsMap (Map) → dep (Set)` 三层结构存储

**核心源码结构（packages/reactivity/src/）：**

```js
// reactive.ts —— 创建响应式对象
export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

function createReactiveObject(target, isReadonly, baseHandlers) {
  if (!isObject(target)) return target;
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existingProxy = proxyMap.get(target);
  if (existingProxy) return existingProxy; // 同一对象重复 reactive 返回同一代理
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}

// baseHandlers.ts —— Proxy 的 get/set 陷阱
const get = createGetter();
const set = createSetter();

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) track(target, "get", key); // 收集依赖
    if (isObject(res)) return isReadonly ? readonly(res) : reactive(res); // 惰性代理
    return res;
  };
}

function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    const hadKey = hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey)
      trigger(target, "add", key, value); // 新增属性
    else if (hasChanged(value, oldValue)) trigger(target, "set", key, value); // 修改属性
    return result;
  };
}

// effect.ts —— 副作用 & 依赖收集
let activeEffect = null;
const targetMap = new WeakMap();

export function track(target, type, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, type, key, newValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set();
  const add = (e) => e && effects.add(e);
  depsMap.get(key) && depsMap.get(key).forEach(add);
  effects.forEach((effect) => effect());
}
```

**Vue3 响应式相比 Vue2 的优势：**

1. **可监听新增/删除的属性**：Proxy 代理的是整个对象，不受属性是否已存在的限制
2. **原生支持数组**：无需重写数组方法，`arr[index] = val` 和 `arr.length = 0` 都能响应
3. **原生支持 Map/Set/WeakMap/WeakSet**
4. **惰性代理**：访问属性时才递归代理子对象，初始化性能更好
5. **Proxy 比 defineProperty 更标准**，现代浏览器原生优化更好

**Vue3 的不足：**

- 解构 reactive 对象后会丢失响应式（需要 `toRefs` / `toRef`）
- Proxy 无法被 polyfill，不支持 IE11
