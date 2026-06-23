---
title: 开发详解
---

# 小程序开发详解

> 本章是小程序开发的核心，涵盖 WXML 模板语法、数据绑定、事件处理、列表渲染、条件渲染、自定义组件、生命周期和常用 API。

---

## 一、WXML 模板语法

WXML（WeiXin Markup Language）是小程序的模板语言，类似 HTML 但有数据绑定能力。

### 1.1 数据绑定

使用 Mustache 语法 `{{ }}` 绑定数据：

```xml
<!--index.wxml-->
<view>
  <!-- 简单绑定 -->
  <text>{{message}}</text>

  <!-- 属性绑定 -->
  <view id="item-{{id}}">属性绑定</view>

  <!-- 表达式运算 -->
  <text>{{a + b}}</text>
  <text>{{flag ? '是' : '否'}}</text>
  <text>{{length > 5 ? '长' : '短'}}</text>

  <!-- 字符串拼接 -->
  <text>{{'Hello ' + name}}</text>

  <!-- 对象属性访问 -->
  <text>{{user.name}}</text>
  <text>{{user.address.city}}</text>

  <!-- 数组访问 -->
  <text>{{list[0]}}</text>
</view>
```

```javascript
// index.js
Page({
  data: {
    message: 'Hello 小程序',
    id: 1,
    a: 10,
    b: 20,
    flag: true,
    length: 8,
    name: '张三',
    user: {
      name: '李四',
      address: { city: '北京' }
    },
    list: ['苹果', '香蕉', '橙子']
  }
})
```

> ⚠️ **注意**：`{{}}` 内只能放**表达式**，不能放**语句**（如 `if`、`for`、`var` 声明等）。

### 1.2 条件渲染

#### wx:if

```xml
<view wx:if="{{score >= 90}}">优秀</view>
<view wx:elif="{{score >= 60}}">及格</view>
<view wx:else>不及格</view>
```

#### hidden

```xml
<view hidden="{{!isLogin}}">已登录</view>
```

#### wx:if vs hidden

| 特性         | `wx:if`              | `hidden`              |
| ------------ | -------------------- | --------------------- |
| **渲染方式** | 条件为 false 时移除  | 始终渲染，仅切换 display |
| **切换开销** | 高（重新渲染）       | 低（仅样式切换）       |
| **初始开销** | 低（false 时不渲染） | 高（始终渲染）         |
| **适用场景** | 不频繁切换           | 频繁切换               |

#### block 标签

`<block>` 是一个包装元素，不会在页面中产生实际节点，用于控制多个元素：

```xml
<block wx:if="{{isVip}}">
  <view>VIP 专属内容 1</view>
  <view>VIP 专属内容 2</view>
  <view>VIP 专属内容 3</view>
</block>
```

### 1.3 列表渲染

#### wx:for

```xml
<!-- 基础用法 -->
<view wx:for="{{list}}" wx:key="index">
  {{index}}: {{item}}
</view>

<!-- 指定变量名 -->
<view wx:for="{{list}}" wx:for-index="idx" wx:for-item="name" wx:key="idx">
  {{idx}}: {{name}}
</view>

<!-- 对象数组 -->
<view wx:for="{{users}}" wx:key="id">
  {{item.name}} - {{item.age}}岁
</view>
```

```javascript
Page({
  data: {
    list: ['苹果', '香蕉', '橙子'],
    users: [
      { id: 1, name: '张三', age: 20 },
      { id: 2, name: '李四', age: 25 },
      { id: 3, name: '王五', age: 30 }
    ]
  }
})
```

#### wx:key 的作用

`wx:key` 用于列表渲染的性能优化和状态保持：

```xml
<!-- ✅ 推荐：使用唯一字段 -->
<view wx:for="{{users}}" wx:key="id">{{item.name}}</view>

<!-- ✅ 推荐：item 是基本类型且唯一 -->
<view wx:for="{{list}}" wx:key="*this">{{item}}</view>

<!-- ⚠️ 不推荐：使用 index（数据变化时可能导致状态错乱） -->
<view wx:for="{{users}}" wx:key="index">{{item.name}}</view>
```

