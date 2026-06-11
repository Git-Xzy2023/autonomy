---
title: "模板字面量类型（Template Literal Types）"
---

# 模板字面量类型（Template Literal Types）

**Q21: 什么是模板字面量类型？** (TS 4.1+)

基于字符串字面量类型，通过模板字符串语法组合出更复杂的字符串类型：

```ts
type Greeting = `Hello, ${string}`;
const g1: Greeting = "Hello, World"; // ✅
const g2: Greeting = "Hi, World"; // ❌

// 与联合类型结合会产生笛卡尔积
type Direction = "top" | "bottom";
type Alignment = "left" | "right";
type Pos = `${Direction}-${Alignment}`;
// => "top-left" | "top-right" | "bottom-left" | "bottom-right"

// TS 内置的字符串操作类型
type S = "hello";
type U = Uppercase<S>; // "HELLO"
type L = Lowercase<"HELLO">; // "hello"
type C = Capitalize<"hello">; // "Hello"
type Uc = Uncapitalize<"Hello">; // "hello"
```

**实战：类型安全的事件名**

```ts
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"

// 为对象生成事件处理器
type EventHandlers<T extends string[]> = {
  [K in T[number] as `on${Capitalize<K>}`]?: () => void;
};
type Handlers = EventHandlers<["click", "hover", "focus"]>;
// { onClick?: () => void; onHover?: () => void; onFocus?: () => void }
```

---
