---
title: "Tree Shaking 的原理是什么？有什么前提？"
---

# Tree Shaking 的原理是什么？有什么前提？

**核心考察点**：是否真正理解"为什么能摇掉"以及在实际项目中的常见坑。

**回答要点**：

**原理**：基于 **ES Modules 的静态结构**（`import`/`export` 在书写层面就固定，不能动态生成）。Bundler 可以在**构建时**做"可达性分析"：从入口出发，标记哪些导出被使用，未被使用的导出就被"摇掉"（不输出到 bundle，或通过 minifier 移除对应代码）。

**前提条件**：

1. **必须是 ESM**。`require()` 是动态的，无法做静态分析。因此项目必须使用 `import`/`export`。
2. **`package.json` 里的 `"sideEffects"`**：告诉 Bundler 哪些文件"有副作用"（例如 polyfill、CSS-in-JS 的全局注入）。副作用文件不能被整体摇掉，只能细粒度分析。
   ```json
   { "sideEffects": ["*.css", "*.scss"] }
   ```
3. **压缩器能识别死代码**（Terser/esbuild/terser-webpack-plugin）。Tree Shaking 本身只是"标记"，真正删除由 minifier 完成。
4. **Webpack 的 `usedExports: true`** + production mode。

**常见问题**：

- "我明明 export 了但没有被用，为什么还在 bundle 里？" 很可能是文件被标记为 sideEffects: true，或被某个全局入口 import 了整个包。
- 第三方库如果发布的是 CJS，大概率不能被 Tree Shaking（除非库额外提供 ESM 版本）。
