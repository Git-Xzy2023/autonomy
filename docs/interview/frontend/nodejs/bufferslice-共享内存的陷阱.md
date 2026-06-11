---
title: "Buffer.slice 共享内存的陷阱"
---

# Buffer.slice 共享内存的陷阱

```js
const a = Buffer.from("Hello");
const b = a.slice(0, 2); // b 指向 a 的同一块内存！
b[0] = 0x4a; // 'J'
console.log(a.toString()); // 'Jello'   a 也被改了！
```

Node.js 20+ 提供 `subarray`（共享）和 `subarray` 显式语义。需要独立副本时用 `Buffer.from(buf)`。
