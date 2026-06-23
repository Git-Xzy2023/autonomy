---
title: 跨端开发
---

# 跨端开发（uni-app、Taro）

> 当需要同时发布到多个小程序平台（微信、支付宝、字节等）甚至 H5、App 时，使用跨端框架可以大幅降低开发成本。本章介绍主流的跨端方案 uni-app 和 Taro。

---

## 一、为什么需要跨端框架？

### 1.1 多端开发的痛点

```
┌─────────────────────────────────────────────────────┐
│              传统多端开发                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  微信小程序    支付宝小程序   字节小程序   H5   App  │
│  ┌────────┐   ┌────────┐    ┌────────┐  ┌──┐ ┌──┐  │
│  │WXML    │   │AXML    │    │TTML    │  │HTM│ │RN │  │
│  │WXSS    │   │ACSS    │    │TTSS    │  │L  │ │   │  │
│  │JS      │   │JS      │    │JS      │  │CSS│ │   │  │
│  └────────┘   └────────┘    └────────┘  └──┘ └──┘  │
│                                                     │
│  问题：5 套代码、5 套技术栈、5 倍工作量              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 1.2 跨端框架的优势

```
┌─────────────────────────────────────────────────────┐
│              跨端开发                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│              一套代码                                │
│         ┌─────────────────┐                         │
│         │  uni-app / Taro │                         │
│         │  (Vue / React)  │                         │
│         └────────┬────────┘                         │
│                  │                                  │
│    ┌─────┬───────┼───────┬─────┬─────┐              │
│    ▼     ▼       ▼       ▼     ▼     ▼              │
│  微信  支付宝  字节    百度   H5   App              │
│                                                     │
│  优势：1 套代码、统一技术栈、降低维护成本            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 1.3 跨端框架的代价

- ❌ 性能略低于原生开发
- ❌ 平台特有功能需要条件编译
- ❌ 框架本身有学习成本
- ❌ 部分高级特性可能不支持
- ❌ 调试相对复杂

---

## 二、主流跨端框架对比

| 特性           | uni-app         | Taro             | mpvue（已停止维护） |
| -------------- | --------------- | ---------------- | ------------------- |
| **开发框架**   | Vue             | React/Vue/Solid  | Vue                 |
| **支持平台**   | 全平台          | 全平台           | 仅小程序            |
| **维护方**     | DCloud          | 京东             | 美团（已停更）      |
| **生态**       | 丰富（插件市场）| 丰富             | 较少                |
| **学习成本**   | 低（Vue 用户）  | 中               | 低                  |
| **性能**       | 良好            | 良好             | 一般                |
| **H5 支持**    | ✅              | ✅               | ❌                  |
| **App 支持**   | ✅（nvue）      | ✅（RN）         | ❌                  |
| **TypeScript** | ✅              | ✅               | ❌                  |
| **社区活跃度** | 高              | 高               | 低                  |

> 💡 **选择建议**：
> - 熟悉 **Vue** → 选 **uni-app**
> - 熟悉 **React** → 选 **Taro**
> - 只做小程序 → 两者皆可，看团队技术栈

---

## 三、uni-app

### 3.1 简介

uni-app 是 DCloud 推出的使用 Vue.js 开发所有前端应用的框架，一套代码可发布到 iOS、Android、H5、以及各种小程序。

### 3.2 创建项目

**方式一：HBuilderX（推荐）**

1. 下载 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 文件 → 新建 → 项目 → uni-app
3. 选择模板，填写项目名

**方式二：CLI 创建**

```bash
# Vue 3 + Vite 版本（推荐）
npx degit dcloudio/uni-preset-vue#vite-ts my-uni-app

# Vue 2 版本
npx degit dcloudio/uni-preset-vue my-uni-app

cd my-uni-app
npm install
```

### 3.3 项目结构

```
my-uni-app/
├── src/
│   ├── pages/                  # 页面
│   │   ├── index/
│   │   │   └── index.vue
│   │   └── about/
│   │       └── about.vue
│   ├── static/                 # 静态资源
│   ├── components/             # 组件
│   ├── store/                  # 状态管理（Pinia/Vuex）
│   ├── utils/                  # 工具函数
│   ├── App.vue                 # 应用入口
│   ├── main.js                 # 入口文件
│   ├── pages.json              # 页面配置（类似 app.json）
│   ├── manifest.json           # 应用配置
│   └── uni.scss                # 全局样式变量
├── package.json
└── vite.config.ts
```