> ⚠️ **重要**：`wx:key` 的值不要加 `{{}}`，直接写字段名或 `*this`。

#### 嵌套循环

```xml
<view wx:for="{{matrix}}" wx:for-item="row" wx:key="*this">
  <view wx:for="{{row}}" wx:for-item="cell" wx:key="*this">
    {{cell}}
  </view>
</view>
```

---

## 二、事件处理

### 2.1 事件绑定方式

```xml
<!-- bind：事件冒泡 -->
<view bindtap="handleTap">点击我</view>

<!-- catch：阻止事件冒泡 -->
<view catchtap="handleTap">点击我（不冒泡）</view>

<!-- mut-bind：互斥事件绑定 -->
<view mut-bind:tap="handleTap">互斥绑定</view>

<!-- capture-bind：捕获阶段 -->
<view capture-bind:tap="handleTap">捕获阶段触发</view>

<!-- capture-catch：捕获阶段并阻止 -->
<view capture-catch:tap="handleTap">捕获并阻止</view>
```

### 2.2 事件对象

```javascript
Page({
  handleTap(event) {
    console.log(event)
    // event.type           事件类型
    // event.target         触发事件的组件
    // event.currentTarget  当前组件（绑定事件的）
    // event.detail         额外信息
    // event.touches        触摸点信息
    // event.timeStamp      时间戳
  }
})
```

### 2.3 传参方式

小程序事件不能直接传参，通过 `data-*` 属性传递：

```xml
<view
  bindtap="handleTap"
  data-id="{{item.id}}"
  data-name="{{item.name}}"
  data-index="{{index}}">
  {{item.name}}
</view>
```

```javascript
Page({
  handleTap(event) {
    // 通过 currentTarget.dataset 获取参数
    const { id, name, index } = event.currentTarget.dataset
    console.log(id, name, index)
  }
})
```

> ⚠️ **注意**：`data-*` 属性名会自动转为小驼峰。如 `data-user-name` → `dataset.userName`。

### 2.4 常用事件

| 事件         | 触发时机           | 说明                   |
| ------------ | ------------------ | ---------------------- |
| `bindtap`    | 点击               | 最常用                 |
| `bindlongpress` | 长按            | 长按 350ms 以上        |
| `bindinput`  | 输入框输入         | input 组件             |
| `bindchange` | 值改变             | switch、picker 等      |
| `bindsubmit` | 表单提交           | form 组件              |
| `bindscroll` | 滚动               | scroll-view 组件       |
| `bindtouchstart` | 触摸开始       | 触摸事件               |
| `bindtouchmove`  | 触摸移动       | 触摸事件               |
| `bindtouchend`   | 触摸结束       | 触摸事件               |

---

## 三、页面生命周期

### 3.1 页面生命周期图

