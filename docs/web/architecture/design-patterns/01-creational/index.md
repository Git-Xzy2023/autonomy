---
title: 创建型模式
---

# 创建型模式

> 创建型模式关注对象的创建机制，提供创建对象的灵活性，使代码更清晰、更易于复用。

---

## 一、单例模式（Singleton）

### 1.1 定义

确保一个类只有一个实例，并提供全局访问点。

### 1.2 实现

```typescript
class Singleton {
  private static instance: Singleton

  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}

// 使用
const a = Singleton.getInstance()
const b = Singleton.getInstance()
console.log(a === b)  // true
```

### 1.3 前端应用

```typescript
// 全局状态管理
class Store {
  private static instance: Store
  private state: Record<string, any> = {}

  private constructor() {}

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store()
    }
    return Store.instance
  }

  get(key: string) {
    return this.state[key]
  }

  set(key: string, value: any) {
    this.state[key] = value
  }
}

// 全局弹窗管理
class ModalManager {
  private static instance: ModalManager
  private modals: Modal[] = []

  static getInstance() {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager()
    }
    return ModalManager.instance
  }

  open(modal: Modal) {
    this.modals.push(modal)
  }

  close(id: string) {
    this.modals = this.modals.filter(m => m.id !== id)
  }
}
```

---

## 二、工厂方法模式（Factory Method）

### 2.1 定义

定义一个创建对象的接口，让子类决定实例化哪个类。

### 2.2 实现

```typescript
// 产品接口
interface Button {
  render(): void
}

// 具体产品
class WindowsButton implements Button {
  render() {
    console.log('渲染 Windows 风格按钮')
  }
}

class MacButton implements Button {
  render() {
    console.log('渲染 Mac 风格按钮')
  }
}

// 工厂接口
interface ButtonFactory {
  createButton(): Button
}

// 具体工厂
class WindowsButtonFactory implements ButtonFactory {
  createButton() {
    return new WindowsButton()
  }
}

class MacButtonFactory implements ButtonFactory {
  createButton() {
    return new MacButton()
  }
}

// 使用
const factory: ButtonFactory = new MacButtonFactory()
const button = factory.createButton()
button.render()  // 渲染 Mac 风格按钮
```

### 2.3 前端应用

```typescript
// 组件工厂
function createComponent(type: string, props: any) {
  switch (type) {
    case 'button':
      return new ButtonComponent(props)
    case 'input':
      return new InputComponent(props)
    case 'select':
      return new SelectComponent(props)
    default:
      throw new Error(`未知组件类型: ${type}`)
  }
}

// React 中
function createElement(type: string, props: any, ...children: any[]) {
  // React.createElement 就是工厂方法
  return { type, props: { ...props, children }, _isReactElement: true }
}
```

---

## 三、抽象工厂模式（Abstract Factory）

### 3.1 定义

提供一个创建一系列相关对象的接口，无需指定具体类。

### 3.2 实现

```typescript
// UI 组件族接口
interface UIComponentFactory {
  createButton(): Button
  createInput(): Input
  createCheckbox(): Checkbox
}

// Windows 风格工厂
class WindowsUIFactory implements UIComponentFactory {
  createButton() { return new WindowsButton() }
  createInput() { return new WindowsInput() }
  createCheckbox() { return new WindowsCheckbox() }
}

// Mac 风格工厂
class MacUIFactory implements UIComponentFactory {
  createButton() { return new MacButton() }
  createInput() { return new MacInput() }
  createCheckbox() { return new MacCheckbox() }
}

// 使用
function renderUI(factory: UIComponentFactory) {
  const button = factory.createButton()
  const input = factory.createInput()
  const checkbox = factory.createCheckbox()

  button.render()
  input.render()
  checkbox.render()
}

const factory = navigator.platform.includes('Mac')
  ? new MacUIFactory()
  : new WindowsUIFactory()

renderUI(factory)
```

---

## 四、建造者模式（Builder）

