---
title: "泛型函数的类型推断 —— `infer` 的前置理解"
---

# 泛型函数的类型推断 —— `infer` 的前置理解

```ts
// 从函数参数或返回值提取类型
function process<T>(data: T[]): T {
  return data[0];
}
const str = process(["a", "b"]); // str: string
```
