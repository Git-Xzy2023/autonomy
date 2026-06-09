---
title: Vue面试题
---

# Vue面试题

## 响应式原理

### Vue2 响应式原理（Object.defineProperty）

**核心机制：**

Vue2 通过 `Object.defineProperty` 劫持对象属性的 getter 和 setter，配合发布-订阅模式实现响应式。

- **Observer**：遍历对象所有属性，使用 `defineProperty` 将每个属性转换成 getter/setter，负责数据监听
- **Dep**：每个属性对应一个依赖收集器，内部维护一个 `subs` 数组，存放所有订阅该属性变化的 Watcher
- **Watcher**：订阅者，当数据变化时收到通知并执行更新回调（模板编译、computed、watch 各有不同类型的 Watcher）

**核心源码（src/core/observer/index.js）：**

```js
function defineReactive(obj, key, val) {
  const dep = new Dep();
  let childOb = observe(val); // 递归监听子属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // Dep.target 指向当前正在求值的 Watcher
      if (Dep.target) {
        dep.depend(); // 当前 Watcher 订阅该 dep
        if (childOb) childOb.dep.depend();
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal;
      childOb = observe(newVal);
      dep.notify(); // 通知所有订阅者更新
    },
  });
}
```

**数组的特殊处理：**

Vue2 不使用 `defineProperty` 劫持数组索引（性能问题），而是通过**重写数组 7 个变异方法**（`push/pop/shift/unshift/splice/sort/reverse`）来实现响应式。

```js
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
  (method) => {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      if (inserted) ob.observeArray(inserted); // 新增元素也需要响应式
      ob.dep.notify();
      return result;
    });
  },
);
```

**Vue2 响应式的局限性：**

1. **无法监听对象新增/删除的属性**：需使用 `Vue.set(obj, key, val)` 或 `this.$set`
2. **无法监听通过索引直接修改数组项**：需用 `Vue.set(arr, index, val)` 或 `arr.splice(index, 1, val)`
3. **无法监听修改数组 length**
4. **初始化时必须递归遍历所有属性**，对象嵌套很深时有性能开销
5. **无法监听 Map/Set 等 ES6 数据结构**

### Vue3 响应式原理（Proxy）

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

### 常见面试题

**Q1: Vue2 为什么无法监听对象新增属性？如何解决？**

因为 Vue2 在初始化阶段通过 `defineProperty` 只对**已存在**的属性做了 getter/setter 转换。新增的属性没有被遍历到，自然没有被劫持。

解决方法：`Vue.set(object, key, value)` 或 `this.$set`，内部会调用 `defineReactive` 将新属性也变成响应式并触发 `ob.dep.notify()`。

**Q2: Vue3 reactive 和 ref 有什么区别？分别用在什么场景？**

| 特性           | reactive          | ref                                   |
| -------------- | ----------------- | ------------------------------------- |
| 适用类型       | 对象/数组/Map/Set | 原始值（string/number/boolean）+ 对象 |
| 访问方式       | 直接访问属性      | `.value`                              |
| 底层实现       | Proxy 代理        | class 的 getter/setter                |
| 解构后响应式   | 丢失              | 保留（因为是对象引用）                |
| 模板中自动解包 | 是                | 在模板和 reactive 中使用时自动解包    |

推荐：原始值用 `ref`，对象用 `reactive`；需要解构或在函数间传递的对象也用 `ref`。

**Q3: Vue2 的 Dep 和 Watcher 是什么关系？**

`Dep` 是被观察者（Observable），每个响应式属性持有一个 Dep 实例。`Watcher` 是观察者（Observer）。

- 当 Watcher 求值时（如渲染模板、计算 computed），会把自身放到 `Dep.target` 这个全局变量上
- 期间访问到的响应式属性触发 getter，调用 `dep.depend()` 将当前 Watcher 加入 `dep.subs`
- 当属性被修改时触发 setter，调用 `dep.notify()` 遍历 `subs` 通知所有 Watcher 更新

这是一个典型的**发布-订阅模式**，一对多关系：一个 Dep 可以被多个 Watcher 订阅，一个 Watcher 也可以订阅多个 Dep。

