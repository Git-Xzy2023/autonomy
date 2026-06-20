---
title: "你在 Vite 配置里一般会写什么？"
---

# 你在 Vite 配置里一般会写什么？

**核心考察点**：是否有实际使用经验。

```js
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()], // 框架插件（vue/react/svelte...）

  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
    fs: { strict: false }, // 允许访问 src 外的文件（monorepo 场景）
  },

  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "element-plus": ["element-plus"],
          echarts: ["echarts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 调大 chunk 大小警告
  },

  optimizeDeps: {
    include: ["@scope/some-lib"], // 强制预构建某些被漏掉的依赖
    exclude: ["some-esm-only-pkg"],
  },
});
```
