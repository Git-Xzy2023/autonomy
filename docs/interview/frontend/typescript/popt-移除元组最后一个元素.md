---
title: "`Pop<T>` —— 移除元组最后一个元素"
---

# `Pop<T>` —— 移除元组最后一个元素

```ts
type Pop<T extends any[]> = T extends [...infer R, any] ? R : [];
type P = Pop<[1, 2, 3]>; // [1, 2]
```