```
┌──────────────────────────────────────────────────────────┐
│                     页面生命周期                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   onLoad ──▶ onShow ──▶ onReady                          │
│      │          │          │                             │
│      │          │          ▼                             │
│      │          │     页面已渲染                          │
│      │          │          │                             │
│      │          ▼          ▼                             │
│      │     onHide ──▶ onShow（可多次切换）                │
│      │                                                  │
│      ▼                                                  │
│   onUnload（页面卸载）                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.2 生命周期详解

```javascript
Page({
  data: {},

  // 页面加载（只触发一次）
  // 可获取页面参数 options
  onLoad(options) {
    console.log('页面加载', options)
    // options 是其他页面跳转传来的参数
    // 如 wx.navigateTo({ url: '/pages/detail?id=123' })
    // 则 options.id === '123'
  },

  // 页面显示（每次显示都触发）
  onShow() {
    console.log('页面显示')
  },

  // 页面初次渲染完成（只触发一次）
  onReady() {
    console.log('页面渲染完成')
    // 可以在这里获取节点信息
  },

  // 页面隐藏（切到其他页面、切后台）
  onHide() {
    console.log('页面隐藏')
  },

  // 页面卸载（navigateBack、redirectTo）
  onUnload() {
    console.log('页面卸载')
    // 清理定时器、事件监听等
  },

  // 下拉刷新（需在 json 中开启 enablePullDownRefresh）
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreshData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 上拉触底（距离底部 onReachBottomDistance 时触发）
  onReachBottom() {
    console.log('上拉触底')
    this.loadMore()
  },

  // 页面滚动
  onPageScroll(options) {
    console.log('滚动距离', options.scrollTop)
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '自定义分享标题',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '自定义分享朋友圈标题',
      query: 'id=123'
    }
  },

  // 窗口尺寸变化
  onResize() {
    console.log('窗口尺寸变化')
  }
})
```

### 3.3 生命周期使用场景

| 生命周期       | 典型用途                              |
| -------------- | ------------------------------------- |
| `onLoad`       | 初始化数据、获取页面参数、首次请求接口 |
| `onShow`       | 刷新数据（从其他页面返回时）          |
| `onReady`      | 获取节点信息、初始化图表              |
| `onHide`       | 暂停视频播放、停止定时器              |
| `onUnload`     | 清理定时器、取消请求                  |
| `onPullDownRefresh` | 下拉刷新数据                     |
| `onReachBottom` | 上拉加载更多                         |

---

## 四、页面跳转与传参

### 4.1 跳转 API 对比

| API                    | 行为                         | 是否保留当前页 | 适用页面       |
| ---------------------- | ---------------------------- | -------------- | -------------- |
| `wx.navigateTo`        | 保留当前页，跳转到新页       | ✅              | 普通页面       |
| `wx.redirectTo`        | 关闭当前页，跳转到新页       | ❌              | 普通页面       |
| `wx.switchTab`         | 跳转到 tabBar 页面           | ❌              | 仅 tabBar 页面 |
| `wx.reLaunch`          | 关闭所有页面，跳转到新页     | ❌              | 任意页面       |
| `wx.navigateBack`      | 返回上一页                   | -              | -              |

### 4.2 跳转传参

```javascript
// 跳转并传参
wx.navigateTo({
  url: '/pages/detail/detail?id=123&name=张三'
})

// 目标页接收参数
Page({
  onLoad(options) {
    console.log(options.id)    // '123'
    console.log(options.name)  // '张三'
  }
})
```

### 4.3 返回并传参

使用事件通道或全局数据传参：

```javascript
// 页面 A：跳转时注册事件
wx.navigateTo({
  url: '/pages/form/form',
  events: {
    // 监听 form 页面触发的事件
    formSubmitted(data) {
      console.log('收到表单数据', data)
    }
  },
  success(res) {
    // 向 form 页面发送数据
    res.eventChannel.emit('pageData', { id: 1 })
  }
})

// 页面 B：获取并触发事件
Page({
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听 A 页面发来的数据
    eventChannel.on('pageData', (data) => {
      console.log('收到 A 页面数据', data)
    })
  },
  onSubmit() {
    const eventChannel = this.getOpenerEventChannel()
    // 向 A 页面发送数据
    eventChannel.emit('formSubmitted', { name: '张三' })
    wx.navigateBack()
  }
})
```

---

## 五、常用内置组件

### 5.1 视图容器

```xml
<!-- view：类似 div -->
<view class="box">内容</view>

<!-- scroll-view：可滚动视图 -->
<scroll-view scroll-y class="scroll" bindscroll="onScroll">
  <view wx:for="{{100}}" wx:key="*this">{{item}}</view>
</scroll-view>

<!-- swiper：轮播图 -->
<swiper
  indicator-dots="{{true}}"
  autoplay="{{true}}"
  interval="3000"
  circular="{{true}}">
  <swiper-item>
    <image src="/images/banner1.jpg" mode="aspectFill" />
  </swiper-item>
  <swiper-item>
    <image src="/images/banner2.jpg" mode="aspectFill" />
  </swiper-item>
</swiper>

<!-- movable-view：可移动视图 -->
<movable-area>
  <movable-view direction="all">拖动我</movable-view>
</movable-area>

<!-- cover-view：覆盖在原生组件上的视图 -->
<cover-view class="overlay">覆盖层</cover-view>
```

### 5.2 基础内容

```xml
<!-- text：文本（只能包含文本） -->
<text>普通文本</text>
<text selectable>{{message}}</text>  <!-- 可选中 -->

