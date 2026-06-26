---
title: Electron 桌面端开发
---

# Electron 桌面端开发

> Electron 是 GitHub 开发的跨平台桌面应用框架，基于 Chromium + Node.js，使用 HTML/CSS/JavaScript 构建原生桌面应用。VS Code、Slack、Discord、Figma 桌面版均基于 Electron。

## 核心原理

### 架构组成

```
┌─────────────────────────────────────────┐
│              Electron 应用              │
├─────────────────┬───────────────────────┤
│  主进程 (Main)  │   渲染进程 (Renderer)  │
│   Node.js 环境  │    Chromium 环境       │
│                 │                       │
│  - 原生 API     │  - DOM / BOM          │
│  - 窗口管理      │  - 页面渲染            │
│  - 系统集成      │  - 前端框架            │
└─────────────────┴───────────────────────┘
        ↕  IPC（进程间通信）↕
```

- **主进程**：Node.js 环境，负责窗口创建、菜单、对话框、系统 API 等原生能力。
- **渲染进程**：Chromium 环境，负责 UI 渲染，每个 BrowserWindow 对应一个渲染进程。
- **IPC 通信**：主进程与渲染进程通过 `ipcMain` / `ipcRenderer` 通信。

### 为什么体积大？

Electron 打包后体积较大（通常 100MB+），原因：

1. 内置完整 Chromium 渲染引擎（约 150MB）
2. 内置 Node.js 运行时（约 30MB）
3. 应用代码 + 依赖

## 快速上手

### 安装与初始化

```bash
# 方式一：手动初始化
mkdir my-electron-app && cd my-electron-app
npm init -y
npm install --save-dev electron

# 方式二：使用 electron-builder 脚手架
npx create-electron-app my-app
```

### 目录结构

```
my-electron-app/
├── package.json
├── src/
│   ├── main.js          # 主进程入口
│   ├── preload.js       # 预加载脚本
│   └── renderer/        # 渲染进程
│       ├── index.html
│       ├── index.js
│       └── styles.css
└── build/               # 打包资源（图标等）
```

### 主进程入口

```javascript
// src/main.js
const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "../build/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // 上下文隔离（安全）
      nodeIntegration: false, // 禁止渲染进程直接使用 Node
      sandbox: true, // 沙箱模式
    },
  });

  // 开发环境加载本地服务，生产环境加载打包文件
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 托盘
let tray = null;
function createTray() {
  tray = new Tray(path.join(__dirname, "../build/tray.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "显示主窗口", click: () => mainWindow?.show() },
    { label: "退出", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("我的应用");
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
```

### Preload 脚本（安全通信桥梁）

```javascript
// src/preload.js
const { contextBridge, ipcRenderer } = require("electron");

// 通过 contextBridge 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld("api", {
  // 渲染进程 -> 主进程
  getFileContent: (filePath) => ipcRenderer.invoke("file:read", filePath),
  // 监听主进程消息
  onUpdateProgress: (callback) =>
    ipcRenderer.on("progress:update", (_, data) => callback(data)),
});
```

### 渲染进程使用

```html
<!-- src/renderer/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Electron App</title>
  </head>
  <body>
    <h1>Hello Electron</h1>
    <button id="btn">读取文件</button>
    <progress id="progress" value="0" max="100"></progress>
    <script src="./index.js"></script>
  </body>
</html>
```

```javascript
// src/renderer/index.js
document.getElementById("btn").addEventListener("click", async () => {
  const content = await window.api.getFileContent("/path/to/file.txt");
  console.log(content);
});

window.api.onUpdateProgress((progress) => {
  document.getElementById("progress").value = progress;
});
```

## IPC 通信详解

### invoke / handle（推荐，Promise 风格）

```javascript
// 主进程
const { ipcMain } = require("electron");
const fs = require("fs").promises;

ipcMain.handle("file:read", async (event, filePath) => {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (err) {
    throw new Error(`读取失败: ${err.message}`);
  }
});
```

