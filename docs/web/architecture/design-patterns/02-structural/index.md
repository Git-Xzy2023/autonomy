---
title: 结构型模式
---

# 结构型模式

> 结构型模式关注类和对象的组合，通过灵活的结构设计实现更好的功能复用和扩展。

---

## 一、适配器模式（Adapter）

### 1.1 定义

将一个类的接口转换成客户端期望的另一个接口，使原本不兼容的类可以一起工作。

### 1.2 实现

```typescript
// 旧接口
class OldLogger {
  logMessage(msg: string) {
    console.log(`[OLD] ${msg}`)
  }
}

// 新接口
interface ILogger {
  log(level: string, message: string): void
}

// 适配器
class LoggerAdapter implements ILogger {
  constructor(private oldLogger: OldLogger) {}

  log(level: string, message: string) {
    this.oldLogger.logMessage(`[${level}] ${message}`)
  }
}

// 使用
const logger = new LoggerAdapter(new OldLogger())
logger.log('INFO', '系统启动')  // [OLD] [INFO] 系统启动
```

### 1.3 前端应用

```typescript
// API 适配器：统一不同第三方接口
interface UserProfile {
  id: string
  name: string
  avatar: string
}

// 微信 API 返回格式
interface WechatUser {
  openid: string
  nickname: string
  headimgurl: string
}

// 适配器
class WechatUserAdapter {
  adapt(user: WechatUser): UserProfile {
    return {
      id: user.openid,
      name: user.nickname,
      avatar: user.headimgurl
    }
  }
}

// GitHub API 返回格式
interface GithubUser {
  id: number
  login: string
  avatar_url: string
}

class GithubUserAdapter {
  adapt(user: GithubUser): UserProfile {
    return {
      id: String(user.id),
      name: user.login,
      avatar: user.avatar_url
    }
  }
}
```

---

## 二、装饰器模式（Decorator）

### 2.1 定义

动态地给对象添加额外职责，比继承更灵活。

### 2.2 实现

```typescript
// 基础组件
interface Coffee {
  cost(): number
  description(): string
}

class SimpleCoffee implements Coffee {
  cost() { return 10 }
  description() { return '简单咖啡' }
}

// 装饰器基类
class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost() { return this.coffee.cost() }
  description() { return this.coffee.description() }
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 3 }
  description() { return this.coffee.description() + ' + 牛奶' }
}

class SugarDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 1 }
  description() { return this.coffee.description() + ' + 糖' }
}

// 使用
const coffee = new SugarDecorator(new MilkDecorator(new SimpleCoffee()))
console.log(coffee.description())  // 简单咖啡 + 牛奶 + 糖
console.log(coffee.cost())         // 14
```

### 2.3 前端应用

```typescript
// 高阶组件就是装饰器模式
function withLoading<T extends React.ComponentType<any>>(Component: T) {
  return function WrappedComponent(props: any) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      setLoading(false)
    }, [])

    if (loading) return <div>加载中...</div>
    return <Component {...props} />
  }
}

// TypeScript 装饰器
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function(...args: any[]) {
    console.log(`调用 ${key}，参数：`, args)
    return original.apply(this, args)
  }
}

class ApiService {
  @log
  fetchData(url: string) {
    return fetch(url)
  }
}
```

---

## 三、代理模式（Proxy）

### 3.1 定义

为其他对象提供代理以控制对这个对象的访问。

### 3.2 实现

```typescript
// 真实对象
class RealImage {
  constructor(private filename: string) {
    this.loadFromDisk()
  }

  private loadFromDisk() {
    console.log(`从磁盘加载 ${this.filename}`)
  }

  display() {
    console.log(`显示 ${this.filename}`)
  }
}

// 代理
class ImageProxy {
  private image: RealImage | null = null

  constructor(private filename: string) {}

  display() {
    if (!this.image) {
      this.image = new RealImage(this.filename)  // 延迟加载
    }
    this.image.display()
  }
}

// 使用
const image = new ImageProxy('photo.jpg')
console.log('创建代理（未加载）')
image.display()  // 此时才真正加载
```

### 3.3 前端应用

