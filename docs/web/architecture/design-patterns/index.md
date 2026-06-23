---
title: 设计模式
---

# 设计模式

> 设计模式是软件设计中常见问题的可复用解决方案。本模块介绍 23 种经典设计模式及其在前端中的应用。

---

## 学习内容

| 章节 | 主题       | 链接                                                              |
| ---- | ---------- | ----------------------------------------------------------------- |
| 01   | 创建型模式 | [创建型模式](/web/architecture/design-patterns/01-creational/)    |
| 02   | 结构型模式 | [结构型模式](/web/architecture/design-patterns/02-structural/)    |
| 03   | 行为型模式 | [行为型模式](/web/architecture/design-patterns/03-behavioral/)    |
| 04   | 前端应用   | [前端应用](/web/architecture/design-patterns/04-frontend-application/) |

---

## 设计模式分类

```
┌─────────────────────────────────────────┐
│           23 种设计模式                 │
├─────────────────────────────────────────┤
│                                         │
│  📦 创建型（5 种）                      │
│  ├── 单例模式 Singleton                 │
│  ├── 工厂方法 Factory Method            │
│  ├── 抽象工厂 Abstract Factory          │
│  ├── 建造者 Builder                     │
│  └── 原型 Prototype                     │
│                                         │
│  🏗️ 结构型（7 种）                      │
│  ├── 适配器 Adapter                     │
│  ├── 桥接 Bridge                        │
│  ├── 组合 Composite                     │
│  ├── 装饰器 Decorator                   │
│  ├── 外观 Facade                        │
│  ├── 享元 Flyweight                     │
│  └── 代理 Proxy                         │
│                                         │
│  🔄 行为型（11 种）                     │
│  ├── 责任链 Chain of Responsibility     │
│  ├── 命令 Command                       │
│  ├── 解释器 Interpreter                 │
│  ├── 迭代器 Iterator                    │
│  ├── 中介者 Mediator                    │
│  ├── 备忘录 Memento                     │
│  ├── 观察者 Observer                    │
│  ├── 状态 State                         │
│  ├── 策略 Strategy                      │
│  ├── 模板方法 Template Method           │
│  └── 访问者 Visitor                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 设计模式六大原则

| 原则       | 全称                          | 说明                                       |
| ---------- | ----------------------------- | ------------------------------------------ |
| SRP        | 单一职责原则 Single Responsibility Principle | 一个类只负责一个职责           |
| OCP        | 开闭原则 Open/Closed Principle | 对扩展开放，对修改关闭                     |
| LSP        | 里氏替换原则 Liskov Substitution Principle | 子类可以替换父类               |
| ISP        | 接口隔离原则 Interface Segregation Principle | 接口要细化，不要臃肿的接口     |
| DIP        | 依赖倒置原则 Dependency Inversion Principle | 依赖抽象而非具体实现           |
| LoD        | 迪米特法则 Law of Demeter     | 最少知识原则，只与直接朋友通信             |

---

## 下一章

开始学习：[创建型模式](/web/architecture/design-patterns/01-creational/)
