---
title: "Readable 流的两种模式"
---

# Readable 流的两种模式

- **流动模式（Flowing）**：自动触发 `data` 事件推送数据（如 `pipe`、`data` 监听器）
- **暂停模式（Paused，默认）**：需手动调用 `read()` 拉取数据

切换方式：

- 添加 `data` 监听器 / 调用 `resume()` / `pipe()` → 进入流动模式
- 调用 `pause()` / 移除所有 `data` 监听器 → 回到暂停模式
