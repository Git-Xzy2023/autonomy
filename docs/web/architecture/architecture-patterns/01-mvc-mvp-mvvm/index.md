---
title: MVC / MVP / MVVM
---

# MVC / MVP / MVVM

> 这三种架构模式是 UI 设计的经典模式，理解它们有助于理解现代前端框架的设计思想。

---

## 一、MVC（Model-View-Controller）

### 1.1 架构图

```
┌─────────────────────────────────────────┐
│              MVC 架构                   │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────────┐    ┌──────────┐         │
│   │  Model   │←──→│   View   │         │
│   │  (数据)  │    │  (视图)  │         │
│   └────┬─────┘    └────┬─────┘         │
│        │               │               │
│        │      ┌────────┴─────┐         │
│        └─────→│ Controller   │←────────┘
│               │ (控制器)     │         │
│               └──────────────┘         │
│                                         │
│  数据流：用户操作 → Controller → Model  │
│         → 更新 View                     │
└─────────────────────────────────────────┘
```

### 1.2 职责划分

| 组成部分     | 职责                   |
| ------------ | ---------------------- |
| **Model**    | 数据和业务逻辑         |
| **View**     | 展示数据，接收用户操作 |
| **Controller** | 处理用户输入，协调 Model 和 View |

### 1.3 代码示例

```typescript
// Model
class UserModel {
  private users: User[] = []
  private observers: Function[] = []

  addUser(user: User) {
    this.users.push(user)
    this.notify()
  }

  getUsers() {
    return this.users
  }

  subscribe(fn: Function) {
    this.observers.push(fn)
  }

  private notify() {
    this.observers.forEach(fn => fn(this.users))
  }
}

// View
class UserView {
  render(users: User[]) {
    const list = document.getElementById('user-list')
    list.innerHTML = users
      .map(u => `<li>${u.name}</li>`)
      .join('')
  }

  bindAddUser(handler: (name: string) => void) {
    document.getElementById('add-btn')!.onclick = () => {
      const input = document.getElementById('name-input') as HTMLInputElement
      handler(input.value)
      input.value = ''
    }
  }
}

// Controller
class UserController {
  constructor(
    private model: UserModel,
    private view: UserView
  ) {
    this.model.subscribe(users => this.view.render(users))
    this.view.bindAddUser(name => this.addUser(name))
  }

  addUser(name: string) {
    this.model.addUser({ id: Date.now(), name })
  }
}

// 使用
const model = new UserModel()
const view = new UserView()
const controller = new UserController(model, view)
```

### 1.4 优缺点

| 优点                   | 缺点                         |
| ---------------------- | ---------------------------- |
| 职责分离清晰           | View 和 Model 耦合           |
| 可维护性好             | 大型应用中 Controller 臃肿   |
| 可测试                 | 数据流不够清晰               |

---

## 二、MVP（Model-View-Presenter）

### 2.1 架构图

```
┌─────────────────────────────────────────┐
│              MVP 架构                   │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────────┐    ┌──────────┐         │
│   │  Model   │    │   View   │         │
│   │  (数据)  │    │  (视图)  │         │
│   └────┬─────┘    └────┬─────┘         │
│        │               │               │
│        │      ┌────────┴─────┐         │
│        └─────→│  Presenter   │←────────┘
│               │ (展示器)     │         │
│               └──────────────┘         │
│                                         │
│  View 和 Model 不直接通信               │
│  Presenter 作为中间人                   │
└─────────────────────────────────────────┘
```

### 2.2 与 MVC 的区别

| 特性       | MVC               | MVP                 |
| ---------- | ----------------- | ------------------- |
| View-Model | 直接通信          | 不直接通信          |
| 中间层     | Controller        | Presenter           |
| 测试       | 较难              | 容易（Mock View）   |
| 耦合度     | View 和 Model 耦合 | 完全解耦          |

### 2.3 代码示例

```typescript
// View 接口
interface IUserView {
  render(users: User[]): void
  getInput(): string
  clearInput(): void
}

// Model
class UserModel {
  private users: User[] = []

  addUser(user: User) {
    this.users.push(user)
  }

  getUsers() {
    return [...this.users]
  }
}

// Presenter
class UserPresenter {
  constructor(
    private model: UserModel,
    private view: IUserView
  ) {}

  init() {
    this.view.render(this.model.getUsers())
  }

  addUser() {
    const name = this.view.getInput()
    if (name) {
      this.model.addUser({ id: Date.now(), name })
      this.view.clearInput()
      this.view.render(this.model.getUsers())
    }
  }
}

// View 实现
class UserView implements IUserView {
  render(users: User[]) {
    document.getElementById('list')!.innerHTML =
      users.map(u => `<li>${u.name}</li>`).join('')
  }

  getInput() {
    return (document.getElementById('input') as HTMLInputElement).value
  }

  clearInput() {
    (document.getElementById('input') as HTMLInputElement).value = ''
  }

  bindAdd(handler: () => void) {
    document.getElementById('btn')!.onclick = handler
  }
}

// 使用
const model = new UserModel()
const view = new UserView()
const presenter = new UserPresenter(model, view)

view.bindAdd(() => presenter.addUser())
presenter.init()
```

