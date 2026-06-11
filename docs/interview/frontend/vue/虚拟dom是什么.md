---
title: "虚拟DOM是什么"
---

# 虚拟DOM是什么

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
