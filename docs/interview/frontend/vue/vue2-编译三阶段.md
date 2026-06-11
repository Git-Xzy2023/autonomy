---
title: "Vue2 编译三阶段"
---

# Vue2 编译三阶段

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
