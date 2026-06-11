---
title: "computed 原理"
---

# computed 原理

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
