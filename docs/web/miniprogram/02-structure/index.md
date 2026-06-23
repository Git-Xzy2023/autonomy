---
title: 项目结构与配置
---

# 项目结构与配置详解

> 本章深入讲解小程序的项目目录结构、各类配置文件的作用，以及全局逻辑和样式的编写方式。

---

## 一、完整项目目录结构

一个典型的微信小程序项目结构如下：

```
my-miniprogram/
├── pages/                      # 页面目录（每个页面一个文件夹）
│   ├── index/
│   │   ├── index.js            # 页面逻辑
│   │   ├── index.json          # 页面配置
│   │   ├── index.wxml          # 页面结构
│   │   └── index.wxss          # 页面样式
│   ├── logs/
│   │   ├── logs.js
│   │   ├── logs.json
│   │   ├── logs.wxml
│   │   └── logs.wxss
│   └── detail/
│       ├── detail.js
│       ├── detail.json
│       ├── detail.wxml
│       └── detail.wxss
├── components/                 # 自定义组件目录
│   └── card/
│       ├── card.js
│       ├── card.json
│       ├── card.wxml
│       └── card.wxss
├── utils/                      # 工具函数
│   ├── util.js
│   ├── request.js              # 网络请求封装
│   └── format.js               # 格式化工具
├── images/                     # 本地图片资源
│   ├── logo.png
│   └── icon-tab-home.png
├── app.js                      # 小程序入口逻辑
├── app.json                    # 小程序全局配置（最重要）
├── app.wxss                    # 全局样式
├── project.config.json         # 项目配置（开发者工具）
├── project.private.config.json # 项目私有配置（不提交 git）
├── sitemap.json                # 搜索索引配置
└── .gitignore
```

### 1.1 文件类型说明

| 文件类型 | 作用             | 类比 Web      |
| -------- | ---------------- | ------------- |
| `.wxml`  | 页面结构         | HTML          |
| `.wxss`  | 页面样式         | CSS           |
| `.js`    | 逻辑代码         | JavaScript    |
| `.json`  | 配置文件         | JSON          |
| `.wxs`   | WXS 脚本（特殊） | 模板内逻辑    |

> 💡 **WXS**（WeiXin Script）是小程序的一套脚本语言，用于在 WXML 中做简单的数据处理，性能优于 JS 调用。

### 1.2 页面的四个文件

每个页面由四个同名文件组成，它们共同定义一个页面：

```
index/
├── index.wxml   → 结构（写什么）
├── index.wxss   → 样式（长什么样）
├── index.js     → 逻辑（做什么）
└── index.json   → 配置（页面级配置）
```

这四个文件**必须同名**，且文件名就是页面名。

---

## 二、app.json 全局配置（核心）

`app.json` 是小程序的**全局配置文件**，决定了页面路径、窗口样式、底部 TabBar 等。

### 2.1 完整配置示例

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs",
    "pages/detail/detail"
  ],
  "window": {
    "backgroundTextStyle": "dark",
    "navigationBarBackgroundColor": "#07c160",
    "navigationBarTitleText": "我的小程序",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#f5f5f5",
    "enablePullDownRefresh": false,
    "onReachBottomDistance": 50
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#07c160",
    "backgroundColor": "#fff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tab-home.png",
        "selectedIconPath": "images/tab-home-active.png"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "日志",
        "iconPath": "images/tab-log.png",
        "selectedIconPath": "images/tab-log-active.png"
      }
    ]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": false,
  "style": "v2",
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents"
}
```

### 2.2 pages - 页面路径列表

```json
{
  "pages": [
    "pages/index/index",      // 数组第一项 = 小程序默认启动页
    "pages/logs/logs",
    "pages/detail/detail"
  ]
}
```

> ⚠️ **重要**：`pages` 数组的**第一项**是小程序的默认首页。新增页面只需在此添加路径，开发者工具会自动创建对应文件。

### 2.3 window - 默认窗口样式

`window` 配置所有页面的默认窗口表现，单个页面可在自己的 `.json` 中覆盖。

| 属性                         | 类型     | 说明                         | 默认值     |
| ---------------------------- | -------- | ---------------------------- | ---------- |
| `navigationBarBackgroundColor` | HexColor | 导航栏背景色                 | `#000000`  |
| `navigationBarTextStyle`     | String   | 导航栏标题颜色：`white`/`black` | `white`    |
| `navigationBarTitleText`     | String   | 导航栏标题文字               | -          |
| `backgroundColor`            | HexColor | 窗口背景色（下拉时可见）     | `#ffffff`  |
| `backgroundTextStyle`        | String   | 下拉 loading 样式：`dark`/`light` | `dark`     |
| `enablePullDownRefresh`      | Boolean  | 是否开启下拉刷新             | `false`    |
| `onReachBottomDistance`      | Number   | 上拉触底距离（px）           | `50`       |

### 2.4 tabBar - 底部导航栏

`tabBar` 配置底部标签栏，最少 2 个、最多 5 个 tab。

