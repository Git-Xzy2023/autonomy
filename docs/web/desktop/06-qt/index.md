---
title: Qt 桌面端开发
---

# Qt 桌面端开发

> Qt 是老牌的 C++ 跨平台 GUI 框架，由挪威 Trolltech 公司开发（现属 Qt Company），1995 年发布。性能接近原生、生态成熟、广泛用于工业软件、嵌入式、汽车、医疗设备。近期也支持 Python（PyQt/PySide）和 WebAssembly。

## 适用场景与定位

| 特性 | Qt | Electron | Tauri | Flutter |
| ---- | -- | -------- | ----- | ------- |
| 语言 | C++ / Python | JS | Rust + JS | Dart |
| 性能 | 极高 | 中等 | 高 | 高 |
| UI 渲染 | 原生控件 + 自绘 | Chromium | WebView | 自绘 |
| 包体积 | 30-80MB | 100MB+ | 3-10MB | 15-30MB |
| 跨端能力 | 桌面 + 移动 + 嵌入式 | 仅桌面 | 仅桌面 | 全平台 |
| 学习曲线 | 陡峭（C++） | 低 | 中 | 中 |
| 原生体验 | 极佳 | 一般 | 一般 | 不使用原生控件 |

> Qt 在桌面端工业软件领域无可替代，AutoCAD、Maya、VirtualBox、WPS 等都使用 Qt。

## Qt 版本选择

### Qt 5 vs Qt 6

| 特性 | Qt 5 | Qt 6 |
| ---- | ---- | ---- |
| 状态 | 维护期 | 主推 |
| C++ 标准 | C++11 | C++17+ |
| 构建系统 | qmake | CMake |
| 3D 图形 | OpenGL | Vulkan/Metal/D3D 抽象层 |
| Quick（QML） | Qt Quick 2 | Qt Quick 3D 强化 |
| 高 DPI | 后期支持 | 原生支持 |

**新项目推荐 Qt 6 + CMake + Qt Quick（QML）。**

### Qt Widgets vs Qt Quick（QML）

| 特性 | Qt Widgets | Qt Quick (QML) |
| ---- | ---------- | -------------- |
| 语言 | C++ | QML（声明式）+ JS |
| 风格 | 原生桌面控件 | 现代、动画流畅 |
| 适合 | 传统桌面应用 | 触屏、移动端、动画丰富 |
| 性能 | 高 | 高（GPU 加速） |

## 环境准备

### 安装 Qt

```bash
# 使用 Qt Online Installer（推荐）
# 下载：https://www.qt.io/download
# 选择组件：
#   - Qt 6.5+ for macOS / Windows / Linux
#   - Qt Creator（IDE）
#   - CMake

# macOS 也可通过 Homebrew
brew install qt
brew install --cask qt-creator

# Linux
sudo apt install qt6-base-dev cmake qtcreator
```

## Qt Widgets 示例（C++）

### 最小应用

```cpp
// main.cpp
#include <QApplication>
#include <QPushButton>
#include <QMainWindow>
#include <QLabel>
#include <QVBoxLayout>
#include <QWidget>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QMainWindow window;
    window.setWindowTitle("My Qt App");
    window.resize(800, 600);

    auto central = new QWidget;
    auto layout = new QVBoxLayout(central);

    auto label = new QLabel("Hello, Qt!");
    label->setAlignment(Qt::AlignCenter);

    auto button = new QPushButton("点击我");
    int count = 0;
    QObject::connect(button, &QPushButton::clicked, [&]() {
        count++;
        label->setText(QString("点击次数: %1").arg(count));
    });

    layout->addWidget(label);
    layout->addWidget(button);
    window.setCentralWidget(central);

    window.show();
    return app.exec();
}
```

### CMake 构建

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(MyQtApp VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 COMPONENTS Widgets REQUIRED)

add_executable(MyQtApp main.cpp)
target_link_libraries(MyQtApp PRIVATE Qt6::Widgets)

# macOS 部署
if(APPLE)
    set_target_properties(MyQtApp PROPERTIES
        MACOSX_BUNDLE TRUE
        MACOSX_BUNDLE_INFO_PLIST ${CMAKE_SOURCE_DIR}/Info.plist
    )
endif()
```

```bash
mkdir build && cd build
cmake ..
cmake --build .
```

## Qt Quick（QML）示例

### 主程序

```cpp
// main.cpp
#include <QGuiApplication>
#include <QQmlApplicationEngine>

