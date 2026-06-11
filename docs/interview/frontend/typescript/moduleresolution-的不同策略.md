---
title: "`moduleResolution` 的不同策略？"
---

# `moduleResolution` 的不同策略？

| 策略                  | 说明                                           | 适用场景                    |
| --------------------- | ---------------------------------------------- | --------------------------- |
| `classic`             | 旧策略，TypeScript 原生，不处理 node_modules   | 老项目                      |
| `node`（Node10）      | CommonJS 风格的解析                            | Node.js CommonJS 项目       |
| `node16` / `nodenext` | 根据 `package.json` 的 `type` 字段切换解析方式 | Node.js 16+ 现代化 ESM 项目 |
| `bundler`（TS 5+）    | 类似 Vite/Rollup/webpack 的解析逻辑            | 使用打包工具的项目（推荐）  |