```typescript
// ES6 Proxy
const handler = {
  get(target: any, prop: string) {
    console.log(`读取属性: ${prop}`)
    return target[prop]
  },
  set(target: any, prop: string, value: any) {
    console.log(`设置属性: ${prop} = ${value}`)
    target[prop] = value
    return true
  }
}

const data = new Proxy({ name: '张三' }, handler)
data.name        // 读取属性: name
data.age = 25    // 设置属性: age = 25

// Vue 3 响应式原理
function reactive(target: object) {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key)  // 依赖收集
      return Reflect.get(obj, key)
    },
    set(obj, key, value) {
      const result = Reflect.set(obj, key, value)
      trigger(obj, key)  // 触发更新
      return result
    }
  })
}

// 缓存代理
function createCacheProxy(fn: Function) {
  const cache = new Map()

  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = target.apply(thisArg, args)
      cache.set(key, result)
      return result
    }
  })
}

const expensiveFn = createCacheProxy((n: number) => {
  console.log('计算中...')
  return n * 2
})
```

---

## 四、外观模式（Facade）

### 4.1 定义

为子系统中的一组接口提供一个统一的高层接口。

### 4.2 实现

```typescript
// 子系统
class CPU {
  freeze() { console.log('CPU 冻结') }
  execute() { console.log('CPU 执行') }
}

class Memory {
  load() { console.log('内存加载') }
}

class HardDrive {
  read() { console.log('硬盘读取') }
}

// 外观
class ComputerFacade {
  private cpu = new CPU()
  private memory = new Memory()
  private hardDrive = new HardDrive()

  start() {
    this.cpu.freeze()
    this.memory.load()
    this.hardDrive.read()
    this.cpu.execute()
  }
}

// 使用
const computer = new ComputerFacade()
computer.start()  // 一键启动，无需关心内部细节
```

### 4.3 前端应用

```typescript
// 统一的 API 接口
class ApiFacade {
  private auth = new AuthService()
  private user = new UserService()
  private order = new OrderService()

  async loginAndGetProfile(username: string, password: string) {
    const token = await this.auth.login(username, password)
    const user = await this.user.getProfile(token)
    const orders = await this.order.getOrders(user.id)
    return { user, orders }
  }
}

// 浏览器兼容性封装
class EventFacade {
  static addEvent(el: Element, event: string, callback: Function) {
    if (el.addEventListener) {
      el.addEventListener(event, callback as any)
    } else if ((el as any).attachEvent) {
      (el as any).attachEvent(`on${event}`, callback)
    } else {
      (el as any)[`on${event}`] = callback
    }
  }
}
```

---

## 五、组合模式（Composite）

### 5.1 定义

将对象组合成树形结构以表示"部分-整体"的层次结构。

### 5.2 实现

```typescript
// 组件接口
interface Component {
  operation(): void
  add(component: Component): void
  remove(component: Component): void
  getChild(index: number): Component | null
}

// 叶子节点
class Leaf implements Component {
  constructor(private name: string) {}

  operation() {
    console.log(`叶子节点: ${this.name}`)
  }

  add() { throw new Error('不支持') }
  remove() { throw new Error('不支持') }
  getChild() { return null }
}

// 组合节点
class Composite implements Component {
  private children: Component[] = []

  constructor(private name: string) {}

  operation() {
    console.log(`组合节点: ${this.name}`)
    this.children.forEach(child => child.operation())
  }

  add(component: Component) {
    this.children.push(component)
  }

  remove(component: Component) {
    this.children = this.children.filter(c => c !== component)
  }

  getChild(index: number) {
    return this.children[index] || null
  }
}

// 使用
const root = new Composite('根')
const branch1 = new Composite('分支1')
const branch2 = new Composite('分支2')

branch1.add(new Leaf('叶子1'))
branch1.add(new Leaf('叶子2'))
branch2.add(new Leaf('叶子3'))

root.add(branch1)
root.add(branch2)
root.operation()
```

### 5.3 前端应用