int main(int argc, char *argv[]) {
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    engine.load(QUrl("qrc:/main.qml"));

    return app.exec();
}
```

### QML 文件

```qml
// main.qml
import QtQuick 3.0
import QtQuick.Controls 3.0
import QtQuick.Layouts

ApplicationWindow {
    visible: true
    width: 800
    height: 600
    title: "My Qt Quick App"

    ColumnLayout {
        anchors.centerIn: parent

        Label {
            id: label
            text: "Hello, Qt Quick!"
            font.pixelSize: 24
        }

        Button {
            text: "点击我"
            onClicked: label.text = "点击次数: " + (++count)
            property int count: 0
        }
    }
}
```

### 资源文件

```xml
<!-- resources.qrc -->
<RCC>
    <qresource prefix="/">
        <file>main.qml</file>
    </qresource>
</RCC>
```

## Python 绑定：PySide6 / PyQt6

### 安装

```bash
# PySide6（Qt 官方 Python 绑定，LGPL）
pip install PySide6

# PyQt6（Riverbank 出品，GPL/商业授权）
pip install PyQt6
```

### 示例

```python
# main.py
import sys
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QLabel, QPushButton
)
from PySide6.QtCore import Qt


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("My PySide6 App")
        self.resize(800, 600)

        central = QWidget()
        layout = QVBoxLayout(central)

        self.label = QLabel("Hello, PySide6!")
        self.label.setAlignment(Qt.AlignCenter)
        self.label.setStyleSheet("font-size: 24px;")

        self.button = QPushButton("点击我")
        self.count = 0
        self.button.clicked.connect(self.on_click)

        layout.addWidget(self.label)
        layout.addWidget(self.button)
        self.setCentralWidget(central)

    def on_click(self):
        self.count += 1
        self.label.setText(f"点击次数: {self.count}")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
```

```bash
python main.py
```

### 打包

```bash
# 使用 PyInstaller 打包为单文件
pip install pyinstaller
pyinstaller --onefile --windowed --name MyApp main.py

# macOS：生成 .app
pyinstaller --onefile --windowed --osx-bundle-identifier com.example.myapp main.py
```

## 信号与槽（核心机制）

Qt 的核心通信机制是信号与槽（Signal & Slot）：

```cpp
// C++
QObject::connect(sender, &Sender::valueChanged,
                 receiver, &Receiver::onValueChanged);

// 自定义信号
class MyClass : public QObject {
    Q_OBJECT
signals:
    void valueChanged(int value);
public slots:
    void setValue(int v) {
        if (v != m_value) {
            m_value = v;
            emit valueChanged(v);
        }
    }
private:
    int m_value = 0;
};
```

```python
# Python
class Sender(QObject):
    value_changed = Signal(int)

    def set_value(self, v):
        self.value_changed.emit(v)


sender = Sender()
sender.value_changed.connect(lambda v: print(f"收到: {v}"))
sender.set_value(42)
```

## Qt WebAssembly

Qt 也支持编译为 WebAssembly，在浏览器中运行：

```bash
# 安装 Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk && ./emsdk install latest && ./emsdk activate latest
source ./emsdk_env.sh

# 使用 Qt for WebAssembly 模块编译
# 需要下载 Qt 的 WebAssembly 版本
```

## 生态

| 模块 | 作用 |
| ---- | ---- |
| Qt Widgets | 传统桌面控件 |
| Qt Quick（QML） | 现代 UI |
| Qt Network | 网络编程 |
| Qt SQL | 数据库 |
| Qt WebEngine | 嵌入 Chromium |
| Qt Charts | 图表 |
| Qt 3D | 3D 渲染 |
| Qt Multimedia | 音视频 |
| Qt SVG | SVG |
| Qt Print Support | 打印 |

## 适合场景

- 工业软件、CAD、医疗、嵌入式
- 对性能要求极高
- 需要原生桌面控件体验
- 跨桌面 + 嵌入式平台
- 团队熟悉 C++

## 经典案例

- **WPS Office**：金山办公
- **VirtualBox**：虚拟机
- **Telegram 桌面版**
- **Autodesk Maya / AutoCAD**
- **OBS Studio**
- **Telegram Desktop**
- **KDE Plasma**（Linux 桌面环境）

## 学习资源

- [Qt 官方文档](https://doc.qt.io/)
- [Qt 教程](https://doc.qt.io/qt-6/tutorial.html)
- [PySide6 文档](https://doc.qt.io/qtforpython/)
- [Qt Examples](https://doc.qt.io/qt-6/qtexamplesandtutorials.html)
