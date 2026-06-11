---
title: "手写 `Length<T>` —— 获取元组长度"
---

# 手写 `Length<T>` —— 获取元组长度

```ts
type Length<T extends any[]> = T["length"];
type L = Length<[1, 2, 3]>; // 3
```
