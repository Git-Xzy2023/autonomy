---
title: Vue 源码学习指南
---

# Vue 源码学习指南

> 阅读源码是深入理解 Vue 的最佳方式。本章梳理 Vue 2 与 Vue 3 的源码结构、核心模块、阅读路线与重要原理剖析，帮助你有目的地阅读源码。

---

## 一、为什么要读源码

### 1.1 阅读源码的价值

- 🎯 **理解原理**：知道为什么这样设计，而不是怎么用
- 🐛 **排查问题**：遇到诡异 bug 能快速定位
- 📚 **学习架构**：代码组织、模块划分、设计模式
- 💼 **面试加分**：源码是高级前端的分水岭
- 🛠️ **借鉴实现**：自己写框架/库时借鉴优秀实践

### 1.2 阅读源码的误区

- ❌ 一上来从第一行开始通读
- ❌ 不带问题地读
- ❌ 不动手调试
- ❌ 读完不总结

### 1.3 推荐阅读方式

1. **带着问题读**：例如"computed 是怎么缓存的？"
2. **先主流程再细节**：先理解骨架，再深入分支
3. **配合调试**：用断点观察执行顺序
4. **做笔记**：画时序图、数据流图
5. **写 Demo 验证**：读一段写一个测试

---

## 二、Vue 2 源码结构

### 2.1 仓库与版本

- 仓库：https://github.com/vuejs/vue
- 推荐版本：v2.6.14（Vue 2 末代稳定版）
- 语言：Flow（TypeScript 的早期替代品，语法接近）

### 2.2 目录结构

```
src/
├── compiler/        # 模板编译器
│   ├── index.ts     # 入口
│   ├── parser/      # 模板 → AST
│   ├── optimizer/   # 静态节点标记
│   └── codegen/     # AST → 渲染函数字符串
│
├── core/            # 核心运行时
│   ├── instance/    # Vue 实例
│   │   ├── index.js     # 构造函数
│   │   ├── init.js      # _init
│   │   ├── lifecycle.js # 生命周期
│   │   ├── events.js    # 事件
│   │   ├── render.js    # 渲染函数
│   │   └── state.js     # data/computed/methods
│   │
│   ├── observer/    # 响应式核心
│   │   ├── index.js     # defineReactive
│   │   ├── array.js     # 数组方法重写
│   │   ├── dep.js       # Dep
│   │   └── watcher.js   # Watcher
│   │
│   ├── vdom/        # 虚拟 DOM
│   │   ├── patch.js     # diff 算法
│   │   ├── create-component.js
│   │   └── modules/     # DOM 操作模块
│   │
│   └── util/        # 工具
│
├── platforms/       # 平台入口
│   ├── web/         # 浏览器
│   └── weex/        # Weex（已废弃）
│
├── server/          # 服务端渲染
├── sfc/             # 单文件组件
└── shared/          # 共享工具
```

### 2.3 核心模块阅读顺序

```
1. core/instance/index.js
   ↓ new Vue() 做了什么
2. core/instance/init.js
   ↓ _init 流程
3. core/instance/state.js
   ↓ data/computed/methods 初始化
4. core/observer/index.js
   ↓ defineReactive 响应式
5. core/observer/dep.js + watcher.js
   ↓ 依赖收集与触发
6. core/instance/lifecycle.js
   ↓ 生命周期
7. core/instance/render.js
   ↓ 渲染函数
8. core/vdom/patch.js
   ↓ diff 算法
9. compiler/parser/
   ↓ 模板解析
10. compiler/codegen/
    ↓ 生成渲染函数
```

---

## 三、Vue 2 核心原理

### 3.1 new Vue 做了什么

```js
// core/instance/index.js
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);          // _init
stateMixin(Vue);         // $data/$props/$set/$delete
eventsMixin(Vue);        // $on/$emit/$off
lifecycleMixin(Vue);     // _update/$forceUpdate/$destroy
renderMixin(Vue);        // _render

export default Vue;
```

### 3.2 _init 流程

```js
// core/instance/init.js
Vue.prototype._init = function (options) {
  const vm = this;

  vm.$options = mergeOptions(...);

  initLifecycle(vm);      // $parent/$children/$root
  initEvents(vm);         // _events
  initRender(vm);         // $slots/$createElement
  callHook(vm, 'beforeCreate');
  initInjections(vm);    // inject
  initState(vm);          // ★ 核心：data/methods/computed/watch
  initProvide(vm);        // provide
  callHook(vm, 'created');

  if (vm.$options.el) {
    vm.$mount(vm.$options.el);  // 挂载
  }
};
```

### 3.3 响应式核心：defineReactive