```javascript
// 渲染进程（通过 preload 暴露）
const content = await window.api.getFileContent("/path/to/file");
```

### send / on（事件风格，单向）

```javascript
// 渲染进程发送
ipcRenderer.send("message", { data: "hello" });

// 主进程接收
ipcMain.on("message", (event, data) => {
  console.log(data);
  // 主进程回应
  event.sender.send("reply", { data: "world" });
});
```

## 打包与分发

### 使用 electron-builder

```bash
npm install --save-dev electron-builder
```

```json
// package.json
{
  "build": {
    "appId": "com.example.myapp",
    "productName": "MyApp",
    "directories": {
      "output": "dist"
    },
    "files": ["src/**/*", "package.json"],
    "mac": {
      "category": "public.app-category.productivity",
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

```bash
# 打包
npx electron-builder

# 仅打包 Mac
npx electron-builder --mac

# 仅打包 Windows
npx electron-builder --win
```

### 自动更新

```javascript
// 主进程
const { autoUpdater } = require("electron-updater");

autoUpdater.on("update-available", () => {
  // 通知用户有新版本
});

autoUpdater.on("update-downloaded", () => {
  // 提示用户重启安装
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## 性能优化

### 1. 减小包体积

- **ASAR 打包**：将源码打包成 `app.asar` 单文件，避免文件过多。
- **排除 devDependencies**：打包时只包含生产依赖。
- **Tree Shaking**：避免引入整个库（如 lodash 按需引入）。
- **使用 webpack/vite 打包渲染进程**，减小最终代码体积。

### 2. 内存与 CPU 优化

```javascript
// 限制渲染进程数量，复用窗口
function openInNewTab(url) {
  // 复用已有窗口，而不是创建新窗口
}

// 后台任务使用 Worker，避免阻塞主线程
const worker = new Worker("./task.js");
```

### 3. 启动速度优化

- **延迟加载非关键模块**：`require` 放到使用时再调用。
- **预加载关键资源**。
- **使用 v8 snapshot** 缓存启动状态。

## 安全最佳实践

```javascript
new BrowserWindow({
  webPreferences: {
    contextIsolation: true, // 上下文隔离（必须）
    nodeIntegration: false, // 禁用 Node 集成（必须）
    sandbox: true, // 沙箱
    webSecurity: true, // 启用同源策略
    allowRunningInsecureContent: false, // 禁止加载 http 资源
  },
});

// 限制导航到外部链接
mainWindow.webContents.on("will-navigate", (event, url) => {
  if (url !== mainWindow.webContents.getURL()) {
    event.preventDefault();
  }
});

// 新窗口用系统浏览器打开
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  shell.openExternal(url);
  return { action: "deny" };
});
```

## 与其他框架集成

### Electron + React

```bash
# 使用 Vite 模板
npm create @quick-start/electron my-app -- --template react
```

### Electron + Vue

```bash
# 使用 Vue CLI Plugin Electron Builder
vue add electron-builder
```

## 生态工具

| 工具                          | 作用                                |
| ----------------------------- | ----------------------------------- |
| `electron-builder`            | 打包分发                            |
| `electron-updater`            | 自动更新                            |
| `electron-store`              | 持久化存储                          |
| `electron-log`                | 日志                                |
| `electron-rebuild`            | 原生模块重编译                      |
| `electron-devtools-installer` | 安装 React/Vue DevTools             |
| `spectron`                    | E2E 测试（已废弃，推荐 Playwright） |

## 经典案例

- **VS Code**：微软代码编辑器
- **Slack**：团队协作
- **Discord**：游戏社交
- **Figma** 桌面版：设计协作
- **Notion**：笔记
- **GitHub Desktop**：Git 客户端
- **1Password**：密码管理

## 学习资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 文档](https://www.electron.build/)
- [VS Code 源码](https://github.com/microsoft/vscode)（学习大型 Electron 应用架构）