**Q4: Proxy 和 Object.defineProperty 的根本区别？**

- `defineProperty` 劫持的是**对象的属性**，必须预先知道属性名，且无法拦截新增/删除属性
- `Proxy` 劫持的是**整个对象**，可以拦截包括 `get/set/has/deleteProperty/ownKeys/...` 在内的 13 种操作
- Proxy 需要通过 `Reflect` 正确转发操作，保证 `this` 指向代理对象
- Proxy 不支持 IE，defineProperty 支持 IE9+

## 虚拟DOM与Diff算法

### 虚拟DOM是什么

虚拟 DOM（Virtual DOM）是用普通 JavaScript 对象描述真实 DOM 节点结构的一种抽象。Vue 中的 VNode 包含 `tag / data / children / text / elm / key` 等字段。

```js
// 简化版 VNode 结构
{
  tag: 'div',              // 标签名
  data: { class: 'box', on: { click: handler } },  // 属性、事件
  children: [VNode, ...],  // 子节点
  text: undefined,         // 文本节点才有值
  elm: divElement,         // 对应的真实 DOM 节点
  key: 'item-1'            // 唯一标识
}
```

**虚拟 DOM 的价值：**

1. **跨平台**：VNode 只是 JS 对象，可以渲染到浏览器 DOM、服务器、小程序、原生应用（Weex）等
2. **性能优化**：通过 diff 计算出最小修改量，减少直接操作真实 DOM 的次数
3. **声明式编程**：开发者只关心数据状态，不关心 DOM 操作细节

### Vue2 的 Diff 算法（双端对比）

Vue2 的 diff 是**同层比较**+**双指针**策略，时间复杂度 O(n)。

**四个指针**：`oldStartIdx`、`oldEndIdx`、`newStartIdx`、`newEndIdx`

**比较策略（依次尝试）：**

1. **oldStart vs newStart** → 相同则两个头指针都右移
2. **oldEnd vs newEnd** → 相同则两个尾指针都左移
3. **oldStart vs newEnd** → 相同则 oldStart 节点移到末尾，头指针右移尾指针左移
4. **oldEnd vs newStart** → 相同则 oldEnd 节点移到开头，尾指针左移头指针右移
5. 以上四种都不匹配 → 使用 `newStartVNode.key` 在旧列表中**查找**（建立一个 `key → index` 的 Map）
   - 找到：移动该节点到 newStart 位置
   - 未找到：创建一个新节点

**当 oldStartIdx > oldEndIdx** 说明新列表有剩余，批量插入；当 **newStartIdx > newEndIdx** 说明旧列表有剩余，批量删除。

**为什么需要 key？**

没有 key 时 Vue2 会走"就地复用"策略（in-place patch），直接复用相同位置的节点，只更新内容。这在列表项有状态（如 input 输入框、组件内部状态）时会导致状态错乱。key 让 diff 能精确识别节点身份，减少 DOM 移动/重建。

```
key 必须唯一、稳定，不能用数组 index（排序/插入时 index 会变化，等同于没 key）
```

### Vue3 的 Diff 优化

Vue3 在 Vue2 双端 diff 的基础上做了以下改进：

1. **预处理**：先从头尾两端同步比较**静态/相同**的节点，快速跳过无需处理的部分，缩小 diff 范围
2. **最长递增子序列（LIS）**：在需要移动节点时，先计算出最长递增子序列，子序列中的节点不需要移动，只移动其余节点，比 Vue2 减少了 DOM 移动次数
3. **静态提升（hoistStatic）**：编译时将不变的静态 VNode 提升到 render 函数外部，每次更新直接复用，避免重复创建
4. **PatchFlags 动态标记**：编译时给动态节点打上标记（如 `1: TEXT`、`2: CLASS`），diff 时只比较标记过的动态部分，跳过静态属性
5. **Block Tree**：将动态节点用 Block 组织，diff 时只遍历 Block 内部的动态节点，跳过大量静态层级