```typescript
// 虚拟 DOM 树
interface VNode {
  type: string
  props: Record<string, any>
  children: (VNode | string)[]
}

// React 组件树就是组合模式
const tree: VNode = {
  type: 'div',
  props: {},
  children: [
    {
      type: 'header',
      props: {},
      children: ['标题']
    },
    {
      type: 'main',
      props: {},
      children: [
        { type: 'p', props: {}, children: ['段落'] }
      ]
    }
  ]
}

// 文件系统
class File {
  constructor(public name: string, public size: number) {}

  getSize() { return this.size }
  print(indent = '') { console.log(`${indent}📄 ${this.name} (${this.size}KB)`) }
}

class Folder {
  private items: (File | Folder)[] = []

  constructor(public name: string) {}

  add(item: File | Folder) {
    this.items.push(item)
    return this
  }

  getSize() {
    return this.items.reduce((sum, item) => sum + item.getSize(), 0)
  }

  print(indent = '') {
    console.log(`${indent}📁 ${this.name}/`)
    this.items.forEach(item => item.print(indent + '  '))
  }
}
```

---

## 六、享元模式（Flyweight）

### 6.1 定义

共享细粒度对象，减少内存使用。

### 6.2 实现

```typescript
// 享元工厂
class FlyweightFactory {
  private flyweights: Map<string, Flyweight> = new Map()

  getFlyweight(key: string): Flyweight {
    if (!this.flyweights.has(key)) {
      this.flyweights.set(key, new ConcreteFlyweight(key))
    }
    return this.flyweights.get(key)!
  }

  getCount() { return this.flyweights.size }
}

interface Flyweight {
  operation(extrinsicState: any): void
}

class ConcreteFlyweight implements Flyweight {
  constructor(private intrinsicState: string) {}

  operation(extrinsicState: any) {
    console.log(`内在状态: ${this.intrinsicState}, 外在状态: ${JSON.stringify(extrinsicState)}`)
  }
}
```

### 6.3 前端应用

```typescript
// 图标缓存
class IconFactory {
  private icons: Map<string, HTMLImageElement> = new Map()

  getIcon(name: string): HTMLImageElement {
    if (!this.icons.has(name)) {
      const img = new Image()
      img.src = `/icons/${name}.png`
      this.icons.set(name, img)
    }
    return this.icons.get(name)!
  }
}

// 虚拟列表中的节点复用
class CellPool {
  private pool: HTMLElement[] = []

  acquire(): HTMLElement {
    return this.pool.pop() || document.createElement('div')
  }

  release(cell: HTMLElement) {
    cell.innerHTML = ''
    this.pool.push(cell)
  }
}
```

---

## 七、桥接模式（Bridge）

### 7.1 定义

将抽象部分与实现部分分离，使它们可以独立变化。

### 7.2 实现

```typescript
// 实现者接口
interface Renderer {
  renderCircle(radius: number): void
}

// 具体实现
class VectorRenderer implements Renderer {
  renderCircle(radius: number) {
    console.log(`矢量绘制半径 ${radius} 的圆`)
  }
}

class RasterRenderer implements Renderer {
  renderCircle(radius: number) {
    console.log(`像素绘制半径 ${radius} 的圆`)
  }
}

// 抽象
class Shape {
  constructor(protected renderer: Renderer) {}

  draw() {}
}

class Circle extends Shape {
  constructor(renderer: Renderer, private radius: number) {
    super(renderer)
  }

  draw() {
    this.renderer.renderCircle(this.radius)
  }
}

// 使用
const vector = new VectorRenderer()
const raster = new RasterRenderer()

new Circle(vector, 5).draw()  // 矢量绘制
new Circle(raster, 5).draw()  // 像素绘制
```

---

## 八、总结

### ✅ 结构型模式对比

| 模式     | 意图                   | 前端应用场景               |
| -------- | ---------------------- | -------------------------- |
| 适配器   | 接口转换               | 第三方 API 适配、兼容性    |
| 装饰器   | 动态添加职责           | HOC、中间件、TS 装饰器     |
| 代理     | 控制访问               | 响应式、缓存、懒加载       |
| 外观     | 统一接口               | API 封装、兼容性处理       |
| 组合     | 树形结构               | 虚拟 DOM、组件树、文件系统 |
| 享元     | 对象共享               | 图标缓存、对象池           |
| 桥接     | 抽象与实现分离         | 跨平台渲染、多主题         |

### 🔜 下一章

- 下一章：[行为型模式](/web/architecture/design-patterns/03-behavioral/)
- 上一章：[创建型模式](/web/architecture/design-patterns/01-creational/)
- 上一级：[设计模式](/web/architecture/design-patterns/)