---

## 三、MVVM（Model-View-ViewModel）

### 3.1 架构图

```
┌─────────────────────────────────────────┐
│              MVVM 架构                  │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────────┐    ┌──────────┐         │
│   │  Model   │    │   View   │         │
│   │  (数据)  │    │  (视图)  │         │
│   └────┬─────┘    └────┬─────┘         │
│        │               │               │
│        │      ┌────────┴─────┐         │
│        └─────→│  ViewModel   │⇆ 绑定   │
│               │ (视图模型)   │         │
│               └──────────────┘         │
│                                         │
│  View 和 ViewModel 双向绑定             │
│  自动同步状态                           │
└─────────────────────────────────────────┘
```

### 3.2 核心特性：数据绑定

```typescript
// 简易 MVVM 实现
class ViewModel {
  private _data: any = {}
  private _bindings: Map<string, Function[]> = new Map()

  // 数据劫持
  defineReactive(key: string, value: any) {
    Object.defineProperty(this._data, key, {
      get: () => value,
      set: (newValue) => {
        value = newValue
        this.notify(key)
      }
    })
  }

  // 订阅
  subscribe(key: string, callback: Function) {
    if (!this._bindings.has(key)) {
      this._bindings.set(key, [])
    }
    this._bindings.get(key)!.push(callback)
  }

  // 通知
  notify(key: string) {
    this._bindings.get(key)?.forEach(cb => cb(this._data[key]))
  }

  get data() {
    return this._data
  }
}

// 使用
const vm = new ViewModel()
vm.defineReactive('name', '张三')

// View 绑定
vm.subscribe('name', (value) => {
  document.getElementById('name')!.textContent = value
})

// 修改数据自动更新 View
vm.data.name = '李四'  // View 自动更新
```

### 3.3 Vue 中的 MVVM

```vue
<!-- Vue 是典型的 MVVM 框架 -->
<template>
  <div>
    <input v-model="name" />
    <p>Hello, {{ name }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '张三'  // ViewModel 的数据
    }
  }
}
</script>
```

### 3.4 React 与 MVVM

```typescript
// React 不完全是 MVVM，但借鉴了数据驱动思想
function App() {
  const [name, setName] = useState('张三')  // ViewModel

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}  // View → ViewModel
      />
      <p>Hello, {name}</p>  {/* ViewModel → View */}
    </div>
  )
}
```

---

## 四、三种模式对比

| 特性         | MVC               | MVP               | MVVM              |
| ------------ | ----------------- | ----------------- | ----------------- |
| **中间层**   | Controller        | Presenter         | ViewModel         |
| **View-Model** | 直接通信        | 不通信            | 双向绑定          |
| **数据流**   | 单向              | 单向              | 双向              |
| **耦合度**   | 中                | 低                | 低                |
| **测试**     | 中                | 高                | 高                |
| **代表框架** | Backbone.js       | Android           | Vue、WPF          |

---

## 五、现代前端的演进

### 5.1 从 MVC 到 Flux/Redux

```
MVC 的问题：
  多个 View 和 Model 互相通信 → 数据流混乱 → 难以调试

Flux 解决方案（单向数据流）：
  Action → Dispatcher → Store → View
       ↑                              │
       └──────────────────────────────┘

Redux（Flux 的实现）：
  单一 Store，状态不可变，纯函数 Reducer
```

### 5.2 组件化架构

```
现代前端 = 组件化 + 数据驱动

┌─────────────────────────────────────────┐
│           组件化架构                    │
├─────────────────────────────────────────┤
│                                         │
│  App                                    │
│  ├── Header（组件）                     │
│  │   ├── Logo                           │
│  │   └── Nav                            │
│  ├── Main                               │
│  │   ├── Sidebar                        │
│  │   └── Content                        │
│  │       ├── Article                    │
│  │       └── Comments                   │
│  └── Footer                             │
│                                         │
│  每个组件自治：状态 + 视图 + 逻辑       │
│  组件间通过 props/事件/状态管理通信     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 六、总结

### ✅ 关键知识点

1. **MVC**：Controller 协调 Model 和 View，View 和 Model 直接通信
2. **MVP**：Presenter 作为中间人，View 和 Model 完全解耦
3. **MVVM**：ViewModel 通过数据绑定自动同步 View
4. **Vue**：典型的 MVVM 框架，双向数据绑定
5. **React**：数据驱动，单向数据流，组件化
6. **Flux/Redux**：解决 MVC 数据流混乱问题，单向数据流

### 🔜 下一章

- 下一章：[组件化架构](/web/architecture/architecture-patterns/02-component-based/)
- 上一级：[架构模式](/web/architecture/architecture-patterns/)