### 3.4 页面开发

```vue
<!-- src/pages/index/index.vue -->
<template>
  <view class="container">
    <text class="title">{{ title }}</text>
    <view class="count">点击次数：{{ count }}</view>
    <button type="primary" @click="increment">+1</button>
    <view class="list">
      <view v-for="item in list" :key="item.id" class="item">
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('Hello uni-app')
const count = ref(0)
const list = ref([
  { id: 1, name: '苹果' },
  { id: 2, name: '香蕉' },
  { id: 3, name: '橙子' }
])

function increment() {
  count.value++
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #07c160;
}
.count {
  margin: 20rpx 0;
  font-size: 32rpx;
}
.list {
  margin-top: 40rpx;
}
.item {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}
</style>
```

### 3.5 pages.json 配置

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/about/about",
      "style": {
        "navigationBarTitleText": "关于"
      }
    }
  ],
  "globalStyle": {
    "navigationBarBackgroundColor": "#07c160",
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "uni-app",
    "backgroundColor": "#f5f5f5"
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#07c160",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tab/home.png",
        "selectedIconPath": "static/tab/home-active.png"
      },
      {
        "pagePath": "pages/about/about",
        "text": "关于",
        "iconPath": "static/tab/about.png",
        "selectedIconPath": "static/tab/about-active.png"
      }
    ]
  }
}
```

### 3.6 运行与编译

```bash
# 开发模式
npm run dev:mp-weixin      # 微信小程序
npm run dev:mp-alipay      # 支付宝小程序
npm run dev:mp-toutiao     # 字节小程序
npm run dev:h5             # H5
npm run dev:app            # App（需 HBuilderX）

# 生产构建
npm run build:mp-weixin
npm run build:h5
```

编译微信小程序后，在 `dist/dev/mp-weixin` 或 `dist/build/mp-weixin` 目录会生成小程序代码，用微信开发者工具打开此目录即可预览。

### 3.7 条件编译

不同平台有差异时，使用条件编译：

```vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view>仅微信小程序显示</view>
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY -->
    <view>仅支付宝小程序显示</view>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <view>仅 H5 显示</view>
    <!-- #endif -->

    <!-- #ifndef MP-WEIXIN -->
    <view>非微信小程序都显示</view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  methods: {
    // #ifdef MP-WEIXIN
    weixinLogin() {
      // 微信登录逻辑
    },
    // #endif

    // #ifdef H5
    h5Login() {
      // H5 登录逻辑
    }
    // #endif
  }
}
</script>

<style>
/* #ifdef H5 */
.h5-only {
  color: red;
}
/* #endif */
</style>
```

**条件编译语法**：

| 语法         | 说明       | 平台值                                   |
| ------------ | ---------- | ---------------------------------------- |
| `#ifdef`     | 如果定义   | `MP-WEIXIN`、`MP-ALIPAY`、`H5`、`APP` 等 |
| `#ifndef`    | 如果未定义 | 同上                                     |
| `#endif`     | 结束       | -                                        |

### 3.8 uni-app API

uni-app 提供 `uni.*` API，与 `wx.*` 类似但跨平台：

```javascript
// 网络请求
uni.request({
  url: 'https://api.example.com/data',
  success(res) {
    console.log(res.data)
  }
})

// 存储
uni.setStorageSync('key', 'value')
const value = uni.getStorageSync('key')

// 导航
uni.navigateTo({ url: '/pages/about/about' })
uni.switchTab({ url: '/pages/index/index' })

// 交互
uni.showToast({ title: '成功', icon: 'success' })
uni.showLoading({ title: '加载中' })
uni.hideLoading()
```

> 💡 uni-app 也支持直接使用 `wx.*` API，但仅限微信小程序端。

---

## 四、Taro

### 4.1 简介

Taro 是京东凹凸实验室推出的跨端开发框架，支持 React、Vue、Solid 等多种框架语法。

### 4.2 创建项目

```bash
# 安装 CLI
npm install -g @tarojs/cli

# 创建项目
taro init my-taro-app
```

按提示选择：
- 框架：React / Vue3 / Preact / Solid
- 语言：TypeScript / JavaScript
- CSS：Sass / Less / Stylus
- 包管理：npm / yarn / pnpm