<!-- image：图片 -->
<image
  src="{{imageUrl}}"
  mode="aspectFill"
  lazy-load="{{true}}"
  binderror="onImageError" />

<!-- mode 值说明：
  scaleToFill - 拉伸填满（默认，不保比例）
  aspectFit   - 长边适配，完整显示
  aspectFill  - 短边适配，裁剪填充
  widthFix    - 宽度不变，高度自适应
  heightFix   - 高度不变，宽度自适应
-->

<!-- rich-text：富文本 -->
<rich-text nodes="{{htmlNodes}}" />

<!-- icon：图标 -->
<icon type="success" size="40" />
<icon type="warn" size="40" />
<icon type="search" size="40" />
```

### 5.3 表单组件

```xml
<!-- button -->
<button type="primary" bindtap="onSubmit">提交</button>
<button type="default" loading="{{loading}}">加载中</button>
<button type="warn" disabled="{{disabled}}">禁用</button>
<button open-type="share">分享</button>
<button open-type="getUserInfo" bindgetuserinfo="onGetUserInfo">获取头像</button>

<!-- input -->
<input
  type="text"
  placeholder="请输入用户名"
  value="{{username}}"
  bindinput="onInput"
  maxlength="20" />

<!-- textarea -->
<textarea
  placeholder="请输入内容"
  value="{{content}}"
  bindinput="onContentInput"
  maxlength="200"
  show-confirm-bar="{{false}}" />

<!-- picker：选择器 -->
<picker mode="selector" range="{{array}}" bindchange="onPickerChange">
  <view>当前选择：{{array[index]}}</view>
</picker>

<picker mode="date" value="{{date}}" bindchange="onDateChange">
  <view>日期：{{date}}</view>
</picker>

<!-- switch -->
<switch checked="{{checked}}" bindchange="onSwitchChange" />

<!-- checkbox-group -->
<checkbox-group bindchange="onCheckboxChange">
  <label><checkbox value="A" checked />选项A</label>
  <label><checkbox value="B" />选项B</label>
</checkbox-group>

<!-- radio-group -->
<radio-group bindchange="onRadioChange">
  <label><radio value="male" checked />男</label>
  <label><radio value="female" />女</label>
</radio-group>

<!-- form -->
<form bindsubmit="onFormSubmit" bindreset="onFormReset">
  <input name="username" placeholder="用户名" />
  <input name="password" type="password" placeholder="密码" />
  <button form-type="submit">提交</button>
  <button form-type="reset">重置</button>
</form>
```

### 5.4 媒体组件

```xml
<!-- audio（已不推荐，使用 wx.createInnerAudioContext） -->
<!-- video -->
<video
  src="{{videoUrl}}"
  controls
  autoplay
  loop
  muted
  poster="{{posterUrl}}"
  bindplay="onPlay"
  bindpause="onPause"
  bindended="onEnded" />

<!-- camera：相机 -->
<camera
  device-position="back"
  flash="auto"
  binderror="onCameraError">
  <cover-view>拍照</cover-view>
</camera>

<!-- live-player：实时音视频播放 -->
<!-- live-pusher：实时音视频推流 -->
```

### 5.5 地图与画布

```xml
<!-- map：地图 -->
<map
  longitude="{{longitude}}"
  latitude="{{latitude}}"
  markers="{{markers}}"
  scale="15"
  show-location
  bindmarkertap="onMarkerTap" />

<!-- canvas：画布 -->
<canvas
  type="2d"
  id="myCanvas"
  style="width: 300px; height: 200px;" />
```

---

## 六、自定义组件

### 6.1 创建组件

1. 在 `components/` 目录下创建组件文件夹
2. 右键「新建 Component」，输入名称

组件由四个文件组成（与页面类似）：

```
components/card/
├── card.js
├── card.json
├── card.wxml
└── card.wxss
```

### 6.2 组件配置

```json
// card.json
{
  "component": true,
  "usingComponents": {}
}
```

### 6.3 组件结构

```xml
<!-- card.wxml -->
<view class="card">
  <view class="card-title">{{title}}</view>
  <view class="card-content">
    <slot></slot>
  </view>
  <view class="card-footer" wx:if="{{showFooter}}">
    <slot name="footer"></slot>
  </view>
