---
title: "你怎么发布一个 TypeScript 库到 npm？"
---

# 你怎么发布一个 TypeScript 库到 npm？

**核心考察点**：是否理解"库的发布"与"应用的构建"差异。

**关键步骤**：

1. **构建产物**：通常输出 `dist/` 下多份：
   - `*.js`（CommonJS，`require`）
   - `*.mjs` 或 `*.esm.js`（ESM，`import`）
   - `*.d.ts`（类型声明）
   - `*.d.ts.map`（可选，声明文件 sourcemap）

2. **package.json 字段**：

   ```jsonc
   {
     "name": "@yourscope/yourlib",
     "version": "1.0.0",
     "type": "module", // ESM-first
     "main": "./dist/index.cjs", // CommonJS 入口（被 Node/老工具使用）
     "module": "./dist/index.js", // ESM 入口（老 Bundler 用）
     "exports": {
       // 现代 Node/Bundler 优先读这个
       ".": {
         "import": "./dist/index.js",
         "require": "./dist/index.cjs",
         "types": "./dist/index.d.ts",
       },
       "./feature": "./dist/feature.js", // 子路径导出
     },
     "types": "./dist/index.d.ts", // 兜底类型声明入口
     "files": ["dist"], // 只发布 dist（和 README/package.json）
     "sideEffects": ["*.css"], // Tree Shaking 声明
     "scripts": {
       "build": "rollup -c",
       "prepublishOnly": "npm run build", // 发布前自动构建
     },
     "peerDependencies": { "react": ">=17" },
   }
   ```

3. **发布**：`npm publish`（私有包加 `--access restricted`）。
4. **版本管理**：`semantic-release` / `standard-version` / `changesets`（Monorepo 推荐）。