```js
// core/observer/index.js
function defineReactive(obj, key, val, shallow = false) {
  const dep = new Dep(); // 每个属性一个 Dep
  let childOb = !shallow && observe(val); // 递归代理子对象

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();           // 收集 Watcher
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) dependArray(value);
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (newVal === value) return;
      val = newVal;
      childOb = !shallow && observe(newVal); // 新值也要代理
      dep.notify(); // 通知 Watcher
    },
  });
}
```

### 3.4 Watcher 与 Dep

```
Dep.target（全局）
    ↓
响应式属性 get 时
    ↓ dep.depend()
    ↓ watcher.addDep(dep)
    ↓ dep.addSub(watcher)
    ↓
属性 set 时
    ↓ dep.notify()
    ↓ watcher.update()
    ↓ queueWatcher(this)
    ↓ nextTick → flushSchedulerQueue
    ↓ watcher.run() → cb()
```

### 3.5 视图更新流程

```
data 变化
   ↓ setter
   ↓ dep.notify()
   ↓ watcher.update() (render watcher)
   ↓ queueWatcher → nextTick(flushSchedulerQueue)
   ↓ watcher.run()
   ↓ vm._update(vm._render())
   ↓ vm.__patch__(prevVnode, vnode)
   ↓ diff → 真实 DOM 更新
```

### 3.6 diff 算法

```js
// core/vdom/patch.js
function patchVnode(oldVnode, vnode) {
  if (oldVnode === vnode) return;

  // 文本节点
  if (isUndef(vnode.text)) {
    // 子节点 diff
    const oldCh = oldVnode.children;
    const newCh = vnode.children;
    if (isDef(oldCh) && isDef(newCh)) {
      updateChildren(oldCh, newCh); // 双端对比
    } else if (isDef(newCh)) {
      addVnodes(oldVnode, newCh);
    } else if (isDef(oldCh)) {
      removeVnodes(oldCh);
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  }
}

// 双端 diff
function updateChildren(oldCh, newCh) {
  let oldStart = 0, oldEnd = oldCh.length - 1;
  let newStart = 0, newEnd = newCh.length - 1;

  while (oldStart <= oldEnd && newStart <= newEnd) {
    if (isSameVnode(oldStart, newStart)) {
      patchVnode(oldCh[oldStart++], newCh[newStart++]);
    } else if (isSameVnode(oldEnd, newEnd)) {
      patchVnode(oldCh[oldEnd--], newCh[newEnd--]);
    } else if (isSameVnode(oldStart, newEnd)) {
      patchVnode(oldCh[oldStart++], newCh[newEnd--]);
    } else if (isSameVnode(oldEnd, newStart)) {
      patchVnode(oldCh[oldEnd--], newCh[newStart++]);
    } else {
      // key 索引表查找
      // ...
    }
  }
}
```

### 3.7 模板编译

```
<template>
  <div>{{ msg }}</div>
</template>
       ↓ parse (parser/index.js)
   AST
   {
     type: 1,
     tag: 'div',
     children: [{ type: 2, expression: '_s(msg)', text: '{{msg}}' }]
   }
       ↓ optimize (optimizer/index.js)
   标记静态节点
       ↓ generate (codegen/index.js)
   渲染函数字符串
   "with(this){return _c('div',[_v(_s(msg))])}"
```

---

## 四、Vue 3 源码结构

### 4.1 仓库与版本

- 仓库：https://github.com/vuejs/core
- 推荐版本：v3.4.x
- 语言：TypeScript（一等公民）
- 包管理：pnpm + monorepo

### 4.2 Monorepo 结构

```
packages/
├── compiler-core/         # 平台无关的编译器核心
├── compiler-dom/          # 浏览器平台的编译器
├── compiler-sfc/          # SFC 编译器（.vue 文件）
├── compiler-ssr/         # SSR 编译器
│
├── reactivity/           # ★ 响应式系统（独立包）
│   ├── src/
│   │   ├── reactive.ts   # reactive
│   │   ├── ref.ts        # ref
│   │   ├── effect.ts     # effect / scheduler
│   │   ├── computed.ts   # computed
│   │   ├── dep.ts        # Dep（3.4 用 Signal 替代）
│   │   └── collections.ts # Map/Set
│   └── package.json
│
├── runtime-core/         # 平台无关运行时
├── runtime-dom/          # 浏览器运行时
├── server-renderer/      # SSR
├── shared/               # 共享工具
└── vue/                  # 完整包（整合上述）
```

### 4.3 推荐阅读顺序

