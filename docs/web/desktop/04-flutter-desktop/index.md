---
title: Flutter Desktop 桌面端开发
---

# Flutter Desktop 桌面端开发

> Flutter 是 Google 开发的跨端 UI 框架，使用 Dart 语言，一套代码可运行在 iOS、Android、Web、Windows、macOS、Linux。Flutter Desktop 自 3.0 起进入稳定版，性能与原生接近。

## 与 Electron/Tauri 的对比

| 特性 | Flutter Desktop | Electron | Tauri |
| ---- | --------------- | -------- | ----- |
| 语言 | Dart | JavaScript | Rust + JS |
| UI 渲染 | 自绘（Skia/Impeller） | Chromium | 系统 WebView |
| 性能 | 接近原生 | 中等 | 高 |
| 包体积 | 15-30MB | 100MB+ | 3-10MB |
| 跨平台一致性 | 极高 | 极高 | 中等 |
| 原生控件 | 不使用 | 不使用 | 不使用 |
| UI 一致性 | 所有平台完全一致 | 一致 | 平台差异 |

> Flutter 不使用系统原生控件，而是自绘 UI，因此不同平台视觉完全一致。

## 环境准备

### 安装 Flutter SDK

```bash
# macOS（推荐 Flutter FVM 多版本管理）
brew tap leoafarias/fvm
brew install fvm
fvm install stable
fvm global stable

# 或直接下载
# https://docs.flutter.dev/get-started/install
```

### 启用桌面支持

```bash
# 查看已启用的设备
flutter config

# 启用 macOS / Windows / Linux
flutter config --enable-macos-desktop
flutter config --enable-windows-desktop
flutter config --enable-linux-desktop

# 检查环境
flutter doctor
```

### 系统依赖

- **macOS**：Xcode（App Store）
- **Windows**：Visual Studio 2022 含 C++ 桌面开发
- **Linux**：`clang`, `cmake`, `ninja-build`, `pkg-config`, `libgtk-3-dev`

## 快速上手

### 创建项目

```bash
flutter create my_flutter_app
cd my_flutter_app
```

### 运行桌面版

```bash
# 查看可用设备
flutter devices

# macOS
flutter run -d macos

# Windows
flutter run -d windows

# Linux
flutter run -d linux
```

### 目录结构

```
my_flutter_app/
├── lib/
│   ├── main.dart              # 应用入口
│   └── ...
├── macos/                     # macOS 平台代码
├── windows/                   # Windows 平台代码
├── linux/                     # Linux 平台代码
├── android/                   # Android
├── ios/                       # iOS
├── web/                       # Web
├── test/
└── pubspec.yaml               # 依赖配置
```

### Hello World

```dart
// lib/main.dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Desktop Demo',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Desktop')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('计数: $_counter', style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => setState(() => _counter++),
              child: const Text('增加'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 桌面端特性

### 窗口控制

```yaml
# pubspec.yaml
dependencies:
  window_manager: ^0.3.5
```

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:window_manager/window_manager.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await windowManager.ensureInitialized();

  await windowManager.waitUntilReadyToShow(const WindowOptions(
    size: Size(1200, 800),
    minimumSize: Size(800, 600),
    center: true,
    title: 'MyApp',
    titleBarStyle: TitleBarStyle.hidden, // 自定义标题栏
  ), () async {
    await windowManager.show();
    await windowManager.focus();
  });

  runApp(const MyApp());
}
```

### 响应桌面交互

```dart
// 鼠标 hover
MouseRegion(
  onEnter: (_) => print('鼠标进入'),
  onExit: (_) => print('鼠标离开'),
  onHover: (event) => print('位置: ${event.position}'),
  child: Container(width: 100, height: 100, color: Colors.blue),
);

// 滚轮
Listener(
  onPointerSignal: (event) {
    if (event is PointerScrollEvent) {
      print('滚动: ${event.scrollDelta}');
    }
  },
  child: ...,
);

// 键盘快捷键
KeyboardListener(
  focusNode: _focusNode,
  autofocus: true,
  onKeyEvent: (event) {
    if (event.logicalKey == LogicalKeyboardKey.escape) {
      // ESC 退出
    }
  },
  child: ...,
);
```