</view>
```

```css
/* card.wxss */
.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}
.card-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.card-content {
  color: #666;
}
```

```javascript
// card.js
Component({
  // 组件属性（外部传入）
  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
    showFooter: {
      type: Boolean,
      value: false
    }
  },

  // 组件内部数据
  data: {
    count: 0
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      console.log('组件挂载')
    },
    detached() {
      console.log('组件卸载')
    }
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      console.log('页面显示')
    },
    hide() {
      console.log('页面隐藏')
    }
  },

  // 组件方法
  methods: {
    handleTap() {
      this.setData({ count: this.data.count + 1 })
      // 触发自定义事件，通知父组件
      this.triggerEvent('tap', { count: this.data.count })
    }
  }
})
```

### 6.4 使用组件

在页面的 `json` 中注册：

```json
{
  "usingComponents": {
    "card": "/components/card/card"
  }
}
```

在 `wxml` 中使用：

```xml
<card
  title="用户信息"
  show-footer="{{true}}"
  bind:tap="onCardTap">

  <!-- 默认插槽 -->
  <view>这是卡片内容</view>

  <!-- 具名插槽 -->
  <view slot="footer">
    <button size="mini">编辑</button>
  </view>
</card>
```

```javascript
Page({
  onCardTap(event) {
    console.log('卡片点击', event.detail.count)
  }
})
```

### 6.5 组件通信

```
┌─────────────────────────────────────────┐
│              父组件（页面）              │
│                                         │
│    ┌─────────────────────────────┐      │
│    │      子组件（Component）     │      │
│    │                             │      │
│    │  properties ← 父传子        │      │
│    │  triggerEvent → 子传父      │      │
│    │                             │      │
│    └─────────────────────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

**父传子**：通过 `properties`

```xml
<card title="{{title}}" />
```

**子传父**：通过 `triggerEvent`

```javascript
// 子组件
this.triggerEvent('change', { value: 123 })

// 父组件
<card bind:change="onCardChange" />
```

**父获取子实例**：通过 `selectComponent`

```xml
<card id="myCard" />
```

```javascript
// 父组件
const card = this.selectComponent('#myCard')
card.someMethod()
```

---

## 七、setData 详解

`setData` 是小程序修改数据并触发视图更新的唯一方式。

### 7.1 基本用法

```javascript
Page({
  data: {
    user: { name: '张三', age: 20 },
    list: [1, 2, 3]
  },

  update() {
    // 修改简单数据
    this.setData({ message: 'hello' })

    // 修改对象属性
    this.setData({ 'user.name': '李四' })

    // 修改数组某一项
    this.setData({ 'list[0]': 10 })

    // 修改数组（追加）
    this.setData({ list: [...this.data.list, 4] })
  }
})
```

### 7.2 setData 性能优化

```javascript
// ❌ 错误：直接修改 data 不触发更新
this.data.count = 1

// ❌ 错误：频繁 setData
this.setData({ a: 1 })
this.setData({ b: 2 })
this.setData({ c: 3 })

// ✅ 正确：合并 setData
this.setData({ a: 1, b: 2, c: 3 })

// ❌ 错误：传递大量不需要的数据
this.setData({ hugeList: this.data.hugeList })

// ✅ 正确：只传递变化的部分
this.setData({ 'hugeList[0].name': '新名字' })

// ❌ 错误：在频繁触发的回调中 setData（如 scroll）
onPageScroll(e) {
  this.setData({ scrollTop: e.scrollTop })  // 性能差
}

// ✅ 正确：节流处理
onPageScroll(e) {
  if (this.timer) return
  this.timer = setTimeout(() => {
    this.setData({ scrollTop: e.scrollTop })
    this.timer = null
  }, 50)
}
```

### 7.3 setData 注意事项