```
1. packages/reactivity/src/ref.ts
   ↓ 最简单的响应式单元
2. packages/reactivity/src/reactive.ts
   ↓ Proxy 响应式
3. packages/reactivity/src/effect.ts
   ↓ 副作用与调度
4. packages/reactivity/src/computed.ts
   ↓ computed 的懒求值
5. packages/runtime-core/src/apiCreateApp.ts
   ↓ createApp
6. packages/runtime-core/src/renderer.ts
   ↓ 渲染与 patch
7. packages/runtime-core/src/componentOptions.ts
   ↓ 组件实例
8. packages/compiler-core/src/parse.ts
   ↓ 模板解析
9. packages/compiler-core/src/codegen/index.ts
   ↓ 代码生成
10. packages/compiler-sfc/
    ↓ 单文件组件编译
```

---

## 五、Vue 3 核心原理

### 5.1 createApp

```ts
// runtime-core/src/apiCreateApp.ts
function createAppAPI(render, hydrate) {
  return function createApp(rootComponent, rootProps) {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      use() { /* ... */ return app; },
      mixin() { /* ... */ return app; },
      component() { /* ... */ return app; },
      directive() { /* ... */ return app; },
      mount(rootContainer) {
        const vnode = createVNode(rootComponent, rootProps);
        render(vnode, rootContainer);
        app._container = rootContainer;
        return vnode.component.proxy;
      },
    };
    return app;
  };
}
```

### 5.2 组件挂载流程

```
createApp(App).mount('#app')
   ↓
   ↓ render(vnode, container)
   ↓
   ↓ patch(null, vnode, container)
   ↓
   ↓ processComponent(null, vnode)
   ↓
   ↓ mountComponent(vnode, container)
   ↓
   ↓ createComponentInstance(vnode)
   ↓ setupComponent(instance)  ★ 执行 setup
   ↓ setupRenderEffect(instance) ★ 创建响应式 effect
   ↓
   ↓ effect(() => {
   ↓   const subTree = instance.render()  // 调用 render 生成 VNode
   ↓   patch(null, subTree, container)    // 递归挂载子节点
   ↓ })
```

### 5.3 reactive 实现（简化）

```ts
// reactivity/src/reactive.ts
function reactive(target) {
  // 已代理过则返回缓存
  if (target[ReactiveFlags.IS_REACTIVE]) return target;

  return new Proxy(target, mutableHandlers);
}

const mutableHandlers = {
  get: createGetter(),
  set: createSetter(),
  deleteProperty,
  has,
  ownKeys,
};

function createGetter() {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    const res = Reflect.get(target, key, receiver);

    // 不追踪内置 symbol
    if (isSymbol(key) && builtInSymbols.has(key)) return res;

    // 依赖收集
    track(target, 'get', key);

    // 懒代理：对象才递归
    if (isObject(res)) {
      return reactive(res);
    }

    return res;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    const hadKey = isArray(target) && isIntegerKey(key)
      ? Number(key) < target.length
      : hasOwn(target, key);

    const result = Reflect.set(target, key, value, receiver);

    if (!hadKey) {
      trigger(target, 'add', key, value); // 新增
    } else if (hasChanged(value, oldValue)) {
      trigger(target, 'set', key, value, oldValue); // 修改
    }

    return result;
  };
}
```

### 5.4 track 与 trigger

```ts
// reactivity/src/effect.ts
const targetMap = new WeakMap();

function track(target, type, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
}

function trigger(target, type, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const deps = [];

  // 收集要触发的 dep
  if (type === 'set') {
    deps.push(depsMap.get(key));
  } else if (type === 'add') {
    deps.push(depsMap.get(key));
    if (isArray(target)) {
      deps.push(depsMap.get('length')); // 数组 length 也要触发
    }
  }

  for (const dep of deps) {
    if (dep) {
      for (const effect of dep) {
        if (effect.scheduler) {
          effect.scheduler(); // 调度执行
        } else {
          effect.run(); // 直接执行
        }
      }
    }
  }
}
```

### 5.5 Vue 3.4+ 的响应式重构

Vue 3.4 用 `Dep` 类替代了原先的 `Set<ReactiveEffect>`，引入了类似 Signal 的机制：

```ts
// Vue 3.4+ 简化
class Dep {
  version = 0;
  subscribers = new Set<ReactiveEffect>();

  depend() {
    if (activeSub) {
      this.subscribers.add(activeSub);
      activeSub.deps.add(this);
    }
  }

  notify() {
    this.version++;
    for (const sub of this.subscribers) {
      sub.scheduler?.();
    }
  }
}

class ReactiveEffect {
  deps = new Set<Dep>();
  version = 0;

  run() {
    // 检查依赖版本
    if (this.version === this.computeVersion()) return;
    this.version = this.computeVersion();
    // ...
  }
}
```