**LIS 核心思路（packages/runtime-core/src/renderers.ts）：**

```js
// 得到 newIndexToOldIndexMap（新序列每个位置对应旧序列的索引+1，0 表示新增）
// 例如：[2, 3, 1, 4] → LIS 是 [0, 1, 3]（即 indices 0,1,3 位置无需移动）
function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    ...
  }
  // 回溯得到完整 LIS
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
```

### 常见面试题

**Q1: 虚拟 DOM 一定比直接操作真实 DOM 快吗？**

不一定。虚拟 DOM 的开销 = diff 计算 + 最小化的真实 DOM 操作。

- 首次渲染：虚拟 DOM 反而更慢（需要额外创建 VNode 树再 patch）
- 小范围更新：直接操作 `document.getElementById('x').innerText = 'a'` 可能更快
- 复杂场景大量 DOM 更新：虚拟 DOM 通过批量更新和 diff 减少回流重绘，优势明显

结论：虚拟 DOM 最大价值是**跨平台 + 声明式编程 + 优化心智负担**，性能是附带的好处，且在复杂场景下才有优势。

**Q2: Vue2 和 Vue3 diff 最大的区别是什么？**

- Vue2：双端对比，策略较简单，最差情况下有较多 DOM 移动
- Vue3：① 头尾预处理快速收敛 ② 用 LIS 算法找出无需移动的最长序列，DOM 移动次数最少 ③ 编译期优化（PatchFlags、Block Tree、静态提升）大幅减少运行时 diff 工作量

**Q3: key 用 index 会有什么问题？举一个场景。**

场景：一个列表 `[A, B, C]` 渲染 3 个带 input 的组件，用户在 A 的 input 输入"hello"。

- 如果用 index 做 key，然后在头部插入新项 `Z`，新列表为 `[Z, A, B, C]`
- 此时 index 对应的 key 变为：Z→0, A→1, B→2, C→3
- Diff 时发现 key=0 的节点从 A 变成了 Z，key=1 的节点从 B 变成了 A，依此类推
- Vue 会**复用**原来 key=0 的 DOM（即 A 的那个节点），只更新内容为 Z
- 结果：input 里的"hello"仍然出现在 Z 对应位置，发生状态错乱

正确做法：使用业务唯一 id 作为 key。

## 生命周期

### Vue2 生命周期选项式

```
beforeCreate  → 实例初始化，props & methods 就绪前，无法访问 this.data
created       → data/methods/computed 都已就绪，可以访问 this，但未挂载 DOM
beforeMount   → 模板编译完成，即将挂载，render 函数首次调用前
mounted       → DOM 已挂载到页面，$el 可用，可以操作 DOM（但不能保证所有子组件都挂载完毕）
beforeUpdate  → 数据变化后，DOM 更新前（适合获取更新前的 DOM 状态）
updated       → DOM 已更新（避免在 updated 中修改数据，可能导致死循环）
beforeDestroy → 实例销毁前，仍然可以访问 this，适合清除定时器、取消订阅
destroyed     → 实例已销毁，所有 watcher 被移除，事件监听器被移除

activated     → keep-alive 包裹的组件激活时
deactivated   → keep-alive 包裹的组件失活时
errorCaptured → 捕获子孙组件错误（Vue2.5+）
```

### Vue3 生命周期（Composition API）

Vue3 生命周期以 `onXxx` 钩子形式存在，必须在 `setup()` 顶层（或其他 `<script setup>` 同步作用域）调用。

| Vue2 选项式   | Vue3 Composition API | 说明                                 |
| ------------- | -------------------- | ------------------------------------ |
| beforeCreate  | —                    | 直接写在 setup() 顶部即可            |
| created       | —                    | 直接写在 setup() 顶部即可            |
| beforeMount   | onBeforeMount        | 挂载前                               |
| mounted       | onMounted            | 挂载后                               |
| beforeUpdate  | onBeforeUpdate       | 更新前                               |
| updated       | onUpdated            | 更新后                               |
| beforeDestroy | onBeforeUnmount      | 销毁前                               |
| destroyed     | onUnmounted          | 销毁后                               |
| activated     | onActivated          |                                      |
| deactivated   | onDeactivated        |                                      |
| errorCaptured | onErrorCaptured      |                                      |
| —             | onRenderTracked      | 依赖被追踪时（开发调试用）           |
| —             | onRenderTriggered    | 依赖变更触发重新渲染时（开发调试用） |

