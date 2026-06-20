---
title: "你怎么管理多个 Node 版本？团队怎么统一 Node 版本？"
---

# 你怎么管理多个 Node 版本？团队怎么统一 Node 版本？

- **nvm** / **n** (mac/linux)：切换 Node 版本。
- **nvm-windows**：Windows 版本。
- **fnm** (Fast Node Manager)：Rust 写的，更快。
- **Volta**：还能管理 npm/yarn 版本，`package.json` 里声明 `"volta": { "node": "20" }` 即可。
- **`.nvmrc` / `.node-version`**：项目根目录放一个，很多工具会自动切换。
- **engines 字段**：`package.json` 里 `"engines": { "node": ">=20", "pnpm": ">=8" }`，加上 `.npmrc` 的 `engine-strict=true` 强制校验。
