---
title: NW.js 桌面端开发
---

# NW.js 桌面端开发

> NW.js（原名 node-webkit）是 Intel 开发的桌面应用框架，与 Electron 同源（都基于 Chromium + Node.js），但出现更早。允许直接在 DOM 中调用 Node.js 模块，编程模型更直接。

## 与 Electron 对比

| 特性 | NW.js | Electron |
| ---- | ----- | -------- |
| 架构 | Node.js 上下文 + 浏览器上下文合并 | 主进程 + 渲染进程分离 |
| Node 集成 | DOM 中可直接 `require` | 需通过 preload 或 IPC |
| 入口文件 | `index.html` | 主进程 JS |
| 窗口管理 | HTML 中 `<node-remote>` 等标签 | 主进程 `BrowserWindow` |
| 社区活跃度 | 较低 | 极高 |
| 维护方 | Intel | OpenJS Foundation |

## 快速上手

### 安装与初始化

```bash
mkdir my-nwjs-app && cd my-nwjs-app
npm init -y
npm install --save-dev nw
```

### package.json 配置

```json
{
  "name": "my-nwjs-app",
  "version": "1.0.0",
  "main": "index.html",
  "window": {
    "title": "My NW.js App",
    "width": 1200,
    "height": 800,
    "min_width": 800,
    "min_height": 600,
    "icon": "icon.png",
    "toolbar": true,
    "frame": true,
    "show": true,
    "position": "center"
  },
  "node-remote": "<all>",
  "dependencies": {}
}
```

### 入口 HTML（直接使用 Node API）

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>NW.js App</title>
  </head>
  <body>
    <h1>Hello NW.js</h1>
    <button id="btn">读取文件</button>
    <pre id="output"></pre>
    <script>
      // 直接使用 Node 模块
      const fs = require("fs");
      const path = require("path");
      const os = require("os");

      document.getElementById("btn").addEventListener("click", () => {
        const desktop = path.join(os.homedir(), "Desktop");
        const files = fs.readdirSync(desktop);
        document.getElementById("output").textContent = files.join("\n");
      });

      // 也可以直接使用 NW.js API
      const nw = require("nw.gui");
      const win = nw.Window.get();
      win.title = "新标题";
    </script>
  </body>
</html>
```

### 运行

```bash
# 开发模式
npx nw .

# 通过 npm script
# package.json: "scripts": { "start": "nw ." }
npm start
```

## 打包与分发

使用 `nw-builder`：

```bash
npm install --save-dev nw-builder
```

```javascript
// build.js
const NwBuilder = require("nw-builder");

const nw = new NwBuilder({
  files: ["./**/**"], // 源文件
  platforms: ["win", "osx64", "linux64"],
  flavor: "normal", // normal / sdk
  version: "0.72.0",
  appName: "MyApp",
  appVersion: "1.0.0",
  buildDir: "./dist",
  macIcns: "./build/icon.icns",
  winIco: "./build/icon.ico",
});

nw.on("log", console.log);
nw.build().then(() => console.log("打包完成"));
```

```bash
node build.js
```

## 优势与局限

### 优势

- **编程模型简单**：DOM 直接 `require`，无需 IPC 通信。
- **学习成本低**：对 Node 熟悉的前端开发者上手快。
- **支持 Chrome 扩展 API**：可直接使用 `chrome.*` 系列 API。

### 局限

- **安全性较弱**：DOM 中可直接调用 Node，若加载了不信任的网页有安全风险。
- **社区生态较小**：插件、教程、案例少于 Electron。
- **更新较慢**：版本迭代频率低于 Electron。
- **架构限制**：合并上下文模式对复杂应用不如主从进程清晰。

## 适合场景

- 小型工具类应用
- 需要快速原型开发
- 团队对 Electron 架构不熟悉，想要更简单的方案
- 老项目维护

## 与前端框架集成

### NW.js + Vue

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>NW.js + Vue</title>
  </head>
  <body>
    <div id="app">
      <h1>{{ message }}</h1>
      <button @click="readFiles">读取目录</button>
      <ul>
        <li v-for="file in files" :key="file">{{ file }}</li>
      </ul>
    </div>

    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script>
      const { createApp, ref } = Vue;
      const fs = require("fs");

      createApp({
        setup() {
          const message = ref("NW.js + Vue");
          const files = ref([]);
          const readFiles = () => {
            files.value = fs.readdirSync(process.cwd());
          };
          return { message, files, readFiles };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

## 学习资源

- [NW.js 官方文档](https://nwjs.io/)
- [nw-builder 文档](https://github.com/nwjs-community/nw-builder)
