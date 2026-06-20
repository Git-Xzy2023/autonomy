---
title: "ESLint 怎么写自定义规则？"
---

# ESLint 怎么写自定义规则？

**核心考察点**：是否理解 AST，是否真正把 lint 用到了团队规范里。

ESLint 规则就是一个导出 `create` 方法的对象，通过 AST visitor 工作：

```js
module.exports = {
  meta: {
    type: "suggestion",
    docs: { description: "禁止使用 console.log" },
    fixable: "code", // 这个规则能自动 fix
    schema: [],
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "console" &&
          node.property.type === "Identifier" &&
          node.property.name === "log"
        ) {
          context.report({
            node,
            message: "请使用 logger 而不是 console.log",
            fix: (fixer) => fixer.replaceText(node.property, "info"),
          });
        }
      },
    };
  },
};
```

可以用 [astexplorer.net](https://astexplorer.net) 观察你的代码对应什么 AST 结构。