**父子组件生命周期执行顺序：**

```
挂载阶段：
父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted

更新阶段（父数据变化）：
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated

销毁阶段：
父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted
```

## Vue2 和 Vue3 的核心差异

### 响应式系统改造

- Vue2：`Object.defineProperty` + 递归遍历所有属性
- Vue3：`Proxy` + 惰性代理 + `WeakMap` 存储依赖

### API 风格

| 维度            | Vue2（Options API）                                    | Vue3（Composition API）                  |
| --------------- | ------------------------------------------------------ | ---------------------------------------- |
| 组织代码        | 按选项（data/methods/computed/watch）组织              | 按**逻辑关注点**组织                     |
| 逻辑复用        | mixin（易命名冲突、来源不明）                          | 组合式函数（显式引用、类型友好）         |
| this 依赖       | 所有选项都依赖 this                                    | 不需要 this                              |
| Tree-shaking    | 差（Vue 构造函数挂载所有 API）                         | 好（按需 import，未使用的 API 会被摇掉） |
| TypeScript 支持 | 需要 vue-class-component / vue-property-decorator 辅助 | 原生用 TS 编写，类型推断完美             |

**Options API 与 Composition API 的代码组织对比：**

```js
// Vue2 Options API：相关逻辑分散在 data/methods/computed/watch 各处
export default {
  data() { return { keyword: '', list: [] } },
  computed: { filteredList() { ... } },
  methods: { search() { ... }, loadMore() { ... } },
  watch: { keyword() { ... } },
  mounted() { ... }
}

// Vue3 Composition API：相关逻辑聚合在一起
function useSearch() {
  const keyword = ref('')
  const list = ref([])
  const filteredList = computed(() => ...)
  function search() { ... }
  watch(keyword, () => ...)
  onMounted(() => ...)
  return { keyword, list, filteredList, search }
}
```

### 编译优化

Vue3 编译器做了大量静态分析，生成更高效的渲染函数：

```html
<div>
  <span>静态文本</span>
  <span>{{ msg }}</span>
</div>
```

```js
// Vue2：每次更新都要整棵 VNode 树重新创建+diff
render(h) {
  return h('div', [
    h('span', '静态文本'),
    h('span', this.msg)
  ])
}

// Vue3：静态提升 + PatchFlags
const _hoisted_1 = createVNode('span', null, '静态文本', -1 /* HOISTED */)
render(_ctx, _cache) {
  return openBlock(), createBlock('div', null, [
    _hoisted_1,
    createVNode('span', null, _ctx.msg, 1 /* TEXT */)  // 标记只需要比较文本
  ])
}
```

### Fragments / Teleport / Suspense

- **Fragments**：Vue3 组件模板支持多根节点（Vue2 必须有唯一根节点）
- **Teleport**：将子组件内容"传送"到 DOM 中指定位置（如 modal 传送到 body），解决弹窗/tooltip 的 z-index 和样式继承问题
- **Suspense**：原生支持异步组件的加载状态，内置 loading / fallback 机制

### 其他变化

- 根实例挂载方式：`new Vue({ el: '#app' })` → `createApp(App).mount('#app')`
- 全局 API：`Vue.component / Vue.directive / Vue.mixin / Vue.prototype` → `app.component / app.directive / app.mixin / app.config.globalProperties`
- v-model 语法：Vue2 只能一个，Vue3 支持多个，`v-model:title="x"` 支持参数
- 移除 `$children`、`$listeners`、`$on/$off/$once`
- 移除 inline-template、filters 过滤器

## 组合式 API（Composition API）

### setup 函数

Vue3 的核心入口，在 `beforeCreate` 之前执行，此时组件实例尚未创建，**不能访问 this**。