### 4.3 项目结构（React + TS）

```
my-taro-app/
├── src/
│   ├── pages/
│   │   ├── index/
│   │   │   ├── index.tsx        # 页面组件
│   │   │   ├── index.module.scss
│   │   │   └── index.config.ts  # 页面配置
│   │   └── profile/
│   │       └── index.tsx
│   ├── components/              # 组件
│   ├── store/                   # 状态管理
│   ├── services/                # 接口请求
│   ├── utils/
│   ├── app.ts                   # 入口
│   ├── app.config.ts            # 全局配置
│   ├── app.scss
│   └── index.html
├── config/                      # Taro 编译配置
│   ├── index.ts
│   ├── dev.ts
│   └── prod.ts
├── package.json
└── tsconfig.json
```

### 4.4 页面开发（React）

```tsx
// src/pages/index/index.tsx
import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.module.scss'

const list = [
  { id: 1, name: '苹果' },
  { id: 2, name: '香蕉' },
  { id: 3, name: '橙子' }
]

export default function Index() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const handleNavigate = () => {
    Taro.navigateTo({ url: '/pages/profile/index?id=123' })
  }

  return (
    <View className="container">
      <Text className="title">Hello Taro</Text>
      <View className="count">点击次数：{count}</View>
      <Button type="primary" onClick={handleIncrement}>+1</Button>

      <View className="list">
        {list.map(item => (
          <View key={item.id} className="item" onClick={handleNavigate}>
            {item.name}
          </View>
        ))}
      </View>
    </View>
  )
}
```

```scss
/* src/pages/index/index.module.scss */
.container {
  padding: 20rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #07c160;
}
.count {
  margin: 20rpx 0;
}
.item {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}
```

### 4.5 app.config.ts 全局配置

```typescript
export default {
  pages: [
    'pages/index/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#07c160',
    navigationBarTitleText: 'Taro App',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#07c160',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
}
```

### 4.6 运行与编译

```bash
# 开发模式
npm run dev:weapp       # 微信小程序
npm run dev:alipay      # 支付宝小程序
npm run dev:tt          # 字节小程序
npm run dev:h5          # H5
npm run dev:rn          # React Native

# 生产构建
npm run build:weapp
npm run build:h5
```

### 4.7 Taro 条件编译

```tsx
// 使用环境变量
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序特有逻辑
}

if (process.env.TARO_ENV === 'h5') {
  // H5 特有逻辑
}

// TARO_ENV 可选值：
// weapp / swan / alipay / tt / qq / jd / h5 / rn
```

```scss
/* CSS 条件编译 */
/* #ifdef weapp */
.weapp-only {
  color: red;
}
/* #endif */

/* #ifdef h5 */
.h5-only {
  color: blue;
}
/* #endif */
```

### 4.8 Taro API

```typescript
import Taro from '@tarojs/taro'

// 网络请求
Taro.request({
  url: 'https://api.example.com/data'
}).then(res => console.log(res.data))

// 存储
Taro.setStorageSync('key', 'value')
const value = Taro.getStorageSync('key')

// 导航
Taro.navigateTo({ url: '/pages/profile/index' })
Taro.switchTab({ url: '/pages/index/index' })

// 交互
Taro.showToast({ title: '成功', icon: 'success' })
```

---

## 五、跨端开发注意事项

### 5.1 平台差异

| 差异点         | 说明                                   |
| -------------- | -------------------------------------- |
| **组件差异**   | 部分组件在不同平台表现不同             |
| **API 差异**   | 平台特有 API 需条件编译                |
| **样式差异**   | 部分样式在各平台支持程度不同           |
| **支付差异**   | 各平台支付 API 不同                    |
| **登录差异**   | 微信 wx.login、支付宝 my.getAuthCode 等 |

### 5.2 样式注意事项

```scss
// ✅ 推荐：使用 rpx（跨端单位）
.box {
  width: 200rpx;
  height: 100rpx;
}

// ⚠️ 注意：部分平台不支持 *
// ❌ 不推荐
* {
  margin: 0;
}

// ✅ 推荐
view, text {
  margin: 0;
}

// ⚠️ 注意：不支持 body 选择器
// ❌ 错误
body {
  background: #fff;
}

// ✅ 推荐：使用 page
page {
  background: #fff;
}
```

### 5.3 接口请求封装

