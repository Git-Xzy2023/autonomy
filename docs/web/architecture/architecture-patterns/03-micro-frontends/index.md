---
title: 微前端
---

# 微前端

> 微前端是一种将大型前端应用拆分为多个小型、独立应用的架构模式。

---

## 一、为什么需要微前端

### 1.1 痛点

```
┌─────────────────────────────────────────┐
│        巨石应用的问题                   │
├─────────────────────────────────────────┤
│                                         │
│  ❌ 构建慢：代码越来越多，构建几分钟   │
│  ❌ 部署慢：改一行代码，整个应用部署   │
│  ❌ 团队协作：多人修改同一仓库，冲突   │
│  ❌ 技术栈：难以升级框架或引入新技术   │
│  ❌ 独立性：一个模块崩溃，全站崩溃     │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 微前端的优势

| 优势         | 说明                                   |
| ------------ | -------------------------------------- |
| **独立部署** | 每个子应用独立部署，互不影响           |
| **技术栈无关** | 各子应用可使用不同框架               |
| **团队自治** | 不同团队负责不同子应用                 |
| **增量升级** | 可以逐步重构旧代码                     |
| **故障隔离** | 一个子应用崩溃不影响其他               |

---

## 二、微前端方案

### 2.1 方案对比

```
┌─────────────────────────────────────────┐
│           微前端方案                    │
├─────────────────────────────────────────┤
│                                         │
│  1. NPM 包                              │
│     ├── 组件以 npm 包形式发布           │
│     ├── 构建时集成                      │
│     └── 缺点：更新需要重新构建         │
│                                         │
│  2. iframe                              │
│     ├── 天然隔离                        │
│     ├── 简单可靠                        │
│     └── 缺点：性能差、通信困难          │
│                                         │
│  3. Web Components                      │
│     ├── 标准化                          │
│     ├── 框架无关                        │
│     └── 缺点：兼容性、生态              │
│                                         │
│  4. single-spa                          │
│     ├── 路由级集成                      │
│     ├── 框架无关                        │
│     └── 缺点：配置复杂                  │
│                                         │
│  5. qiankun                             │
│     ├── 基于 single-spa                 │
│     ├── JS 沙箱                         │
│     └── 缺点：样式隔离                  │
│                                         │
│  6. Module Federation（模块联邦）       │
│     ├── Webpack 5 原生支持              │
│     ├── 运行时集成                      │
│     └── 缺点：依赖 Webpack              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 三、qiankun 实战

### 3.1 主应用

```typescript
// main-app/src/main.ts
import { registerMicroApps, start } from 'qiankun'

// 注册子应用
registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:3001',
    container: '#sub-app',
    activeRule: '/react'
  },
  {
    name: 'vue-app',
    entry: '//localhost:3002',
    container: '#sub-app',
    activeRule: '/vue'
  }
])

// 启动
start()
```

### 3.2 主应用布局

```typescript
// main-app/src/App.tsx
function App() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/react">React 应用</Link>
          <Link to="/vue">Vue 应用</Link>
        </nav>
      </header>

      {/* 子应用挂载点 */}
      <main id="sub-app"></main>
    </div>
  )
}
```

### 3.3 子应用配置

```typescript
// sub-react/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

let root: ReactDOM.Root | null = null

function render(props: any) {
  const { container } = props
  const mountNode = container
    ? container.querySelector('#root')
    : document.getElementById('root')

  root = ReactDOM.createRoot(mountNode!)
  root.render(<App />)
}

// 导出生命周期钩子
export async function bootstrap() {
  console.log('React 子应用启动')
}

export async function mount(props: any) {
  render(props)
}

export async function unmount() {
  root?.unmount()
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}
```

### 3.4 子应用 webpack 配置

```javascript
// sub-react/config/webpack.js
module.exports = {
  output: {
    library: 'react-app',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
```

---

## 四、Module Federation（模块联邦）

### 4.1 概念

Webpack 5 引入的特性，允许在不同应用间共享模块。

```
┌─────────────────────────────────────────┐
│        Module Federation               │
├─────────────────────────────────────────┤
│                                         │
│  Host（宿主）                           │
│  ├── 引用远程模块                       │
│  └── 可以暴露自己的模块                 │
│                                         │
│  Remote（远程）                         │
│  ├── 暴露模块给其他应用                 │
│  └── 也可以引用其他远程模块             │
│                                         │
│  特点：                                 │
│  ✅ 运行时集成                          │
│  ✅ 依赖共享                            │
│  ✅ 按需加载                            │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 配置示例

```javascript
// app1 (Host) webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      remotes: {
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
}

// app2 (Remote) webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Header': './src/components/Header'
      },
      shared: ['react', 'react-dom']
    })
  ]
}
```

### 4.3 使用远程模块

```typescript
// app1 中使用 app2 暴露的组件
const RemoteButton = React.lazy(() => import('app2/Button'))

function App() {
  return (
    <React.Suspense fallback="加载中...">
      <RemoteButton onClick={() => console.log('clicked')}>
        点击
      </RemoteButton>
    </React.Suspense>
  )
}
```

---

## 五、通信方案

### 5.1 主子应用通信

```typescript
// 主应用传递数据
import { initGlobalState } from 'qiankun'

const actions = initGlobalState({
  user: null,
  theme: 'light'
})

// 主应用修改数据
actions.setGlobalState({ user: { name: '张三' } })

// 子应用接收
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    console.log('主应用数据更新:', state)
  })

  // 子应用也可以修改
  props.setGlobalState({ theme: 'dark' })
}
```

### 5.2 自定义事件通信

```typescript
// 事件总线
class EventBus {
  private events: Map<string, Function[]> = new Map()

  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  emit(event: string, data?: any) {
    this.events.get(event)?.forEach(cb => cb(data))
  }
}

// 挂载到全局
window.microAppEventBus = new EventBus()

// 子应用 A 发送
window.microAppEventBus.emit('user:login', { name: '张三' })

// 子应用 B 接收
window.microAppEventBus.on('user:login', (user) => {
  console.log('用户登录:', user)
})
```

---

## 六、样式隔离

### 6.1 Shadow DOM

```typescript
// 使用 Shadow DOM 隔离样式
class MicroApp extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        /* 这里的样式不会影响外部 */
        p { color: red; }
      </style>
      <p>微前端内容</p>
    `
  }
}

customElements.define('micro-app', MicroApp)
```

### 6.2 CSS Modules / Scoped CSS

```typescript
// qiankun 的样式隔离配置
import { start } from 'qiankun'

start({
  sandbox: {
    strictStyleIsolation: true,  // Shadow DOM 隔离
    // 或
    experimentalStyleIsolation: true  // scope 隔离
  }
})
```

---

## 七、总结

### ✅ 关键知识点

1. **微前端价值**：独立部署、技术栈无关、团队自治
2. **方案选择**：qiankun（简单）、Module Federation（现代）
3. **qiankun**：基于 single-spa，JS 沙箱
4. **Module Federation**：Webpack 5 原生，运行时集成
5. **通信**：全局状态、事件总线
6. **样式隔离**：Shadow DOM、CSS Modules

### 🔜 下一章

- 下一章：[Monorepo](/web/architecture/architecture-patterns/04-monorepo/)
- 上一章：[组件化架构](/web/architecture/architecture-patterns/02-component-based/)
- 上一级：[架构模式](/web/architecture/architecture-patterns/)
