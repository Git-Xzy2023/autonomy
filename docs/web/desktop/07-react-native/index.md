---
title: React Native 桌面端开发
---

# React Native 桌面端开发

> React Native（RN）是 Facebook 开发的跨平台框架，使用 JavaScript/TypeScript + React 编写原生应用。主定位是移动端（iOS/Android），但通过 Microsoft 维护的 `react-native-windows` 和社区维护的 `react-native-macos`，可扩展到 Windows 和 macOS 桌面端。

## 与其他桌面框架对比

| 特性 | React Native | Electron | Tauri | Flutter |
| ---- | ------------ | -------- | ----- | ------- |
| 语言 | JS / TS | JS | Rust + JS | Dart |
| UI 渲染 | 原生控件映射 | Chromium | WebView | 自绘 |
| 主定位 | 移动端 | 桌面端 | 桌面端 | 全平台 |
| 桌面支持 | Windows（MS 官方）/ macOS（社区） | 全平台 | 全平台 | 全平台 |
| Linux 支持 | ❌ 不支持 | ✅ | ✅ | ✅ |
| 包体积 | 中（30-80MB） | 100MB+ | 3-10MB | 15-30MB |
| 原生体验 | 接近原生 | 一般 | 一般 | 自绘 |
| 与 React Web 代码复用 | 高（同语法） | 极高（同 DOM） | 极高 | 无 |

> RN 桌面端**不支持 Linux**，这是它与其他桌面框架的最大差异。如果你需要 Linux 支持，应选 Electron / Tauri / Flutter。

## 桌面端支持现状

### Windows：react-native-windows

- **维护方**：Microsoft（官方支持）
- **GitHub**：https://github.com/microsoft/react-native-windows
- **架构**：基于 WinUI 3 / XAML，使用原生 Windows 控件
- **成熟度**：生产可用，Microsoft 自家产品在用

### macOS：react-native-macos

- **维护方**：社区（原 Microsoft，现 64robots 等）
- **GitHub**：https://github.com/microsoft/react-native-macos
- **架构**：基于 AppKit / NSView
- **成熟度**：可用，但更新较慢，部分新 RN 特性跟进滞后

### Linux：无官方支持

React Native 没有 Linux 桌面端实现，社区也无人维护。若需 Linux，请改用 Electron / Tauri / Flutter。

## 适用场景

- **已有 React Native 移动应用，想扩展桌面**
- **需要原生 Windows 控件体验**
- **Microsoft 生态集成**（UWP、WinUI）
- **复用 React 知识栈**
- **不需要 Linux**

## 经典案例

- **Windows 11 设置应用**（部分模块）
- **Outlook for Windows**（新版）
- **Microsoft Office 部分面板**
- **Skype**（桌面版部分）
- **Discord**（部分模块）
- **Coinbase**

## 环境准备

### Windows 开发环境

```powershell
# 1. 安装 Node.js
winget install OpenJS.NodeJS.LTS

# 2. 安装 Visual Studio 2022 含以下组件
# - 使用 C++ 的桌面开发
# - 通用 Windows 平台开发
# - Windows 10/11 SDK
# - MSIX 打包工具

# 3. 安装 react-native-cli
npm install -g react-native-cli

# 4. 启用 Developer Mode
# 设置 → 隐私和安全性 → 开发者 → 开发人员模式
```

### macOS 开发环境

```bash
# 1. 安装 Node.js
brew install node

# 2. 安装 Xcode
xcode-select --install

# 3. 安装 CocoaPods
sudo gem install cocoapods

# 4. 安装 react-native-cli
npm install -g react-native-cli
```

## 快速上手

### 创建 React Native 项目

```bash
npx react-native@latest init MyDesktopApp --template react-native-template-typescript
cd MyDesktopApp
```

### 添加 Windows 支持

```bash
# 安装 react-native-windows
npx react-native-windows-init --overwrite

# 这会创建 windows/ 目录
```

### 添加 macOS 支持

```bash
# 安装 react-native-macos
npx react-native-macos-init --overwrite

# 创建 macos/ 目录
```

### 目录结构

```
MyDesktopApp/
├── src/                    # 业务代码
│   ├── App.tsx
│   ├── screens/
│   └── components/
├── android/                # Android
├── ios/                    # iOS
├── windows/                # Windows 桌面（react-native-windows）
│   ├── MyDesktopApp.sln
│   └── MyDesktopApp/
├── macos/                  # macOS 桌面（react-native-macos）
│   ├── MyDesktopApp.xcworkspace
│   └── Podfile
└── package.json
```

### Hello World

```tsx
// src/App.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
} from "react-native";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hello, React Native Desktop!</Text>
        <Text style={styles.platform}>
          运行平台: {Platform.OS}
        </Text>
        <Text style={styles.counter}>点击次数: {count}</Text>
        <Button title="增加" onPress={() => setCount(count + 1)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  platform: { fontSize: 14, color: "#666", marginBottom: 24 },
  counter: { fontSize: 18, marginBottom: 16 },
});
```

### 平台判断