### 4.1 定义

将复杂对象的构建与表示分离，使同样的构建过程可以创建不同的表示。

### 4.2 实现

```typescript
class HttpRequestBuilder {
  private method: string = 'GET'
  private url: string = ''
  private headers: Record<string, string> = {}
  private body: any = null
  private timeout: number = 5000

  setMethod(method: string) {
    this.method = method
    return this
  }

  setUrl(url: string) {
    this.url = url
    return this
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value
    return this
  }

  setBody(body: any) {
    this.body = body
    return this
  }

  setTimeout(timeout: number) {
    this.timeout = timeout
    return this
  }

  build() {
    return {
      method: this.method,
      url: this.url,
      headers: this.headers,
      body: this.body,
      timeout: this.timeout
    }
  }
}

// 使用（链式调用）
const request = new HttpRequestBuilder()
  .setMethod('POST')
  .setUrl('/api/users')
  .setHeader('Content-Type', 'application/json')
  .setHeader('Authorization', 'Bearer token')
  .setBody({ name: '张三' })
  .setTimeout(10000)
  .build()
```

### 4.3 前端应用

```typescript
// 表单构建器
class FormBuilder {
  private fields: FormField[] = []

  addText(name: string, label: string) {
    this.fields.push({ type: 'text', name, label })
    return this
  }

  addEmail(name: string, label: string) {
    this.fields.push({ type: 'email', name, label })
    return this
  }

  addSelect(name: string, label: string, options: Option[]) {
    this.fields.push({ type: 'select', name, label, options })
    return this
  }

  addSubmit(label: string) {
    this.fields.push({ type: 'submit', name: 'submit', label })
    return this
  }

  build() {
    return this.fields
  }
}

// 使用
const form = new FormBuilder()
  .addText('name', '姓名')
  .addEmail('email', '邮箱')
  .addSelect('gender', '性别', [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' }
  ])
  .addSubmit('提交')
  .build()
```

---

## 五、原型模式（Prototype）

### 5.1 定义

通过克隆现有实例来创建新对象，而非通过构造函数。

### 5.2 实现

```typescript
// 浅拷贝
class Prototype implements Cloneable {
  clone(): this {
    return Object.create(this)
  }
}

// 深拷贝
function deepClone<T>(obj: T): T {
  return structuredClone(obj)
  // 或 JSON.parse(JSON.stringify(obj))
}

// 使用
const original = { name: '张三', address: { city: '北京' } }
const cloned = deepClone(original)
cloned.address.city = '上海'
console.log(original.address.city)  // 北京（不受影响）
```

### 5.3 前端应用

```typescript
// 组件模板克隆
const baseConfig = {
  theme: 'light',
  locale: 'zh-CN',
  features: {
    darkMode: true,
    analytics: false
  }
}

// 创建新配置，基于基础配置
function createConfig(overrides: Partial<typeof baseConfig>) {
  return {
    ...deepClone(baseConfig),
    ...overrides,
    features: { ...baseConfig.features, ...(overrides.features || {}) }
  }
}

const customConfig = createConfig({
  theme: 'dark',
  features: { analytics: true }
})
```

---

## 六、总结

### ✅ 创建型模式对比

| 模式       | 意图                   | 前端应用场景               |
| ---------- | ---------------------- | -------------------------- |
| 单例       | 全局唯一实例           | 全局状态、弹窗管理、缓存   |
| 工厂方法   | 子类决定创建哪个对象   | 组件创建、跨平台 UI        |
| 抽象工厂   | 创建一系列相关对象     | UI 主题、多平台组件        |
| 建造者     | 分步构建复杂对象       | HTTP 请求、表单、配置      |
| 原型       | 克隆现有对象           | 配置复制、对象复制         |

### 🔜 下一章

- 下一章：[结构型模式](/web/architecture/design-patterns/02-structural/)
- 上一级：[设计模式](/web/architecture/design-patterns/)