```json
{
  "tabBar": {
    "color": "#999",                    // 未选中文字颜色
    "selectedColor": "#07c160",         // 选中文字颜色
    "backgroundColor": "#fff",          // 背景色
    "borderStyle": "black",             // 上边框颜色：black/white
    "position": "bottom",               // 位置：bottom/top
    "list": [
      {
        "pagePath": "pages/index/index", // 页面路径（必须在 pages 中）
        "text": "首页",                  // 按钮文字
        "iconPath": "images/tab-home.png",           // 未选中图标
        "selectedIconPath": "images/tab-home-active.png"  // 选中图标
      }
    ]
  }
}
```

> ⚠️ **注意**：
> - `iconPath` 图标大小限制 40KB，建议尺寸 81px×81px
> - `pagePath` 必须在 `pages` 列表中
> - tabBar 页面之间用 `wx.switchTab` 跳转，不能用 `wx.navigateTo`

### 2.5 其他常用配置

| 属性                | 说明                                   |
| ------------------- | -------------------------------------- |
| `networkTimeout`    | 网络请求超时时间（ms）                 |
| `debug`             | 是否开启 debug 模式（控制台输出更多信息）|
| `style`             | `"v2"` 启用新版组件样式                |
| `lazyCodeLoading`   | 按需注入组件代码，优化启动速度         |
| `sitemapLocation`   | sitemap.json 的位置                    |
| `entryPagePath`     | 默认启动页路径                         |
| `renderer`          | 渲染引擎：`webview`/`skyline`          |

---

## 三、页面配置（page.json）

每个页面可以通过自己的 `.json` 文件覆盖全局 `window` 配置。

### 3.1 页面配置示例

```json
{
  "navigationBarTitleText": "详情页",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "enablePullDownRefresh": true,
  "backgroundTextStyle": "dark",
  "usingComponents": {
    "card": "/components/card/card",
    "custom-nav": "/components/custom-nav/custom-nav"
  }
}
```

### 3.2 页面独有配置

| 属性                  | 说明                                |
| --------------------- | ----------------------------------- |
| `usingComponents`     | 引用自定义组件                      |
| `disableScroll`       | 页面整体是否禁止滚动                |
| `onReachBottomDistance` | 上拉触底距离                       |
| `backgroundColorTop`  | 顶部下拉时窗口背景色（iOS）         |
| `backgroundColorBottom` | 底部上拉时窗口背景色（iOS）       |

> 💡 页面配置只能设置 `window` 相关属性和 `usingComponents`，不能配置 `pages`、`tabBar` 等全局项。

---

## 四、app.js 全局逻辑

`app.js` 是小程序的入口文件，定义小程序的生命周期和全局数据。

### 4.1 基本结构

```javascript
// app.js
App({
  // 全局数据，所有页面可通过 getApp().globalData 访问
  globalData: {
    userInfo: null,
    token: '',
    baseUrl: 'https://api.example.com',
    systemInfo: null
  },

  // 小程序启动时触发（全局只触发一次）
  onLaunch(options) {
    console.log('小程序启动', options)
    // 场景值：options.scene
    // 启动参数：options.query

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    // 检查更新
    this.checkUpdate()
  },

  // 小程序从后台进入前台时触发
  onShow(options) {
    console.log('小程序进入前台', options)
  },

  // 小程序从前台进入后台时触发
  onHide() {
    console.log('小程序进入后台')
  },

  // 小程序发生脚本错误或 API 调用失败时触发
  onError(msg) {
    console.error('小程序错误', msg)
  },

  // 页面找不到时触发
  onPageNotFound(res) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 自定义全局方法
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      console.log('是否有新版本', res.hasUpdate)
    })
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已就绪，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  }
})
```

### 4.2 全局数据的使用

在页面中访问全局数据：

```javascript
// pages/index/index.js
const app = getApp()

Page({
  onLoad() {
    // 读取全局数据
    console.log(app.globalData.userInfo)
    console.log(app.globalData.baseUrl)

    // 修改全局数据
    app.globalData.token = 'new-token'
  }
})
```

