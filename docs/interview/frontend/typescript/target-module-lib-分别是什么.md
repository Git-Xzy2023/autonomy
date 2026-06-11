---
title: "`target`、`module`、`lib` 分别是什么？"
---

# `target`、`module`、`lib` 分别是什么？

- **`target`**：编译后 JS 的**语言版本**（如 ES5、ES2020、ESNext）。决定了 `let`/`const` 是否转成 `var`、箭头函数是否转成普通函数等。
- **`module`**：编译后使用的**模块系统**（CommonJS、ES2020、AMD、System、UMD、NodeNext 等）。决定了 `import/export` 如何转写。
- **`lib`**：编译时包含哪些**内置类型声明**（如 `ES2020`、`DOM`、`DOM.Iterable`、`ScriptHost` 等）。不影响编译产物，只影响"你能使用哪些 API 而不报错"。

**典型配置：**

```jsonc
{
  "compilerOptions": {
    "target": "ES2020", // 输出为 ES2020（现代浏览器/Node 14+ 原生支持）
    "module": "ESNext", // 使用 ES Modules
    "lib": ["ES2020", "DOM"], // 可以使用 ES2020 的 API 和 DOM API
    "strict": true,
    "moduleResolution": "bundler", // TS 5+，配合 Vite/Rollup/webpack 使用
    "jsx": "react-jsx", // React 17+ 的新 JSX 转换
    "esModuleInterop": true, // 让 CommonJS 模块像 ES Module 一样 import
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true, // 输出 .d.ts 声明文件
    "outDir": "./dist",
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
}
```
