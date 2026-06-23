---
title: 行为型模式
---

# 行为型模式

> 行为型模式关注对象之间的通信和职责分配，描述对象如何协作完成任务。

---

## 一、观察者模式（Observer）

### 1.1 定义

定义对象间的一对多依赖关系，当一个对象状态变化时，所有依赖者都会收到通知。

### 1.2 实现

```typescript
// 观察者接口
interface Observer {
  update(data: any): void
}

// 主题
class Subject {
  private observers: Observer[] = []

  subscribe(observer: Observer) {
    this.observers.push(observer)
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer)
  }

  notify(data: any) {
    this.observers.forEach(o => o.update(data))
  }
}

// 具体观察者
class EmailNotifier implements Observer {
  update(data: any) {
    console.log(`邮件通知: ${data}`)
  }
}

class SMSNotifier implements Observer {
  update(data: any) {
    console.log(`短信通知: ${data}`)
  }
}

// 使用
const subject = new Subject()
subject.subscribe(new EmailNotifier())
subject.subscribe(new SMSNotifier())
subject.notify('订单已创建')
```

### 1.3 前端应用

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

  off(event: string, callback: Function) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      this.events.set(event, callbacks.filter(cb => cb !== callback))
    }
  }

  emit(event: string, data?: any) {
    this.events.get(event)?.forEach(cb => cb(data))
  }
}

// 使用
const bus = new EventBus()
bus.on('user:login', (user) => console.log(`${user.name} 登录`))
bus.emit('user:login', { name: '张三' })

// Vue 的响应式系统
// React 的状态管理（Redux、Zustand）都基于观察者模式
```

---

## 二、策略模式（Strategy）

### 2.1 定义

定义一系列算法，将它们封装起来，使它们可以互相替换。

### 2.2 实现

```typescript
// 策略接口
interface PaymentStrategy {
  pay(amount: number): void
}

// 具体策略
class AlipayStrategy implements PaymentStrategy {
  pay(amount: number) {
    console.log(`支付宝支付 ${amount} 元`)
  }
}

class WechatPayStrategy implements PaymentStrategy {
  pay(amount: number) {
    console.log(`微信支付 ${amount} 元`)
  }
}

class CreditCardStrategy implements PaymentStrategy {
  pay(amount: number) {
    console.log(`信用卡支付 ${amount} 元`)
  }
}

// 上下文
class PaymentContext {
  private strategy: PaymentStrategy

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  executePayment(amount: number) {
    this.strategy.pay(amount)
  }
}

// 使用
const payment = new PaymentContext(new AlipayStrategy())
payment.executePayment(100)
payment.setStrategy(new WechatPayStrategy())
payment.executePayment(200)
```

### 2.3 前端应用

```typescript
// 表单验证策略
interface ValidationStrategy {
  validate(value: string): boolean
}

class RequiredStrategy implements ValidationStrategy {
  validate(value: string) {
    return value.trim().length > 0
  }
}

class EmailStrategy implements ValidationStrategy {
  validate(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
}

class PhoneStrategy implements ValidationStrategy {
  validate(value: string) {
    return /^1[3-9]\d{9}$/.test(value)
  }
}

// 验证器
class Validator {
  private strategies: Map<string, ValidationStrategy> = new Map()

  addRule(name: string, strategy: ValidationStrategy) {
    this.strategies.set(name, strategy)
  }

  validate(name: string, value: string) {
    const strategy = this.strategies.get(name)
    return strategy ? strategy.validate(value) : true
  }
}

// 使用
const validator = new Validator()
validator.addRule('email', new EmailStrategy())
validator.addRule('phone', new PhoneStrategy())
validator.validate('email', 'test@example.com')  // true
```

---

## 三、命令模式（Command）

### 3.1 定义

将请求封装为对象，使你可以用不同的请求对客户进行参数化。

### 3.2 实现

```typescript
// 命令接口
interface Command {
  execute(): void
  undo(): void
}

// 接收者
class Light {
  turnOn() { console.log('灯开了') }
  turnOff() { console.log('灯关了') }
}

// 具体命令
class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute() { this.light.turnOn() }
  undo() { this.light.turnOff() }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute() { this.light.turnOff() }
  undo() { this.light.turnOn() }
}

// 调用者
class RemoteControl {
  private commands: Command[] = []
  private undoStack: Command[] = []

  execute(command: Command) {
    command.execute()
    this.undoStack.push(command)
  }

  undo() {
    const command = this.undoStack.pop()
    command?.undo()
  }
}

// 使用
const light = new Light()
const remote = new RemoteControl()
remote.execute(new LightOnCommand(light))  // 灯开了
remote.undo()  // 灯关了
```

### 3.3 前端应用

```typescript
// 撤销/重做功能
class CommandManager {
  private undoStack: Command[] = []
  private redoStack: Command[] = []

  execute(command: Command) {
    command.execute()
    this.undoStack.push(command)
    this.redoStack = []
  }

  undo() {
    const command = this.undoStack.pop()
    if (command) {
      command.undo()
      this.redoStack.push(command)
    }
  }

