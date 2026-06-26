---
title: Tauri 桌面端开发
---

# Tauri 桌面端开发

> Tauri 是基于 Rust 的桌面应用框架，使用系统原生 WebView 渲染前端，后端用 Rust 实现。相比 Electron，包体积小（通常 3-10MB）、内存占用低、启动快、安全性更高。

## 与 Electron 对比

| 特性 | Electron | Tauri |
| ---- | -------- | ----- |
| 渲染引擎 | 内置 Chromium | 系统 WebView（macOS WebKit / Windows WebView2 / Linux WebKitGTK） |
| 后端运行时 | Node.js | Rust |
| 包体积 | 100MB+ | 3-10MB |
| 内存占用 | 高（200MB+） | 低（30-80MB） |
| 启动速度 | 慢（1-3s） | 快（<1s） |
| 安全性 | 中等 | 高（默认最小权限） |
| 原生 API | 通过 Node 调用 | 通过 Rust 命令 |
| 学习曲线 | 低（前端栈） | 中等（需懂 Rust） |
| 跨平台 | 一致 | 不同平台 WebView 可能有差异 |

## 核心架构

```
┌────────────────────────────────────────┐
│              Tauri 应用                │
├──────────────────┬─────────────────────┤
│   前端（WebView）│    后端（Rust）      │
│                  │                     │
│  - HTML/CSS/JS   │   - 系统调用         │
│  - Vue/React     │   - 文件操作         │
│  - 任意前端框架   │   - 网络请求         │
│                  │   - 原生对话框       │
└──────────────────┴─────────────────────┘
        ↕  Tauri Commands / Events  ↕
```

## 环境准备

### 安装 Rust

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows：下载 rustup-init.exe
# https://rustup.rs/
```

### 系统依赖

```bash
# macOS
xcode-select --install

# Linux (Debian)
sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

# Windows：安装 Microsoft Visual Studio C++ Build Tools 和 WebView2
```

## 快速上手

### 创建项目

```bash
# 使用 create-tauri-app 脚手架
npm create tauri-app@latest

# 或使用 pnpm
pnpm create tauri-app
```

交互式选择：
- 项目名：my-tauri-app
- 包管理器：pnpm
- 前端框架：Vue / React / Svelte / Vanilla / Yew（Rust）
- UI 模板：TypeScript

### 目录结构

```
my-tauri-app/
├── src/                  # 前端源码
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── src-tauri/            # Rust 后端
│   ├── src/
│   │   └── main.rs       # Rust 入口
│   ├── Cargo.toml        # Rust 依赖
│   ├── tauri.conf.json   # Tauri 配置
│   ├── build.rs
│   └── icons/            # 应用图标
├── package.json
└── vite.config.ts
```

### 前端调用 Rust 命令

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
```

```typescript
// 前端调用（Vue 示例）
import { invoke } from "@tauri-apps/api/core";

const greeting = await invoke<string>("greet", { name: "Tauri" });
console.log(greeting); // "Hello, Tauri!"
```

### 事件系统

```rust
// Rust 发送事件
window.emit("progress", 50)?;
```

```typescript
// 前端监听
import { listen } from "@tauri-apps/api/event";

const unlisten = await listen<number>("progress", (event) => {
  console.log(`进度: ${event.payload}%`);
});

// 组件销毁时取消监听
onUnmounted(() => unlisten());
```

## Tauri 配置

```json
// src-tauri/tauri.conf.json
{
  "build": {
    "beforeDevCommand": "pnpm dev",
    "beforeBuildCommand": "pnpm build",
    "devPath": "http://localhost:1420",
    "distDir": "../dist"
  },
  "package": {
    "productName": "MyApp",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "scope": ["$DOCUMENT/*", "$DESKTOP/*"]
      },
      "dialog": { "all": true },
      "http": { "all": true, "requestHeaders": false },
      "shell": { "all": true, "execute": true },
      "window": { "all": true }
    },
    "security": {
      "csp": "default-src 'self'; img-src 'self' data: https:"
    },
    "windows": [
      {
        "title": "MyApp",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false,
        "decorations": true
      }
    ],
    "bundle": {
      "active": true,
      "targets": ["app", "dmg", "msi", "deb", "appimage"],
      "icon": ["icons/icon.icns", "icons/icon.ico", "icons/icon.png"]
    }
  }
}
```

## 文件系统 API

```typescript
import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

// 读取文件
const content = await readTextFile("config.json", {
  dir: BaseDirectory.AppConfig,
});

// 写入文件
await writeTextFile("config.json", JSON.stringify({ theme: "dark" }), {
  dir: BaseDirectory.AppConfig,
});
```

## 系统对话框

```typescript
import { open, save, ask, confirm } from "@tauri-apps/api/dialog";

// 打开文件
const filePath = await open({
  multiple: false,
  filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
});

// 保存对话框
const savePath = await save({
  defaultPath: "untitled.txt",
  filters: [{ name: "Text", extensions: ["txt"] }],
});

// 确认对话框
const confirmed = await confirm("确定删除吗？", { title: "删除确认" });
```

## 打包与分发

```bash
# 打包当前平台
pnpm tauri build

# 仅构建调试版
pnpm tauri build --debug

# 指定目标
pnpm tauri build --target aarch64-apple-darwin
```

产物：
- macOS：`.app` / `.dmg`
- Windows：`.exe` / `.msi`
- Linux：`.deb` / `.AppImage` / `.rpm`

## 自动更新

```rust
// Cargo.toml
// tauri = { version = "1.5", features = ["updater"] }

#[cfg(desktop)]
pub fn setup_updater(app: &tauri::App) {
    use tauri::updater::UpdaterExt;
    let _ = app.updater().check().expect("updater error");
}
```

```typescript
// 前端
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";

const update = await checkUpdate();
if (update.shouldUpdate) {
  await installUpdate();
  await relaunch();
}
```

## 插件生态

| 插件 | 作用 |
| ---- | ---- |
| `tauri-plugin-store` | 持久化存储 |
| `tauri-plugin-log` | 日志 |
| `tauri-plugin-fs` | 文件系统（推荐用插件代替 allowlist） |
| `tauri-plugin-dialog` | 对话框 |
| `tauri-plugin-http` | HTTP 请求 |
| `tauri-plugin-os` | 操作系统信息 |
| `tauri-plugin-notification` | 通知 |
| `tauri-plugin-clipboard` | 剪贴板 |
| `tauri-plugin-global-shortcut` | 全局快捷键 |
| `tauri-plugin-sql` | SQLite 数据库 |

## 安全特性

1. **Allowlist**：显式声明前端可使用的 API，最小权限原则。
2. **CSP**：内容安全策略，防止 XSS。
3. **禁用远程内容**：默认只能加载本地资源。
4. **Rust 后端**：所有敏感操作通过 Rust 命令实现，前端只能调用已暴露的命令。

## 适合场景

- 需要轻量级桌面应用
- 对性能、内存敏感（如后台常驻工具）
- 需要原生系统集成
- 对安全要求高
- 团队愿意学习 Rust

## 学习资源

- [Tauri 官方文档](https://tauri.app/)
- [Tauri GitHub](https://github.com/tauri-apps/tauri)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)