| 注意点                          | 说明                                   |
| ------------------------------- | -------------------------------------- |
| **不要直接修改 data**           | 必须用 `setData` 才能触发更新          |
| **合并 setData**                | 多次修改合并为一次                     |
| **只传变化的数据**              | 避免传递大量未变化的数据               |
| **避免频繁 setData**            | 特别是在 scroll、touchmove 等回调中    |
| **不要在 setData 回调中读 data**| 回调中读取的是最新值，但视图可能未更新 |

---

## 八、常用 API

### 8.1 网络请求

#### wx.request

```javascript
// 基础请求
wx.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  data: { page: 1, size: 10 },
  header: {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  success(res) {
    console.log(res.data)
  },
  fail(err) {
    console.error(err)
  },
  complete() {
    console.log('请求完成')
  }
})

// Promise 封装
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: resolve,
      fail: reject
    })
  })
}

// 使用
request({
  url: 'https://api.example.com/users',
  method: 'GET'
}).then(res => {
  console.log(res.data)
}).catch(err => {
  console.error(err)
})
```

#### 文件上传与下载

```javascript
// 上传文件
wx.uploadFile({
  url: 'https://api.example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: { userId: 123 },
  success(res) {
    const data = JSON.parse(res.data)
    console.log(data)
  }
})

// 下载文件
wx.downloadFile({
  url: 'https://example.com/file.pdf',
  success(res) {
    if (res.statusCode === 200) {
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath,
        success() {
          console.log('打开成功')
        }
      })
    }
  }
})
```

### 8.2 数据缓存

```javascript
// 同步存储
wx.setStorageSync('token', 'abc123')
wx.setStorageSync('user', { name: '张三', age: 20 })

// 同步读取
const token = wx.getStorageSync('token')
const user = wx.getStorageSync('user')

// 同步删除
wx.removeStorageSync('token')

// 清空所有
wx.clearStorageSync()

// 异步存储
wx.setStorage({
  key: 'token',
  data: 'abc123',
  success() {
    console.log('存储成功')
  }
})

// 获取存储信息
const info = wx.getStorageInfoSync()
console.log(info.keys)      // 所有 key
console.log(info.currentSize) // 当前占用大小（KB）
console.log(info.limitSize)   // 限制大小（KB）
```

> 💡 单个 key 上限 1MB，所有数据上限 10MB。

### 8.3 交互反馈

```javascript
// Toast
wx.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})

// Loading
wx.showLoading({ title: '加载中' })
setTimeout(() => wx.hideLoading(), 2000)

// Modal
wx.showModal({
  title: '提示',
  content: '确定删除吗？',
  success(res) {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})

// ActionSheet
wx.showActionSheet({
  itemList: ['拍照', '从相册选择'],
  success(res) {
    console.log(res.tapIndex)
  }
})
```

### 8.4 导航栏与状态栏

```javascript
// 设置导航栏标题
wx.setNavigationBarTitle({ title: '新标题' })

// 设置导航栏颜色
wx.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#07c160'
})

// 显示/隐藏 tabBar
wx.showTabBar()
wx.hideTabBar()

// 显示返回首页按钮
wx.showHomeButton()
```

### 8.5 设备信息

```javascript
// 获取系统信息
const systemInfo = wx.getSystemInfoSync()
console.log(systemInfo)
// systemInfo.platform    - ios / android / devtools
// systemInfo.pixelRatio  - 设备像素比
// systemInfo.windowWidth - 窗口宽度
// systemInfo.windowHeight- 窗口高度
// systemInfo.statusBarHeight - 状态栏高度
// systemInfo.brand       - 设备品牌
// systemInfo.model       - 设备型号
// systemInfo.system      - 操作系统版本
// systemInfo.version     - 微信版本号
// systemInfo.SDKVersion  - 小程序基础库版本

// 获取设备网络状态
wx.getNetworkType({
  success(res) {
    console.log(res.networkType) // wifi / 2g / 3g / 4g / 5g / none
  }
})

// 监听网络变化
wx.onNetworkStatusChange((res) => {
  console.log(res.isConnected, res.networkType)
})

// 获取屏幕亮度
wx.getScreenBrightness({
  success(res) {
    console.log(res.value)
  }
})

// 震动
wx.vibrateShort()  // 短震动
wx.vibrateLong()   // 长震动
```