```tsx
import { Platform } from "react-native";

if (Platform.OS === "windows") {
  // Windows 桌面专属逻辑
} else if (Platform.OS === "macos") {
  // macOS 桌面专属逻辑
} else if (Platform.OS === "ios" || Platform.OS === "android") {
  // 移动端
}

// 平台特定文件
// App.windows.tsx   - Windows 专属
// App.macos.tsx     - macOS 专属
// App.ios.tsx       - iOS 专属
// App.android.tsx   - Android 专属
// App.tsx           - 默认
```

## 桌面端特有 API

### 窗口控制

```tsx
// Windows：使用 react-native-xaml
import { View } from "react-native";
import { XamlControl, XamlButton } from "react-native-xaml";

// 或使用原生模块
import { NativeModules } from "react-native";
const { AppWindow } = NativeModules;

// 设置窗口大小
AppWindow.resize(1200, 800);
AppWindow.setTitle("我的应用");
AppWindow.minimize();
AppWindow.maximize();
```

### 键盘快捷键

```tsx
import { Keyboard } from "react-native";

// 监听键盘事件
useEffect(() => {
  const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
    console.log("键盘显示", e.endCoordinates.height);
  });
  return () => showSubscription.remove();
}, []);
```

### 拖放

```tsx
// Windows 拖放需要原生模块支持
// https://github.com/microsoft/react-native-windows-samples
```

## 打包与分发

### Windows 打包

```bash
# Debug 运行
npx react-native run-windows

# Release 构建
npx react-native run-windows --release

# 生成 MSIX 安装包
# 1. 安装 MSIX Packaging Tool
# 2. 配置 Package.appxmanifest
# 3. 使用 Visual Studio 打包
```

### macOS 打包

```bash
# 运行
npx react-native run-macos

# Release 构建
cd macos
pod install
cd ..
xcodebuild -workspace MyDesktopApp.xcworkspace -scheme MyDesktopApp -configuration Release -destination 'platform=macOS'

# 生成 .app
# 产物在 macos/build/Release/
```

### 代码签名与公证

```bash
# macOS 公证
xcrun notarytool submit MyApp.zip \
  --apple-id you@example.com \
  --team-id ABCDE12345 \
  --password app-specific-password \
  --wait

xcrun stapler staple MyApp.app
```

## 与 React Web 的代码复用

RN 与 React Web 都用 JSX，但渲染目标不同（原生控件 vs DOM）。复用策略：

### 1. 业务逻辑复用

```tsx
// 可以复用：hooks、状态管理、工具函数
// src/hooks/useAuth.ts - 通用
// src/store/userStore.ts - 通用（用 zustand / jotai）
// src/utils/format.ts - 通用
```

### 2. UI 层适配

```tsx
// .native.tsx 用 RN 组件
import { View, Text } from "react-native";
export const Button = () => <View><Text>按钮</Text></View>;

// .web.tsx 用 DOM
export const Button = () => <div><span>按钮</span></div>;
```

### 3. React Native Web

```bash
# react-native-web 将 RN 组件渲染到 DOM
npm install react-native-web
```

```tsx
// 一套代码，多端运行
import { View, Text } from "react-native";
// Web 端会被 react-native-web 转成 <div><span>
```

## 生态

| 库 | 作用 | 桌面支持 |
| ---- | ---- | ---- |
| `react-native-windows` | Windows 桌面支持 | ✅ |
| `react-native-macos` | macOS 桌面支持 | ✅ |
| `react-native-xaml` | Windows XAML 控件 | ✅ |
| `@react-native-community/clipboard` | 剪贴板 | ✅ |
| `react-native-fs` | 文件系统 | ✅ |
| `react-native-sqlite-storage` | SQLite | ✅ |
| `react-navigation` | 导航 | ✅ |
| `react-native-reanimated` | 动画 | ✅ |
| `zustand` / `jotai` | 状态管理 | ✅ |
| `react-native-web` | 渲染到 Web | N/A |

## 优势与局限

### 优势

- **复用移动端代码**：已有 RN 移动应用可低成本扩展桌面。
- **原生控件**：UI 使用 Windows 原生控件，体验接近系统应用。
- **Microsoft 背书**：Windows 端有官方支持，长期可维护。
- **React 生态**：复用 React 知识与生态。

### 局限

- **不支持 Linux**：最大短板。
- **macOS 更新慢**：社区维护，新特性跟进滞后。
- **学习曲线**：需要理解 RN 的 Flexbox、原生模块机制。
- **生态相对小**：桌面端第三方库少于 Electron。
- **调试复杂**：原生层问题需用 Visual Studio / Xcode 调试。

## 适合场景

- 已有 React Native 移动应用，想扩展桌面端
- 主要面向 Windows 用户（macOS 辅助）
- 需要 Microsoft 生态集成（UWP、WinUI）
- 团队已熟悉 React Native
- 不需要 Linux 支持

## 学习资源

- [React Native 官方文档](https://reactnative.dev/)
- [React Native for Windows](https://microsoft.github.io/react-native-windows/)
- [React Native for macOS](https://microsoft.github.io/react-native-windows/docs/rnm-getting-started)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)
- [Microsoft RN Samples](https://github.com/microsoft/react-native-windows-samples)