  redo() {
    const command = this.redoStack.pop()
    if (command) {
      command.execute()
      this.undoStack.push(command)
    }
  }
}

// 编辑器命令
class TextEditor {
  content = ''

  insert(text: string) { this.content += text }
  delete(length: number) {
    this.content = this.content.slice(0, -length)
  }
}

class InsertCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string
  ) {}

  execute() { this.editor.insert(this.text) }
  undo() { this.editor.delete(this.text.length) }
}
```

---

## 四、状态模式（State）

### 4.1 定义

允许对象在内部状态改变时改变其行为。

### 4.2 实现

```typescript
// 状态接口
interface State {
  handle(context: VendingMachine): void
}

// 具体状态
class NoCoinState implements State {
  handle(context: VendingMachine) {
    console.log('请投币')
    context.setState(new HasCoinState())
  }
}

class HasCoinState implements State {
  handle(context: VendingMachine) {
    console.log('出货中...')
    context.setState(new SoldState())
  }
}

class SoldState implements State {
  handle(context: VendingMachine) {
    console.log('请取货')
    context.setState(new NoCoinState())
  }
}

// 上下文
class VendingMachine {
  private state: State

  constructor() {
    this.state = new NoCoinState()
  }

  setState(state: State) {
    this.state = state
  }

  request() {
    this.state.handle(this)
  }
}

// 使用
const machine = new VendingMachine()
machine.request()  // 请投币
machine.request()  // 出货中...
machine.request()  // 请取货
```

### 4.3 前端应用

```typescript
// 订单状态机
type OrderState = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

const transitions: Record<OrderState, Record<string, OrderState>> = {
  pending: { pay: 'paid', cancel: 'cancelled' },
  paid: { ship: 'shipped', cancel: 'cancelled' },
  shipped: { deliver: 'delivered' },
  delivered: {},
  cancelled: {}
}

class Order {
  constructor(public state: OrderState = 'pending') {}

  transition(action: string) {
    const nextState = transitions[this.state]?.[action]
    if (nextState) {
      this.state = nextState
      console.log(`订单状态: ${this.state}`)
    } else {
      console.log(`不能从 ${this.state} 执行 ${action}`)
    }
  }
}

// 使用
const order = new Order()
order.transition('pay')       // 订单状态: paid
order.transition('ship')      // 订单状态: shipped
order.transition('deliver')   // 订单状态: delivered
```

---

## 五、责任链模式（Chain of Responsibility）

### 5.1 定义

将请求沿着处理者链传递，直到有一个处理者处理它。

### 5.2 实现

```typescript
abstract class Handler {
  private next: Handler | null = null

  setNext(handler: Handler): Handler {
    this.next = handler
    return handler
  }

  handle(request: string): string | null {
    if (this.next) {
      return this.next.handle(request)
    }
    return null
  }
}

class Level1Support extends Handler {
  handle(request: string): string | null {
    if (request === '简单问题') {
      return 'Level1 处理: ' + request
    }
    return super.handle(request)
  }
}

class Level2Support extends Handler {
  handle(request: string): string | null {
    if (request === '复杂问题') {
      return 'Level2 处理: ' + request
    }
    return super.handle(request)
  }
}

class Level3Support extends Handler {
  handle(request: string): string | null {
    return 'Level3 处理: ' + request
  }
}

// 使用
const l1 = new Level1Support()
const l2 = new Level2Support()
const l3 = new Level3Support()
l1.setNext(l2).setNext(l3)

console.log(l1.handle('简单问题'))   // Level1 处理
console.log(l1.handle('复杂问题'))   // Level2 处理
console.log(l1.handle('超难问题'))   // Level3 处理
```

### 5.3 前端应用

```typescript
// 中间件机制（Express/Koa）
interface Middleware {
  (ctx: any, next: () => Promise<void>): Promise<void>
}

class MiddlewareChain {
  private middlewares: Middleware[] = []

  use(middleware: Middleware) {
    this.middlewares.push(middleware)
  }

  async execute(ctx: any) {
    let index = 0

    const dispatch = async (i: number): Promise<void> => {
      if (i < this.middlewares.length) {
        await this.middlewares[i](ctx, () => dispatch(i + 1))
      }
    }

    await dispatch(0)
  }
}

// 使用
const chain = new MiddlewareChain()
chain.use(async (ctx, next) => {
  console.log('中间件1 开始')
  await next()
  console.log('中间件1 结束')
})
chain.use(async (ctx, next) => {
  console.log('中间件2 开始')
  await next()
  console.log('中间件2 结束')
})
chain.execute({})
```

---

## 六、迭代器模式（Iterator）

### 6.1 定义

提供一种方法顺序访问聚合对象中的元素，而不暴露其内部表示。

### 6.2 实现

```typescript
interface Iterator<T> {
  next(): { value: T | undefined; done: boolean }
  hasNext(): boolean
}

class ArrayIterator<T> implements Iterator<T> {
  private index = 0

  constructor(private collection: T[]) {}

  next() {
    if (this.hasNext()) {
      return { value: this.collection[this.index++], done: false }
    }
    return { value: undefined, done: true }
  }

