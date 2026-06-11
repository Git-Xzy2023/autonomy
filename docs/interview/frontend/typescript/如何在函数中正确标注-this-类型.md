---
title: "如何在函数中正确标注 `this` 类型？"
---

# 如何在函数中正确标注 `this` 类型？

TS 允许在函数参数列表的**第一个位置**声明 `this` 参数，它只在**编译期用于类型检查**，不会出现在运行时的参数列表中：

```ts
interface HTMLElement {
  id: string;
  addEventListener(
    type: string,
    handler: (this: HTMLElement, e: Event) => void,
  ): void;
}

const el: HTMLElement = { id: "myBtn", addEventListener() {} };
el.addEventListener("click", function (e) {
  // 这里 this 被标注为 HTMLElement
  console.log(this.id); // ✅
  this.foo(); // ❌ HTMLElement 没有 foo 方法
});

// 箭头函数不能声明 this（因为箭头函数没有自己的 this）
```