### 5.6 编译器流程

```
.vue 文件
   ↓ @vue/compiler-sfc parse
   { descriptor: { template, script, style } }
   ↓
   ↓ template 内容
   ↓ @vue/compiler-dom compile
   ↓
   ↓ 1. parse（parse.ts）
   ↓    模板字符串 → AST
   ↓
   ↓ 2. transform（transform.ts）
   ↓    - 静态提升
   ↓    - PatchFlag 标记
   ↓    - 指令转换（v-if/v-for/v-model）
   ↓    - 缓存事件处理
   ↓    - Block 收集
   ↓
   ↓ 3. generate（codegen/index.ts）
   ↓    AST → 渲染函数字符串
   ↓
   最终输出：
   import { createElementVNode as _createElementVNode, ... } from "vue"
   const _hoisted_1 = { class: "static" }
   export function render(_ctx, _cache) {
     return (_openBlock(), _createElementBlock("div", _hoisted_1, [
       _createElementVNode("p", null, _ctx.msg, 1 /* TEXT */)
     ]))
   }
```

---

## 六、调试源码

### 6.1 克隆并启动

```bash
git clone https://github.com/vuejs/core.git
cd core
pnpm install
pnpm dev  # 启动 watch 模式
```

### 6.2 调试方式

1. **断点调试**：在源码中打断点，用 Node 调试器或 Chrome DevTools

2. **在项目中替换**：用 `pnpm link` 将本地 vue 替换到项目中

3. **Sourcemap**：确保 sourcemap 开启

### 6.3 推荐调试场景

- `reactive(obj)`：观察 Proxy 拦截
- `effect(fn)`：观察依赖收集
- `vm.mount()`：观察挂载流程
- `data.count = 1`：观察触发更新流程

---

## 七、源码学习路线

### 7.1 Vue 2 源码路线

```
1. 入口 src/core/instance/index.js
2. _init 流程 src/core/instance/init.js
3. 响应式 src/core/observer/index.js + dep.js + watcher.js
4. 生命周期 src/core/instance/lifecycle.js
5. 渲染 src/core/instance/render.js + src/core/vdom/patch.js
6. 编译 src/compiler/
7. 进阶 src/core/global-api/
```

### 7.2 Vue 3 源码路线

```
1. 响应式独立包 packages/reactivity
   - ref.ts → reactive.ts → effect.ts → computed.ts
2. 运行时 packages/runtime-core
   - apiCreateApp.ts → renderer.ts → component.ts
3. 编译器 packages/compiler-core
   - parse.ts → transform.ts → codegen/index.ts
4. SFC packages/compiler-sfc
   - 解析 .vue 文件
5. 服务端渲染 packages/server-renderer
```

---

## 八、源码学习要点

### 8.1 Vue 2 重点

1. **observe**：defineReactive + 数组方法重写
2. **Watcher/Dep**：依赖收集的"发布订阅"
3. **Scheduler**：nextTick + 队列合并
4. **Patch**：双端 diff 算法
5. **Compiler**：AST → optimize → codegen

### 8.2 Vue 3 重点

1. **Proxy 替代 defineProperty**：懒代理、数组、Map/Set 全支持
2. **Block Tree + PatchFlag**：编译期优化
3. **effectScope**：作用域管理
4. **Suspense + Teleport**：新能力
5. **Tree Shaking**：按需引入

### 8.3 Vue 2 vs Vue 3 设计哲学

| 维度        | Vue 2                     | Vue 3                          |
| ----------- | ------------------------- | ------------------------------ |
| **响应式**  | Object.defineProperty     | Proxy                          |
| **编译**    | 运行时全量 diff            | 编译期优化 + Block Tree         |
| **API**     | Options API               | Composition API + Options      |
| **状态管理**| Vuex                      | Pinia                          |
| **架构**    | 单包                       | Monorepo                       |
| **类型**    | Flow                      | TypeScript 一等公民            |
| **Tree Shake** | 困难                   | 友好                            |

---

## 九、学习建议

1. **先跑起来**：把 Vue 源码 clone 下来跑通单元测试
2. **带问题读**：每次只解决一个疑问
3. **画图总结**：时序图、数据流图、依赖关系图
4. **对比版本**：Vue 2 → Vue 3 的演进能加深理解
5. **不要追求读全**：聚焦核心模块，边缘模块按需深入

---

## 参考

- [Vue 2 源码解析 - 深入响应式原理](https://v2.cn.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 源码解析 - 闪电图](https://vue-js.org/analysis/source/vue3.0/instance/)
- [Vue 3.4 响应式重构](https://github.com/vuejs/core/pull/5912)