  hasNext() {
    return this.index < this.collection.length
  }
}

// 使用
const iterator = new ArrayIterator([1, 2, 3])
while (iterator.hasNext()) {
  console.log(iterator.next().value)
}
```

### 6.3 前端应用

```typescript
// ES6 Iterator
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0
    const data = this.data
    return {
      next() {
        return index < data.length
          ? { value: data[index++], done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

for (const item of iterable) {
  console.log(item)  // 1, 2, 3
}

// Generator 函数
function* range(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i
  }
}

for (const num of range(0, 5)) {
  console.log(num)  // 0, 1, 2, 3, 4
}
```

---

## 七、中介者模式（Mediator）

### 7.1 定义

用一个中介对象封装一系列对象交互，使各对象不需要显式地相互引用。

### 7.2 实现

```typescript
// 中介者
class ChatMediator {
  private users: User[] = []

  addUser(user: User) {
    this.users.push(user)
  }

  sendMessage(message: string, sender: User) {
    this.users
      .filter(u => u !== sender)
      .forEach(u => u.receive(message))
  }
}

// 同事对象
class User {
  constructor(private name: string, private mediator: ChatMediator) {
    mediator.addUser(this)
  }

  send(message: string) {
    console.log(`${this.name} 发送: ${message}`)
    this.mediator.sendMessage(message, this)
  }

  receive(message: string) {
    console.log(`${this.name} 收到: ${message}`)
  }
}

// 使用
const mediator = new ChatMediator()
const alice = new User('Alice', mediator)
const bob = new User('Bob', mediator)
alice.send('你好')  // Bob 收到
```

### 7.3 前端应用

```typescript
// 组件通信中介者（如 Redux Store）
class Store {
  private state: any = {}
  private listeners: Function[] = []

  getState() { return this.state }

  dispatch(action: any) {
    this.state = this.reducer(this.state, action)
    this.listeners.forEach(l => l(this.state))
  }

  subscribe(listener: Function) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private reducer(state: any, action: any) {
    // ...
    return state
  }
}
```

---

## 八、其他行为型模式

### 8.1 模板方法模式

```typescript
abstract class DataProcessor {
  // 模板方法（定义算法骨架）
  process() {
    this.read()
    this.validate()
    this.transform()
    this.save()
  }

  protected abstract read(): void
  protected abstract validate(): void

  protected transform() {
    console.log('默认转换')
  }

  protected abstract save(): void
}

class CSVProcessor extends DataProcessor {
  protected read() { console.log('读取 CSV') }
  protected validate() { console.log('验证 CSV') }
  protected save() { console.log('保存 CSV') }
}
```

### 8.2 备忘录模式

```typescript
class EditorMemento {
  constructor(public content: string) {}
}

class Editor {
  content = ''

  save(): EditorMemento {
    return new EditorMemento(this.content)
  }

  restore(memento: EditorMemento) {
    this.content = memento.content
  }
}

// 使用
const editor = new Editor()
editor.content = '版本1'
const saved = editor.save()
editor.content = '版本2'
editor.restore(saved)
console.log(editor.content)  // 版本1
```

### 8.3 访问者模式

```typescript
interface Visitor {
  visitFile(file: FileNode): void
  visitFolder(folder: FolderNode): void
}

abstract class Node {
  abstract accept(visitor: Visitor): void
}

class FileNode extends Node {
  constructor(public name: string) { super() }
  accept(visitor: Visitor) { visitor.visitFile(this) }
}

class FolderNode extends Node {
  children: Node[] = []
  constructor(public name: string) { super() }
  accept(visitor: Visitor) {
    visitor.visitFolder(this)
    this.children.forEach(c => c.accept(visitor))
  }
}

// 使用
class PrintVisitor implements Visitor {
  visitFile(file: FileNode) { console.log(`文件: ${file.name}`) }
  visitFolder(folder: FolderNode) { console.log(`文件夹: ${folder.name}`) }
}
```

---

## 九、总结

### ✅ 行为型模式对比

| 模式       | 意图                   | 前端应用场景               |
| ---------- | ---------------------- | -------------------------- |
| 观察者     | 一对多通知             | 事件系统、状态管理         |
| 策略       | 算法切换               | 表单验证、支付方式         |
| 命令       | 请求封装               | 撤销重做、宏命令           |
| 状态       | 状态驱动行为           | 状态机、订单流程           |
| 责任链     | 链式处理               | 中间件、事件冒泡           |
| 迭代器     | 顺序访问               | for...of、Generator        |
| 中介者     | 集中交互               | Redux、事件总线            |
| 模板方法   | 算法骨架               | 生命周期、数据处理流程     |
| 备忘录     | 状态保存恢复           | 撤销、草稿保存             |
| 访问者     | 操作与结构分离         | AST 遍历、文件系统         |

### 🔜 下一章

- 下一章：[前端应用](/web/architecture/design-patterns/04-frontend-application/)
- 上一章：[结构型模式](/web/architecture/design-patterns/02-structural/)
- 上一级：[设计模式](/web/architecture/design-patterns/)
