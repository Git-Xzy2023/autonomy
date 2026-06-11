---
title: "`esModuleInterop` 解决了什么问题？"
---

# `esModuleInterop` 解决了什么问题？

```ts
// 没有 esModuleInterop 时：
// import React from "react" 会报错（因为 React 是 CommonJS 模块，没有 default export）
// 必须写成 import * as React from "react"

// 开启 esModuleInterop 后：
import React from "react"; // ✅ 可以正常写
// TS 编译时会自动生成兼容代码（通过 __importDefault 辅助函数处理 default export）
```