### 文件系统

```yaml
dependencies:
  file_picker: ^6.0.0
  path_provider: ^2.1.0
```

```dart
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';

// 选择文件
FilePickerResult? result = await FilePicker.platform.pickFiles(
  type: FileType.custom,
  allowedExtensions: ['json', 'txt'],
);
if (result != null) {
  final path = result.files.single.path;
  // 读取文件
}

// 应用数据目录
final dir = await getApplicationDocumentsDirectory();
print(dir.path);
```

### 菜单栏

```dart
import 'package:flutter/material.dart';

Scaffold(
  body: MenuBar(
    children: [
      SubmenuMenuButton(menuChildren: [
        MenuItemButton(onPressed: () {}, child: const Text('新建')),
        MenuItemButton(onPressed: () {}, child: const Text('打开')),
        MenuItemButton(onPressed: () => exit(0), child: const Text('退出')),
      ], child: const Text('文件')),
      SubmenuMenuButton(menuChildren: [
        MenuItemButton(onPressed: () {}, child: const Text('撤销')),
        MenuItemButton(onPressed: () {}, child: const Text('重做')),
      ], child: const Text('编辑')),
    ],
  ),
);
```

## 打包与分发

### macOS

```bash
# 应用包
flutter build macos --release

# 生成 .dmg（使用工具）
# 1. AppDMG
# 2. create-dmg
brew install create-dmg
create-dmg --volname "MyApp" --window-pos 200 120 --window-size 600 400 \
  --icon-size 100 --app-drop-link 425 225 \
  "MyApp.dmg" "build/macos/Build/Products/Release/MyApp.app"

# 代码签名 + 公证
flutter build macos --release
codesign --deep --force --options=runtime --sign "Developer ID Application: ..." \
  build/macos/Build/Products/Release/MyApp.app
xcrun notarytool submit MyApp.dmg --apple-id ... --team-id ... --password ...
xcrun stapler staple MyApp.dmg
```

### Windows

```bash
# 生成 .exe
flutter build windows --release

# 使用 MSIX 打包
# pubspec.yaml:
# msix_config:
#   display_name: MyApp
#   publisher: CN=...
#   identity_name: com.example.myapp
flutter pub run msix:create
```

### Linux

```bash
# 生成可执行
flutter build linux --release

# 打包 AppImage
# 使用 linuxdeploy
wget https://github.com/linuxdeploy/linuxdeploy/releases/...
linuxdeploy-x86_64.AppImage --appdir AppDir --executable myapp \
  --desktop-file myapp.desktop --icon-file icon.png --output appimage
```

## 适合场景

- 需要 iOS/Android/桌面/Web 全平台覆盖
- 团队熟悉 Dart 或愿意学习
- 对 UI 视觉一致性要求高
- 对性能要求接近原生
- 需要复杂动画与自定义绘制

## 生态

| 包 | 作用 |
| ---- | ---- |
| `window_manager` | 窗口控制 |
| `bitsdojo_window` | 自定义窗口 |
| `file_picker` | 文件选择 |
| `path_provider` | 系统目录 |
| `url_launcher` | 打开 URL |
| `shared_preferences` | 持久化 KV |
| `sqflite_common_ffi` | SQLite 桌面支持 |
| `flutter_acrylic` | 亚克力效果（Windows） |

## 学习资源

- [Flutter Desktop 官方文档](https://docs.flutter.dev/desktop)
- [Flutter Cookbook - Desktop](https://docs.flutter.dev/cookbook)
- [Awesome Flutter Desktop](https://github.com/leanflutter/awesome-flutter-desktop)