```js
// 基本用法
export default {
  props: { id: String },
  setup(props, { slots, attrs, emit, expose }) {
    // props 是响应式对象，但不能解构（会丢失响应式）
    // slots = 插槽函数集合
    // attrs = 透传的非响应式属性（类似 $attrs）
    // emit = 触发事件（类似 $emit）
    // expose = 暴露给父组件通过 ref 访问的内容

    const count = ref(0)
    const inc = () => count.value++

    // return 的对象在模板中可直接使用
    return { count, inc }
  }
}

// 推荐：<script setup> 语法糖，自动 return 顶层声明的变量/函数
<script setup>
const props = defineProps({ id: String })
const emit = defineEmits(['change'])
const count = ref(0)
const inc = () => count.value++
</script>
```

### 核心响应式 API

| API                                         | 说明                                           |
| ------------------------------------------- | ---------------------------------------------- |
| `ref(value)`                                | 原始值/对象都可用，访问需 `.value`             |
| `reactive(obj)`                             | 只接受对象，深层响应式，直接访问属性           |
| `readonly(obj)`                             | 返回只读代理                                   |
| `shallowRef / shallowReactive`              | 浅层响应式（只有第一层变了才触发更新）         |
| `toRef(obj, key)`                           | 从对象属性创建 ref，保持与原对象的响应式连接   |
| `toRefs(obj)`                               | 将 reactive 对象的所有属性都转成 ref，用于解构 |
| `isRef / isReactive / isReadonly / isProxy` | 类型判断                                       |
| `unref(x)`                                  | 等同于 `isRef(x) ? x.value : x`                |

### computed / watch / watchEffect

```js
// computed：依赖变化才重新计算，有缓存
const fullName = computed({
  get: () => firstName.value + ' ' + lastName.value,
  set: (val) => { [firstName.value, lastName.value] = val.split(' ') }
})

// watch：显式声明依赖，惰性（不会立即执行）
watch(
  () => user.age,
  (newAge, oldAge) => { ... },
  { immediate: true, deep: true }
)
// 支持同时监听多个源
watch([a, () => b.value], ([na, nb], [oa, ob]) => ...)

// watchEffect：自动追踪依赖，立即执行一次
const stop = watchEffect(() => {
  console.log(count.value)  // 自动收集 count 为依赖
})
stop()  // 可以手动停止
```

### 自定义组合式函数（Composables）

Vue2 中用 mixin 做逻辑复用，问题很多。Vue3 推荐用自定义 hook（组合式函数）：

```js
// useCounter.js —— 一个简单的计数器逻辑
export function useCounter(initial = 0) {
  const count = ref(initial)
  const inc = () => count.value++
  const dec = () => count.value--
  const reset = () => count.value = initial
  return { count, inc, dec, reset }
}

// useMouse.js —— 鼠标位置追踪
export function useMouse() {
  const x = ref(0), y = ref(0)
  const update = e => { x.value = e.clientX; y.value = e.clientY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}

// 组件中使用 —— 清晰，来源可追溯，无命名冲突
<script setup>
const { count, inc } = useCounter(10)
const { x, y } = useMouse()
</script>
```

## 组件通信方式

### Vue2 方式汇总

| 方式                       | 场景                                       | 示例                                     |
| -------------------------- | ------------------------------------------ | ---------------------------------------- |
| props / $emit              | 父子                                       | `:msg="x"` `@click="emit('foo')"`        |
| `$parent / $children`      | 父子                                       | 直接访问实例（不推荐，紧耦合）           |
| `$attrs / $listeners`      | 多层透传                                   | v-bind="$attrs" v-on="$listeners"        |
| ref / $refs                | 父子                                       | 拿到子组件实例调用方法                   |
| provide / inject           | 跨层级祖先 → 后代（Vue2.2+，默认非响应式） |                                          |
| EventBus（$on/$emit/$off） | 任意组件                                   | 全局 `new Vue()` 做事件中心（Vue3 移除） |
| Vuex                       | 全局状态管理                               |                                          |

### Vue3 方式汇总

