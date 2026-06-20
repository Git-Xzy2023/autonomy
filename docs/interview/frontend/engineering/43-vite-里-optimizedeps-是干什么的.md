---
title: "Vite 里 optimizeDeps 是干什么的？什么时候需要手动配置？"
---

# Vite 里 optimizeDeps 是干什么的？什么时候需要手动配置？

**核心考察点**：是否理解 Vite 预构建的机制和坑。

**常见场景需要手动 include**：

1. **动态 import 的依赖**：`import(`./locale/${lang}`)` 这样的变量导入，Vite 扫描不到，需要显式加到 `include`。
2. **Monorepo 里的 workspace 包**：Vite 默认可能不把 sibling 包当作依赖，导致首次加载时被编译成多个请求。
3. **CommonJS 包**：某些包虽然 package.json 声明了 ESM，但入口文件里有 `require`，Vite 需要把它预构建。
4. **`exclude`**：某些 ESM 原生包（如某些现代库）你不想被预构建（想直接用浏览器加载）。

**常见问题排查**：页面第一次打开很慢 / 控制台有 `X files changed, reloading` 频繁触发 → 检查 `optimizeDeps.include` 有没有把相应库加入。