> ⚠️ **注意**：`globalData` 不是响应式的。如果需要全局状态管理，建议使用 [MobX](https://github.com/wechat-miniprogram/mobx-miniprogram) 或自实现事件机制。

---

## 五、app.wxss 全局样式

`app.wxss` 是全局样式表，对所有页面生效。

### 5.1 全局样式示例

```css
/* app.wxss */

/* 全局重置 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

/* 全局通用类 */
.container {
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-primary {
  color: #07c160;
}

.text-muted {
  color: #999;
  font-size: 24rpx;
}

/* 卡片样式 */
.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}
```

### 5.2 rpx 单位

小程序独有的响应式像素单位 `rpx`：

```
设计稿宽度：750rpx（iPhone 6 为基准）

换算关系：
iPhone 6:    1rpx = 0.5px = 1物理像素 / 2
iPhone 6 Plus: 1rpx = 0.552px
```

| 设备         | 屏幕宽度 | 1rpx = ?px |
| ------------ | -------- | ---------- |
| iPhone 5     | 320px    | 0.42px     |
| iPhone 6     | 375px    | 0.5px      |
| iPhone 6 Plus| 414px    | 0.552px    |
| Android 常见 | 360px    | 0.48px     |

> 💡 **建议**：设计稿以 iPhone 6（750×1334）为基准，1px 设计稿 = 2rpx，方便换算。

### 5.3 样式隔离

- `app.wxss` 对所有页面生效
- 页面 `.wxss` 只对当前页面生效
- 组件默认有样式隔离，可通过 `styleIsolation` 配置

---

## 六、project.config.json 项目配置

此文件由开发者工具生成和管理，记录项目配置信息。

```json
{
  "description": "项目配置文件",
  "packOptions": {
    "ignore": [
      { "type": "file", "value": ".eslintrc.js" }
    ]
  },
  "setting": {
    "urlCheck": true,              // 是否校验域名
    "es6": true,                   // 是否启用 ES6 转 ES5
    "enhance": true,               // 是否增强编译
    "postcss": true,               // 是否自动补全 CSS
    "preloadBackgroundData": false,
    "minified": true,              // 是否压缩代码
    "newFeature": true,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": true,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "showES6CompileOption": false,
    "minifyWXML": true
  },
  "compileType": "miniprogram",
  "libVersion": "3.3.4",
  "appid": "wx1234567890abcdef",
  "projectname": "my-miniprogram",
  "condition": {}
}
```

> ⚠️ `project.private.config.json` 保存个人配置（如本地编译模式），不应提交到 git。

---

## 七、sitemap.json 搜索配置

`sitemap.json` 配置小程序是否允许被微信索引。

```json
{
  "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/sitemap.html",
  "rules": [
    {
      "action": "allow",
      "page": "*"
    }
  ]
}
```

| 字段       | 说明                                   |
| ---------- | -------------------------------------- |
| `action`   | `allow` 允许索引 / `disallow` 禁止索引 |
| `page`     | 页面路径，`*` 表示所有页面             |
| `params`   | 页面参数                               |
| `priority` | 优先级                                 |

---

## 八、分包配置（Subpackages）

当小程序体积较大时，可以使用分包优化启动速度和包大小。

### 8.1 主包与分包

```
┌─────────────────────────────────────────┐
│              主包（≤ 2MB）               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 首页    │ │ 个人中心 │ │ 公共组件 │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
         │
         │ 按需下载
         ▼
┌─────────────────┐  ┌─────────────────┐
│   分包 A（≤2MB）  │  │   分包 B（≤2MB）  │
│  ┌─────────┐    │  │  ┌─────────┐    │
│  │ 订单页   │    │  │  │ 活动页   │    │
│  └─────────┘    │  │  └─────────┘    │
└─────────────────┘  └─────────────────┘

整个小程序所有分包大小不超过 20MB
```

### 8.2 分包配置

在 `app.json` 中配置：

```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "subPackages": [
    {
      "root": "packageA",
      "name": "order",
      "pages": [
        "pages/order/list",
        "pages/order/detail"
      ]
    },
    {
      "root": "packageB",
      "name": "activity",
      "pages": [
        "pages/activity/index"
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["order"]
    }
  }
}
```

### 8.3 分包目录结构

```
my-miniprogram/
├── pages/              # 主包页面
├── packageA/           # 分包A
│   └── pages/
│       ├── order/
│       │   ├── list.js
│       │   └── detail.js
├── packageB/           # 分包B
│   └── pages/
│       └── activity/
└── app.json
```

### 8.4 分包限制

| 限制项           | 限制值  |
| ---------------- | ------- |
| 单个分包/主包大小 | 2MB     |
| 所有分包总大小   | 20MB    |
| 分包数量         | 无限制  |
| 分包层级         | 不支持嵌套 |

---

## 九、使用 npm 包

小程序支持使用 npm 包，但需要特殊配置。

### 9.1 安装 npm 包

```bash
# 在项目根目录初始化
npm init -y

# 安装包
npm install miniprogram-sm-crypto --save
```

### 9.2 构建 npm

1. 在开发者工具中：菜单「工具」→「构建 npm」
2. 构建后会生成 `miniprogram_npm/` 目录
3. 在代码中使用：

```javascript
const sm = require('miniprogram-sm-crypto')
```

> ⚠️ **注意**：
> - 不是所有 npm 包都能用，必须支持小程序环境
> - 不能使用 Node.js 核心模块（fs、path 等）
> - 构建后 `miniprogram_npm/` 不需要提交 git

---

## 十、总结

### ✅ 关键知识点

1. **目录结构**：`pages/` 页面、`components/` 组件、`utils/` 工具
2. **app.json**：全局配置，包括 pages、window、tabBar
3. **页面配置**：覆盖全局 window，配置 usingComponents
4. **app.js**：全局逻辑、生命周期、globalData
5. **app.wxss**：全局样式，rpx 单位
6. **分包**：优化包大小和启动速度
7. **npm 支持**：构建 npm 后使用第三方包

### 🔜 下一章

- 下一章：[开发详解](/web/miniprogram/03-development/)
- 上一章：[创建小程序](/web/miniprogram/01-create/)
- 上一级：[小程序开发](/web/miniprogram/)