| 方式                                      | 场景             |
| ----------------------------------------- | ---------------- |
| props / emit（defineProps / defineEmits） | 父子             |
| provide / inject（原生响应式：传递 ref）  | 跨层级           |
| v-model（支持参数，如 `v-model:visible`） | 父子双向绑定     |
| ref + defineExpose                        | 父访问子实例     |
| $attrs（$listeners 合并进 $attrs）        | 透传             |
| Pinia / Vuex                              | 全局状态         |
| mitt（三方事件库）                        | 任意组件事件总线 |

**provide/inject 深度用法（传递响应式数据）：**

```js
// 祖先组件
const theme = ref("dark");
provide("theme", theme); // 传 ref，后代修改会响应
provide("setTheme", (v) => (theme.value = v)); // 传方法让后代调用

// 后代组件
const theme = inject("theme"); // 直接拿到 ref，模板自动解包
const setTheme = inject("setTheme");
```

## Computed & Watch 实现原理

### computed 原理

computed 本质是一个带缓存的特殊 Watcher（Vue2）/ computed ref（Vue3）。

**Vue2 computed Watcher 的关键标志：**

```js
// src/core/observer/watcher.js
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.lazy = !!options.lazy; // computed 的 lazy = true
    this.dirty = this.lazy; // dirty 标记是否需要重新计算
    this.value = this.lazy ? undefined : this.get();
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } // 依赖变化时只标记为 dirty，不立即计算
    else this.run();
  }
}
```

特点：

- **惰性求值**：创建时不立即执行，第一次访问才计算
- **缓存**：依赖不变时，多次访问都返回缓存的 `this.value`
- **依赖变化**：不立即重新计算，只将 `dirty` 设为 `true`，下次访问时才重算

**Vue3 computed 实现（packages/reactivity/src/computed.ts）：**

```js
class ComputedRefImpl {
  public _dirty = true
  public dep = new Dep()
  constructor(getter, setter) {
    this._effect = new ReactiveEffect(getter, () => {
      // 调度器：依赖变化时，将 dirty 设为 true，触发订阅者
      if (!this._dirty) { this._dirty = true; triggerRef(this) }
    })
  }
  get value() {
    if (this._dirty) {
      this._value = this._effect.run()
      this._dirty = false
    }
    trackRef(this)
    return this._value
  }
}
```

### watch 原理

watch 本质是一个普通 Watcher（Vue2）或 effect（Vue3），不关心返回值，只关心副作用。

- **用户传入 getter（或响应式源）**：用于依赖收集
- **用户传入 callback**：依赖变化后异步（默认放入 nextTick 队列）执行
- **deep: true**：内部递归遍历被监听对象的所有属性，触发 getter 收集深层依赖

### computed vs watch vs methods

| 特性         | computed                     | watch                                    | methods                  |
| ------------ | ---------------------------- | ---------------------------------------- | ------------------------ |
| 是否缓存     | 有缓存，依赖不变不重算       | 无缓存                                   | 无缓存，每次调用都执行   |
| 是否惰性     | 是，首次访问才计算           | 默认是（immediate: false）               | 调用才执行               |
| 必须有返回值 | 是（用于模板/其他 computed） | 否，只执行副作用                         | 可选                     |
| 适用场景     | 派生值、模板依赖的计算属性   | 数据变化后执行异步操作（请求、DOM 操作） | 事件处理、主动调用的逻辑 |

## nextTick 原理

### 为什么需要 nextTick

Vue 是**异步更新 DOM** 的。当你修改响应式数据，不会立刻同步更新 DOM，而是把这个 watcher 推入一个更新队列，在下一个 tick（微任务阶段）才批量执行。这意味着修改数据后立即通过 `$el.textContent` 拿到的还是旧值。

`nextTick` 就是在 DOM 更新之后执行你的回调。

### Vue2 nextTick 实现（src/core/util/next-tick.js）

Vue2 做了多轮降级策略，兼容不同浏览器的微任务/宏任务支持：

