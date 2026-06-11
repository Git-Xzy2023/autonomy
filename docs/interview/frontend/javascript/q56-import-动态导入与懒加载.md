---
title: "`import()` 动态导入与懒加载？"
---

# `import()` 动态导入与懒加载？

```js
// 静态导入（顶层，不能写在函数里，不能用变量）
import foo from "./foo.js";

// 动态导入（返回 Promise，可以在任何地方调用，支持变量路径）
async function loadChart() {
  const { default: Chart } = await import("./chart.js");
  new Chart("#canvas");
}
button.addEventListener("click", loadChart); // 点击后才加载

// 结合 React.lazy / Vue defineAsyncComponent：
// const LazyPage = React.lazy(() => import('./pages/Dashboard'));
// <Suspense fallback={<Loading/>}><LazyPage/></Suspense>
```

**常见场景**：路由级代码分割、大依赖按需加载、多语言包按需加载。

---
