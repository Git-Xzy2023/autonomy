---
title: "package.json 字段速查"
---

# package.json 字段速查

```json
{
  "name": "my-pkg",
  "version": "1.0.0", // semver：主.次.修订
  "main": "index.js", // CommonJS 入口
  "module": "index.mjs", // ESM 入口（打包工具用）
  "exports": {
    // Node 14+，精确控制导出
    ".": "./index.js",
    "./utils": "./utils.js"
  },
  "type": "module", // 全项目默认 ESM
  "scripts": {
    // 脚本
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    // 生产依赖
    "express": "^4.18.0"
  },
  "devDependencies": {
    // 开发依赖
    "jest": "^29.0.0"
  },
  "peerDependencies": {
    // 由宿主提供的依赖
    "react": ">=18"
  },
  "optionalDependencies": {
    // 可选，安装失败不影响
    "fsevents": "*"
  },
  "engines": { "node": ">=18" }, // 声明支持的 Node 版本
  "bin": { "mycli": "./bin/cli" } // 注册 CLI 命令
}
```
