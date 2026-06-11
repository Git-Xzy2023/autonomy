---
title: "Vue3 编译优化"
---

# Vue3 编译优化

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
