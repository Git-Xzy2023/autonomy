---
title: "SWC 和 Babel 有什么区别？什么时候会选 SWC？"
---

# SWC 和 Babel 有什么区别？什么时候会选 SWC？

**核心考察点**：对 JS 转译工具链的了解。

- **SWC** 是 Rust 写的 JS/TS 编译器，速度碾压 Babel。
- **Next.js 12+** 默认用 SWC；**Vite** 也有实验性的 SWC 插件；**Parcel** 内部也用 SWC。
- **适用场景**：大型项目、Monorepo、CI 构建时间敏感的场景。
- **限制**：插件生态还没 Babel 丰富，如果你重度依赖某些特定 Babel 插件（比如某些装饰器、antd 的 babel-plugin-import），切换需要验证。