```js
// 优先级：Promise → MutationObserver → setImmediate → setTimeout
let timerFunc;
if (typeof Promise !== "undefined") {
  timerFunc = () => Promise.resolve().then(flushCallbacks);
} else if (typeof MutationObserver !== "undefined") {
  const counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    textNode.data = String((counter + 1) % 2);
  };
} else if (typeof setImmediate !== "undefined") {
  timerFunc = () => setImmediate(flushCallbacks);
} else {
  timerFunc = () => setTimeout(flushCallbacks, 0);
}

// callbacks 数组收集所有回调，批量执行
const callbacks = [];
let pending = false;
export function nextTick(cb, ctx) {
  callbacks.push(() => cb.call(ctx));
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) copies[i]();
}
```

### Vue3 nextTick 简化

Vue3 只使用 `Promise.resolve().then()`，不再做降级（因为 Vue3 不支持 IE）：

```js
// packages/runtime-core/src/scheduler.ts
const resolvedPromise = Promise.resolve();
export function nextTick(fn) {
  return fn ? resolvedPromise.then(fn) : resolvedPromise;
}
```

### 常见面试题

**Q1: 为什么要异步批量更新？**

- **性能**：一次 tick 中同一 watcher 被多次触发只执行一次（队列去重），避免频繁 DOM 操作
- **一致性**：避免在 watcher 执行过程中数据又被其他 watcher 修改导致中间状态错乱

**Q2: 微任务和宏任务的执行顺序？**

事件循环中，每执行一个宏任务（script 整体、setTimeout、setInterval、setImmediate、I/O）后，清空所有微任务（Promise.then、MutationObserver、queueMicrotask），然后进入下一轮。

```js
console.log("script start"); // 1. 同步
setTimeout(() => console.log("setTimeout"), 0); // 4. 宏任务
Promise.resolve().then(() => console.log("promise")); // 3. 微任务
nextTick(() => console.log("nextTick")); // 2. 微任务（排在 promise 之后）
console.log("script end"); // 2. 同步
```

## 模板编译原理

### Vue2 编译三阶段

```
template 字符串
    ↓ parse（HTML 解析器）
AST（抽象语法树，带结构化信息）
    ↓ optimize（标记静态节点/静态根节点）
AST（带 static 标记）
    ↓ generate（生成 render 函数代码字符串）
render 函数（new Function(code) 执行）
```

**parse**：用正则 + 栈结构匹配 HTML 标签、属性、文本，构建 AST。

**optimize**：遍历 AST 标记 `static: true` 的节点（不包含任何动态绑定的节点），标记静态根节点。后续 diff 时整棵静态子树可直接跳过。

**generate**：将 AST 转为 `_c('div', {...}, [_v(msg)])` 这种调用字符串，其中 `_c = createElement, _v = createTextVNode`。

### Vue3 编译优化

Vue3 编译器在 generate 阶段做了革命性改进，核心是**编译时分析**：

```
template
    ↓ parse（PEG 语法分析器，较 Vue2 更严谨）
AST
    ↓ transform（遍历 AST，应用各种 transforms）
- hoistStatic：静态节点提升到 render 外
- patchFlags：为动态节点/属性打上标记
- blockFlags：用 Block 包裹动态结构
- cacheHandlers：事件处理函数缓存
    ↓ generate
带优化标记的 render 函数（Block、PatchFlags、hoisted）
```

**PatchFlags 标记示例：**

```
1  TEXT         节点只有动态文本
2  CLASS        节点只有动态 class
4  STYLE        节点只有动态 style
8  PROPS        有动态属性
16 FULL_PROPS   有动态 key（如 v-bind:[foo]）
32 HYDRATE_EVENTS  ...
-1 BAIL         全量 diff
```

## Keep-Alive 原理

### 核心作用

将包裹的组件**缓存而不是销毁**，切换时保留组件状态（如滚动位置、已输入内容），避免重复创建组件实例。

### Vue2 实现要点（src/core/components/keep-alive.js）

