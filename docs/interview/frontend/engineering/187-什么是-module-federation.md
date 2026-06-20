---
title: "什么是 Module Federation？适用场景？"
---

# 什么是 Module Federation？适用场景？

**回答要点**：

Module Federation 是 Webpack 5 内置的能力，允许多个**独立构建的应用**在运行时互相暴露/消费模块。

**典型场景**：微前端宿主应用消费子应用的组件；团队 A 负责搜索组件，团队 B 负责商品列表组件，两个团队独立发布，但在同一个页面里组合使用。

**关键概念**：

- **Host / Remote**：消费方是 Host，提供模块的一方是 Remote。
- **`exposes`**：一个应用声明自己要分享的模块。
- **`remotes`**：一个应用声明它要使用的远程模块。
- **`shared`**：共享依赖（React、Vue、lodash 等），避免多个应用各带一份。

**配置示例**（Remote）：

```js
// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "searchApp",
      filename: "remoteEntry.js", // 其他应用要加载这个文件
      exposes: { "./SearchBar": "./src/SearchBar" },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
```

**Host**：

```js
plugins: [
  new ModuleFederationPlugin({
    name: 'shell',
    remotes: { searchApp: 'searchApp@http://localhost:3001/remoteEntry.js' },
    shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
  }),
],
```

```jsx
// host 应用内消费
const SearchBar = React.lazy(() => import("searchApp/SearchBar"));
```

**注意**：Shared 依赖需要版本兼容；多个应用的 React 必须是同一份（singleton: true）否则会出错。