### 8.6 用户信息与授权

```javascript
// 获取用户信息（需用户授权）
wx.getUserProfile({
  desc: '用于完善用户资料',
  success(res) {
    console.log(res.userInfo)
    // res.userInfo.nickName  - 昵称
    // res.userInfo.avatarUrl - 头像
    // res.userInfo.gender    - 性别
  }
})

// 获取用户位置（需授权）
wx.getLocation({
  type: 'wgs84',
  success(res) {
    console.log(res.latitude, res.longitude)
  }
})

// 检查授权状态
wx.getSetting({
  success(res) {
    if (res.authSetting['scope.userLocation']) {
      console.log('已授权位置')
    } else {
      console.log('未授权位置')
    }
  }
})

// 打开设置页
wx.openSetting({
  success(res) {
    console.log(res.authSetting)
  }
})
```

### 8.7 分享

```javascript
Page({
  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '这个小程序真好用',
      path: '/pages/index/index?id=123',
      imageUrl: '/images/share.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '快来体验',
      query: 'id=123'
    }
  }
})
```

---

## 九、WXS 脚本

WXS 是小程序的脚本语言，运行在视图层，用于在 WXML 中做数据处理。

### 9.1 为什么需要 WXS？

```
┌─────────────────────────────────────────┐
│              小程序架构                  │
├─────────────────────────────────────────┤
│                                         │
│  逻辑层（JS）         视图层（WXML）     │
│  ┌─────────┐          ┌─────────┐       │
│  │  Page   │ ←通信→   │  WXS    │       │
│  │  数据   │          │  渲染   │       │
│  └─────────┘          └─────────┘       │
│                                         │
│  问题：在 WXML 中调用 JS 函数性能差      │
│  解决：WXS 在视图层运行，无需通信        │
│                                         │
└─────────────────────────────────────────┘
```

### 9.2 WXS 使用

```xml
<!-- 内联 WXS -->
<wxs module="format">
  var toFixed = function(value, num) {
    return value.toFixed(num)
  }
  var formatDate = function(timestamp) {
    var date = getDate(timestamp)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
  module.exports = {
    toFixed: toFixed,
    formatDate: formatDate
  }
</wxs>

<view>价格：{{format.toFixed(price, 2)}}</view>
<view>日期：{{format.formatDate(time)}}</view>
```

```xml
<!-- 外部 WXS 文件 -->
<!-- /utils/format.wxs -->
var toFixed = function(value, num) {
  return value.toFixed(num)
}
module.exports = { toFixed: toFixed }

<!-- 使用 -->
<wxs src="/utils/format.wxs" module="format" />
<view>{{format.toFixed(price, 2)}}</view>
```

### 9.3 WXS 注意事项

- WXS 语法与 JS 类似，但**不是完整的 JS**
- 不能使用 ES6+ 语法（如箭头函数、let、const、模板字符串）
- 不能调用小程序 API
- 数据类型有限：Number、String、Boolean、Array、Object、null、undefined
- 适合做格式化、过滤等简单操作

---

## 十、总结

### ✅ 关键知识点

1. **WXML 语法**：`{{}}` 数据绑定、`wx:if`/`wx:for` 条件与列表渲染
2. **事件处理**：`bind`/`catch`、`data-*` 传参、事件对象
3. **生命周期**：`onLoad`/`onShow`/`onReady`/`onHide`/`onUnload`
4. **页面跳转**：`navigateTo`/`redirectTo`/`switchTab`/`navigateBack`
5. **内置组件**：view、text、image、input、button、picker、swiper 等
6. **自定义组件**：Component、properties、methods、triggerEvent、slot
7. **setData**：合并调用、只传变化数据、避免频繁调用
8. **常用 API**：网络请求、缓存、交互反馈、设备信息、分享
9. **WXS**：视图层脚本，用于数据格式化

### 🔜 下一章

- 下一章：[部署与发布](/web/miniprogram/04-deploy/)
- 上一章：[项目结构与配置](/web/miniprogram/02-structure/)
- 上一级：[小程序开发](/web/miniprogram/)