```js
export default {
  name: "keep-alive",
  abstract: true, // 抽象组件，不渲染真实节点
  props: { include, exclude, max },
  created() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroyed() {
    for (const key in this.cache) this.cache[key].$destroy(); // 自身销毁时清空缓存
  },
  render() {
    const vnode = getFirstComponentChild(this.$slots.default);
    const key =
      vnode.key == null ? componentOptions.Ctor.cid + "::" + tag : vnode.key;

    if (this.cache[key]) {
      vnode.componentInstance = this.cache[key].componentInstance; // 复用实例
      this.keys.splice(this.keys.indexOf(key), 1); // LRU：移到尾部
      this.keys.push(key);
    } else {
      this.cache[key] = vnode;
      this.keys.push(key);
      if (this.max && this.keys.length > parseInt(this.max)) {
        pruneCacheEntry(this.cache, this.keys[0], this.keys, this._vnode); // LRU：淘汰最久未用
      }
    }
    vnode.data.keepAlive = true; // 标记
    return vnode;
  },
};
```

被 keep-alive 包裹的组件不会触发 `beforeDestroy`/`destroyed`，而是触发 `activated`/`deactivated`。首次挂载走正常流程，后续切换时：patch → `componentInstance` 直接复用 → `deactivated`/`activated` 钩子。

### Vue3 变化

- 抽象组件实现方式调整（composition-based）
- 支持 `suspense` 和 `teleport`
- `include/exclude` 支持字符串、数组、正则、函数
- LRU 策略与 Vue2 一致

## 渲染流程概览

### Vue2 渲染全流程

```
new Vue(options)
    ↓ _init
初始化 props/data/methods/computed/watch + Observer 响应式
    ↓ $mount
    ↓ compileToFunctions （有 template 时走编译）
得到 render 函数
    ↓ render() → VNode
期间访问响应式数据触发 getter，收集渲染 Watcher 依赖
    ↓ createElm(vnode)
递归创建真实 DOM
    ↓ patch(oldVnode, vnode)
首次挂载：整棵插入；更新：diff 比较最小修改
    ↓ insert → mounted
    ↓ 数据变化 → setter → dep.notify → Watcher 入队列
    ↓ nextTick 时 flushSchedulerQueue → 重新 render + patch
```

### Vue3 渲染全流程

```
createApp(App).mount('#app')
    ↓ createComponentInstance
创建组件实例 instance (type/props/slots/ctx/proxy...)
    ↓ setupComponent
初始化 props/slots，执行 setup()
    ↓ setupRenderEffect
创建 effect（类似 Vue2 渲染 Watcher）
    ↓ instance.render() → VNode tree
    ↓ patch(n1, n2, container)
递归 patch 各节点（Element / Component / Text / Comment / Fragment / Teleport / Suspense）
    ↓ 响应式数据变化 → trigger → effect scheduler → queueJob
    ↓ nextTick flushJobs → 重新 render + patch
```

### 关键差异

- Vue2 渲染 Watcher 与组件实例强绑定；Vue3 使用独立的 `ReactiveEffect`，职责更单一
- Vue3 编译期优化使 render 产物更高效，patch 跳过静态节点
- Vue3 的 patch 支持更多节点类型（Fragment、Teleport、Suspense 等）

## 源码学习建议

1. **Vue2 源码阅读路径（推荐从 src/core 入手）：**
   - `instance/index.js` → `instance/init.js`（实例初始化）
   - `observer/index.js` → `observer/dep.js` → `observer/watcher.js`（响应式核心）
   - `vdom/vnode.js` → `vdom/patch.js`（虚拟 DOM & diff）
   - `compiler/parser/index.js` → `compiler/codegen/index.js`（模板编译）
   - `util/next-tick.js`（异步更新）

2. **Vue3 源码阅读路径（packages/ 下按需阅读）：**
   - `reactivity/`：响应式系统（独立可用，推荐先看）
   - `runtime-core/`：组件系统 / VNode / patch / scheduler
   - `runtime-dom/`：DOM 相关 patch、事件、属性处理
   - `compiler-core/`：模板 parse / transform / generate
   - `compiler-dom/`：浏览器特定编译优化
   - `compiler-sfc/`：单文件组件解析
