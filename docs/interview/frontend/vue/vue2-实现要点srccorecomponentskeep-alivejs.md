---
title: "Vue2 实现要点（src/core/components/keep-alive.js）"
---

# Vue2 实现要点（src/core/components/keep-alive.js）

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
