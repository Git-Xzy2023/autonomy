---
title: "Rollup 的 external / globals 是干什么的？"
---

# Rollup 的 external / globals 是干什么的？

**核心考察点**：库打包场景的关键配置。

```js
// rollup.config.js
export default {
  input: "src/index.js",
  external: ["lodash", "react"], // 声明这些依赖"外部化"，不会被打进来
  output: [
    { file: "dist/lib.cjs.js", format: "cjs" },
    { file: "dist/lib.esm.js", format: "esm" },
    {
      file: "dist/lib.umd.js",
      format: "umd",
      name: "MyLib",
      globals: {
        // UMD 需要告诉它外部模块在全局叫什么
        lodash: "_",
        react: "React",
      },
    },
  ],
};
```

- `external`：**不把依赖打进 bundle**，由使用者提供（peerDependencies）。库打包必须用它，否则你的库会把整个 lodash/react 打进去，巨无霸。
- `globals`：UMD 产物在浏览器里通过 `window._`、`window.React` 来访问外部依赖。