```typescript
// src/services/request.ts
import Taro from '@tarojs/taro'

const BASE_URL = process.env.TARO_ENV === 'h5'
  ? '/api'
  : 'https://api.example.com'

export function request<T = any>(options: {
  url: string
  method?: keyof Taro.request.Method
  data?: any
  header?: Record<string, string>
}): Promise<T> {
  const token = Taro.getStorageSync('token')

  return new Promise((resolve, reject) => {
    Taro.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          Taro.navigateTo({ url: '/pages/login/index' })
          reject(new Error('未授权'))
        } else {
          Taro.showToast({ title: '请求失败', icon: 'error' })
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail(err) {
        Taro.showToast({ title: '网络错误', icon: 'error' })
        reject(err)
      }
    })
  })
}
```

---

## 六、状态管理

### 6.1 uni-app + Pinia

```bash
npm install pinia
```

```typescript
// src/store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null as UserInfo | null
  }),
  actions: {
    async login(code: string) {
      const res = await uni.request({
        url: 'https://api.example.com/login',
        method: 'POST',
        data: { code }
      })
      this.token = res.data.token
      this.userInfo = res.data.userInfo
      uni.setStorageSync('token', this.token)
    },
    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
    }
  }
})
```

```typescript
// src/main.ts
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}
```

```vue
<!-- 使用 -->
<script setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const handleLogin = () => {
  uni.login({
    success(res) {
      userStore.login(res.code)
    }
  })
}
</script>

<template>
  <view>
    <text v-if="userStore.token">已登录</text>
    <button v-else @click="handleLogin">登录</button>
  </view>
</template>
```

### 6.2 Taro + Zustand

```bash
npm install zustand
```

```typescript
// src/store/user.ts
import { create } from 'zustand'
import Taro from '@tarojs/taro'

interface UserState {
  token: string
  userInfo: UserInfo | null
  login: (code: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  token: Taro.getStorageSync('token') || '',
  userInfo: null,

  async login(code) {
    const res = await Taro.request({
      url: 'https://api.example.com/login',
      method: 'POST',
      data: { code }
    })
    set({ token: res.data.token, userInfo: res.data.userInfo })
    Taro.setStorageSync('token', res.data.token)
  },

  logout() {
    set({ token: '', userInfo: null })
    Taro.removeStorageSync('token')
  }
}))
```

```tsx
// 使用
import { useUserStore } from '@/store/user'

function ProfilePage() {
  const { token, logout } = useUserStore()

  return (
    <View>
      {token ? (
        <Button onClick={logout}>退出登录</Button>
      ) : (
        <Text>未登录</Text>
      )}
    </View>
  )
}
```

---

## 七、跨端框架选择建议

### 7.1 选 uni-app 的情况

- ✅ 团队熟悉 Vue
- ✅ 需要同时开发 App 和小程序
- ✅ 想要丰富的插件市场
- ✅ 需要 nvue 原生渲染
- ✅ 项目需要快速开发

### 7.2 选 Taro 的情况

- ✅ 团队熟悉 React
- ✅ 需要 React 生态（React Query、Redux 等）
- ✅ 对 TypeScript 支持要求高
- ✅ 京东生态相关项目
- ✅ 需要 React Native 跨端

### 7.3 选原生开发的情况

- ✅ 只做微信小程序一个平台
- ✅ 对性能要求极高
- ✅ 需要使用最新的微信特有能力
- ✅ 项目简单，不需要跨端

---

## 八、总结

### ✅ 关键知识点

1. **跨端价值**：一套代码多端运行，降低开发和维护成本
2. **uni-app**：Vue 生态，DCloud 出品，支持全平台
3. **Taro**：React/Vue 生态，京东出品，支持全平台
4. **条件编译**：处理平台差异的核心手段
5. **API 统一**：uni.* / Taro.* API 跨平台调用
6. **状态管理**：可使用 Pinia / Zustand / Redux 等
7. **选择依据**：团队技术栈、项目需求、平台覆盖

### 📚 延伸阅读

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Taro 官方文档](https://docs.taro.zone/)
- [uni-app 插件市场](https://ext.dcloud.net.cn/)

### 🔚 学习路径完成

- 上一章：[部署与发布](/web/miniprogram/04-deploy/)
- 上一级：[小程序开发](/web/miniprogram/)

恭喜你完成了小程序从创建到部署的完整学习路径！🎉
