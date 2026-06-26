---
title: Wails 桌面端开发
---

# Wails 桌面端开发

> Wails 是基于 Go 的桌面应用框架，前端使用任意 JS 框架（Vue/React/Svelte），后端用 Go 实现，通过系统 WebView 渲染。理念与 Tauri 类似，但后端语言是 Go 而非 Rust。

## 与 Tauri/Electron 对比

| 特性 | Wails | Tauri | Electron |
| ---- | ----- | ----- | -------- |
| 后端语言 | Go | Rust | Node.js |
| 前端 | 任意 JS 框架 | 任意 JS 框架 | 任意 JS 框架 |
| 渲染 | 系统 WebView | 系统 WebView | Chromium |
| 包体积 | 8-15MB | 3-10MB | 100MB+ |
| 启动速度 | 快（<1s） | 快 | 慢 |
| 学习曲线 | 低（Go 易学） | 中（Rust 难） | 低 |
| 生态 | 起步中 | 成熟 | 极成熟 |

## 环境准备

### 安装 Go

```bash
# macOS
brew install go

# Linux
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# Windows：下载 MSI 安装包
# https://go.dev/dl/
```

### 安装 Wails CLI

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# 检查环境
wails doctor
```

### 系统依赖

- **macOS**：Xcode Command Line Tools
- **Linux**：`libgtk-3-dev`, `libwebkit2gtk-4.0-dev`
- **Windows**：WebView2 Runtime（Win11 预装）

## 快速上手

### 创建项目

```bash
wails init -n myapp -t vue-ts
# 模板：
#   - vue / vue-ts
#   - react / react-ts
#   - svelte / svelte-ts
#   - preact / preact-ts
#   - lit / lit-ts
#   - vanilla / vanilla-ts
```

### 目录结构

```
myapp/
├── main.go              # Go 入口
├── app.go               # 应用逻辑（暴露给前端的方法）
├── wails.json           # Wails 配置
├── frontend/            # 前端项目
│   ├── src/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
├── build/               # 打包资源
│   ├── appicon.png
│   ├── darwin/
│   │   └── Info.plist
│   └── windows/
└── go.mod
```

### Go 后端暴露方法

```go
// app.go
package main

import (
    "context"
    "fmt"
    "os"
    "os/exec"
    "runtime"
)

type App struct {
    ctx context.Context
}

func NewApp() *App {
    return &App{}
}

// 应用启动时调用
func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
}

// 暴露给前端的方法
func (a *App) Greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// 读取文件
func (a *App) ReadFile(path string) (string, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return "", err
    }
    return string(data), nil
}

// 打开外部 URL
func (a *App) OpenURL(url string) error {
    var cmd *exec.Cmd
    switch runtime.GOOS {
    case "darwin":
        cmd = exec.Command("open", url)
    case "windows":
        cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
    default:
        cmd = exec.Command("xdg-open", url)
    }
    return cmd.Start()
}
```

```go
// main.go
package main

import (
    "embed"
    "github.com/wailsapp/wails/v2"
    "github.com/wailsapp/wails/v2/pkg/options"
    "github.com/wailsapp/wails/v2/pkg/options/assetserver"
    "github.com/wailsapp/wails/v2/pkg/options/mac"
    "github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
    app := NewApp()

    err := wails.Run(&options.App{
        Title:  "MyApp",
        Width:  1200,
        Height: 800,
        AssetServer: &assetserver.Options{
            Assets: assets,
        },
        BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
        OnStartup:        app.startup,
        Bind: []interface{}{
            app,
        },
        Mac: &mac.Options{
            TitleBar: mac.TitleBarHiddenInset(),
            WebviewIsTransparent: false,
            WindowIsTranslucent: false,
        },
        Windows: &windows.Options{
            WebviewIsTransparent: false,
            WindowIsTranslucent: false,
        },
    })
    if err != nil {
        panic(err)
    }
}
```

### 前端调用 Go 方法

```typescript
// frontend/src/App.vue
<script setup lang="ts">
import { ref } from "vue";
// 自动生成的类型与调用包装
import { Greet, ReadFile, OpenURL } from "../wailsjs/go/main/App";

const name = ref("");
const greeting = ref("");

const greet = async () => {
  greeting.value = await Greet(name.value);
};

const openLink = () => {
  OpenURL("https://wails.io");
};
</script>

<template>
  <div>
    <input v-model="name" placeholder="输入名字" />
    <button @click="greet">打招呼</button>
    <p>{{ greeting }}</p>
    <button @click="openLink">打开 Wails 官网</button>
  </div>
</template>
```

## 事件系统

```go
// Go 端发送事件
import "github.com/wailsapp/wails/v2/pkg/runtime"

runtime.EventsEmit(a.ctx, "progress", 50)
```

```typescript
// 前端监听
import { EventsOn } from "../wailsjs/runtime/runtime";

EventsOn("progress", (data: number) => {
  console.log(`进度: ${data}%`);
});
```

## 窗口控制

```go
import "github.com/wailsapp/wails/v2/pkg/runtime"

// 居中
runtime.WindowCenter(a.ctx)
// 最小化
runtime.WindowMinimise(a.ctx)
// 全屏
runtime.WindowFullscreen(a.ctx)
// 设置标题
runtime.WindowSetTitle(a.ctx, "新标题")
```

```typescript
// 前端 API
import { WindowCenter, WindowMinimise, WindowClose } from "../wailsjs/runtime/runtime";

WindowMinimise();
```

## 打包与分发

```bash
# 打包当前平台
wails build

# 平台特定参数
wails build -platform darwin/universal
wails build -platform windows/amd64
wails build -platform linux/amd64

# 交叉编译（需配置 CGO）
# macOS 编译 Windows：
GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc wails build -platform windows/amd64

# NSIS 安装包（Windows）
# 配置 wails.json:
# "wailsjsdir": "./frontend/src/wailsjs",
# "nsis": {...}
```

产物：
- macOS：`.app`（支持 universal binary）
- Windows：`.exe`（NSIS 安装包）
- Linux：`.deb` / `.rpm` / AppImage

## 配置文件

```json
// wails.json
{
  "name": "MyApp",
  "outputfilename": "MyApp",
  "frontend:install": "npm install",
  "frontend:build": "npm run build",
  "frontend:dev:watcher": "npm run dev",
  "frontend:dev:serverUrl": "auto",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "info": {
    "companyName": "My Company",
    "productName": "MyApp",
    "productVersion": "1.0.0",
    "copyright": "Copyright 2024",
    "comments": "Built with Wails"
  }
}
```

## 适合场景

- 后端需要复杂业务逻辑、网络请求、并发处理（Go 擅长）
- 团队熟悉 Go，希望用 Go 开发桌面端
- 需要轻量级应用，但 Rust 学习成本太高
- 需要跨平台分发，对一致性有要求

## 生态

| 库 | 作用 |
| ---- | ---- |
| `wails/v2` | 核心框架 |
| 内置：文件对话框、剪贴板、菜单、托盘 | 系统集成 |
| Go 标准库 | 网络、文件、加密等 |
| 任意 Go 第三方库 | 数据库、HTTP 客户端等 |

## 学习资源

- [Wails 官方文档](https://wails.io/)
- [Wails GitHub](https://github.com/wailsapp/wails)
- [Awesome Wails](https://github.com/wailsapp/awesome-wails)
